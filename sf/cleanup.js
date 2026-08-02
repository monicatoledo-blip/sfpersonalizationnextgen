'use strict';

// Reverse of sf/deploy.js — removes the Personalization objects a deployment
// created in the connected SDO, via the Personalization Connect REST API.
//
// Safety rules (feedback_demo_constraints + feedback_ask_before_delete):
//   - Only ever touch objects THIS app created, identified by the name/id
//     captured in deployments.sf_artifacts. Never delete shared/standard org
//     artifacts (email PPs, the Profile Data Graph, hand-built transformers).
//   - Set CLEANUP_DRY_RUN=true to log what WOULD be deleted without deleting.
//
// Delete order is the reverse of create: PPs (removes nested decisions) ->
// transformers -> schemas. A schema can't be deleted while a PP/transformer
// still references it (Connect returns DEPENDENCY_EXISTS), so order matters AND
// we retry schemas in a second pass in case a dependency was only just removed.

const p13n = require('./p13n');

const DRY_RUN = String(process.env.CLEANUP_DRY_RUN || '').toLowerCase() === 'true';

// A "not found" on delete means it's already gone — treat as success, not orphan.
function isAlreadyGone(msg) {
  return /not.?found|does not exist|no resource found|NOT_FOUND/i.test(String(msg || ''));
}

// artifacts: sf_artifacts JSON from deploy.js:
//   { schemas:[{name,id}], transformers:[{name,id}], pps:[{name,id,zone}], ... }
// Returns { mode:'complete'|'partial'|'dry_run', removed:[], orphans:[], dryRun }.
async function cleanup(conn, artifactsRaw) {
  const removed = [];
  const orphans = [];

  // Tolerate both shapes: the artifacts object itself, or an older wrapper that
  // nested them under `.artifacts` (deploy result { mode, dcTse, artifacts }).
  const artifacts = (artifactsRaw && artifactsRaw.artifacts) || artifactsRaw || {};
  const pps = artifacts.pps || [];
  const transformers = artifacts.transformers || [];
  const schemas = artifacts.schemas || [];

  // Attempt one delete; record removed / already-gone / orphan.
  async function attempt(type, fn, ref) {
    if (!ref) return true;
    if (DRY_RUN) { removed.push({ type, ref, dryRun: true }); return true; }
    try {
      await fn(conn, ref);
      removed.push({ type, ref });
      return true;
    } catch (err) {
      if (isAlreadyGone(err.message)) { removed.push({ type, ref, alreadyGone: true }); return true; }
      return { type, ref, reason: err.message };
    }
  }

  // Pass 1: PPs (frees schema references), then transformers.
  for (const p of pps) {
    const r = await attempt('PersonalizationPoint', p13n.deletePoint, p.id || p.name);
    if (r !== true) orphans.push(r);
  }
  for (const t of transformers) {
    const r = await attempt('Experience Template', p13n.deleteTransformer, t.id || t.name);
    if (r !== true) orphans.push(r);
  }

  // Pass 2: schemas. Retry once if the first attempt hits a lingering
  // dependency (a PP/template reference that was only just removed).
  const schemaFails = [];
  for (const s of schemas) {
    const r = await attempt('PersonalizationSchema', p13n.deleteSchema, s.id || s.name);
    if (r !== true) schemaFails.push({ s, r });
  }
  for (const { s, r } of schemaFails) {
    if (!DRY_RUN && /DEPENDENCY_EXISTS|referenced/i.test(r.reason || '')) {
      const retry = await attempt('PersonalizationSchema', p13n.deleteSchema, s.id || s.name);
      if (retry !== true) orphans.push(retry);
    } else {
      orphans.push(r);
    }
  }

  const mode = DRY_RUN ? 'dry_run' : orphans.length ? 'partial' : 'complete';
  return { mode, removed, orphans, dryRun: DRY_RUN };
}

module.exports = { cleanup };
