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

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// --- Sessions (Postgres-backed) ---
app.use(
  session({
    store: new PgSession({ pool: db.pool, tableName: 'session', createTableIfMissing: true }),
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
  const status = err.status || 500;
  res.status(status).json({ error: err.publicMessage || 'internal_error' });
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
