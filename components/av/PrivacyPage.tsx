import type { CSSProperties } from "react";

const mono: CSSProperties = { fontFamily: "var(--font-mono)" };
const CONTACT_EMAIL = "info@avishkar.app";

const SECTIONS = [
  {
    title: "Information we collect",
    body: "We collect the contact details you give us when you book a conversation, request early access, or email us. We also collect standard server logs — IP address, browser type, pages visited — for security and performance monitoring. We do not collect Protected Health Information (PHI) through this website.",
  },
  {
    title: "How we use your information",
    body: "Contact information is used only to respond to your enquiry, arrange a conversation, or follow up on an early-access request. We do not sell, rent or share your personal information with third parties for marketing purposes.",
  },
  {
    title: "Third-party services",
    body: "This website uses Calendly for appointment scheduling, governed by Calendly's own privacy policy. Scheduling and analytics scripts only load after you accept cookies.",
  },
  {
    title: "Data security",
    body: "We apply appropriate technical and organizational measures to protect your information. Traffic to this website is encrypted in transit via HTTPS.",
  },
  {
    title: "HIPAA",
    body: "This website is a marketing site and does not process, store or transmit Protected Health Information. Any engagement involving PHI is governed by a separate Business Associate Agreement.",
  },
  {
    title: "Your rights",
    body: `You may ask us to delete any personal information we hold about you by writing to ${CONTACT_EMAIL}.`,
  },
  {
    title: "Contact",
    body: `Privacy questions: ${CONTACT_EMAIL}`,
  },
];

export function PrivacyPage() {
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
          Privacy Policy
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
