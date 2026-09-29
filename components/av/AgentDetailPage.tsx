import type { CSSProperties } from "react";
import Link from "next/link";
import type { Agent } from "@/lib/agents";

const mono: CSSProperties = { fontFamily: "var(--font-mono)" };

const DETAIL_NOTE =
  "This agent is one example of how we work. Avishkar also builds integrations, automation, internal tools, and reporting inside the systems a practice already runs.";

export function AgentDetailPage({ agent, related }: { agent: Agent; related: Agent[] }) {
  const live = agent.status === "live";

  return (
    <div style={{ maxWidth: "100%", overflowX: "hidden" }}>
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "88px 32px 0" }}>
        <div className="av-rise" style={{ ...mono, fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#586060" }}>
          {agent.category} · {live ? "Available to explore" : "In development"}
        </div>
        <h1 className="av-rise" style={{ fontSize: "clamp(36px, 5.2vw, 68px)", lineHeight: 1.02, letterSpacing: "-.036em", fontWeight: 500, margin: "20px 0 0", maxWidth: "20ch", textWrap: "balance" }}>
          {agent.name}
        </h1>
        <p style={{ fontSize: "clamp(16.5px,1.4vw,19px)", lineHeight: 1.6, color: "#4E5654", maxWidth: "58ch", margin: "22px 0 0", textWrap: "pretty" }}>
          {agent.oneLiner}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
          {live && agent.demoUrl ? (
            <>
              <a href={agent.demoUrl} className="av-hero-btn-dark" style={{ fontSize: 15, fontWeight: 500, padding: "14px 26px", borderRadius: 999, background: "var(--color-text)", color: "var(--color-bg)" }}>
                Try agent
              </a>
              <Link href="/contact" className="av-hero-btn-outline" style={{ fontSize: 15, fontWeight: 500, padding: "14px 26px", borderRadius: 999, border: "1px solid rgba(20,24,26,.2)", color: "var(--color-text)" }}>
                Book a 30-min conversation
              </Link>
            </>
          ) : (
            <Link href="/contact" className="av-hero-btn-dark" style={{ fontSize: 15, fontWeight: 500, padding: "14px 26px", borderRadius: 999, background: "var(--color-text)", color: "var(--color-bg)" }}>
              Book a 30-min conversation
            </Link>
          )}
        </div>
        {live && !agent.demoUrl && (
          <p style={{ fontSize: 13.5, color: "#6E7674", margin: "16px 0 0" }}>
            This agent is running today. We walk you through it live on a call while the self-serve version is being finished.
          </p>
        )}
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "72px 32px 0" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 56 }}>
          <div style={{ flex: "1.6 1 420px", minWidth: 0 }}>
            <h2 style={{ fontSize: 19, fontWeight: 500, letterSpacing: "-.01em", margin: 0 }}>What it does</h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "#4E5654", margin: "12px 0 0", maxWidth: "58ch" }}>{agent.what}</p>

            <h2 style={{ fontSize: 19, fontWeight: 500, letterSpacing: "-.01em", margin: "48px 0 0" }}>What you get</h2>
            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 20 }}>
              {agent.outputs.map((o) => (
                <div key={o.label} style={{ borderTop: "1px solid rgba(20,24,26,.14)", paddingTop: 14 }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{o.label}</div>
                  <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "#4E5654", margin: "6px 0 0", maxWidth: "56ch" }}>{o.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex: "1 1 260px", minWidth: 0 }}>
            <h2 style={{ fontSize: 19, fontWeight: 500, letterSpacing: "-.01em", margin: 0 }}>What it analyzes</h2>
            <ul style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 0, listStyle: "none", padding: 0 }}>
              {agent.analyzes.map((item) => (
                <li key={item} style={{ borderTop: "1px solid rgba(20,24,26,.14)", padding: "12px 0", fontSize: 14.5, color: "#4E5654" }}>
                  {item}
                </li>
              ))}
            </ul>
            <p style={{ fontSize: 13.5, color: "#6E7674", margin: "20px 0 0" }}>
              We work with the systems that already hold this data, and only the fields the analysis needs.
            </p>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: `96px 32px ${related.length > 0 ? 0 : 140}px` }}>
        <div style={{ borderTop: "1px solid rgba(20,24,26,.12)", paddingTop: 48 }}>
          <h2 style={{ fontSize: "clamp(24px,2.8vw,36px)", lineHeight: 1.1, letterSpacing: "-.028em", fontWeight: 500, margin: 0, maxWidth: "20ch" }}>
            {live ? "Want this connected to your practice?" : `Need the ${agent.name} sooner?`}
          </h2>
          <p style={{ fontSize: 16.5, lineHeight: 1.6, color: "#4E5654", margin: "14px 0 0", maxWidth: "58ch" }}>
            {live
              ? "We'll walk you through it on a live call, then look at what it would take to run on your own data. If this isn't quite the problem, that's useful too — most of what we build starts from a conversation, not a catalogue."
              : "This one is in development. If it's the problem you're trying to solve, tell us — that's how work gets prioritized."}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
            <Link href="/contact" className="av-hero-btn-dark" style={{ fontSize: 15, fontWeight: 500, padding: "14px 26px", borderRadius: 999, background: "var(--color-text)", color: "var(--color-bg)" }}>
              Book a 30-min conversation
            </Link>
            <Link href="/agents" className="av-hero-btn-outline" style={{ fontSize: 15, fontWeight: 500, padding: "14px 26px", borderRadius: 999, border: "1px solid rgba(20,24,26,.2)", color: "var(--color-text)" }}>
              Explore agents
            </Link>
          </div>

          <p style={{ marginTop: 40, borderTop: "1px solid rgba(20,24,26,.14)", paddingTop: 24, fontSize: 13.5, color: "#6E7674", maxWidth: "62ch" }}>
            {DETAIL_NOTE}{" "}
            <Link href="/how-we-work" style={{ color: "#4E5654", textDecoration: "underline", textUnderlineOffset: 4 }}>
              See how we work
            </Link>
            .
          </p>
        </div>
      </section>

      {related.length > 0 && (
        <section style={{ maxWidth: 1240, margin: "0 auto", padding: "40px 32px 140px" }}>
          <div style={{ ...mono, fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "#586060" }}>Related agents</div>
          <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: "8px 32px" }}>
            {related.map((item) => (
              <Link key={item.slug} href={`/agents/${item.slug}`} style={{ fontSize: 14.5, color: "#4E5654" }}>
                {item.name} →
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
