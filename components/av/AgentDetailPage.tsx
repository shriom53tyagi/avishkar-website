"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Agent } from "@/lib/agents";
import styles from "./AgentDetailPage.module.css";

/**
 * Agent detail page — styled with the rest of the site's design system
 * (AgentsPage/InsightsPage: --ink/--lime/--purple tokens, the
 * .fade/.ln/.guide "isIn" entrance pattern, mono-uppercase eyebrow badges,
 * thin-rule section dividers, pill CTAs) instead of the raw inline styles
 * this page previously used.
 */

const DETAIL_NOTE =
  "This agent is one example of how we work. Avishkar also builds integrations, automation, internal tools, and reporting inside the systems a practice already runs.";

export function AgentDetailPage({ agent, related }: { agent: Agent; related: Agent[] }) {
  const [isIn, setIsIn] = useState(false);
  const live = agent.status === "live";

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

  return (
    <main className={`${styles.detail} ${isIn ? styles.isIn : ""}`} data-agent-detail-page>
      <div className={styles.guide} aria-hidden="true" />

      <section className={styles.hero}>
        <p className={`${styles.eyebrow} ${styles.fade}`}>
          <span>{agent.category}</span>
          <span>{live ? "Available to explore" : "In development"}</span>
        </p>
        <h1 className={styles.title}>
          <span className={styles.ln}>
            <span>{agent.name}</span>
          </span>
        </h1>
        <p className={`${styles.lead} ${styles.fade}`} style={{ ["--d" as string]: ".2s" }}>
          {agent.oneLiner}
        </p>

        <div className={`${styles.actions} ${styles.fade}`} style={{ ["--d" as string]: ".3s" }}>
          {live && agent.demoUrl ? (
            <>
              <a href={agent.demoUrl} className={`${styles.btn} ${styles.btnDark}`}>
                Try agent
              </a>
              <Link href="/contact" className={`${styles.btn} ${styles.btnOutline}`}>
                Book a 30-min conversation
              </Link>
            </>
          ) : (
            <Link href="/contact" className={`${styles.btn} ${styles.btnDark}`}>
              Book a 30-min conversation
            </Link>
          )}
        </div>
        {live && !agent.demoUrl && (
          <p className={`${styles.liveNote} ${styles.fade}`} style={{ ["--d" as string]: ".38s" }}>
            This agent is running today. We walk you through it live on a call while the self-serve
            version is being finished.
          </p>
        )}
      </section>

      <section className={`${styles.body} ${styles.fade}`} style={{ ["--d" as string]: ".45s" }}>
        <div className={styles.main}>
          <h2>What it does</h2>
          <p className={styles.what}>{agent.what}</p>

          <h2 style={{ marginTop: "3rem" }}>What you get</h2>
          <div className={styles.outputs}>
            {agent.outputs.map((o) => (
              <div key={o.label} className={styles.outputRow}>
                <div className={styles.outputLabel}>{o.label}</div>
                <p className={styles.outputDetail}>{o.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.side}>
          <h2>What it analyzes</h2>
          <ul className={styles.analyzes}>
            {agent.analyzes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className={styles.analyzesNote}>
            We work with the systems that already hold this data, and only the fields the analysis
            needs.
          </p>
        </div>
      </section>

      <section className={styles.closing}>
        <div className={styles.closingInner}>
          <h2>
            {live ? "Want this connected to your practice?" : `Need the ${agent.name} sooner?`}
          </h2>
          <p>
            {live
              ? "We'll walk you through it on a live call, then look at what it would take to run on your own data. If this isn't quite the problem, that's useful too — most of what we build starts from a conversation, not a catalogue."
              : "This one is in development. If it's the problem you're trying to solve, tell us — that's how work gets prioritized."}
          </p>
          <div className={styles.closingActions}>
            <Link href="/contact" className={`${styles.btn} ${styles.btnDark}`}>
              Book a 30-min conversation
            </Link>
            <Link href="/agents" className={`${styles.btn} ${styles.btnOutline}`}>
              Explore agents
            </Link>
          </div>

          <p className={styles.note}>
            {DETAIL_NOTE} <Link href="/how-we-work">See how we work</Link>.
          </p>
        </div>
      </section>

      {related.length > 0 && (
        <section className={styles.related}>
          <div className={styles.relatedLabel}>Related agents</div>
          <div className={styles.relatedLinks}>
            {related.map((item) => (
              <Link key={item.slug} href={`/agents/${item.slug}`}>
                {item.name} →
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
