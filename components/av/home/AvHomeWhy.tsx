"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./AvHomeWhy.module.css";

/**
 * "Why Avishkar" section — ported 1:1 from reference/avishkar-hero.html
 * `.why` (CSS ~674-718, markup ~1094-1110, JS ~1611-1615: a single
 * IntersectionObserver; the rest is pure CSS transition-delay chains).
 *
 * TODO: none — all copy is real, ported as-is.
 */

const TITLE_WORDS = [
  "We",
  "know",
  "the",
  "medspa",
  "industry",
  "inside",
  "out,",
  "and",
  "we",
  "build",
  "the",
  "layer",
  "that",
  "makes",
  "every",
  "system",
  "you",
  "run",
  "work",
  "as",
  "one.",
];

const LIST_ITEMS = [
  {
    h3: "Stop the revenue leak",
    p: "Disconnected tools drop leads, double-book and forget follow-ups. We find where money slips out of your practice and close the gaps.",
  },
  {
    h3: "Keep the tools you have",
    p: "No rip-and-replace. We connect the EMR, CRM, booking and phone systems you already pay for, so your team keeps working the way it knows.",
  },
  {
    h3: "A partner that keeps building",
    p: "Your practice changes every quarter and your stack should too. We stay on as your technology partner and keep improving the layer as you grow.",
  },
];

export function AvHomeWhy() {
  const whyRef = useRef<HTMLElement>(null);
  const [isIn, setIsIn] = useState(false);

  useEffect(() => {
    const why = whyRef.current;
    if (!why) return;
    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsIn(true);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.2 },
    );
    io.observe(why);
    return () => io.disconnect();
  }, []);

  return (
    <section
      className={`${styles.why} ${isIn ? styles.isIn : ""}`}
      data-why
      id="why"
      aria-labelledby="why-title"
      ref={whyRef}
    >
      <span className={`${styles.corner} ${styles.cornerL}`} aria-hidden="true" />
      <span className={`${styles.corner} ${styles.cornerR}`} aria-hidden="true" />
      <div className={styles.left}>
        <div className={styles.micro} aria-hidden="true">
          <span className={styles.microWord}>
            AV
            <span className={styles.checker}>
              {Array.from({ length: 15 }).map((_, k) => (
                <i key={k} style={{ ["--k" as string]: k }} />
              ))}
            </span>
          </span>
          <span className={styles.microSide}>
            Systems
            <br />
            {"</> talk"}
          </span>
          <span className={styles.microRow}>Tech partner &gt;&gt;&gt; Avishkar AI</span>
          <span className={styles.microRow}>
            Medspas{" "}
            <svg viewBox="0 0 16 16">
              <path d="M8 1v14M1 8h14M3 3l10 10M13 3L3 13" />
            </svg>{" "}
            20 <em /> 26
          </span>
        </div>
        <p className={styles.note} aria-hidden="true">
          <span>Why Avishkar?</span>
          <svg viewBox="0 0 48 52">
            <path pathLength={1} d="M4 2 C 0 20, 14 40, 44 46 M44 46 L 35 40 M44 46 L 36 51" />
          </svg>
        </p>
      </div>
      <div>
        <h2 className={styles.title} id="why-title">
          {TITLE_WORDS.map((w, i) => (
            <span className="word" key={i}>
              <span style={{ ["--i" as string]: i }}>{w}</span>
            </span>
          )).reduce<React.ReactNode[]>((acc, el, i) => {
            if (i > 0) acc.push(" ");
            acc.push(el);
            return acc;
          }, [])}
        </h2>
        <ul className={styles.list}>
          {LIST_ITEMS.map((item, r) => (
            <li key={item.h3} style={{ ["--r" as string]: r }}>
              <h3>{item.h3}</h3>
              <p>{item.p}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
