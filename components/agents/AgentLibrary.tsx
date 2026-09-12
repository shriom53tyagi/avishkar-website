"use client";

import { useMemo, useState } from "react";
import { AgentCard } from "@/components/ui/AgentCard";
import { cn } from "@/lib/utils";
import type { Agent, AgentCategory } from "@/lib/agents";

/**
 * The library groups by availability first, then filters by category. The
 * filter row only appears once there are enough agents to need it, so the
 * page reads the same with five agents or fifty.
 */
export function AgentLibrary({
  agents,
  categories,
}: {
  agents: Agent[];
  categories: AgentCategory[];
}) {
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
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter agents by category">
          {(["All", ...categories] as const).map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActive(category)}
              aria-pressed={active === category}
              className={cn(
                "rounded border px-3.5 py-2 text-small transition-colors",
                active === category
                  ? "border-accent bg-accent text-white"
                  : "border-line-strong bg-surface text-ink-muted hover:text-ink"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {live.length > 0 && (
        <AgentGroup
          title="Available to explore"
          count={live.length}
          note="Live examples of the work. You can see these running today."
          agents={live}
          className={showFilter ? "mt-14" : undefined}
        />
      )}

      {developing.length > 0 && (
        <AgentGroup
          title="In development"
          count={developing.length}
          note="What we're building next, based on the problems practices keep bringing us."
          agents={developing}
          className={live.length > 0 ? "mt-20" : showFilter ? "mt-14" : undefined}
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
  className,
}: {
  title: string;
  count: number;
  note: string;
  agents: Agent[];
  className?: string;
}) {
  return (
    <section className={className}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-line-strong pb-4">
        <h2 className="text-h3 font-serif font-normal tracking-[-0.01em] text-ink">
          {title} <span className="text-ink-subtle">({count})</span>
        </h2>
        <p className="text-small text-ink-subtle">{note}</p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <AgentCard key={agent.slug} agent={agent} />
        ))}
      </div>
    </section>
  );
}
