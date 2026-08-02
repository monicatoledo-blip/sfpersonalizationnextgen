'use strict';

// Programmatic creation of Salesforce Personalization objects in a connected SDO
// via the Data 360 Personalization Connect REST API (see sf/p13n.js).
//
// Per demo we create a fully self-consistent, demo-prefixed set so many demos
// coexist and per-demo teardown can delete exactly what it made:
//   - 3 Content Schemas  (Hero Banner / Content Card / Category Hero)
//   - 1 WebApp Handlebars Transformer for the hero (renders the image swap)
//   - 3 Personalization Points, each bound to its schema + content zone
//   - Personalization Decisions nested in each PP; the homepage-hero PP's
//     decision carries the personalized hero image + copy from the simulator
//     config, so the vanilla->personalized swap is a one-click in WPM.
//
// The three surfaces (must match html/inject-sdk.js content zones and template):
//   "Web - Homepage Hero"     -> zone homepage_hero     -> #warm-homepage-section
//   "Web - Recommended Cards" -> zone recommended_cards -> .floating-cards-container
//   "Web - Category Hero"     -> zone category_hero     -> #cat-hero

const p13n = require('./p13n');
const { getMergedAdaptiveStory } = require('../data/generator');

const DEFAULT_DATA_SPACE = 'default';

// Hero schema attributes. Names are the internal attribute names; the transformer
// substitution vars point at these via [attributes].[<name>]. Kept internally
// consistent (unlike the org's hand-built copy, which had a "backgoundImage" typo).
const HERO_ATTRS = [
  { name: 'BackgroundImageUrl', label: 'Background Image URL' },
  { name: 'Header', label: 'Header' },
  { name: 'Subheader', label: 'Subheader' },
  { name: 'CallToActionText', label: 'CTA Text' },
];

const SCHEMA_DEFS = [
  { key: 'heroBanner', label: 'Web - Hero Banner', attributes: HERO_ATTRS },
  {
    key: 'contentCard',
    label: 'Web - Content Card',
    attributes: [
      { name: 'Title', label: 'Title' },
      { name: 'Description', label: 'Description' },
      { name: 'Thumbnail', label: 'Thumbnail' },
      { name: 'CallToActionText', label: 'CTA Text' },
    ],
  },
  {
    key: 'categoryHero',
    label: 'Web - Category Hero',
    attributes: [
      { name: 'Header', label: 'Header' },
      { name: 'BackgroundImageUrl', label: 'Background Image URL' },
      { name: 'BadgeText', label: 'Badge Text' },
    ],
  },
];

// Personalization Points, each bound to a Content Schema + content zone.
const PP_DEFS = [
  { key: 'homepageHero', label: 'Web - Homepage Hero', schemaKey: 'heroBanner', zone: 'homepage_hero' },
  { key: 'recommendedCards', label: 'Web - Recommended Cards', schemaKey: 'contentCard', zone: 'recommended_cards' },
  { key: 'categoryHero', label: 'Web - Category Hero', schemaKey: 'categoryHero', zone: 'category_hero' },
];

function prefixed(demoName, label) {
  return `${demoName} - ${label}`;
}

// A Connect-REST-safe API name: letters, numbers, underscores; no leading digit.
function apiName(label) {
  return String(label)
    .replace(/[^A-Za-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/^(\d)/, '_$1');
}

// Hero transformer HTML — mirrors the org's known-good hero transformer, driven
// by subVars that map 1:1 to the hero schema attributes.
function heroTransformerHtml() {
  return [
    '<style>',
    '.sfdcep-banner{margin:0 auto;width:100%;min-height:600px;display:flex;flex-flow:column wrap;justify-content:center;font-family:Arial,Helvetica,sans-serif;background-size:cover;background-position:center;}',
    '.sfdcep-banner-header{font-size:32px;padding-bottom:24px;font-weight:600;color:#fff;text-align:center;text-shadow:0 1px 4px rgba(0,0,0,.4);}',
    '.sfdcep-banner-subheader{font-size:20px;font-weight:400;color:#fff;text-align:center;padding-bottom:24px;text-shadow:0 1px 4px rgba(0,0,0,.4);}',
    '</style>',
    "<div class=\"sfdcep-banner\" style=\"background:url('{{subVar 'BackgroundImageUrl'}}') no-repeat center/cover;\">",
    "  <div class=\"sfdcep-banner-header\">{{subVar 'Header'}}</div>",
    "  <div class=\"sfdcep-banner-subheader\">{{subVar 'Subheader'}}</div>",
    '</div>',
  ].join('\n');
}

function heroSubstitutionDefinitions() {
  const defs = {};
  for (const a of HERO_ATTRS) {
    defs[a.name] = {
      configType: 'SchemaPath',
      defaultValue: `[attributes].[${a.name}]`,
      label: a.name,
      overridable: true,
      required: false,
    };
  }
  return defs;
}

// Build the personalized-hero attribute values from the simulator form config.
// The "after" (personalized) state = the warm hero image + headline the page
// renders; images are Cloudinary URLs stored as-is. Falls back gracefully when
// the demo was created from an uploaded file (no formData).
function heroDecisionAttributeValues(formData) {
  const fd = formData || {};
  const story = (() => {
    try {
      return getMergedAdaptiveStory(fd) || {};
    } catch (_) {
      return {};
    }
  })();
  const image = String(fd.adaptiveHeroImageUrl || fd.adaptiveColdHeroUrl || '').trim();
  const header = String(story.landingPageTitle || story.vanillaHeroTitle || '').trim();
  const subheader = String(story.landingPageSubtitle || story.vanillaHeroSubtext || '').trim();
  const cta = String(story.homepageCtaText || story.intentTriggerText || 'Learn more').trim();
  const values = [
    { attributeName: 'BackgroundImageUrl', value: image },
    { attributeName: 'Header', value: header },
    { attributeName: 'Subheader', value: subheader },
    { attributeName: 'CallToActionText', value: cta },
  ];
  return values.filter((v) => v.value);
}

// Decisions per PP. Homepage hero gets the personalized content; the other two
// get a single fallback decision so WPM has something to bind.
function decisionsFor(ppKey, demoName, formData) {
  if (ppKey === 'homepageHero') {
    return [
      {
        name: apiName(prefixed(demoName, 'Personalized Hero')),
        label: 'Personalized Hero',
        attributeValues: heroDecisionAttributeValues(formData),
        state: 'Live',
      },
    ];
  }
  return [
    {
      name: apiName(prefixed(demoName, `${ppKey} Default`)),
      label: 'Default',
      attributeValues: [],
      state: 'Live',
    },
  ];
}

// deploy(conn, { demoName, dataSpaceName?, profileDataGraphName, formData })
//   -> { mode:'deployed', dcTse, artifacts } | throws on hard failure
// artifacts: { schemas:[{name,id}], transformers:[{name,id}], pps:[{name,id,zone}], dataSpaceName }
async function deploy(conn, opts) {
  const { demoName, profileDataGraphName, formData, tenantEndpoint } = opts || {};
  if (!demoName) throw new Error('deploy: demoName is required');
  if (!profileDataGraphName) throw new Error('deploy: profileDataGraphName is required');
  const dataSpaceName = (opts && opts.dataSpaceName) || DEFAULT_DATA_SPACE;

  // Tenant endpoint (beacon host): prefer an explicit value from the SE; else
  // best-effort auto-discovery. Normalize away any scheme/trailing slash.
  let dcTse = (tenantEndpoint || '').trim().replace(/^https?:\/\//, '').split('/')[0];
  const hm = dcTse.match(/[A-Za-z0-9.-]+/); // keep only a valid hostname run
  dcTse = hm ? hm[0].replace(/\.+$/, '') : null;
  if (!dcTse) {
    const info = await p13n.getOrgInfo(conn);
    dcTse = info.dcTse || null;
  }

  const artifacts = { schemas: [], transformers: [], pps: [], dataSpaceName, dcTse };

  try {
    // 1. Content Schemas.
    const schemaNameByKey = {};
    for (const def of SCHEMA_DEFS) {
      const name = apiName(prefixed(demoName, def.label));
      const created = await p13n.createSchema(conn, {
        name,
        label: prefixed(demoName, def.label),
        dataSpaceName,
        attributes: def.attributes,
      });
      schemaNameByKey[def.key] = name;
      artifacts.schemas.push({ key: def.key, name, id: created.id });
    }

    // 2. Hero transformer (bound to the hero schema).
    const heroTransformerName = apiName(prefixed(demoName, 'Web - Hero Experience Template'));
    const t = await p13n.createTransformer(conn, {
      name: heroTransformerName,
      label: prefixed(demoName, 'Web - Hero Experience Template'),
      dataSpace: dataSpaceName,
      schemaReference: schemaNameByKey.heroBanner,
      substitutionDefinitions: heroSubstitutionDefinitions(),
      html: heroTransformerHtml(),
    });
    artifacts.transformers.push({ name: heroTransformerName, id: t.id, schemaKey: 'heroBanner' });

    // 3. Personalization Points (+ nested decisions).
    for (const def of PP_DEFS) {
      const name = apiName(prefixed(demoName, def.label));
      const created = await p13n.createPoint(conn, {
        name,
        label: prefixed(demoName, def.label),
        dataSpaceName,
        profileDataGraphName,
        source: 'PersonalizationApp',
        schemaName: schemaNameByKey[def.schemaKey],
        decisions: decisionsFor(def.key, demoName, formData),
      });
      artifacts.pps.push({ key: def.key, name, id: created.id, zone: def.zone });
    }

    return { mode: 'deployed', dcTse, artifacts };
  } catch (err) {
    // Partial-deploy rollback: a demo is all-or-nothing. Remove whatever we
    // created (reverse dependency order) so the org isn't left with orphans and
    // a retry with the same name won't collide with "already exists". Rollback
    // failures are collected but never mask the original error.
    const rollback = await rollbackArtifacts(conn, artifacts);
    err.rollback = rollback;
    err.message = `${err.message}${rollback.orphans.length ? ` [rollback left ${rollback.orphans.length} object(s) — remove manually]` : ' [created objects rolled back]'}`;
    throw err;
  }
}

// Best-effort deletion of everything a failed deploy created, reverse order:
// PPs -> transformers -> schemas. Returns { removed, orphans }.
async function rollbackArtifacts(conn, artifacts) {
  const removed = [];
  const orphans = [];
  const steps = [
    ...(artifacts.pps || []).map((p) => ['PersonalizationPoint', p13n.deletePoint, p.id || p.name]),
    ...(artifacts.transformers || []).map((t) => ['Transformer', p13n.deleteTransformer, t.id || t.name]),
    ...(artifacts.schemas || []).map((s) => ['PersonalizationSchema', p13n.deleteSchema, s.id || s.name]),
  ].filter(([, , ref]) => ref);
  for (const [type, fn, ref] of steps) {
    try {
      await fn(conn, ref);
      removed.push({ type, ref });
    } catch (e) {
      orphans.push({ type, ref, reason: e.message });
    }
  }
  return { removed, orphans };
}

module.exports = {
  deploy,
  apiName,
  prefixed,
  SCHEMA_DEFS,
  PP_DEFS,
};
