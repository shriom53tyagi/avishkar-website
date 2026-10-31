"use client";

import { useEffect, useRef } from "react";
import { readReducedMotion } from "./shared/useReducedMotion";
import { easeOutCubic } from "./shared/easing";
import styles from "./AvHomeWheel.module.css";

/**
 * "What we build" wheel — ported 1:1 from reference/avishkar-hero.html
 * `.wheel` (CSS ~338-397, markup ~1006-1012, JS ~1338-1379).
 *
 * The reference's 360-tick ring SVG (line ~1009) is static decorative
 * markup, not JS-generated in the original — it's generated here in the
 * component instead of transcribing 360 hand-authored `<line>` coordinates,
 * which is behaviorally identical (same positions, same static markup).
 */

type WheelCard = {
  title: string;
  screen: React.ReactNode;
};

const CARDS: WheelCard[] = [
  {
    title: "AI Scribe",
    screen: (
      <div className={`${styles.sc} ${styles.scScribe}`}>
        <span className="tag">Visit note · auto-drafted</span>
        <span className="big">Subjective</span>
        <i className="ln" style={{ width: "92%" }} />
        <i className="ln" style={{ width: "78%" }} />
        <i className="ln" style={{ width: "85%" }} />
        <span className="big" style={{ fontSize: "1.1rem", marginTop: ".4rem" }}>
          Plan
        </span>
        <i className="ln" style={{ width: "70%" }} />
        <i className="ln" style={{ width: "55%" }} />
      </div>
    ),
  },
  {
    title: "Voice AI Agent",
    screen: (
      <div className={`${styles.sc} ${styles.scVoice}`}>
        <span className={styles.bars}>
          {Array.from({ length: 14 }).map((_, k) => (
            <i key={k} style={{ ["--k" as string]: k }} />
          ))}
        </span>
        <span className="call">Answering call · 00:42</span>
      </div>
    ),
  },
  {
    title: "CRM ↔ EMR Integration",
    screen: (
      <div className={`${styles.sc} ${styles.scSync}`}>
        <span className="big">
          Always
          <br />
          in sync
        </span>
        <span className={styles.syncRow}>
          <span>CRM</span>
          <em />
          <span>EMR</span>
        </span>
      </div>
    ),
  },
  {
    title: "Lead Engine",
    screen: (
      // TODO: "+128 leads this month" is the reference's own mock figure — no real lead-count data source yet.
      <div className={`${styles.sc} ${styles.scLeads}`}>
        <span className="tag">Leads this month</span>
        <span className="big" data-count-to="128">
          +0
        </span>
      </div>
    ),
  },
  {
    title: "Marketing Intelligence",
    screen: (
      <div className={`${styles.sc} ${styles.scIntel}`}>
        <span className={styles.chart}>
          {[35, 55, 45, 70, 60, 85, 95].map((h, k) => (
            <i key={k} style={{ ["--h" as string]: `${h}%`, ["--k" as string]: k }} />
          ))}
        </span>
      </div>
    ),
  },
  {
    title: "Booking Automation",
    screen: (
      <div className={`${styles.sc} ${styles.scBook}`}>
        <span className={styles.cal}>
          {[
            "",
            "",
            "on",
            "",
            "",
            "on",
            "",
            "",
            "",
            "on",
            "",
            "on",
            "",
            "new",
            "",
            "",
            "on",
            "",
            "",
            "",
            "on",
            "",
            "new",
            "",
            "on",
            "",
            "on",
            "",
          ].map((cls, i) => (
            <i key={i} className={cls} />
          ))}
        </span>
      </div>
    ),
  },
  {
    title: "Revenue Dashboard",
    screen: (
      // TODO: "$248,750 recovered revenue" is the reference's own mock figure — no real revenue data source yet.
      <div className={`${styles.sc} ${styles.scRev}`}>
        <span className="tag">Recovered revenue</span>
        <span className="big" data-count-to="248750" data-prefix="$">
          $0
        </span>
      </div>
    ),
  },
];

// Unique cards duplicated at +180°, evenly spaced around the full ring.
const SLOTS = [
  ...CARDS.map((c, i) => ({ card: c, d: i })),
  ...CARDS.map((c, i) => ({ card: c, d: i })),
];

const SLOT_STEP = 360 / SLOTS.length;

function RingTicks() {
  const lines: React.ReactNode[] = [];
  const R = 1500;
  const count = 180;
  const r1 = R - 16;
  const r2 = R;
  for (let k = 0; k < count; k++) {
    const a = (k / count) * Math.PI * 2;
    const x1 = (R + r1 * Math.sin(a)).toFixed(1);
    const y1 = (R - r1 * Math.cos(a)).toFixed(1);
    const x2 = (R + r2 * Math.sin(a)).toFixed(1);
    const y2 = (R - r2 * Math.cos(a)).toFixed(1);
    lines.push(<line key={k} x1={x1} y1={y1} x2={x2} y2={y2} />);
  }
  return (
    <svg className={styles.ringTicks} viewBox="0 0 3000 3000" aria-hidden="true">
      {lines}
    </svg>
  );
}

export function AvHomeWheel() {
  const wheelRef = useRef<HTMLElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const onScreenRef = useRef(true);

  useEffect(() => {
    const wheel = wheelRef.current;
    if (!wheel) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) onScreenRef.current = entry.isIntersecting;
      },
      { rootMargin: "200px" },
    );
    io.observe(wheel);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const wheel = wheelRef.current;
    const ring = ringRef.current;
    if (!wheel || !ring) return;
    const reduce = readReducedMotion();
    let rot = -SLOT_STEP / 2;
    let vel = 0;
    let lastY = window.scrollY;
    let drag: { x: number; rot: number } | null = null;

    const fmt = (n: number) => n.toLocaleString("en-US");
    const counters = [...ring.querySelectorAll<HTMLElement>("[data-count-to]")];
    const countUp = () =>
      counters.forEach((el) => {
        const to = +(el.dataset.countTo || 0);
        const pre = el.dataset.prefix || "+";
        const t0 = performance.now();
        const step = (t: number) => {
          const k = Math.min(1, (t - t0) / 1800);
          const e = easeOutCubic(k);
          el.textContent = pre + fmt(Math.round(to * e));
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });

    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            wheel.classList.add(styles.isIn);
            countUp();
            obs.disconnect();
          }
        }
      },
      { threshold: 0.25 },
    );
    io.observe(wheel);

    const onPointerDown = (e: PointerEvent) => {
      drag = { x: e.clientX, rot };
      wheel.classList.add(styles.isDrag);
      wheel.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (drag) {
        const r = drag.rot + (e.clientX - drag.x) * 0.035;
        vel = r - rot;
        rot = r;
      }
    };
    const end = () => {
      drag = null;
      wheel.classList.remove(styles.isDrag);
    };
    wheel.addEventListener("pointerdown", onPointerDown, { passive: true });
    wheel.addEventListener("pointermove", onPointerMove, { passive: true });
    wheel.addEventListener("pointerup", end, { passive: true });
    wheel.addEventListener("pointercancel", end, { passive: true });

    // `s` and the pixel offset baked into `top` only ever depend on
    // window.innerWidth, never on scroll/drag/rotation — they were being
    // recomputed and rewritten every single frame even though they only
    // actually change on resize. Cached here and refreshed only on
    // resize; `top` (layout-triggering) is folded into the same
    // `transform: translate3d(...) scale(...) rotate(...)` the loop
    // already writes every frame, so the per-frame write is
    // compositor-only instead of forcing layout each frame.
    let scale = 1;
    let translateY = 0;
    const applyTransform = () => {
      ring.style.transform = `translateY(${translateY}px) scale(${scale}) rotate(${rot}deg)`;
    };
    const recomputeSizing = () => {
      const s = Math.min(1, window.innerWidth / 1440) * (window.innerWidth < 768 ? 0.8 : 1);
      scale = s;
      const remPx = (window.innerWidth < 768 ? 3 : 4.5) * 16; // rem → px, matches the CSS rem base
      translateY = remPx + 1500 * s;
      // Positioned immediately (mount + resize), independent of the rAF
      // loop, which is paused while the section is off-screen.
      applyTransform();
    };
    recomputeSizing();
    window.addEventListener("resize", recomputeSizing, { passive: true });

    let rafId: number;
    const loop = () => {
      if (onScreenRef.current) {
        const dy = window.scrollY - lastY;
        lastY = window.scrollY;
        if (!drag) {
          vel += dy * 0.004;
          vel *= 0.92;
          rot += (reduce ? 0 : -0.012) + vel;
        }
        applyTransform();
      }
      rafId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      io.disconnect();
      wheel.removeEventListener("pointerdown", onPointerDown);
      wheel.removeEventListener("pointermove", onPointerMove);
      wheel.removeEventListener("pointerup", end);
      wheel.removeEventListener("pointercancel", end);
      window.removeEventListener("resize", recomputeSizing);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section className={styles.wheel} data-wheel aria-label="What we build" ref={wheelRef}>
      <div className={styles.guide} aria-hidden="true" />
      <div className={styles.ring} ref={ringRef}>
        <RingTicks />
        {SLOTS.map((slot, i) => (
          <div
            className={styles.slot}
            style={{ transform: `rotate(${(i * SLOT_STEP).toFixed(1)}deg)` }}
            key={i}
          >
            <div className={styles.wcard} style={{ ["--d" as string]: slot.d }}>
              <div className={styles.wcardScreen}>{slot.card.screen}</div>
              <span className={styles.wcardTitle}>{slot.card.title}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
