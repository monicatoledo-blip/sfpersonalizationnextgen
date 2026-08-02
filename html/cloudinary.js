'use strict';

// Uploads a hero image to Cloudinary via an UNSIGNED upload preset and returns
// the hosted https URL. Used so Personalization Decisions store a short CDN URL
// instead of a giant base64 data URI (which would bloat Postgres and can't be
// stored in a decision attribute).
//
// Config (env):
//   CLOUDINARY_CLOUD_NAME    e.g. "dfx98jgdc"
//   CLOUDINARY_UPLOAD_PRESET e.g. "salesforcepersonalization" (unsigned)
//
// Accepts either a base64 data URI (data:image/...;base64,....) or an existing
// http(s) URL. If it's already a hosted http(s) URL (not a data URI), we return
// it unchanged — no need to re-host. If Cloudinary isn't configured or upload
// fails, returns null so the caller can proceed without an image (never throws).

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || '';
const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || '';

function isConfigured() {
  return Boolean(CLOUD_NAME && UPLOAD_PRESET);
}

// uploadHeroImage(src, { publicId }) -> hosted URL | original URL | null
async function uploadHeroImage(src, opts = {}) {
  const s = String(src || '').trim();
  if (!s) return null;

  // Already a hosted URL (not a data URI) — keep as-is.
  if (/^https?:\/\//i.test(s) && !/^data:/i.test(s)) return s;

  // A data URI (or bare base64) — needs hosting. Requires Cloudinary config.
  if (!isConfigured()) return null;

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const form = new URLSearchParams();
  form.set('file', s); // Cloudinary accepts a data URI directly as `file`
  form.set('upload_preset', UPLOAD_PRESET);
  if (opts.publicId) form.set('public_id', String(opts.publicId));

  try {
    const res = await fetch(endpoint, { method: 'POST', body: form });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error(`[cloudinary] upload failed ${res.status}: ${detail.slice(0, 300)}`);
      return null;
    }
    const json = await res.json();
    return json.secure_url || json.url || null;
  } catch (err) {
    console.error('[cloudinary] upload error', err && err.message);
    return null;
  }
}

module.exports = { uploadHeroImage, isConfigured };
