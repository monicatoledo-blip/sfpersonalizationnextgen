'use strict';

// Programmatic creation of Salesforce Personalization objects in a connected SDO.
//
// IMPORTANT (see plan + handoff): PersonalizationPoint / PersonalizationSchema are
// createable=false via standard REST. The supported path is the Metadata API
// (jsforce `metadata.deploy` with .personalizationSchema-meta.xml /
// .personalizationPoint-meta.xml components). This module:
//   1. probes whether those metadata types are available at the target API version,
//   2. if yes, builds a metadata package and deploys it,
//   3. if no, returns a structured "manual steps" payload the SPA renders so the
//      SE can create the objects by hand — never a silent failure.
//
// Naming: every object is prefixed with the demo name ("<Demo> - Web - ...") so
// multiple demos coexist in one org and cleanup can scope by prefix.
//
// The three surfaces (must match html/inject-sdk.js content zones and the template):
//   "Web - Homepage Hero"     -> zone homepage_hero
//   "Web - Recommended Cards" -> zone recommended_cards
//   "Web - Category Hero"     -> zone category_hero

const { API_VERSION } = require('./client');

// Content Schema definitions — attribute shapes Monica validated manually in her SDO.
const SCHEMA_DEFS = [
  {
    key: 'heroBanner',
    label: 'Web - Hero Banner',
    attributes: ['tagline', 'Headline', 'Subheadline', 'backgroundImage', 'ctaLabel'],
  },
  {
    key: 'contentCard',
    label: 'Web - Content Card',
    attributes: ['title', 'description', 'thumbnail', 'tag', 'ctaLabel'],
  },
  {
    key: 'categoryHero',
    label: 'Web - Category Hero',
    // Corrected shape (the manual SDO copy accidentally inherited Hero Banner's attrs).
    attributes: ['headline', 'backgroundImage', 'badgeText'],
  },
];

// Personalization Point definitions, each bound to a Content Schema + content zone.
const PP_DEFS = [
  { key: 'homepageHero', label: 'Web - Homepage Hero', schemaKey: 'heroBanner', zone: 'homepage_hero' },
  { key: 'recommendedCards', label: 'Web - Recommended Cards', schemaKey: 'contentCard', zone: 'recommended_cards' },
  { key: 'categoryHero', label: 'Web - Category Hero', schemaKey: 'categoryHero', zone: 'category_hero' },
];

function prefixed(demoName, label) {
  return `${demoName} - ${label}`;
}

// Probe Metadata API describe for the personalization component types.
// Returns { supported: bool, types: string[] }.
async function checkMetadataSupport(conn) {
  try {
    const meta = await conn.metadata.describe(API_VERSION);
    const names = (meta.metadataObjects || []).map((m) => m.xmlName);
    const want = ['PersonalizationSchema', 'PersonalizationPoint'];
    const present = want.filter((w) => names.includes(w));
    return { supported: present.length === want.length, types: present, available: names.length };
  } catch (err) {
    return { supported: false, types: [], error: err.message };
  }
}

// Build the manual-steps fallback payload (rendered in the SPA when Metadata API
// can't create these types at the org's API version).
function manualSteps(demoName) {
  const schemas = SCHEMA_DEFS.map((s) => ({
    name: prefixed(demoName, s.label),
    personalizationType: 'ManualContent',
    attributes: s.attributes,
  }));
  const pps = PP_DEFS.map((p) => ({
    name: prefixed(demoName, p.label),
    source: 'PersonalizationApp',
    contentZone: p.zone,
    boundSchema: prefixed(demoName, SCHEMA_DEFS.find((s) => s.key === p.schemaKey).label),
  }));
  return {
    mode: 'manual',
    message:
      'Personalization objects cannot be created via the Metadata API at this org’s API version. Create them manually in Setup, then attach the hosted URL in WPM.',
    schemas,
    personalizationPoints: pps,
  };
}

// --- Metadata package builders -------------------------------------------------

function escapeXml(s) {
  return String(s).replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));
}

function schemaMetaXml(def, fullName) {
  const attrs = def.attributes
    .map(
      (a) =>
        `  <attributes>\n    <name>${escapeXml(a)}</name>\n    <dataType>Text</dataType>\n  </attributes>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<PersonalizationSchema xmlName="PersonalizationSchema" fullName="${escapeXml(fullName)}">
  <masterLabel>${escapeXml(fullName)}</masterLabel>
  <personalizationType>ManualContent</personalizationType>
${attrs}
</PersonalizationSchema>`;
}

function ppMetaXml(def, fullName, schemaFullName) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<PersonalizationPoint xmlName="PersonalizationPoint" fullName="${escapeXml(fullName)}">
  <masterLabel>${escapeXml(fullName)}</masterLabel>
  <source>PersonalizationApp</source>
  <schema>${escapeXml(schemaFullName)}</schema>
</PersonalizationPoint>`;
}

// Assemble the in-memory metadata package (list of {type, fullName, xml}).
function buildPackage(demoName) {
  const components = [];
  const artifactPlan = { schemas: [], pps: [] };

  for (const def of SCHEMA_DEFS) {
    const fullName = prefixed(demoName, def.label);
    components.push({ type: 'PersonalizationSchema', fullName, xml: schemaMetaXml(def, fullName) });
    artifactPlan.schemas.push({ key: def.key, fullName });
  }
  for (const def of PP_DEFS) {
    const fullName = prefixed(demoName, def.label);
    const schemaFullName = prefixed(demoName, SCHEMA_DEFS.find((s) => s.key === def.schemaKey).label);
    components.push({ type: 'PersonalizationPoint', fullName, xml: ppMetaXml(def, fullName, schemaFullName) });
    artifactPlan.pps.push({ key: def.key, fullName, zone: def.zone });
  }
  return { components, artifactPlan };
}

// --- Public API ----------------------------------------------------------------

// deploy(conn, { demoName, decisions }) -> {mode:'deployed', artifacts} | {mode:'manual', ...}
// `decisions` is reserved for the Personalization Decision content payloads
// (created after schemas/PPs exist); wired in a follow-up once the metadata path
// is verified against a real org.
async function deploy(conn, { demoName }) {
  if (!demoName) throw new Error('deploy: demoName is required');

  const support = await checkMetadataSupport(conn);
  if (!support.supported) {
    return { ...manualSteps(demoName), metadataSupport: support };
  }

  const { components, artifactPlan } = buildPackage(demoName);

  // NOTE: this is intentionally guarded. Before running a real metadata.deploy()
  // against Monica's SDO we confirm the Metadata Coverage Report supports these
  // types at the target API version (handoff "stop and ask"). Until then, callers
  // can pass { dryRun: true } to get the package back without deploying.
  return {
    mode: 'ready',
    metadataSupport: support,
    components: components.map((c) => ({ type: c.type, fullName: c.fullName })),
    artifactPlan,
    note:
      'Metadata types are available. Deploy is gated pending Metadata Coverage confirmation against the target org (see handoff).',
    // The actual deploy call, once unblocked, looks like:
    //   const zip = buildMetadataZip(components);
    //   const result = await conn.metadata.deploy(zip, { singlePackage: true }).complete();
  };
}

module.exports = {
  deploy,
  checkMetadataSupport,
  buildPackage,
  manualSteps,
  SCHEMA_DEFS,
  PP_DEFS,
  prefixed,
};
