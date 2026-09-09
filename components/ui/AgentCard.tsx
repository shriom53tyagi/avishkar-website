import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Agent } from "@/lib/agents";
import { getWorkflow } from "@/lib/agents";
import { cn } from "@/lib/utils";

/**
 * An agent as a unit of work, kept to one glance: identity, what it does,
 * the workflow it sits in as a single line, and a status.
 */
export function AgentCard({ agent, className }: { agent: Agent; className?: string }) {
  const live = agent.status === "live";
  const flow = getWorkflow(agent);
  const label = `${agent.name}, agent, ${live ? "running" : "in development"}`;

  return (
    <Link
      href={`/agents/${agent.slug}`}
      aria-label={label}
      className={cn(
        "agent-card group flex h-full w-full flex-col gap-3 rounded border bg-surface p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover",
        live
          ? "border-line-strong hover:border-accent"
          : "border-line hover:border-line-strong",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-h3 text-ink">{agent.name}</h3>
          <p className="mt-0.5 text-label uppercase text-ink-subtle">{agent.category} agent</p>
        </div>
        {live ? (
          <span className="inline-flex shrink-0 items-center gap-1.5 pt-1 text-label uppercase tracking-[0.08em] text-accent">
            <span className="agent-eq" aria-hidden>
              <span />
              <span />
              <span />
            </span>
            Live
          </span>
        ) : (
          <span className="shrink-0 pt-1 text-label uppercase tracking-[0.08em] text-ink-subtle">
            Queued
          </span>
        )}
      </div>

      <p className="text-small text-ink-muted">{agent.oneLiner}</p>

      <p className="truncate text-label uppercase tracking-[0.04em] text-ink-subtle">
        {flow.from} <span aria-hidden>&rarr;</span> {flow.to}
      </p>

      <span
        className={cn(
          "mt-1 inline-flex items-center gap-1.5 text-small transition-colors",
          live
            ? "font-medium text-accent group-hover:text-accent-hover"
            : "text-ink-muted group-hover:text-ink"
        )}
      >
        {live ? "Try the agent" : "See what it does"}
        <ArrowRight
          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </span>
    </Link>
  );
}
