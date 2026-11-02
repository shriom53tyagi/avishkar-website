"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./AboutPage.module.css";

/**
 * About page — ported 1:1 from reference/avishkar-about.html (`.ab-hero`,
 * `.story`, `.who`/`.band`, `.think`).
 *
 * The reference's "Four things we hold to." cards use bracket-placeholder
 * titles/text ("[Principle 1 title]" etc.) — replaced below with this
 * page's real PRINCIPLES, in order, onto the dark/purple/light/lime cards.
 *
 * The reference has no equivalent of this page's existing "Bring us the
 * problem." closing CTA section — kept per the task's instruction, styled
 * with the same mono-label/big-heading/fade-up pattern as the rest of the
 * page (see .closing in AboutPage.module.css), listed in the port summary
 * for review.
 *
 * The "Who we work with" band's marquee text ("Medspas ✱ Aesthetic
 * practices ✱ Clinics ✱ Healthcare teams") is this page's existing
 * AUDIENCE sentence split into marquee items, not new copy.
 */

const HEADLINE_LINES = ["We build technology", "for practices."];
const LEAD_CHIPS = ["the leads", "the schedule", "the consultations", "the follow-up"];

const BODY_PROBLEM =
  "Most practices don't have a technology problem in the abstract. They have a specific workflow that costs the team hours a week, a report nobody can produce, or data sitting in a system that won't give it up. The software market answers that with another platform to adopt.";

const BODY_TURN_CHIPS = ["an integration", "an internal tool", "a report", "an agent"];

const AUDIENCE = "Built for medspas, aesthetic practices, clinics, and healthcare teams.";
const BAND_ITEMS = ["Medspas", "Aesthetic practices", "Clinics", "Healthcare teams"];

const PRINCIPLES = [
  {
    variant: styles.pcardDark,
    title: "The workflow comes first",
    body: "We don't ask a practice to change how it works to suit software. The build fits the practice.",
    rot: "-2deg",
  },
  {
    variant: styles.pcardPurple,
    title: "Start small, prove it",
    body: "One scoped problem, solved properly, beats a platform rollout nobody asked for.",
    rot: "1.5deg",
  },
  {
    variant: styles.pcardLight,
    title: "Plain answers",
    body: "If technology isn't the right answer to a problem, we'll tell you that in the first conversation.",
    rot: "-1deg",
  },
  {
    variant: styles.pcardLime,
    title: "Your systems stay yours",
    body: "We work inside the tools you already run. Nothing gets ripped out and replaced.",
    rot: "2deg",
  },
];

function readReducedMotion() {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** A paragraph whose words light up (opacity 1) as it scrolls through the viewport. */
function LitParagraph({ text }: { text: string }) {
  const words = text.split(" ");
  const ref = useRef<HTMLParagraphElement>(null);
  const onScreenRef = useRef(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) onScreenRef.current = entry.isIntersecting;
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = readReducedMotion();
    const wordEls = [...el.querySelectorAll<HTMLElement>("span")];
    const clamp = (v: number) => Math.min(1, Math.max(0, v));

    // `el`'s position/height only change on scroll or resize, not every
    // frame — cached and re-measured only on those events instead of a
    // forced-layout read on every rAF tick.
    let elTop = el.getBoundingClientRect().top;
    let elHeight = el.getBoundingClientRect().height;
    const remeasure = () => {
      const r = el.getBoundingClientRect();
      elTop = r.top;
      elHeight = r.height;
    };
    window.addEventListener("scroll", remeasure, { passive: true });
    window.addEventListener("resize", remeasure, { passive: true });

    let rafId: number;
    const loop = () => {
      if (onScreenRef.current) {
        const p = reduce
          ? 1
          : clamp((window.innerHeight * 0.8 - elTop) / (elHeight + window.innerHeight * 0.3));
        const n = Math.round(p * wordEls.length);
        wordEls.forEach((w, i) => w.classList.toggle(styles.on, i < n));
      }
      rafId = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", remeasure);
      window.removeEventListener("resize", remeasure);
    };
  }, []);

  return (
    <p className={styles.lit} ref={ref}>
      {words.map((w, i) => (
        <span key={i}>{w} </span>
      ))}
    </p>
  );
}

export function AboutPage() {
  const aboutRef = useRef<HTMLElement>(null);
  const [isIn, setIsIn] = useState(false);
  const [leadHotIndex, setLeadHotIndex] = useState(-1);
  const turnRef = useRef<HTMLDivElement>(null);
  const [turnIn, setTurnIn] = useState(false);
  const [turnHotIndex, setTurnHotIndex] = useState(-1);
  const thinkRef = useRef<HTMLDivElement>(null);
  const [thinkIn, setThinkIn] = useState(false);

  // Page entrance (double-rAF, matching the reference).
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

  // Lead chips flash lime in turn, one at a time, starting 1.8s after
  // mount, every 900ms — a single shared interval walking the 4 chips in a
  // round-robin, matching the reference's `leadChips[k++ % leadChips.length]`.
  useEffect(() => {
    if (readReducedMotion()) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    let hotTimeout: ReturnType<typeof setTimeout> | undefined;
    const startTimeout = setTimeout(() => {
      let k = 0;
      interval = setInterval(() => {
        setLeadHotIndex(k++ % LEAD_CHIPS.length);
        hotTimeout = setTimeout(() => setLeadHotIndex(-1), 700);
      }, 900);
    }, 1800);
    return () => {
      clearTimeout(startTimeout);
      if (interval) clearInterval(interval);
      if (hotTimeout) clearTimeout(hotTimeout);
    };
  }, []);

  // "We work the other way around." — reveal + chips flashing lime once on entry.
  useEffect(() => {
    const el = turnRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setTurnIn(true);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!turnIn) return;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    BODY_TURN_CHIPS.forEach((_, i) => {
      timeouts.push(setTimeout(() => setTurnHotIndex(i), 900 + i * 150));
    });
    return () => timeouts.forEach(clearTimeout);
  }, [turnIn]);

  // "Four things we hold to." reveal once on entry.
  useEffect(() => {
    const el = thinkRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setThinkIn(true);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <main className={`${styles.about} ${isIn ? styles.isIn : ""}`} data-about ref={aboutRef}>
      <div className={styles.guide} aria-hidden="true" />

      <section className={styles.hero}>
        <p className={`${styles.eyebrow} ${styles.fade}`}>
          <span>About</span>
          <span>Avishkar</span>
        </p>
        <h1 className={styles.title}>
          {HEADLINE_LINES.map((line, i) => (
            <span className={styles.ln} key={i}>
              <span>{line}</span>
            </span>
          ))}
        </h1>
        <p className={`${styles.lead} ${styles.fade}`} style={{ ["--d" as string]: ".35s" }}>
          Avishkar is a technology company built around practice operations:{" "}
          {LEAD_CHIPS.map((c, i) => (
            <span key={c}>
              <span
                className={`${styles.chip} ${i === leadHotIndex ? styles.hot : ""}`}
                style={{ ["--i" as string]: i }}
              >
                {c}
              </span>
              {i < LEAD_CHIPS.length - 1 ? ", " : ""}
            </span>
          ))}
          , and the systems that hold all of it.
        </p>
      </section>

      <section className={styles.story}>
        <div className={styles.storySide}>
          <p className={styles.storyLabel}>The problem</p>
          <p className={`${styles.storyNote} ${styles.script}`} aria-hidden="true">
            Sound familiar?
          </p>
        </div>
        <div>
          <LitParagraph text={BODY_PROBLEM} />
          <div className={`${styles.turn} ${turnIn ? styles.isIn : ""}`} ref={turnRef}>
            <h2>We work the other way around.</h2>
            <p>
              We start from the workflow, connect to whatever systems are already in place, and
              build the smallest thing that solves the problem properly:{" "}
              {BODY_TURN_CHIPS.map((c, i) => (
                <span key={c}>
                  <span className={`${styles.chip} ${i === turnHotIndex ? styles.hot : ""}`}>
                    {c}
                  </span>
                  {i < BODY_TURN_CHIPS.length - 1 ? ", " : ""}
                </span>
              ))}
              . Then we measure whether it actually helped.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.who} aria-labelledby="who">
        <div className={styles.whoHead}>
          <p className={styles.storyLabel} id="who">
            Who we work with
          </p>
          <p>{AUDIENCE}</p>
        </div>
        <div className={styles.band} aria-hidden="true">
          <div className={styles.bandTrack}>
            <BandGroup />
            <BandGroup />
          </div>
        </div>
      </section>

      <section className={`${styles.think} ${thinkIn ? styles.isIn : ""}`} aria-labelledby="think">
        <p className={styles.eyebrow}>
          <span>How we think</span>
          <span>04</span>
        </p>
        <h2 id="think">
          Four things
          <br />
          we hold to.
        </h2>
        <div className={styles.thinkGrid} ref={thinkRef}>
          {PRINCIPLES.map((p, i) => (
            <article
              key={p.title}
              className={`${styles.pcard} ${p.variant}`}
              style={{ ["--i" as string]: i, ["--rot" as string]: p.rot }}
            >
              <span className={styles.pcardBig} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={styles.pcardNum}>
                <span>{String(i + 1).padStart(2, "0")}</span>
              </span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/*
        Existing "Bring us the problem." CTA — not in the reference, kept
        per the task instruction and styled with the page's own patterns
        (mono label absent here since the reference's closing sections
        don't use one either; heading/body/fade-up match .turn above).
      */}
      <section className={styles.closing}>
        <div className={styles.closingInner}>
          <h2>Bring us the problem.</h2>
          <p>
            The best first conversation is a specific one: a workflow, a report you can&apos;t get,
            or a system that won&apos;t give up its data.
          </p>
          <div className={styles.closingActions}>
            <Link href="/contact" className={styles.closingDark}>
              Book a 30-min conversation
            </Link>
            <Link href="/agents" className={styles.closingOutline}>
              See our work
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function BandGroup() {
  return (
    <div className={styles.bandGrp}>
      {BAND_ITEMS.map((item) => (
        <span key={item}>
          {item}
          <b aria-hidden="true">✱</b>
        </span>
      ))}
    </div>
  );
}
