"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./HowWeWorkPage.module.css";

/**
 * Placeholder for library destinations that don't exist yet. Composed
 * entirely from HowWeWorkPage.module.css (hero, eyebrow, headline line-rise,
 * lime CTA, handwritten note) so it matches the other redesigned pages.
 */
export function ComingSoonPage() {
  const [isIn, setIsIn] = useState(false);

  // Page entrance (double-rAF, same as the other page heroes).
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
    <div className={`${styles.hw} ${isIn ? styles.isIn : ""}`}>
      <div className={styles.guide} aria-hidden="true" />

      <section
        className={styles.hero}
        style={{
          minHeight: "calc(100svh - 9.5rem)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1.5rem",
        }}
      >
        <p className={`${styles.eyebrow} ${styles.fade}`}>
          <span>Coming soon</span>
          <span>Avishkar</span>
        </p>
        <h1 className={styles.title}>
          <span className={styles.ln}>
            <span>See you soon.</span>
          </span>
        </h1>
        <p className={`${styles.lead} ${styles.fade}`} style={{ ["--d" as string]: ".35s" }}>
          This page is under construction. We&apos;re building it right now.
        </p>
        <span className={styles.ctaWrap}>
          <span style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.75rem" }}>
            <Link href="/" className={`${styles.cta} ${styles.fade}`} style={{ ["--d" as string]: ".5s" }}>
              Back to home
            </Link>
            <Link
              href="/insights"
              className={`${styles.cta} ${styles.fade}`}
              style={{
                ["--d" as string]: ".6s",
                background: "#e6e4e1",
                color: "var(--color-text)",
                borderRadius: "2rem",
              }}
            >
              Read our insights
            </Link>
          </span>
          <p className={`${styles.note} ${styles.script}`} aria-hidden="true">
            <span>Almost there!</span>
          </p>
        </span>
      </section>
    </div>
  );
}
