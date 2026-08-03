'use strict';

// Programmatic creation of Salesforce Personalization objects in a connected SDO
// via the Data 360 Personalization Connect REST API (see sf/p13n.js).
//
// Per demo we create a fully self-consistent, demo-prefixed set so many demos
// coexist and per-demo teardown can delete exactly what it made:
//   - 2 Content Schemas  (Hero Banner / Market Insights)
//   - 2 WebApp Handlebars Transformers (hero + market-insights grid)
//   - 2 Personalization Points, each bound to its schema + content zone
//   - Personalization Decisions nested in each PP, carrying the REAL warm
//     content extracted from the uploaded HTML (hero image+copy; the 3 cards'
//     images+copy) so the vanilla->personalized swap shows the true creative.
//
// The experiences (must match html/inject-sdk.js content zones and template):
//   "Web - Homepage Hero"    -> zone homepage_hero    -> #warm-homepage-section
//   "Web - Insight Card 1/2/3" -> zone market_insight_n -> #warm-insight-n

const p13n = require('./p13n');
const { getMergedAdaptiveStory } = require('../data/generator');
const { extractHeroContent, extractInsightCards } = require('../html/extract');
const { uploadHeroImage } = require('../html/cloudinary');

const DEFAULT_DATA_SPACE = 'default';

// Hero schema attributes. Names are the internal attribute names; the transformer
// substitution vars point at these via [attributes].[<name>]. Kept internally
// consistent (unlike the org's hand-built copy, which had a "backgoundImage" typo).
// The warm hero has FOUR distinct text/image DOM elements the SE maps 1:1 in
// WPM: an eyebrow ("WELCOME BACK, CYNTHIA"), the H1 headline, the subtext, and
// the CTA — plus the background image. Keeping Eyebrow separate (not merged into
// Header) makes each element map to its own attribute. 5 elements = at the WPM
// per-PP element cap, which is fine.
const HERO_ATTRS = [
  { name: 'BackgroundImageUrl', label: 'Background Image URL' },
  { name: 'Eyebrow', label: 'Eyebrow' },
  { name: 'Header', label: 'Header' },
  { name: 'Subheader', label: 'Subheader' },
  { name: 'CallToActionText', label: 'CTA Text' },
];

// Market Insights = 3 cards, modeled as ONE PP PER CARD. WPM's element-override
// editor caps at ~5 mapped elements per Personalization Point; a single 12-attr
// card PP can't be fully wired, so each card is its own PP with 4 attributes
// (Image/Category/Title/Body) — comfortably under the cap and fully authorable.
const CARD_COUNT = 3;
const CARD_ATTRS = [
  { name: 'Image', label: 'Image' },
  { name: 'Category', label: 'Category' },
  { name: 'Title', label: 'Title' },
  { name: 'Body', label: 'Body' },
];

// Hero + one schema/PP per Market Insights card. Card keys: card1..card3.
const cardKey = (n) => `card${n}`;

const SCHEMA_DEFS = [
  { key: 'heroBanner', label: 'Web - Hero Banner', attributes: HERO_ATTRS },
];
for (let i = 1; i <= CARD_COUNT; i += 1) {
  SCHEMA_DEFS.push({ key: cardKey(i), label: `Web - Insight Card ${i}`, attributes: CARD_ATTRS });
}

// Real experiences on the adaptive-web page. Each PP binds to a Content Schema +
// a real content zone (see html/inject-sdk.js CONTENT_ZONES):
//   homepage_hero    -> #warm-homepage-section
//   market_insight_n -> #warm-insight-n   (one per card)
const PP_DEFS = [
  { key: 'homepageHero', label: 'Web - Homepage Hero', schemaKey: 'heroBanner', zone: 'homepage_hero' },
];
for (let i = 1; i <= CARD_COUNT; i += 1) {
  PP_DEFS.push({
    key: cardKey(i),
    label: `Web - Insight Card ${i}`,
    schemaKey: cardKey(i),
    zone: `market_insight_${i}`,
    cardIndex: i,
  });
}

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
    '.sfdcep-banner-eyebrow{font-size:14px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#fff;text-align:center;padding-bottom:12px;text-shadow:0 1px 4px rgba(0,0,0,.4);}',
    '</style>',
    "<div class=\"sfdcep-banner\" style=\"background:url('{{subVar 'BackgroundImageUrl'}}') no-repeat center/cover;\">",
    "  <div class=\"sfdcep-banner-eyebrow\">{{subVar 'Eyebrow'}}</div>",
    "  <div class=\"sfdcep-banner-header\">{{subVar 'Header'}}</div>",
    "  <div class=\"sfdcep-banner-subheader\">{{subVar 'Subheader'}}</div>",
    '</div>',
  ].join('\n');
}

// SchemaPath substitution definitions for an arbitrary attribute list — each
// subVar maps 1:1 to a schema attribute via [attributes].[<name>].
function substitutionDefinitionsFor(attrs) {
  const defs = {};
  for (const a of attrs) {
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

function heroSubstitutionDefinitions() {
  return substitutionDefinitionsFor(HERO_ATTRS);
}

// Single Market-Insights CARD transformer — one card, bound to one card zone
// (#warm-insight-n). Mirrors the page's .home-insight-card markup (image +
// eyebrow/category + title + body). subVars map to the card schema's
// {Image,Category,Title,Body} attributes. Shared by all 3 card PPs.
function insightCardTransformerHtml() {
  return [
    '<style>',
    '.sfdcep-insight-card{display:flex;flex-direction:column;overflow:hidden;border:1px solid #e2e8f0;border-radius:1rem;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.06);font-family:Arial,Helvetica,sans-serif;}',
    '.sfdcep-insight-img{aspect-ratio:16/10;overflow:hidden;background:#f1f5f9;}',
    '.sfdcep-insight-img img{width:100%;height:100%;object-fit:cover;}',
    '.sfdcep-insight-body{padding:1.5rem;}',
    '.sfdcep-insight-eyebrow{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#008b7d;margin-bottom:.5rem;}',
    '.sfdcep-insight-title{font-size:18px;font-weight:600;color:#0f172a;margin:0;}',
    '.sfdcep-insight-text{font-size:14px;line-height:1.6;color:#475569;margin-top:.75rem;}',
    '</style>',
    '<article class="sfdcep-insight-card">',
    "  <div class=\"sfdcep-insight-img\"><img src=\"{{subVar 'Image'}}\" alt=\"\" /></div>",
    '  <div class="sfdcep-insight-body">',
    "    <div class=\"sfdcep-insight-eyebrow\">{{subVar 'Category'}}</div>",
    "    <h3 class=\"sfdcep-insight-title\">{{subVar 'Title'}}</h3>",
    "    <p class=\"sfdcep-insight-text\">{{subVar 'Body'}}</p>",
    '  </div>',
    '</article>',
  ].join('\n');
}

// Build the personalized-hero attribute values. Prefer content EXTRACTED from
// the uploaded/rendered HTML (the warm "Welcome back" hero the sim renders after
// form-fill) so the WPM swap shows the real creative; fall back to the form
// config when there's no HTML. The hero image is often a base64 data URI in the
// uploaded file, so we host it on Cloudinary and store the returned URL (a
// decision attribute can't hold a multi-hundred-KB blob). Async because of the
// upload.
async function heroDecisionAttributeValues(demoName, formData, uploadedHtml) {
  let image = '';
  let eyebrow = '';
  let header = '';
  let subheader = '';
  let cta = '';

  // 1) Preferred: extract from the uploaded HTML's personalized hero.
  const hero = uploadedHtml ? extractHeroContent(uploadedHtml) : null;
  if (hero) {
    image = (hero.image || '').trim();
    // Keep the eyebrow ("Welcome back, <name>") as its OWN value — the hero has
    // a distinct eyebrow DOM element, so mapping it 1:1 (not merged into Header)
    // makes the WPM swap land in the right boxes.
    eyebrow = (hero.eyebrow || '').trim();
    header = (hero.header || '').trim();
    subheader = (hero.subheader || '').trim();
    cta = (hero.cta || '').trim();
  }

  // 2) Fallback: form-config path (when a demo is built via the form).
  if (!image && !header) {
    const fd = formData || {};
    const story = (() => {
      try {
        return getMergedAdaptiveStory(fd) || {};
      } catch (_) {
        return {};
      }
    })();
    image = image || String(fd.adaptiveHeroImageUrl || fd.adaptiveColdHeroUrl || '').trim();
    header = header || String(story.landingPageTitle || story.vanillaHeroTitle || '').trim();
    subheader = subheader || String(story.landingPageSubtitle || story.vanillaHeroSubtext || '').trim();
    cta = cta || String(story.homepageCtaText || story.intentTriggerText || 'Learn more').trim();
  }

  // Host the image: base64 data URIs get uploaded to Cloudinary and swapped for
  // the CDN URL; existing http(s) URLs pass through unchanged; a failed/unconfig
  // upload drops the image (rest of the decision still lands).
  if (image) {
    const hosted = await uploadHeroImage(image, { publicId: `sp-demo/${apiName(demoName)}-hero` });
    image = hosted || (/^https?:\/\//i.test(image) ? image : '');
  }

  const values = [
    { attributeName: 'BackgroundImageUrl', value: image },
    { attributeName: 'Eyebrow', value: eyebrow },
    { attributeName: 'Header', value: header },
    { attributeName: 'Subheader', value: subheader },
    { attributeName: 'CallToActionText', value: cta },
  ];
  return values.filter((v) => v.value);
}

// Build ONE card's decision values (Image/Category/Title/Body) from the uploaded
// HTML's warm cards. cardIndex is 1-based. The thumbnail is hosted on Cloudinary
// (like the hero) so the decision carries a real URL, not a base64 blob.
async function cardDecisionAttributeValues(demoName, uploadedHtml, cardIndex) {
  const cards = (uploadedHtml && extractInsightCards(uploadedHtml)) || [];
  const c = cards[cardIndex - 1] || {};
  let image = String(c.image || '').trim();
  if (image) {
    const hosted = await uploadHeroImage(image, {
      publicId: `sp-demo/${apiName(demoName)}-insight-${cardIndex}`,
    });
    image = hosted || (/^https?:\/\//i.test(image) ? image : '');
  }
  const values = [
    { attributeName: 'Image', value: image },
    { attributeName: 'Category', value: String(c.category || '').trim() },
    { attributeName: 'Title', value: String(c.title || '').trim() },
    { attributeName: 'Body', value: String(c.body || '').trim() },
  ];
  return values.filter((v) => v.value);
}

// Decisions per PP. Both experiences get a personalized decision built from the
// uploaded HTML's warm content, so the WPM swap shows the real creative. Async
// (image hosting). A demo with no uploaded HTML yields empty-value decisions
// that WPM can still bind + author.
async function decisionsFor(def, demoName, formData, uploadedHtml) {
  if (def.key === 'homepageHero') {
    return [
      {
        name: apiName(prefixed(demoName, 'Personalized Hero')),
        label: 'Personalized Hero',
        attributeValues: await heroDecisionAttributeValues(demoName, formData, uploadedHtml),
        state: 'Live',
      },
    ];
  }
  if (def.cardIndex) {
    return [
      {
        name: apiName(prefixed(demoName, `Personalized Card ${def.cardIndex}`)),
        label: `Personalized Card ${def.cardIndex}`,
        attributeValues: await cardDecisionAttributeValues(demoName, uploadedHtml, def.cardIndex),
        state: 'Live',
      },
    ];
  }
  return [
    {
      name: apiName(prefixed(demoName, `${def.key} Default`)),
      label: 'Default',
      attributeValues: [],
      state: 'Live',
    },
  ];
}

// deploy(conn, { demoName, dataSpaceName?, profileDataGraphName, connector, formData })
//   -> { mode:'deployed', connector, artifacts } | throws on hard failure
// artifacts: { schemas:[{name,id}], transformers:[{name,id}], pps:[{name,id,zone}], dataSpaceName, connector }
// `connector` is the Website connector id (UUID) or a pasted beacon <script src>;
// it drives the live Web SDK beacon (see html/inject-sdk.js). Stored verbatim so
// the beacon can be (re)built; empty is allowed (page renders, beacon commented).
async function deploy(conn, opts) {
  const { demoName, profileDataGraphName, formData, connector, uploadedHtml } = opts || {};
  if (!demoName) throw new Error('deploy: demoName is required');
  if (!profileDataGraphName) throw new Error('deploy: profileDataGraphName is required');
  const dataSpaceName = (opts && opts.dataSpaceName) || DEFAULT_DATA_SPACE;

  const connectorValue = (connector || '').trim() || null;

  const artifacts = { schemas: [], transformers: [], pps: [], dataSpaceName, connector: connectorValue };

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

    // 2. Transformers — hero + one per Market Insights card, each bound to its
    //    schema. Card transformers all use the same single-card HTML/subVars.
    const TRANSFORMER_DEFS = [
      {
        schemaKey: 'heroBanner',
        label: 'Web - Hero Experience Template',
        substitutionDefinitions: heroSubstitutionDefinitions(),
        html: heroTransformerHtml(),
      },
    ];
    for (let i = 1; i <= CARD_COUNT; i += 1) {
      TRANSFORMER_DEFS.push({
        schemaKey: cardKey(i),
        label: `Web - Insight Card ${i} Template`,
        substitutionDefinitions: substitutionDefinitionsFor(CARD_ATTRS),
        html: insightCardTransformerHtml(),
      });
    }
    for (const def of TRANSFORMER_DEFS) {
      const name = apiName(prefixed(demoName, def.label));
      const t = await p13n.createTransformer(conn, {
        name,
        label: prefixed(demoName, def.label),
        dataSpace: dataSpaceName,
        schemaReference: schemaNameByKey[def.schemaKey],
        substitutionDefinitions: def.substitutionDefinitions,
        html: def.html,
      });
      artifacts.transformers.push({ name, id: t.id, schemaKey: def.schemaKey });
    }

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
        decisions: await decisionsFor(def, demoName, formData, uploadedHtml),
      });
      artifacts.pps.push({ key: def.key, name, id: created.id, zone: def.zone });
    }

    return { mode: 'deployed', connector: connectorValue, artifacts };
  } catch (err) {
    // Partial-deploy rollback: a demo is all-or-nothing. Remove whatever we
    // created (reverse dependency order) so the org isn't left with orphans and
    // a retry with the same name won't collide with "already exists". Rollback
    // failures are collected but never mask the original error.
    //
    // Build a FRESH Error rather than mutating `err` — jsforce may throw a
    // string or a frozen object, and assigning to it would throw a TypeError
    // that escapes as a generic 500, hiding the real cause.
    const baseMsg = (err && err.message) || String(err);
    let rollback = { removed: [], orphans: [] };
    try {
      rollback = await rollbackArtifacts(conn, artifacts);
    } catch (rbErr) {
      rollback.orphans.push({ reason: `rollback crashed: ${(rbErr && rbErr.message) || rbErr}` });
    }
    const suffix = rollback.orphans.length
      ? ` [rollback left ${rollback.orphans.length} object(s) — remove manually]`
      : ' [created objects rolled back]';
    const wrapped = new Error(`${baseMsg}${suffix}`);
    wrapped.rollback = rollback;
    throw wrapped;
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
