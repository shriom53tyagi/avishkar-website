import Link from "next/link";
import type { CSSProperties } from "react";

const mono: CSSProperties = { fontFamily: "'DM Mono', monospace" };

const COLUMNS: { title: string; links: { href: string; label: string; external?: boolean }[] }[] = [
  {
    title: "Product",
    links: [
      { href: "/#how", label: "What we do" },
      { href: "/#capabilities", label: "Solutions" },
      { href: "/#proof", label: "Case studies" },
      { href: "/agents", label: "Agents" },
      { href: "/#early-access", label: "Early access" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/how-we-work", label: "How we work" },
      { href: "/results", label: "Results" },
      { href: "/careers", label: "Careers" },
      { href: "/insights", label: "Insights" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/security", label: "Security" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
  {
    title: "Connect",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "mailto:info@avishkar.app", label: "info@avishkar.app" },
      { href: "https://www.linkedin.com/company/avishkarai/", label: "LinkedIn", external: true },
    ],
  },
];

function Column({ title, links }: (typeof COLUMNS)[number]) {
  return (
    <div style={{ flex: "1 1 140px", minWidth: 0 }}>
      <div style={{ ...mono, fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "#6E7674" }}>{title}</div>
      <ul style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 11, listStyle: "none", padding: 0 }}>
        {links.map((l) =>
          l.external ? (
            <li key={l.href}>
              <a href={l.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: "#4E5654" }}>
                {l.label}
              </a>
            </li>
          ) : l.href.startsWith("mailto:") ? (
            <li key={l.href}>
              <a href={l.href} style={{ fontSize: 14, color: "#4E5654" }}>
                {l.label}
              </a>
            </li>
          ) : (
            <li key={l.href}>
              <Link href={l.href} style={{ fontSize: 14, color: "#4E5654" }}>
                {l.label}
              </Link>
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export function AvFooter() {
  return (
    <footer style={{ borderTop: "1px solid rgba(20,24,26,.1)" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "64px 32px 48px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 48 }}>
          <div style={{ flex: "1.6 1 280px", minWidth: 0 }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
              <span style={{ fontSize: 19, fontWeight: 600, letterSpacing: "-.02em", color: "#14181A" }}>Avishkar</span>
            </Link>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "#4E5654", margin: "16px 0 0", maxWidth: "34ch" }}>
              Technology for the business of aesthetics — integrations, automation, and AI for practices, medspas, and wellness businesses.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <Column key={col.title} {...col} />
          ))}
        </div>

        <div
          style={{
            marginTop: 56,
            paddingTop: 24,
            borderTop: "1px solid rgba(20,24,26,.1)",
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 13,
            color: "#6E7674",
          }}
        >
          <span>© {new Date().getFullYear()} Avishkar. All rights reserved.</span>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <Link href="/privacy" style={{ color: "#6E7674" }}>Privacy</Link>
            <Link href="/terms" style={{ color: "#6E7674" }}>Terms</Link>
            <Link href="/security" style={{ color: "#6E7674" }}>Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
