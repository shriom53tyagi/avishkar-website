"use client";

import { useEffect, useRef, useState } from "react";
import { readReducedMotion } from "./shared/useReducedMotion";
import { clamp01, easeOutCubic } from "./shared/easing";
import { isValidEmail, submitEarlyAccess } from "@/lib/early-access";
import styles from "./AvHomeOval.module.css";
import { Roll } from "../Roll";

/**
 * "Early access" oval — ported 1:1 from reference/avishkar-hero.html
 * `.oval-wrap` (CSS ~459-551, markup ~1040-1075, JS ~1381-1419).
 *
 * The submit handler now calls the same submitEarlyAccess()/
 * /api/early-access path the Insights page newsletter form already uses
 * (lib/early-access.ts) — a submitted email is validated and, if SES is
 * configured, emailed to the team (see app/api/early-access/route.ts).
 * `isDone` only flips to the reference's "You're on the list." state once
 * that call actually succeeds, not on every submit.
 */

type Slide = {
  tag0: string;
  tag1: string;
  training?: boolean;
  h3: string;
  cat: string;
  vis: React.ReactNode;
};

const SLIDES: Slide[] = [
  {
    tag0: "Indexed",
    tag1: "Learns from",
    h3: "Practice knowledge & protocols",
    cat: "Treatments · SOPs · consent",
    vis: (
      <div className={styles.vis}>
        <i className="ln" style={{ width: "55%" }} />
        <i className="ln" style={{ width: "90%" }} />
        <i className="ln" style={{ width: "80%" }} />
        <i className="ln hi" />
        <i className="ln" style={{ width: "70%" }} />
        <i className="ln" style={{ width: "85%" }} />
      </div>
    ),
  },
  {
    tag0: "Indexed",
    tag1: "Learns from",
    h3: "Operational workflows",
    cat: "Front desk · handoffs · follow-ups",
    vis: (
      <div className={`${styles.vis} ${styles.visFlow}`}>
        <b className="on" />
        <em />
        <b />
        <em />
        <b />
      </div>
    ),
  },
  {
    tag0: "Training",
    tag1: "Learns from",
    training: true,
    h3: "Patient interaction patterns",
    cat: "Calls · messages · reviews",
    vis: (
      <div className={`${styles.vis} ${styles.visChat}`}>
        <span className={`${styles.bub} in`}>Can I move my filler appointment?</span>
        <span className={`${styles.bub} out`}>Yes, Thursday 3pm works.</span>
        <span className={styles.typing}>
          <i style={{ ["--k" as string]: 0 }} />
          <i style={{ ["--k" as string]: 1 }} />
          <i style={{ ["--k" as string]: 2 }} />
        </span>
      </div>
    ),
  },
  {
    tag0: "Training",
    tag1: "Learns from",
    training: true,
    h3: "Scheduling & revenue signals",
    cat: "Bookings · no-shows · rebooking",
    vis: (
      <div className={`${styles.vis} ${styles.visBars}`}>
        {[
          { h: 40, k: 0, l: false },
          { h: 62, k: 1, l: false },
          { h: 50, k: 2, l: false },
          { h: 78, k: 3, l: false },
          { h: 58, k: 4, l: false },
          { h: 92, k: 5, l: true },
          { h: 70, k: 6, l: false },
        ].map((b) => (
          <i
            key={b.k}
            className={b.l ? "l" : ""}
            style={{ ["--h" as string]: `${b.h}%`, ["--k" as string]: b.k }}
          />
        ))}
      </div>
    ),
  },
];

export function AvHomeOval() {
  const ovalRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLElement>(null);
  const [isIn, setIsIn] = useState(false);
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState(-1);
  const [resetting, setResetting] = useState<number | null>(null);
  const [isDone, setIsDone] = useState(false);
  const [email, setEmail] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitPending, setSubmitPending] = useState(false);
  const onScreenRef = useRef(true);
  const curRef = useRef(0);
  curRef.current = cur;

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

  // Shape morph (desktop only, continuous rAF). `oval`'s position only
  // actually changes on scroll or resize, not every frame, so its rect is
  // cached and re-measured only on those events instead of read on every
  // rAF tick.
  useEffect(() => {
    const oval = ovalRef.current;
    if (!oval) return;
    const reduce = readReducedMotion();
    let ovalTop = oval.getBoundingClientRect().top;
    const remeasure = () => {
      ovalTop = oval.getBoundingClientRect().top;
    };
    window.addEventListener("scroll", remeasure, { passive: true });
    window.addEventListener("resize", remeasure, { passive: true });

    let rafId: number;
    const shape = () => {
      if (onScreenRef.current && window.innerWidth > 900) {
        const p = reduce
          ? 1
          : easeOutCubic(clamp01((window.innerHeight - ovalTop) / (window.innerHeight * 1.1)));
        oval.style.clipPath = `ellipse(${36 + 14 * p}% ${46 + 4 * p}% at 50% 50%)`;
      }
      rafId = requestAnimationFrame(shape);
    };
    shape();
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", remeasure);
      window.removeEventListener("resize", remeasure);
    };
  }, []);

  // Entrance
  useEffect(() => {
    const oval = ovalRef.current;
    if (!oval) return;
    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsIn(true);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.15 },
    );
    io.observe(oval);
    return () => io.disconnect();
  }, []);

  // Slide auto-advance — only ticks while the section is on screen.
  useEffect(() => {
    const reduce = readReducedMotion();
    if (reduce) return;
    const timer = setInterval(() => {
      if (onScreenRef.current) go(curRef.current + 1);
    }, 4000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cur]);

  const go = (n: number) => {
    const next = ((n % SLIDES.length) + SLIDES.length) % SLIDES.length;
    if (next === curRef.current) return;
    const oldCur = curRef.current;
    setPrev(oldCur);
    setCur(next);
    // the slide that is neither new active nor old active: reset without animating
    const untouched = SLIDES.map((_, i) => i).filter((i) => i !== next && i !== oldCur);
    if (untouched.length) {
      setResetting(untouched[0]);
      requestAnimationFrame(() => setResetting(null));
    }
  };

  return (
    <section className={styles.ovalWrap} id="early-access" ref={wrapRef}>
      <div className={`${styles.oval} ${isIn ? styles.isIn : ""}`} data-oval ref={ovalRef}>
        <span className={styles.badgeLive}>
          <i />
          In training · Early access
        </span>
        <h2>
          We&apos;re building <em>intelligence</em>
          <br />
          for aesthetics.
        </h2>
        <p className={styles.lead}>
          We&apos;re training a model specifically around the workflows and needs of aesthetic
          practices, medspas, and wellness businesses: the vocabulary, the protocols, the
          operational reality.
        </p>

        <div className={styles.learn}>
          <span className={styles.learnLabel}>What it learns from</span>
          <div className={styles.learnView}>
            {SLIDES.map((s, i) => {
              const classes = [styles.slide];
              if (i === cur) classes.push(styles.isActive);
              if (i === prev && i !== cur) classes.push(styles.isPrev);
              return (
                <article
                  className={classes.join(" ")}
                  key={i}
                  style={resetting === i ? { transition: "none" } : undefined}
                >
                  <div className={styles.slideBody}>
                    <div className={styles.tags}>
                      <span>{s.tag0}</span>
                      <span className={s.training ? "training" : ""}>{s.tag1}</span>
                    </div>
                    <h3>{s.h3}</h3>
                    <span className={styles.slideCat}>{s.cat}</span>
                  </div>
                  <div className={styles.slideVis} aria-hidden="true">
                    {s.vis}
                  </div>
                </article>
              );
            })}
          </div>
          <div className={styles.learnSide}>
            <div className={styles.dashes}>
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  className={i === cur ? styles.isActive : ""}
                  aria-label={`Show item ${i + 1}`}
                  onClick={() => go(i)}
                />
              ))}
            </div>
            <button className={styles.nextBtn} aria-label="Next" onClick={() => go(cur + 1)}>
              <svg viewBox="0 0 16 16">
                <path d="M8 3v10M4 9l4 4 4-4" />
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.model}>
          <p className={styles.modelTag}>Avishkar model</p>
          <p className={styles.modelTitle}>Domain intelligence for practice teams</p>
          <div className={styles.modelBar} aria-hidden="true">
            <i />
          </div>
          <p className={styles.modelNote}>
            Private by design · practice data never trains other practices
          </p>
        </div>

        <div className={`${styles.early} ${isDone ? styles.isDone : ""}`}>
          <p>
            <b>Want to be an early adopter?</b> Join the early-access list and we&apos;ll let you
            know when the model is ready to experience.
          </p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const next = email.trim();
              if (!isValidEmail(next)) {
                setSubmitError("Enter a valid work email.");
                return;
              }
              setSubmitError("");
              setSubmitPending(true);
              const result = await submitEarlyAccess(next);
              setSubmitPending(false);
              if (!result.ok) {
                setSubmitError(result.error);
                return;
              }
              setIsDone(true);
            }}
          >
            <label className="sr-only" htmlFor="early-email">
              Work email
            </label>
            <input
              id="early-email"
              type="email"
              required
              placeholder="you@yourpractice.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (submitError) setSubmitError("");
              }}
            />
            <button
              className={`${styles.btn} ${styles.btnJoin}`}
              type="submit"
              disabled={submitPending}
            >
              <Roll>{submitPending ? "Sending…" : "Join the early access list"}</Roll>
            </button>
          </form>
          {submitError && <p className={styles.earlyError}>{submitError}</p>}
          <small>No newsletter. One note when there&apos;s something real to try.</small>
          <p className="done">You&apos;re on the list.</p>
        </div>

        <p className={styles.script} aria-hidden="true">
          Be the first to try it!
        </p>
      </div>
    </section>
  );
}
