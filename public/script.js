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
    const err = new Error((data && data.error) || `HTTP ${res.status}`);
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
  app.appendChild(
    el('div', { class: 'centered-gate' }, [
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
function renderConnectSdo() {
  let sandbox = false;
  const wrap = el('div', { class: 'centered-gate' });
  const card = el('div', { class: 'card' }, [
    el('h2', {}, 'Connect Your SDO'),
    el('p', { class: 'muted' }, 'Connect a Salesforce org (SDO) with Data Cloud + Personalization enabled. The app deploys the demo objects into this org.'),
  ]);
  const sandboxRow = el('label', { class: 'small' }, [
    (() => {
      const cb = el('input', { type: 'checkbox' });
      cb.style.width = 'auto';
      cb.style.minHeight = '0';
      cb.style.marginRight = '0.5rem';
      cb.addEventListener('change', (e) => { sandbox = e.target.checked; });
      return cb;
    })(),
    'This is a sandbox (test.salesforce.com)',
  ]);
  card.appendChild(sandboxRow);
  card.appendChild(
    el('div', { style: 'margin-top:1rem' }, [
      el('a', {
        class: 'btn',
        href: '#',
        onclick: (e) => { e.preventDefault(); location.href = '/auth/salesforce?sandbox=' + sandbox; },
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

  form.appendChild(el('label', {}, 'Demo name'));
  form.appendChild(nameInput);
  form.appendChild(el('label', {}, 'Industry template'));
  form.appendChild(industrySel);
  form.appendChild(el('label', {}, 'Use case / vignette'));
  form.appendChild(useCaseSel);
  form.appendChild(el('label', {}, 'Brand name'));
  form.appendChild(brandInput);
  form.appendChild(
    el('div', { class: 'field-row' }, [
      el('div', {}, [el('label', {}, 'Primary color'), primaryInput]),
      el('div', {}, [el('label', {}, 'Accent color'), accentInput]),
    ])
  );

  const statusArea = el('div', { style: 'margin-top:1.25rem' });
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
  const statusArea = $('#demoName').closest('.card').querySelector('div[style*="margin-top:1.25rem"]');
  if (!name) {
    statusArea.innerHTML = '';
    statusArea.appendChild(el('div', { class: 'banner error' }, 'Demo name is required.'));
    return;
  }
  const formData = {
    adaptiveBrandName: $('#brandName').value,
    adaptiveWebSubIndustry: $('#industrySel').value,
    adaptiveWebSubUseCase: $('#useCaseSel').value,
    adaptivePrimaryColor: $('#primaryColor').value,
    adaptiveAccentColor: $('#accentColor').value,
  };

  const steps = ['Checking prerequisites', 'Creating Content Schemas', 'Creating Personalization Points', 'Creating Decisions', 'Generating hosted URL', 'Done'];
  const stepList = el('ul', { class: 'steps' }, steps.map((s) => el('li', {}, s)));
  statusArea.innerHTML = '';
  statusArea.appendChild(stepList);
  const setStep = (i, cls) => { if (stepList.children[i]) stepList.children[i].className = cls; };
  setStep(0, 'active');

  try {
    const result = await api('POST', '/api/deployments', {
      name,
      connectionId: conn.id,
      industry: formData.adaptiveWebSubIndustry,
      formData,
      expiry: 'never',
    });
    steps.forEach((_, i) => setStep(i, 'done'));
    statusArea.appendChild(renderPostDeploy(result, conn));
  } catch (e) {
    setStep(0, 'error');
    statusArea.appendChild(el('div', { class: 'banner error' }, 'Deploy failed: ' + e.message));
  }
}

function renderPostDeploy(result, conn) {
  const box = el('div', { class: 'card', style: 'margin-top:1rem' });
  box.appendChild(el('h3', {}, 'Deployed'));
  box.appendChild(
    el('div', { class: 'hosted-url' }, [
      el('span', {}, result.hostedUrl),
    ])
  );
  box.appendChild(
    el('div', { style: 'margin-top:0.75rem; display:flex; gap:0.5rem' }, [
      el('button', { class: 'btn secondary', onclick: () => navigator.clipboard.writeText(result.hostedUrl) }, 'Copy Link'),
      el('a', { class: 'btn secondary', href: result.hostedUrl, target: '_blank' }, 'Open in New Tab'),
      el('a', { class: 'btn secondary', href: (conn.instance_url || '') + '/lightning/n/Personalization', target: '_blank' }, 'Open WPM'),
    ])
  );

  // Deploy mode messaging (metadata gated / manual fallback).
  const d = result.deploy || {};
  if (d.mode === 'manual') {
    box.appendChild(el('div', { class: 'banner info small', style: 'margin-top:1rem' }, d.message || 'Create the Personalization objects manually.'));
  } else if (d.mode === 'ready') {
    box.appendChild(el('div', { class: 'banner info small', style: 'margin-top:1rem' }, d.note || 'Metadata deploy is gated pending verification.'));
  } else if (d.mode === 'error') {
    box.appendChild(el('div', { class: 'banner error small', style: 'margin-top:1rem' }, 'SP object creation error: ' + d.error));
  }
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
    table.appendChild(el('tr', {}, [
      el('th', {}, 'Name'), el('th', {}, 'Org'), el('th', {}, 'Status'),
      el('th', {}, 'Created'), el('th', {}, 'Actions'),
    ].map((c) => c)));
    const thead = table.firstChild;
    thead.replaceWith(el('thead', {}, thead));
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
  (art.schemas || []).forEach((s) => ids.push('Schema: ' + (s.fullName || s.id || JSON.stringify(s))));
  (art.pps || []).forEach((p) => ids.push('PP: ' + (p.fullName || p.id || JSON.stringify(p))));
  (art.decisions || []).forEach((d) => ids.push('Decision: ' + (d.id || JSON.stringify(d))));

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
    alert('Delete failed: ' + e.message);
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
