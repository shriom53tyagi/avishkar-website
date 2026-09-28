"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { isValidEmail, submitEarlyAccess } from "@/lib/early-access";
import styles from "./InsightsPage.module.css";

/**
 * Insights index — ported 1:1 from reference/avishkar-insights.html
 * (`.ins-hero`, `.filters`/`.ftabs`/`.search`, `.feat`, `.cards`/`.icard`).
 *
 * The reference's `.ph` colored placeholder swatches stand in for a real
 * cover image; every article here has a real `heroImageUrl`, so `next/image`
 * renders the real cover in their place. The reference's static article
 * counter/6-card placeholder grid is replaced by this page's existing
 * live filter/search logic, now driving the reference's animation.
 */

export type Post = {
  slug: string;
  title: string;
  cat: string;
  read: string;
  date: string;
  art: string;
  dek: string;
  img: string;
};

export type FeaturedPost = Post & {
  bylineName: string;
};

const CATS = ["All", "Operations", "Patient experience", "Growth", "AI in aesthetics", "Technology", "Wellness"];

function readReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function InsightsPage({ posts, featured }: { posts: Post[]; featured: FeaturedPost | null }) {
  const [isIn, setIsIn] = useState(false);
  const [cat, setCat] = useState("All");
  const [query, setQuery] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribeError, setSubscribeError] = useState("");
  const [subscribePending, setSubscribePending] = useState(false);

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

  const q = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      posts.filter(
        (p) => (cat === "All" || p.cat === cat) && (!q || (p.title + " " + p.dek + " " + p.cat).toLowerCase().includes(q)),
      ),
    [posts, cat, q],
  );
  const showFeature = cat === "All" && !q && !!featured;
  const totalCount = posts.length + (featured ? 1 : 0);

  // Grid cards rise in as they scroll into view (reference: threshold .15,
  // staggered by 90ms). Runs once per card.
  const gridRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const hasVisibleCards = filtered.length > 0;
  useEffect(() => {
    const container = gridRef.current;
    if (!container) return;
    const cards = [...container.querySelectorAll<HTMLElement>("[data-slug]")];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, k) => {
          if (entry.isIntersecting) {
            const slug = (entry.target as HTMLElement).dataset.slug;
            if (!slug) return;
            setTimeout(() => setRevealed((prev) => new Set(prev).add(slug)), k * 90);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [hasVisibleCards]);

  // Filter/search change: fade the leaving cards out, then swap the set.
  const [leavingSlugs, setLeavingSlugs] = useState<Set<string>>(new Set());
  const applyFilter = (nextCat: string, nextQuery: string) => {
    const reduce = readReducedMotion();
    if (reduce) {
      setCat(nextCat);
      setQuery(nextQuery);
      return;
    }
    const nq = nextQuery.trim().toLowerCase();
    const leaving = new Set(
      posts
        .filter((p) => !((nextCat === "All" || p.cat === nextCat) && (!nq || (p.title + " " + p.dek + " " + p.cat).toLowerCase().includes(nq))))
        .map((p) => p.slug),
    );
    setLeavingSlugs(leaving);
    setTimeout(() => {
      setCat(nextCat);
      setQuery(nextQuery);
      setLeavingSlugs(new Set());
    }, 280);
  };

  const searchTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const onSearchChange = (value: string) => {
    setQuery(value);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => applyFilter(cat, value), 180);
  };

  useEffect(() => () => clearTimeout(searchTimer.current), []);

  const onSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = email.trim();
    if (!isValidEmail(next)) {
      setSubscribeError("Enter a valid work email.");
      return;
    }
    setSubscribeError("");
    setSubscribePending(true);
    const result = await submitEarlyAccess(next);
    setSubscribePending(false);
    if (!result.ok) {
      setSubscribeError(result.error);
      return;
    }
    setSubscribed(true);
  };

  return (
    <main className={`${styles.ins} ${isIn ? styles.isIn : ""}`} data-insights-page>
      <div className={styles.guide} aria-hidden="true" />

      <section className={styles.hero}>
        <p className={`${styles.eyebrow} ${styles.fade}`}>
          <span>Insights</span>
          <span>{totalCount} articles</span>
        </p>
        <h1 className={styles.title}>
          {["Insights for the", "modern practice."].map((line, i) => (
            <span className={styles.ln} key={i}>
              <span>{line}</span>
            </span>
          ))}
        </h1>
        <p className={`${styles.lead} ${styles.fade}`} style={{ ["--d" as string]: ".35s" }}>
          Field notes on aesthetics, medspa operations, wellness, and the technology underneath, written by the
          people building it, for the people running the practice.
        </p>
        <p className={`${styles.note} ${styles.script}`} aria-hidden="true">
          <span>
            Fresh from
            <br />
            the field!
          </span>
        </p>
      </section>

      <div className={`${styles.filters} ${styles.fade}`} style={{ ["--d" as string]: ".5s" }}>
        <div className={styles.ftabs} role="tablist" aria-label="Filter by topic">
          {CATS.map((name) => (
            <button
              type="button"
              key={name}
              className={cat === name ? styles.isActive : ""}
              aria-pressed={cat === name}
              onClick={() => applyFilter(name, query)}
            >
              {name}
            </button>
          ))}
        </div>
        <label className={styles.search}>
          <span className={styles.srOnly}>Search insights</span>
          <svg viewBox="0 0 16 16">
            <circle cx="7" cy="7" r="5" />
            <path d="M11 11l3.5 3.5" />
          </svg>
          <input
            type="search"
            placeholder="Search insights"
            value={query}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </label>
      </div>

      <div className={styles.body}>
        {showFeature && featured && (
          <Link href={`/insights/${featured.slug}`} className={`${styles.feat} ${styles.fade}`} style={{ ["--d" as string]: ".6s" }}>
            <div className={styles.featImg}>
              <Image src={featured.img} alt="" fill sizes="(max-width: 900px) 100vw, 560px" style={{ objectFit: "cover" }} />
            </div>
            <div className={styles.featBody}>
              <div className={styles.meta}>
                <span className={styles.mLime}>Featured</span>
                <span className={styles.mDark}>{featured.cat}</span>
                <span className={styles.mDark}>{featured.read}</span>
              </div>
              <h2>{featured.title}</h2>
              <p>{featured.dek}</p>
              <span className={styles.read}>
                Read the article
                <svg viewBox="0 0 16 16">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </span>
            </div>
          </Link>
        )}

        <div className={styles.gridHead}>
          <h2>Latest insights</h2>
          <span>
            {filtered.length} {filtered.length === 1 ? "article" : "articles"}
          </span>
        </div>

        <div className={styles.cards} ref={gridRef}>
          {posts.map((p) => {
            const nq = query.trim().toLowerCase();
            const matches = (cat === "All" || p.cat === cat) && (!nq || (p.title + " " + p.dek + " " + p.cat).toLowerCase().includes(nq));
            const isLeaving = leavingSlugs.has(p.slug);
            if (!matches && !isLeaving) return null;
            return (
              <Link
                href={`/insights/${p.slug}`}
                key={p.slug}
                data-slug={p.slug}
                className={`${styles.icard} ${revealed.has(p.slug) ? styles.isIn : ""} ${isLeaving ? styles.isOut : ""}`}
              >
                <div className={styles.cardImg}>
                  <Image src={p.img} alt="" fill sizes="(max-width: 900px) 100vw, 380px" style={{ objectFit: "cover" }} />
                  <span className={styles.cardArrow}>
                    <svg viewBox="0 0 16 16">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </span>
                </div>
                <div className={styles.meta}>
                  <span>{p.cat}</span>
                  <span>{p.read}</span>
                </div>
                <h3>
                  <span>{p.title}</span>
                </h3>
                <p>{p.dek}</p>
              </Link>
            );
          })}
        </div>

        <div className={`${styles.empty} ${filtered.length === 0 ? styles.show : ""}`}>
          <p>Nothing here yet.</p>
          <p>Try another topic or a different search.</p>
        </div>

        <div className={styles.subscribe}>
          <div>
            <h2>One considered note a month. Nothing else.</h2>
            <p>Operations, technology, and what we&apos;re learning building for aesthetic practices.</p>
          </div>
          {!subscribed ? (
            <div className={styles.subForm}>
              <form onSubmit={onSubscribe}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (subscribeError) setSubscribeError("");
                  }}
                  placeholder="you@yourpractice.com"
                />
                <button type="submit" disabled={subscribePending}>
                  {subscribePending ? "Sending…" : "Subscribe"}
                </button>
              </form>
              {subscribeError && <div className={styles.subError}>{subscribeError}</div>}
            </div>
          ) : (
            <div className={styles.subDone}>Subscribed. Next issue goes out at the start of the month.</div>
          )}
        </div>
      </div>
    </main>
  );
}
