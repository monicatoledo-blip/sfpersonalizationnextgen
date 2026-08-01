'use strict';

// Salesforce OAuth 2.0 web-server flow via jsforce.
// One Connected App serves both prod and sandbox; the login host is chosen at
// runtime from the ?sandbox flag and stashed in the session across the redirect.
// Tokens are encrypted (crypto.js) before landing in sf_connections.

const crypto = require('crypto');
const jsforce = require('jsforce');
const db = require('../db');
const { encrypt } = require('../crypto');
const { requireAuth } = require('./google');

const LOGIN_PROD = 'https://login.salesforce.com';
const LOGIN_SANDBOX = 'https://test.salesforce.com';

// PKCE (S256): the org enforces Proof Key for Code Exchange. We generate a
// high-entropy verifier, send its SHA-256 challenge on the authorize redirect,
// and present the raw verifier at token exchange.
function makePkce() {
  const verifier = crypto.randomBytes(64).toString('base64url');
  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
  return { verifier, challenge };
}

function oauth2(loginUrl) {
  return new jsforce.OAuth2({
    loginUrl,
    clientId: process.env.SF_CLIENT_ID,
    clientSecret: process.env.SF_CLIENT_SECRET,
    redirectUri: process.env.SF_CALLBACK_URL,
  });
}

// The token response's `id` is an identity URL like
// https://login.salesforce.com/id/<orgId>/<userId>. Pull the 18-char org id.
function orgIdFrom(tok) {
  if (!tok || !tok.id) return null;
  const parts = String(tok.id).split('/');
  return parts[parts.length - 2] || null;
}

// POST the authorization code + PKCE verifier to the org's token endpoint.
// Uses the global fetch (Node 18+). Returns the parsed token JSON.
async function exchangeCode({ loginUrl, code, verifier }) {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: process.env.SF_CLIENT_ID,
    client_secret: process.env.SF_CLIENT_SECRET,
    redirect_uri: process.env.SF_CALLBACK_URL,
    code_verifier: verifier,
  });
  const resp = await fetch(`${loginUrl}/services/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const json = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    const msg = json.error_description || json.error || `token exchange failed (HTTP ${resp.status})`;
    throw new Error(msg);
  }
  return json;
}

function registerRoutes(app) {
  // Kick off the OAuth dance. Remember sandbox choice for the callback.
  app.get('/auth/salesforce', requireAuth, (req, res) => {
    const isSandbox = req.query.sandbox === 'true' || req.query.sandbox === '1';
    req.session.sfSandbox = isSandbox;
    const { verifier, challenge } = makePkce();
    req.session.sfPkceVerifier = verifier;
    const loginUrl = isSandbox ? LOGIN_SANDBOX : LOGIN_PROD;
    const url = oauth2(loginUrl).getAuthorizationUrl({
      scope: 'full refresh_token offline_access',
      prompt: 'login',
      code_challenge: challenge,
      code_challenge_method: 'S256',
    });
    res.redirect(url);
  });

  app.get('/auth/salesforce/callback', requireAuth, async (req, res, next) => {
    try {
      if (req.query.error) {
        return res.redirect(
          `/?sf_error=${encodeURIComponent(req.query.error_description || req.query.error)}`
        );
      }
      const isSandbox = !!req.session.sfSandbox;
      const loginUrl = isSandbox ? LOGIN_SANDBOX : LOGIN_PROD;
      const verifier = req.session.sfPkceVerifier;
      if (!verifier) {
        return res.redirect('/?sf_error=' + encodeURIComponent('Missing PKCE verifier; please retry the connection.'));
      }
      delete req.session.sfPkceVerifier;

      // Manual token exchange so we can include the PKCE code_verifier (jsforce
      // 1.x getAuthorizationUrl/authorize does not thread it through).
      const tok = await exchangeCode({ loginUrl, code: req.query.code, verifier });

      await db.upsertSfConnection({
        userId: req.user.id,
        orgId: orgIdFrom(tok),
        orgAlias: (tok.instance_url || '').replace(/^https?:\/\//, '').replace(/\.my\.salesforce\.com.*/, ''),
        instanceUrl: tok.instance_url,
        isSandbox,
        accessTokenEnc: encrypt(tok.access_token),
        refreshTokenEnc: encrypt(tok.refresh_token || ''),
      });

      res.redirect('/?sf_connected=1');
    } catch (err) {
      next(err);
    }
  });

  app.get('/api/sf/connections', requireAuth, async (req, res, next) => {
    try {
      res.json(await db.listSfConnections(req.user.id));
    } catch (err) {
      next(err);
    }
  });

  app.delete('/api/sf/connections/:id', requireAuth, async (req, res, next) => {
    try {
      const ok = await db.deleteSfConnection(req.user.id, req.params.id);
      if (!ok) return res.status(404).json({ error: 'not_found' });
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  });
}

module.exports = { registerRoutes, LOGIN_PROD, LOGIN_SANDBOX, oauth2 };
