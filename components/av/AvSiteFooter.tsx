"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./AvSiteFooter.module.css";
import { Roll } from "./Roll";
import { submitSubscribe } from "@/lib/early-access";

/**
 * Site-wide footer — ported 1:1 from reference/avishkar-hero.html `.foot`
 * (CSS ~783-845, markup ~1143-1184, JS ~1576-1609 — the footer-specific
 * part of the combined CTA+footer IIFE). Rendered once, in AvPageShell, on
 * every route except the homepage (which composes it itself, in the same
 * position the reference's own `.foot` sits at the end of the page).
 *
 * Moved here from components/av/home/AvHomeFooter.tsx so it's shared
 * across every page instead of homepage-only — the design is unchanged.
 *
 * Newsletter submit posts to /api/subscribe, then shows the `.is-done` state.
 *
 * Footer nav links: pointed at real routes where one exists in this
 * codebase (about, agents, careers, contact, how-we-work, insights,
 * privacy, results, security, terms, what-we-do); every other `href="#"`
 * from the reference is kept as a plain anchor with a TODO, not silently
 * invented.
 */

export function AvSiteFooter() {
  const footRef = useRef<HTMLElement>(null);
  const bigmarkRef = useRef<HTMLDivElement>(null);
  const [isDone, setIsDone] = useState(false);
  const [nlError, setNlError] = useState("");
  const [nlPending, setNlPending] = useState(false);
  const [bigmarkIn, setBigmarkIn] = useState(false);

  useEffect(() => {
    const big = bigmarkRef.current;
    if (!big) return;
    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setBigmarkIn(true);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.2 },
    );
    io.observe(big);
    return () => io.disconnect();
  }, []);

  return (
    <footer className={`${styles.foot} ${isDone ? styles.isDone : ""}`} data-foot ref={footRef}>
      <div className={styles.top}>
        <div>
          <h4>Subscribe to The Avishkar Letter</h4>
          <form
            className={styles.nl}
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const data = new FormData(form);
              setNlError("");
              setNlPending(true);
              const result = await submitSubscribe(String(data.get("email") ?? ""), String(data.get("firstName") ?? ""));
              setNlPending(false);
              if (result.ok) setIsDone(true);
              else setNlError(result.error);
            }}
          >
            <label className="sr-only" htmlFor="nl-name">
              First name
            </label>
            <input id="nl-name" name="firstName" type="text" placeholder="First name" required />
            <label className="sr-only" htmlFor="nl-email">
              Email
            </label>
            <input id="nl-email" name="email" type="email" placeholder="yourname@practice.com" required />
            <button className={styles.btn} type="submit" disabled={nlPending}>
              <Roll>Get updates</Roll>
            </button>
            <label className={styles.nlAgree}>
              <input type="checkbox" required />
              <span>
                I agree to the <Link href="/privacy">Privacy Policy</Link>
              </span>
            </label>
          </form>
          {nlError && (
            <p role="alert" style={{ marginTop: "0.75rem", fontSize: "0.875rem", color: "var(--color-coral)" }}>
              {nlError}
            </p>
          )}
          <p className={styles.nlDone}>Amazing, you&apos;re on the list.</p>
        </div>
        <div>
          <div className={styles.cols}>
            <div>
              <h5>Product</h5>
              <ul>
                {/* TODO: no routes for Lead generation / Intelligence yet */}
                <li>
                  <Link href="/what-we-do">Platform</Link>
                </li>
                <li>
                  <a href="#">Lead generation</a>
                </li>
                <li>
                  <a href="#">Intelligence</a>
                </li>
                <li>
                  <Link href="/integrations">Integrations</Link>
                </li>
              </ul>
            </div>
            <div>
              <h5>Insights</h5>
              <ul>
                <li>
                  <Link href="/insights">Articles</Link>
                </li>
                {/* TODO: no Playbooks route yet */}
                <li>
                  <Link href="/letter">The Avishkar Letter</Link>
                </li>
                <li>
                  <Link href="/audits">Practice audits</Link>
                </li>
                <li>
                  <a href="#">Playbooks</a>
                </li>
              </ul>
            </div>
            <div>
              <h5>Company</h5>
              <ul>
                <li>
                  <Link href="/about">About us</Link>
                </li>
                {/* TODO: "Case studies" has no dedicated route; /results is the closest existing page */}
                <li>
                  <Link href="/results">Case studies</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.actions}>
            <div className={styles.pair}>
              <Link href="/#early-access" className={`${styles.btn} ${styles.btnDark}`}>
                <Roll>Early Access</Roll>
              </Link>
              <Link href="/contact" className={`${styles.btn} ${styles.btnCoral}`}>
                <Roll>Book a demo</Roll>
              </Link>
            </div>
            <div className={styles.social}>
              <a href="https://www.linkedin.com/company/avishkarai/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24">
                  <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.1c0-1.22-.02-2.78-1.7-2.78-1.7 0-1.96 1.33-1.96 2.7V21h-4z" />
                </svg>
              </a>
              <a href="https://www.instagram.com/avishkar.app/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24">
                  <path d="M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm4.9-8.95a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2zM12 2.5c-2.6 0-2.9 0-3.9.06-3.5.16-5.4 2.06-5.54 5.54C2.5 9.1 2.5 9.4 2.5 12s0 2.9.06 3.9c.16 3.48 2.06 5.38 5.54 5.54 1 .06 1.3.06 3.9.06s2.9 0 3.9-.06c3.47-.16 5.39-2.06 5.54-5.54.06-1 .06-1.3.06-3.9s0-2.9-.06-3.9c-.15-3.47-2.06-5.38-5.54-5.54-1-.06-1.3-.06-3.9-.06zm0 1.7c2.55 0 2.85 0 3.85.06 2.6.12 3.8 1.35 3.93 3.93.05 1 .05 1.3.05 3.81s0 2.85-.05 3.85c-.12 2.57-1.33 3.8-3.93 3.93-1 .05-1.3.05-3.85.05s-2.85 0-3.85-.05c-2.6-.12-3.8-1.36-3.93-3.93-.05-1-.06-1.3-.06-3.85s0-2.84.06-3.85C4.34 5.6 5.55 4.37 8.15 4.26c1-.05 1.3-.06 3.85-.06z" />
                </svg>
              </a>
              <a href="#" aria-label="X">
                <svg viewBox="0 0 24 24">
                  <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77zm-1.08 16.2h1.7L7.4 4.73H5.58z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.bigmark} ${bigmarkIn ? styles.isIn : ""}`} ref={bigmarkRef} aria-hidden="true">
        <div className={styles.bigmarkClip}>
          <div className={styles.bigmarkTrack}>
            <span>Avishkar</span>
            <span>Avishkar</span>
            <span>Avishkar</span>
            <span>Avishkar</span>
          </div>
        </div>
      </div>

      <div className={styles.bar}>
        <div className={styles.pills}>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          {/* TODO: no /cookies route in this codebase */}
          <a href="#">Cookies</a>
        </div>
        <span>© 2026 Avishkar AI</span>
        <div>
          Technology partner for
          <span className={`${styles.pills} ${styles.pillsPurple}`}>
            <span>Medspas</span>
            <span>Clinics</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
