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

// Bound any Salesforce call so a single slow/hung request can never push the
// whole HTTP response past Heroku's hard 30s limit (which surfaces as an
// "Application error"). Rejects with a labeled timeout error.
function withTimeout(promise, ms, label) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
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
    const CALL_MS = 8000; // per-call ceiling; 3 checks in parallel stay well under 30s

    // Run the three checks in parallel, each independently bounded, so one slow
    // call can't block the others or time out the whole response.
    const [personalization, personalizationSchema, profileDataGraph] = await Promise.all([
      withTimeout(conn.sobject('PersonalizationPoint').describe(), CALL_MS, 'PersonalizationPoint describe')
        .then(() => ({ ok: true, detail: 'PersonalizationPoint is available' }))
        .catch((err) => {
          const notFound = err.errorCode === 'NOT_FOUND' || err.name === 'NOT_FOUND' || /not.*support|does not exist|sObject type/i.test(err.message || '');
          return {
            ok: false,
            detail: notFound
              ? 'Personalization does not appear to be enabled in this org (PersonalizationPoint not found).'
              : `Describe failed: ${err.message}`,
          };
        }),
      withTimeout(conn.sobject('PersonalizationSchema').describe(), CALL_MS, 'PersonalizationSchema describe')
        .then(() => ({ ok: true, detail: 'PersonalizationSchema is available' }))
        .catch((err) => ({ ok: false, detail: err.message })),
      findProfileDataGraph(conn, CALL_MS).catch((err) => ({ ok: null, detail: err.message })),
    ]);

    checks.personalization = personalization;
    checks.personalizationSchema = personalizationSchema;
    checks.profileDataGraph = profileDataGraph;

    const ready = checks.personalization.ok && checks.personalizationSchema.ok;
    res.json({ ready, checks });
  } catch (err) {
    next(err);
  }
});

// Best-effort discovery of a Profile-type Data Graph. Object API names differ by
// release; try known candidates and return the first that answers.
async function findProfileDataGraph(conn, callMs = 8000) {
  const candidates = ['MktDataGraphDefinition', 'DataGraph', 'MarketDataGraphDefinition'];
  for (const objName of candidates) {
    try {
      const q = await withTimeout(
        conn.query(`SELECT Id, DeveloperName, MasterLabel FROM ${objName} LIMIT 50`),
        callMs,
        `${objName} query`
      );
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
      'Could not list Data Graphs via API (this is common — they are not always API-queryable). ' +
      'If you know your Profile Data Graph, enter its API name in the Profile Data Graph field before deploying. ' +
      'To find or create one: Data Cloud Setup → Data Graphs. A Profile Data Graph requires a configured Data Cloud data model (unified Individual + mappings).',
  };
}

module.exports = router;
