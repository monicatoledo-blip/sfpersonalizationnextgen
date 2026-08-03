'use strict';

// Extracts the personalized hero content from a rendered/uploaded adaptive-web
// HTML file, so the deployer can put REAL content (image + copy) into the
// Personalization Decision — making the WPM swap show the actual creative
// instead of an empty banner.
//
// Targets the WARM (personalized) hero: #warm-homepage-section, which renders
// "Welcome back, <name>" + headline + subtext + a personalized image. Falls
// back to #cold-hero-section if the warm block isn't present. Regex-based (no
// DOM dependency) — tolerant of attribute order and whitespace.

// Return the innerHTML of the first element carrying id="<id>" (best-effort:
// from the id to a reasonably-scoped closing region). We don't need perfect
// parsing — just enough to find the img src and the first heading/paragraph.
function sliceById(html, id) {
  const re = new RegExp(`id=["']${id}["'][^>]*>`, 'i');
  const m = re.exec(html);
  if (!m) return null;
  const start = m.index + m[0].length;
  // Take a generous window after the opening tag; the hero fields are near the top.
  return html.slice(start, start + 8000);
}

function firstMatch(re, s) {
  const m = s && re.exec(s);
  return m ? m[1] : '';
}

// Strip tags + collapse whitespace + decode a few common entities.
function textOnly(s) {
  return String(s || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&mdash;/g, '—')
    .replace(/\s+/g, ' ')
    .trim();
}

// extractHeroContent(html) -> { image, header, subheader, eyebrow, cta } | null
// Values are best-effort; missing pieces come back as ''. Returns null only if
// no recognizable hero block is found at all.
function extractHeroContent(html) {
  if (!html || typeof html !== 'string') return null;
  const zone = sliceById(html, 'warm-homepage-section') || sliceById(html, 'cold-hero-section');
  if (!zone) return null;

  const image = firstMatch(/<img[^>]*\bsrc=["']([^"']+)["']/i, zone).trim();
  const header = textOnly(firstMatch(/<h1[^>]*>([\s\S]*?)<\/h1>/i, zone));
  const subheader = textOnly(firstMatch(/<p[^>]*>([\s\S]*?)<\/p>/i, zone));
  // Eyebrow is often the very first <p> ("Welcome back, ..."); the subtext is a
  // later <p>. Grab all <p> to disambiguate.
  const paras = [];
  const pRe = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let pm;
  while ((pm = pRe.exec(zone)) && paras.length < 4) paras.push(textOnly(pm[1]));
  const eyebrow = paras[0] || '';
  const realSub = paras.find((p) => p && p !== eyebrow) || subheader;
  // CTA: prefer an <a>/<button> label.
  const cta = textOnly(
    firstMatch(/<a[^>]*>([\s\S]*?)<\/a>/i, zone) || firstMatch(/<button[^>]*>([\s\S]*?)<\/button>/i, zone)
  );

  if (!image && !header && !realSub) return null;
  return { image, header, subheader: realSub, eyebrow, cta };
}

// extractInsightCards(html) -> [{ image, category, title, body }, ...] | null
// Pulls the WARM "Market Insights" cards (#warm-insights-grid) so the deployer
// can put the real personalized cards into the Market Insights decision. Each
// card is an <article class="home-insight-card"> with: an <img>, an eyebrow
// <div> (category), an <h3> (title), and a <p> (body). Regex-based, tolerant of
// attribute order. Returns up to 3 cards; null if the grid isn't found.
function extractInsightCards(html) {
  if (!html || typeof html !== 'string') return null;
  // Scope to the warm cards grid; take a generous window covering 3 cards.
  const gridRe = /id=["']warm-insights-grid["'][^>]*>/i;
  const gm = gridRe.exec(html);
  let scope;
  if (gm) {
    const start = gm.index + gm[0].length;
    scope = html.slice(start, start + 12000);
  } else {
    // Fallback: within the warm homepage section, after the "Market Insights"
    // heading (covers files generated before the grid id was added).
    const warm = sliceById(html, 'warm-homepage-section');
    if (!warm) return null;
    const mi = warm.search(/Market Insights/i);
    scope = mi >= 0 ? warm.slice(mi, mi + 12000) : warm;
  }

  // Split into <article ...>...</article> blocks (the cards).
  const cards = [];
  const artRe = /<article\b[^>]*>([\s\S]*?)<\/article>/gi;
  let am;
  while ((am = artRe.exec(scope)) && cards.length < 3) {
    const block = am[1];
    const image = firstMatch(/<img[^>]*\bsrc=["']([^"']+)["']/i, block).trim();
    // The eyebrow/category is the small uppercase <div> in the card body — NOT
    // the first <div> (that's the image wrapper). Match the div sitting just
    // before the <h3> title; fall back to the "uppercase" utility class.
    let category = textOnly(firstMatch(/<div[^>]*>([^<]*?)<\/div>\s*<h3\b/i, block));
    if (!category) category = textOnly(firstMatch(/<div[^>]*\buppercase\b[^>]*>([\s\S]*?)<\/div>/i, block));
    const title = textOnly(firstMatch(/<h3[^>]*>([\s\S]*?)<\/h3>/i, block));
    const body = textOnly(firstMatch(/<p[^>]*>([\s\S]*?)<\/p>/i, block));
    if (image || title || body) cards.push({ image, category, title, body });
  }
  return cards.length ? cards : null;
}

module.exports = { extractHeroContent, extractInsightCards };
