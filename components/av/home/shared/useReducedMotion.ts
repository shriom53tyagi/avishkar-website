"use client";

import { useEffect, useState } from "react";

/**
 * Wraps `matchMedia('(prefers-reduced-motion: reduce)')`, replacing the six
 * duplicated inline `matchMedia(...).matches` reads in
 * reference/avishkar-hero.html's per-section IIFEs.
 *
 * Returns `false` on the very first render (server + first client paint,
 * before effects run) so SSR output is deterministic, then updates
 * synchronously-enough (via an effect) before any rAF loop reads it — every
 * consumer here only reads the value inside effects/rAF callbacks, never
 * during render, so this initial mismatch never reaches the DOM.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/** Non-hook helper for one-off reads inside effects/rAF setup (e.g. before first render of a loop). */
export function readReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
