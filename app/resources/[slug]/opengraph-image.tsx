import { ImageResponse } from "next/og";
import { getResource, CATEGORY_LABELS } from "@/lib/resources";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = getResource(slug);
  return [
    {
      id: slug,
      alt: resource?.metaTitle ?? "Avishkar AI Resource",
      size,
      contentType,
    },
  ];
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = getResource(slug);
  if (!resource) return new Response("Not found", { status: 404 });

  const categoryLabel = CATEGORY_LABELS[resource.category];
  const accentColor =
    resource.category === "data"
      ? "#1570EF"
      : resource.category === "guide"
      ? "#6D5BD0"
      : "#059669";

  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        background: "#FBFCFD",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        fontFamily: "system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Accent glow */}
      <div
        style={{
          position: "absolute",
          top: "-80px",
          right: "-80px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}12 0%, transparent 70%)`,
          display: "flex",
        }}
      />

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #1570EF, #6D5BD0)",
            display: "flex",
          }}
        />
        <span style={{ color: "#0F172A", fontSize: "18px", fontWeight: "600" }}>
          Avishkar
        </span>
        <span
          style={{
            color: "#94A3B8",
            fontSize: "11px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          /AI
        </span>
        <span
          style={{
            color: "#CBD5E1",
            fontSize: "14px",
            marginLeft: "8px",
          }}
        >
          Resources
        </span>
      </div>

      {/* Category + headline */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#EFF6FF",
            border: "1px solid #DBEAFE",
            borderRadius: "100px",
            padding: "6px 14px",
            width: "fit-content",
          }}
        >
          <span
            style={{
              color: accentColor,
              fontSize: "13px",
              fontWeight: "500",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {categoryLabel}
          </span>
        </div>

        <div
          style={{
            fontSize: resource.headline.length > 60 ? "44px" : "52px",
            fontWeight: "700",
            letterSpacing: "-1.5px",
            lineHeight: "1.1",
            color: "#0F172A",
          }}
        >
          {resource.headline}
        </div>
      </div>

      {/* Bottom */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: "#94A3B8", fontSize: "14px" }}>
          avishkar.ai/resources/{resource.slug}
        </span>
        <span style={{ color: "#94A3B8", fontSize: "14px" }}>
          {resource.readingTime}
        </span>
      </div>
    </div>,
    { ...size }
  );
}
