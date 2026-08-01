'use strict';

// Injects the Data Cloud Web SDK <script> and a sitemap content-zone init into
// the <head> of the rendered adaptive-web HTML.
//
// Content zones (fixed — must match the template surfaces and the PP names the
// deployer creates):
//   homepage_hero     -> #warm-homepage-section  -> PP "Web - Homepage Hero"
//   recommended_cards -> .floating-cards-container -> PP "Web - Recommended Cards"
//   category_hero     -> #cat-hero               -> PP "Web - Category Hero"

const CONTENT_ZONES = [
  { name: 'homepage_hero', selector: '#warm-homepage-section' },
  { name: 'recommended_cards', selector: '.floating-cards-container' },
  { name: 'category_hero', selector: '#cat-hero' },
];

// tenantId: the Data Cloud Web SDK beacon tenant/connector id for the org.
// If not yet known (Website Connector is a one-time manual step per SDO), we
// still inject the sitemap init but comment the beacon so the page renders and
// the SE can paste the tenant id in later without a redeploy.
function buildSnippet({ tenantId } = {}) {
  const sitemap = {
    global: {
      contentZones: CONTENT_ZONES,
    },
  };

  const beacon = tenantId
    ? `<script src="https://cdn.c360a.salesforce.com/beacon/c360a/${tenantId}/scripts/c360a.min.js"></script>`
    : `<!-- Data Cloud Web SDK beacon: set the Website Connector tenant id for this SDO to enable.
     <script src="https://cdn.c360a.salesforce.com/beacon/c360a/{{tenantId}}/scripts/c360a.min.js"></script> -->`;

  return `
${beacon}
<script>
  // SP Demo Builder — sitemap content zones for WPM / Personalization.
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

module.exports = { injectSdk, buildSnippet, CONTENT_ZONES };
