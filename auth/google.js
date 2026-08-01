'use strict';

// Google Sign-In via passport-google-oauth20.
// Only emails on an allowed domain (default salesforce.com) may sign in.
// On first login we upsert a users row; the session stores our internal user id.

const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const db = require('../db');

function allowedDomains() {
  return (process.env.GOOGLE_ALLOWED_DOMAINS || 'salesforce.com')
    .split(',')
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);
}

function emailDomainAllowed(email) {
  if (!email) return false;
  const domain = email.split('@')[1];
  return domain ? allowedDomains().includes(domain.toLowerCase()) : false;
}

function configure() {
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      done(null, await db.getUserById(id));
    } catch (err) {
      done(err);
    }
  });

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn(
      '[auth/google] GOOGLE_CLIENT_ID/SECRET not set — Google sign-in disabled until configured.'
    );
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.APP_BASE_URL}/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails && profile.emails[0] && profile.emails[0].value;
          if (!emailDomainAllowed(email)) {
            return done(null, false, { message: 'domain_not_allowed' });
          }
          const user = await db.upsertUser({
            googleSub: profile.id,
            email,
            name: profile.displayName,
          });
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
}

// Route guard for authenticated API/pages.
function requireAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ error: 'unauthenticated' });
}

// Registers the Google auth routes on the app.
function registerRoutes(app) {
  app.get('/auth/google', (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(503).json({ error: 'google_auth_not_configured' });
    }
    return passport.authenticate('google', {
      scope: ['profile', 'email'],
      prompt: 'select_account',
    })(req, res, next);
  });

  app.get('/auth/google/callback', (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        const reason = (info && info.message) || 'auth_failed';
        return res.redirect(`/?auth_error=${encodeURIComponent(reason)}`);
      }
      req.logIn(user, (loginErr) => {
        if (loginErr) return next(loginErr);
        return res.redirect('/');
      });
    })(req, res, next);
  });

  app.post('/auth/logout', (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy(() => res.json({ ok: true }));
    });
  });

  // Lightweight identity endpoint for the SPA.
  app.get('/api/me', (req, res) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
      return res.json({ id: req.user.id, email: req.user.email, name: req.user.name });
    }
    return res.status(401).json({ error: 'unauthenticated' });
  });
}

module.exports = { configure, registerRoutes, requireAuth, emailDomainAllowed };
