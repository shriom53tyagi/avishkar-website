"use client";

/**
 * Ported 1:1 from reference/navbar.html (locked source of truth for look,
 * animation and markup). Content — the actual links — is this site's real
 * routes; slots with no matching page are marked TODO instead of invented.
 * See AvNavbar.module.css for the ported styles.
 */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./AvNavbar.module.css";
import { cn } from "@/lib/utils";

/** Text that duplicates on hover and slides up 50% (the reference's "roll"). */
function Roll({ children }: { children: string }) {
  return (
    <span className={styles.roll}>
      <span className={styles.rollIn}>
        <span>{children}</span>
        <span>{children}</span>
      </span>
    </span>
  );
}

export type LatestInsightLink = {
  slug: string;
  title: string;
};

/**
 * One group's worth of "New insight: <title> ✱" items. The reference repeats
 * its 3 sample titles to 6 items per group so the marquee never gaps at
 * --closed-w; we do the same by cycling the real list up to that same
 * minimum instead of hardcoding a count.
 */
const MIN_ITEMS_PER_GROUP = 6;

function buildStripItems(insights: LatestInsightLink[]): LatestInsightLink[] {
  if (insights.length === 0) return [];
  const items: LatestInsightLink[] = [];
  while (items.length < MIN_ITEMS_PER_GROUP) {
    items.push(...insights);
  }
  return items;
}

function StripGroup({
  items,
  hidden,
}: {
  items: LatestInsightLink[];
  hidden: boolean;
}) {
  return (
    <div className={styles.stripGroup} aria-hidden={hidden || undefined}>
      {items.map((insight, i) => (
        <Link
          key={`${insight.slug}-${i}`}
          href={`/insights/${insight.slug}`}
          className={styles.stripItem}
          tabIndex={hidden ? -1 : undefined}
        >
          <span>New insight: {insight.title}</span>
          <span className={styles.stripStar} aria-hidden="true">
            ✱
          </span>
        </Link>
      ))}
    </div>
  );
}

export function AvNavbar({ latestInsights = [] }: { latestInsights?: LatestInsightLink[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const stripItems = buildStripItems(latestInsights);
  const latestInsight = latestInsights[0] ?? null;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        ref={navRef}
        className={cn(styles.nav, open && styles.isOpen)}
        data-nav
      >
        <div className={styles.navBox}>
          <div className={styles.bar}>
            <button
              type="button"
              className={styles.toggle}
              aria-expanded={open}
              aria-controls="av-nav-panel"
              onClick={() => setOpen((v) => !v)}
            >
              <span className={styles.burger} aria-hidden="true">
                <i />
                <i />
              </span>
              <Roll>Menu</Roll>
              <span className={styles.srOnly}>Toggle menu</span>
            </button>

            <Link href="/" className={styles.logo} aria-label="Avishkar home">
              Avishkar
            </Link>

            <div className={styles.actions}>
              <Link href="/#early-access" className={cn(styles.btn, styles.btnLogin)}>
                <Roll>Early Access</Roll>
              </Link>
              <Link href="/contact" className={cn(styles.btn, styles.btnJoin)}>
                <Roll>Book a demo</Roll>
              </Link>
            </div>
          </div>

          <div className={styles.panel} id="av-nav-panel">
            <div className={styles.panelClip}>
              <nav className={styles.panelGrid} aria-label="Main">
                <div className={cn(styles.card, styles.reveal)} style={{ "--i": 0 } as React.CSSProperties}>
                  <p className={styles.label}>Our products</p>
                  <ul className={styles.links}>
                    <li>
                      <Link href="/what-we-do">
                        <Roll>What we do</Roll>
                      </Link>
                    </li>
                    <li>
                      <Link href="/#why">
                        <Roll>Why Avishkar</Roll>
                      </Link>
                    </li>
                    <li>
                      <Link href="/agents">
                        <Roll>Agents</Roll>
                      </Link>
                      <span className={styles.badge}>NEW</span>
                    </li>
                    <li>
                      <Link href="/how-we-work">
                        <Roll>How we work</Roll>
                      </Link>
                    </li>
                  </ul>
                  <div className={styles.sublinks}>
                    <Link href="/results">Case studies</Link>
                    <Link href="/results">Results</Link>
                  </div>
                </div>

                <div className={cn(styles.col, styles.reveal)} style={{ "--i": 1 } as React.CSSProperties}>
                  <p className={styles.label}>Explore</p>
                  <ul className={styles.links}>
                    <li>
                      <Link href="/insights">
                        <Roll>Insights</Roll>
                      </Link>
                    </li>
                    <li>
                      <Link href="/about">
                        <Roll>About us</Roll>
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact">
                        <Roll>Contact</Roll>
                      </Link>
                    </li>
                  </ul>
                  <div className={styles.socials}>
                    <a href="https://www.linkedin.com/company/avishkarai/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                      <svg viewBox="0 0 24 24">
                        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.1c0-1.22-.02-2.78-1.7-2.78-1.7 0-1.96 1.33-1.96 2.7V21h-4z" />
                      </svg>
                    </a>
                    {/* TODO: no Instagram account yet — placeholder from the reference. */}
                    <a href="#" aria-label="Instagram (TODO: no account yet)">
                      <svg viewBox="0 0 24 24">
                        <path d="M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm4.9-8.95a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2zM12 2.5c-2.6 0-2.9 0-3.9.06-3.5.16-5.4 2.06-5.54 5.54C2.5 9.1 2.5 9.4 2.5 12s0 2.9.06 3.9c.16 3.48 2.06 5.38 5.54 5.54 1 .06 1.3.06 3.9.06s2.9 0 3.9-.06c3.47-.16 5.39-2.06 5.54-5.54.06-1 .06-1.3.06-3.9s0-2.9-.06-3.9c-.15-3.47-2.06-5.38-5.54-5.54-1-.06-1.3-.06-3.9-.06zm0 1.7c2.55 0 2.85 0 3.85.06 2.6.12 3.8 1.35 3.93 3.93.05 1 .05 1.3.05 3.81s0 2.85-.05 3.85c-.12 2.57-1.33 3.8-3.93 3.93-1 .05-1.3.05-3.85.05s-2.85 0-3.85-.05c-2.6-.12-3.8-1.36-3.93-3.93-.05-1-.06-1.3-.06-3.85s0-2.84.06-3.85C4.34 5.6 5.55 4.37 8.15 4.26c1-.05 1.3-.06 3.85-.06z" />
                      </svg>
                    </a>
                    {/* TODO: no X/Twitter account yet — placeholder from the reference. */}
                    <a href="#" aria-label="X (TODO: no account yet)">
                      <svg viewBox="0 0 24 24">
                        <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77zm-1.08 16.2h1.7L7.4 4.73H5.58z" />
                      </svg>
                    </a>
                  </div>
                </div>

                <div className={cn(styles.card, styles.feature, styles.reveal)} style={{ "--i": 2 } as React.CSSProperties}>
                  <p className={styles.tag}>
                    <span>Latest</span>
                    <span>Insight</span>
                  </p>
                  <h3>{latestInsight ? latestInsight.title : "Read our latest thinking"}</h3>
                  <div className={styles.art} aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </div>
                  <Link href={latestInsight ? `/insights/${latestInsight.slug}` : "/insights"} className={styles.more}>
                    <Roll>Read more</Roll>
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </div>

        {stripItems.length > 0 && (
          <div className={styles.strip} aria-label="Latest insights">
            <div className={styles.stripTrack}>
              <StripGroup items={stripItems} hidden={false} />
              <StripGroup items={stripItems} hidden />
            </div>
          </div>
        )}
      </header>
      <div className={styles.scrim} onClick={() => setOpen(false)} aria-hidden="true" />
    </>
  );
}
