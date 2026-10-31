"use client";

import { useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Wraps each word of a plain-text headline in its own span so it can blur-in
 * on entry (see `.w`/`.live .w`/`@keyframes word` in globals.css). Renders
 * the exact same text — only word boundaries gain markup, nothing is added,
 * removed, or reworded.
 */
export function Words({ children, className }: { children: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();

  if (reduce) {
    return <span className={className}>{children}</span>;
  }

  const words = children.split(/(\s+)/);

  return (
    <span ref={ref} className={cn(inView && "live", className)}>
      {words.map((part, i) =>
        part.trim() === "" ? (
          part
        ) : (
          <span key={i} className="w" style={{ animationDelay: `${90 + i * 68}ms` }}>
            {part}
          </span>
        ),
      )}
    </span>
  );
}
