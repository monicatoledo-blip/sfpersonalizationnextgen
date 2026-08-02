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
// still references it, so order matters.

const p13n = require('./p13n');

const DRY_RUN = String(process.env.CLEANUP_DRY_RUN || '').toLowerCase() === 'true';

// artifacts: sf_artifacts JSON from deploy.js:
//   { schemas:[{name,id}], transformers:[{name,id}], pps:[{name,id,zone}], ... }
// Returns { mode, removed:[], orphans:[], dryRun }.
async function cleanup(conn, artifacts) {
  const removed = [];
  const orphans = [];

  const pps = (artifacts && artifacts.pps) || [];
  const transformers = (artifacts && artifacts.transformers) || [];
  const schemas = (artifacts && artifacts.schemas) || [];

  // Ordered list of [type, deleteFn, ref] to attempt.
  const targets = [
    ...pps.map((p) => ['PersonalizationPoint', p13n.deletePoint, p.id || p.name]),
    ...transformers.map((t) => ['Transformer', p13n.deleteTransformer, t.id || t.name]),
    ...schemas.map((s) => ['PersonalizationSchema', p13n.deleteSchema, s.id || s.name]),
  ].filter(([, , ref]) => ref);

  for (const [type, fn, ref] of targets) {
    if (DRY_RUN) {
      removed.push({ type, ref, dryRun: true });
      continue;
    }
    try {
      await fn(conn, ref);
      removed.push({ type, ref });
    } catch (err) {
      orphans.push({ type, ref, reason: err.message });
    }
  }

  const mode = orphans.length ? 'partial' : 'complete';
  return { mode, removed, orphans, dryRun: DRY_RUN };
}

module.exports = { cleanup };
