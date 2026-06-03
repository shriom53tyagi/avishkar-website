import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Book an Operational Audit — Avishkar AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        background: "#04050A",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        fontFamily: "system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Emerald glow */}
      <div
        style={{
          position: "absolute",
          top: "-80px",
          right: "-80px",
          width: "450px",
          height: "450px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(52,211,153,0.15) 0%, transparent 70%)",
          display: "flex",
        }}
      />

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "9px",
            background: "linear-gradient(135deg, #22D3EE, #A78BFA)",
            display: "flex",
          }}
        />
        <span style={{ color: "white", fontSize: "20px", fontWeight: "600" }}>
          Avishkar
        </span>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          /AI
        </span>
      </div>

      {/* Main */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <span
          style={{
            color: "#22D3EE",
            fontSize: "14px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            fontWeight: "500",
          }}
        >
          Get in touch
        </span>
        <div
          style={{
            fontSize: "56px",
            fontWeight: "700",
            letterSpacing: "-2px",
            lineHeight: "1.1",
            color: "white",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>Book an</span>
          <span style={{ background: "linear-gradient(90deg, #22D3EE, #34D399)", backgroundClip: "text", color: "transparent" }}>
            Operational Audit
          </span>
        </div>
        <div style={{ fontSize: "22px", color: "rgba(255,255,255,0.55)", maxWidth: "660px", lineHeight: "1.5" }}>
          A fixed-scope audit. A quantified leakage map. A recovery plan — before any automation is proposed.
        </div>
      </div>

      {/* Bottom pills */}
      <div style={{ display: "flex", gap: "10px" }}>
        {["Read-only by default", "HIPAA-aligned", "BAA available", "12 weeks to first impact"].map((t) => (
          <div
            key={t}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "100px",
              padding: "8px 16px",
              color: "rgba(255,255,255,0.6)",
              fontSize: "13px",
              display: "flex",
            }}
          >
            {t}
          </div>
        ))}
      </div>
    </div>,
    { ...size }
  );
}
