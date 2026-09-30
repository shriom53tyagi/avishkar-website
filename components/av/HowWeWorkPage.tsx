"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./HowWeWorkPage.module.css";

/**
 * How we work page — ported 1:1 from reference/avishkar-how-we-work.html
 * (`.hw-hero`, `.steps`, the sticky/stacking step-card scroll animation).
 *
 * The reference has no equivalent of this page's existing "What we build",
 * "Questions" (FAQ) and closing CTA sections below step 03 — kept per the
 * task's instruction, styled with the same mono-label/big-heading/fade-up
 * pattern as the rest of the page (see .extra/.faqList/.closing in
 * HowWeWorkPage.module.css), listed in the port summary for review.
 */

const STEPS = [
  {
    title: "A 30-minute conversation",
    timing: "Week one",
    body: "You describe the workflow that frustrates you. We ask about the systems involved and who touches them. If technology isn't the answer, we say so.",
    variant: styles.stepDark,
  },
  {
    title: "One scoped build",
    timing: "Weeks two to six, typically",
    body: "We agree on a single problem worth solving, connect to the systems that hold the data, and build the smallest thing that solves it properly.",
    variant: styles.stepPurple,
  },
  {
    title: "Measure, then extend",
    timing: "Ongoing",
    body: "We watch how the solution performs against the workflow it replaced, tune it, and only then talk about what to build next.",
    variant: styles.stepLime,
  },
];

const FORMS = [
  "An integration between systems",
  "Workflow automation",
  "An internal tool",
  "A reporting system",
  "An AI agent",
  "A custom application",
];

const CUSTOM_BODY =
  "What you see here is a look at current work, not a catalogue of everything we do. Most builds are specific to one practice — bring us the problem and we'll scope it.";

const FAQS = [
  {
    q: "Do we have to replace our existing systems?",
    a: "No. We work inside the tools you already run — your CRM, scheduling, EMR, phone system, spreadsheets. We connect to them and build around them. Nothing is ripped out and replaced.",
  },
  {
    q: "What does the first conversation involve?",
    a: "Thirty minutes on the workflow that frustrates you. Which people touch it, which systems hold the data, and what a good outcome would look like. No slide deck, and no obligation to buy anything at the end of it.",
  },
  {
    q: "What if what we need isn't on your site?",
    a: "The agents on this site are examples of current work, not a product catalogue. Bring us the problem and we'll scope a build around it — that might be an agent, or it might be an integration, an internal tool, or a report.",
  },
  {
    q: "How does pricing work?",
    a: "Each build is scoped and priced individually, because the work depends on the problem and the systems involved. You'll have a scope and a price before anything starts. We'll talk about it in the first conversation rather than publishing a number that fits nobody.",
  },
];

function readReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function HowWeWorkPage() {
  const [isIn, setIsIn] = useState(false);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [stepsIn, setStepsIn] = useState<boolean[]>(() => STEPS.map(() => false));

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

  // Each step card reveals its number once it scrolls in (threshold .3).
  useEffect(() => {
    const els = stepRefs.current.filter((el): el is HTMLDivElement => el !== null);
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = els.indexOf(entry.target as HTMLDivElement);
            if (idx !== -1) setStepsIn((prev) => (prev[idx] ? prev : prev.map((v, i) => (i === idx ? true : v))));
          }
        });
      },
      { threshold: 0.3 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Cards stack: each one shrinks a little and darkens as the next slides
  // over it; its bottom bar fills while it's on top. Runs continuously via
  // rAF (matching the reference's un-gated scroll loop), but only while
  // the steps section itself is on/near screen.
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const reduce = readReducedMotion();
    let onScreen = true;
    const sectionEl = sectionRef.current;
    let sectionIo: IntersectionObserver | undefined;
    if (sectionEl) {
      sectionIo = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) onScreen = entry.isIntersecting;
        },
        { rootMargin: "400px" },
      );
      sectionIo.observe(sectionEl);
    }

    let rafId: number;
    const loop = () => {
      if (onScreen) {
        const steps = stepRefs.current;
        // `position: sticky` tops can't be derived from scroll position
        // alone (they depend on the browser's sticky-positioning layout
        // pass), so these reads can't be cached across frames the way a
        // simple scroll-linear parallax can — but every step's rect is
        // read first, in one pass, before any style is written, so the
        // browser never has to interleave a read with a write it just
        // made (which would force a second synchronous layout per step).
        const rects = steps.map((stepEl) => stepEl?.getBoundingClientRect() ?? null);
        const heights = steps.map((stepEl) => (stepEl?.firstElementChild as HTMLElement | null)?.offsetHeight ?? 0);

        steps.forEach((stepEl, i) => {
          if (!stepEl) return;
          const card = stepEl.firstElementChild as HTMLElement | null;
          if (!card) return;
          const rect = rects[i];
          if (!rect) return;
          const nextRect = rects[i + 1];
          let sc = 1;
          if (nextRect && !reduce) {
            const k = Math.min(1, Math.max(0, 1 - (nextRect.top - rect.top) / heights[i]));
            sc = 1 - k * 0.06;
            card.style.filter = `brightness(${1 - k * 0.25})`;
          }
          card.style.setProperty("--sc", String(sc));
          const p = Math.min(1, Math.max(0, (window.innerHeight * 0.75 - rect.top) / (window.innerHeight * 0.6)));
          card.style.setProperty("--p", String(reduce ? 1 : p));
        });
      }
      rafId = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(rafId);
      sectionIo?.disconnect();
    };
  }, []);

  return (
    <main className={`${styles.hw} ${isIn ? styles.isIn : ""}`} data-hw>
      <div className={styles.guide} aria-hidden="true" />

      <section className={styles.hero}>
        <p className={`${styles.eyebrow} ${styles.fade}`}>
          <span>How we work</span>
          <span>3 steps</span>
        </p>
        <h1 className={styles.title}>
          {["A conversation first.", "Then something small", "that works."].map((line, i) => (
            <span className={styles.ln} key={i}>
              <span>{line}</span>
            </span>
          ))}
        </h1>
        <p className={`${styles.lead} ${styles.fade}`} style={{ ["--d" as string]: ".4s" }}>
          No long discovery phase, no platform migration, no committee. We start with the workflow that frustrates
          you and build the smallest thing that fixes it.
        </p>
        <span className={styles.ctaWrap}>
          <Link href="/contact" className={`${styles.cta} ${styles.fade}`} style={{ ["--d" as string]: ".55s" }}>
            Book a 30-min conversation
          </Link>
          <p className={`${styles.note} ${styles.script}`} aria-hidden="true">
            <span>
              That&apos;s it.
              <br />
              Three steps!
            </span>
          </p>
        </span>
      </section>

      <section className={styles.steps} aria-labelledby="steps" ref={sectionRef}>
        <div className={styles.stepsLabel}>
          <h2 id="steps">The process</h2>
          <span>Scroll through it</span>
        </div>
        {STEPS.map((step, i) => (
          <div
            className={`${styles.step} ${step.variant} ${stepsIn[i] ? styles.isIn : ""}`}
            style={{ ["--i" as string]: i }}
            key={step.title}
            ref={(el) => {
              stepRefs.current[i] = el;
            }}
          >
            <div className={styles.stepCard}>
              <div className={styles.stepNum} aria-hidden="true">
                <b>{String(i + 1).padStart(2, "0")[0]}</b>
                <b>{String(i + 1).padStart(2, "0")[1]}</b>
              </div>
              <div className={styles.stepRight}>
                <span className={styles.when}>
                  <i />
                  {step.timing}
                </span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </div>
              <span className={styles.stepBar} aria-hidden="true">
                <i />
              </span>
            </div>
          </div>
        ))}
      </section>

      {/*
        Existing "What we build" section — not in the reference, kept per
        the task instruction and styled with the page's own patterns.
      */}
      <section className={styles.extra} aria-labelledby="what-we-build">
        <div className={styles.extraInner}>
          <p className={styles.eyebrow}>
            <span>What we build</span>
          </p>
          <h2 id="what-we-build">Built around your practice. Not the other way around.</h2>
          <p>
            Your practice should not have to change how it works just to fit another piece of software. Avishkar
            works with the systems you already use and builds the technology around your workflow.
          </p>
          <div className={styles.formsList}>
            {FORMS.map((f) => (
              <div className={styles.formsItem} key={f}>
                {f}
              </div>
            ))}
          </div>
          <p className={styles.customBody}>{CUSTOM_BODY}</p>
          <Link href="/contact?intent=custom" className={styles.customLink}>
            Don&apos;t see what you need? →
          </Link>
        </div>
      </section>

      {/*
        Existing "Questions" (FAQ) section — not in the reference, kept per
        the task instruction and styled with the page's own patterns.
      */}
      <section className={styles.extra} aria-labelledby="questions">
        <div className={styles.extraInner}>
          <p className={styles.eyebrow}>
            <span>Questions</span>
          </p>
          <h2 id="questions">What practices usually ask first.</h2>
          <div className={styles.faqList}>
            {FAQS.map((faq) => (
              <div className={styles.faqItem} key={faq.q}>
                <h3>{faq.q}</h3>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*
        Existing closing CTA — not in the reference, kept per the task
        instruction and styled with the page's own patterns (matches the
        AboutPage's "Bring us the problem." closing section).
      */}
      <section className={styles.closing}>
        <div className={styles.closingInner}>
          <h2>Start with the workflow.</h2>
          <p>Thirty minutes, no slide deck. If technology isn&apos;t the right answer, we&apos;ll say so.</p>
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
