import { CONTACT_EMAIL, TAGLINE, FAQS, SOCIAL_LINKS } from "@/lib/data";

/**
 * Schema.org structured data definitions.
 *
 * All schemas are built from your existing data exports so they stay in sync
 * with your visible content automatically — update lib/data.ts and the schema
 * updates too.
 *
 * SITE_URL: keep this in sync with robots.ts and sitemap.ts.
 * When your domain is final, update all three files.
 */
const SITE_URL = "https://avishkar.ai";

/**
 * Organization schema — sitewide identity.
 *
 * Tells Google: Avishkar is a company, here is its logo, contact info, and
 * social profiles. The `sameAs` array links your site to your official profiles
 * which over time supports a Knowledge Panel in search results.
 *
 * Placed in: app/layout.tsx (renders on every page)
 */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Avishkar AI",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    "Avishkar AI is a healthcare operational intelligence and revenue recovery platform. " +
    TAGLINE,
  email: CONTACT_EMAIL,
  // Links your site to every verified social profile.
  // Google uses this to build a confident brand entity.
  sameAs: SOCIAL_LINKS.map((s) => s.href),
  contactPoint: {
    "@type": "ContactPoint",
    email: CONTACT_EMAIL,
    contactType: "sales",
    areaServed: "US",
    availableLanguage: "English",
  },
};

/**
 * FAQPage schema — turns your FAQ section into rich results.
 *
 * Google can show each question as an expandable dropdown directly in search
 * results — this takes up more space and significantly increases click-through.
 *
 * Built from the same FAQS array your FAQ section renders, so the two can
 * never get out of sync. Add a FAQ to lib/data.ts and it appears in both the
 * visible accordion AND the structured data automatically.
 *
 * Placed in: app/page.tsx (homepage, where the FAQ section lives)
 */
export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.a,
    },
  })),
};

/**
 * Service schema — describes what Avishkar sells.
 *
 * Helps Google understand that this is a B2B service for healthcare, not a
 * consumer app or blog. Supports category-level search relevance.
 *
 * Placed in: app/page.tsx alongside the FAQ schema
 */
export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Operational Intelligence Audit",
  provider: {
    "@type": "Organization",
    name: "Avishkar AI",
    url: SITE_URL,
  },
  description:
    "A fixed-scope operational audit for hospitals and clinics. Avishkar connects " +
    "to existing EMR, billing, scheduling, telephony and patient portal infrastructure, " +
    "builds a live model of operations, surfaces hidden revenue leakage, quantifies " +
    "its financial impact, and deploys targeted AI agents only where measurable ROI exists.",
  serviceType: "Healthcare Operational Intelligence",
  areaServed: {
    "@type": "Country",
    name: "United States",
  },
  audience: {
    "@type": "Audience",
    audienceType: "Hospitals, clinics, healthcare organizations",
  },
  offers: {
    "@type": "Offer",
    description:
      "Fixed-scope operational audit with ongoing agent deployment tied to measurable ROI",
    pricingModel: "Project-based",
    availability: "https://schema.org/InStock",
  },
};
