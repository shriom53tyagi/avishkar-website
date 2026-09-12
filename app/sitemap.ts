import type { MetadataRoute } from "next";
import { AGENTS } from "@/lib/agents";
import { SITE_URL } from "@/lib/site";

const INSIGHTS_SLUGS = ["the-practice-operating-system-nobody-sold-you"];

/**
 * Generates /sitemap.xml. Agent and resource pages are derived from their
 * content files, so publishing a new agent needs no change here.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/agents`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/how-we-work`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/security`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/insights`, lastModified, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/careers`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];

  const agentPages: MetadataRoute.Sitemap = AGENTS.map((agent) => ({
    url: `${SITE_URL}/agents/${agent.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: agent.status === "live" ? 0.8 : 0.6,
  }));

  const insightPages: MetadataRoute.Sitemap = INSIGHTS_SLUGS.map((slug) => ({
    url: `${SITE_URL}/insights/${slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticPages, ...agentPages, ...insightPages];
}
