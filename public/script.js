'use strict';

// SP Demo Builder SPA — vanilla JS. Screens: sign-in gate, connect SDO,
// new demo, manage demos, connected orgs. State is minimal and re-fetched.

const state = {
  me: null, // {id, email, name}
  connections: [], // sf_connections
  activeConnectionId: null,
  deployments: [],
  route: 'newDemo', // newDemo | manageDemos | connectedOrgs
};

// --- tiny helpers ---
const $ = (sel, root = document) => root.querySelector(sel);
const el = (tag, attrs = {}, children = []) => {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else if (v != null) node.setAttribute(k, v);
  }
  (Array.isArray(children) ? children : [children]).forEach((c) => {
    if (c == null) return;
    node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  });
  return node;
};

async function api(method, path, body) {
  const opts = { method, headers: {} };
  if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(path, opts);
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    const msg = (data && (data.detail || data.error)) || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

function qs(name) {
  return new URLSearchParams(location.search).get(name);
}

function clearQuery() {
  history.replaceState({}, '', location.pathname);
}

// --- boot ---
async function boot() {
  try {
    state.me = await api('GET', '/api/me');
  } catch {
    state.me = null;
  }
  if (!state.me) return renderSignIn();

  try {
    state.connections = await api('GET', '/api/sf/connections');
  } catch {
    state.connections = [];
  }
  if (state.connections.length) {
    state.activeConnectionId = state.connections[0].id;
  }

  // Surface any OAuth redirect messages.
  const sfErr = qs('sf_error');
  const authErr = qs('auth_error');
  if (sfErr || authErr) clearQuery();

  renderApp({ banner: sfErr ? { type: 'error', msg: 'Salesforce: ' + sfErr } : null });
}

// --- sign-in gate ---
function renderSignIn() {
  $('#headerControls').innerHTML = '';
  $('#navControls').innerHTML = '';
  const authErr = qs('auth_error');
  const app = $('#app');
  app.innerHTML = '';
  const arrivedDirect = !qs('config');
  app.appendChild(
    el('div', { class: 'centered-gate' }, [
      arrivedDirect
        ? el('div', { class: 'banner info' }, [
            el('strong', {}, 'Start in the Experience Generator. '),
            el('span', {}, 'This tool takes a demo you designed there and makes it live in an SDO. '),
            el('a', { href: EXPERIENCE_GENERATOR_URL, target: '_blank' }, 'Open the Experience Generator →'),
          ])
        : null,
      el('div', { class: 'card' }, [
        el('h2', {}, 'Sign in'),
        el('p', { class: 'muted' }, 'Internal tool for Salesforce SEs. Sign in with your @salesforce.com Google account.'),
        authErr === 'domain_not_allowed'
          ? el('div', { class: 'banner error' }, 'That email domain is not allowed. Use your @salesforce.com account.')
          : null,
        el('a', { class: 'btn google', href: '/auth/google' }, 'Sign in with Google'),
      ]),
    ])
  );
  if (authErr) clearQuery();
}

// Right side of the control bar: signed-in email + sign out.
function renderHeaderControls() {
  const controls = $('#headerControls');
  controls.innerHTML = '';
  if (!state.me) return;
  controls.appendChild(el('span', { class: 'user-email' }, state.me.email));
  controls.appendChild(
    el('button', { class: 'btn secondary', onclick: logout }, 'Sign out')
  );
}

// Left side of the control bar: primary nav tabs (only once an org is connected).
function renderNavControls() {
  const nav = $('#navControls');
  nav.innerHTML = '';
  if (!state.me || !state.connections.length) return;
  const items = [
    ['newDemo', 'New Demo'],
    ['manageDemos', 'Manage Demos'],
    ['connectedOrgs', 'Connected Orgs'],
  ];
  items.forEach(([route, label]) => {
    nav.appendChild(
      el('button', {
        class: 'nav-tab' + (state.route === route ? ' active' : ''),
        onclick: () => { state.route = route; renderApp(); },
      }, label)
    );
  });
}

async function logout() {
  try { await api('POST', '/auth/logout'); } catch {}
  location.href = '/';
}

// --- main app shell ---
function renderApp({ banner } = {}) {
  renderHeaderControls();
  renderNavControls();
  const app = $('#app');
  app.innerHTML = '';

  // No connected org yet -> force Connect SDO screen.
  if (!state.connections.length) {
    app.appendChild(renderConnectSdo());
    return;
  }

  if (banner) app.appendChild(el('div', { class: 'banner ' + banner.type }, banner.msg));

  if (state.route === 'newDemo') app.appendChild(renderNewDemo());
  else if (state.route === 'manageDemos') app.appendChild(renderManageDemos());
  else if (state.route === 'connectedOrgs') app.appendChild(renderConnectedOrgs());
}

// --- Connect SDO ---
const EXPERIENCE_GENERATOR_URL = 'https://whispering-coast-03303-5bb1f6fb1c95.herokuapp.com';

function renderConnectSdo() {
  const wrap = el('div', { class: 'centered-gate' });

  // Callout: this app is meant to be reached from the Experience Generator,
  // where the SE first designs the experience. Direct visitors get pointed back.
  const arrivedDirect = !qs('config');
  if (arrivedDirect) {
    wrap.appendChild(
      el('div', { class: 'banner info' }, [
        el('strong', {}, 'Start in the Experience Generator. '),
        el('span', {}, 'Design your experience there first, then use “Connect to SDO for Live Demo” to bring it here with everything pre-filled. '),
        el('a', { href: EXPERIENCE_GENERATOR_URL, target: '_blank' }, 'Open the Experience Generator →'),
      ])
    );
  }

  const card = el('div', { class: 'card' }, [
    el('h2', {}, 'Connect Your SDO'),
    el('p', { class: 'muted' }, 'Connect a Salesforce SDO with Data Cloud + Personalization enabled. The app deploys the demo objects into this org.'),
  ]);
  card.appendChild(
    el('div', { style: 'margin-top:1rem' }, [
      el('a', {
        class: 'btn',
        href: '#',
        onclick: (e) => { e.preventDefault(); location.href = '/auth/salesforce'; },
      }, 'Connect to Salesforce'),
    ])
  );
  card.appendChild(
    el('ul', { class: 'check-list small', style: 'margin-top:1.25rem' }, [
      el('li', {}, [el('span', { class: 'status-dot unknown' }), 'Data Cloud enabled']),
      el('li', {}, [el('span', { class: 'status-dot unknown' }), 'Personalization enabled']),
      el('li', {}, [el('span', { class: 'status-dot unknown' }), 'Profile Data Graph exists']),
      el('li', {}, [el('span', { class: 'status-dot unknown' }), 'Permission set: Personalization Admin']),
    ])
  );
  card.appendChild(el('p', { class: 'muted small' }, 'Prerequisites are verified after connecting.'));
  wrap.appendChild(card);
  return wrap;
}

// --- New Demo ---
let _catalog = null;
async function loadCatalog() {
  if (!_catalog) _catalog = await api('GET', '/api/sf/catalog');
  return _catalog;
}

// Holds an uploaded HTML file's contents when the SE brings their own export.
let _uploadedHtml = null;

function activeConnection() {
  return state.connections.find((c) => c.id === state.activeConnectionId) || state.connections[0];
}

function renderNewDemo() {
  const conn = activeConnection();
  const card = el('div', { class: 'card' }, [el('h2', {}, 'New Demo')]);

  // Prefill from handoff (?config=...) if present.
  let prefill = {};
  const cfg = qs('config');
  if (cfg) {
    try { prefill = JSON.parse(decodeURIComponent(cfg)); } catch {}
  }

  const form = el('div');
  const nameInput = el('input', { type: 'text', id: 'demoName', placeholder: 'e.g. AYCO Warm Homepage v1', value: prefill.demoName || '' });
  const brandInput = el('input', { type: 'text', id: 'brandName', value: prefill.adaptiveBrandName || 'Cumulus Bank' });
  const industrySel = el('select', { id: 'industrySel' });
  const useCaseSel = el('select', { id: 'useCaseSel' });
  const primaryInput = el('input', { type: 'color', id: 'primaryColor', value: prefill.adaptivePrimaryColor || '#2a94d6' });
  const accentInput = el('input', { type: 'color', id: 'accentColor', value: prefill.adaptiveAccentColor || '#0176d3' });
  // Profile Data Graph to bind Personalization Points to. Auto-discovery via API
  // is unreliable (graphs aren't queryable as SOQL objects), so this is an
  // editable field pre-filled with the org's known graph.
  const dataGraphInput = el('input', {
    type: 'text', id: 'dataGraphName',
    value: prefill.profileDataGraphName || 'Marketing_Content_Personalizat',
    placeholder: 'e.g. Marketing_Content_Personalizat',
  });
  // Website connector id (UUID) or the full beacon <script src> from the org's
  // Web SDK install snippet. This drives the live beacon that makes WPM attach.
  // Data Cloud Setup → Websites & Mobile Apps → your connector → install code.
  const connectorInput = el('input', {
    type: 'text', id: 'connectorId',
    value: prefill.connector || '',
    placeholder: 'connector id (UUID) or full https://cdn.c360a.salesforce.com/beacon/... URL',
  });

  // Demo name — always used (form OR upload).
  form.appendChild(el('label', {}, 'Demo name'));
  form.appendChild(nameInput);

  // Generator-only fields — IGNORED when a file is uploaded, so group them in a
  // dimmable block with a heading that clarifies the "configure it here" path.
  const configFields = el('div', { class: 'config-fields' }, [
    el('div', { class: 'config-fields-head small muted' }, 'Configure the experience'),
    el('label', {}, 'Industry template'), industrySel,
    el('label', {}, 'Use case / vignette'), useCaseSel,
    el('label', {}, 'Brand name'), brandInput,
    el('div', { class: 'field-row' }, [
      el('div', {}, [el('label', {}, 'Primary color'), primaryInput]),
      el('div', {}, [el('label', {}, 'Accent color'), accentInput]),
    ]),
  ]);
  form.appendChild(configFields);

  _uploadedHtml = null;
  const uploadStatus = el('div', { class: 'small muted', style: 'margin-top:0.75rem' });
  const fileInput = el('input', { type: 'file', accept: '.html,text/html', id: 'uploadFile', style: 'display:none' });
  const chooseBtn = el('button', {
    type: 'button', class: 'btn secondary upload-btn',
    onclick: () => fileInput.click(),
  }, 'Choose downloaded HTML file…');

  const uploadCard = el('div', { class: 'card upload-card', style: 'margin-top:1rem' }, [
    el('strong', {}, 'Upload a downloaded experience'),
    el('p', { class: 'small muted', style: 'margin:0.35rem 0 0.75rem' },
      'Skip the form and host an HTML file you downloaded from the Experience Generator’s Adaptive Web experience. We host it as-is and inject the Data Cloud SDK + content zones. Uploading a file overrides the form fields above.'),
    chooseBtn, fileInput, uploadStatus,
  ]);

  const setFileMode = (on) => {
    configFields.classList.toggle('dimmed', on);
    uploadCard.classList.toggle('active', on);
  };

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) { _uploadedHtml = null; uploadStatus.textContent = ''; setFileMode(false); return; }
    const reader = new FileReader();
    reader.onload = () => {
      _uploadedHtml = String(reader.result || '');
      const ok = /warm-homepage-section|floating-cards-container|cat-hero/.test(_uploadedHtml);
      uploadStatus.className = ok ? 'banner success small' : 'banner error small';
      uploadStatus.style.marginTop = '0.75rem';
      chooseBtn.textContent = ok ? `✓ ${file.name}` : 'Choose downloaded HTML file…';
      uploadStatus.textContent = ok
        ? `Hosting “${file.name}” (${Math.round(_uploadedHtml.length / 1024)} KB) as-is. The form fields above are ignored — only the demo name, Profile Data Graph, and this file are used.`
        : `“${file.name}” doesn’t look like an Adaptive Web export (content zones not found). It won’t work as a live demo.`;
      if (!ok) _uploadedHtml = null;
      setFileMode(ok);
    };
    reader.readAsText(file);
  });
  form.appendChild(uploadCard);

  // Profile Data Graph — always applies (form OR upload), so it lives outside the
  // dimmable block, below the two source options.
  form.appendChild(el('label', { style: 'margin-top:1.25rem; display:block' }, 'Profile Data Graph'));
  form.appendChild(dataGraphInput);
  form.appendChild(el('p', { class: 'small muted', style: 'margin-top:0.25rem' },
    'The Data Cloud Profile Data Graph the Personalization Points bind to. Applies whether you configure the form or upload a file.'));
  form.appendChild(el('label', { style: 'margin-top:1.25rem; display:block' }, 'Website connector (for live WPM)'));
  form.appendChild(connectorInput);
  form.appendChild(el('p', { class: 'small muted', style: 'margin-top:0.25rem' },
    'Makes WPM attach to the page. Paste your Website connector id (UUID) or the whole Web SDK <script src> URL from its install snippet. In Data Cloud Setup → Websites & Mobile Apps → your connector. Leave blank to host the page without a live beacon (WPM won’t attach).'));

  const statusArea = el('div', { id: 'deployStatus', style: 'margin-top:1.25rem' });
  const deployBtn = el('button', { class: 'btn', onclick: () => runDeploy() },
    'Deploy to ' + (conn ? (conn.org_alias || conn.org_id) : 'org'));
  form.appendChild(el('div', { style: 'margin-top:1.5rem' }, [deployBtn]));
  form.appendChild(statusArea);
  card.appendChild(form);

  // Populate dropdowns.
  loadCatalog().then((cat) => {
    cat.industries.forEach((ind) => {
      industrySel.appendChild(el('option', { value: ind.key }, ind.label));
    });
    const fillUseCases = () => {
      useCaseSel.innerHTML = '';
      const ind = cat.industries.find((i) => i.key === industrySel.value) || cat.industries[0];
      (ind.useCases || []).forEach((uc) => useCaseSel.appendChild(el('option', { value: uc.key }, uc.name)));
    };
    industrySel.addEventListener('change', fillUseCases);
    if (prefill.adaptiveWebSubIndustry) industrySel.value = prefill.adaptiveWebSubIndustry;
    fillUseCases();
    if (prefill.adaptiveWebSubUseCase) useCaseSel.value = prefill.adaptiveWebSubUseCase;
  });

  // Prerequisites check on load.
  runPrereqCheck(card, conn);

  return card;
}

async function runPrereqCheck(card, conn) {
  if (!conn) return;
  const box = el('div', { class: 'banner info small', html: 'Checking org prerequisites…' });
  card.insertBefore(box, card.children[1]);
  try {
    const pre = await api('GET', `/api/sf/${conn.id}/prerequisites`);
    const line = (label, chk) => {
      const ok = chk && chk.ok;
      const cls = ok === true ? 'ok' : ok === false ? 'err' : 'unknown';
      return el('li', {}, [el('span', { class: 'status-dot ' + cls }), label + (chk && chk.detail ? ' — ' + chk.detail : '')]);
    };
    // Stash discovered Profile Data Graphs so deploy can bind PPs to one.
    const pdg = pre.checks.profileDataGraph || {};
    state.profileDataGraphs = Array.isArray(pdg.graphs) ? pdg.graphs : [];
    box.className = 'card';
    box.innerHTML = '';
    box.appendChild(el('strong', {}, pre.ready ? 'Prerequisites OK' : 'Prerequisites incomplete'));
    box.appendChild(el('ul', { class: 'check-list small' }, [
      line('Personalization', pre.checks.personalization),
      line('Personalization Schema', pre.checks.personalizationSchema),
      line('Profile Data Graph', pre.checks.profileDataGraph),
    ]));
  } catch (e) {
    box.className = 'banner error small';
    box.textContent = 'Prerequisite check failed: ' + e.message;
  }
}

async function runDeploy() {
  const conn = activeConnection();
  const name = $('#demoName').value.trim();
  const statusArea = $('#deployStatus');
  if (!name) {
    statusArea.innerHTML = '';
    statusArea.appendChild(el('div', { class: 'banner error' }, 'Demo name is required.'));
    return;
  }
  const usingUpload = !!_uploadedHtml;
  const formData = {
    adaptiveBrandName: $('#brandName').value,
    adaptiveWebSubIndustry: $('#industrySel').value,
    adaptiveWebSubUseCase: $('#useCaseSel').value,
    adaptivePrimaryColor: $('#primaryColor').value,
    adaptiveAccentColor: $('#accentColor').value,
  };

  const steps = ['Creating Content Schemas', 'Creating Experience Template', 'Creating Personalization Points + Decisions', 'Generating hosted URL', 'Done'];
  const stepList = el('ul', { class: 'steps' }, steps.map((s) => el('li', {}, s)));
  statusArea.innerHTML = '';
  statusArea.appendChild(stepList);
  const setStep = (i, cls) => { if (stepList.children[i]) stepList.children[i].className = cls; };
  setStep(0, 'active');

  // Bind PPs to a Profile Data Graph. Prefer the explicit field; fall back to a
  // graph the prerequisites check discovered (when API discovery worked).
  const graphs = state.profileDataGraphs || [];
  const profileDataGraphName =
    ($('#dataGraphName') && $('#dataGraphName').value.trim()) ||
    (graphs[0] && (graphs[0].name || graphs[0].id)) ||
    undefined;
  if (!profileDataGraphName) {
    setStep(0, 'error');
    statusArea.appendChild(el('div', { class: 'banner error' },
      'A Profile Data Graph name is required to create Personalization Points. Enter one in the Profile Data Graph field.'));
    return;
  }

  try {
    const result = await api('POST', '/api/deployments', {
      name,
      connectionId: conn.id,
      industry: formData.adaptiveWebSubIndustry,
      formData,
      profileDataGraphName,
      connector: ($('#connectorId') && $('#connectorId').value.trim()) || undefined,
      uploadedHtml: usingUpload ? _uploadedHtml : undefined,
      expiry: 'never',
    });
    steps.forEach((_, i) => setStep(i, 'done'));
    statusArea.appendChild(renderPostDeploy(result, conn));
  } catch (e) {
    setStep(0, 'error');
    statusArea.appendChild(el('div', { class: 'banner error' }, 'Deploy failed: ' + e.message));
  }
}

// Turn a raw P13N/Connect error message into an SE-actionable troubleshooting
// hint. Returns null when we have nothing specific to add.
function troubleshootHint(errMsg) {
  const m = String(errMsg || '').toLowerCase();
  if (/data ?graph|profiledatagraph|profile data graph/.test(m)) {
    return 'The Profile Data Graph name may be wrong or missing in this org. Check the exact API name in Data Cloud Setup → Data Graphs and re-enter it in the Profile Data Graph field. A Profile Data Graph requires a configured Data Cloud data model.';
  }
  if (/not.*enabled|not.*support|does not exist.*personalization/.test(m)) {
    return 'Personalization may not be fully enabled in this org. Confirm the prerequisites above are green before deploying.';
  }
  if (/duplicate|already exists/.test(m)) {
    return 'An object with this name already exists — a demo with the same name may have been deployed before. Use a different demo name, or delete the earlier demo from Manage Demos first.';
  }
  if (/criteria/.test(m)) {
    return 'Decision criteria cannot be set via API — this should not happen from the app; report it.';
  }
  return null;
}

function renderPostDeploy(result, conn) {
  const d = result.deploy || {};
  const failed = d.mode === 'error';
  const box = el('div', { class: 'card', style: 'margin-top:1rem' });
  box.appendChild(el('h3', {}, failed ? 'Deploy incomplete' : 'Deployed'));

  if (failed) {
    // Object creation failed. The hosted page may still exist, but WPM won't
    // work without the objects, so lead with the error + how to fix it.
    box.appendChild(el('div', { class: 'banner error small' }, 'Personalization object creation failed: ' + (d.error || 'unknown error')));
    const hint = troubleshootHint(d.error);
    if (hint) box.appendChild(el('div', { class: 'banner info small', style: 'margin-top:0.5rem' }, hint));
    box.appendChild(el('p', { class: 'small muted', style: 'margin-top:0.5rem' },
      'Fix the issue above and deploy again. No partial demo was left usable; remove any leftover objects from Manage Demos if needed.'));
    return box;
  }

  box.appendChild(el('div', { class: 'hosted-url' }, [el('span', {}, result.hostedUrl)]));
  box.appendChild(
    el('div', { style: 'margin-top:0.75rem; display:flex; gap:0.5rem' }, [
      el('button', { class: 'btn secondary', onclick: () => navigator.clipboard.writeText(result.hostedUrl) }, 'Copy Link'),
      el('a', { class: 'btn secondary', href: result.hostedUrl, target: '_blank' }, 'Open in New Tab'),
      // Real WPM: open the hosted page with the activation param. The Web SDK
      // prompts SF login and overlays the Web Personalization Manager.
      el('a', { class: 'btn', href: result.hostedUrl + '?sf_personalization_wpm', target: '_blank' }, 'Open in WPM'),
      el('a', { class: 'btn secondary', href: '/api/deployments/' + result.id + '/sitemap' }, 'Download Sitemap'),
    ])
  );
  // One-time connector step so WPM sees this page's content zones + PPs.
  box.appendChild(el('div', { class: 'banner info small', style: 'margin-top:0.75rem' },
    'Before WPM shows your Personalization Points: download the sitemap above and upload it in Data Cloud Setup → Websites & Mobile Apps → your connector → Replace Sitemap. This registers this page’s content zones with the connector (one-time per demo/page).'));

  const a = d.artifacts || {};
  const nSchemas = (a.schemas || []).length;
  const nPps = (a.pps || []).length;
  const beaconLive = !!d.connector;
  box.appendChild(el('div', { class: 'banner success small', style: 'margin-top:1rem' },
    `Created ${nSchemas} Content Schemas + ${nPps} Personalization Points in data space “${a.dataSpaceName || 'default'}”.`));
  box.appendChild(el('div', { class: beaconLive ? 'banner info small' : 'banner warn small', style: 'margin-top:0.5rem' },
    beaconLive
      ? 'Web SDK beacon is live. Click “Open in WPM” to author experiences on the hosted page.'
      : 'Beacon could not be wired (tenant endpoint not found) — the page renders but WPM will not attach. Re-check org prerequisites, then redeploy.'));
  return box;
}

// --- Manage Demos ---
function renderManageDemos() {
  const card = el('div', { class: 'card' }, [el('h2', {}, 'Manage Demos')]);
  const body = el('div', {}, el('p', { class: 'muted' }, 'Loading…'));
  card.appendChild(body);

  api('GET', '/api/deployments').then((rows) => {
    state.deployments = rows;
    body.innerHTML = '';
    if (!rows.length) {
      body.appendChild(el('p', { class: 'muted' }, 'No demos yet. Create one in New Demo.'));
      return;
    }
    const table = el('table', { class: 'demos' });
    table.appendChild(el('thead', {}, el('tr', {}, [
      el('th', {}, 'Name'), el('th', {}, 'Org'), el('th', {}, 'Status'),
      el('th', {}, 'Created'), el('th', {}, 'Actions'),
    ])));
    rows.forEach((r) => {
      table.appendChild(el('tr', {}, [
        el('td', {}, r.name),
        el('td', {}, r.orgAlias || r.orgId || ''),
        el('td', {}, el('span', { class: 'badge ' + r.status }, r.status)),
        el('td', {}, new Date(r.createdAt).toLocaleString()),
        el('td', {}, el('div', { style: 'display:flex;gap:0.4rem' }, [
          el('a', { class: 'btn secondary small', href: r.hostedUrl, target: '_blank' }, 'Open'),
          el('button', { class: 'btn danger small', onclick: () => confirmDelete(r) }, 'Delete'),
        ])),
      ]));
    });
    body.appendChild(table);
  }).catch((e) => {
    body.innerHTML = '';
    body.appendChild(el('div', { class: 'banner error' }, 'Failed to load demos: ' + e.message));
  });

  return card;
}

// Delete confirmation modal — lists the exact SF object identifiers that will be
// removed (feedback_ask_before_delete: require explicit confirmation).
function confirmDelete(row) {
  const art = row.artifacts || {};
  const ids = [];
  (art.schemas || []).forEach((s) => ids.push('Content Schema: ' + (s.name || s.fullName || s.id || JSON.stringify(s))));
  (art.transformers || []).forEach((t) => ids.push('Experience Template: ' + (t.name || t.id || JSON.stringify(t))));
  (art.pps || []).forEach((p) => ids.push('Personalization Point: ' + (p.name || p.fullName || p.id || JSON.stringify(p))));

  const modalRoot = $('#modalRoot');
  modalRoot.innerHTML = '';
  const close = () => { modalRoot.innerHTML = ''; };
  const modal = el('div', { class: 'modal' }, [
    el('h3', {}, 'Delete “' + row.name + '”?'),
    el('p', { class: 'small' }, 'This removes the hosted URL and attempts to delete the following objects from ' + (row.orgAlias || 'the org') + ':'),
    el('div', { class: 'id-list' }, ids.length ? ids.join('\n') : 'No org objects were recorded for this demo.'),
    el('div', { class: 'modal-actions' }, [
      el('button', { class: 'btn secondary', onclick: close }, 'Cancel'),
      el('button', { class: 'btn danger', onclick: () => doDelete(row.id, close) }, 'Delete'),
    ]),
  ]);
  modalRoot.appendChild(el('div', { class: 'modal-backdrop', onclick: (e) => { if (e.target.className === 'modal-backdrop') close(); } }, modal));
}

async function doDelete(id, close) {
  try {
    await api('DELETE', '/api/deployments/' + id);
  } catch (e) {
    // 207 = cleanup incomplete: some org objects remain and the demo was kept
    // so you can retry. Show exactly what's left.
    if (e.status === 207 || (e.data && e.data.error === 'cleanup_incomplete')) {
      alert('Delete incomplete — the demo was kept so you can retry.\n\n' + (e.message || 'Some objects could not be removed from the org.'));
    } else {
      alert('Delete failed: ' + e.message);
    }
  }
  close();
  renderApp();
}

// --- Connected Orgs ---
function renderConnectedOrgs() {
  const card = el('div', { class: 'card' }, [el('h2', {}, 'Connected Orgs')]);
  state.connections.forEach((c) => {
    card.appendChild(
      el('div', { style: 'display:flex;justify-content:space-between;align-items:center;padding:0.5rem 0;border-bottom:1px solid var(--border)' }, [
        el('div', {}, [
          el('strong', {}, c.org_alias || c.org_id),
          el('div', { class: 'muted small' }, c.instance_url + (c.is_sandbox ? ' (sandbox)' : '')),
        ]),
        el('button', { class: 'btn danger small', onclick: () => disconnectOrg(c.id) }, 'Disconnect'),
      ])
    );
  });
  card.appendChild(
    el('div', { style: 'margin-top:1rem' }, [
      el('a', { class: 'btn', href: '/auth/salesforce?sandbox=false' }, 'Connect another org'),
    ])
  );
  return card;
}

async function disconnectOrg(id) {
  if (!confirm('Disconnect this org? Demos deployed to it will remain but cannot be managed until reconnected.')) return;
  try { await api('DELETE', '/api/sf/connections/' + id); } catch (e) { alert(e.message); }
  state.connections = await api('GET', '/api/sf/connections');
  state.activeConnectionId = state.connections[0] && state.connections[0].id;
  renderApp();
}

document.addEventListener('DOMContentLoaded', boot);
