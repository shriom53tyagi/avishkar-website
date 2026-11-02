"use client";

import { useEffect, useRef, useState } from "react";
import { AvCalendarEmbed } from "@/components/av/AvCalendarEmbed";
import styles from "./ContactPage.module.css";

/**
 * Contact / Book a demo page — ported 1:1 from
 * reference/avishkar-contact.html (`.talk` intro + two-column grid).
 *
 * The reference's `.embed` is a dashed placeholder frame; per the task,
 * the page's existing Calendly embed (AvCalendarEmbed) goes inside it
 * unchanged, filling the frame.
 *
 * The reference only shows the default "Book a 30-minute conversation"
 * copy — this page's existing `?intent=custom` variant ("Tell us what
 * you're trying to solve") is preserved as-is, just carried into the
 * reference's markup/animation instead of the old plain layout.
 */

const CONTACT_EMAIL = "info@avishkar.app";

// This page's real prep-list content — the reference shows only the first
// 3 items as a demonstration; all 4 of this page's existing items are kept.
const PREP = [
  "The workflow that frustrates you most right now",
  "Who on the team touches it, and how often",
  "The systems that hold the data — CRM, scheduling, EMR, phones, spreadsheets",
  "What a good outcome would look like in a month",
];

export function ContactPage({ custom }: { custom: boolean }) {
  const talkRef = useRef<HTMLElement>(null);
  const [isIn, setIsIn] = useState(false);

  useEffect(() => {
    // Reference: `requestAnimationFrame(() => requestAnimationFrame(() => page.classList.add('is-in')))`
    // — two rAFs so the entrance transition is guaranteed to run from the
    // pre-`is-in` styles rather than the browser coalescing it away.
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setIsIn(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  const title = custom ? "Tell us what you're trying to solve." : "Book a 30-minute conversation.";
  const titleLines = custom
    ? ["Tell us what you're", "trying to solve."]
    : ["Book a 30-minute", "conversation."];

  return (
    <main className={`${styles.talk} ${isIn ? styles.isIn : ""}`} data-talk ref={talkRef}>
      <div className={styles.guide} aria-hidden="true" />

      <header className={styles.head}>
        <p className={`${styles.eyebrow} ${styles.fade}`}>
          <span>Talk to us</span>
          <span>30 min</span>
        </p>
        <h1 className={styles.title} aria-label={title}>
          {titleLines.map((line, i) => (
            <span className={styles.ln} key={i}>
              <span>{line}</span>
            </span>
          ))}
        </h1>
        {custom ? (
          <p className={`${styles.lead} ${styles.fade}`} style={{ ["--d" as string]: ".35s" }}>
            The agents on our site are examples of current work, not a catalogue. Describe the
            problem and we&apos;ll tell you honestly what we&apos;d build around it.
          </p>
        ) : (
          <p className={`${styles.lead} ${styles.fade}`} style={{ ["--d" as string]: ".35s" }}>
            Thirty minutes on the workflow you want to improve. We&apos;ll ask about the{" "}
            <span className={styles.chip}>systems</span> involved and where the{" "}
            <span className={styles.chip}>time</span> goes, then tell you where technology could
            help, and where it wouldn&apos;t.
          </p>
        )}
        <p className={styles.note} aria-hidden="true">
          <span>Pick any slot!</span>
          <svg viewBox="0 0 48 56">
            <path pathLength={1} d="M40 2 C 44 22, 30 42, 6 50 M6 50 L 15 43 M6 50 L 16 54" />
          </svg>
        </p>
      </header>

      <div className={styles.grid}>
        <section
          className={`${styles.calCard} ${styles.fade}`}
          style={{ ["--d" as string]: ".5s" }}
          aria-labelledby="pick"
        >
          <div className={styles.calCardHead}>
            <div>
              <h2 id="pick">Pick a time</h2>
              <p>Straight to the calendar. If nothing fits, email us and we&apos;ll find a slot.</p>
            </div>
            <span className={styles.dur}>
              <i />
              30 minutes
            </span>
          </div>
          <div className={styles.embed}>
            <AvCalendarEmbed />
          </div>
        </section>

        <aside className={styles.side}>
          <section
            className={`${styles.sideCard} ${styles.sideCardDark} ${styles.fade}`}
            style={{ ["--d" as string]: ".62s" }}
            aria-labelledby="email"
          >
            <h2 id="email">Prefer email?</h2>
            <p>Write to us with a couple of lines about the workflow.</p>
            <a
              className={styles.mailBtn}
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                custom ? "A problem we're trying to solve" : "30-minute conversation",
              )}`}
            >
              {CONTACT_EMAIL}
              <svg viewBox="0 0 16 16">
                <path d="M4 12L12 4M6 4h6v6" />
              </svg>
            </a>
            <p className={styles.reply}>
              <i />
              We usually reply within one business day
            </p>
          </section>

          <section
            className={`${styles.sideCard} ${styles.sideCardLight} ${styles.fade}`}
            style={{ ["--d" as string]: ".74s" }}
            aria-labelledby="ready"
          >
            <h2 id="ready">Worth having ready</h2>
            <ol className={styles.ready}>
              {PREP.map((item, i) => (
                <li key={item} style={{ ["--r" as string]: i }}>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
            <p className={styles.readyFootnote}>
              No preparation is required. Nothing in the conversation obliges you to buy anything,
              and we won&apos;t ask for system access to have it.
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}
