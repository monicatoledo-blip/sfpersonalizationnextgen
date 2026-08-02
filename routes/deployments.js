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
const { injectSdk } = require('../html/inject-sdk');
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
    const { name, industry, formData, connectionId, expiry, uploadedHtml, profileDataGraphName, dataSpaceName, tenantEndpoint } = req.body || {};
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
        tenantEndpoint,
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
      dcTse: deployResult.dcTse || (deployResult.artifacts && deployResult.artifacts.dcTse) || null,
      dataSpace: dataSpaceName || (deployResult.artifacts && deployResult.artifacts.dataSpaceName) || 'default',
    });

    // 4. Persist the deployment.
    const row = await db.createDeployment({
      userId: req.user.id,
      sfConnectionId: connectionId,
      name,
      industry,
      formData: formData || {},
      generatedHtml,
      sfArtifacts: deployResult,
      status: 'active',
      expiresAt: expiresAtFrom(expiry),
    });

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
      dcTse: priorArtifacts.dcTse || null,
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

    await db.markDeploymentDeleted(req.user.id, req.params.id);
    res.json({ ok: true, cleanup: cleanupResult });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
