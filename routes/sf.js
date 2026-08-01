'use strict';

// Salesforce org helpers used by the SPA before/around deploy.
//   GET /api/sf/:connectionId/info          -> org identity + instance url
//   GET /api/sf/:connectionId/prerequisites -> Personalization + Data Graph readiness
//
// Prerequisites logic mirrors the MI Demo Builder gate:
//   - PersonalizationPoint describe must succeed (404/NOT_FOUND => Personalization off)
//   - A Profile Data Graph must exist in the org (we surface what we find)

const express = require('express');
const { requireAuth } = require('../auth/google');
const { connectionForUser, API_VERSION } = require('../sf/client');
const { ADAPTIVE_WEB_COPY_BY_SUB_INDUSTRY } = require('../data/generator');

const router = express.Router();

// Industry + use-case catalog for the New Demo form (labels for the dropdowns).
const INDUSTRY_LABELS = {
  retailBanking: 'Retail Banking',
  commercialBanking: 'Commercial Banking',
  wealthManagement: 'Wealth Management',
  assetManagement: 'Asset Management',
  insurance: 'Insurance',
};

router.get('/catalog', requireAuth, (req, res) => {
  const industries = Object.keys(ADAPTIVE_WEB_COPY_BY_SUB_INDUSTRY).map((key) => {
    const rec = ADAPTIVE_WEB_COPY_BY_SUB_INDUSTRY[key] || {};
    const useCases = Object.entries(rec.useCases || {}).map(([ucKey, uc]) => ({
      key: ucKey,
      name: uc.name || ucKey,
    }));
    return { key, label: INDUSTRY_LABELS[key] || key, useCases };
  });
  res.json({ industries });
});

// Resolve a connection for the current user or 404.
async function withConnection(req, res) {
  const conn = await connectionForUser(req.user.id, req.params.connectionId);
  if (!conn) {
    res.status(404).json({ error: 'connection_not_found' });
    return null;
  }
  return conn;
}

router.get('/:connectionId/info', requireAuth, async (req, res, next) => {
  try {
    const conn = await withConnection(req, res);
    if (!conn) return;
    const identity = await conn.identity();
    res.json({
      orgId: identity.organization_id,
      userId: identity.user_id,
      username: identity.username,
      displayName: identity.display_name,
      instanceUrl: conn.instanceUrl,
      apiVersion: API_VERSION,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:connectionId/prerequisites', requireAuth, async (req, res, next) => {
  try {
    const conn = await withConnection(req, res);
    if (!conn) return;

    const checks = {};

    // 1. Personalization enabled? Describe PersonalizationPoint.
    try {
      await conn.sobject('PersonalizationPoint').describe();
      checks.personalization = { ok: true, detail: 'PersonalizationPoint is available' };
    } catch (err) {
      const notFound = err.errorCode === 'NOT_FOUND' || err.name === 'NOT_FOUND' || /not.*support|does not exist|sObject type/i.test(err.message || '');
      checks.personalization = {
        ok: false,
        detail: notFound
          ? 'Personalization does not appear to be enabled in this org (PersonalizationPoint not found).'
          : `Describe failed: ${err.message}`,
      };
    }

    // 2. Schema object available? (Content Schemas)
    try {
      await conn.sobject('PersonalizationSchema').describe();
      checks.personalizationSchema = { ok: true, detail: 'PersonalizationSchema is available' };
    } catch (err) {
      checks.personalizationSchema = { ok: false, detail: err.message };
    }

    // 3. Profile Data Graph exists? Query the metadata table if reachable.
    //    Data Graph metadata is exposed as MktDataGraphDefinition / DataGraph in
    //    recent API versions; we try a couple of names and report what we find.
    checks.profileDataGraph = await findProfileDataGraph(conn);

    const ready = checks.personalization.ok && checks.personalizationSchema.ok;
    res.json({ ready, checks });
  } catch (err) {
    next(err);
  }
});

// Best-effort discovery of a Profile-type Data Graph. Object API names differ by
// release; try known candidates and return the first that answers.
async function findProfileDataGraph(conn) {
  const candidates = ['MktDataGraphDefinition', 'DataGraph', 'MarketDataGraphDefinition'];
  for (const objName of candidates) {
    try {
      const q = await conn.query(`SELECT Id, DeveloperName, MasterLabel FROM ${objName} LIMIT 50`);
      const graphs = (q.records || []).map((r) => ({
        id: r.Id,
        name: r.DeveloperName || r.MasterLabel,
      }));
      return {
        ok: graphs.length > 0,
        object: objName,
        graphs,
        detail: graphs.length
          ? `Found ${graphs.length} Data Graph(s) via ${objName}`
          : `No Data Graphs found via ${objName}`,
      };
    } catch (err) {
      // Try the next candidate name.
      continue;
    }
  }
  return {
    ok: null,
    detail:
      'Could not query Data Graph metadata via API. Verify a Profile Data Graph exists in Data Cloud Setup manually.',
  };
}

module.exports = router;
