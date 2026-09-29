"use client";

import type { CSSProperties } from "react";
import Link from "next/link";

const mono: CSSProperties = { fontFamily: "var(--font-mono)" };
const CONTACT_EMAIL = "info@avishkar.app";

const PILLARS = [
  {
    title: "Least privilege by default",
    body: "We request the narrowest access that the work requires, and read-only wherever reading is enough.",
  },
  {
    title: "Data minimization",
    body: "We work with the fields a solution actually needs. Patient information we don't need, we don't pull.",
  },
  {
    title: "HIPAA-aligned practices",
    body: "Engagements that involve protected health information are handled under HIPAA-aligned practices, with a BAA available on request.",
  },
  {
    title: "Human oversight",
    body: "Anything patient-facing or clinical stays under human review. Agents surface and draft; your team decides.",
  },
];

const PRACTICES = [
  {
    title: "Access",
    body: "Access is requested per engagement, scoped to the systems the build touches, and read-only wherever reading is enough. Credentials are never shared between clients.",
  },
  {
    title: "Data handling",
    body: "We work with the specific fields a solution needs. Data in transit is encrypted, and we don't copy patient records into places the practice hasn't agreed to.",
  },
  {
    title: "Protected health information",
    body: "Where an engagement involves protected health information, it is handled under HIPAA-aligned practices and a Business Associate Agreement is available on request before any access begins.",
  },
  {
    title: "Oversight",
    body: "Agents surface findings and draft actions. Anything patient-facing or clinical is reviewed by your team before it goes out. We don't automate clinical judgement.",
  },
  {
    title: "Change and offboarding",
    body: "Access is reviewed as engagements change and revoked when work ends. You can ask us to remove data we hold at any time.",
  },
];

export function SecurityPage() {
  return (
    <div style={{ maxWidth: "100%", overflowX: "hidden" }}>
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "88px 32px 0" }}>
        <div className="av-rise" style={{ ...mono, fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#586060" }}>Security</div>
        <h1 className="av-rise" style={{ fontSize: "clamp(36px, 5.2vw, 68px)", lineHeight: 1.02, letterSpacing: "-.036em", fontWeight: 500, margin: "20px 0 0", maxWidth: "20ch", textWrap: "balance" }}>
          Built with privacy and security in mind.
        </h1>
        <p style={{ fontSize: "clamp(16.5px,1.4vw,19px)", lineHeight: 1.6, color: "#4E5654", maxWidth: "58ch", margin: "22px 0 0", textWrap: "pretty" }}>
          We work inside practices that handle patient information. The way we handle data is part of the build, not an afterthought.
        </p>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "64px 32px 0" }}>
        <div style={{ ...mono, fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#586060" }}>Principles</div>
        <h2 style={{ fontSize: "clamp(24px,2.8vw,36px)", lineHeight: 1.1, letterSpacing: "-.028em", fontWeight: 500, margin: "14px 0 0" }}>What this means in practice.</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "40px 48px", marginTop: 40 }}>
          {PILLARS.map((p) => (
            <div key={p.title} style={{ flex: "1 1 380px", minWidth: 0, borderTop: "1px solid rgba(20,24,26,.14)", paddingTop: 20 }}>
              <h3 style={{ fontSize: 19, fontWeight: 500, letterSpacing: "-.01em", margin: 0 }}>{p.title}</h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "#4E5654", margin: "8px 0 0", maxWidth: "50ch" }}>{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "88px 32px 0" }}>
        <div style={{ ...mono, fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#586060" }}>Detail</div>
        <h2 style={{ fontSize: "clamp(24px,2.8vw,36px)", lineHeight: 1.1, letterSpacing: "-.028em", fontWeight: 500, margin: "14px 0 0" }}>How we handle access and data.</h2>
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 32 }}>
          {PRACTICES.map((p) => (
            <div key={p.title} style={{ display: "flex", flexWrap: "wrap", gap: 24, borderTop: "1px solid rgba(20,24,26,.14)", paddingTop: 20 }}>
              <h3 style={{ flex: "1 1 220px", minWidth: 0, fontSize: 19, fontWeight: 500, letterSpacing: "-.01em", margin: 0 }}>{p.title}</h3>
              <p style={{ flex: "3 1 480px", minWidth: 0, fontSize: 16, lineHeight: 1.6, color: "#4E5654", margin: 0, maxWidth: "62ch" }}>{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "96px 32px 140px" }}>
        <div style={{ borderTop: "1px solid rgba(20,24,26,.12)", paddingTop: 48 }}>
          <h2 style={{ fontSize: "clamp(24px,2.8vw,36px)", lineHeight: 1.1, letterSpacing: "-.028em", fontWeight: 500, margin: 0, maxWidth: "20ch" }}>Security review or questionnaire?</h2>
          <p style={{ fontSize: 16.5, lineHeight: 1.6, color: "#4E5654", margin: "14px 0 0", maxWidth: "56ch" }}>
            Send it over. We&apos;d rather answer specific questions about your environment than publish generic assurances.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
            <a href={`mailto:${CONTACT_EMAIL}`} className="av-hero-btn-dark" style={{ fontSize: 15, fontWeight: 500, padding: "14px 26px", borderRadius: 999, background: "var(--color-text)", color: "var(--color-bg)" }}>
              Email the team
            </a>
            <Link href="/contact" className="av-hero-btn-outline" style={{ fontSize: 15, fontWeight: 500, padding: "14px 26px", borderRadius: 999, border: "1px solid rgba(20,24,26,.2)", color: "var(--color-text)" }}>
              Book a 30-min conversation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
