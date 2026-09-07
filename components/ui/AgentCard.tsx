import Link from "next/link";
import type { Agent } from "@/lib/agents";
import { getWorkflow } from "@/lib/agents";
import { cn } from "@/lib/utils";

/**
 * An agent as a unit of work: identity, a process it sits in, and a
 * powered-on or waiting state. Live agents run. The rest are queued.
 */
export function AgentCard({ agent, className }: { agent: Agent; className?: string }) {
  const live = agent.status === "live";
  const code = initials(agent.name);
  const flow = getWorkflow(agent);
  const looksAt = agent.analyzes.slice(0, 3);
  const label = `${agent.name}, agent, ${live ? "running" : "in development"}`;

  return (
    <Link
      href={`/agents/${agent.slug}`}
      aria-label={label}
      className={cn(
        "agent-card group flex h-full w-full flex-col overflow-hidden rounded border bg-surface transition-colors",
        live
          ? "border-line-strong hover:border-accent"
          : "border-line hover:border-line-strong",
        className
      )}
    >
      {live && <span className="block h-[3px] bg-accent" aria-hidden />}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-h3 text-ink">{agent.name}</h3>
            <p className="mt-0.5 text-label uppercase text-ink-subtle">
              {agent.category} agent
            </p>
          </div>
          {live ? (
            <span className="inline-flex shrink-0 items-center gap-1.5 pt-1 text-label uppercase tracking-[0.08em] text-accent">
              <span className="agent-eq" aria-hidden>
                <span />
                <span />
                <span />
              </span>
              Running
            </span>
          ) : (
            <span className="shrink-0 pt-1 text-label uppercase tracking-[0.08em] text-ink-subtle">
              Queued
            </span>
          )}
        </div>

        <p className="mt-4 text-small text-ink-muted">{agent.oneLiner}</p>

        <div className={cn("agent-loop mt-5", live && "agent-loop-live")} aria-hidden>
          <div className="agent-loop-head">
            <span>From</span>
            <span>To</span>
          </div>
          <div className="agent-loop-body">
            <span className="agent-loop-line" />
            <span className="agent-loop-v">{flow.from}</span>
            <AgentCore live={live} code={code} />
            <span className="agent-loop-v agent-loop-v-to">{flow.to}</span>
          </div>
          <p className="agent-loop-action">{flow.action}</p>
        </div>

        {looksAt.length > 0 && (
          <p className="mt-4 text-[12px] leading-5 text-ink-subtle">
            <span className="text-label uppercase tracking-[0.08em]">Reads</span>
            <span className="mt-1 block text-ink-muted">{looksAt.join(" · ")}</span>
          </p>
        )}

        <div className="mt-6 flex-1" />

        <span
          className={cn(
            "text-small transition-colors",
            live
              ? "font-medium text-accent group-hover:text-accent-hover"
              : "text-ink-muted group-hover:text-ink"
          )}
        >
          {live ? "Try the agent" : "See what it does"}{" "}
          <span className="agent-cta-arrow inline-block" aria-hidden>
            &rarr;
          </span>
        </span>
      </div>
    </Link>
  );
}

function AgentCore({ live, code }: { live: boolean; code: string }) {
  return (
    <span className={cn("agent-core", live && "agent-core-live")}>
      <span className="agent-core-ring" />
      <span className="agent-core-face">{code}</span>
    </span>
  );
}

function initials(name: string): string {
  const skip = new Set(["agent", "analyst", "and", "&", "the", "of", "a", "to", "up", "in"]);
  const words = name
    .split(/[\s/]+/)
    .filter((word) => !skip.has(word.toLowerCase()));

  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  if (words.length === 1) {
    const parts = words[0].split("-").filter((part) => !skip.has(part.toLowerCase()));
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return (parts[0] ?? words[0]).replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase();
  }

  return name.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase();
}
