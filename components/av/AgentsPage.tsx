import type { CSSProperties } from "react";
import Link from "next/link";
import { AvAgentLibrary } from "@/components/av/AvAgentLibrary";
import { AGENTS, AGENT_CATEGORIES, DEVELOPING_AGENTS, LIVE_AGENTS } from "@/lib/agents";

const mono: CSSProperties = { fontFamily: "'DM Mono', monospace" };

const FORMS = [
  "An integration between systems",
  "Workflow automation",
  "An internal tool",
  "A reporting system",
  "An AI agent",
  "A custom application",
];

export function AgentsPage() {
  return (
    <div style={{ maxWidth: "100%", overflowX: "hidden" }}>
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "88px 32px 0" }}>
        <div className="av-rise" style={{ ...mono, fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#586060" }}>Work you can see</div>
        <h1 className="av-rise" style={{ fontSize: "clamp(36px, 5.2vw, 68px)", lineHeight: 1.02, letterSpacing: "-.036em", fontWeight: 500, margin: "20px 0 0", maxWidth: "22ch", textWrap: "balance" }}>
          Agents we&apos;ve built for practice teams.
        </h1>
        <p style={{ fontSize: "clamp(16.5px,1.4vw,19px)", lineHeight: 1.6, color: "#4E5654", maxWidth: "62ch", margin: "22px 0 0", textWrap: "pretty" }}>
          A current look at our work. Agents are not everything we build, but they are a clear way to see how we think: start from the workflow, connect to the systems already in place, and ship something the team can use.
        </p>
        <p style={{ fontSize: 13.5, color: "#6E7674", margin: "18px 0 0" }}>
          {LIVE_AGENTS.length} available to explore · {DEVELOPING_AGENTS.length} in development
        </p>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "64px 32px 0" }}>
        <AvAgentLibrary agents={AGENTS} categories={[...AGENT_CATEGORIES]} />
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "96px 32px 140px" }}>
        <div style={{ borderTop: "1px solid rgba(20,24,26,.12)", paddingTop: 48, display: "flex", flexWrap: "wrap", gap: 56 }}>
          <div style={{ flex: "1.6 1 420px", minWidth: 0 }}>
            <h2 style={{ fontSize: "clamp(24px,2.8vw,36px)", lineHeight: 1.1, letterSpacing: "-.028em", fontWeight: 500, margin: 0, maxWidth: "18ch" }}>This is one part of the work.</h2>
            <p style={{ fontSize: 16.5, lineHeight: 1.6, color: "#4E5654", margin: "16px 0 0", maxWidth: "58ch" }}>
              Avishkar builds technology around how a practice already operates — integrations, automation, internal tools, reporting, and custom software. Agents are the piece we can publish. If your problem doesn&apos;t look like one of these, that&apos;s normal. Bring it anyway.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
              <Link href="/contact?intent=custom" className="av-hero-btn-dark" style={{ fontSize: 15, fontWeight: 500, padding: "14px 26px", borderRadius: 999, background: "#14181A", color: "#F1F1ED" }}>
                Don&apos;t see what you need?
              </Link>
              <Link href="/how-we-work" className="av-hero-btn-outline" style={{ fontSize: 15, fontWeight: 500, padding: "14px 26px", borderRadius: 999, border: "1px solid rgba(20,24,26,.2)", color: "#14181A" }}>
                How we work
              </Link>
            </div>
          </div>

          <div style={{ flex: "1 1 260px", minWidth: 0 }}>
            <div style={{ ...mono, fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "#586060" }}>What that turns into</div>
            <ul style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 0, listStyle: "none", padding: 0 }}>
              {FORMS.map((f) => (
                <li key={f} style={{ borderTop: "1px solid rgba(20,24,26,.14)", padding: "12px 0", fontSize: 14.5, color: "#14181A" }}>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
