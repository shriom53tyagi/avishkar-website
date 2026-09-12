"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

/**
 * The site's only entrance animation: an 8px rise and fade, once, on enter.
 *
 * Two safety nets, because content must never depend on motion to be
 * readable: the `reveal` class is forced visible under `prefers-reduced-motion`
 * and under `<noscript>` (see globals.css). Both are handled in CSS rather
 * than by branching here — `useReducedMotion` is null during SSR, so a branch
 * would render different markup on the server and fail hydration.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  y = 8,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px -8% 0px" });

  return (
    <motion.div
      ref={ref}
      className={className ? `reveal ${className}` : "reveal"}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.34, delay, ease: [0.2, 0.9, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}
