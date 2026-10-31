import { revalidatePath } from "next/cache";
import { deleteInsight, getInsightBySlug, updateInsight } from "@/lib/db";
import { InsightPayloadSchema } from "@/lib/schemas/insight";
import { isAuthorizedPublishRequest } from "@/lib/insights-auth";
import { SITE_URL } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params;
  const insight = await getInsightBySlug(slug);
  if (!insight) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  return Response.json({
    slug: insight.slug,
    title: insight.title,
    kicker: insight.kicker,
    readTimeMinutes: insight.readTimeMinutes,
    dek: insight.dek,
    heroImage: {
      url: insight.heroImageUrl,
      alt: insight.heroImageAlt,
      tagChipText: insight.heroImageTagChipText ?? undefined,
    },
    byline: {
      name: insight.bylineName,
      publishedAt: insight.bylinePublishedAt,
    },
    sections: insight.sections,
    sources: insight.sources,
    bodyHtml: insight.bodyHtml,
    contentEngineBundleId: insight.contentEngineBundleId ?? undefined,
  });
}

export async function PUT(request: Request, { params }: Params) {
  if (!isAuthorizedPublishRequest(request)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { slug } = await params;

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

  if (payload.slug !== slug) {
    return Response.json({ error: "slug_mismatch" }, { status: 400 });
  }

  const updated = await updateInsight(slug, payload);
  if (!updated) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  revalidatePath("/insights");
  revalidatePath(`/insights/${slug}`);

  return Response.json({
    success: true,
    publishedUrl: `${SITE_URL}/insights/${slug}`,
  });
}

export async function DELETE(request: Request, { params }: Params) {
  if (!isAuthorizedPublishRequest(request)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { slug } = await params;

  const deleted = await deleteInsight(slug);
  if (!deleted) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  revalidatePath("/insights");
  revalidatePath(`/insights/${slug}`);

  return Response.json({ success: true });
}
