import type { CSSProperties } from "react";

const mono: CSSProperties = { fontFamily: "var(--font-mono)" };
const CONTACT_EMAIL = "info@avishkar.app";

const SECTIONS = [
  {
    title: "Acceptance of terms",
    body: "By accessing this website you agree to these terms.",
  },
  {
    title: "Use of the website",
    body: "This website is for informational purposes. You may not use automated tools to scrape content or abuse endpoints.",
  },
  {
    title: "Intellectual property",
    body: "All content, branding and code on this website are the property of Avishkar.",
  },
  {
    title: "No professional advice",
    body: "Avishkar is a technology company. Nothing on this website is clinical, legal, billing or financial advice, and it should not be relied on as such.",
  },
  {
    title: "Limitation of liability",
    body: "This website is provided as-is. Avishkar is not liable for damages arising from use of this website.",
  },
  {
    title: "Governing law",
    body: "These terms are governed by the laws of the State of [State], United States.",
  },
  {
    title: "Contact",
    body: `Questions about these terms: ${CONTACT_EMAIL}`,
  },
];

export function TermsPage() {
  return (
    <div style={{ maxWidth: "100%", overflowX: "hidden" }}>
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "88px 32px 0" }}>
        <div
          className="av-rise"
          style={{
            ...mono,
            fontSize: 12,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: "#586060",
          }}
        >
          Legal
        </div>
        <h1
          className="av-rise"
          style={{
            fontSize: "clamp(36px, 5.2vw, 68px)",
            lineHeight: 1.02,
            letterSpacing: "-.036em",
            fontWeight: 500,
            margin: "20px 0 0",
            maxWidth: "20ch",
            textWrap: "balance",
          }}
        >
          Terms of Service
        </h1>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "56px 32px 140px" }}>
        <div style={{ maxWidth: "68ch" }}>
          <p style={{ ...mono, fontSize: 12.5, color: "#6E7674", margin: 0 }}>
            Last updated: September 2026
          </p>
          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 36 }}>
            {SECTIONS.map((s) => (
              <section key={s.title}>
                <h2 style={{ fontSize: 19, fontWeight: 500, letterSpacing: "-.01em", margin: 0 }}>
                  {s.title}
                </h2>
                <p style={{ fontSize: 16, lineHeight: 1.65, color: "#4E5654", margin: "10px 0 0" }}>
                  {s.body}
                </p>
              </section>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
