'use strict';

// Deployment CRUD. Session-scoped to the authenticated SE.
//   POST   /api/deployments        create: build HTML, (gated) deploy SP objects, host URL
//   GET    /api/deployments        list the SE's demos
//   GET    /api/deployments/:id    full row for edit re-hydration
//   PUT    /api/deployments/:id    regenerate HTML + update SP records
//   DELETE /api/deployments/:id    reverse deploy in SDO, mark row deleted

const express = require('express');
const db = require('../db');
const { requireAuth } = require('../auth/google');
const { connectionFromRow } = require('../sf/client');
const build = require('../html/build');
const { injectSdk, buildConnectorSitemap } = require('../html/inject-sdk');
const deployer = require('../sf/deploy');
const { cleanup } = require('../sf/cleanup');

const router = express.Router();
router.use(requireAuth);

const EXPIRY_MS = {
  never: null,
  '6h': 6 * 3600e3,
  '24h': 24 * 3600e3,
  '3d': 3 * 24 * 3600e3,
  '7d': 7 * 24 * 3600e3,
};

// Compute expires_at from a preset key. Uses request receipt time.
function expiresAtFrom(presetKey) {
  const delta = EXPIRY_MS[presetKey];
  if (!delta) return null;
  return new Date(Date.now() + delta);
}

// POST /api/deployments
router.post('/', async (req, res, next) => {
  try {
    const { name, industry, formData, connectionId, expiry, uploadedHtml, profileDataGraphName, dataSpaceName, connector } = req.body || {};
    if (!name || !connectionId) {
      return res.status(400).json({ error: 'name and connectionId are required' });
    }

    const connRow = await db.getSfConnection(req.user.id, connectionId);
    if (!connRow) return res.status(404).json({ error: 'connection_not_found' });

    // 1. Source the HTML. Either the SE brought their own downloaded file
    //    (uploadedHtml) or we render it from the form config. Downloaded files
    //    from the Experience Generator are self-contained and have the content
    //    zone surfaces but NOT the Data Cloud SDK, so we inject the SDK either way.
    let baseHtml;
    if (uploadedHtml && uploadedHtml.trim()) {
      if (!/warm-homepage-section|floating-cards-container|cat-hero/.test(uploadedHtml)) {
        return res.status(400).json({
          error: 'uploaded_html_missing_zones',
          detail:
            'This file does not look like an Adaptive Web export — the expected content zones were not found. Upload the HTML downloaded from the Experience Generator’s Adaptive Web experience.',
        });
      }
      baseHtml = uploadedHtml;
    } else {
      baseHtml = build.render(formData || {});
    }

    // 2. Create SP objects in the SDO via the Personalization Connect REST API.
    //    Done BEFORE SDK injection so the discovered tenant endpoint (dcTse) and
    //    data space can be baked into the live beacon + sitemap.
    const conn = connectionFromRow(connRow);
    let deployResult;
    try {
      deployResult = await deployer.deploy(conn, {
        demoName: name,
        profileDataGraphName,
        dataSpaceName,
        connector,
        formData: formData || {},
      });
    } catch (err) {
      // Deploy failed (and rolled back its own partial objects). Do NOT persist
      // a demo row — a phantom demo with no PPs / dead beacon would clutter
      // Manage Demos and confuse a retry. Surface the error so the SE can fix +
      // retry with the same name (rollback freed the names).
      return res.status(200).json({
        id: null,
        name,
        deploy: { mode: 'error', error: err.message, rollback: err.rollback || null },
      });
    }

    // 3. Inject the Web SDK. If the deploy discovered a tenant endpoint, the
    //    beacon is live and WPM can attach; otherwise it's commented out and the
    //    sitemap still initializes (page renders, regenerate later).
    const generatedHtml = injectSdk(baseHtml, {
      connector: deployResult.connector || (deployResult.artifacts && deployResult.artifacts.connector) || null,
      dataSpace: dataSpaceName || (deployResult.artifacts && deployResult.artifacts.dataSpaceName) || 'default',
    });

    // 4. Persist the deployment. If this fails AFTER the SF objects were
    //    created (e.g. a DB timeout on the large HTML blob), the objects would
    //    be orphaned — so roll them back before surfacing the error.
    let row;
    try {
      row = await db.createDeployment({
        userId: req.user.id,
        sfConnectionId: connectionId,
        name,
        industry,
        formData: formData || {},
        generatedHtml,
        // Store the artifacts object itself (schemas/transformers/pps + dcTse) so
        // cleanup and the delete-confirm modal read the arrays directly. Keep the
        // deploy mode alongside for reference.
        sfArtifacts: { mode: deployResult.mode, ...(deployResult.artifacts || {}) },
        status: 'active',
        expiresAt: expiresAtFrom(expiry),
      });
    } catch (persistErr) {
      let rollback = null;
      try {
        rollback = await cleanup(conn, deployResult.artifacts || {});
      } catch (rbErr) {
        rollback = { mode: 'error', error: rbErr.message };
      }
      const leftover = rollback && rollback.orphans && rollback.orphans.length;
      return res.status(200).json({
        id: null,
        name,
        deploy: {
          mode: 'error',
          error: `Created the SP objects, but saving the demo failed: ${persistErr.message}.` +
            (leftover
              ? ` Rollback left ${leftover} object(s) in the org — remove them from Salesforce manually.`
              : ' The created objects were rolled back; fix the issue and redeploy.'),
          rollback,
        },
      });
    }

    const base = process.env.APP_BASE_URL || `${req.protocol}://${req.get('host')}`;
    res.status(201).json({
      id: row.id,
      name: row.name,
      hostedUrl: `${base}/e/${row.id}`,
      status: row.status,
      expiresAt: row.expires_at,
      deploy: deployResult,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/deployments
router.get('/', async (req, res, next) => {
  try {
    const rows = await db.listDeployments(req.user.id);
    const base = process.env.APP_BASE_URL || `${req.protocol}://${req.get('host')}`;
    res.json(
      rows.map((r) => ({
        id: r.id,
        name: r.name,
        industry: r.industry,
        orgAlias: r.org_alias,
        orgId: r.org_id,
        status: r.status,
        expiresAt: r.expires_at,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
        hostedUrl: `${base}/e/${r.id}`,
        artifacts: r.sf_artifacts,
      }))
    );
  } catch (err) {
    next(err);
  }
});

// GET /api/deployments/:id/sitemap — download the connector-uploadable sitemap.
// The SE uploads this in Data Cloud Setup → Websites & Mobile Apps → connector
// → Replace Sitemap, so WPM sees this page's content zones.
router.get('/:id/sitemap', async (req, res, next) => {
  try {
    const row = await db.getDeployment(req.user.id, req.params.id);
    if (!row) return res.status(404).json({ error: 'not_found' });
    const js = buildConnectorSitemap({ demoName: row.name });
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Content-Disposition', `attachment; filename="sp-demo-sitemap-${req.params.id}.js"`);
    res.send(js);
  } catch (err) {
    next(err);
  }
});

// GET /api/deployments/:id
router.get('/:id', async (req, res, next) => {
  try {
    const row = await db.getDeployment(req.user.id, req.params.id);
    if (!row) return res.status(404).json({ error: 'not_found' });
    res.json(row);
  } catch (err) {
    next(err);
  }
});

// PUT /api/deployments/:id — regenerate HTML (SP record updates are a follow-up).
router.put('/:id', async (req, res, next) => {
  try {
    const existing = await db.getDeployment(req.user.id, req.params.id);
    if (!existing) return res.status(404).json({ error: 'not_found' });

    const { name, industry, formData, expiry } = req.body || {};
    const nextFormData = formData || existing.form_data;
    const rendered = build.render(nextFormData);
    // Reuse the tenant endpoint + data space discovered at deploy time so a
    // regenerate keeps the live beacon wired.
    const priorArtifacts = existing.sf_artifacts || {};
    const generatedHtml = injectSdk(rendered, {
      connector: priorArtifacts.connector || null,
      dataSpace: priorArtifacts.dataSpaceName || 'default',
    });

    const updated = await db.updateDeployment(req.user.id, req.params.id, {
      name: name || existing.name,
      industry: industry ?? existing.industry,
      form_data: nextFormData,
      generated_html: generatedHtml,
      ...(expiry !== undefined ? { expires_at: expiresAtFrom(expiry) } : {}),
    });
    res.json({ id: updated.id, status: updated.status, updatedAt: updated.updated_at });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/deployments/:id — reverse deploy, then mark deleted.
router.delete('/:id', async (req, res, next) => {
  try {
    const row = await db.getDeployment(req.user.id, req.params.id);
    if (!row) return res.status(404).json({ error: 'not_found' });

    const connRow = await db.getSfConnection(req.user.id, row.sf_connection_id);
    let cleanupResult = { mode: 'skipped', reason: 'connection_missing' };
    if (connRow) {
      const conn = connectionFromRow(connRow);
      try {
        cleanupResult = await cleanup(conn, row.sf_artifacts);
      } catch (err) {
        cleanupResult = { mode: 'error', error: err.message };
      }
    }

    // Only mark the demo deleted if org cleanup fully succeeded (or there were
    // no org objects / no connection). If objects couldn't be removed, KEEP the
    // row so the SE can retry the delete — and tell them what's still in the org
    // instead of a silent success.
    const orphans = (cleanupResult && cleanupResult.orphans) || [];
    const fullyClean = cleanupResult.mode === 'complete' || cleanupResult.mode === 'skipped' || cleanupResult.mode === 'dry_run';
    if (fullyClean) {
      await db.markDeploymentDeleted(req.user.id, req.params.id);
      return res.json({ ok: true, cleanup: cleanupResult });
    }
    return res.status(207).json({
      ok: false,
      cleanup: cleanupResult,
      error: 'cleanup_incomplete',
      detail: `${orphans.length} object(s) could not be removed from the org and were left in place; the demo was NOT deleted so you can retry. Objects: ${orphans.map((o) => `${o.type} ${o.ref}`).join(', ')}`,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
