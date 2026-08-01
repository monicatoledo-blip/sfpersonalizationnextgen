'use strict';

// Auto-cleanup worker. Periodically finds deployments whose expires_at has passed
// and tears them down: reverse the SDO deploy, then mark the row deleted.
//
// Runs as a Heroku `worker` dyno (Procfile) or via Heroku Scheduler (one tick).
// SAFETY: per feedback_ask_before_delete, do NOT enable this against a real org
// until Monica has watched one dry run. Set CLEANUP_DRY_RUN=true to log intended
// deletions without touching the org or the DB.

const db = require('../db');
const { connectionFromRow } = require('../sf/client');
const { cleanup } = require('../sf/cleanup');

const INTERVAL_MS = Number(process.env.CLEANUP_INTERVAL_MS || 15 * 60 * 1000); // 15 min
const DRY_RUN = process.env.CLEANUP_DRY_RUN === 'true';

async function tick() {
  let expired;
  try {
    expired = await db.listExpiredDeployments();
  } catch (err) {
    console.error('[cleanup] failed to query expired deployments', err.message);
    return;
  }

  if (!expired.length) {
    console.log('[cleanup] nothing to expire');
    return;
  }

  console.log(`[cleanup] ${expired.length} expired deployment(s) found${DRY_RUN ? ' (DRY RUN)' : ''}`);

  for (const row of expired) {
    if (DRY_RUN) {
      console.log(
        `[cleanup] DRY RUN would remove deployment ${row.id} "${row.name}" (expired ${row.expires_at})`
      );
      continue;
    }
    try {
      const connRow = await db.getSfConnection(row.user_id, row.sf_connection_id);
      if (connRow) {
        const conn = connectionFromRow(connRow);
        const result = await cleanup(conn, row.sf_artifacts);
        console.log(`[cleanup] ${row.id} org teardown: ${result.mode}`);
      }
      await db.updateDeployment(row.user_id, row.id, { status: 'deleted' });
      console.log(`[cleanup] ${row.id} marked deleted`);
    } catch (err) {
      console.error(`[cleanup] failed to clean deployment ${row.id}`, err.message);
    }
  }
}

async function main() {
  console.log(
    `[cleanup] worker starting; interval=${INTERVAL_MS}ms dryRun=${DRY_RUN}`
  );
  await tick();
  setInterval(() => {
    tick().catch((err) => console.error('[cleanup] tick error', err));
  }, INTERVAL_MS);
}

if (require.main === module) main();

module.exports = { tick };
