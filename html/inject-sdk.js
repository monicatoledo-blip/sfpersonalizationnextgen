'use strict';

// Injects the Data Cloud Web SDK <script> and a sitemap content-zone init into
// the <head> of the rendered adaptive-web HTML.
//
// Content zones — every stable, personalizable surface of the adaptive-web sim,
// derived from the generator's [[TOKEN]] map + the template's stable ids/classes.
// A content zone = a stable DOM element WPM can target/replace. Only anchors with
// a reliable id/class are included (position-only surfaces are intentionally
// omitted so WPM never binds to a moving target).
//
// The three the deployer creates PPs for today:
//   homepage_hero     -> #warm-homepage-section
//   recommended_cards -> .floating-cards-container
//   category_hero     -> #cat-hero
// The rest are advertised in the sitemap so an SE can bind additional experiences
// in WPM without editing the page.
const CONTENT_ZONES = [
  // Homepage — cold (first-visit) and warm (returning) hero states.
  { name: 'cold_homepage_hero', selector: '#cold-hero-section' },
  { name: 'homepage_hero', selector: '#warm-homepage-section' },
  { name: 'home_flow', selector: '#home-flow-sections' },
  // Recommendations grid (adaptive overlay).
  { name: 'recommended_cards', selector: '.floating-cards-container' },
  // Category page surfaces.
  { name: 'category_page', selector: '#categoryPageContainer' },
  { name: 'category_hero', selector: '#cat-hero' },
  { name: 'category_core_services', selector: '#cat-core-services' },
  { name: 'category_why_us', selector: '#cat-why-us' },
  { name: 'category_insights', selector: '#cat-insights' },
  // Landing page + lead-capture form.
  { name: 'landing_page', selector: '#landingPageContainer' },
  { name: 'contact_form', selector: '#contactForm' },
  // Global chrome.
  { name: 'nav_logo', selector: '#navHomeLogoLink' },
  { name: 'chat_widget', selector: '#chatWidget' },
];

// Build the live Data Cloud Web SDK beacon URL.
//
// The beacon lives on the CDN keyed by the WEBSITE CONNECTOR id (a UUID), NOT
// the tenant-specific endpoint host:
//   https://cdn.c360a.salesforce.com/beacon/c360a/<connectorId>/scripts/c360a.min.js
// (verified against the meshmesh SDO — the connector's own snippet, HTTP 200.)
//
// Accepts, in order of preference:
//   1. a full beacon URL pasted from the connector's install snippet
//      (https://cdn.c360a.salesforce.com/beacon/c360a/<uuid>/scripts/c360a.min.js)
//   2. a bare connector UUID (cec9b1f4-0e16-4c62-923d-afd61d237da0)
// Returns null if we can't derive a usable beacon URL.
const CDN_BEACON = (id) => `https://cdn.c360a.salesforce.com/beacon/c360a/${id}/scripts/c360a.min.js`;
const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

function beaconUrlFromConnector(input) {
  if (!input) return null;
  const s = String(input).trim();
  // If a full beacon URL was pasted (optionally wrapped in a <script src="...">),
  // pull the src and use it as-is when it points at the c360a beacon path.
  const srcMatch = s.match(/https?:\/\/[^\s"')<>]*c360a[^\s"')<>]*c360a\.min\.js/i);
  if (srcMatch) return srcMatch[0];
  // Otherwise, extract a connector UUID and build the CDN URL.
  const id = s.match(UUID_RE);
  if (id) return CDN_BEACON(id[0]);
  return null;
}

// opts:
//   connector: the Website connector id (UUID) or a full beacon <script src>
//              pasted from the connector's install snippet. When present, the
//              LIVE beacon is injected so WPM (?sf_personalization_wpm) can
//              attach. When absent, the beacon is commented out so the page
//              still renders and can be regenerated once the connector is known.
//   dataSpace: the Data Cloud data space the PPs live in (default 'default').
//              REQUIRED for WPM: the implementation guide (p.60) states the
//              "Select a Personalization Point" modal lists PPs "configured in
//              the data space that is defined in the sitemap" — omit it and the
//              picker shows "No Personalization Points found".
function buildSnippet({ connector, dataSpace } = {}) {
  // init() with no args, then initSitemap(config) with content zones under
  // global + a default page type (single-page app => Default/global). The data
  // space is declared on the sitemap so WPM can populate its PP picker.
  const config = {
    dataspace: dataSpace || 'default',
    global: {
      contentZones: CONTENT_ZONES,
    },
    pageTypeDefault: { name: 'Default' },
  };

  const beaconUrl = beaconUrlFromConnector(connector);
  const beacon = beaconUrl
    ? `<script src="${beaconUrl}"></script>`
    : `<!-- Data Cloud Web SDK beacon: set the Website connector id to enable.
     <script src="https://cdn.c360a.salesforce.com/beacon/c360a/{{connectorId}}/scripts/c360a.min.js"></script> -->`;

  return `
${beacon}
<script>
  // SP Demo Builder — sitemap content zones for WPM / Personalization.
  (function initSalesforceInteractions() {
    function boot() {
      if (typeof SalesforceInteractions === 'undefined') return;
      var config = ${JSON.stringify(config, null, 6)};
      SalesforceInteractions.init().then(function () {
        SalesforceInteractions.initSitemap(config);
      }).catch(function (e) { console.error('[SP Demo] SalesforceInteractions.init failed', e); });
    }
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      boot();
    } else {
      document.addEventListener('DOMContentLoaded', boot);
    }
  })();
</script>
`;
}

// Insert the snippet just before </head>. Falls back to prepending to <body>
// if no </head> is present. Idempotent: if this app's sitemap init is already
// present (e.g. re-uploading a file we produced), return the HTML unchanged.
function injectSdk(html, opts = {}) {
  if (/SalesforceInteractions\.init/.test(html)) return html;
  const snippet = buildSnippet(opts);
  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, `${snippet}\n</head>`);
  }
  if (/<body[^>]*>/i.test(html)) {
    return html.replace(/(<body[^>]*>)/i, `$1\n${snippet}`);
  }
  return snippet + html;
}

module.exports = { injectSdk, buildSnippet, beaconUrlFromConnector, CONTENT_ZONES };
