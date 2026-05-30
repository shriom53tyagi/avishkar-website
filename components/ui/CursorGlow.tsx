"use client";

import { useEffect, useRef } from "react";

export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let raf = 0;
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const cur = { x: target.x, y: target.y };

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    const tick = () => {
      cur.x += (target.x - cur.x) * 0.12;
      cur.y += (target.y - cur.y) * 0.12;
      if (ref.current) {
        ref.current.style.transform = `translate3d(${cur.x - 240}px, ${cur.y - 240}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] hidden md:block"
      style={{ contain: "layout paint size" }}
    >
      <div
        ref={ref}
        className="h-[480px] w-[480px] rounded-full opacity-[0.55] mix-blend-screen blur-3xl will-change-transform"
        style={{
          background:
            "radial-gradient(closest-side, rgba(34,211,238,0.35), rgba(34,211,238,0.0) 70%)",
        }}
      />
    </div>
  );
}
