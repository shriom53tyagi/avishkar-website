import { z } from "zod";

export const INSIGHT_KICKERS = [
  "Practice management",
  "Operations",
  "Patient experience",
  "Growth",
  "AI in aesthetics",
  "Technology",
  "Wellness",
] as const;

export const InsightPayloadSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "slug must be lowercase alphanumeric with hyphens only"),
  title: z.string().min(1).max(500),
  kicker: z.enum(INSIGHT_KICKERS),
  readTimeMinutes: z.number().int().min(1).max(60),
  dek: z.string().min(1).max(2000),
  heroImage: z.object({
    url: z.string().url(),
    alt: z.string(),
    tagChipText: z.string().optional(),
  }),
  byline: z.object({
    name: z.string(),
    publishedAt: z.string().datetime(),
  }),
  sections: z.array(
    z.object({
      id: z.string(),
      heading: z.string(),
      blocks: z.array(z.any()), // trust Content Engine's shape
    }),
  ),
  sources: z.array(
    z.object({
      sourceTitle: z.string(),
      sourceUrl: z.string().url(),
    }),
  ),
  bodyHtml: z.string(),
  contentEngineBundleId: z.string().optional(),
});

export type InsightPayload = z.infer<typeof InsightPayloadSchema>;
