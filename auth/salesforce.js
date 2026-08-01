'use strict';

// Salesforce OAuth 2.0 web-server flow via jsforce.
// One Connected App serves both prod and sandbox; the login host is chosen at
// runtime from the ?sandbox flag and stashed in the session across the redirect.
// Tokens are encrypted (crypto.js) before landing in sf_connections.

const jsforce = require('jsforce');
const db = require('../db');
const { encrypt } = require('../crypto');
const { requireAuth } = require('./google');

const LOGIN_PROD = 'https://login.salesforce.com';
const LOGIN_SANDBOX = 'https://test.salesforce.com';

function oauth2(loginUrl) {
  return new jsforce.OAuth2({
    loginUrl,
    clientId: process.env.SF_CLIENT_ID,
    clientSecret: process.env.SF_CLIENT_SECRET,
    redirectUri: process.env.SF_CALLBACK_URL,
  });
}

// Extract the 18-char org id from jsforce userInfo (organizationId is 18-char).
function orgIdFrom(userInfo) {
  return userInfo && userInfo.organizationId;
}

function registerRoutes(app) {
  // Kick off the OAuth dance. Remember sandbox choice for the callback.
  app.get('/auth/salesforce', requireAuth, (req, res) => {
    const isSandbox = req.query.sandbox === 'true' || req.query.sandbox === '1';
    req.session.sfSandbox = isSandbox;
    const loginUrl = isSandbox ? LOGIN_SANDBOX : LOGIN_PROD;
    const url = oauth2(loginUrl).getAuthorizationUrl({
      scope: 'full refresh_token offline_access web',
      prompt: 'login',
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
      const conn = new jsforce.Connection({ oauth2: oauth2(loginUrl) });
      const userInfo = await conn.authorize(req.query.code);

      await db.upsertSfConnection({
        userId: req.user.id,
        orgId: orgIdFrom(userInfo),
        orgAlias: conn.instanceUrl.replace(/^https?:\/\//, '').replace(/\.my\.salesforce\.com.*/, ''),
        instanceUrl: conn.instanceUrl,
        isSandbox,
        accessTokenEnc: encrypt(conn.accessToken),
        refreshTokenEnc: encrypt(conn.refreshToken || ''),
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
