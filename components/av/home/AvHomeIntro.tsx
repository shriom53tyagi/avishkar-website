"use client";

import { useEffect, useRef, useState } from "react";
import { readReducedMotion } from "./shared/useReducedMotion";
import { clamp01, easeOutCubic } from "./shared/easing";
import styles from "./AvHomeIntro.module.css";

/**
 * Intro section (statement word-lighting + Play/Reel + film lightbox) —
 * ported 1:1 from reference/avishkar-hero.html `.intro` + sibling `.film`
 * (CSS ~398-456, markup ~1014-1038, JS ~1294-1336).
 *
 * The card preview and the lightbox both play /hero-demo.mp4 (the same
 * file the What we do page uses); the runtime is read from its metadata.
 */

const FILM_SRC = "/hero-demo.mp4";

function formatDuration(sec: number): string {
  const total = Math.round(sec);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

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
    <svg
      className={styles.reelDial}
      viewBox="0 0 608 608"
      aria-hidden="true"
      ref={dialRef}
      data-dial-svg
    >
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
  const previewRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState<string | null>(null);
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

    // `statement`/`reel`'s position and size only change on scroll or
    // resize, not every frame — both cached and re-measured only on those
    // events instead of two forced-layout reads on every rAF tick.
    let statementTop = statement.getBoundingClientRect().top;
    let statementHeight = statement.getBoundingClientRect().height;
    let reelTop = reel.getBoundingClientRect().top;
    const remeasure = () => {
      const sr = statement.getBoundingClientRect();
      statementTop = sr.top;
      statementHeight = sr.height;
      reelTop = reel.getBoundingClientRect().top;
    };
    window.addEventListener("scroll", remeasure, { passive: true });
    window.addEventListener("resize", remeasure, { passive: true });

    let rafId: number;
    const update = () => {
      if (onScreenRef.current) {
        const vh = window.innerHeight;
        const sp = reduce ? 1 : clamp01((vh * 0.85 - statementTop) / (statementHeight + vh * 0.35));
        const lit = Math.round(sp * words.length);
        words.forEach((w, i) => w.classList.toggle(styles.lit, i < lit));

        const p = reduce ? 1 : easeOutCubic(clamp01((vh - reelTop) / (vh * 0.9)));
        const off = (1 - p) * 18;
        L.style.transform = `translate(${-off}vw, -50%)`;
        R.style.transform = `translate(${off}vw, -50%)`;
        L.style.opacity = R.style.opacity = String(p);
        card.style.transform = `scale(${0.8 + 0.2 * p})`;
        dial.style.transform = `rotate(${(vh - reelTop) * 0.06}deg)`;
        if (p > 0.9) note.classList.add(styles.isIn);
      }
      rafId = requestAnimationFrame(update);
    };
    update();

    // film lightbox
    const film = filmRef.current;
    const video = videoRef.current;
    const preview = previewRef.current;
    let cardVisible = false;
    let filmOpen = false;
    const syncPreview = () => {
      if (!preview || reduce) return;
      if (cardVisible && !filmOpen) preview.play().catch(() => {});
      else preview.pause();
    };
    const previewIo = new IntersectionObserver((entries) => {
      for (const entry of entries) cardVisible = entry.isIntersecting;
      syncPreview();
    });
    previewIo.observe(card);
    // reduced motion: no autoplay, just show the first frame
    const onPreviewMeta = () => {
      if (!preview) return;
      setDuration(formatDuration(preview.duration));
      if (reduce) preview.currentTime = 0.001;
    };
    preview?.addEventListener("loadedmetadata", onPreviewMeta);
    if (preview && preview.readyState >= 1) onPreviewMeta();

    const close = () => {
      film?.classList.remove(styles.isOpen);
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
      filmOpen = false;
      syncPreview();
    };
    const onCardClick = () => {
      filmOpen = true;
      syncPreview();
      film?.classList.add(styles.isOpen);
      if (video) {
        video.currentTime = 0;
        video.muted = false;
        video.play().catch(() => {});
      }
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
      window.removeEventListener("scroll", remeasure);
      window.removeEventListener("resize", remeasure);
      previewIo.disconnect();
      preview?.removeEventListener("loadedmetadata", onPreviewMeta);
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
          <button className={styles.reelCard} ref={cardRef} aria-label="Play the Avishkar film">
            <video
              className={styles.reelVideo}
              ref={previewRef}
              src={FILM_SRC}
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              tabIndex={-1}
            />
            <span className={styles.reelShade} aria-hidden="true" />
            <span className={styles.reelMeta}>
              <span>Avishkar · Film</span>
              <span>
                A one-minute look at how Avishkar connects the tools your clinic already uses.
              </span>
            </span>
            <span className={styles.reelRow}>
              <span>
                Avishkar in action
                <b />
              </span>
              <time>{duration}</time>
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

      <div
        className={styles.film}
        ref={filmRef}
        role="dialog"
        aria-modal="true"
        aria-label="Avishkar film"
      >
        <button className={styles.filmClose} data-film-close>
          Close
        </button>
        <video ref={videoRef} controls playsInline preload="none" src={FILM_SRC} />
      </div>
    </>
  );
}
