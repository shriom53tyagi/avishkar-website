"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AvAgentCard } from "@/components/av/AvAgentCard";
import type { Agent, AgentCategory } from "@/lib/agents";
import styles from "./AgentsPage.module.css";

/**
 * Ported 1:1 from reference/avishkar-agents.html `.filters`/`.ftabs`,
 * `.live`/`.preview` and `.dev` — sticky category filter, the live-agent
 * dark card(s), and the in-development grid, all wired to real data from
 * `lib/agents.ts` in place of the reference's placeholder counts/names.
 *
 * Only "Win-Loss Analyst" gets the reference's bespoke `.preview` panel
 * (win/loss bars + typed finding) — that content is a sample illustration
 * with no backing data field, kept per the task instruction with a visible
 * "Example" label instead of the reference's "[Sample data]".
 */

function readReducedMotion() {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const WL_SAMPLE = [
  { label: "Won", pct: 64, color: "var(--lime)" },
  { label: "Lost: price", pct: 38, color: "var(--purple)" },
  { label: "Lost: timing", pct: 26, color: "var(--purple)" },
  { label: "No decision", pct: 18, color: "#6d6965" },
];
const WL_INSIGHT_SAMPLE =
  "Medspas lose the most ground on price objections raised after the first consult.";

function LiveAgentCard({ agent }: { agent: Agent }) {
  const ref = useRef<HTMLElement>(null);
  const typedRef = useRef<HTMLSpanElement>(null);
  const [isIn, setIsIn] = useState(false);
  const showPreview = agent.slug === "win-loss-analyst";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsIn(true);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Typewriter effect for the sample "Biggest opportunity" finding.
  useEffect(() => {
    if (!isIn || !showPreview) return;
    const el = typedRef.current;
    if (!el) return;
    const reduce = readReducedMotion();
    if (reduce) {
      el.textContent = WL_INSIGHT_SAMPLE;
      return;
    }
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      el.textContent = WL_INSIGHT_SAMPLE.slice(0, i);
      if (i >= WL_INSIGHT_SAMPLE.length) clearInterval(interval);
    }, 28);
    return () => clearInterval(interval);
  }, [isIn, showPreview]);

  return (
    <article
      className={`${styles.live} ${isIn ? styles.isIn : ""}`}
      data-cat={agent.category}
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div className={styles.liveBody}>
        <div className={styles.badge2}>
          <span className={styles.bLive}>
            <i className={styles.dot} />
            Live
          </span>
          <span>{agent.category} agent</span>
        </div>
        <h3>{agent.name}</h3>
        <p>{agent.oneLiner}</p>
        <div className={styles.explore}>
          <Link href={`/agents/${agent.slug}`}>
            Explore the agent
            <svg viewBox="0 0 16 16">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </div>
      </div>
      {showPreview && (
        <div className={styles.preview} aria-hidden="true">
          <div className={styles.previewTop}>
            <span>{agent.name}</span>
            <span>Example</span>
          </div>
          <div className={styles.wl}>
            {WL_SAMPLE.map((row, k) => (
              <div key={row.label}>
                <span>{row.label}</span>
                <em
                  style={{
                    ["--w" as string]: `${row.pct}%`,
                    ["--c" as string]: row.color,
                    ["--k" as string]: k,
                  }}
                />
                <strong>{row.pct}%</strong>
              </div>
            ))}
          </div>
          <div className={styles.insight}>
            <b>Biggest opportunity</b>
            <span className={styles.typed} ref={typedRef} />
          </div>
        </div>
      )}
    </article>
  );
}

export function AvAgentLibrary({
  agents,
  categories,
}: {
  agents: Agent[];
  categories: AgentCategory[];
}) {
  const [active, setActive] = useState<AgentCategory | "All">("All");
  const [leavingKeys, setLeavingKeys] = useState<Set<string>>(new Set());
  const devRef = useRef<HTMLDivElement>(null);

  const live = useMemo(() => agents.filter((a) => a.status === "live"), [agents]);
  const developing = useMemo(() => agents.filter((a) => a.status === "in_development"), [agents]);

  const matchesActive = (a: Agent) => active === "All" || a.category === active;

  const visibleLive = live.filter(matchesActive);
  const visibleDeveloping = developing.filter(matchesActive);
  const showEmpty = visibleLive.length === 0 && visibleDeveloping.length === 0;

  // In-dev cards rise in once on first view (reference: threshold .15, staggered).
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());
  useEffect(() => {
    const container = devRef.current;
    if (!container) return;
    const cards = [...container.querySelectorAll<HTMLElement>("[data-slug]")];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, k) => {
          if (entry.isIntersecting) {
            const slug = (entry.target as HTMLElement).dataset.slug;
            if (!slug) return;
            const timeout = setTimeout(() => {
              setRevealedKeys((prev) => new Set(prev).add(slug));
            }, k * 80);
            io.unobserve(entry.target);
            return () => clearTimeout(timeout);
          }
        });
      },
      { threshold: 0.15 },
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  // On filter change: fade the leaving cards out first, then swap.
  const handleFilterClick = (category: AgentCategory | "All") => {
    if (category === active) return;
    const reduce = readReducedMotion();
    if (reduce) {
      setActive(category);
      return;
    }
    const leaving = new Set(
      developing.filter((a) => !(category === "All" || a.category === category)).map((a) => a.slug),
    );
    setLeavingKeys(leaving);
    setTimeout(() => {
      setActive(category);
      setLeavingKeys(new Set());
    }, 260);
  };

  const showFilter = agents.length > 8;

  return (
    <div className={styles.ag} data-agents>
      {showFilter && (
        <div className={styles.filters}>
          <div className={styles.ftabs} role="tablist" aria-label="Filter by area">
            <button
              type="button"
              className={active === "All" ? styles.isActive : ""}
              aria-pressed={active === "All"}
              onClick={() => handleFilterClick("All")}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                className={active === category ? styles.isActive : ""}
                aria-pressed={active === category}
                onClick={() => handleFilterClick(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.body}>
        {visibleLive.length > 0 && (
          <>
            <div className={styles.secHead}>
              <h2>
                Available to explore<sup>{visibleLive.length}</sup>
              </h2>
              <p>Live examples of the work. You can see these running today.</p>
            </div>
            {visibleLive.map((agent) => (
              <LiveAgentCard agent={agent} key={agent.slug} />
            ))}
          </>
        )}

        {(visibleDeveloping.length > 0 || developing.length > 0) && (
          <>
            <div className={styles.secHead}>
              <h2>
                In development<sup>{visibleDeveloping.length}</sup>
              </h2>
              <p>
                What we&apos;re building next, based on the problems practices keep bringing us.
              </p>
            </div>
            <div className={styles.dev} ref={devRef}>
              {developing.map((agent) => {
                const inActive = matchesActive(agent);
                const isLeaving = leavingKeys.has(agent.slug);
                if (!inActive && !isLeaving) return null;
                return (
                  <div key={agent.slug} data-slug={agent.slug}>
                    <AvAgentCard
                      agent={agent}
                      className={`${revealedKeys.has(agent.slug) ? styles.isIn : ""} ${isLeaving ? styles.isOut : ""}`}
                    />
                  </div>
                );
              })}
            </div>
          </>
        )}

        <p className={`${styles.empty} ${showEmpty ? styles.show : ""}`}>
          Nothing in this area yet.
        </p>
      </div>
    </div>
  );
}
