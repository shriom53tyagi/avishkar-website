"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { readReducedMotion } from "./shared/useReducedMotion";
import styles from "./AvHomeCta.module.css";
import { Roll } from "../Roll";
import { CalendlyEmbed } from "./CalendlyEmbed";

/**
 * Final CTA — ported 1:1 from reference/avishkar-hero.html `.cta-wrap`
 * (CSS ~720-782 + ~831-845, markup ~1112-1141, JS ~1576-1609 — the JS is
 * a combined IIFE with the footer; this component owns only the CTA half
 * of it, the footer half lives in AvSiteFooter).
 *
 * The right column is the live Calendly booking widget (CalendlyEmbed).
 */

function ctaTickLines(): React.ReactNode[] {
  // Decorative fanned tick-arc behind the CTA content, generated to match
  // the reference's static viewBox 0 0 2400 900 tick fan.
  const lines: React.ReactNode[] = [];
  const cx = 1200,
    cy = 1200;
  const r1 = 1170,
    r2 = 1192;
  const count = 140;
  const startAngle = -Math.PI * 0.62;
  const endAngle = Math.PI * 0.02;
  for (let k = 0; k < count; k++) {
    const a = startAngle + (k / (count - 1)) * (endAngle - startAngle);
    const x1 = (cx + r1 * Math.cos(a)).toFixed(1);
    const y1 = (cy + r1 * Math.sin(a)).toFixed(1);
    const x2 = (cx + r2 * Math.cos(a)).toFixed(1);
    const y2 = (cy + r2 * Math.sin(a)).toFixed(1);
    lines.push(<line key={k} x1={x1} y1={y1} x2={x2} y2={y2} />);
  }
  return lines;
}

export function AvHomeCta() {
  const ctaRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLElement>(null);
  const ticksRef = useRef<SVGSVGElement>(null);
  const onScreenRef = useRef(true);
  const [isIn, setIsIn] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) onScreenRef.current = entry.isIntersecting;
      },
      { rootMargin: "200px" },
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const cta = ctaRef.current;
    if (!cta) return;
    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsIn(true);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.25 },
    );
    io.observe(cta);
    return () => {
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    const cta = ctaRef.current;
    const ticks = ticksRef.current;
    if (!cta || !ticks) return;
    const reduce = readReducedMotion();
    // `cta`'s position/height only change on scroll or resize, not every
    // frame — cached and re-measured only on those events instead of a
    // forced-layout read on every rAF tick.
    let ctaTop = cta.getBoundingClientRect().top;
    let ctaHeight = cta.getBoundingClientRect().height;
    const remeasure = () => {
      const r = cta.getBoundingClientRect();
      ctaTop = r.top;
      ctaHeight = r.height;
    };
    window.addEventListener("scroll", remeasure, { passive: true });
    window.addEventListener("resize", remeasure, { passive: true });

    let rafId: number;
    const loop = () => {
      if (onScreenRef.current && !reduce) {
        const p = (window.innerHeight - ctaTop) / (window.innerHeight + ctaHeight);
        ticks.style.transform = `rotate(${(p - 0.5) * 10}deg)`;
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
    <section className={styles.ctaWrap} id="audit" ref={wrapRef}>
      <div className={`${styles.cta} ${isIn ? styles.isIn : ""}`} data-cta ref={ctaRef}>
        <span className={styles.tag}>Free stack audit</span>
        <svg className={styles.ticks} viewBox="0 0 2400 900" aria-hidden="true" ref={ticksRef}>
          {ctaTickLines()}
        </svg>

        <div className={styles.left}>
          <p className={styles.eyebrow}>Want to see it on your own stack?</p>
          <h2>
            Get your free
            <br />
            practice audit
          </h2>
          <Link href="/contact" className={styles.btn}>
            <Roll>Book your audit</Roll>
          </Link>
          <p className={styles.note} aria-hidden="true">
            <svg viewBox="0 0 48 48">
              <path d="M4 40 C 24 36, 36 24, 38 4 M38 4 L 32 11 M38 4 L 43 11" />
            </svg>
            See where your
            <br />
            systems leak!
          </p>
        </div>

        <CalendlyEmbed className={styles.book} />
      </div>
    </section>
  );
}
