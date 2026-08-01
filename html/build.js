'use strict';

// Renders the adaptive-web template by applying the ported token-substitution
// generator (data/generator.js) to the copied template. The SDK/sitemap is
// injected separately by html/inject-sdk.js. Any [[TOKEN]] the generator does
// not fill is blanked so no raw placeholder ever reaches the served HTML.

const fs = require('fs');
const path = require('path');
const { applyAdaptiveWebTemplateReplacements } = require('../data/generator');

const TEMPLATE_PATH = path.join(__dirname, 'templates', 'adaptive-web.html');

let _templateCache = null;
function loadTemplate() {
  if (_templateCache == null) {
    _templateCache = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  }
  return _templateCache;
}

// Blank any leftover placeholders the generator did not map (defensive).
function stripUnmappedTokens(html) {
  return html.replace(/\[\[[A-Z0-9_]+\]\]/g, (match) => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[html/build] unmapped token ${match} -> blanked`);
    }
    return '';
  });
}

// render(formData) -> HTML string (SDK not yet injected).
// formData keys mirror the browser form field IDs (adaptiveBrandName,
// adaptiveWebSubIndustry, adaptiveWebSubUseCase, adaptivePrimaryColor, etc.).
function render(formData = {}) {
  const template = loadTemplate();
  const filled = applyAdaptiveWebTemplateReplacements(template, formData);
  return stripUnmappedTokens(filled);
}

module.exports = { render, loadTemplate, stripUnmappedTokens };
