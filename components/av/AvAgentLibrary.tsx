"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { AvAgentCard } from "@/components/av/AvAgentCard";
import type { Agent, AgentCategory } from "@/lib/agents";

const mono: CSSProperties = { fontFamily: "'DM Mono', monospace" };

export function AvAgentLibrary({ agents, categories }: { agents: Agent[]; categories: AgentCategory[] }) {
  const [active, setActive] = useState<AgentCategory | "All">("All");

  const filtered = useMemo(
    () => (active === "All" ? agents : agents.filter((a) => a.category === active)),
    [agents, active]
  );

  const live = filtered.filter((a) => a.status === "live");
  const developing = filtered.filter((a) => a.status === "in_development");
  const showFilter = agents.length > 8;

  return (
    <div>
      {showFilter && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }} role="group" aria-label="Filter agents by category">
          {(["All", ...categories] as const).map((category) => {
            const isActive = active === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActive(category)}
                aria-pressed={isActive}
                style={{
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 13.5,
                  padding: "8px 15px",
                  borderRadius: 999,
                  transition: "all .3s ease",
                  background: isActive ? "#14181A" : "transparent",
                  color: isActive ? "#F1F1ED" : "#4E5654",
                  border: isActive ? "1px solid #14181A" : "1px solid rgba(20,24,26,.18)",
                }}
              >
                {category}
              </button>
            );
          })}
        </div>
      )}

      {live.length > 0 && (
        <AgentGroup
          title="Available to explore"
          count={live.length}
          note="Live examples of the work. You can see these running today."
          agents={live}
          style={showFilter ? { marginTop: 56 } : undefined}
        />
      )}

      {developing.length > 0 && (
        <AgentGroup
          title="In development"
          count={developing.length}
          note="What we're building next, based on the problems practices keep bringing us."
          agents={developing}
          style={{ marginTop: live.length > 0 ? 80 : showFilter ? 56 : 0 }}
        />
      )}
    </div>
  );
}

function AgentGroup({
  title,
  count,
  note,
  agents,
  style,
}: {
  title: string;
  count: number;
  note: string;
  agents: Agent[];
  style?: CSSProperties;
}) {
  return (
    <section style={style}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: "8px 24px", borderBottom: "1px solid rgba(20,24,26,.14)", paddingBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-.01em", margin: 0 }}>
          {title} <span style={{ color: "#6E7674" }}>({count})</span>
        </h2>
        <p style={{ ...mono, fontSize: 11.5, color: "#6E7674", margin: 0 }}>{note}</p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 32 }}>
        {agents.map((agent) => (
          <div key={agent.slug} style={{ flex: "1 1 300px", minWidth: 0 }}>
            <AvAgentCard agent={agent} />
          </div>
        ))}
      </div>
    </section>
  );
}
