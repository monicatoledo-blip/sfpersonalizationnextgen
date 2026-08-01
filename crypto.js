'use strict';

// AES-256-GCM encryption for Salesforce tokens at rest.
// Stored blobs are BYTEA in Postgres: [12-byte IV][16-byte auth tag][ciphertext].
// Key comes from TOKEN_ENC_KEY (64 hex chars = 32 bytes).

const crypto = require('crypto');

const ALGO = 'aes-256-gcm';
const IV_LEN = 12;
const TAG_LEN = 16;

function getKey() {
  const hex = process.env.TOKEN_ENC_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error(
      'TOKEN_ENC_KEY must be set to a 64-char hex string (32 bytes). ' +
        'Generate: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
    );
  }
  return Buffer.from(hex, 'hex');
}

// Returns a Buffer suitable for a BYTEA column.
function encrypt(plaintext) {
  if (plaintext == null) throw new Error('encrypt: plaintext is required');
  const key = getKey();
  const iv = crypto.randomBytes(IV_LEN);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const enc = Buffer.concat([cipher.update(String(plaintext), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]);
}

// Accepts a Buffer (as read from BYTEA). Returns the UTF-8 plaintext.
function decrypt(blob) {
  if (!blob) throw new Error('decrypt: blob is required');
  const buf = Buffer.isBuffer(blob) ? blob : Buffer.from(blob);
  const iv = buf.subarray(0, IV_LEN);
  const tag = buf.subarray(IV_LEN, IV_LEN + TAG_LEN);
  const enc = buf.subarray(IV_LEN + TAG_LEN);
  const decipher = crypto.createDecipheriv(ALGO, getKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(enc), decipher.final()]).toString('utf8');
}

module.exports = { encrypt, decrypt };
