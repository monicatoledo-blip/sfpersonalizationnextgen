'use strict';

// Injects the Data Cloud Web SDK <script> and a sitemap content-zone init into
// the <head> of the rendered adaptive-web HTML.
//
// Content zones (fixed — must match the template surfaces and the PP names the
// deployer creates):
//   homepage_hero     -> #warm-homepage-section    -> PP "Web - Homepage Hero"
//   recommended_cards -> .floating-cards-container  -> PP "Web - Recommended Cards"
//   category_hero     -> #cat-hero                  -> PP "Web - Category Hero"

const CONTENT_ZONES = [
  { name: 'homepage_hero', selector: '#warm-homepage-section' },
  { name: 'recommended_cards', selector: '.floating-cards-container' },
  { name: 'category_hero', selector: '#cat-hero' },
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
//              WPM lists a page's PPs by the data space declared in the sitemap.
function buildSnippet({ connector, dataSpace } = {}) {
  const sitemap = {
    dataSpace: dataSpace || 'default',
    global: {
      contentZones: CONTENT_ZONES,
    },
  };

  const beaconUrl = beaconUrlFromConnector(connector);
  const beacon = beaconUrl
    ? `<script src="${beaconUrl}"></script>`
    : `<!-- Data Cloud Web SDK beacon: set the Website connector id to enable.
     <script src="https://cdn.c360a.salesforce.com/beacon/c360a/{{connectorId}}/scripts/c360a.min.js"></script> -->`;

  return `
${beacon}
<script>
  // SP Demo Builder — sitemap content zones + data space for WPM / Personalization.
  (function initSalesforceInteractions() {
    function boot() {
      if (typeof SalesforceInteractions === 'undefined') return;
      SalesforceInteractions.init({
        sitemap: ${JSON.stringify(sitemap, null, 6)}
      });
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
