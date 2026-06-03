import { ImageResponse } from "next/og";

/**
 * Homepage Open Graph image — auto-registered at /opengraph-image
 *
 * Next.js reads this file and:
 *  1. Serves the PNG at /opengraph-image
 *  2. Automatically injects <meta property="og:image"> into the homepage
 *     so you don't need to set it manually in layout.tsx metadata.
 *
 * Satori (the renderer) supports a subset of CSS — use style={{}} objects,
 * not Tailwind classes. Flexbox works; grid does not.
 */

export const runtime = "edge";
export const alt = "Avishkar AI — Find the Leak. Quantify the Impact. Deploy the Fix.";
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
      {/* Cyan glow top-left */}
      <div
        style={{
          position: "absolute",
          top: "-120px",
          left: "-80px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(34,211,238,0.18) 0%, transparent 70%)",
          display: "flex",
        }}
      />
      {/* Violet glow bottom-right */}
      <div
        style={{
          position: "absolute",
          bottom: "-100px",
          right: "-80px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)",
          display: "flex",
        }}
      />

      {/* Top row — logo + status pill */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #22D3EE, #A78BFA)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                borderLeft: "2px solid white",
                borderBottom: "2px solid white",
                transform: "rotate(-45deg) translateY(-3px)",
                display: "flex",
              }}
            />
          </div>
          <span
            style={{
              color: "white",
              fontSize: "22px",
              fontWeight: "600",
              letterSpacing: "-0.5px",
            }}
          >
            Avishkar
          </span>
          <span
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: "13px",
              fontWeight: "400",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginLeft: "-4px",
            }}
          >
            /AI
          </span>
        </div>

        {/* Status pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "100px",
            padding: "8px 16px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#34D399",
              display: "flex",
            }}
          />
          <span
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "13px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Operational intelligence for healthcare
          </span>
        </div>
      </div>

      {/* Main content */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div
          style={{
            fontSize: "58px",
            fontWeight: "700",
            lineHeight: "1.1",
            letterSpacing: "-2px",
            color: "white",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <span>Stop losing revenue to</span>
          <span
            style={{
              background: "linear-gradient(90deg, #22D3EE, #A78BFA)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            operational blind spots.
          </span>
        </div>
        <div
          style={{
            fontSize: "22px",
            color: "rgba(255,255,255,0.55)",
            lineHeight: "1.5",
            maxWidth: "700px",
          }}
        >
          Audit. Quantify the leak. Deploy AI only where ROI is proven.
        </div>
      </div>

      {/* Bottom row — tagline + metrics */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "6px",
            alignItems: "center",
          }}
        >
          {["Find the Leak", "Quantify the Impact", "Deploy the Fix"].map(
            (t, i) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {i > 0 && (
                  <span
                    style={{
                      color: "rgba(255,255,255,0.2)",
                      fontSize: "14px",
                    }}
                  >
                    ·
                  </span>
                )}
                <span
                  style={{
                    color: "#22D3EE",
                    fontSize: "14px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontWeight: "500",
                  }}
                >
                  {t}
                </span>
              </div>
            )
          )}
        </div>

        {/* Key metric */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "rgba(34,211,238,0.08)",
            border: "1px solid rgba(34,211,238,0.2)",
            borderRadius: "12px",
            padding: "10px 18px",
          }}
        >
          <span style={{ color: "#22D3EE", fontSize: "24px", fontWeight: "700" }}>
            $4.2M+
          </span>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>
            avg recovery identified
          </span>
        </div>
      </div>
    </div>,
    { ...size }
  );
}
