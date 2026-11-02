import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Avishkar — Technology built around how your practice works";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        background: "#FAFAF9",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <span
        style={{
          color: "#16191D",
          fontSize: "22px",
          fontWeight: 600,
          letterSpacing: "0.08em",
        }}
      >
        AVISHKAR
      </span>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <span
          style={{
            fontSize: "62px",
            fontWeight: 600,
            lineHeight: 1.08,
            letterSpacing: "-1.6px",
            color: "#16191D",
            maxWidth: "900px",
          }}
        >
          Technology built around how your practice works.
        </span>
        <span
          style={{
            fontSize: "24px",
            color: "#5A6169",
            lineHeight: 1.5,
            maxWidth: "820px",
          }}
        >
          We connect the systems you already use and build the technology your team actually needs.
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            width: "40px",
            height: "3px",
            background: "#124C5F",
            display: "flex",
          }}
        />
        <span style={{ fontSize: "18px", color: "#8C939B" }}>
          Integrations · Automation · Custom technology · AI agents
        </span>
      </div>
    </div>,
    { ...size },
  );
}
