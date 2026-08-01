'use strict';

// Public hosting of generated experiences: GET /e/:id
// Serves the frozen generated_html for an active deployment. Iframe-friendly so
// WPM (and any preview) can embed it: frame-ancestors *, no X-Frame-Options.

const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/e/:id', async (req, res) => {
  let row;
  try {
    row = await db.getActiveDeploymentForServe(req.params.id);
  } catch (err) {
    console.error('[serve] lookup failed', err);
    return res.status(500).type('text/plain').send('Internal error');
  }

  if (!row) {
    return res
      .status(404)
      .type('text/html')
      .send('<!doctype html><meta charset="utf-8"><title>Not found</title><h1>404 — demo not found</h1><p>This experience has been deleted or expired.</p>');
  }

  // Allow embedding anywhere (WPM iframes the public URL).
  res.removeHeader('X-Frame-Options');
  res.setHeader('Content-Security-Policy', 'frame-ancestors *');
  res.setHeader('Cache-Control', 'no-store');
  res.type('text/html').send(row.generated_html);
});

module.exports = router;
