import { ImageResponse } from "next/og";

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
      {/* Blue glow top-left */}
      <div
        style={{
          position: "absolute",
          top: "-120px",
          left: "-80px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(21,112,239,0.07) 0%, transparent 70%)",
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
            "radial-gradient(circle, rgba(109,91,208,0.06) 0%, transparent 70%)",
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
              background: "linear-gradient(135deg, #1570EF, #6D5BD0)",
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
              color: "#0F172A",
              fontSize: "22px",
              fontWeight: "600",
              letterSpacing: "-0.5px",
            }}
          >
            Avishkar
          </span>
          <span
            style={{
              color: "#94A3B8",
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
            background: "#EFF6FF",
            border: "1px solid #DBEAFE",
            borderRadius: "100px",
            padding: "8px 16px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#059669",
              display: "flex",
            }}
          />
          <span
            style={{
              color: "#475569",
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
            color: "#0F172A",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <span>Stop losing revenue to</span>
          <span
            style={{
              background: "linear-gradient(90deg, #1570EF, #6D5BD0)",
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
            color: "#475569",
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
                      color: "#CBD5E1",
                      fontSize: "14px",
                    }}
                  >
                    {"·"}
                  </span>
                )}
                <span
                  style={{
                    color: "#1570EF",
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
            background: "#EFF6FF",
            border: "1px solid #DBEAFE",
            borderRadius: "12px",
            padding: "10px 18px",
          }}
        >
          <span style={{ color: "#1570EF", fontSize: "24px", fontWeight: "700" }}>
            $4.2M+
          </span>
          <span style={{ color: "#475569", fontSize: "14px" }}>
            avg recovery identified
          </span>
        </div>
      </div>
    </div>,
    { ...size }
  );
}
