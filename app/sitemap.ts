import type { MetadataRoute } from "next";
import { AGENTS } from "@/lib/agents";
import { AUDITS } from "@/lib/audits-data";
import { listPublishedInsights } from "@/lib/db";
import { SITE_URL } from "@/lib/site";

// Insights come from the database, so refresh the sitemap in the background.
// Publishing or editing a post through /api/insights also revalidates it.
export const revalidate = 300;

/**
 * Last real content change of the static pages. These are fixed dates, not
 * "now": a lastmod that changes on every build tells crawlers to ignore it.
 * Bump the date when a page's content changes.
 */
const STATIC_LAST_MODIFIED = new Date("2026-11-13");

const STATIC_PAGES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/agents", priority: 0.9 },
  { path: "/how-we-work", priority: 0.8 },
  { path: "/about", priority: 0.7 },
  { path: "/contact", priority: 0.8 },
  { path: "/security", priority: 0.6 },
  { path: "/insights", priority: 0.6 },
  { path: "/letter", priority: 0.6 },
  { path: "/audits", priority: 0.6 },
  { path: "/benchmarks", priority: 0.6 },
  { path: "/integrations", priority: 0.6 },
  { path: "/careers", priority: 0.5 },
  { path: "/privacy", priority: 0.3 },
  { path: "/terms", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = STATIC_PAGES.map(({ path, priority }) => ({
    url: path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`,
    lastModified: STATIC_LAST_MODIFIED,
    priority,
  }));

  const agentPages: MetadataRoute.Sitemap = AGENTS.map((agent) => ({
    url: `${SITE_URL}/agents/${agent.slug}`,
    lastModified: STATIC_LAST_MODIFIED,
    priority: agent.status === "live" ? 0.8 : 0.6,
  }));

  // Sample pages are noindex, so they stay out of the sitemap.
  const auditPages: MetadataRoute.Sitemap = AUDITS.filter((a) => !a.sample).map((a) => ({
    url: `${SITE_URL}/audits/${a.slug}`,
    lastModified: STATIC_LAST_MODIFIED,
    priority: 0.5,
  }));

  // Every published Insights post. If the database cannot be reached, still
  // serve the static routes rather than failing the sitemap.
  let insightPages: MetadataRoute.Sitemap = [];
  try {
    const insights = await listPublishedInsights({});
    insightPages = insights.map((insight) => ({
      url: `${SITE_URL}/insights/${insight.slug}`,
      lastModified: insight.updatedAt,
      priority: 0.5,
    }));
  } catch (error) {
    console.warn("[sitemap] Could not load Insights; listing static routes only.", error);
  }

  // TODO: add real /letter/[slug] issues here once ISSUES holds non-sample data.
  return [...staticPages, ...agentPages, ...auditPages, ...insightPages];
}
