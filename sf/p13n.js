'use strict';

// Data 360 Personalization Connect REST client.
//
// The SDO exposes Personalization objects (Content Schemas, Points, Decisions,
// Transformers) via the Connect REST API under
// /services/data/v{V}/personalization/... — NOT the Metadata API. This module
// wraps the authenticated jsforce Connection (see sf/client.js) with thin
// helpers that create / read / delete those objects.
//
// Verified against the meshmesh SDO (2026-08-02, API v67):
//   GET  /personalization/personalization-schemas/{idOrName}
//   GET  /personalization/external-apps/transformers
// Resource shapes (attributes, substitutionDefinitions, decisions[].attributeValues)
// mirror the d360_p13n_* Connect tools. Create endpoints are POSTs to the
// collection paths below; on the first live create, confirm the response id
// field (documented as `id`).

const { API_VERSION } = require('./client');

const BASE = `/services/data/v${API_VERSION}/personalization`;
const PATHS = {
  schemas: `${BASE}/personalization-schemas`,
  points: `${BASE}/personalization-points`,
  transformers: `${BASE}/external-apps/transformers`,
  orgInfo: `${BASE}/org-info`,
};

// jsforce request helpers already prefix the instance URL and add auth headers.
// We wrap them so the org's own error message survives to the SPA (jsforce
// surfaces Connect REST errors as an array or {message}); a raw stack trace is
// useless to an SE troubleshooting a demo.
function readableErr(err, action) {
  let detail = err && err.message ? err.message : String(err);
  // jsforce sometimes attaches the parsed body; prefer its message[s].
  const body = err && (err.content || err.body);
  if (Array.isArray(body) && body[0] && body[0].message) detail = body.map((e) => e.message).join('; ');
  else if (body && body.message) detail = body.message;
  const e = new Error(`${action}: ${detail}`);
  e.cause = err;
  return e;
}
async function get(conn, url) {
  try { return await conn.requestGet(url); }
  catch (err) { throw readableErr(err, `GET ${url}`); }
}
async function post(conn, url, body, action) {
  try { return await conn.requestPost(url, body); }
  catch (err) { throw readableErr(err, action || `POST ${url}`); }
}
async function del(conn, url) {
  try { return await conn.request({ method: 'DELETE', url }); }
  catch (err) { throw readableErr(err, `DELETE ${url}`); }
}

// --- Org info ------------------------------------------------------------------

// Returns { dcTse } — the org's Data Cloud tenant-specific endpoint, which is
// the host for the Web SDK beacon. Best-effort: callers treat a missing dcTse
// as "beacon not yet wireable" and fall back to the commented-out snippet.
async function getOrgInfo(conn) {
  try {
    const info = await get(conn, PATHS.orgInfo);
    return { dcTse: info && info.dcTse ? info.dcTse : null, raw: info };
  } catch (err) {
    return { dcTse: null, error: err.message };
  }
}

// --- Content Schema ------------------------------------------------------------

// def: { name, label, dataSpaceName, attributes: [{ name, label, defaultValue? }] }
async function createSchema(conn, def) {
  const body = {
    name: def.name,
    label: def.label,
    dataSpaceName: def.dataSpaceName,
    personalizationType: 'ManualContent',
    attributes: (def.attributes || []).map((a) =>
      typeof a === 'string'
        ? { name: a, label: a }
        : { name: a.name, label: a.label || a.name, defaultValue: a.defaultValue ?? null }
    ),
  };
  const res = await post(conn, PATHS.schemas, body, `Create Content Schema "${def.label}"`);
  return { id: res && res.id, name: def.name, raw: res };
}

async function deleteSchema(conn, idOrName) {
  await del(conn, `${PATHS.schemas}/${encodeURIComponent(idOrName)}`);
  return { deleted: idOrName };
}

// --- Transformer / "Experience Template" (WebApp Handlebars) -------------------
// In the org UI these render as "Experience Templates"; the API object is a
// transformer. We never send `description` — the field is capped at 40 chars and
// a longer value 500s (verified against the SDO 2026-08-02).

// def: { name, label, dataSpace, schemaReference, substitutionDefinitions, html }
// substitutionDefinitions maps subvar name -> { configType:'SchemaPath',
// defaultValue:'[attributes].[<attr>]', overridable:true, required:false }.
async function createTransformer(conn, def) {
  // NOTE: do NOT send `transformerCategory` — it is server-derived and the raw
  // Connect POST rejects it as "Unrecognized field" (verified 2026-08-02). The
  // org defaults it to EmbeddedContent and returns it in the response.
  const body = {
    name: def.name,
    label: def.label,
    channel: 'WebApp',
    dataSpace: def.dataSpace,
    schemaReference: def.schemaReference,
    isEnabled: true,
    transformerType: 'Handlebars',
    substitutionDefinitions: def.substitutionDefinitions,
    transformerTypeDetails: { html: def.html, script: null, componentName: null },
  };
  const res = await post(conn, PATHS.transformers, body, `Create Experience Template "${def.label}"`);
  return { id: res && res.id, name: def.name, raw: res };
}

async function deleteTransformer(conn, idOrName) {
  const url = `${PATHS.transformers}/${encodeURIComponent(idOrName)}`;
  let res;
  try {
    res = await conn.request({ method: 'DELETE', url });
  } catch (err) {
    throw readableErr(err, `DELETE ${url}`);
  }
  // DIAGNOSTIC: transformer DELETE has been returning success without actually
  // deleting. Log the raw response so we can see what the API returns, then
  // VERIFY it's gone; if it still exists, treat as a real failure (throw) so
  // the delete job doesn't falsely mark it removed.
  console.warn('[p13n] deleteTransformer response', JSON.stringify({ url, res }));
  try {
    await get(conn, url); // if this SUCCEEDS, the transformer still exists
    const e = new Error(`DELETE ${url}: transformer still present after delete (API no-op)`);
    console.warn('[p13n] deleteTransformer NO-OP — still present:', idOrName);
    throw e;
  } catch (verifyErr) {
    // Expected path: the GET should 404 (already gone) → deletion confirmed.
    if (/not.?found|does not exist|NOT_FOUND|INVALID_CROSS_REFERENCE|invalid cross|could not find|INVALID_API_INPUT/i.test(String(verifyErr.message || ''))) {
      return { deleted: idOrName };
    }
    throw verifyErr; // includes our "still present" error
  }
}

// Fetch a single transformer; throws (already-gone) if it doesn't exist. Used by
// the delete job's self-heal to verify a transformer really exists before
// re-queueing it for deletion.
async function getTransformer(conn, idOrName) {
  return get(conn, `${PATHS.transformers}/${encodeURIComponent(idOrName)}`);
}

// --- Personalization Point (+ nested Decisions) --------------------------------

// def: {
//   name, label, dataSpaceName, profileDataGraphName, source ('PersonalizationApp'),
//   schemaName, isAuthenticationRequired?,
//   decisions: [{ name, label, state:'Live', criteria?, attributeValues:[{attributeName,value}] }]
// }
async function createPoint(conn, def) {
  const body = {
    name: def.name,
    label: def.label,
    dataSpaceName: def.dataSpaceName,
    profileDataGraphName: def.profileDataGraphName,
    source: def.source || 'PersonalizationApp',
    isAuthenticationRequired: def.isAuthenticationRequired ?? false,
    schemaName: def.schemaName,
    // NOTE (verified against SDO 2026-08-02): the Connect REST point create
    // REJECTS `criteria` on API-tier requests ("Setting criteria is not allowed
    // for non-UI tier requests"). So decisions are created WITHOUT criteria —
    // they are unconditional (always-on) decisions, which is what the demo swap
    // needs. Conditional targeting is added later in the WPM/Personalization UI.
    decisions: (def.decisions || []).map((d) => ({
      name: d.name,
      label: d.label || d.name,
      attributeValues: d.attributeValues || [],
      state: d.state || 'Live',
    })),
  };
  const res = await post(conn, PATHS.points, body, `Create Personalization Point "${def.label}"`);
  return { id: res && res.id, name: def.name, raw: res };
}

async function deletePoint(conn, idOrName) {
  // Deleting a PP removes its nested decisions.
  await del(conn, `${PATHS.points}/${encodeURIComponent(idOrName)}`);
  return { deleted: idOrName };
}

// --- Web Personalization Manager experience configs -----------------------------
// When an SE AUTHORS an experience in WPM, it creates a PersnlExperience /
// PersnlExperienceDef ("experience config") bound to the PP. That reference
// BLOCKS deleting the PP ("Remove these dependencies: [PersnlExperience,
// PersnlExperienceDef]"), so teardown must delete these FIRST. They live under
// the Website CONNECTOR, not the PP, so every call needs the connector id.

// List experience configs for a connector, optionally filtered to one PP.
// Returns [] on any error (best-effort: a connector with none, or an org that
// doesn't expose the endpoint, should not block teardown).
async function listExperienceConfigs(conn, connectorId, { personalizationPointNameOrId } = {}) {
  if (!connectorId) return [];
  let url = `${BASE}/external-apps/${encodeURIComponent(connectorId)}/personalization-experience-configs?limit=200`;
  if (personalizationPointNameOrId) {
    url += `&personalizationPointNameOrId=${encodeURIComponent(personalizationPointNameOrId)}`;
  }
  try {
    const res = await get(conn, url);
    return (res && res.personalizationExperienceConfigs) || [];
  } catch (_) {
    return [];
  }
}

async function deleteExperienceConfig(conn, connectorId, nameOrId) {
  await del(conn, `${BASE}/external-apps/${encodeURIComponent(connectorId)}/personalization-experience-configs/${encodeURIComponent(nameOrId)}`);
  return { deleted: nameOrId };
}

module.exports = {
  PATHS,
  getOrgInfo,
  createSchema,
  deleteSchema,
  createTransformer,
  deleteTransformer,
  getTransformer,
  createPoint,
  deletePoint,
  listExperienceConfigs,
  deleteExperienceConfig,
};
