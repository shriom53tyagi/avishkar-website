"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import styles from "./ArticlePage.module.css";

/**
 * Article page — ported 1:1 from reference/avishkar-article.html
 * (`.progress`, `.art-hero`, `.cover`, `.art-body`/`.toc`/`.share`,
 * `.prose`, `.related`).
 *
 * The reference's `.prose` sample blocks (paragraphs, h2, list, link,
 * blockquote, figure+caption, callout) only demonstrate styling — the
 * real article body renders from `article.bodyHtml` via
 * `dangerouslySetInnerHTML`, with each top-level block given the
 * reference's `.reveal` stagger-in treatment by a DOM pass after render
 * (matching the reference's own `.prose .reveal` markup, which is
 * generated the same way server-side there). No callout is invented —
 * the reference's `.callout` styling in ArticlePage.module.css only
 * applies if a real article's body_html happens to contain a
 * `.callout`-classed element already; the data model has no such field
 * today, so none renders unless present in real content.
 *
 * The reference has no equivalent of this page's existing "Want this
 * framework applied to your practice?" mid-page CTA — kept per the task
 * instruction, styled with the page's own patterns (see .cta below).
 */

export type ArticleSection = {
  id: string;
  heading: string;
};

export type ArticleSource = {
  sourceTitle: string;
  sourceUrl: string;
};

export type RelatedPost = {
  slug: string;
  cat: string;
  read: string;
  title: string;
  date: string;
};

export type Article = {
  slug: string;
  title: string;
  kicker: string;
  readTimeMinutes: number;
  dek: string;
  heroImageUrl: string;
  heroImageAlt: string;
  heroImageTagChipText: string | null;
  bylineName: string;
  date: string;
  sections: ArticleSection[];
  sources: ArticleSource[];
  bodyHtml: string;
};

function readReducedMotion() {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function ArticlePage({
  article,
  related,
  basePath = "/insights",
  backLabel = "All insights",
}: {
  article: Article;
  related: RelatedPost[];
  /** Route the article lives under; drives the back link and share URL. */
  basePath?: string;
  backLabel?: string;
}) {
  const [isIn, setIsIn] = useState(false);
  const [activeTocId, setActiveTocId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [revealedRelated, setRevealedRelated] = useState<Set<string>>(new Set());

  const proseRef = useRef<HTMLDivElement>(null);
  const coverImgWrapRef = useRef<HTMLDivElement>(null);
  const relatedRef = useRef<HTMLDivElement>(null);
  // Written directly every rAF frame instead of through React state — the
  // progress value only ever feeds one inline `transform: scaleX()`, so
  // driving it via setState was forcing a full component re-render 60
  // times a second for a change React never needed to know about.
  const progressBarRef = useRef<HTMLDivElement>(null);

  const shareUrl = `${SITE_URL}${basePath}/${article.slug}`;

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

  // Keep --header-h in sync with the shared navbar's real height (the
  // progress bar sits just below it, matching the reference's fixed nav
  // offset).
  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    const setVar = () => {
      document.documentElement.style.setProperty(
        "--header-h",
        `${header.getBoundingClientRect().height}px`,
      );
    };
    setVar();
    const ro = new ResizeObserver(setVar);
    ro.observe(header);
    return () => ro.disconnect();
  }, []);

  // Reading progress + gentle cover parallax — reference's un-gated
  // rAF loop, but paused while the prose column is off-screen.
  useEffect(() => {
    const prose = proseRef.current;
    if (!prose) return;
    const reduce = readReducedMotion();
    let onScreen = true;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => (onScreen = e.isIntersecting)),
      {
        rootMargin: "600px",
      },
    );
    io.observe(prose);

    // `prose`'s position/height only change on scroll or resize, not
    // every frame — cached and re-measured only on those events instead
    // of a forced-layout read on every rAF tick.
    let proseTop = prose.getBoundingClientRect().top;
    let proseHeight = prose.getBoundingClientRect().height;
    const remeasure = () => {
      const r = prose.getBoundingClientRect();
      proseTop = r.top;
      proseHeight = r.height;
    };
    window.addEventListener("scroll", remeasure, { passive: true });
    window.addEventListener("resize", remeasure, { passive: true });

    let rafId: number;
    const loop = () => {
      if (onScreen) {
        const p = Math.min(1, Math.max(0, (window.innerHeight * 0.5 - proseTop) / proseHeight));
        if (progressBarRef.current) progressBarRef.current.style.transform = `scaleX(${p})`;
        if (!reduce && coverImgWrapRef.current) {
          coverImgWrapRef.current.style.setProperty(
            "--cs",
            String(1 + Math.min(window.scrollY, 800) / 8000),
          );
        }
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

  // Give each top-level prose block the reference's `.reveal` stagger-in
  // treatment, then observe them to rise in as they scroll into view.
  useEffect(() => {
    const prose = proseRef.current;
    if (!prose) return;
    const blocks = [...prose.children] as HTMLElement[];
    blocks.forEach((el) => el.classList.add(styles.reveal));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, k) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            setTimeout(() => el.classList.add(styles.isIn), k * 80);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12 },
    );
    blocks.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [article.bodyHtml]);

  // Related cards rise in as they scroll into view.
  useEffect(() => {
    const container = relatedRef.current;
    if (!container) return;
    const cards = [...container.querySelectorAll<HTMLElement>("[data-slug]")];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, k) => {
          if (entry.isIntersecting) {
            const slug = (entry.target as HTMLElement).dataset.slug;
            if (!slug) return;
            setTimeout(() => setRevealedRelated((prev) => new Set(prev).add(slug)), k * 80);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [related]);

  // Table of contents follows the section being read.
  useEffect(() => {
    if (article.sections.length === 0) return;
    const spy = () => {
      let cur: string | null = null;
      for (const s of article.sections) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top < window.innerHeight * 0.35) cur = s.id;
      }
      setActiveTocId(cur);
    };
    window.addEventListener("scroll", spy, { passive: true });
    spy();
    return () => window.removeEventListener("scroll", spy);
  }, [article.sections]);

  const onCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // ignore — clipboard may be unavailable
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <main className={`${styles.art} ${isIn ? styles.isIn : ""}`} data-article-page>
      <div className={styles.progress}>
        <div
          className={styles.progressBar}
          ref={progressBarRef}
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      <header className={styles.hero}>
        <Link href={basePath} className={`${styles.back} ${styles.fade}`}>
          <svg viewBox="0 0 16 16">
            <path d="M13 8H3M7 4L3 8l4 4" />
          </svg>
          {backLabel}
        </Link>
        <p className={`${styles.meta} ${styles.fade}`} style={{ ["--d" as string]: ".1s" }}>
          <span className={styles.mDark}>{article.kicker}</span>
          <span>{article.readTimeMinutes} min read</span>
          <span>{article.date}</span>
        </p>
        <h1 className={styles.title}>
          <span className={styles.ln}>
            <span>{article.title}</span>
          </span>
        </h1>
        <p className={`${styles.dek} ${styles.fade}`} style={{ ["--d" as string]: ".4s" }}>
          {article.dek}
        </p>
      </header>

      {article.heroImageUrl && (
        <div className={styles.cover} ref={coverImgWrapRef}>
          <Image
            src={article.heroImageUrl}
            alt={article.heroImageAlt || article.title}
            fill
            sizes="(max-width: 900px) 100vw, 1176px"
            priority
            style={{ objectFit: "cover" }}
          />
          {article.heroImageTagChipText && (
            <span className={styles.coverTag}>{article.heroImageTagChipText}</span>
          )}
        </div>
      )}

      <div className={styles.body}>
        <aside className={styles.toc}>
          {article.sections.length > 0 && (
            <>
              <p>On this page</p>
              <ol>
                {article.sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className={activeTocId === s.id ? styles.isOn : ""}>
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </>
          )}
          <div className={styles.share}>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on LinkedIn"
            >
              <svg viewBox="0 0 24 24">
                <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.1c0-1.22-.02-2.78-1.7-2.78-1.7 0-1.96 1.33-1.96 2.7V21h-4z" />
              </svg>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on X"
            >
              <svg viewBox="0 0 24 24">
                <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77zm-1.08 16.2h1.7L7.4 4.73H5.58z" />
              </svg>
            </a>
            <button
              type="button"
              onClick={onCopyLink}
              className={copied ? styles.copied : ""}
              aria-label="Copy link"
            >
              <svg viewBox="0 0 24 24">
                <path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" />
              </svg>
            </button>
          </div>
        </aside>

        <div
          className={styles.prose}
          ref={proseRef}
          dangerouslySetInnerHTML={{ __html: article.bodyHtml }}
        />
      </div>

      {article.sources.length > 0 && (
        <div
          className={styles.body}
          style={{ paddingTop: 0, gridTemplateColumns: "17rem minmax(0, 44rem) 1fr" }}
        >
          <div />
          <div>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                textTransform: "uppercase",
                color: "#8a8683",
              }}
            >
              Sources
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginTop: 14,
                fontSize: 14,
              }}
            >
              {article.sources.map((s) => (
                <a
                  key={s.sourceUrl}
                  href={s.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#4E5654" }}
                >
                  {s.sourceTitle}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/*
        Existing "Want this framework applied..." CTA — not in the
        reference, kept per the task instruction and styled with the
        page's own patterns.
      */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2>Want this framework applied to your practice?</h2>
          <p>
            We&apos;ll walk your stack with you and come back with a keep / connect / build map.
            Thirty minutes, no deck.
          </p>
          <Link href="/contact" className={styles.ctaBtn}>
            Talk to Avishkar
          </Link>
        </div>
      </section>

      {related.length > 0 && (
        <section className={styles.related}>
          <div className={styles.relatedHead}>
            <h2>Keep reading</h2>
            <Link href="/insights">All insights →</Link>
          </div>
          <div className={styles.cards} ref={relatedRef}>
            {related.map((r) => (
              <Link
                href={`/insights/${r.slug}`}
                key={r.slug}
                data-slug={r.slug}
                className={`${styles.icard} ${revealedRelated.has(r.slug) ? styles.isIn : ""}`}
              >
                <div className={styles.meta}>
                  <span>{r.cat}</span>
                  <span>{r.read}</span>
                </div>
                <h3>
                  <span>{r.title}</span>
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
