"use client";

import { useEffect, useRef } from "react";
import { readReducedMotion } from "./shared/useReducedMotion";
import { clamp01, easeOutCubic } from "./shared/easing";
import styles from "./AvHomeIntro.module.css";

/**
 * Intro section (statement word-lighting + Play/Reel + film lightbox) —
 * ported 1:1 from reference/avishkar-hero.html `.intro` + sibling `.film`
 * (CSS ~398-456, markup ~1014-1038, JS ~1294-1336).
 *
 * TODO: `.reel__meta` description and the `01:38` runtime are placeholder
 * copy in the reference itself — kept verbatim below, see inline TODOs.
 * TODO: `avishkar-film.mp4` does not exist in /public (only
 * /public/hero-demo.mp4, a different asset) — kept as the reference's
 * exact `src`, not silently swapped, per task instructions.
 */

const STATEMENT =
  "Avishkar is the technology partner for medspas and clinics. We connect the tools you already pay for, so your data moves on its own and your team gets back to patients.";

function DialTicks({ dialRef }: { dialRef: React.RefObject<SVGSVGElement | null> }) {
  const lines: React.ReactNode[] = [];
  const cx = 304,
    cy = 304;
  const r1 = 290,
    r2 = 304;
  const count = 84;
  for (let k = 0; k < count; k++) {
    const a = (k / count) * Math.PI * 2;
    const x1 = (cx + r1 * Math.sin(a)).toFixed(1);
    const y1 = (cy - r1 * Math.cos(a)).toFixed(1);
    const x2 = (cx + r2 * Math.sin(a)).toFixed(1);
    const y2 = (cy - r2 * Math.cos(a)).toFixed(1);
    lines.push(<line key={k} x1={x1} y1={y1} x2={x2} y2={y2} />);
  }
  return (
    <svg className={styles.reelDial} viewBox="0 0 608 608" aria-hidden="true" ref={dialRef} data-dial-svg>
      {lines}
    </svg>
  );
}

export function AvHomeIntro() {
  const introRef = useRef<HTMLElement>(null);
  const statementRef = useRef<HTMLParagraphElement>(null);
  const reelRef = useRef<HTMLDivElement>(null);
  const dialRef = useRef<SVGSVGElement>(null);
  const lRef = useRef<HTMLSpanElement>(null);
  const rRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLButtonElement>(null);
  const noteRef = useRef<HTMLDivElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const onScreenRef = useRef(true);

  useEffect(() => {
    const intro = introRef.current;
    if (!intro) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) onScreenRef.current = entry.isIntersecting;
      },
      { rootMargin: "200px" },
    );
    io.observe(intro);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const statement = statementRef.current;
    const reel = reelRef.current;
    const dial = dialRef.current;
    const L = lRef.current;
    const R = rRef.current;
    const card = cardRef.current;
    const note = noteRef.current;
    if (!statement || !reel || !dial || !L || !R || !card || !note) return;

    const reduce = readReducedMotion();
    const words = [...statement.querySelectorAll<HTMLElement>("span")];

    let rafId: number;
    const update = () => {
      if (onScreenRef.current) {
        const vh = window.innerHeight;
        const sr = statement.getBoundingClientRect();
        const sp = reduce ? 1 : clamp01((vh * 0.85 - sr.top) / (sr.height + vh * 0.35));
        const lit = Math.round(sp * words.length);
        words.forEach((w, i) => w.classList.toggle(styles.lit, i < lit));

        const rr = reel.getBoundingClientRect();
        const p = reduce ? 1 : easeOutCubic(clamp01((vh - rr.top) / (vh * 0.9)));
        const off = (1 - p) * 18;
        L.style.transform = `translate(${-off}vw, -50%)`;
        R.style.transform = `translate(${off}vw, -50%)`;
        L.style.opacity = R.style.opacity = String(p);
        card.style.transform = `scale(${0.8 + 0.2 * p})`;
        dial.style.transform = `rotate(${(vh - rr.top) * 0.06}deg)`;
        if (p > 0.9) note.classList.add(styles.isIn);
      }
      rafId = requestAnimationFrame(update);
    };
    update();

    // film lightbox
    const film = filmRef.current;
    const video = videoRef.current;
    const close = () => {
      film?.classList.remove(styles.isOpen);
      video?.pause();
    };
    const onCardClick = () => {
      film?.classList.add(styles.isOpen);
      video?.play().catch(() => {});
    };
    const closeBtn = film?.querySelector<HTMLButtonElement>("[data-film-close]");
    const onFilmClick = (e: MouseEvent) => {
      if (e.target === film) close();
    };
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    card.addEventListener("click", onCardClick);
    closeBtn?.addEventListener("click", close);
    film?.addEventListener("click", onFilmClick);
    window.addEventListener("keydown", onKeydown);

    return () => {
      cancelAnimationFrame(rafId);
      card.removeEventListener("click", onCardClick);
      closeBtn?.removeEventListener("click", close);
      film?.removeEventListener("click", onFilmClick);
      window.removeEventListener("keydown", onKeydown);
    };
  }, []);

  return (
    <>
      <section className={styles.intro} data-intro ref={introRef}>
        <div className={styles.guide} aria-hidden="true" />
        <p className={styles.statement} ref={statementRef}>
          {STATEMENT.split(" ").map((w, i) => (
            <span key={i}>{w} </span>
          ))}
        </p>

        <div className={styles.reel} ref={reelRef}>
          <div className={styles.reelLine} aria-hidden="true" />
          <DialTicks dialRef={dialRef} />
          <span className={`${styles.reelWord} ${styles.reelWordL}`} ref={lRef} aria-hidden="true">
            Play
          </span>
          <span className={`${styles.reelWord} ${styles.reelWordR}`} ref={rRef} aria-hidden="true">
            Reel
          </span>
          <button
            className={styles.reelCard}
            ref={cardRef}
            aria-label="Play the Avishkar film"
          >
            <span className={styles.reelMeta}>
              <span>Avishkar · Film</span>
              {/* TODO: placeholder copy in the reference itself — replace with real film description */}
              <span>[Short line about the film, placeholder copy you can change later.]</span>
            </span>
            <span className={styles.reelRow}>
              <span>
                Avishkar in action
                <b />
              </span>
              {/* TODO: placeholder runtime in the reference itself — replace with the real film length */}
              <time>01:38</time>
            </span>
            <span className={styles.reelStrip} aria-hidden="true">
              {Array.from({ length: 8 }).map((_, i) => (
                <i key={i} />
              ))}
            </span>
          </button>
          <div className={styles.note} ref={noteRef} aria-hidden="true">
            <svg viewBox="0 0 56 56">
              <path pathLength={1} d="M52 48 C 30 50, 12 38, 8 8 M8 8 L 3 17 M8 8 L 14 15" />
            </svg>
            <span>See what it can do!</span>
          </div>
        </div>
      </section>

      <div className={styles.film} ref={filmRef} role="dialog" aria-modal="true" aria-label="Avishkar film">
        <button className={styles.filmClose} data-film-close>
          Close
        </button>
        {/* TODO: avishkar-film.mp4 does not exist in /public — reference's exact src kept verbatim, not silently swapped for /hero-demo.mp4 */}
        <video ref={videoRef} controls playsInline preload="none" src="/avishkar-film.mp4" />
      </div>
    </>
  );
}
