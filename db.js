'use strict';

// Postgres access layer: pool, schema init, and CRUD helpers.
// Mirrors the data model in the plan (users, sf_connections, deployments).

const { Pool } = require('pg');

// Heroku Postgres requires SSL; local dev typically does not.
const useSSL = /(amazonaws\.com|herokuapp\.com|\.render\.com)/.test(process.env.DATABASE_URL || '') ||
  process.env.PGSSLMODE === 'require';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('[db] unexpected idle client error', err);
});

async function query(text, params) {
  return pool.query(text, params);
}

async function ping() {
  const { rows } = await pool.query('SELECT 1 AS ok');
  return rows[0] && rows[0].ok === 1;
}

const SCHEMA_SQL = `
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_sub    TEXT UNIQUE NOT NULL,
  email         TEXT NOT NULL,
  name          TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sf_connections (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  org_id            TEXT NOT NULL,
  org_alias         TEXT,
  instance_url      TEXT NOT NULL,
  is_sandbox        BOOLEAN NOT NULL,
  access_token_enc  BYTEA NOT NULL,
  refresh_token_enc BYTEA NOT NULL,
  connected_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, org_id)
);

CREATE TABLE IF NOT EXISTS deployments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sf_connection_id  UUID NOT NULL REFERENCES sf_connections(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  industry          TEXT,
  form_data         JSONB NOT NULL,
  generated_html    TEXT NOT NULL,
  sf_artifacts      JSONB NOT NULL DEFAULT '{}'::jsonb,
  status            TEXT NOT NULL DEFAULT 'active',
  expires_at        TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deployments_user_updated
  ON deployments (user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_deployments_expires
  ON deployments (expires_at) WHERE expires_at IS NOT NULL AND status = 'active';
`;

async function initSchema() {
  await pool.query(SCHEMA_SQL);
  console.log('[db] schema ready');
}

// --- users ---

async function upsertUser({ googleSub, email, name }) {
  const { rows } = await pool.query(
    `INSERT INTO users (google_sub, email, name)
     VALUES ($1, $2, $3)
     ON CONFLICT (google_sub)
     DO UPDATE SET email = EXCLUDED.email, name = EXCLUDED.name
     RETURNING *`,
    [googleSub, email, name || null]
  );
  return rows[0];
}

async function getUserById(id) {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return rows[0] || null;
}

// --- sf_connections ---

async function upsertSfConnection({
  userId,
  orgId,
  orgAlias,
  instanceUrl,
  isSandbox,
  accessTokenEnc,
  refreshTokenEnc,
}) {
  const { rows } = await pool.query(
    `INSERT INTO sf_connections
       (user_id, org_id, org_alias, instance_url, is_sandbox, access_token_enc, refresh_token_enc)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (user_id, org_id)
     DO UPDATE SET
       org_alias = EXCLUDED.org_alias,
       instance_url = EXCLUDED.instance_url,
       is_sandbox = EXCLUDED.is_sandbox,
       access_token_enc = EXCLUDED.access_token_enc,
       refresh_token_enc = EXCLUDED.refresh_token_enc,
       connected_at = NOW()
     RETURNING *`,
    [userId, orgId, orgAlias || null, instanceUrl, isSandbox, accessTokenEnc, refreshTokenEnc]
  );
  return rows[0];
}

async function listSfConnections(userId) {
  const { rows } = await pool.query(
    `SELECT id, org_id, org_alias, instance_url, is_sandbox, connected_at
     FROM sf_connections WHERE user_id = $1 ORDER BY connected_at DESC`,
    [userId]
  );
  return rows;
}

async function getSfConnection(userId, id) {
  const { rows } = await pool.query(
    'SELECT * FROM sf_connections WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  return rows[0] || null;
}

async function updateSfConnectionAccessToken(id, accessTokenEnc) {
  await pool.query('UPDATE sf_connections SET access_token_enc = $2 WHERE id = $1', [
    id,
    accessTokenEnc,
  ]);
}

// Update one or both encrypted tokens. `fields` may contain access_token_enc
// and/or refresh_token_enc (refresh-token rotation stores both).
async function updateSfConnectionTokens(id, fields) {
  const sets = [];
  const vals = [];
  let i = 1;
  for (const col of ['access_token_enc', 'refresh_token_enc']) {
    if (fields[col] !== undefined) {
      sets.push(`${col} = $${i++}`);
      vals.push(fields[col]);
    }
  }
  if (!sets.length) return;
  vals.push(id);
  await pool.query(`UPDATE sf_connections SET ${sets.join(', ')} WHERE id = $${i}`, vals);
}

async function deleteSfConnection(userId, id) {
  const { rowCount } = await pool.query(
    'DELETE FROM sf_connections WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  return rowCount > 0;
}

// --- deployments ---

async function createDeployment(d) {
  const { rows } = await pool.query(
    `INSERT INTO deployments
       (user_id, sf_connection_id, name, industry, form_data, generated_html, sf_artifacts, status, expires_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      d.userId,
      d.sfConnectionId,
      d.name,
      d.industry || null,
      d.formData,
      d.generatedHtml,
      d.sfArtifacts || {},
      d.status || 'active',
      d.expiresAt || null,
    ]
  );
  return rows[0];
}

async function listDeployments(userId) {
  const { rows } = await pool.query(
    `SELECT d.id, d.name, d.industry, d.status, d.expires_at, d.created_at, d.updated_at,
            d.sf_artifacts, c.org_alias, c.org_id
     FROM deployments d
     JOIN sf_connections c ON c.id = d.sf_connection_id
     WHERE d.user_id = $1 AND d.status <> 'deleted'
     ORDER BY d.updated_at DESC`,
    [userId]
  );
  return rows;
}

async function getDeployment(userId, id) {
  const { rows } = await pool.query(
    'SELECT * FROM deployments WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  return rows[0] || null;
}

// Public serve path: fetch by id only, must be active.
async function getActiveDeploymentForServe(id) {
  const { rows } = await pool.query(
    `SELECT id, generated_html FROM deployments WHERE id = $1 AND status = 'active'`,
    [id]
  );
  return rows[0] || null;
}

async function updateDeployment(userId, id, fields) {
  const sets = [];
  const vals = [];
  let i = 1;
  for (const [col, val] of Object.entries(fields)) {
    sets.push(`${col} = $${i++}`);
    vals.push(val);
  }
  sets.push('updated_at = NOW()');
  vals.push(id, userId);
  const { rows } = await pool.query(
    `UPDATE deployments SET ${sets.join(', ')} WHERE id = $${i++} AND user_id = $${i} RETURNING *`,
    vals
  );
  return rows[0] || null;
}

async function markDeploymentDeleted(userId, id) {
  return updateDeployment(userId, id, { status: 'deleted' });
}

// Rows whose expiry has passed and are still active (used by the cleanup worker).
async function listExpiredDeployments() {
  const { rows } = await pool.query(
    `SELECT * FROM deployments WHERE status = 'active' AND expires_at IS NOT NULL AND expires_at <= NOW()`
  );
  return rows;
}

module.exports = {
  pool,
  query,
  ping,
  initSchema,
  upsertUser,
  getUserById,
  upsertSfConnection,
  listSfConnections,
  getSfConnection,
  updateSfConnectionAccessToken,
  updateSfConnectionTokens,
  deleteSfConnection,
  createDeployment,
  listDeployments,
  getDeployment,
  getActiveDeploymentForServe,
  updateDeployment,
  markDeploymentDeleted,
  listExpiredDeployments,
};
