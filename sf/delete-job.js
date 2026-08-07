'use strict';

// Step-driven delete. Deleting a demo's SP objects can't finish in one web
// request: after PPs + transformers are gone, the schemas they referenced keep
// returning DEPENDENCY_EXISTS for MINUTES (the org's dependency index lags).
//
// Rather than a fire-and-forget background task (which dies when the web dyno
// sleeps/restarts), each call to stepDelete() does ONE bounded pass and returns.
// The browser's Manage Demos poll (every few seconds) drives it forward, and
// ALL progress lives in the DB (sf_artifacts._delete) — so a sleep/restart just
// resumes on the next poll. No worker dyno, nothing to keep alive.
//
// Order (proven against the SDO): PPs -> transformers -> schemas. Each pass
// deletes whatever is still outstanding; schemas that hit DEPENDENCY_EXISTS are
// left pending and retried on the next step. Never reports success while any
// object remains.

const db = require('../db');
const { connectionFromRow } = require('./client');
const p13n = require('./p13n');

// Cap work per step so a single pass stays well under any request timeout even
// with many objects. Most demos have 4 PPs + 4 transformers + 4 schemas.
const MAX_DELETES_PER_STEP = 12;

// A schema that has hit DEPENDENCY_EXISTS this many steps in a row is reported
// as a manual-cleanup orphan. The dependency-index lag is intermittent and has
// been observed as long as ~5+ minutes live; at ~3s/poll, 200 attempts ≈ 10 min
// of retrying, comfortably past observed lag before we call it a real orphan.
const MAX_SCHEMA_ATTEMPTS = 200;

// "Already gone" = the object we tried to delete doesn't exist (a prior run /
// manual cleanup removed it). Treat as success, not an orphan. Check the
// flattened message AND the raw jsforce error (status 404, errorCode NOT_FOUND
// / INVALID_API_INPUT) — the message alone sometimes doesn't carry the body.
// "Already gone" signatures. Deleting a Personalization object that no longer
// exists returns DIFFERENT errors depending on how it's referenced:
//   - by a stale id  -> INVALID_CROSS_REFERENCE_KEY / "invalid cross reference id"
//   - by name        -> INVALID_API_INPUT / "could not find"
//   - other paths    -> NOT_FOUND / 404 / "does not exist"
// All mean the same thing for teardown: success, not an orphan.
const GONE_RE = /not.?found|does not exist|no resource found|NOT_FOUND|INVALID_API_INPUT|could not find|invalid cross.?reference|INVALID_CROSS_REFERENCE_KEY/i;
function isAlreadyGone(err) {
  const msg = String((err && err.message) || err || '');
  if (GONE_RE.test(msg)) return true;
  const cause = err && err.cause;
  if (cause) {
    if (cause.statusCode === 404 || cause.status === 404) return true;
    if (['NOT_FOUND', 'INVALID_API_INPUT', 'INVALID_CROSS_REFERENCE_KEY'].includes(cause.errorCode)) return true;
    const body = cause.content || cause.body;
    const arr = Array.isArray(body) ? body : (body ? [body] : []);
    if (arr.some((e) => GONE_RE.test(String((e && (e.errorCode || e.message)) || '')))) return true;
  }
  return false;
}
function isDependency(err) {
  const msg = String((err && err.message) || err || '');
  if (/DEPENDENCY_EXISTS|referenced/i.test(msg)) return true;
  const cause = err && err.cause;
  const body = cause && (cause.content || cause.body);
  const arr = Array.isArray(body) ? body : (body ? [body] : []);
  return arr.some((e) => /DEPENDENCY_EXISTS|referenced/i.test(String((e && (e.errorCode || e.message)) || '')));
}

// Normalize artifacts to arrays regardless of wrapper shape.
function readArtifacts(raw) {
  const a = (raw && raw.artifacts) || raw || {};
  return {
    pps: a.pps || [],
    transformers: a.transformers || [],
    schemas: a.schemas || [],
    connector: a.connector || (a.artifacts && a.artifacts.connector) || null,
  };
}

// Extract a bare connector UUID from either a UUID or a pasted beacon URL.
function connectorId(raw) {
  const m = String(raw || '').match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
  return m ? m[0] : null;
}

const refOf = (o) => o.id || o.name;

// Build a fresh progress object from the artifacts (first step only).
function initProgress(row) {
  const { pps, transformers, schemas, connector } = readArtifacts(row.sf_artifacts);
  const now = new Date().toISOString();
  return {
    state: 'running',
    startedAt: now,
    updatedAt: now,
    total: pps.length + transformers.length + schemas.length,
    connector: connectorId(connector),
    // Experience configs (WPM-authored) are discovered on the first step (needs
    // a live connection). null = not yet discovered; [] = none / done.
    experienceConfigs: null,
    // Work queues by type; each entry { ref, attempts }.
    queue: {
      pps: pps.map((p) => ({ ref: refOf(p) })).filter((x) => x.ref),
      transformers: transformers.map((t) => ({ ref: refOf(t) })).filter((x) => x.ref),
      schemas: schemas.map((s) => ({ ref: refOf(s), attempts: 0 })).filter((x) => x.ref),
    },
    removed: [],
    orphans: [],
    message: 'Removing Personalization objects…',
  };
}

// Run ONE bounded step of the teardown for a deployment row. Reads current
// progress from the row (or initializes it), deletes what it can this pass,
// persists progress, and returns { done, progress }. `done` is true when the
// teardown has reached a terminal state (complete or incomplete).
async function stepDelete(row) {
  const id = row.id;
  const existing = row.sf_artifacts && row.sf_artifacts._delete;
  // Migrate/initialize: if there's no queue yet, build one from artifacts. This
  // also recovers demos started under the old runner (they have _delete but no
  // queue) by rebuilding from the still-recorded artifacts.
  const prog = existing && existing.queue ? existing : initProgress(row);

  if (prog.state === 'complete' || prog.state === 'incomplete') {
    return { done: true, progress: prog };
  }

  const connRow = await db.getSfConnection(row.user_id, row.sf_connection_id);
  if (!connRow) {
    const finished = {
      ...prog, state: 'complete', updatedAt: new Date().toISOString(),
      queue: { pps: [], transformers: [], schemas: [] },
      message: 'No connected org for this demo — hosted page removed; no org objects to delete.',
    };
    await db.setDeleteProgress(id, finished);
    await db.setDeploymentStatus(id, 'deleted');
    return { done: true, progress: finished };
  }

  const conn = connectionFromRow(connRow);
  let budget = MAX_DELETES_PER_STEP;

  const attempt = async (type, fn, ref) => {
    try {
      await fn(conn, ref);
      prog.removed.push({ type, ref });
      return 'removed';
    } catch (err) {
      if (isAlreadyGone(err)) { prog.removed.push({ type, ref, alreadyGone: true }); return 'removed'; }
      // Diagnostic: log the exact error shape so we can see WHY a delete wasn't
      // classified as already-gone/dependency (message + cause statusCode/body).
      const cause = err && err.cause;
      console.warn('[delete-job] non-gone delete error', JSON.stringify({
        type, ref, message: err && err.message,
        causeStatus: cause && (cause.statusCode || cause.status),
        causeErrorCode: cause && cause.errorCode,
        causeBody: cause && (cause.content || cause.body),
      }));
      // Carry both the message (for display) and the raw error (for accurate
      // dependency classification against .cause).
      return { reason: err.message, err };
    }
  };

  // Phase 0: WPM experience configs. If the SE authored in WPM, each PP has an
  // experience config that BLOCKS the PP delete. Discover them once (needs the
  // connector + a live connection), then delete before touching PPs. Best-effort
  // discovery: if we can't list (no connector, endpoint absent), skip to PPs and
  // let any block surface as an orphan.
  const cId = prog.connector;
  if (prog.experienceConfigs === null) {
    const found = [];
    if (cId) {
      const ppNames = readArtifacts(row.sf_artifacts).pps.map(refOf).filter(Boolean);
      for (const ppName of ppNames) {
        const configs = await p13n.listExperienceConfigs(conn, cId, { personalizationPointNameOrId: ppName });
        for (const c of configs) {
          const ref = c.name || c.id;
          if (ref && !found.some((f) => f.ref === ref)) found.push({ ref });
        }
      }
    }
    prog.experienceConfigs = found;
    if (found.length) prog.total += found.length;
  }
  {
    const stillStuck = [];
    for (const item of prog.experienceConfigs) {
      if (budget <= 0) { stillStuck.push(item); continue; }
      let r;
      try {
        await p13n.deleteExperienceConfig(conn, cId, item.ref);
        prog.removed.push({ type: 'WPM Experience', ref: item.ref });
        r = 'removed';
      } catch (err) {
        if (isAlreadyGone(err)) { prog.removed.push({ type: 'WPM Experience', ref: item.ref, alreadyGone: true }); r = 'removed'; }
        else r = { reason: err.message, err };
      }
      budget -= 1;
      if (r === 'removed') continue;
      const attempts = (item.attempts || 0) + 1;
      if (isDependency(r.err) && attempts < MAX_SCHEMA_ATTEMPTS) stillStuck.push({ ref: item.ref, attempts });
      else prog.orphans.push({ type: 'WPM Experience', ref: item.ref, reason: r.reason });
    }
    prog.experienceConfigs = stillStuck;
  }

  // Drain one queue with RETRY semantics: a dependency error (something else
  // still references it — the org's index lags after the referencing object was
  // just deleted) keeps the item queued for a later step; only a non-dependency
  // error, or exhausting MAX_ATTEMPTS, marks it a real orphan. This is why an
  // earlier version wrongly gave up: it orphaned PPs/transformers after ONE
  // failed attempt instead of retrying the lag like schemas do.
  const drain = async (type, fn, queueName) => {
    const stillStuck = [];
    for (const item of prog.queue[queueName]) {
      if (budget <= 0) { stillStuck.push(item); continue; }
      const r = await attempt(type, fn, item.ref);
      budget -= 1;
      if (r === 'removed') continue;
      const attempts = (item.attempts || 0) + 1;
      if (isDependency(r.err) && attempts < MAX_SCHEMA_ATTEMPTS) {
        stillStuck.push({ ref: item.ref, attempts });
      } else {
        prog.orphans.push({
          type, ref: item.ref,
          reason: isDependency(r.err) ? 'DEPENDENCY_EXISTS after retries' : r.reason,
        });
      }
    }
    prog.queue[queueName] = stillStuck;
  };

  // Phase 1: PPs (frees schema refs + nested decisions). Only after configs.
  if (!prog.experienceConfigs.length) await drain('PersonalizationPoint', p13n.deletePoint, 'pps');

  // Phase 2: transformers (only after all PPs are cleared).
  if (!prog.experienceConfigs.length && !prog.queue.pps.length) {
    await drain('Experience Template', p13n.deleteTransformer, 'transformers');
  }

  // Phase 3: schemas (only after configs + PPs + transformers are gone). Same
  // retry-on-dependency semantics — schema deletes lag behind PP/transformer
  // deletes (the org's dependency index releases minutes later).
  if (!prog.experienceConfigs.length && !prog.queue.pps.length && !prog.queue.transformers.length) {
    await drain('Content Schema', p13n.deleteSchema, 'schemas');
  }

  // Compute terminal / running state + a human message.
  const ecOutstanding = (prog.experienceConfigs || []).length;
  const outstanding = ecOutstanding + prog.queue.pps.length + prog.queue.transformers.length + prog.queue.schemas.length;
  prog.updatedAt = new Date().toISOString();

  if (outstanding === 0) {
    const clean = prog.orphans.length === 0;
    prog.state = clean ? 'complete' : 'incomplete';
    prog.message = clean
      ? `Fully deleted — removed ${prog.removed.length} object(s) from the org.`
      : `${prog.orphans.length} object(s) could not be removed and were left in the org. Verify/remove manually: ` +
        prog.orphans.map((o) => `${o.type} ${o.ref}`).join(', ');
    await db.setDeleteProgress(id, prog);
    await db.setDeploymentStatus(id, clean ? 'deleted' : 'active');
    return { done: true, progress: prog };
  }

  // Still running: describe the current phase.
  if (ecOutstanding) prog.message = `Removing WPM experiences (${ecOutstanding} left)…`;
  else if (prog.queue.pps.length) prog.message = `Removing Personalization Points (${prog.queue.pps.length} left)…`;
  else if (prog.queue.transformers.length) prog.message = `Removing Experience Templates (${prog.queue.transformers.length} left)…`;
  else prog.message = `Waiting for ${prog.queue.schemas.length} schema dependency(ies) to release…`;
  await db.setDeleteProgress(id, prog);
  return { done: false, progress: prog };
}

module.exports = { stepDelete, initProgress };
