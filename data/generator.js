'use strict';

// Server-side port of the Adaptive Web token-substitution generator from
// experience-simulator/public/script.js. The browser version reads live DOM
// (document.getElementById(id).value); here every read is against a plain
// formData object whose keys are the SAME field IDs the browser form uses.
//
// Pure functions (resolvers, escapers, HTML builders) are ported verbatim.
// DOM-reading functions are adapted to formData: g(id, fallback) reads
// formData[id]. Cloudinary/upload/DOM-mutation helpers are intentionally omitted
// (browser-only, irrelevant to server rendering).

const { ADAPTIVE_GENERIC_AGENT_GREETING, ADAPTIVE_WEB_COPY_BY_SUB_INDUSTRY } = require('./copy');
const { CUMULUS_ASSET_LIBRARY } = require('./assets');
const { ADAPTIVE_MATRIX_OVERRIDES } = require('./matrix');

// --- Default image constants (verbatim) ---------------------------------------
const DEFAULT_ADAPTIVE_HERO_IMAGE =
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80';
const DEFAULT_ADAPTIVE_NAV_LOGO =
  'https://cumulusfinserv-ad61ddfc9e8c.herokuapp.com/images/cumulus-logo.png';
const DEFAULT_ADAPTIVE_COLD_HERO_IMAGE =
  'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?auto=format&fit=crop&w=800&q=80';
const DEFAULT_ADAPTIVE_INSIGHT_IMG_1 =
  'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=900&q=80';
const DEFAULT_ADAPTIVE_INSIGHT_IMG_2 =
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80';
const DEFAULT_ADAPTIVE_INSIGHT_IMG_3 =
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80';

// --- Escapers / sanitizers (verbatim) -----------------------------------------
function escapeHtmlForAdaptive(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeHtmlAttributeValue(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function sanitizeAdaptiveHexColor(value, fallback) {
  const t = (value || '').trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(t)) return t;
  return fallback;
}

function getBrandInitials(brandName) {
  const words = (brandName || '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'CB';
  if (words.length === 1) {
    const w = words[0];
    return w.length >= 2 ? w.slice(0, 2).toUpperCase() : (w.charAt(0) + w.charAt(0)).toUpperCase();
  }
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

// Server variant: the data library holds absolute Cloudinary URLs; relative
// paths (which the browser resolved against window.location) are passed through
// unchanged since there is no page origin on the server.
function resolveCumulusAssetUrl(rel) {
  if (rel == null || rel === '') return '';
  const s = String(rel).trim();
  if (/^https?:\/\//i.test(s)) return s;
  return s.replace(/^\.\//, '');
}

// Agent icon: served by this app's public/ dir; consumers embed the app base URL.
function getAdaptiveWebAgentIconSrc() {
  const base = (process.env.APP_BASE_URL || '').replace(/\/$/, '');
  return base ? `${base}/agentforce-astro-agent.png` : 'agentforce-astro-agent.png';
}

// --- Industry / use-case resolution (verbatim except DOM) ----------------------
function getAdaptiveIndustryRecord(industryKey) {
  return (
    ADAPTIVE_WEB_COPY_BY_SUB_INDUSTRY[industryKey] || ADAPTIVE_WEB_COPY_BY_SUB_INDUSTRY.retailBanking
  );
}

function resolveAdaptiveUseCaseKey(industryRecord, requestedKey) {
  const uc = industryRecord.useCases;
  if (!uc || typeof uc !== 'object') return 'default';
  const keys = Object.keys(uc);
  if (keys.length === 0) return 'default';
  if (requestedKey && uc[requestedKey]) return requestedKey;
  return keys[0];
}

// Adapted: reads from formData only (no live DOM on the server).
function getAdaptiveUseCaseBundle(formData) {
  const ind = (formData && formData.adaptiveWebSubIndustry) || 'retailBanking';
  const industry = getAdaptiveIndustryRecord(ind);
  const requested = (formData && formData.adaptiveWebSubUseCase) || '';
  const useKey = resolveAdaptiveUseCaseKey(industry, requested);
  const useCase = (industry.useCases && industry.useCases[useKey]) || {};
  return { ind, industry, useKey, useCase };
}

// --- Persona (adapted: formData-only) -----------------------------------------
function getAdaptivePersona(formData) {
  const pick = (dataKey, fallback) => {
    if (formData && formData[dataKey] != null && String(formData[dataKey]).trim()) {
      return String(formData[dataKey]).trim();
    }
    return fallback;
  };
  return {
    firstName: pick('adaptivePersonaFirstName', 'Rachel'),
    lastName: pick('adaptivePersonaLastName', 'Morris'),
    email: pick('adaptivePersonaEmail', 'rmorris@example.com'),
    phone: pick('adaptivePersonaPhone', '555-0198'),
    company: pick('adaptivePersonaCompany', 'Acme Corp'),
    zipCode: pick('adaptivePersonaZip', '94105'),
    brandName: pick('adaptiveBrandName', 'Cumulus Bank'),
  };
}

function interpolateAdaptivePersona(str, persona) {
  if (str == null) return '';
  const bn = persona.brandName != null ? String(persona.brandName) : '';
  return String(str)
    .replace(/\[\[CUSTOMER_FIRST_NAME\]\]/g, persona.firstName)
    .replace(/\$\{firstName\}/g, persona.firstName)
    .replace(/\$\{lastName\}/g, persona.lastName)
    .replace(/\$\{email\}/g, persona.email)
    .replace(/\$\{phone\}/g, persona.phone)
    .replace(/\$\{company\}/g, persona.company)
    .replace(/\$\{zipCode\}/g, persona.zipCode)
    .replace(/\$\{brandName\}/g, bn);
}

// --- Asset pack + insight merges (verbatim) -----------------------------------
function mergeCategoryPageWithCumulus(industryKey, baseCategoryPage) {
  const pack = CUMULUS_ASSET_LIBRARY[industryKey] || CUMULUS_ASSET_LIBRARY.retailBanking;
  if (!pack || !baseCategoryPage) return baseCategoryPage;
  const cold = resolveCumulusAssetUrl(pack.coldHero);
  const warm = resolveCumulusAssetUrl(pack.warmHero);
  return {
    ...baseCategoryPage,
    ...(cold ? { heroBgImage: cold } : {}),
    ...(warm ? { whyChooseUsImage: warm } : {}),
  };
}

function getResolvedHeroAssetPack(industryKey, useCaseRecord) {
  const base = CUMULUS_ASSET_LIBRARY[industryKey] || CUMULUS_ASSET_LIBRARY.retailBanking;
  const over = (useCaseRecord && useCaseRecord.heroAssets) || {};
  const pick = (k) => {
    const v = over[k];
    const t = v != null ? String(v).trim() : '';
    if (t) return t;
    const b = base[k];
    return b != null ? String(b).trim() : '';
  };
  const coldBase = base.coldHero != null ? String(base.coldHero).trim() : '';
  const coldFromCase = over.coldHero != null ? String(over.coldHero).trim() : '';
  const coldHero = coldFromCase || coldBase;

  const warmHero = pick('warmHero');
  const insight1 = pick('insight1');
  const insight2 = pick('insight2');
  const insight3 = pick('insight3');

  const wt1 = over.warmTile1 != null ? String(over.warmTile1).trim() : '';
  const wt2 = over.warmTile2 != null ? String(over.warmTile2).trim() : '';
  const wt3 = over.warmTile3 != null ? String(over.warmTile3).trim() : '';
  const warmTile1 = wt1 || warmHero;
  const warmTile2 = wt2 || insight2;
  const warmTile3 = wt3 || insight3;

  return { coldHero, warmHero, insight1, insight2, insight3, warmTile1, warmTile2, warmTile3 };
}

function mergeHomeMarketInsightsForUseCase(industryRecord, useCaseRecord) {
  const baseHm =
    industryRecord.homeMarketInsights && typeof industryRecord.homeMarketInsights === 'object'
      ? industryRecord.homeMarketInsights
      : {};
  const overHm =
    useCaseRecord.homeMarketInsights && typeof useCaseRecord.homeMarketInsights === 'object'
      ? useCaseRecord.homeMarketInsights
      : {};
  const bc = Array.isArray(baseHm.cards) ? baseHm.cards : [];
  const oc = Array.isArray(overHm.cards) ? overHm.cards : [];
  const cards = [0, 1, 2].map((i) => ({ ...(bc[i] || {}), ...(oc[i] || {}) }));
  const sub =
    overHm.sectionSubtitle != null && String(overHm.sectionSubtitle).trim()
      ? String(overHm.sectionSubtitle).trim()
      : baseHm.sectionSubtitle || '';
  return { sectionSubtitle: sub, cards };
}

function mergeWarmMarketInsightsForUseCase(industryRecord, useCaseRecord) {
  const base = Array.isArray(industryRecord.warmInsights) ? industryRecord.warmInsights : [];
  const oc =
    useCaseRecord.warmMarketInsights && Array.isArray(useCaseRecord.warmMarketInsights.cards)
      ? useCaseRecord.warmMarketInsights.cards
      : [];
  return [0, 1, 2].map((i) => ({ ...(base[i] || {}), ...(oc[i] || {}) }));
}

// --- Matrix overrides: mutate copy lib once at module load (verbatim logic) ----
function applyAdaptiveMatrixOverrides() {
  Object.entries(ADAPTIVE_MATRIX_OVERRIDES).forEach(([industryKey, industryOverride]) => {
    const industry = ADAPTIVE_WEB_COPY_BY_SUB_INDUSTRY[industryKey];
    if (!industry || !industryOverride || !industryOverride.useCases) return;
    Object.entries(industryOverride.useCases).forEach(([useKey, over]) => {
      const useCase = industry.useCases && industry.useCases[useKey];
      if (!useCase || !over) return;
      if (over.heroAssets) {
        useCase.heroAssets = { ...(useCase.heroAssets || {}), ...over.heroAssets };
      }
      if (Array.isArray(over.cards)) {
        const baseCards = Array.isArray(useCase.cards) ? useCase.cards : [];
        useCase.cards = over.cards.map((c, idx) => ({
          ...(baseCards[idx] || {}),
          ...c,
          metrics: c.metrics != null ? c.metrics : baseCards[idx] && baseCards[idx].metrics,
          features: c.features != null ? c.features : baseCards[idx] && baseCards[idx].features,
        }));
      }
      if (over.homeMarketInsights) useCase.homeMarketInsights = over.homeMarketInsights;
      if (over.warmMarketInsights) useCase.warmMarketInsights = over.warmMarketInsights;
    });
  });
}
applyAdaptiveMatrixOverrides();

// --- Card model builder (adapted: formData card${n}_* keys) --------------------
function buildAdaptiveCardsFromMatrixInputs(fallbackCards, formData) {
  const fd = formData || {};
  const fb = Array.isArray(fallbackCards) ? fallbackCards : [];
  let chosenRec = -1;
  for (let i = 1; i <= 3; i++) {
    if (fd[`card${i}_bestMatch`]) {
      chosenRec = i - 1;
      break;
    }
  }
  if (chosenRec < 0) {
    chosenRec = fb.findIndex((c) => c.recommended);
    if (chosenRec < 0) chosenRec = 1;
  }
  const gv = (id, fallback) => {
    const v = fd[id];
    const t = v != null ? String(v).trim() : '';
    return t || fallback;
  };
  const out = [];
  for (let i = 0; i < 3; i++) {
    const n = i + 1;
    const p = `card${n}_`;
    const fbc = fb[i] || {};
    const metrics = [];
    for (let m = 1; m <= 3; m++) {
      const lab = gv(
        `${p}m${m}_label`,
        (fbc.metrics && fbc.metrics[m - 1] && fbc.metrics[m - 1].label) || ''
      );
      const val = gv(
        `${p}m${m}_value`,
        (fbc.metrics && fbc.metrics[m - 1] && fbc.metrics[m - 1].value != null
          ? String(fbc.metrics[m - 1].value)
          : '') || ''
      );
      if (lab || val) metrics.push({ label: lab, value: val });
    }
    const features = [];
    for (let f = 1; f <= 4; f++) {
      const t = gv(`${p}f${f}`, (fbc.features && fbc.features[f - 1]) || '');
      if (t) features.push(t);
    }
    out.push({
      recommended: i === chosenRec,
      badgeText: gv(`${p}badgeText`, fbc.badgeText || 'Best Match'),
      smallTag: gv(`${p}tag`, fbc.smallTag || 'Category'),
      title: gv(`${p}title`, fbc.title || ''),
      iconClass: gv(`${p}icon`, fbc.iconClass || 'fa-layer-group'),
      metrics: metrics.length ? metrics : fbc.metrics || [],
      features: features.length ? features : fbc.features || [],
      bundleText: gv(`${p}bundle`, fbc.bundleText || ''),
      ctaLabel: gv(`${p}cta`, fbc.ctaLabel || 'Learn more'),
    });
  }
  return out;
}

// --- Cards grid HTML (verbatim: pure over cards+persona) -----------------------
function buildAdaptiveCardsGridHtml(cards, personaArg) {
  const persona = personaArg || getAdaptivePersona(null);
  const bn = String(persona.brandName ?? '');
  const rBrand = (t) =>
    String(t ?? '')
      .replace(/\[\[BRAND_NAME\]\]/g, bn)
      .replace(/\$\{brandName\}/g, bn);
  const escCard = (t) => escapeHtmlForAdaptive(interpolateAdaptivePersona(rBrand(t), persona));
  const esc = escapeHtmlForAdaptive;
  const list = Array.isArray(cards) ? cards : [];
  let html = '<div class="floating-cards-container items-stretch">';
  list.forEach((card) => {
    const rec = !!card.recommended;
    const borderStyle = rec
      ? ' style="border-width:2px;border-color:var(--brand);box-shadow:0 20px 60px rgba(0,0,0,0.18);"'
      : '';
    const badgeLabel = escCard(card.badgeText || 'Best Match');
    const bundleRaw = String(card.bundleText || card.highlight || '').trim();

    html += `<div class="solution-card flex flex-col h-full${rec ? ' solution-card-recommended' : ''}"${borderStyle}>`;
    if (rec) {
      html += `<div class="recommended-badge"><i class="fas fa-star" aria-hidden="true"></i><span>${badgeLabel}</span></div>`;
    }

    html += '<div class="flex flex-col flex-grow min-h-0">';
    html += `<div class="card-header shrink-0${rec ? ' pr-24 sm:pr-28' : ''}">`;
    html += '<div class="flex items-start justify-between gap-3 mb-1"><div class="flex items-center min-w-0">';
    html += `<div class="solution-icon shrink-0" style="background-color: color-mix(in srgb, var(--brand) 15%, transparent); color: var(--brand);">`;
    html += `<i class="fas ${esc(card.iconClass || 'fa-layer-group')}" aria-hidden="true"></i>`;
    html += '</div><div class="ml-3 min-w-0">';
    html += `<p class="text-xs uppercase tracking-wide font-semibold ${rec ? 'text-brand' : 'text-gray-500'} mb-1">${escCard(
      card.smallTag || 'Category'
    )}</p>`;
    html += `<h3 class="text-xl font-bold text-gray-900 leading-snug">${escCard(card.title)}</h3>`;
    html += '</div></div></div></div>';

    html += '<div class="card-body flex flex-col flex-grow pt-0 min-h-0">';
    html += '<div class="flex flex-col flex-grow min-h-0">';
    html += '<div class="metrics-grid">';
    const metricsRow = (Array.isArray(card.metrics) ? card.metrics : []).slice(0, 3);
    metricsRow.forEach((m) => {
      html += '<div class="metric-item">';
      html += `<div class="metric-label">${escCard(m.label)}</div>`;
      html += `<div class="metric-value-row ${rec ? 'text-brand' : 'text-gray-900'}">`;
      html += `<span class="metric-value-core">${escCard(m.value)}</span>`;
      if (m.unit) {
        html += `<span class="metric-unit">${escCard(m.unit)}</span>`;
      }
      html += '</div></div>';
    });
    html += '</div><div class="divider"></div><div class="features-section">';
    html += '<h4 class="features-title">Key features</h4><ul class="features-list">';
    const feats = (Array.isArray(card.features) ? card.features : []).slice(0, 4);
    feats.forEach((feat) => {
      const iconCls = rec ? 'text-brand' : 'text-gray-400';
      html += `<li class="feature-item"><i class="fas fa-check-circle ${iconCls}" aria-hidden="true"></i><span>${escCard(
        feat
      )}</span></li>`;
    });
    html += '</ul></div>';
    if (bundleRaw) {
      html += `<div class="bundle-highlight"><i class="fas fa-lightbulb text-brand" aria-hidden="true"></i><span>${escCard(
        bundleRaw
      )}</span></div>`;
    }
    html += '</div>';
    html += '<div class="mt-auto pt-4 w-full shrink-0">';
    html += `<button type="button" class="card-cta-btn mt-0">${escCard(card.ctaLabel || 'Learn more')}</button>`;
    html += '</div></div></div></div>';
  });
  html += '</div>';
  return html;
}

// --- Category page HTML (verbatim: pure over story+persona) --------------------
function buildCategoryPageHtml(story, personaArg) {
  const persona = personaArg || getAdaptivePersona(null);
  const bn = String(persona.brandName ?? '');
  const rBrand = (t) =>
    String(t ?? '')
      .replace(/\[\[BRAND_NAME\]\]/g, bn)
      .replace(/\$\{brandName\}/g, bn);
  const escCat = (t) => escapeHtmlForAdaptive(interpolateAdaptivePersona(rBrand(t), persona));
  const esc = escapeHtmlForAdaptive;
  const cp = story.categoryPage || {};
  const whyImg = String(cp.whyChooseUsImage || '').trim();
  const services = Array.isArray(cp.services) ? cp.services : [];
  const svcHtml = services
    .map(
      (s) => `<div class="category-service-card min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6 md:p-8">
<div class="category-service-icon-wrap mb-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:mb-4 sm:h-12 sm:w-12" style="background-color: color-mix(in srgb, var(--brand) 10%, transparent); color: var(--brand);">
<i class="fas ${esc(s.iconClass || 'fa-layer-group')} text-lg transition-colors duration-300 sm:text-xl" aria-hidden="true"></i>
</div>
<h3 class="text-balance text-base font-bold text-slate-900 sm:text-lg">${escCat(s.title || '')}</h3>
<p class="mt-2 text-sm leading-relaxed text-slate-600 sm:mt-3">${escCat(s.description || '')}</p>
</div>`
    )
    .join('');
  return `<div class="category-page-inner min-w-0 max-w-full overflow-x-hidden bg-white text-slate-900">
<section id="cat-hero" class="relative flex min-h-[min(52vh,420px)] w-full items-center justify-center overflow-hidden px-4 py-16 sm:px-6 sm:py-20 md:min-h-[520px] md:px-8 md:py-32 scroll-mt-[72px]">
<div class="absolute inset-0 z-[1] bg-slate-900/65" aria-hidden="true"></div>
<div class="absolute inset-0 z-0" style="background: var(--category-hero-banner-bg);" aria-hidden="true"></div>
<div class="relative z-10 mx-auto max-w-4xl px-2 text-center sm:px-4">
<h1 class="text-balance text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">${escCat(cp.catHeroTitle || '')}</h1>
<p class="mt-4 text-base leading-relaxed text-white/90 sm:mt-5 sm:text-lg md:text-xl">${escCat(cp.catHeroSubtitle || '')}</p>
</div>
</section>
<section id="cat-core-services" class="scroll-mt-[72px] border-t border-slate-200 bg-white py-12 sm:py-16 md:py-24">
<div class="mx-auto max-w-7xl min-w-0 px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20">
<h2 class="text-xl font-bold text-slate-900 sm:text-2xl md:text-3xl">${escCat(cp.coreServicesHeading || 'Core services')}</h2>
<div class="mt-8 grid grid-cols-1 gap-6 sm:mt-10 sm:gap-8 md:grid-cols-3 md:gap-8 lg:gap-10">${svcHtml}</div>
</div>
</section>
<section id="cat-why-us" class="scroll-mt-[72px] border-t border-slate-200 bg-slate-50 py-12 sm:py-16 md:py-24">
<div class="mx-auto max-w-7xl min-w-0 px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20">
<div class="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-14 xl:gap-16">
<div class="order-2 min-w-0 lg:order-1">
<h2 class="text-balance text-xl font-bold text-slate-900 sm:text-2xl md:text-3xl">${escCat(cp.whyChooseUsTitle || '')}</h2>
<p class="mt-4 text-sm leading-relaxed text-slate-600 sm:mt-5 sm:text-base md:text-lg">${escCat(cp.whyChooseUsText || '')}</p>
</div>
<div class="order-1 min-w-0 lg:order-2">
<div class="overflow-hidden rounded-2xl shadow-lg ring-1 ring-slate-200">
<img src="${escapeHtmlAttributeValue(whyImg)}" alt="" class="h-auto min-h-[200px] w-full object-cover sm:min-h-[240px] md:min-h-[300px] lg:min-h-[320px]" width="1200" height="800" loading="lazy" />
</div>
</div>
</div>
</div>
</section>
<section id="cat-insights" class="scroll-mt-[72px] border-t border-slate-200 bg-white py-12 pb-20 sm:py-16 sm:pb-24 md:py-24 md:pb-28">
<div class="mx-auto max-w-7xl min-w-0 px-4 sm:px-6 md:px-10 lg:px-14 xl:px-14 xl:px-20">
<h2 class="text-balance text-xl font-bold text-slate-900 sm:text-2xl md:text-3xl">${escCat(cp.marketInsightsHeading || 'Market insights & resources')}</h2>
<p class="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">${escCat(
    String(cp.marketInsightsIntro || '').trim() ||
      'Short reads on themes that matter in this line of business. When you want next steps for your situation, open the chat and ask Penny—your ${brandName} assistant in this demo.'
  )}</p>
<div class="mt-8 grid grid-cols-1 gap-6 sm:mt-10 sm:gap-8 md:grid-cols-2 md:gap-8 lg:gap-10">
<article class="category-insight-card flex min-h-[200px] flex-col rounded-2xl border border-slate-200 bg-slate-50/80 p-5 ring-1 ring-slate-100 sm:min-h-[220px] sm:p-8">
<div class="category-insight-eyebrow text-xs font-bold uppercase tracking-wider text-[#008b7d]">${esc('Insight')}</div>
<h3 class="category-insight-title mt-2 text-balance text-lg font-semibold text-slate-900 sm:text-xl">${escCat(cp.article1Title || '')}</h3>
<div class="mt-4 flex-1"></div>
<span class="category-insight-cta mt-4 inline-block text-sm font-semibold text-[#008b7d] sm:mt-6">${esc('Ask Penny in chat →')}</span>
</article>
<article class="category-insight-card flex min-h-[200px] flex-col rounded-2xl border border-slate-200 bg-slate-50/80 p-5 ring-1 ring-slate-100 sm:min-h-[220px] sm:p-8">
<div class="category-insight-eyebrow text-xs font-bold uppercase tracking-wider text-[#008b7d]">${esc('Insight')}</div>
<h3 class="category-insight-title mt-2 text-balance text-lg font-semibold text-slate-900 sm:text-xl">${escCat(cp.article2Title || '')}</h3>
<div class="mt-4 flex-1"></div>
<span class="category-insight-cta mt-4 inline-block text-sm font-semibold text-[#008b7d] sm:mt-6">${esc('Ask Penny in chat →')}</span>
</article>
</div>
</div>
</section>
</div>`;
}

// --- Merged story (adapted: g() reads formData) --------------------------------
function getMergedAdaptiveStory(formData) {
  const fd = formData || {};
  const { ind, industry, useKey, useCase } = getAdaptiveUseCaseBundle(fd);
  const pack = getResolvedHeroAssetPack(ind, useCase);
  const g = (id, fallback) => {
    const v = fd[id];
    const t = v != null ? String(v).trim() : '';
    return t || fallback;
  };
  const wMerged = mergeWarmMarketInsightsForUseCase(industry, useCase);
  const w0 = wMerged[0] || {};
  const w1 = wMerged[1] || {};
  const w2 = wMerged[2] || {};
  const hm = mergeHomeMarketInsightsForUseCase(industry, useCase);
  const hmc = Array.isArray(hm.cards) ? hm.cards : [];
  const hc = (i) => hmc[i] || {};
  const cp = mergeCategoryPageWithCumulus(ind, industry.categoryPage);
  return {
    categoryPage: {
      heroBgImage: cp.heroBgImage,
      catHeroTitle: g('catHeroTitle', cp.catHeroTitle || ''),
      catHeroSubtitle: g('catHeroSubtitle', cp.catHeroSubtitle || ''),
      coreServicesHeading: g('catCoreServicesHeading', 'Core services'),
      services: [
        {
          iconClass: g('catService1Icon', (cp.services && cp.services[0] && cp.services[0].iconClass) || 'fa-layer-group'),
          title: g('catService1Title', (cp.services && cp.services[0] && cp.services[0].title) || ''),
          description: g('catService1Desc', (cp.services && cp.services[0] && cp.services[0].description) || ''),
        },
        {
          iconClass: g('catService2Icon', (cp.services && cp.services[1] && cp.services[1].iconClass) || 'fa-layer-group'),
          title: g('catService2Title', (cp.services && cp.services[1] && cp.services[1].title) || ''),
          description: g('catService2Desc', (cp.services && cp.services[1] && cp.services[1].description) || ''),
        },
        {
          iconClass: g('catService3Icon', (cp.services && cp.services[2] && cp.services[2].iconClass) || 'fa-layer-group'),
          title: g('catService3Title', (cp.services && cp.services[2] && cp.services[2].title) || ''),
          description: g('catService3Desc', (cp.services && cp.services[2] && cp.services[2].description) || ''),
        },
      ],
      whyChooseUsTitle: g('catWhyTitle', cp.whyChooseUsTitle || ''),
      whyChooseUsText: g('catWhyText', cp.whyChooseUsText || ''),
      whyChooseUsImage: cp.whyChooseUsImage,
      marketInsightsHeading: g('catInsightsHeading', 'Market insights & resources'),
      marketInsightsIntro: g('catInsightsIntro', cp.marketInsightsIntro || ''),
      article1Title: g('catArticle1Title', cp.article1Title || ''),
      article2Title: g('catArticle2Title', cp.article2Title || ''),
    },
    homepageCtaText: industry.homepageCtaText,
    adaptiveWebSubIndustry: ind,
    adaptiveWebSubUseCase: useKey,
    vanillaHeroTitle: g('vanillaHeroTitle', useCase.vanillaHeroTitle),
    vanillaHeroSubtext: g('vanillaHeroSubtext', useCase.vanillaHeroSubtext),
    intentTriggerText: g('intentTriggerText', industry.homepageCtaText || industry.intentTriggerText),
    userIntentString: g('userIntentString', useCase.userIntentString || ''),
    agentChatMessage: g('agentChatMessage', useCase.agentChatMessage || ADAPTIVE_GENERIC_AGENT_GREETING),
    chatWidgetTitle: g('chatWidgetTitle', useCase.chatWidgetTitle),
    agentAdaptiveResponse: g('agentAdaptiveResponse', useCase.agentAdaptiveResponse),
    adaptiveOverlayTitle: g('adaptiveOverlayTitle', useCase.adaptiveOverlayTitle),
    adaptiveOverlaySubtitle: g('adaptiveOverlaySubtitle', useCase.adaptiveOverlaySubtitle),
    adaptiveFooterNote: g('adaptiveFooterNote', useCase.adaptiveFooterNote),
    landingPageTitle: g('landingPageTitle', useCase.landingPageTitle),
    landingPageSubtitle: g('landingPageSubtitle', useCase.landingPageSubtitle),
    homeInsightsSubtitle: hm.sectionSubtitle || '',
    homeInsight1Eyebrow: hc(0).eyebrow || '',
    homeInsight1Title: hc(0).title || '',
    homeInsight1Body: hc(0).body || '',
    homeInsight2Eyebrow: hc(1).eyebrow || '',
    homeInsight2Title: hc(1).title || '',
    homeInsight2Body: hc(1).body || '',
    homeInsight3Eyebrow: hc(2).eyebrow || '',
    homeInsight3Title: hc(2).title || '',
    homeInsight3Body: hc(2).body || '',
    coldHeroEyebrow: g('coldHeroEyebrow', industry.coldHeroEyebrow || 'Life simplified'),
    coldHeroHeading: g('coldHeroHeading', industry.coldHeroHeading || 'Comprehensive financial solutions for every stage of life.'),
    coldHeroParagraph1: g('coldHeroParagraph1', industry.coldHeroParagraph1 || ''),
    coldHeroParagraph2: g('coldHeroParagraph2', industry.coldHeroParagraph2 || ''),
    warmInsight1Img: g('warmInsight1Img', w0.image || pack.warmTile1 || DEFAULT_ADAPTIVE_INSIGHT_IMG_1),
    warmInsight1Title: g('warmInsight1Title', w0.title || ''),
    warmInsight1Eyebrow: w0.eyebrow || '',
    warmInsight1Body: w0.body || '',
    warmInsight2Img: g('warmInsight2Img', w1.image || pack.warmTile2 || DEFAULT_ADAPTIVE_INSIGHT_IMG_2),
    warmInsight2Title: g('warmInsight2Title', w1.title || ''),
    warmInsight2Eyebrow: w1.eyebrow || '',
    warmInsight2Body: w1.body || '',
    warmInsight3Img: g('warmInsight3Img', w2.image || pack.warmTile3 || DEFAULT_ADAPTIVE_INSIGHT_IMG_3),
    warmInsight3Title: g('warmInsight3Title', w2.title || ''),
    warmInsight3Eyebrow: w2.eyebrow || '',
    warmInsight3Body: w2.body || '',
    mockProfile: useCase.mockProfile,
    cards: buildAdaptiveCardsFromMatrixInputs(useCase.cards, fd),
  };
}

// --- Top-level replacement (adapted: DOM hero-state -> formData) ---------------
function applyAdaptiveWebTemplateReplacements(html, formData) {
  const fd = formData || {};
  const primary = sanitizeAdaptiveHexColor(fd.adaptivePrimaryColor, '#0176d3');
  const accent = sanitizeAdaptiveHexColor(fd.adaptiveAccentColor, '#00ac5b');
  const heroGradientColor = sanitizeAdaptiveHexColor(fd.heroGradientColor, '#005fb2');
  const heroGradientColor2 = sanitizeAdaptiveHexColor(fd.heroGradientColor2, '#001639');
  const brandPlain = String(fd.adaptiveBrandName ?? '');
  const resolveBrand = (t) =>
    String(t ?? '')
      .replace(/\[\[BRAND_NAME\]\]/g, brandPlain)
      .replace(/\$\{brandName\}/g, brandPlain);
  const persona = getAdaptivePersona(fd);
  const story = getMergedAdaptiveStory(fd);
  const subIndustryValue = fd.adaptiveWebSubIndustry || 'retailBanking';
  const { ind: bundleInd, useCase: bundleUseCase } = getAdaptiveUseCaseBundle(fd);
  const libPack = getResolvedHeroAssetPack(bundleInd || subIndustryValue, bundleUseCase);
  const pickUrl = (formVal, libVal, fallback) => {
    const t = formVal != null ? String(formVal).trim() : '';
    if (t) return t;
    const l = libVal != null ? String(libVal).trim() : '';
    if (l) return l;
    return fallback;
  };
  const coldHeroUrl = pickUrl(fd.adaptiveColdHeroUrl, libPack.coldHero, DEFAULT_ADAPTIVE_COLD_HERO_IMAGE);
  const warmHeroUrl = pickUrl(fd.adaptiveHeroImageUrl, libPack.warmHero, DEFAULT_ADAPTIVE_HERO_IMAGE);
  const adaptiveHeroPreviewMode = String(fd.adaptiveHeroState || 'warm').trim().toLowerCase();
  const heroUrl = adaptiveHeroPreviewMode === 'cold' ? coldHeroUrl : warmHeroUrl;
  const categoryHeroUrl = String((story.categoryPage && story.categoryPage.heroBgImage) || '').trim() || coldHeroUrl;
  const navLogoUrl = (fd.adaptiveNavLogoUrl || '').trim() || DEFAULT_ADAPTIVE_NAV_LOGO;
  const insightImg1 = pickUrl(fd.adaptiveInsightImg1, libPack.insight1, DEFAULT_ADAPTIVE_INSIGHT_IMG_1);
  const insightImg2 = pickUrl(fd.adaptiveInsightImg2, libPack.insight2, DEFAULT_ADAPTIVE_INSIGHT_IMG_2);
  const insightImg3 = pickUrl(fd.adaptiveInsightImg3, libPack.insight3, DEFAULT_ADAPTIVE_INSIGHT_IMG_3);

  const mockProfile = {
    firstName: persona.firstName,
    lastName: persona.lastName,
    email: persona.email,
    phone: persona.phone,
    company: persona.company,
    zipCode: persona.zipCode,
  };
  const userIntentResolved = resolveBrand(interpolateAdaptivePersona(story.userIntentString || '', persona));
  const agentOpen = resolveBrand(interpolateAdaptivePersona(story.agentChatMessage || '', persona));
  const agentAdaptive = resolveBrand(interpolateAdaptivePersona(story.agentAdaptiveResponse || '', persona));
  const fill = (text) => escapeHtmlForAdaptive(interpolateAdaptivePersona(resolveBrand(text), persona));
  const categoryPageHtml = buildCategoryPageHtml(story, persona);
  const industryLabels = {
    retailBanking: 'Personal Banking',
    commercialBanking: 'Commercial Banking',
    wealthManagement: 'Wealth Management',
    assetManagement: 'Asset Management',
    insurance: 'Insurance',
  };
  const subIndustryLabel = industryLabels[subIndustryValue] || 'Personal Banking';
  const brandInitials = fd.adaptiveBrandInitials || getBrandInitials(brandPlain);
  return replaceTokens(html, {
    fill, resolveBrand, primary, accent, heroGradientColor, heroGradientColor2, brandPlain,
    persona, story, mockProfile, agentOpen, agentAdaptive, userIntentResolved, categoryPageHtml,
    subIndustryLabel, brandInitials, heroUrl, coldHeroUrl, categoryHeroUrl, navLogoUrl,
    insightImg1, insightImg2, insightImg3,
  });
}

// Token replacement (verbatim order/logic from applyAdaptiveWebTemplateReplacements).
function replaceTokens(html, c) {
  const { fill, story, persona } = c;
  let out = html;
  out = out.replace(/\[\[BRAND_INITIALS\]\]/g, escapeHtmlForAdaptive(c.brandInitials));
  out = out.replace(/\[\[PRIMARY_COLOR\]\]/g, c.primary);
  out = out.replace(/\[\[ACCENT_COLOR\]\]/g, c.accent);
  out = out.replace(/\[\[HERO_GRADIENT_COLOR\]\]/g, c.heroGradientColor);
  out = out.replace(/\[\[HERO_GRADIENT_COLOR_2\]\]/g, c.heroGradientColor2);
  out = out.replace(/\[\[VANILLA_HERO_TITLE\]\]/g, fill(story.vanillaHeroTitle || ''));
  out = out.replace(/\[\[VANILLA_HERO_SUBTEXT\]\]/g, fill(story.vanillaHeroSubtext || ''));
  out = out.replace(/\[\[INTENT_TRIGGER_TEXT\]\]/g, fill(story.intentTriggerText));
  out = out.replace(/\[\[CATEGORY_PAGE_HTML\]\]/g, c.categoryPageHtml);
  out = out.replace(/\[\[SUBPAGE_STRUCTURED_HTML\]\]/g, c.categoryPageHtml);
  out = out.replace(/\[\[CHAT_WIDGET_TITLE\]\]/g, fill(story.chatWidgetTitle));
  out = out.replace(/\[\[ADAPTIVE_OVERLAY_TITLE\]\]/g, fill(story.adaptiveOverlayTitle));
  out = out.replace(/\[\[ADAPTIVE_OVERLAY_SUBTITLE\]\]/g, fill(story.adaptiveOverlaySubtitle));
  out = out.replace(/\[\[ADAPTIVE_FOOTER_NOTE\]\]/g, fill(story.adaptiveFooterNote));
  out = out.replace(/\[\[LANDING_PAGE_TITLE\]\]/g, fill(story.landingPageTitle));
  out = out.replace(/\[\[LANDING_PAGE_SUBTITLE\]\]/g, fill(story.landingPageSubtitle || ''));
  out = out.replace(/\[\[ADAPTIVE_CARDS_GRID_HTML\]\]/g, buildAdaptiveCardsGridHtml(story.cards, persona));
  out = out.replace(/\[\[MOCK_PROFILE_JSON\]\]/g, JSON.stringify(c.mockProfile));
  out = out.replace(/\[\[AGENT_GREETING_JSON\]\]/g, JSON.stringify(c.agentOpen));
  out = out.replace(/\[\[AGENT_FOLLOWUP_JSON\]\]/g, JSON.stringify(c.agentAdaptive));
  out = out.replace(/\[\[USER_INTENT_JSON\]\]/g, JSON.stringify(c.userIntentResolved));
  return replaceTokens2(out, c);
}

function replaceTokens2(out, c) {
  const { fill, story } = c;
  out = out.replace(/\[\[ADAPTIVE_HERO_IMAGE_URL\]\]/g, escapeHtmlAttributeValue(c.heroUrl));
  out = out.replace(/\[\[COLD_HERO_IMAGE_URL\]\]/g, escapeHtmlAttributeValue(c.coldHeroUrl));
  out = out.replace(/\[\[INSIGHT_IMG_1\]\]/g, escapeHtmlAttributeValue(c.insightImg1));
  out = out.replace(/\[\[INSIGHT_IMG_2\]\]/g, escapeHtmlAttributeValue(c.insightImg2));
  out = out.replace(/\[\[INSIGHT_IMG_3\]\]/g, escapeHtmlAttributeValue(c.insightImg3));
  out = out.replace(/\[\[WARM_INSIGHT_1_IMG\]\]/g, escapeHtmlAttributeValue(String(story.warmInsight1Img || '').trim()));
  out = out.replace(/\[\[WARM_INSIGHT_2_IMG\]\]/g, escapeHtmlAttributeValue(String(story.warmInsight2Img || '').trim()));
  out = out.replace(/\[\[WARM_INSIGHT_3_IMG\]\]/g, escapeHtmlAttributeValue(String(story.warmInsight3Img || '').trim()));
  out = out.replace(/\[\[WARM_INSIGHT_1_TITLE\]\]/g, fill(story.warmInsight1Title || ''));
  out = out.replace(/\[\[WARM_INSIGHT_2_TITLE\]\]/g, fill(story.warmInsight2Title || ''));
  out = out.replace(/\[\[WARM_INSIGHT_3_TITLE\]\]/g, fill(story.warmInsight3Title || ''));
  out = out.replace(/\[\[COLD_HERO_EYEBROW\]\]/g, fill(story.coldHeroEyebrow || ''));
  out = out.replace(/\[\[COLD_HERO_HEADING\]\]/g, fill(story.coldHeroHeading || ''));
  out = out.replace(/\[\[COLD_HERO_PARAGRAPH_1\]\]/g, fill(story.coldHeroParagraph1 || ''));
  out = out.replace(/\[\[COLD_HERO_PARAGRAPH_2\]\]/g, fill(story.coldHeroParagraph2 || ''));
  out = out.replace(/\[\[HOME_INSIGHTS_SUBTITLE\]\]/g, fill(story.homeInsightsSubtitle || ''));
  out = out.replace(/\[\[HOME_INSIGHT_1_EYEBROW\]\]/g, fill(story.homeInsight1Eyebrow || ''));
  out = out.replace(/\[\[HOME_INSIGHT_1_TITLE\]\]/g, fill(story.homeInsight1Title || ''));
  out = out.replace(/\[\[HOME_INSIGHT_1_BODY\]\]/g, fill(story.homeInsight1Body || ''));
  out = out.replace(/\[\[HOME_INSIGHT_2_EYEBROW\]\]/g, fill(story.homeInsight2Eyebrow || ''));
  out = out.replace(/\[\[HOME_INSIGHT_2_TITLE\]\]/g, fill(story.homeInsight2Title || ''));
  out = out.replace(/\[\[HOME_INSIGHT_2_BODY\]\]/g, fill(story.homeInsight2Body || ''));
  out = out.replace(/\[\[HOME_INSIGHT_3_EYEBROW\]\]/g, fill(story.homeInsight3Eyebrow || ''));
  out = out.replace(/\[\[HOME_INSIGHT_3_TITLE\]\]/g, fill(story.homeInsight3Title || ''));
  out = out.replace(/\[\[HOME_INSIGHT_3_BODY\]\]/g, fill(story.homeInsight3Body || ''));
  return replaceTokens3(out, c);
}

function replaceTokens3(out, c) {
  const { fill, story } = c;
  out = out.replace(/\[\[WARM_INSIGHT_1_EYEBROW\]\]/g, fill(story.warmInsight1Eyebrow || ''));
  out = out.replace(/\[\[WARM_INSIGHT_1_BODY\]\]/g, fill(story.warmInsight1Body || ''));
  out = out.replace(/\[\[WARM_INSIGHT_2_EYEBROW\]\]/g, fill(story.warmInsight2Eyebrow || ''));
  out = out.replace(/\[\[WARM_INSIGHT_2_BODY\]\]/g, fill(story.warmInsight2Body || ''));
  out = out.replace(/\[\[WARM_INSIGHT_3_EYEBROW\]\]/g, fill(story.warmInsight3Eyebrow || ''));
  out = out.replace(/\[\[WARM_INSIGHT_3_BODY\]\]/g, fill(story.warmInsight3Body || ''));
  out = out.replace(/\[\[ADAPTIVE_SUBPAGE_IMAGE_URL\]\]/g, escapeHtmlAttributeValue(c.categoryHeroUrl));
  out = out.replace(/\[\[ADAPTIVE_NAV_LOGO_URL\]\]/g, escapeHtmlAttributeValue(c.navLogoUrl));
  const iconSrc = getAdaptiveWebAgentIconSrc();
  out = out.replace(/\[\[AGENTFORCE_ICON_SRC\]\]/g, escapeHtmlAttributeValue(iconSrc));
  out = out.replace(/\[\[SUB_INDUSTRY_LABEL\]\]/g, escapeHtmlForAdaptive(c.subIndustryLabel));
  out = out.replace(/\[\[CUSTOMER_FIRST_NAME\]\]/g, escapeHtmlForAdaptive(c.persona.firstName));
  out = out.replace(/\[\[BRAND_NAME\]\]/g, escapeHtmlForAdaptive(c.brandPlain));
  return out;
}

module.exports = {
  applyAdaptiveWebTemplateReplacements,
  getMergedAdaptiveStory,
  getAdaptivePersona,
  getAdaptiveUseCaseBundle,
  getAdaptiveIndustryRecord,
  getBrandInitials,
  buildAdaptiveCardsGridHtml,
  buildCategoryPageHtml,
  ADAPTIVE_WEB_COPY_BY_SUB_INDUSTRY,
};
