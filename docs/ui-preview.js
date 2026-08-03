'use strict';

/* SP Demo Builder — GUIDED JOURNEY PREVIEW (standalone mockup).
   No network, no backend, nothing deploys. Everything below is fake data
   used only to show the flow + look. The real app's field IDs and deploy
   contract are NOT represented here — this is a design artifact for Monica
   to react to before we touch public/*. */

// --- tiny DOM helpers (same style as the real script.js) ---
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

// --- fake state (mockup only) ---
const state = {
  route: 'newDemo', // newDemo | manageDemos | connectedOrgs
  step: 1, // 1 source-readiness gate is folded into step 1
  source: null, // 'form' | 'upload'
  uploadName: null,
  // Toggle to preview the "org not ready" experience vs. the ready one.
  orgReady: true,
  // Toggle to preview arriving via the Experience Generator handoff (?config).
  fromHandoff: true,
  demos: [
    { id: 'a1', name: 'AYCO Warm Homepage v1', org: 'meshmesh SDO', status: 'active', created: 'Aug 2, 2026, 4:15 PM' },
    { id: 'a2', name: 'Cumulus Auto Loan Demo', org: 'meshmesh SDO', status: 'active', created: 'Aug 1, 2026, 9:02 AM' },
  ],
};

const EXPERIENCE_GENERATOR_URL = 'https://whispering-coast-03303-5bb1f6fb1c95.herokuapp.com';

// ============================================================
// Shell: nav + header controls (mirrors the real app's top tabs)
// ============================================================
function renderNav() {
  const nav = $('#navControls');
  nav.innerHTML = '';
  const items = [
    ['newDemo', 'New Demo'],
    ['manageDemos', 'Manage Demos'],
    ['connectedOrgs', 'Connected Orgs'],
  ];
  items.forEach(([route, label]) => {
    nav.appendChild(
      el('button', {
        class: 'nav-tab' + (state.route === route ? ' active' : ''),
        onclick: () => { state.route = route; if (route === 'newDemo') { state.step = 1; state.source = null; } render(); },
      }, label)
    );
  });

  const controls = $('#headerControls');
  controls.innerHTML = '';
  // Preview-only toggle so Monica can see both the ready + not-ready org states.
  controls.appendChild(
    el('button', {
      class: 'btn ghost small', title: 'Preview toggle only — flips the Step 1 org check between ready and not-ready',
      onclick: () => { state.orgReady = !state.orgReady; render(); },
    }, state.orgReady ? 'Org: ready ⟳' : 'Org: not ready ⟳')
  );
  controls.appendChild(
    el('button', {
      class: 'btn ghost small', title: 'Preview toggle only — simulates arriving from the Experience Generator handoff (?config)',
      onclick: () => { state.fromHandoff = !state.fromHandoff; if (state.fromHandoff && state.source === null) state.source = 'upload'; render(); },
    }, state.fromHandoff ? 'From Exp Gen ⟳' : 'Direct visit ⟳')
  );
  controls.appendChild(el('span', { class: 'user-email' }, 'monica.toledo@salesforce.com'));
  controls.appendChild(el('button', { class: 'btn secondary small' }, 'Sign out'));
}

function render() {
  renderNav();
  const app = $('#app');
  app.innerHTML = '';
  if (state.route === 'newDemo') app.appendChild(renderNewDemo());
  else if (state.route === 'manageDemos') app.appendChild(renderManageDemos());
  else if (state.route === 'connectedOrgs') app.appendChild(renderConnectedOrgs());
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Stepper header used across the New Demo journey.
function stepper(current) {
  const steps = [['Ready', 1], ['Bring experience', 2], ['Target & deploy', 3]];
  const wrap = el('div', { class: 'stepper' });
  steps.forEach(([label, n], i) => {
    const cls = n < current ? 'done' : n === current ? 'active' : '';
    wrap.appendChild(el('div', { class: 'step-node ' + cls }, [
      el('div', { class: 'step-dot' }, n < current ? '✓' : String(n)),
      el('div', { class: 'step-label' }, label),
    ]));
    if (i < steps.length - 1) wrap.appendChild(el('div', { class: 'step-line' }));
  });
  return wrap;
}

// ============================================================
// New Demo — the guided journey
// ============================================================
function renderNewDemo() {
  const card = el('div', { class: 'card' });
  card.appendChild(el('h2', {}, 'New Demo'));
  card.appendChild(el('p', { class: 'step-hint' },
    'Take an experience you designed and stand up a real Salesforce Personalization setup for it in your SDO — in minutes, not a week.'));

  // Arrived from the Experience Generator handoff (?config): confirm the settings
  // came over, and set the expectation that they must have the file in hand.
  if (state.fromHandoff) {
    card.appendChild(el('div', { class: 'banner info', style: 'display:flex; gap:10px; align-items:flex-start' }, [
      el('div', { style: 'font-size:18px; line-height:1' }, '↪'),
      el('div', {}, [
        el('div', { html: '<strong>Brought over from the Experience Generator.</strong> Your brand, colors, and use case are pre-filled in Step 2.' }),
        el('div', { class: 'small', style: 'margin-top:4px' },
          'In Step 2 you’ll upload the Adaptive Web file you downloaded there, so the live demo shows your exact creative. Didn’t download it yet? '),
        el('a', { href: '#', class: 'small' }, 'Go back and download it first →'),
      ]),
    ]));
    // Default the source choice to upload for handoff arrivals.
    if (state.source === null) state.source = 'upload';
  }

  card.appendChild(stepper(state.step));

  if (state.step === 1) card.appendChild(renderStep1());
  else if (state.step === 2) card.appendChild(renderStep2());
  else if (state.step === 3) card.appendChild(renderStep3());
  return card;
}

// ---- Step 1: Is my org actually ready? (fix / recheck gate) ----
function renderStep1() {
  const wrap = el('div');
  wrap.appendChild(el('h3', {}, 'First — is your org ready?'));
  wrap.appendChild(el('p', { class: 'step-hint' },
    'We check the connected SDO for everything a live Personalization demo needs. Fix anything red, then re-check. You can’t deploy into an org that isn’t ready.'));

  const checks = state.orgReady
    ? [
        { icon: 'ok', title: 'Personalization enabled', detail: 'Data 360 Personalization is on in this org.' },
        { icon: 'ok', title: 'Personalization schema access', detail: 'The app can create Content Schemas.' },
        { icon: 'ok', title: 'Real-time Profile Data Graph', detail: 'Found “Real_Time_Personalization”. WPM needs a real-time graph to list your points.' },
        { icon: 'ok', title: 'Website connector', detail: 'Connector “cec9b1f4…” found — the live beacon can attach WPM.' },
      ]
    : [
        { icon: 'ok', title: 'Personalization enabled', detail: 'Data 360 Personalization is on in this org.' },
        { icon: 'ok', title: 'Personalization schema access', detail: 'The app can create Content Schemas.' },
        { icon: 'err', title: 'Real-time Profile Data Graph', detail: 'No real-time profile data graph found in data space “default”.',
          fix: 'WPM only lists Personalization Points bound to a real-time profile data graph. In Data Cloud Setup → Data Graphs, create a Real-Time graph on your Unified Individual, then re-check. (This is the one that cost us a day — do it first.)' },
        { icon: 'err', title: 'Website connector', detail: 'No Website connector id set for the live beacon.',
          fix: 'In Data Cloud Setup → Websites & Mobile Apps, open your connector and copy its id (or the whole install <script src>). Without it the page hosts but WPM can’t attach.' },
      ];

  const list = el('ul', { class: 'readiness-list' });
  checks.forEach((c) => {
    list.appendChild(el('li', {}, [
      el('div', { class: 'rd-icon ' + c.icon }, c.icon === 'ok' ? '✓' : '!'),
      el('div', { class: 'rd-body' }, [
        el('div', { class: 'rd-title' }, c.title),
        el('div', { class: 'rd-detail' }, c.detail),
        c.fix ? el('div', { class: 'rd-fix' }, c.fix) : null,
      ]),
    ]));
  });
  wrap.appendChild(list);

  const ready = state.orgReady;
  wrap.appendChild(el('div', { class: 'rd-summary ' + (ready ? 'ready' : 'notready') }, [
    el('div', { class: 'rd-icon ' + (ready ? 'ok' : 'err') }, ready ? '✓' : '!'),
    el('div', {}, ready
      ? 'Your org is ready. On to bringing your experience in.'
      : 'A couple of things are missing. Fix them above, then re-check — this saves you from a dead-end deploy.'),
  ]));

  wrap.appendChild(el('div', { class: 'step-actions' }, [
    el('span', {}),
    el('div', { style: 'display:flex; gap:10px' }, [
      el('button', { class: 'btn secondary', onclick: () => render() }, 'Re-check org'),
      el('button', {
        class: 'btn', disabled: ready ? null : 'true',
        onclick: () => { if (ready) { state.step = 2; render(); } },
      }, 'Next: bring your experience →'),
    ]),
  ]));
  return wrap;
}

// ---- Step 2: bring your experience (form OR upload — explicit) ----
function renderStep2() {
  const wrap = el('div');
  wrap.appendChild(el('h3', {}, 'Bring your experience'));
  wrap.appendChild(el('p', { class: 'step-hint' },
    'Start from an Adaptive Web file you downloaded in the Experience Generator, or build one here. Pick one — they don’t mix.'));

  wrap.appendChild(el('label', {}, 'Demo name'));
  wrap.appendChild(el('input', { type: 'text', value: 'AYCO Warm Homepage v1', placeholder: 'e.g. AYCO Warm Homepage v1' }));

  const choice = el('div', { class: 'source-choice' });
  const opt = (key, title, desc) => el('div', {
    class: 'source-opt' + (state.source === key ? ' selected' : ''),
    onclick: () => { state.source = key; render(); },
  }, [
    el('div', { class: 'so-title' }, [el('span', { class: 'so-radio' }), title]),
    el('div', { class: 'so-desc' }, desc),
  ]);
  choice.appendChild(opt('upload', 'Upload a downloaded file', 'Host the Adaptive Web HTML you exported from the Experience Generator. Recommended — it’s the exact creative your customer will see.'));
  choice.appendChild(opt('form', 'Design it here', 'Pick an industry + use case and set brand colors. Good for a quick generic demo.'));
  wrap.appendChild(choice);

  if (state.source === 'upload') wrap.appendChild(renderUploadPanel());
  else if (state.source === 'form') wrap.appendChild(renderFormPanel());

  wrap.appendChild(el('div', { class: 'step-actions' }, [
    el('button', { class: 'btn secondary', onclick: () => { state.step = 1; render(); } }, '← Back'),
    el('button', {
      class: 'btn', disabled: state.source ? null : 'true',
      onclick: () => { if (state.source) { state.step = 3; render(); } },
    }, 'Next: target & deploy →'),
  ]));
  return wrap;
}

function renderUploadPanel() {
  const panel = el('div', { class: 'source-panel' });

  // Unmissable download-first callout — SEs must download the Adaptive Web file
  // locally in the Experience Generator BEFORE they can host it here.
  panel.appendChild(el('div', { class: 'banner warn', style: 'display:flex; gap:10px; align-items:flex-start' }, [
    el('div', { style: 'font-size:18px; line-height:1' }, '⬇'),
    el('div', {}, [
      el('div', { html: '<strong>Download your Adaptive Web file first.</strong> In the Experience Generator, use <strong>Download</strong> to save the HTML to your computer — then upload that file here.' }),
      el('div', { class: 'small', style: 'margin-top:4px' },
        'The downloaded file carries your real hero image and copy, so the live demo shows the exact creative you designed. '),
      el('a', { href: EXPERIENCE_GENERATOR_URL, target: '_blank', class: 'small' }, 'Open the Experience Generator →'),
    ]),
  ]));

  const drop = el('div', { class: 'upload-drop' + (state.uploadName ? ' ok' : '') }, [
    el('div', { style: 'font-weight:700; color:#2b3a4a' },
      state.uploadName ? '✓ ' + state.uploadName + ' (148 KB)' : 'Drop your .html here, or choose a file'),
    el('div', { class: 'small muted', style: 'margin-top:6px' },
      state.uploadName
        ? 'Looks like a valid Adaptive Web export — content zones found. We host it as-is and wire in the Data Cloud SDK.'
        : 'Downloaded from the Experience Generator’s Adaptive Web experience.'),
    el('div', { style: 'margin-top:12px' }, [
      el('button', { class: 'btn secondary', onclick: () => { state.uploadName = 'ayco-warm-homepage.html'; render(); } },
        state.uploadName ? 'Choose a different file' : 'Choose HTML file…'),
    ]),
  ]);
  panel.appendChild(drop);
  return panel;
}

function renderFormPanel() {
  const panel = el('div', { class: 'source-panel' });
  panel.appendChild(el('label', {}, 'Industry template'));
  panel.appendChild(el('select', {}, [el('option', {}, 'Financial Services'), el('option', {}, 'Retail')]));
  panel.appendChild(el('label', {}, 'Use case / vignette'));
  panel.appendChild(el('select', {}, [el('option', {}, 'Warm homepage — returning customer'), el('option', {}, 'Auto loan cross-sell')]));
  panel.appendChild(el('label', {}, 'Brand name'));
  panel.appendChild(el('input', { type: 'text', value: 'Cumulus Bank' }));
  panel.appendChild(el('div', { class: 'field-row', style: 'margin-top:4px' }, [
    el('div', {}, [el('label', {}, 'Primary color'), el('input', { type: 'color', value: '#2a94d6' })]),
    el('div', {}, [el('label', {}, 'Accent color'), el('input', { type: 'color', value: '#0176d3' })]),
  ]));
  return panel;
}

// ---- Step 3: target + deploy ----
function renderStep3() {
  const wrap = el('div');
  wrap.appendChild(el('h3', {}, 'Target & deploy'));
  wrap.appendChild(el('p', { class: 'step-hint' },
    'These bind your Personalization Points to Data Cloud and wire the live WPM beacon. Pre-filled for this org — change only for a different SDO.'));

  wrap.appendChild(el('label', {}, 'Profile Data Graph'));
  wrap.appendChild(el('input', { type: 'text', value: 'Real_Time_Personalization' }));
  wrap.appendChild(el('p', { class: 'small muted', style: 'margin-top:4px' },
    'The real-time Data Cloud graph your Personalization Points bind to. WPM won’t list points bound to a batch/marketing graph.'));

  wrap.appendChild(el('label', { style: 'margin-top:18px' }, 'Website connector (for live WPM)'));
  wrap.appendChild(el('input', { type: 'text', value: 'cec9b1f4-0e16-4c62-923d-afd61d237da0' }));
  wrap.appendChild(el('p', { class: 'small muted', style: 'margin-top:4px' },
    'Drives the beacon so WPM attaches to the hosted page. Paste the connector id or the whole install <script src>.'));

  const statusArea = el('div', { id: 'deployStatus', style: 'margin-top:20px' });
  wrap.appendChild(el('div', { class: 'step-actions' }, [
    el('button', { class: 'btn secondary', onclick: () => { state.step = 2; render(); } }, '← Back'),
    el('div', { style: 'display:flex; gap:10px' }, [
      // Preview-only: let Monica see both the success guide and the failure/recovery state.
      el('button', { class: 'btn secondary', onclick: () => runFakeDeploy(statusArea, true) }, 'Simulate a failure'),
      el('button', { class: 'btn', onclick: () => runFakeDeploy(statusArea, false) }, 'Deploy to meshmesh SDO'),
    ]),
  ]));
  wrap.appendChild(statusArea);
  return wrap;
}

// Fake deploy animation → success guide or failure/recovery.
function runFakeDeploy(statusArea, fail) {
  const labels = ['Creating Content Schemas', 'Creating Experience Template', 'Creating Personalization Points + Decisions', 'Generating hosted URL', 'Done'];
  const list = el('ul', { class: 'steps' }, labels.map((s) => el('li', {}, s)));
  statusArea.innerHTML = '';
  statusArea.appendChild(list);
  const failAt = 2; // simulate PP creation failing
  let i = 0;
  const tick = () => {
    if (i > 0) list.children[i - 1].className = 'done';
    if (fail && i === failAt) {
      list.children[i].className = 'error';
      statusArea.appendChild(renderFailure());
      return;
    }
    if (i < labels.length) {
      list.children[i].className = 'active';
      i += 1;
      setTimeout(tick, 550);
    } else {
      statusArea.appendChild(renderSuccessGuide());
    }
  };
  tick();
}

// ---- Success: the "now make it real in WPM" guide (the value payoff) ----
function renderSuccessGuide() {
  const box = el('div', { style: 'margin-top:8px' });

  box.appendChild(el('div', { class: 'guide-hero' }, [
    el('h3', {}, 'Your demo is live 🎉'),
    el('p', { class: 'small', style: 'color:#1b6b3a; margin-top:4px' },
      'You just created a real Salesforce Personalization setup in your SDO — Content Schemas, an Experience Template, and 3 Personalization Points with decisions. Author it in WPM and you’re showing live SP to your customer. No week-long build.'),
    el('div', { class: 'hosted-url', style: 'margin-top:12px; background:#fff' }, 'https://personalizationnextgen-7813d23fde02.herokuapp.com/e/a1b2c3'),
    el('div', { style: 'display:flex; gap:8px; margin-top:12px; flex-wrap:wrap' }, [
      el('button', { class: 'btn secondary small' }, 'Copy Link'),
      el('button', { class: 'btn secondary small' }, 'Open in New Tab'),
      el('button', { class: 'btn small' }, 'Open in WPM'),
      el('button', { class: 'btn secondary small' }, 'Download Sitemap'),
    ]),
  ]));

  box.appendChild(el('div', { class: 'banner success small' },
    'Created 3 Content Schemas + 3 Personalization Points in data space “default”. Web SDK beacon is live.'));

  // The one-time gotcha, in strict order.
  const guide = el('div', { class: 'card', style: 'margin-top:16px' });
  guide.appendChild(el('h3', {}, 'Make it real in WPM — do this once'));
  guide.appendChild(el('p', { class: 'step-hint' }, 'Follow these in order. Skip step 1 and your Personalization Points won’t show up in WPM — the #1 gotcha.'));

  const steps = [
    { n: '1', title: 'Upload the sitemap to your connector', tip: false,
      html: 'Click <strong>Download Sitemap</strong> above, then in <code>Setup → Data Cloud → Websites &amp; Mobile Apps → your connector → Replace Sitemap</code>, upload it. This registers this page’s content zones so WPM knows where your points live. One-time per demo page.' },
    { n: '2', title: 'Open the page in WPM', tip: false,
      html: 'Click <strong>Open in WPM</strong>. Sign into Salesforce when prompted — the Web Personalization Manager overlays the live page.' },
    { n: '3', title: 'Why your points appear (the unlock)', tip: false,
      html: 'WPM’s picker only lists Personalization Points bound to a <strong>real-time profile data graph</strong>. Yours are (that’s why Step 1 checked for it). If the picker is ever empty, that binding is the first thing to check — it cost us a full day to learn.' },
    { n: '★', title: 'Add & edit Personalization Decisions', tip: true,
      html: 'The decisions we created are <strong>always-on</strong> (no targeting rules — the API can’t set those). In WPM, open a Personalization Point and add more <strong>Decisions</strong> with audience criteria — e.g. one hero for mortgage intent, one for auto. The target look is one Point with several Decisions in a dropdown, swapping the creative live.' },
    { n: '★', title: 'Rename & customize', tip: true,
      html: 'Rename Points, Decisions, and the Experience Template in WPM to match your customer’s brand. Edit the hero copy, image, and CTA right in the decision — the swap updates on the hosted page instantly.' },
  ];
  steps.forEach((s) => {
    guide.appendChild(el('div', { class: 'guide-step' }, [
      el('div', { class: 'guide-num' + (s.tip ? ' tip' : '') }, s.n),
      el('div', { class: 'guide-body' }, [
        el('div', { class: 'gb-title' }, [s.title, s.tip ? el('span', { class: 'pill-note' }, 'tip') : null]),
        el('div', { class: 'gb-text', html: s.html }),
      ]),
    ]));
  });
  box.appendChild(guide);
  return box;
}

// ---- Failure: honest "what's in your org / retry cleanly" state ----
function renderFailure() {
  const box = el('div', { style: 'margin-top:12px' });
  box.appendChild(el('div', { class: 'banner error small' },
    'Personalization Point creation failed: the Profile Data Graph “Real_Time_Personalization” wasn’t found in this org.'));
  box.appendChild(el('div', { class: 'banner info small' },
    'How to fix: confirm the exact graph API name in Data Cloud Setup → Data Graphs and re-enter it in Step 3. A real-time graph is required.'));

  const clean = el('div', { class: 'card', style: 'margin-top:12px' });
  clean.appendChild(el('h3', {}, 'Nothing was left in your org'));
  clean.appendChild(el('p', { class: 'gb-text' },
    'A failed deploy is all-or-nothing — we automatically removed the Content Schemas and Experience Template that were created before the error, so there’s nothing to collide with. You can safely fix the graph name and deploy again with the same demo name.'));
  clean.appendChild(el('ul', { class: 'del-log', style: 'margin-top:10px' }, [
    el('li', { class: 'done' }, 'Rolled back: 3 Content Schemas'),
    el('li', { class: 'done' }, 'Rolled back: 1 Experience Template'),
    el('li', { class: 'done' }, 'No Personalization Points were created'),
  ]));
  clean.appendChild(el('div', { style: 'margin-top:14px' }, [
    el('button', { class: 'btn', onclick: () => { state.step = 3; render(); } }, 'Fix and try again'),
  ]));
  box.appendChild(clean);
  return box;
}

// ============================================================
// Manage Demos — with live delete progress + honest report
// ============================================================
function renderManageDemos() {
  const card = el('div', { class: 'card' });
  card.appendChild(el('h2', {}, 'Manage Demos'));
  card.appendChild(el('p', { class: 'step-hint' }, 'Delete runs in the background so it never times out — watch it progress and see exactly what (if anything) needs manual cleanup.'));

  if (!state.demos.length) {
    card.appendChild(el('p', { class: 'muted' }, 'No demos yet. Create one in New Demo.'));
    return card;
  }

  const table = el('table', { class: 'demos' });
  table.appendChild(el('thead', {}, el('tr', {}, [
    el('th', {}, 'Name'), el('th', {}, 'Org'), el('th', {}, 'Status'), el('th', {}, 'Created'), el('th', {}, 'Actions'),
  ])));
  const tbody = el('tbody');
  state.demos.forEach((d) => {
    const statusCell = el('td', {}, el('span', { class: 'badge ' + (d.status === 'deleting' ? 'deleting' : 'active') }, d.status === 'deleting' ? 'deleting' : 'active'));
    const row = el('tr', { 'data-id': d.id }, [
      el('td', {}, d.name),
      el('td', {}, d.org),
      statusCell,
      el('td', {}, d.created),
      el('td', {}, el('div', { style: 'display:flex; gap:8px' }, [
        el('button', { class: 'btn secondary small' }, 'Open'),
        el('button', { class: 'btn danger small', onclick: () => confirmDelete(d) }, 'Delete'),
      ])),
    ]);
    tbody.appendChild(row);
    // Progress row (hidden until a delete is running for this demo).
    tbody.appendChild(el('tr', { 'data-progress-for': d.id, class: 'hidden' }, [
      el('td', { colspan: '5', style: 'background:#f8fafc' }, el('div', { 'data-progress-body': d.id })),
    ]));
  });
  table.appendChild(tbody);
  card.appendChild(table);
  return card;
}

function confirmDelete(d) {
  const modalRoot = $('#modalRoot');
  modalRoot.innerHTML = '';
  const close = () => { modalRoot.innerHTML = ''; };
  const ids = [
    'Content Schema: ' + d.name + ' - Web - Hero Banner',
    'Content Schema: ' + d.name + ' - Web - Content Card',
    'Content Schema: ' + d.name + ' - Web - Category Hero',
    'Experience Template: ' + d.name + ' - Web - Hero Experience Template',
    'Personalization Point: ' + d.name + ' - Web - Homepage Hero',
    'Personalization Point: ' + d.name + ' - Web - Recommended Cards',
    'Personalization Point: ' + d.name + ' - Web - Category Hero',
  ];
  const modal = el('div', { class: 'modal' }, [
    el('h3', {}, 'Delete “' + d.name + '”?'),
    el('p', { class: 'small' }, 'This removes the hosted URL and deletes these objects from ' + d.org + ':'),
    el('div', { class: 'id-list' }, ids.join('\n')),
    el('div', { class: 'modal-actions' }, [
      el('button', { class: 'btn secondary', onclick: close }, 'Cancel'),
      el('button', { class: 'btn danger', onclick: () => { close(); startFakeDelete(d); } }, 'Delete'),
    ]),
  ]);
  modalRoot.appendChild(el('div', { class: 'modal-backdrop', onclick: (e) => { if (e.target.className === 'modal-backdrop') close(); } }, modal));
}

// Simulated background delete with a live progress bar. Demo 'a2' is rigged to
// leave one orphan, so Monica sees the honest "verify manually" report too.
function startFakeDelete(d) {
  d.status = 'deleting';
  render();
  const progRow = document.querySelector(`[data-progress-for="${d.id}"]`);
  const body = document.querySelector(`[data-progress-body="${d.id}"]`);
  if (!progRow || !body) return;
  progRow.classList.remove('hidden');

  const items = [
    { label: 'Personalization Point — Homepage Hero' },
    { label: 'Personalization Point — Recommended Cards' },
    { label: 'Personalization Point — Category Hero' },
    { label: 'Experience Template — Hero' },
    { label: 'Content Schema — Hero Banner' },
    { label: 'Content Schema — Content Card' },
    { label: 'Content Schema — Category Hero' },
  ];
  const leaveOrphan = d.id === 'a2'; // rigged case

  const track = el('div', { class: 'progress-track' }, el('div', { class: 'progress-fill', style: 'width:0%' }));
  const log = el('ul', { class: 'del-log' }, items.map((it) => el('li', { class: 'pending' }, it.label)));
  body.innerHTML = '';
  body.appendChild(el('div', { style: 'font-weight:600; color:#17618e; font-size:13px' }, 'Removing objects from ' + d.org + '…'));
  body.appendChild(track);
  body.appendChild(log);
  const fill = track.firstChild;

  let i = 0;
  const step = () => {
    if (i > 0) {
      const failed = leaveOrphan && i === items.length; // last schema orphaned
      log.children[i - 1].className = failed ? 'fail' : 'done';
    }
    fill.style.width = Math.round((i / items.length) * 100) + '%';
    if (i < items.length) {
      log.children[i].className = 'active';
      i += 1;
      setTimeout(step, 450);
    } else {
      finishDelete(d, body, log);
    }
  };
  step();
}

function finishDelete(d, body, log) {
  const leaveOrphan = d.id === 'a2';
  if (leaveOrphan) {
    body.appendChild(el('div', { class: 'banner warn small', style: 'margin-top:12px' },
      '1 object could not be removed and was left in place — the demo was kept so you can retry. Verify/remove manually in Salesforce: Content Schema “' + d.name + ' - Web - Category Hero” (dependency still referenced).'));
    body.appendChild(el('div', { style: 'margin-top:10px' }, [
      el('button', { class: 'btn danger small', onclick: () => startFakeDelete(d) }, 'Retry delete'),
    ]));
    d.status = 'active';
    // update the badge to error
    const badge = document.querySelector(`[data-id="${d.id}"] .badge`);
    if (badge) { badge.className = 'badge error'; badge.textContent = 'cleanup failed'; }
  } else {
    body.appendChild(el('div', { class: 'banner success small', style: 'margin-top:12px' },
      'Fully deleted — all 7 objects removed from ' + d.org + '. Nothing left behind.'));
    setTimeout(() => {
      state.demos = state.demos.filter((x) => x.id !== d.id);
      render();
    }, 1400);
  }
}

// ============================================================
// Connected Orgs
// ============================================================
function renderConnectedOrgs() {
  const card = el('div', { class: 'card' });
  card.appendChild(el('h2', {}, 'Connected Orgs'));
  card.appendChild(el('div', { style: 'display:flex; justify-content:space-between; align-items:center; padding:14px 0; border-bottom:1px solid var(--border)' }, [
    el('div', {}, [
      el('strong', {}, 'meshmesh SDO'),
      el('div', { class: 'muted small' }, 'https://storm-...salesforce.com (Data Cloud + Personalization)'),
    ]),
    el('button', { class: 'btn danger small' }, 'Disconnect'),
  ]));
  card.appendChild(el('div', { style: 'margin-top:16px' }, el('button', { class: 'btn' }, 'Connect another org')));
  return card;
}

document.addEventListener('DOMContentLoaded', render);
