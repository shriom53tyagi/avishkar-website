"use client";

import { useEffect, useRef, useState } from "react";
import { ClipboardList, CalendarClock, Receipt, ShieldCheck } from "lucide-react";
import styles from "./WhatWeDoPage.module.css";

/**
 * What we do page — ported 1:1 from reference/avishkar-what-we-do.html
 * (`.wd-hero`, `.svc`/`.sv` service cards, `.film-sec`/`.stage`/`.player`).
 *
 * The reference's service cards use inline hand-drawn SVG icons; this
 * page keeps its own existing lucide-react icons instead (ClipboardList/
 * CalendarClock/Receipt/ShieldCheck) per the task's "keep each card's
 * existing icon" instruction — same icon in both the small tile and the
 * large faded corner copy.
 *
 * The reference's video player is a dashed "Your existing video"
 * placeholder; this page's real, existing video (/hero-demo.mp4) goes
 * inside unchanged. No poster image exists for it, so (matching the
 * reference's own fallback) the browser's default first-frame preview is
 * used — no `poster` attribute is invented.
 *
 * The page has no content below the video section today (confirmed
 * against the previous components/sections/WhatWeDo.tsx, which ended
 * right after its video), so nothing else needed porting there.
 */

const CARDS = [
  {
    id: "operational-audit",
    icon: ClipboardList,
    title: "Operational audit",
    description:
      "A fixed-scope, read-only review of your EMR, billing, and scheduling that quantifies exactly where revenue is leaking — before anything is automated.",
    live: false,
    variant: styles.svDark,
  },
  {
    id: "patient-access-agent",
    icon: CalendarClock,
    title: "Patient access agent",
    description:
      "Scheduling and voice AI that reduces no-shows and keeps your calendar full, deployed only where the audit shows it pays off.",
    live: true,
    variant: styles.svPurple,
  },
  {
    id: "revenue-recovery-agent",
    icon: Receipt,
    title: "Revenue recovery agent",
    description:
      "Billing and insurance automation that cuts denial rates and captures revenue your team doesn't have time to chase.",
    live: true,
    variant: styles.svLime,
  },
  {
    id: "security-compliance",
    icon: ShieldCheck,
    title: "Security & compliance",
    description:
      "HIPAA-aligned, read-only by default, with a human in the loop at every step. Your data stays yours.",
    live: false,
    variant: styles.svLight,
  },
] as const;

function readReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function WhatWeDoPage() {
  const [isIn, setIsIn] = useState(false);
  const [svcIn, setSvcIn] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<string | null>(null);

  const svcRef = useRef<HTMLElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Page entrance (double-rAF, matching the reference).
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

  // Service cards reveal once on entry.
  useEffect(() => {
    const el = svcRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setSvcIn(true);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Player grows from 0.88 to 1 scale as it scrolls into view. Paused
  // while the player itself is off-screen, cleaned up on unmount.
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    const reduce = readReducedMotion();
    if (reduce) return;

    let onScreen = true;
    const io = new IntersectionObserver((entries) => entries.forEach((e) => (onScreen = e.isIntersecting)), {
      rootMargin: "400px",
    });
    io.observe(player);

    // `player`'s position only changes on scroll or resize, not every
    // frame — cached and re-measured only on those events instead of a
    // forced-layout read on every rAF tick. The player's own scale
    // (`--vs`) doesn't move its box (transform-origin is pinned to the
    // bottom edge), so this stays accurate across the animation.
    let playerTop = player.getBoundingClientRect().top;
    const remeasure = () => {
      playerTop = player.getBoundingClientRect().top;
    };
    window.addEventListener("scroll", remeasure, { passive: true });
    window.addEventListener("resize", remeasure, { passive: true });

    let rafId: number;
    const loop = () => {
      if (onScreen) {
        const p = Math.min(1, Math.max(0, (window.innerHeight - playerTop) / (window.innerHeight * 0.8)));
        player.style.setProperty("--vs", String(0.88 + 0.12 * (1 - Math.pow(1 - p, 3))));
      }
      rafId = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      window.removeEventListener("scroll", remeasure);
      window.removeEventListener("resize", remeasure);
    };
  }, []);

  // Real duration from the video's own metadata once loaded.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onLoaded = () => setDuration(formatDuration(video.duration));
    video.addEventListener("loadedmetadata", onLoaded);
    if (video.readyState >= 1 && video.duration) setDuration(formatDuration(video.duration));
    return () => video.removeEventListener("loadedmetadata", onLoaded);
  }, []);

  const startPlayback = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    const video = videoRef.current;
    if (video) {
      video.controls = true;
      video.play().catch(() => {});
    }
  };

  return (
    <main className={`${styles.wd} ${isIn ? styles.isIn : ""}`} data-wd>
      <div className={styles.guide} aria-hidden="true" />

      <section className={styles.hero}>
        <p className={`${styles.eyebrow} ${styles.fade}`}>
          <span>What we do</span>
          <span>Audit first</span>
        </p>
        <h1 className={styles.title}>
          {["Diagnose first.", "Deploy only where it pays."].map((line, i) => (
            <span className={styles.ln} key={i}>
              <span>{line}</span>
            </span>
          ))}
        </h1>
        <p className={`${styles.lead} ${styles.fade}`} style={{ ["--d" as string]: ".35s" }}>
          Every engagement starts with a structured audit, not a sales pitch for automation. Agents are switched on
          only once the numbers prove they&apos;re worth it.
        </p>
      </section>

      <section
        className={`${styles.svc} ${svcIn ? styles.isIn : ""}`}
        data-svc
        ref={svcRef as React.RefObject<HTMLElement>}
      >
        <div className={styles.svcGrid}>
          {CARDS.slice(0, 2).map((c, i) => (
            <ServiceCard card={c} index={i} key={c.id} />
          ))}
        </div>
        <div className={`${styles.svcGrid} ${styles.svcGridRow2}`}>
          {CARDS.slice(2, 4).map((c, i) => (
            <ServiceCard card={c} index={i + 2} key={c.id} />
          ))}
        </div>
      </section>

      <section className={styles.filmSec}>
        <div className={styles.filmHead}>
          <h2>See where the money goes</h2>
          <p>Watch the film</p>
        </div>
        <div className={styles.stage}>
          <div
            className={`${styles.player} ${isPlaying ? styles.isPlaying : ""}`}
            ref={playerRef}
            role="button"
            tabIndex={0}
            aria-label="Play the film"
            onClick={startPlayback}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                startPlayback();
              }
            }}
          >
            <video ref={videoRef} playsInline preload="metadata" aria-label="Avishkar AI product demo">
              <source src="/hero-demo.mp4" type="video/mp4" />
            </video>
            {!isPlaying && (
              <span className={styles.play} aria-hidden="true">
                Play
              </span>
            )}
          </div>
          <div className={styles.stageBar}>
            <span>
              <i />
              Avishkar
            </span>
            <b>{duration ?? "—"}</b>
          </div>
        </div>
        <p className={styles.filmNote} aria-hidden="true">
          Hit play!
        </p>
      </section>
    </main>
  );
}

function ServiceCard({
  card,
  index,
}: {
  card: (typeof CARDS)[number];
  index: number;
}) {
  const Icon = card.icon;
  return (
    <article className={`${styles.sv} ${card.variant}`} style={{ ["--i" as string]: index }}>
      <span className={styles.svBig} aria-hidden="true">
        <Icon strokeWidth={1.2} />
      </span>
      <div className={styles.svTop}>
        <span className={styles.svIcon} aria-hidden="true">
          <Icon strokeWidth={1.6} />
        </span>
        {card.id === "operational-audit" && <span className={styles.steptag}>Where every engagement starts</span>}
        {card.live && (
          <span className={styles.livetag}>
            <i />
            Live
          </span>
        )}
      </div>
      <h2>{card.title}</h2>
      <p>{card.description}</p>
    </article>
  );
}
