"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AvMark } from "./shared/AvMark";
import { readReducedMotion } from "./shared/useReducedMotion";
import styles from "./AvHomeCta.module.css";

/**
 * Final CTA — ported 1:1 from reference/avishkar-hero.html `.cta-wrap`
 * (CSS ~720-782 + ~831-845, markup ~1112-1141, JS ~1576-1609 — the JS is
 * a combined IIFE with the footer; this component owns only the CTA half
 * of it, the footer half lives in AvSiteFooter).
 *
 * TODO: the `.pv` panel below is the reference's own placeholder product
 * UI mockup — replace with a real product screenshot when available.
 *
 * NOTE (reference's own inconsistency, preserved as-is, not "fixed"
 * here): the copy says "Connected systems⁹" (superscript 9) implying 9
 * connected systems, but only 6 `.pv__card` tiles actually render below
 * it (EMR/CRM/Booking/Phones/Payments/Marketing). Ported verbatim.
 */

const PV_ITEMS: { b: string; label: string; em?: string; on?: boolean; dot?: boolean }[] = [
  { b: "", label: "Overview" },
  { b: "9", label: "Connected", em: "all talking!", on: true, dot: true },
  { b: "24", label: "Bookings" },
  { b: "12", label: "Leads" },
  { b: "8", label: "Calls" },
  { b: "31", label: "Scribe notes" },
  { b: "5", label: "Reviews" },
];

const PV_CARDS: { bg: string; label: string; icon: React.ReactNode }[] = [
  {
    bg: "#e7ffd6",
    label: "EMR",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M9 4h6v3H9zM7 5.5H5.5v15h13v-15H17" />
        <path d="M9 12h6M9 16h4" />
      </svg>
    ),
  },
  {
    bg: "#ece7ff",
    label: "CRM",
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
        <circle cx="17" cy="9" r="2.3" />
      </svg>
    ),
  },
  {
    bg: "#ffeadd",
    label: "Booking",
    icon: (
      <svg viewBox="0 0 24 24">
        <rect x="4" y="5.5" width="16" height="14" rx="2" />
        <path d="M8 3.5v4M16 3.5v4M4 10h16" />
      </svg>
    ),
  },
  {
    bg: "#e1efff",
    label: "Phones",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z" />
      </svg>
    ),
  },
  {
    bg: "#fff3c9",
    label: "Payments",
    icon: (
      <svg viewBox="0 0 24 24">
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M3 10h18M7 15h3" />
      </svg>
    ),
  },
  {
    bg: "#e8e3d8",
    label: "Marketing",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M4 10v4h3l7 4V6l-7 4H4z" />
        <path d="M17.5 9.5a3.5 3.5 0 0 1 0 5" />
      </svg>
    ),
  },
];

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
  const pvRef = useRef<HTMLDivElement>(null);
  const ticksRef = useRef<SVGSVGElement>(null);
  const onScreenRef = useRef(true);
  const [isIn, setIsIn] = useState(false);
  const [settled, setSettled] = useState(false);
  const [light, setLight] = useState(false);

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
    let timer: ReturnType<typeof setTimeout>;
    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsIn(true);
            timer = setTimeout(() => setSettled(true), 1700);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.25 },
    );
    io.observe(cta);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const cta = ctaRef.current;
    const pv = pvRef.current;
    const ticks = ticksRef.current;
    if (!cta || !pv || !ticks) return;
    const reduce = readReducedMotion();
    let rafId: number;
    const loop = () => {
      if (onScreenRef.current && !reduce) {
        const r = cta.getBoundingClientRect();
        const p = (window.innerHeight - r.top) / (window.innerHeight + r.height);
        pv.style.setProperty("--py", `${(0.5 - p) * 80}px`);
        ticks.style.transform = `rotate(${(p - 0.5) * 10}deg)`;
      }
      rafId = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section className={styles.ctaWrap} id="audit" ref={wrapRef}>
      <div
        className={`${styles.cta} ${isIn ? styles.isIn : ""} ${settled ? styles.settled : ""} ${light ? styles.light : ""}`}
        data-cta
        ref={ctaRef}
      >
        <span className={styles.tag}>Free stack audit</span>
        <div className={styles.modes}>
          <button
            className={!light ? styles.isActive : ""}
            aria-label="Dark preview"
            onClick={() => setLight(false)}
          >
            <svg viewBox="0 0 24 24">
              <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
            </svg>
          </button>
          <button
            className={light ? styles.isActive : ""}
            aria-label="Light preview"
            onClick={() => setLight(true)}
          >
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
            </svg>
          </button>
        </div>
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
            <span className={styles.roll}>
              <span className={styles.rollIn}>
                <span>Book your audit</span>
              </span>
            </span>
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

        <div className={styles.pv} data-pv aria-hidden="true" ref={pvRef}>
          <div className={styles.pvSide}>
            <div className={styles.pvLogo}>
              Avishkar
              <AvMark />
            </div>
            {PV_ITEMS.map((item) => (
              <div className={`${styles.pvItem} ${item.on ? styles.on : ""}`} key={item.label}>
                <b>{item.b}</b>
                {item.label}
                {item.em && <em>{item.em}</em>}
                {item.dot && <i />}
              </div>
            ))}
            <div className={styles.pvFoot}>
              <div className={styles.pvMode}>
                Dark mode
                <span className={styles.pvSw} />
              </div>
              <div className={styles.pvCta}>Book your audit</div>
            </div>
          </div>
          <div className={styles.pvMain}>
            <div className={styles.pvCrumb}>
              <span>Workspace</span>›<span>Connected</span>
            </div>
            <p className={styles.pvTitle}>
              Connected systems<sup>9</sup>
            </p>
            <div className={styles.pvGrid}>
              {PV_CARDS.map((c, k) => (
                <div className={styles.pvCard} key={c.label}>
                  <div
                    className={styles.pvThumb}
                    style={{ background: c.bg, ["--k" as string]: k }}
                  >
                    {c.icon}
                  </div>
                  <p>
                    {c.label} <span>· synced</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
