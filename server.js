'use strict';

// SP Demo Builder — Express bootstrap and route registration.
// Boot order: env sanity -> session/passport -> public routes -> auth routes ->
// authed API routes -> SPA fallback. DB schema is initialized on startup.

const path = require('path');
const express = require('express');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const passport = require('passport');

const db = require('./db');
const googleAuth = require('./auth/google');
const salesforceAuth = require('./auth/salesforce');

const app = express();
app.set('trust proxy', 1); // Heroku terminates TLS at the router.

// Uploaded Adaptive Web exports are large (a few MB of inlined HTML/CSS/assets),
// and JSON-encoding inflates them further. 10mb comfortably fits real exports.
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --- Sessions (Postgres-backed) ---
app.use(
  session({
    store: new PgSession({
      pool: db.pool,
      tableName: 'session',
      createTableIfMissing: true,
      disableTouch: true, // don't rewrite the session row on every GET
      pruneSessionInterval: 60 * 15, // prune every 15 min, not per-request
    }),
    secret: process.env.SESSION_SECRET || 'dev-insecure-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
googleAuth.configure();

// --- Public routes ---
app.get('/health', async (req, res) => {
  try {
    const ok = await db.ping();
    res.status(ok ? 200 : 500).json({ status: ok ? 'ok' : 'db_error' });
  } catch (err) {
    res.status(500).json({ status: 'db_error', error: err.message });
  }
});

// Public hosted experiences: GET /e/:id  (mounted before auth on purpose).
app.use('/', require('./routes/serve'));

// --- Auth routes ---
googleAuth.registerRoutes(app);
salesforceAuth.registerRoutes(app);

// --- Authenticated API routes ---
app.use('/api/sf', require('./routes/sf'));
app.use('/api/deployments', require('./routes/deployments'));

// --- Static SPA + fallback ---
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/') || req.path.startsWith('/auth/') || req.path.startsWith('/e/')) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- Error handler ---
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[server] unhandled error', err);
  // Body-parser rejects oversized payloads with a 413 — make it actionable
  // instead of a generic 500 (large uploaded HTML exports are the usual cause).
  if (err && (err.type === 'entity.too.large' || err.status === 413)) {
    return res.status(413).json({
      error: 'file_too_large',
      detail: 'The uploaded HTML is too large for the server to accept. Try a smaller export.',
    });
  }
  const status = err.status || 500;
  // Surface the actual message (not just "internal_error") so SEs and we can
  // troubleshoot. These are our own error strings / Salesforce API messages,
  // not sensitive. The stack stays server-side in the console.error above.
  res.status(status).json({
    error: err.publicMessage || 'internal_error',
    detail: err.message || undefined,
  });
});

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await db.initSchema();
  } catch (err) {
    console.error('[server] schema init failed — is DATABASE_URL set?', err.message);
    // Continue booting so /health can report db_error rather than crash-looping.
  }
  app.listen(PORT, () => {
    console.log(`[server] SP Demo Builder listening on :${PORT} (${process.env.NODE_ENV || 'dev'})`);
  });
}

if (require.main === module) start();

module.exports = app;
