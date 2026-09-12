"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinkStyle: React.CSSProperties = { color: "#4E5654" };
const navLinkActiveStyle: React.CSSProperties = { color: "#14181A", fontWeight: 500 };

export function AvHeader() {
  const pathname = usePathname();
  const isInsights = pathname?.startsWith("/insights");
  const home = isInsights ? "/" : "/#top";

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(14px)",
        background: "rgba(241,241,237,.82)",
        borderBottom: "1px solid rgba(20,24,26,.08)",
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "18px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <Link href={home} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              width: 11,
              height: 11,
              background: "#2F6B5F",
              borderRadius: 2,
              transform: "rotate(45deg)",
              display: "block",
            }}
          />
          <span style={{ fontSize: 19, fontWeight: 600, letterSpacing: "-.02em" }}>Avishkar</span>
        </Link>

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 26,
            fontSize: 14.5,
            color: "#4E5654",
            flexWrap: "wrap",
          }}
        >
          <Link href="/#how" style={navLinkStyle}>What we do</Link>
          <Link href="/#capabilities" style={navLinkStyle}>Solutions</Link>
          <Link href="/#proof" style={navLinkStyle}>Case studies</Link>
          <Link href="/insights" style={isInsights ? navLinkActiveStyle : navLinkStyle}>Insights</Link>
          <Link href="/#partner" style={navLinkStyle}>About</Link>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            href="/#early-access"
            className="av-early-access-pill"
            style={{
              fontSize: 13.5,
              fontWeight: 500,
              padding: "8px 14px",
              borderRadius: 999,
              color: "#245348",
              background: "rgba(47,107,95,.1)",
              border: "1px solid rgba(47,107,95,.28)",
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#2F6B5F",
                display: "block",
                animation: "avPulse 2.4s ease-in-out infinite",
              }}
            />
            Early access
          </Link>
          <Link
            href="/contact"
            className="av-talk-btn"
            style={{
              fontSize: 14.5,
              fontWeight: 500,
              padding: "10px 18px",
              borderRadius: 999,
              background: "#14181A",
              color: "#F1F1ED",
              border: "1px solid #14181A",
              whiteSpace: "nowrap",
            }}
          >
            Talk to us
          </Link>
        </div>
      </div>
    </header>
  );
}
