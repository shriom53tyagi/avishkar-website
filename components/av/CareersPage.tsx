import type { CSSProperties } from "react";

const mono: CSSProperties = { fontFamily: "'DM Mono', monospace" };
const CONTACT_EMAIL = "info@avishkar.app";

const VALUES = [
  {
    title: "Understand before you build",
    note: "We earn the right to automate a workflow by understanding how it actually runs first.",
  },
  {
    title: "Small, working, measured",
    note: "One scoped build that works beats a platform nobody adopted. We measure what we ship.",
  },
  {
    title: "Careful with patient data",
    note: "Least privilege, data minimization, and human oversight are part of the work, not a checkbox.",
  },
];

const OPEN_ROLES = [
  {
    title: "Forward-Deployed Engineer",
    team: "Engineering",
    location: "Remote · US / India",
    blurb:
      "Work directly with practices: connect to the systems they already run, and build the technology the workflow actually needs.",
  },
  {
    title: "Practice Operations Analyst",
    team: "Operations",
    location: "Remote",
    blurb:
      "Translate how a practice actually works into something we can build around — the workflows, the data, and where the time goes.",
  },
  {
    title: "Solutions Architect",
    team: "Delivery",
    location: "Remote",
    blurb: "Own secure integrations across practice management, scheduling, EMR and communication systems.",
  },
];

export function CareersPage() {
  return (
    <div style={{ maxWidth: "100%", overflowX: "hidden" }}>
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "88px 32px 0" }}>
        <div className="av-rise" style={{ ...mono, fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#586060" }}>Careers</div>
        <h1 className="av-rise" style={{ fontSize: "clamp(36px, 5.2vw, 68px)", lineHeight: 1.02, letterSpacing: "-.036em", fontWeight: 500, margin: "20px 0 0", maxWidth: "20ch", textWrap: "balance" }}>
          Build technology practices actually use.
        </h1>
        <p style={{ fontSize: "clamp(16.5px,1.4vw,19px)", lineHeight: 1.6, color: "#4E5654", maxWidth: "58ch", margin: "22px 0 0", textWrap: "pretty" }}>
          Our engineers and operators work directly with practice teams. If specific, unglamorous, high-leverage problems appeal to you, we&apos;d like to talk.
        </p>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "64px 32px 0" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "36px 40px" }}>
          {VALUES.map((v) => (
            <div key={v.title} style={{ flex: "1 1 280px", minWidth: 0, borderTop: "1px solid rgba(20,24,26,.14)", paddingTop: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-.01em", margin: 0 }}>{v.title}</h2>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "#4E5654", margin: "8px 0 0" }}>{v.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "96px 32px 0" }}>
        <div style={{ ...mono, fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#586060" }}>Open roles</div>
        <h2 style={{ fontSize: "clamp(24px,2.8vw,36px)", lineHeight: 1.1, letterSpacing: "-.028em", fontWeight: 500, margin: "14px 0 0" }}>Where we need help right now.</h2>

        <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 14 }}>
          {OPEN_ROLES.map((role) => (
            <a
              key={role.title}
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Application: ${role.title}`)}`}
              className="av-role-card"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 16,
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid rgba(20,24,26,.12)",
                borderRadius: 14,
                background: "#FDFDFB",
                padding: "24px 26px",
              }}
            >
              <div style={{ minWidth: 0, flex: "1 1 380px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "4px 12px" }}>
                  <span style={{ fontSize: 19, fontWeight: 500, letterSpacing: "-.01em" }}>{role.title}</span>
                  <span style={{ ...mono, fontSize: 10.5, letterSpacing: ".1em", textTransform: "uppercase", color: "#6E7674" }}>{role.team}</span>
                </div>
                <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "#4E5654", margin: "8px 0 0", maxWidth: "56ch" }}>{role.blurb}</p>
                <p style={{ fontSize: 13, color: "#6E7674", margin: "8px 0 0" }}>{role.location}</p>
              </div>
              <span style={{ flex: "none", fontSize: 14.5, fontWeight: 500, color: "#2F6B5F" }}>
                Apply →
              </span>
            </a>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "96px 32px 140px" }}>
        <div style={{ borderTop: "1px solid rgba(20,24,26,.12)", paddingTop: 48 }}>
          <h2 style={{ fontSize: "clamp(24px,2.8vw,36px)", lineHeight: 1.1, letterSpacing: "-.028em", fontWeight: 500, margin: 0, maxWidth: "18ch" }}>Don&apos;t see your role?</h2>
          <p style={{ fontSize: 16.5, lineHeight: 1.6, color: "#4E5654", margin: "14px 0 0", maxWidth: "56ch" }}>
            Send a note about the kind of problems you want to work on, and what you&apos;ve built.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Resume")}`}
            className="av-hero-btn-dark"
            style={{ display: "inline-block", fontSize: 15, fontWeight: 500, padding: "14px 26px", borderRadius: 999, background: "#14181A", color: "#F1F1ED", marginTop: 28 }}
          >
            Email {CONTACT_EMAIL}
          </a>
        </div>
      </section>
    </div>
  );
}
