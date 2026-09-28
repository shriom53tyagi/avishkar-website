"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AvMark } from "./shared/AvMark";
import { readReducedMotion } from "./shared/useReducedMotion";
import { bez, easeOutQuart, clamp01 } from "./shared/easing";
import type { LatestInsight } from "../HomePage";
import styles from "./AvHomeLibrary.module.css";

/**
 * Library radial card slider — ported 1:1 from reference/avishkar-hero.html
 * `.lib` (CSS ~554-670, markup ~1077-1092, JS ~1421-1573).
 *
 * The reference's own code comment attributes the rotation/drag/reveal
 * mechanics to Osmo's "Radial Cards Slider" pattern; this ports THIS
 * file's own implementation (geometry constants, tween/ease functions,
 * reveal timing) verbatim, not a re-fetch of that external pattern.
 *
 * NOTE: the task brief describes "6 cards" here, but the reference
 * markup itself (read directly, line ~1086) has exactly 5 cards / 5 tabs
 * (Insights, The Avishkar Letter, Practice Audits, Playbooks,
 * Benchmarks) — ported as 5 to match the actual reference file, not the
 * brief's summary. Flagged in the final report as a brief/reference
 * inconsistency, not a deviation from the reference itself.
 *
 * Card 0 ("Insights") is wired to the real `latestInsights` prop passed
 * down from HomePage → app/page.tsx (DB-backed). The other four cards
 * (Letter/Audits/Playbooks/Benchmarks) have no real data source in this
 * codebase and keep the reference's mock content, each marked with a
 * TODO at its placeholder site.
 */

const EASE_IO = bez(0.65, 0.05, 0, 1);
const CARD_W = 576;
const CARD_H = 656;

type Geometry = { step: number; f: number; s: number; R: number };

function layoutFor(w: number): Geometry {
  const b = w <= 767 ? { step: 12, f: 4.75, s: 0.62 } : w <= 991 ? { step: 15, f: 4.25, s: 0.8 } : { step: 18, f: 3.75, s: Math.min(1, w / 1440) };
  return { ...b, R: CARD_W * b.f };
}

function ArcTicks({ g }: { g: Geometry }) {
  const r1 = g.R - CARD_H * 0.56;
  const r2 = r1 + 18;
  const D = g.R * 2;
  const count = 600;
  const lines: React.ReactNode[] = [];
  for (let k = 0; k < count; k++) {
    const a = (k / count) * Math.PI * 2;
    const x1 = (g.R + r1 * Math.sin(a)).toFixed(1);
    const y1 = (g.R - r1 * Math.cos(a)).toFixed(1);
    const x2 = (g.R + r2 * Math.sin(a)).toFixed(1);
    const y2 = (g.R - r2 * Math.cos(a)).toFixed(1);
    lines.push(<line key={k} x1={x1} y1={y1} x2={x2} y2={y2} />);
  }
  return (
    <svg
      className={styles.arcTicks}
      viewBox={`0 0 ${D} ${D}`}
      style={{ left: -g.R, top: -g.R, width: D, height: D }}
      aria-hidden="true"
    >
      {lines}
    </svg>
  );
}

const TABS = ["Insights", "The Avishkar Letter", "Practice Audits", "Playbooks", "Benchmarks"];

export function AvHomeLibrary({ latestInsights }: { latestInsights: LatestInsight[] }) {
  const libRef = useRef<HTMLElement>(null);
  const arcRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const curRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const onScreenRef = useRef(true);

  const [isIn, setIsIn] = useState(false);
  const [tabsIn, setTabsIn] = useState(false);
  const [tabsDone, setTabsDone] = useState(false);
  const [geometry, setGeometry] = useState<Geometry>(() =>
    layoutFor(typeof window === "undefined" ? 1440 : window.innerWidth),
  );

  const insightCard = latestInsights[0];

  useEffect(() => {
    const lib = libRef.current;
    if (!lib) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) onScreenRef.current = entry.isIntersecting;
      },
      { rootMargin: "200px" },
    );
    io.observe(lib);
    return () => io.disconnect();
  }, []);

  // Section-level entrance
  useEffect(() => {
    const lib = libRef.current;
    if (!lib) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsIn(true);
            timers.push(setTimeout(() => setTabsIn(true), 450));
            timers.push(setTimeout(() => setTabsDone(true), 1400));
            obs.disconnect();
          }
        }
      },
      { threshold: 0.2 },
    );
    io.observe(lib);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  // Geometry on resize
  useEffect(() => {
    const onResize = () => setGeometry(layoutFor(window.innerWidth));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const ring = ringRef.current;
    if (ring) {
      ring.style.transform = `scale(${geometry.s})`;
      ring.style.top = `calc(3rem + ${geometry.R * geometry.s}px)`;
    }
    cardRefs.current.forEach((c) => {
      if (c) c.style.top = -geometry.R + "px";
    });
  }, [geometry]);

  // drag + tween + reveal + active-state loop
  useEffect(() => {
    const arc = arcRef.current;
    const cur = curRef.current;
    if (!arc || !cur) return;
    const reduce = readReducedMotion();
    const n = 5; // number of cards, matches reference's actual 5 cards
    const wrap = (v: number) => (((v % n) + n + n / 2) % n) - n / 2;
    const mod = (v: number) => ((v % n) + n) % n;

    let pos = 0;
    let tween: { from: number; to: number; t0: number; dur: number; ease: (t: number) => number } | null = null;
    let drag: { x: number; pos: number; samples: { p: number; t: number }[] } | null = null;
    let active = -1;
    let moved = 0;
    let g = geometry;

    const tweenTo = (to: number, dur: number, ease: (t: number) => number) => {
      if (reduce) {
        pos = to;
        tween = null;
        return;
      }
      tween = { from: pos, to, t0: performance.now(), dur, ease };
    };
    const goTo = (i: number) => {
      const base = tween ? tween.to : Math.round(pos);
      const to = base + wrap(i - mod(base));
      tweenTo(to, 700 + Math.abs(to - pos) * 150, EASE_IO);
    };
    const step = (dir: number) => {
      const base = tween ? tween.to : Math.round(pos);
      tweenTo(base + dir, 800, EASE_IO);
    };

    const tabs = tabRefs.current.filter((t): t is HTMLButtonElement => !!t);
    const cards = cardRefs.current.filter((c): c is HTMLElement => !!c);
    const links = linkRefs.current;
    const slots = slotRefs.current.filter((s): s is HTMLDivElement => !!s);

    const tabClicks = tabs.map((t, i) => {
      const fn = () => goTo(i);
      t.addEventListener("click", fn);
      return fn;
    });
    const cardClicks = cards.map((c, i) => {
      const fn = (e: MouseEvent) => {
        if (moved > 6) {
          e.preventDefault();
          return;
        }
        if (i !== active) {
          e.preventDefault();
          goTo(i);
        }
      };
      c.addEventListener("click", fn as EventListener);
      return fn;
    });

    const prevBtn = arc.parentElement?.querySelector<HTMLButtonElement>('[data-arc-prev]');
    const nextBtn = arc.parentElement?.querySelector<HTMLButtonElement>('[data-arc-next]');
    const onPrev = () => step(-1);
    const onNext = () => step(1);
    prevBtn?.addEventListener("click", onPrev);
    nextBtn?.addEventListener("click", onNext);

    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      }
    };
    arc.addEventListener("keydown", onKeydown);

    const pxPerCard = () => g.R * g.s * g.step * (Math.PI / 180);
    const onEnter = () => arc.classList.add(styles.showCur);
    const onLeave = () => arc.classList.remove(styles.showCur);
    arc.addEventListener("pointerenter", onEnter);
    arc.addEventListener("pointerleave", onLeave);

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      tween = null;
      moved = 0;
      drag = { x: e.clientX, pos, samples: [{ p: pos, t: performance.now() }] };
      arc.classList.add(styles.isDrag);
      arc.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      const r = arc.getBoundingClientRect();
      cur.style.left = e.clientX - r.left + "px";
      cur.style.top = e.clientY - r.top + "px";
      if (!drag) return;
      moved = Math.max(moved, Math.abs(e.clientX - drag.x));
      pos = drag.pos - (e.clientX - drag.x) / pxPerCard();
      drag.samples.push({ p: pos, t: performance.now() });
      if (drag.samples.length > 6) drag.samples.shift();
    };
    const release = () => {
      if (!drag) return;
      const a = drag.samples[0];
      const b = drag.samples[drag.samples.length - 1];
      const v = b.t - a.t > 0 ? (b.p - a.p) / (b.t - a.t) : 0;
      const projected = pos + v * 380;
      const to = Math.round(projected);
      drag = null;
      arc.classList.remove(styles.isDrag);
      tweenTo(to, Math.min(1400, 600 + Math.abs(to - pos) * 160), easeOutQuart);
    };
    arc.addEventListener("pointerdown", onPointerDown);
    arc.addEventListener("pointermove", onPointerMove);
    arc.addEventListener("pointerup", release);
    arc.addEventListener("pointercancel", release);

    let revealT0: number | null = reduce ? -1e9 : null;
    const revealIo = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            revealT0 = performance.now();
            obs.disconnect();
          }
        }
      },
      { threshold: 0.3 },
    );
    revealIo.observe(arc);

    let rafId: number;
    const loop = (now: number) => {
      if (onScreenRef.current) {
        if (tween) {
          const k = Math.min(1, (now - tween.t0) / tween.dur);
          pos = tween.from + (tween.to - tween.from) * tween.ease(k);
          if (k >= 1) tween = null;
        }
        slots.forEach((sl, i) => {
          const d = wrap(i - pos);
          let r = 1;
          if (revealT0 === null) r = 0;
          else {
            const delay = Math.round(Math.abs(d)) * 90;
            r = EASE_IO(clamp01((now - revealT0 - delay) / 1100));
          }
          sl.style.transform = `rotate(${d * g.step * r}deg)`;
          sl.style.opacity = revealT0 === null ? "0" : String(Math.min(1, r * 5));
          sl.style.visibility = Math.abs(d) > 2.6 ? "hidden" : "visible";
          sl.style.zIndex = String(10 - Math.round(Math.abs(d) * 2));
          if (cards[i]) {
            cards[i].style.transform = r < 1 ? `translateY(${(1 - r) * 60}px) scale(${0.9 + 0.1 * r})` : "";
          }
        });
        const ticks = arc.querySelector<SVGSVGElement>(`.${styles.arcTicks}`);
        if (ticks) ticks.style.transform = `rotate(${-pos * g.step}deg)`;
        const a = mod(Math.round(pos));
        if (a !== active) {
          active = a;
          cards.forEach((c, i) => c.classList.toggle(styles.isActive, i === a));
          links.forEach((l, i) => {
            if (l) l.tabIndex = i === a ? 0 : -1;
          });
          tabs.forEach((t, i) => {
            t.classList.toggle(styles.isActive, i === a);
            t.setAttribute("aria-selected", String(i === a));
          });
        }
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      revealIo.disconnect();
      tabs.forEach((t, i) => t.removeEventListener("click", tabClicks[i]));
      cards.forEach((c, i) => c.removeEventListener("click", cardClicks[i] as EventListener));
      prevBtn?.removeEventListener("click", onPrev);
      nextBtn?.removeEventListener("click", onNext);
      arc.removeEventListener("keydown", onKeydown);
      arc.removeEventListener("pointerenter", onEnter);
      arc.removeEventListener("pointerleave", onLeave);
      arc.removeEventListener("pointerdown", onPointerDown);
      arc.removeEventListener("pointermove", onPointerMove);
      arc.removeEventListener("pointerup", release);
      arc.removeEventListener("pointercancel", release);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geometry]);

  const g = geometry;

  return (
    <section
      className={`${styles.lib} ${isIn ? styles.isIn : ""} ${tabsIn ? styles.tabsIn : ""} ${tabsDone ? styles.tabsDone : ""}`}
      id="insights"
      ref={libRef}
    >
      <div className={styles.guide} aria-hidden="true" />
      <h2 className={styles.title}>
        <span className={styles.ln}>
          <span>A growing library</span>
        </span>
        <span className={styles.ln}>
          <span>for modern practices</span>
        </span>
      </h2>
      <p className={styles.sub}>Everything we learn, in one place:</p>
      <div className={styles.tabsBar}>
        <div className={styles.tabs} role="tablist">
          {TABS.map((t, i) => (
            <button
              key={t}
              style={{ ["--t" as string]: i }}
              data-lib-tab
              role="tab"
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.arcWrap}>
        <div
          className={styles.arc}
          data-arc
          tabIndex={0}
          aria-label="Insights slider, use the left and right arrow keys"
          ref={arcRef}
        >
          <div className={styles.arcRing} ref={ringRef}>
            <ArcTicks g={g} />

            {/* Card 0: Insights — wired to real latestInsights data */}
            <div className={styles.arcSlot} ref={(el) => { slotRefs.current[0] = el; }}>
              <article
                className={`${styles.lcard} ${styles.lcardDark}`}
                ref={(el) => { cardRefs.current[0] = el; }}
              >
                <span className={styles.lcardTag}>
                  <span>From the</span>
                  <span>Insights</span>
                </span>
                <AvMark />
                <h3>Insights</h3>
                <p>Field notes on running a modern medspa: operations, tech and revenue.</p>
                <div className={styles.lcardVis} aria-hidden="true">
                  <div className={styles.fan}>
                    {[0, 1, 2, 3].map((i) => (
                      <i key={i} style={i % 3 === 0 ? { top: "1.5rem" } : { top: "0.5rem" }}>
                        <b style={{ width: "45%" }} />
                        <b style={{ width: "95%" }} />
                        <b style={{ width: "80%" }} />
                        <b style={{ width: "60%" }} />
                      </i>
                    ))}
                  </div>
                </div>
                {insightCard ? (
                  <Link href={`/insights/${insightCard.slug}`} className={styles.lcardBtn} ref={(el) => { linkRefs.current[0] = el; }}>
                    <span className={styles.roll}>
                      <span className={styles.rollIn}>
                        <span>Read insights</span>
                      </span>
                    </span>
                  </Link>
                ) : (
                  <Link href="/insights" className={styles.lcardBtn} ref={(el) => { linkRefs.current[0] = el; }}>
                    <span className={styles.roll}>
                      <span className={styles.rollIn}>
                        <span>Read insights</span>
                      </span>
                    </span>
                  </Link>
                )}
              </article>
            </div>

            {/* Card 1: The Avishkar Letter — mock, no real data source */}
            <div className={styles.arcSlot} ref={(el) => { slotRefs.current[1] = el; }}>
              <article
                className={`${styles.lcard} ${styles.lcardPurple}`}
                ref={(el) => { cardRefs.current[1] = el; }}
              >
                <span className={styles.lcardTag}>
                  <span>From the</span>
                  <span>Insights</span>
                </span>
                <AvMark />
                <h3 style={{ fontSize: "3.9rem" }}>The Avishkar Letter</h3>
                <p>One short email a month with what we&apos;re seeing across practices.</p>
                <div className={styles.lcardVis} aria-hidden="true">
                  <div className={styles.mailStack} />
                  <div className={styles.mail}>
                    <div className={styles.mailFrom}>
                      <i />
                      The Avishkar Letter
                    </div>
                    {/* TODO: placeholder subject line in the reference itself */}
                    <p className={styles.mailSubj}>[Issue title goes here]</p>
                    <b style={{ width: "92%" }} />
                    <b style={{ width: "80%" }} />
                    <b style={{ width: "86%" }} />
                    <b style={{ width: "50%" }} />
                  </div>
                </div>
                <a href="#" className={styles.lcardBtn} ref={(el) => { linkRefs.current[1] = el; }}>
                  <span className={styles.roll}>
                      <span className={styles.rollIn}>
                        <span>Subscribe</span>
                      </span>
                    </span>
                </a>
              </article>
            </div>

            {/* Card 2: Practice Audits — mock, no real data source */}
            <div className={styles.arcSlot} ref={(el) => { slotRefs.current[2] = el; }}>
              <article
                className={`${styles.lcard} ${styles.lcardLight}`}
                ref={(el) => { cardRefs.current[2] = el; }}
              >
                <span className={styles.lcardTag}>
                  <span>From the</span>
                  <span>Insights</span>
                </span>
                <AvMark />
                <h3 style={{ fontSize: "3.9rem" }}>Practice Audits</h3>
                <p>Teardowns of real practices&apos; stacks, and exactly what we&apos;d fix.</p>
                <div className={styles.lcardVis} aria-hidden="true">
                  <div className={styles.score}>
                    {/* TODO: mock audit grades in the reference itself — no real audit data source */}
                    {[
                      ["Booking", "82%", "B+"],
                      ["Follow-ups", "38%", "D"],
                      ["Phones", "55%", "C"],
                      ["Reviews", "90%", "A"],
                      ["Data flow", "30%", "D"],
                    ].map(([label, w, grade]) => (
                      <div key={label}>
                        {label}
                        <em style={{ ["--w" as string]: w }} />
                        <strong>{grade}</strong>
                      </div>
                    ))}
                  </div>
                </div>
                <a href="#" className={styles.lcardBtn} ref={(el) => { linkRefs.current[2] = el; }}>
                  <span className={styles.roll}>
                      <span className={styles.rollIn}>
                        <span>See an audit</span>
                      </span>
                    </span>
                </a>
              </article>
            </div>

            {/* Card 3: Playbooks — mock, no real data source */}
            <div className={styles.arcSlot} ref={(el) => { slotRefs.current[3] = el; }}>
              <article
                className={`${styles.lcard} ${styles.lcardLime}`}
                ref={(el) => { cardRefs.current[3] = el; }}
              >
                <span className={styles.lcardTag}>
                  <span>From the</span>
                  <span>Insights</span>
                </span>
                <AvMark />
                <h3>Playbooks</h3>
                <p>Step-by-step guides your front desk can use tomorrow.</p>
                <div className={styles.lcardVis} aria-hidden="true">
                  <div className={styles.checks}>
                    {/* TODO: placeholder step copy in the reference itself */}
                    {["[Playbook step one]", "[Playbook step two]", "[Playbook step three]", "[Playbook step four]"].map(
                      (step, k) => (
                        <div key={step}>
                          <i style={{ ["--k" as string]: k }} />
                          {step}
                        </div>
                      ),
                    )}
                  </div>
                </div>
                <a href="#" className={styles.lcardBtn} ref={(el) => { linkRefs.current[3] = el; }}>
                  <span className={styles.roll}>
                      <span className={styles.rollIn}>
                        <span>Get playbooks</span>
                      </span>
                    </span>
                </a>
              </article>
            </div>

            {/* Card 4: Benchmarks — mock, no real data source */}
            <div className={styles.arcSlot} ref={(el) => { slotRefs.current[4] = el; }}>
              <article
                className={`${styles.lcard} ${styles.lcardDark}`}
                ref={(el) => { cardRefs.current[4] = el; }}
              >
                <span className={styles.lcardTag}>
                  <span>From the</span>
                  <span>Insights</span>
                </span>
                <AvMark />
                <h3>Benchmarks</h3>
                <p>How your numbers compare on no-shows, rebooking and response time.</p>
                <div className={styles.lcardVis} aria-hidden="true">
                  <div className={styles.bench}>
                    {/* TODO: fabricated SVG benchmark coordinates in the reference itself */}
                    <svg viewBox="0 0 400 170" aria-hidden="true">
                      <line className="grid" x1="0" y1="40" x2="400" y2="40" />
                      <line className="grid" x1="0" y1="95" x2="400" y2="95" />
                      <line className="grid" x1="0" y1="150" x2="400" y2="150" />
                      <path className="avg" d="M0,120 C60,115 110,110 160,108 S280,100 400,96" />
                      <path
                        className="you"
                        pathLength={1}
                        d="M0,135 C50,128 90,112 140,100 S230,70 280,58 S360,36 400,28"
                      />
                    </svg>
                    <div className={styles.legend}>
                      <span style={{ color: "var(--color-lime)" }}>— Your practice</span>
                      <span>- - Industry avg</span>
                    </div>
                  </div>
                </div>
                <a href="#" className={styles.lcardBtn} ref={(el) => { linkRefs.current[4] = el; }}>
                  <span className={styles.roll}>
                      <span className={styles.rollIn}>
                        <span>Compare yours</span>
                      </span>
                    </span>
                </a>
              </article>
            </div>
          </div>
          <div className={styles.dragCur} ref={curRef} aria-hidden="true">
            Drag
          </div>
        </div>
        <div className={styles.arcNav}>
          <button data-arc-prev className="arcPrev" aria-label="Previous">
            <svg viewBox="0 0 16 16">
              <path d="M13 8H3M7 4L3 8l4 4" />
            </svg>
          </button>
          <button data-arc-next className="arcNext" aria-label="Next">
            <svg viewBox="0 0 16 16">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
