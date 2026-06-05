import type { MetadataRoute } from "next";

// Same single source of truth — keep this identical to robots.ts.
const SITE_URL = "https://avishkar.app";

/**
 * Generates /sitemap.xml
 *
 * Returns an array of every page on the site. Next.js converts this array
 * into valid sitemap XML. Add a new page -> add a line here.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // One timestamp reused for all pages on this build.
  const lastModified = new Date();

  return [
    {
      url: `${SITE_URL}/`,          // the homepage
      lastModified,
      changeFrequency: "weekly",     // hint: how often it changes
      priority: 1,                   // 1.0 = most important page on the site
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/careers`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
