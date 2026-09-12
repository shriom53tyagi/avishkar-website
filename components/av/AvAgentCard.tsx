import type { CSSProperties } from "react";
import Link from "next/link";
import type { Agent } from "@/lib/agents";
import { getWorkflow } from "@/lib/agents";

const mono: CSSProperties = { fontFamily: "'DM Mono', monospace" };

export function AvAgentCard({ agent }: { agent: Agent }) {
  const live = agent.status === "live";
  const flow = getWorkflow(agent);
  const label = `${agent.name}, agent, ${live ? "running" : "in development"}`;

  return (
    <Link
      href={`/agents/${agent.slug}`}
      aria-label={label}
      className="av-agent-card"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        height: "100%",
        border: "1px solid rgba(20,24,26,.12)",
        borderRadius: 14,
        background: "#FDFDFB",
        padding: 22,
        transition: "border-color .2s ease, transform .2s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-.01em", margin: 0 }}>{agent.name}</h3>
          <p style={{ ...mono, fontSize: 10.5, letterSpacing: ".1em", textTransform: "uppercase", color: "#6E7674", margin: "4px 0 0" }}>
            {agent.category} agent
          </p>
        </div>
        {live ? (
          <span style={{ flex: "none", display: "inline-flex", alignItems: "center", gap: 6, ...mono, fontSize: 10.5, letterSpacing: ".08em", textTransform: "uppercase", color: "#2F6B5F" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2F6B5F", display: "block", animation: "avPulse 2.4s ease-in-out infinite" }} />
            Live
          </span>
        ) : (
          <span style={{ flex: "none", ...mono, fontSize: 10.5, letterSpacing: ".08em", textTransform: "uppercase", color: "#6E7674" }}>Queued</span>
        )}
      </div>

      <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "#4E5654", margin: 0 }}>{agent.oneLiner}</p>

      <p style={{ ...mono, fontSize: 11, letterSpacing: ".04em", textTransform: "uppercase", color: "#6E7674", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {flow.from} → {flow.to}
      </p>

      <span style={{ marginTop: "auto", fontSize: 14.5, fontWeight: 500, color: live ? "#2F6B5F" : "#4E5654" }}>
        {live ? "Try the agent" : "See what it does"} →
      </span>
    </Link>
  );
}
