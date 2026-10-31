"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AvAgentLibrary } from "@/components/av/AvAgentLibrary";
import { AGENTS, AGENT_CATEGORIES, DEVELOPING_AGENTS, LIVE_AGENTS } from "@/lib/agents";
import styles from "./AgentsPage.module.css";

/**
 * Agents page — ported 1:1 from reference/avishkar-agents.html (`.ag-hero`,
 * `.stats` counters, `AvAgentLibrary`'s filters/live-card/dev-grid).
 *
 * The reference has no equivalent of this page's existing closing "This is
 * one part of the work." section — kept per the task's instruction, styled
 * with the page's own patterns (see .closing below).
 */

function readReducedMotion() {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function useCountUp(target: number, start: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (readReducedMotion()) {
      setValue(target);
      return;
    }
    let rafId: number;
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 1200);
      setValue(Math.round(target * (1 - Math.pow(1 - k, 3))));
      if (k < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [start, target]);
  return value;
}

export function AgentsPage() {
  const [isIn, setIsIn] = useState(false);
  const [countStart, setCountStart] = useState(false);

  useEffect(() => {
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setIsIn(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  // Hero counters start 600ms after mount, matching the reference's
  // `setTimeout(..., 600)`.
  useEffect(() => {
    const t = setTimeout(() => setCountStart(true), 600);
    return () => clearTimeout(t);
  }, []);

  const liveCount = useCountUp(LIVE_AGENTS.length, countStart);
  const devCount = useCountUp(DEVELOPING_AGENTS.length, countStart);

  return (
    <main className={`${styles.ag} ${isIn ? styles.isIn : ""}`} data-agents-page>
      <div className={styles.guide} aria-hidden="true" />

      <section className={styles.hero}>
        <p className={`${styles.eyebrow} ${styles.fade}`}>
          <span>Work you can see</span>
          <span>Agents</span>
        </p>
        <h1 className={styles.title}>
          {["Agents we've built", "for practice teams."].map((line, i) => (
            <span className={styles.ln} key={i}>
              <span>{line}</span>
            </span>
          ))}
        </h1>
        <p className={`${styles.lead} ${styles.fade}`} style={{ ["--d" as string]: ".35s" }}>
          A current look at our work. Agents are not everything we build, but they are a clear way
          to see how we think: start from the workflow, connect to the systems already in place, and
          ship something the team can use.
        </p>
        <div className={`${styles.stats} ${styles.fade}`} style={{ ["--d" as string]: ".5s" }}>
          <div className={`${styles.stat} ${styles.statLive}`}>
            <i className={styles.dot} />
            <b>{liveCount}</b>
            <span>
              Available
              <br />
              to explore
            </span>
          </div>
          <div className={styles.stat}>
            <i className={`${styles.dot} ${styles.dotDev}`} />
            <b>{devCount}</b>
            <span>
              In
              <br />
              development
            </span>
          </div>
        </div>
      </section>

      <AvAgentLibrary agents={AGENTS} categories={[...AGENT_CATEGORIES]} />

      {/*
        Existing "This is one part of the work." closing section — not in
        the reference, kept per the task instruction and styled with the
        page's own patterns.
      */}
      <section className={styles.closing}>
        <div className={styles.closingInner}>
          <h2>This is one part of the work.</h2>
          <p>
            Avishkar builds technology around how a practice already operates — integrations,
            automation, internal tools, reporting, and custom software. Agents are the piece we can
            publish. If your problem doesn&apos;t look like one of these, that&apos;s normal. Bring
            it anyway.
          </p>
          <div className={styles.closingActions}>
            <Link href="/contact?intent=custom" className={styles.closingDark}>
              Don&apos;t see what you need?
            </Link>
            <Link href="/how-we-work" className={styles.closingOutline}>
              How we work
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
