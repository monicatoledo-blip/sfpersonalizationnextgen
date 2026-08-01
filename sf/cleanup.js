'use strict';

// Reverse of sf/deploy.js — removes the Personalization objects a deployment
// created in the connected SDO.
//
// Safety rules (from feedback_demo_constraints + feedback_ask_before_delete):
//   - Only ever touch objects this app created, identified by fullName/id captured
//     in deployments.sf_artifacts. Never delete shared/standard org artifacts
//     (email PPs, the Profile Data Graph).
//   - PersonalizationPoint/Schema may be deletable=false via REST; use Metadata
//     API destructiveChanges. If a component can't be removed, record it as an
//     orphan so Manage Demos can flag "manual cleanup required".

// artifacts: the deployment's sf_artifacts JSON, shape produced by deploy.js:
//   { schemas:[{fullName,id?}], pps:[{fullName,id?}], decisions:[{id?}] }
// Returns { removed:[], orphans:[], mode }.
async function cleanup(conn, artifacts) {
  const removed = [];
  const orphans = [];

  const schemas = (artifacts && artifacts.schemas) || [];
  const pps = (artifacts && artifacts.pps) || [];
  const decisions = (artifacts && artifacts.decisions) || [];

  // Delete order is the reverse of create: decisions -> PPs -> schemas.
  // Decisions may be standard-REST deletable; try that first.
  for (const d of decisions) {
    if (!d.id) continue;
    try {
      await conn.sobject('PersonalizationDecision').destroy(d.id);
      removed.push({ type: 'PersonalizationDecision', id: d.id });
    } catch (err) {
      orphans.push({ type: 'PersonalizationDecision', id: d.id, reason: err.message });
    }
  }

  // PPs + schemas go through Metadata API destructiveChanges (they are not
  // deletable via standard REST). Build the fullName list and, once the metadata
  // path is verified against a real org, submit a destructive deploy.
  const destructive = {
    PersonalizationPoint: pps.map((p) => p.fullName).filter(Boolean),
    PersonalizationSchema: schemas.map((s) => s.fullName).filter(Boolean),
  };

  const hasMetaTargets =
    destructive.PersonalizationPoint.length || destructive.PersonalizationSchema.length;

  if (hasMetaTargets) {
    // Gated identically to deploy(): return the destructive plan; the caller
    // marks the DB row deleted and surfaces these as "pending org removal" until
    // the Metadata destructiveChanges path is unblocked (handoff stop-and-ask).
    for (const [type, names] of Object.entries(destructive)) {
      for (const fullName of names) {
        orphans.push({ type, fullName, reason: 'pending_metadata_destructive_deploy' });
      }
    }
    return { mode: 'partial', removed, orphans, destructive };
  }

  return { mode: 'complete', removed, orphans };
}

module.exports = { cleanup };
