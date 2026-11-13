import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const SITE_NAME = "Avishkar";

/** Homepage title. Also the default for any route that sets no title. */
export const DEFAULT_TITLE = "Avishkar | Technology Partner for Medspas";

/** Applied to every inner-page title by the root layout. */
export const TITLE_SUFFIX = " | Avishkar Technology Partner";
export const TITLE_TEMPLATE = `%s${TITLE_SUFFIX}`;

export const DEFAULT_DESCRIPTION =
  "Avishkar is a technology partner for medspas. We connect the tools your practice already uses and build integrations, automation and AI agents around them.";

/** The generated 1200x630 card from app/opengraph-image.tsx. */
export const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: DEFAULT_TITLE,
} as const;

export type SeoImage = { url: string; width?: number; height?: number; alt?: string };

export type SeoInput = {
  /**
   * Page title without the brand suffix (the layout template adds it), or
   * `{ absolute }` for a title that is used exactly as written.
   */
  title: string | { absolute: string };
  description: string;
  /** Route path starting with "/", e.g. "/about". Used for canonical and og:url. */
  path: string;
  image?: SeoImage;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  /** Extra <link rel="alternate"> entries, e.g. an RSS feed. */
  alternateTypes?: Record<string, string>;
  noindex?: boolean;
};

/** Shortens text at a word boundary so it fits a meta description. */
export function clip(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.-]+$/, "")}…`;
}

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

/**
 * Builds a route's Metadata. Every route goes through here so that canonical,
 * og:*, and the twitter card are always set together: Next replaces (not
 * merges) `openGraph` per route, so setting it by hand loses the image and
 * inherits the wrong URL.
 */
export function buildMetadata(input: SeoInput): Metadata {
  const { title, description, path, image, type = "website" } = input;
  const ogTitle = typeof title === "string" ? `${title}${TITLE_SUFFIX}` : title.absolute;
  const img = image ?? DEFAULT_OG_IMAGE;
  const images = [
    {
      url: img.url,
      ...(img.width ? { width: img.width } : {}),
      ...(img.height ? { height: img.height } : {}),
      alt: img.alt ?? ogTitle,
    },
  ];

  return {
    title,
    description,
    alternates: {
      canonical: path,
      ...(input.alternateTypes ? { types: input.alternateTypes } : {}),
    },
    openGraph: {
      title: ogTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "en_US",
      type,
      images,
      ...(type === "article"
        ? {
            ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
            ...(input.modifiedTime ? { modifiedTime: input.modifiedTime } : {}),
            ...(input.authors?.length ? { authors: input.authors } : {}),
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: images.map((i) => ({ url: i.url, alt: i.alt })),
    },
    ...(input.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
