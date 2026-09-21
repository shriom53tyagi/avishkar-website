# Testing the Insights DB integration

## 1. Environment variables

In `.env.local` (gitignored):

```
DATABASE_URL=postgres://user:password@ep-xxxx.neon.tech/dbname?sslmode=require
INSIGHTS_PUBLISH_API_KEY=some-long-random-shared-secret
```

Use Neon's **direct** connection string (not the pooled `-pooler` one) — this
app keeps its own long-running `pg` pool.

## 2. Run the migration

```bash
npm run db:migrate
```

Creates the `insights` table (and a `schema_migrations` tracking table) in
your Neon database. Safe to re-run — already-applied migrations are skipped.

## 3. curl commands

Replace `$KEY` with your `INSIGHTS_PUBLISH_API_KEY` and adjust the host if not
testing locally (`http://localhost:3000`).

### POST an article

```bash
curl -i -X POST http://localhost:3000/api/insights \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "test-article-one",
    "title": "Test Article One",
    "kicker": "Operations",
    "readTimeMinutes": 6,
    "dek": "A short deck sentence describing the article.",
    "heroImage": {
      "url": "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
      "alt": "Front desk of a medical spa",
      "tagChipText": "front desk detail"
    },
    "byline": {
      "name": "Avishkar Editorial",
      "publishedAt": "2026-09-20T12:00:00Z"
    },
    "sections": [
      { "id": "s1", "heading": "The problem", "blocks": [] },
      { "id": "s2", "heading": "The fix", "blocks": [] }
    ],
    "sources": [
      { "sourceTitle": "Example source", "sourceUrl": "https://example.com" }
    ],
    "bodyHtml": "<p>Opening paragraph.</p><h2 id=\"s1\">The problem</h2><p>Body text.</p><h2 id=\"s2\">The fix</h2><p>More body text.</p>",
    "contentEngineBundleId": "bundle-123"
  }'
```

Expect: `200 { "success": true, "publishedUrl": "https://avishkar.app/insights/test-article-one" }`

Posting the same slug again should return `409 { "error": "slug_exists" }`.

### GET the public list

```bash
curl -s http://localhost:3000/api/insights | jq
```

Expect: `{ "insights": [ { "slug": "test-article-one", ... } ] }`

### GET one article

```bash
curl -s http://localhost:3000/api/insights/test-article-one | jq
```

Expect: the full article JSON. `404 { "error": "not_found" }` for an unknown slug.

### PUT to update

```bash
curl -i -X PUT http://localhost:3000/api/insights/test-article-one \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "test-article-one",
    "title": "Test Article One (Updated)",
    "kicker": "Operations",
    "readTimeMinutes": 6,
    "dek": "A short deck sentence describing the article.",
    "heroImage": {
      "url": "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
      "alt": "Front desk of a medical spa"
    },
    "byline": {
      "name": "Avishkar Editorial",
      "publishedAt": "2026-09-20T12:00:00Z"
    },
    "sections": [{ "id": "s1", "heading": "The problem", "blocks": [] }],
    "sources": [],
    "bodyHtml": "<p>Updated body.</p>"
  }'
```

Expect: `200 { "success": true, "publishedUrl": "..." }`. A mismatched slug in
the URL vs. body returns `400`; an unknown slug returns `404`.

### DELETE

```bash
curl -i -X DELETE http://localhost:3000/api/insights/test-article-one \
  -H "Authorization: Bearer $KEY"
```

Expect: `200 { "success": true }`, then `404` on a repeat call.

## 4. What to check in the browser

- After the POST: visit `/insights` — the new article should appear in the
  list (and as the featured card if it's the most recent). Click through to
  `/insights/test-article-one` and confirm it renders with the same styling
  as before (hero image, TOC built from `sections`, body content, sources,
  "Keep reading" strip).
- After the PUT: refresh `/insights/test-article-one` — the updated title
  should appear within a few seconds (ISR revalidation, not a full rebuild).
- After the DELETE: `/insights` should no longer list it, and
  `/insights/test-article-one` should return a real Next.js 404 page.

## 5. Restarting the server after code changes

Whichever process manager runs the app in production — restart it after
deploying new code so the new build takes effect:

- `pm2 restart <app-name>` (if using PM2)
- `sudo systemctl restart <service-name>` (if using a systemd unit)
- or manually: stop the running `node .next/standalone/server.js` (or
  `npm start`) process and start it again after `npm run build`

Restarting is not required for content changes (those go through the API and
ISR revalidation) — only for code/dependency changes.
