"use client";

import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

/**
 * Wraps the "IntersectionObserver → add class once → disconnect" pattern
 * duplicated ~8 times across reference/avishkar-hero.html's section IIFEs
 * (hero stage, wheel, oval, library, library tabs, why, cta, footer
 * bigmark). Returns a ref to attach to the observed element and a boolean
 * that flips to `true` the first time it becomes intersecting, then never
 * changes again (the observer disconnects, exactly like the reference).
 */
export function useOnceVisible<T extends Element>(
  threshold: number,
): { ref: RefObject<T | null>; isVisible: boolean } {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            io.disconnect();
          }
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

/**
 * The allowed behavioral addition (not in the reference): pause/resume a
 * section's continuous rAF loops / intervals while its root element is
 * off-screen, without changing anything about the animation's timeline
 * once visible again. Unlike `useOnceVisible`, this observer never
 * disconnects — it keeps reporting visibility changes for the section's
 * lifetime.
 */
export function useIsOnScreen<T extends Element>(
  rootMargin = "200px",
): { ref: RefObject<T | null>; onScreen: boolean } {
  const ref = useRef<T | null>(null);
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setOnScreen(entry.isIntersecting);
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return { ref, onScreen };
}
