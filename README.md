# SP Demo Builder

Internal tool for Salesforce Marketing SEs to spin up a live **Salesforce
Personalization (Next-Gen)** web-personalization demo in a connected SDO in
minutes. SP sibling of the MI Demo Builder.

Flow: Google sign-in (`@salesforce.com`) → connect an SDO via Salesforce OAuth →
pick industry/use-case + brand → **Deploy** creates the Personalization objects
in the org and hosts a public `/e/:uuid` experience with the Data Cloud Web SDK +
content zones injected → attach in WPM for a live demo. Manage Demos lists
everything with per-demo delete and auto-cleanup.

## Stack

Node 20 + Express · vanilla JS SPA · Heroku Postgres · `passport-google-oauth20`
· `jsforce` · AES-256-GCM for Salesforce tokens at rest.

## Local development

```bash
npm install
cp .env.example .env          # fill in the values (see below)
createdb sp_demo_builder      # or point DATABASE_URL at any Postgres
npm run dev                    # node --watch server.js
```

The schema is created automatically on boot (`db.initSchema`). Visit
`http://localhost:3000`.

### Required env vars

See `.env.example` for the full list. The app boots without Google/Salesforce
credentials (sign-in is disabled with a warning) so `/health` and static assets
work, but you need them for the real flow:

- `SESSION_SECRET`, `TOKEN_ENC_KEY` — two independent 32-byte hex values.
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google Cloud OAuth web client;
  authorized redirect URI = `<APP_BASE_URL>/auth/google/callback`.
- `SF_CLIENT_ID` / `SF_CLIENT_SECRET` — one Salesforce Connected App (scopes:
  `full refresh_token offline_access web`); callback =
  `<APP_BASE_URL>/auth/salesforce/callback`. Works for both prod and sandbox.
- `APP_BASE_URL` — public base URL (builds hosted links + OAuth callbacks).

## Deploy (Heroku)

`main` auto-deploys. One-time:

```bash
heroku addons:create heroku-postgresql:essential-0
heroku config:set SESSION_SECRET=... TOKEN_ENC_KEY=... \
  GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=... GOOGLE_ALLOWED_DOMAINS=salesforce.com \
  SF_CLIENT_ID=... SF_CLIENT_SECRET=... \
  SF_CALLBACK_URL=https://<app>.herokuapp.com/auth/salesforce/callback \
  APP_BASE_URL=https://<app>.herokuapp.com
```

Then register the two callback URLs on the Google OAuth client and the Salesforce
Connected App.

## Structure

```
server.js            Express bootstrap + route registration
db.js                pg pool, schema init, CRUD
crypto.js            AES-256-GCM for SF tokens
auth/                google.js (passport) + salesforce.js (jsforce OAuth)
sf/                  client.js (Connection factory) · deploy.js · cleanup.js
html/                build.js (token-sub render) · inject-sdk.js · templates/
data/                copy.js · assets.js · matrix.js · generator.js (ported verbatim)
routes/              deployments.js · serve.js (GET /e/:id) · sf.js
public/              index.html · script.js · styles.css (SPA)
workers/             auto-cleanup.js
```

`data/{copy,assets,matrix}.js` and `data/generator.js` are ported from the
Cumulus Experience Generator; the copy/asset data is lifted verbatim. The two
apps drift on purpose — do not symlink or share a runtime.

## Known follow-ups (see plan / handoff)

- **Metadata API deploy is gated.** `PersonalizationSchema` / `PersonalizationPoint`
  are not createable via standard REST. `sf/deploy.js` builds the Metadata API
  package and probes support, but the actual `metadata.deploy()` is intentionally
  not fired until the Metadata Coverage Report is confirmed against the target org
  (returns `mode:'ready'` or a `mode:'manual'` step list meanwhile).
- **Auto-cleanup** defaults to a 15-min worker; run with `CLEANUP_DRY_RUN=true`
  first so nothing touches an org until it has been watched once.
- **Website Connector tenant id** is a one-time manual step per SDO; until set,
  the SDK beacon is injected commented-out and the sitemap still initializes.
- `jsforce@1.x` pulls transitive advisories; pinned deliberately per plan. Revisit
  a jsforce 2/3 upgrade separately.
```
