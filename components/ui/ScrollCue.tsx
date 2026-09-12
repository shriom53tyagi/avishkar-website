"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";

/**
 * Down-arrow affordance pinned to the foot of a full-page section. Visible
 * only while its own section is the one dominating the viewport — driven by
 * an IntersectionObserver on a sentinel inside the section, not a global
 * scroll listener, so multiple instances on the page don't fight each other
 * or all show/hide in lockstep.
 *
 * Pinned to the viewport (`fixed`), not the section: on narrow screens a
 * section can be taller than the viewport, so a bottom-anchored-to-the-
 * section cue would sit far below the fold — invisible exactly when it's
 * meant to be read.
 *
 * Rendered as a real <button> rather than an anchor: it moves the viewport
 * rather than navigating, so it should not add a history entry or put a bare
 * fragment in the URL.
 */
export function ScrollCue({ targetId }: { targetId: string }) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    // The sentinel spans the whole section, but the threshold is a fraction
    // of the *viewport*, not of the sentinel — via a negative rootMargin
    // that shrinks the observer's effective viewport to a thin band around
    // its vertical centre. That band is reachable at any section height, so
    // this fires whenever the centre of the screen is inside the section,
    // instead of needing some fixed fraction of a (possibly viewport-sized-
    // or-taller) sentinel visible at once — which on a narrow screen, where a
    // section can be far taller than the viewport, a percentage-of-sentinel
    // threshold could never satisfy.
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0, rootMargin: "-45% 0px -45% 0px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  function scrollToTarget() {
    const el = document.getElementById(targetId);
    if (!el) return;
    el.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <>
      {/* Tracks whether this section is the one currently in view. */}
      <div ref={sentinelRef} aria-hidden className="pointer-events-none absolute inset-0" />

      <motion.button
        type="button"
        onClick={scrollToTarget}
        aria-label="Scroll to next section"
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        // Hidden instances must not be clickable or focusable.
        style={{ pointerEvents: active ? "auto" : "none" }}
        tabIndex={active ? 0 : -1}
        className="group fixed inset-x-0 bottom-4 z-30 mx-auto inline-flex w-fit flex-col items-center gap-1 rounded-full border border-line bg-canvas/90 px-4 py-2 text-ink-subtle shadow-card backdrop-blur-sm transition-colors hover:text-ink md:bottom-6 md:gap-1.5 md:rounded md:border-0 md:bg-transparent md:px-2 md:py-2 md:shadow-none md:backdrop-blur-none"
      >
        <span className="text-label uppercase tracking-[0.14em]">Scroll</span>
        <motion.span
          aria-hidden
          animate={reduce ? undefined : { y: [0, 5, 0] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </motion.button>
    </>
  );
}
