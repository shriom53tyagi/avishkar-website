import type { CSSProperties } from "react";
import Link from "next/link";

const mono: CSSProperties = { fontFamily: "'DM Mono', monospace" };

const HEADLINE = "We build technology for practices.";
const SUB =
  "Avishkar is a technology company built around practice operations: the leads, the schedule, the consultations, the follow-up, and the systems that hold all of it.";
const BODY = [
  "Most practices don't have a technology problem in the abstract. They have a specific workflow that costs the team hours a week, a report nobody can produce, or data sitting in a system that won't give it up. The software market answers that with another platform to adopt.",
  "We work the other way around. We start from the workflow, connect to whatever systems are already in place, and build the smallest thing that solves the problem properly — an integration, an internal tool, a report, an agent. Then we measure whether it actually helped.",
];
const AUDIENCE = "Built for medspas, aesthetic practices, clinics, and healthcare teams.";

const PRINCIPLES = [
  {
    title: "The workflow comes first",
    body: "We don't ask a practice to change how it works to suit software. The build fits the practice.",
  },
  {
    title: "Start small, prove it",
    body: "One scoped problem, solved properly, beats a platform rollout nobody asked for.",
  },
  {
    title: "Plain answers",
    body: "If technology isn't the right answer to a problem, we'll tell you that in the first conversation.",
  },
  {
    title: "Your systems stay yours",
    body: "We work inside the tools you already run. Nothing gets ripped out and replaced.",
  },
];

export function AboutPage() {
  return (
    <div style={{ maxWidth: "100%", overflowX: "hidden" }}>
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "88px 32px 0" }}>
        <div className="av-rise" style={{ ...mono, fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#586060" }}>About</div>
        <h1 className="av-rise" style={{ fontSize: "clamp(36px, 5.2vw, 68px)", lineHeight: 1.02, letterSpacing: "-.036em", fontWeight: 500, margin: "20px 0 0", maxWidth: "20ch", textWrap: "balance" }}>
          {HEADLINE}
        </h1>
        <p style={{ fontSize: "clamp(16.5px,1.4vw,19px)", lineHeight: 1.6, color: "#4E5654", maxWidth: "58ch", margin: "22px 0 0", textWrap: "pretty" }}>
          {SUB}
        </p>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "64px 32px 0" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 56 }}>
          <div style={{ flex: "1.6 1 420px", minWidth: 0, display: "flex", flexDirection: "column", gap: 22 }}>
            {BODY.map((p) => (
              <p key={p.slice(0, 24)} style={{ fontSize: 17, lineHeight: 1.65, color: "#4E5654", margin: 0, maxWidth: "62ch" }}>
                {p}
              </p>
            ))}
          </div>
          <div style={{ flex: "1 1 260px", minWidth: 0, borderLeft: "1px solid rgba(20,24,26,.14)", paddingLeft: 28 }}>
            <div style={{ ...mono, fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "#586060" }}>Who we work with</div>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "#14181A", margin: "14px 0 0" }}>{AUDIENCE}</p>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "96px 32px 0" }}>
        <div style={{ ...mono, fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#586060" }}>How we think</div>
        <h2 style={{ fontSize: "clamp(24px,2.8vw,36px)", lineHeight: 1.1, letterSpacing: "-.028em", fontWeight: 500, margin: "14px 0 0" }}>Four things we hold to.</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "36px 48px", marginTop: 40 }}>
          {PRINCIPLES.map((p) => (
            <div key={p.title} style={{ flex: "1 1 380px", minWidth: 0, borderTop: "1px solid rgba(20,24,26,.14)", paddingTop: 20 }}>
              <h3 style={{ fontSize: 19, fontWeight: 500, letterSpacing: "-.01em", margin: 0 }}>{p.title}</h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "#4E5654", margin: "8px 0 0", maxWidth: "50ch" }}>{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "96px 32px 140px" }}>
        <div style={{ borderTop: "1px solid rgba(20,24,26,.12)", paddingTop: 48 }}>
          <h2 style={{ fontSize: "clamp(24px,2.8vw,36px)", lineHeight: 1.1, letterSpacing: "-.028em", fontWeight: 500, margin: 0, maxWidth: "18ch" }}>Bring us the problem.</h2>
          <p style={{ fontSize: 16.5, lineHeight: 1.6, color: "#4E5654", margin: "14px 0 0", maxWidth: "56ch" }}>
            The best first conversation is a specific one: a workflow, a report you can&apos;t get, or a system that won&apos;t give up its data.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
            <Link href="/contact" className="av-hero-btn-dark" style={{ fontSize: 15, fontWeight: 500, padding: "14px 26px", borderRadius: 999, background: "#14181A", color: "#F1F1ED" }}>
              Book a 30-min conversation
            </Link>
            <Link href="/agents" className="av-hero-btn-outline" style={{ fontSize: 15, fontWeight: 500, padding: "14px 26px", borderRadius: 999, border: "1px solid rgba(20,24,26,.2)", color: "#14181A" }}>
              See our work
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
