'use strict';

// Builds an authenticated jsforce Connection from a stored sf_connections row,
// decrypting tokens and wiring auto-refresh. When jsforce refreshes the access
// token, we persist the new (encrypted) token back to the DB.

const jsforce = require('jsforce');
const db = require('../db');
const { encrypt, decrypt } = require('../crypto');
const { oauth2, LOGIN_PROD, LOGIN_SANDBOX } = require('../auth/salesforce');

const API_VERSION = process.env.SF_API_VERSION || '62.0';

// row: a full sf_connections record (with *_enc BYTEA fields).
function connectionFromRow(row) {
  const loginUrl = row.is_sandbox ? LOGIN_SANDBOX : LOGIN_PROD;
  const conn = new jsforce.Connection({
    oauth2: oauth2(loginUrl),
    instanceUrl: row.instance_url,
    accessToken: decrypt(row.access_token_enc),
    refreshToken: decrypt(row.refresh_token_enc),
    version: API_VERSION,
  });

  // Persist refreshed tokens. The org enforces refresh-token rotation, so each
  // refresh returns a NEW refresh token (in `res.refresh_token`) and invalidates
  // the old one — we must store it and update the in-memory connection, or the
  // next refresh fails. `res` is the full token response from jsforce.
  conn.on('refresh', (accessToken, res) => {
    const fields = { access_token_enc: encrypt(accessToken) };
    if (res && res.refresh_token) {
      conn.refreshToken = res.refresh_token; // keep in-memory conn valid
      fields.refresh_token_enc = encrypt(res.refresh_token);
    }
    db.updateSfConnectionTokens(row.id, fields).catch((err) =>
      console.error('[sf/client] failed to persist refreshed token(s)', err)
    );
  });

  return conn;
}

// Convenience: load the row (scoped to the user) and build the connection.
async function connectionForUser(userId, connectionId) {
  const row = await db.getSfConnection(userId, connectionId);
  if (!row) return null;
  return connectionFromRow(row);
}

module.exports = { connectionFromRow, connectionForUser, API_VERSION };
