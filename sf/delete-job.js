'use strict';

// Background delete runner. Deleting a demo's SP objects can't finish inside a
// web request: after PPs + transformers are gone, the schemas they referenced
// keep returning DEPENDENCY_EXISTS for MINUTES (the org's dependency index lags
// behind the actual deletes). So we run the teardown asynchronously, retrying
// the stuck schemas with backoff, and persist progress to the DB for the UI to
// poll.
//
// Order (proven against the SDO): PPs -> transformers -> schemas. Schemas are
// retried on a delay because of the lag above. Never reports success while any
// object remains — surfaces exactly what's left for manual cleanup.

const db = require('../db');
const { connectionFromRow } = require('./client');
const p13n = require('./p13n');

// Retry schedule for stuck schemas (ms since the transformer/PP deletes). The
// index lag has been observed in the minutes range, so we spread attempts over
// ~10 minutes rather than hammering immediately (which never succeeds).
const SCHEMA_RETRY_DELAYS_MS = [
  15 * 1000, 30 * 1000, 60 * 1000, 90 * 1000,
  120 * 1000, 120 * 1000, 120 * 1000, 180 * 1000,
];

// In-memory guard so the same demo isn't torn down by two overlapping runs
// (e.g. an impatient double-click). Best-effort; the DB status is the source of
// truth across dynos.
const inFlight = new Set();

function isAlreadyGone(msg) {
  return /not.?found|does not exist|no resource found|NOT_FOUND|INVALID_API_INPUT/i.test(String(msg || ''));
}
function isDependency(msg) {
  return /DEPENDENCY_EXISTS|referenced/i.test(String(msg || ''));
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Normalize artifacts to arrays regardless of wrapper shape.
function readArtifacts(raw) {
  const a = (raw && raw.artifacts) || raw || {};
  return {
    pps: a.pps || [],
    transformers: a.transformers || [],
    schemas: a.schemas || [],
  };
}

// Start (or resume) an async delete for a deployment row. Returns immediately
// with the initial progress; the teardown continues in the background.
function startDelete(row) {
  const id = row.id;
  const { pps, transformers, schemas } = readArtifacts(row.sf_artifacts);
  const total = pps.length + transformers.length + schemas.length;

  const progress = {
    state: 'running',
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    total,
    removed: [],
    pending: [
      ...pps.map((p) => ({ type: 'PersonalizationPoint', ref: p.id || p.name })),
      ...transformers.map((t) => ({ type: 'Experience Template', ref: t.id || t.name })),
      ...schemas.map((s) => ({ type: 'Content Schema', ref: s.id || s.name })),
    ],
    orphans: [],
    message: 'Removing Personalization objects…',
  };

  if (inFlight.has(id)) return progress; // already running in this process
  inFlight.add(id);

  // Persist the initial progress right away so the first poll shows the bar,
  // then fire-and-forget the teardown (all further state lives in the DB).
  const startedAt = progress.startedAt;
  db.setDeleteProgress(id, progress)
    .then(() => run(row, { pps, transformers, schemas, total, startedAt }))
    .catch((err) => console.error(`[delete-job] ${id} crashed`, err && err.message))
    .finally(() => inFlight.delete(id));

  return progress;
}

async function run(row, { pps, transformers, schemas, total, startedAt }) {
  const id = row.id;
  const connRow = await db.getSfConnection(row.user_id, row.sf_connection_id);

  const removed = [];
  const orphans = [];
  const save = (extra = {}) =>
    db.setDeleteProgress(id, {
      state: 'running',
      startedAt: startedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      total,
      removed,
      orphans,
      ...extra,
    });

  // No connection recorded -> can't touch the org; treat as clean (nothing we
  // can remove) but tell the truth in the message.
  if (!connRow) {
    await db.setDeleteProgress(id, {
      state: 'complete', updatedAt: new Date().toISOString(), total,
      removed, orphans, pending: [],
      message: 'No connected org for this demo — hosted page removed; no org objects to delete.',
    });
    await db.setDeploymentStatus(id, 'deleted');
    return;
  }

  const conn = connectionFromRow(connRow);

  // Helper: attempt one delete. Returns true if gone (or already gone).
  const attempt = async (type, fn, ref) => {
    if (!ref) return true;
    try {
      await fn(conn, ref);
      removed.push({ type, ref });
      return true;
    } catch (err) {
      if (isAlreadyGone(err.message)) { removed.push({ type, ref, alreadyGone: true }); return true; }
      return { type, ref, reason: err.message };
    }
  };

  // Pass 1: PPs (removes nested decisions) then transformers. These clear the
  // references that block schema deletion.
  for (const p of pps) {
    const r = await attempt('PersonalizationPoint', p13n.deletePoint, p.id || p.name);
    if (r !== true) orphans.push(r);
    await save({ pending: remaining(schemas, removed, orphans), message: 'Removing Personalization Points…' });
  }
  for (const t of transformers) {
    const r = await attempt('Experience Template', p13n.deleteTransformer, t.id || t.name);
    if (r !== true) orphans.push(r);
    await save({ pending: remaining(schemas, removed, orphans), message: 'Removing Experience Templates…' });
  }

  // Pass 2: schemas, retried with backoff because the dependency index lags for
  // minutes after the referencing PP/transformer are deleted.
  let stuck = schemas.map((s) => s.id || s.name).filter(Boolean);
  for (let attemptIdx = 0; attemptIdx <= SCHEMA_RETRY_DELAYS_MS.length && stuck.length; attemptIdx += 1) {
    const stillStuck = [];
    for (const ref of stuck) {
      const r = await attempt('Content Schema', p13n.deleteSchema, ref);
      if (r === true) continue;
      // Only keep retrying dependency errors; anything else is a real orphan.
      if (isDependency(r.reason)) stillStuck.push(ref);
      else orphans.push(r);
    }
    stuck = stillStuck;
    await save({
      pending: stuck.map((ref) => ({ type: 'Content Schema', ref })),
      message: stuck.length
        ? `Waiting for ${stuck.length} schema dependency(ies) to release…`
        : 'Finishing up…',
    });
    if (stuck.length && attemptIdx < SCHEMA_RETRY_DELAYS_MS.length) {
      await sleep(SCHEMA_RETRY_DELAYS_MS[attemptIdx]);
    }
  }

  // Any schema still stuck after all retries becomes an orphan (honest report).
  for (const ref of stuck) {
    orphans.push({ type: 'Content Schema', ref, reason: 'DEPENDENCY_EXISTS after retries' });
  }

  const clean = orphans.length === 0;
  await db.setDeleteProgress(id, {
    state: clean ? 'complete' : 'incomplete',
    updatedAt: new Date().toISOString(),
    total, removed, orphans, pending: [],
    message: clean
      ? `Fully deleted — removed ${removed.length} object(s) from the org.`
      : `${orphans.length} object(s) could not be removed and were left in the org. Verify/remove manually: ` +
        orphans.map((o) => `${o.type} ${o.ref}`).join(', '),
  });
  // Only mark the demo deleted (removing it from the list) if the org is clean.
  // Otherwise keep it as 'active' so the SE can retry from the UI.
  await db.setDeploymentStatus(id, clean ? 'deleted' : 'active');
}

// Schemas not yet removed/orphaned — for the pending list during passes 1-2.
function remaining(schemas, removed, orphans) {
  const done = new Set([...removed, ...orphans].map((x) => x.ref));
  return schemas
    .map((s) => s.id || s.name)
    .filter((ref) => ref && !done.has(ref))
    .map((ref) => ({ type: 'Content Schema', ref }));
}

module.exports = { startDelete };
