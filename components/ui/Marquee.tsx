"use client";

import type { ReactNode } from "react";

/**
 * Auto-scrolling marquee strip. Renders its children twice back-to-back so the
 * CSS `ticker` translateX(-50%) loops seamlessly. Pauses on hover. Falls calm
 * under prefers-reduced-motion (the reduce block in globals.css halts the anim).
 */
export function Marquee({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`marquee ${className ?? ""}`} aria-hidden>
      <div className="marquee-track">{children}</div>
      <div className="marquee-track">{children}</div>
    </div>
  );
}
