import type { MetadataRoute } from "next";

// Your production domain — the ONE place it's defined.
// Change this when you know your final domain, and robots + sitemap both update.
const SITE_URL = "https://avishkar.app";

/**
 * Generates /robots.txt
 *
 * Next.js calls this function at build time and converts the returned object
 * into a properly-formatted robots.txt file served at /robots.txt.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*", // applies to ALL crawlers (Google, Bing, etc.)
        allow: "/", // allow crawling the entire site...
        disallow: ["/api/"], // ...except the API routes (not meant for search)
      },
    ],
    // Tell crawlers where the sitemap lives — this is how they find it.
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
