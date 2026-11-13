import { revalidatePath } from "next/cache";
import { createInsight, getInsightBySlug, listPublishedInsights } from "@/lib/db";
import { InsightPayloadSchema } from "@/lib/schemas/insight";
import { isAuthorizedPublishRequest } from "@/lib/insights-auth";
import { SITE_URL } from "@/lib/site";

export async function GET() {
  const insights = await listPublishedInsights({});
  return Response.json({
    insights: insights.map((i) => ({
      slug: i.slug,
      title: i.title,
      kicker: i.kicker,
      dek: i.dek,
      publishedAt: i.bylinePublishedAt,
      heroImageUrl: i.heroImageUrl,
    })),
  });
}

export async function POST(request: Request) {
  if (!isAuthorizedPublishRequest(request)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = InsightPayloadSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json(
      { error: "invalid_payload", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const payload = parsed.data;

  const existing = await getInsightBySlug(payload.slug);
  if (existing) {
    return Response.json({ error: "slug_exists" }, { status: 409 });
  }

  await createInsight(payload);

  revalidatePath("/insights");
  revalidatePath("/sitemap.xml");
  revalidatePath("/insights/feed.xml");
  revalidatePath(`/insights/${payload.slug}`);

  return Response.json({
    success: true,
    publishedUrl: `${SITE_URL}/insights/${payload.slug}`,
  });
}
