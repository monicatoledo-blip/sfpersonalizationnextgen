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

// Build the live beacon script URL from the org's tenant-specific endpoint.
// getOrgInfo returns dcTse as a bare host (e.g. "mfq...-gnt...c360a.salesforce.com");
// tolerate a value that already includes a scheme.
function beaconUrlFromDcTse(dcTse) {
  if (!dcTse) return null;
  // Sanitize to a bare hostname: drop scheme, any path, and any stray
  // characters a paste may include (e.g. a trailing ")" or whitespace). A
  // hostname is only letters, digits, dots and hyphens.
  let host = String(dcTse).trim().replace(/^https?:\/\//, '');
  host = host.split('/')[0]; // strip any path
  const m = host.match(/[A-Za-z0-9.-]+/); // first valid hostname run
  host = m ? m[0].replace(/\.+$/, '') : '';
  if (!host) return null;
  return `https://${host}/scripts/c360a.min.js`;
}

// opts:
//   dcTse:     Data Cloud tenant-specific endpoint (from p13n.getOrgInfo). When
//              present, the LIVE beacon is injected so WPM (?sf_personalization_wpm)
//              can attach. When absent, the beacon is commented out so the page
//              still renders and can be regenerated once the org is known.
//   dataSpace: the Data Cloud data space the PPs live in (default 'default').
//              WPM lists a page's PPs by the data space declared in the sitemap.
function buildSnippet({ dcTse, dataSpace } = {}) {
  const sitemap = {
    dataSpace: dataSpace || 'default',
    global: {
      contentZones: CONTENT_ZONES,
    },
  };

  const beaconUrl = beaconUrlFromDcTse(dcTse);
  const beacon = beaconUrl
    ? `<script src="${beaconUrl}"></script>`
    : `<!-- Data Cloud Web SDK beacon: set the org's tenant endpoint (dcTse) to enable.
     <script src="https://{{dcTse}}/scripts/c360a.min.js"></script> -->`;

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

module.exports = { injectSdk, buildSnippet, beaconUrlFromDcTse, CONTENT_ZONES };
