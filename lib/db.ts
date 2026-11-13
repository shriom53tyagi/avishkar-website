import { Pool } from "pg";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import type { InsightPayload } from "@/lib/schemas/insight";

export type InsightSection = {
  id: string;
  heading: string;
  blocks: unknown[];
};

export type InsightSource = {
  sourceTitle: string;
  sourceUrl: string;
};

export type Insight = {
  id: string;
  slug: string;
  title: string;
  kicker: string;
  readTimeMinutes: number;
  dek: string;
  heroImageUrl: string;
  heroImageAlt: string;
  heroImageTagChipText: string | null;
  bylineName: string;
  bylinePublishedAt: Date;
  sections: InsightSection[];
  sources: InsightSource[];
  bodyHtml: string;
  contentEngineBundleId: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

declare global {
  var __avishkarPgPool: Pool | undefined;
}

function getPool(): Pool | null {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.warn("[db] DATABASE_URL is not set — Insights features are disabled.");
    return null;
  }

  if (!global.__avishkarPgPool) {
    global.__avishkarPgPool = new Pool({
      connectionString: databaseUrl,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    });
  }

  return global.__avishkarPgPool;
}

// During `next build` the database may be unreachable (CI, fresh checkouts), and
// every prerendered page goes through the root layout, which lists insights. Fall
// back to an empty result there so the build passes and ISR fills the data in
// later. At runtime this must rethrow: a transient error during ISR revalidation
// then keeps serving the last good cached page instead of replacing it with an
// empty one.
function isBuildPhase(): boolean {
  return process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD;
}

type InsightRow = {
  id: string;
  slug: string;
  title: string;
  kicker: string;
  read_time_minutes: number;
  dek: string;
  hero_image_url: string;
  hero_image_alt: string;
  hero_image_tag_chip_text: string | null;
  byline_name: string;
  byline_published_at: Date;
  sections: InsightSection[];
  sources: InsightSource[];
  body_html: string;
  content_engine_bundle_id: string | null;
  status: string;
  created_at: Date;
  updated_at: Date;
};

function rowToInsight(row: InsightRow): Insight {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    kicker: row.kicker,
    readTimeMinutes: row.read_time_minutes,
    dek: row.dek,
    heroImageUrl: row.hero_image_url,
    heroImageAlt: row.hero_image_alt,
    heroImageTagChipText: row.hero_image_tag_chip_text,
    bylineName: row.byline_name,
    bylinePublishedAt: row.byline_published_at,
    sections: row.sections,
    sources: row.sources,
    bodyHtml: row.body_html,
    contentEngineBundleId: row.content_engine_bundle_id,
    status: row.status,
    createdAt: row.created_at,
    // updated_at has no NOT NULL constraint; never hand back null.
    updatedAt: row.updated_at ?? row.byline_published_at,
  };
}

export async function getInsightBySlug(slug: string): Promise<Insight | null> {
  const pool = getPool();
  if (!pool) return null;

  const { rows } = await pool.query<InsightRow>(
    `SELECT * FROM insights WHERE slug = $1 AND status = 'PUBLISHED' LIMIT 1`,
    [slug],
  );
  return rows[0] ? rowToInsight(rows[0]) : null;
}

export async function listPublishedInsights(opts?: {
  limit?: number;
  offset?: number;
  kicker?: string;
  excludeSlug?: string;
}): Promise<Insight[]> {
  const pool = getPool();
  if (!pool) return [];

  const { limit, offset, kicker, excludeSlug } = opts ?? {};
  const conditions = ["status = 'PUBLISHED'"];
  const params: unknown[] = [];

  if (kicker) {
    params.push(kicker);
    conditions.push(`kicker = $${params.length}`);
  }
  if (excludeSlug) {
    params.push(excludeSlug);
    conditions.push(`slug <> $${params.length}`);
  }

  let query = `SELECT * FROM insights WHERE ${conditions.join(" AND ")} ORDER BY byline_published_at DESC`;

  if (typeof limit === "number") {
    params.push(limit);
    query += ` LIMIT $${params.length}`;
  }
  if (typeof offset === "number") {
    params.push(offset);
    query += ` OFFSET $${params.length}`;
  }

  try {
    const { rows } = await pool.query<InsightRow>(query, params);
    return rows.map(rowToInsight);
  } catch (error) {
    if (!isBuildPhase()) throw error;
    console.warn("[db] listPublishedInsights failed during build; using an empty list.", error);
    return [];
  }
}

export async function countPublishedInsights(): Promise<number> {
  const pool = getPool();
  if (!pool) return 0;

  try {
    const { rows } = await pool.query<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM insights WHERE status = 'PUBLISHED'`,
    );
    return parseInt(rows[0]?.count ?? "0", 10);
  } catch (error) {
    if (!isBuildPhase()) throw error;
    console.warn("[db] countPublishedInsights failed during build; using 0.", error);
    return 0;
  }
}

export async function createInsight(payload: InsightPayload): Promise<Insight> {
  const pool = getPool();
  if (!pool) throw new Error("Database is not configured");

  const { rows } = await pool.query<InsightRow>(
    `INSERT INTO insights (
      slug, title, kicker, read_time_minutes, dek,
      hero_image_url, hero_image_alt, hero_image_tag_chip_text,
      byline_name, byline_published_at,
      sections, sources, body_html, content_engine_bundle_id
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
    RETURNING *`,
    [
      payload.slug,
      payload.title,
      payload.kicker,
      payload.readTimeMinutes,
      payload.dek,
      payload.heroImage.url,
      payload.heroImage.alt,
      payload.heroImage.tagChipText ?? null,
      payload.byline.name,
      payload.byline.publishedAt,
      JSON.stringify(payload.sections),
      JSON.stringify(payload.sources),
      payload.bodyHtml,
      payload.contentEngineBundleId ?? null,
    ],
  );
  return rowToInsight(rows[0]);
}

export async function updateInsight(
  slug: string,
  payload: InsightPayload,
): Promise<Insight | null> {
  const pool = getPool();
  if (!pool) throw new Error("Database is not configured");

  const { rows } = await pool.query<InsightRow>(
    `UPDATE insights SET
      slug = $2,
      title = $3,
      kicker = $4,
      read_time_minutes = $5,
      dek = $6,
      hero_image_url = $7,
      hero_image_alt = $8,
      hero_image_tag_chip_text = $9,
      byline_name = $10,
      byline_published_at = $11,
      sections = $12,
      sources = $13,
      body_html = $14,
      content_engine_bundle_id = $15,
      updated_at = now()
    WHERE slug = $1
    RETURNING *`,
    [
      slug,
      payload.slug,
      payload.title,
      payload.kicker,
      payload.readTimeMinutes,
      payload.dek,
      payload.heroImage.url,
      payload.heroImage.alt,
      payload.heroImage.tagChipText ?? null,
      payload.byline.name,
      payload.byline.publishedAt,
      JSON.stringify(payload.sections),
      JSON.stringify(payload.sources),
      payload.bodyHtml,
      payload.contentEngineBundleId ?? null,
    ],
  );
  return rows[0] ? rowToInsight(rows[0]) : null;
}

export async function deleteInsight(slug: string): Promise<boolean> {
  const pool = getPool();
  if (!pool) return false;

  const result = await pool.query(`DELETE FROM insights WHERE slug = $1`, [slug]);
  return (result.rowCount ?? 0) > 0;
}
