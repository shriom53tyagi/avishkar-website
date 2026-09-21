-- Insights: articles published from the Avishkar Content Engine.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  kicker TEXT NOT NULL,
  read_time_minutes INT NOT NULL,
  dek TEXT NOT NULL,
  hero_image_url TEXT NOT NULL,
  hero_image_alt TEXT NOT NULL,
  hero_image_tag_chip_text TEXT,
  byline_name TEXT NOT NULL,
  byline_published_at TIMESTAMPTZ NOT NULL,
  sections JSONB NOT NULL,           -- array of {id, heading, blocks[]}
  sources JSONB NOT NULL,            -- array of {sourceTitle, sourceUrl}
  body_html TEXT NOT NULL,           -- pre-rendered HTML fragment
  content_engine_bundle_id TEXT,     -- for traceability back to source
  status TEXT DEFAULT 'PUBLISHED',   -- for future soft-delete
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS insights_status_published_at
  ON insights(status, byline_published_at DESC);
CREATE INDEX IF NOT EXISTS insights_kicker ON insights(kicker);
