import { AGENTS } from "@/lib/agents";
import { CONTACT_EMAIL, SOCIAL_LINKS } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import { DEFAULT_DESCRIPTION } from "@/lib/seo";

/**
 * Structured data, built from the same content the pages render so the two
 * cannot drift apart.
 */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Avishkar",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.webp`,
  description: DEFAULT_DESCRIPTION,
  email: CONTACT_EMAIL,
  sameAs: SOCIAL_LINKS.map((s) => s.href),
  contactPoint: {
    "@type": "ContactPoint",
    email: CONTACT_EMAIL,
    contactType: "sales",
    areaServed: "US",
    availableLanguage: "English",
  },
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Avishkar",
  alternateName: "Avishkar technology partner for medspas",
  url: SITE_URL,
  publisher: { "@type": "Organization", name: "Avishkar", url: SITE_URL },
  inLanguage: "en-US",
};

/** BreadcrumbList. `path` is a site-relative path; the last crumb is the current page. */
export function breadcrumbSchema(crumbs: readonly { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: new URL(c.path, SITE_URL).toString(),
    })),
  };
}

export function blogPostingSchema(post: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  imageUrl: string | null;
}) {
  const url = new URL(post.path, SITE_URL).toString();
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author:
      post.authorName === "Avishkar"
        ? { "@type": "Organization", name: "Avishkar", url: SITE_URL }
        : { "@type": "Person", name: post.authorName },
    image: [post.imageUrl ?? new URL("/opengraph-image", SITE_URL).toString()],
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    publisher: {
      "@type": "Organization",
      name: "Avishkar",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.webp` },
    },
  };
}

export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Practice technology, integrations and custom software",
  provider: {
    "@type": "Organization",
    name: "Avishkar",
    url: SITE_URL,
  },
  description:
    "Avishkar connects the systems a practice already uses and builds integrations, " +
    "automations, internal tools, reporting and agents around its workflows.",
  serviceType: "Practice technology, integrations and custom software",
  areaServed: { "@type": "Country", name: "United States" },
  audience: {
    "@type": "Audience",
    audienceType: "Medspas, aesthetic practices, clinics and healthcare teams",
  },
};

/** Item list of the agent library, for the /agents page. */
export const agentLibrarySchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Agents Avishkar has built for practice teams",
  itemListElement: AGENTS.map((agent, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: agent.name,
    description: agent.oneLiner,
    url: `${SITE_URL}/agents/${agent.slug}`,
  })),
};

export function faqPageSchema(faqs: readonly { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
