"use client";

import { useEffect, useRef } from "react";

interface Props {
  density?: number;
  color?: string;
  className?: string;
  interactive?: boolean;
}

export function ParticleField({
  density = 60,
  color = "rgba(255,255,255,0.55)",
  className,
  interactive = true,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    const mouse = { x: -9999, y: -9999 };

    type P = { x: number; y: number; vx: number; vy: number; r: number; a: number };
    let particles: P[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      // getBoundingClientRect can report 0 on first paint (before layout settles)
      // or while the element is briefly collapsed — which left the canvas stuck
      // at the intrinsic HTML default of 300×150. Fall back through offset size,
      // the parent box, and finally the viewport so the canvas always fills its
      // container responsively.
      const parent = canvas.parentElement;
      w =
        rect.width ||
        canvas.offsetWidth ||
        parent?.clientWidth ||
        (typeof window !== "undefined" ? window.innerWidth : 0);
      h =
        rect.height ||
        canvas.offsetHeight ||
        parent?.clientHeight ||
        (typeof window !== "undefined" ? window.innerHeight : 0);

      // Bail out if we still couldn't measure — try again next frame rather than
      // baking in the 300×150 default.
      if (w === 0 || h === 0) {
        raf = requestAnimationFrame(resize);
        return;
      }

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.round((w * h) / 22000) + density / 2;
      particles = Array.from({ length: Math.min(180, Math.max(40, target)) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.4 + 0.4,
        a: Math.random() * 0.6 + 0.25,
      }));
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        if (interactive) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 14000) {
            const f = (1 - d2 / 14000) * 0.04;
            p.vx -= dx * f;
            p.vy -= dy * f;
          }
        }
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color.replace(/[\d.]+\)$/, `${p.a})`);
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 6500) {
            const alpha = (1 - d2 / 6500) * 0.18;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(34,211,238,${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    raf = requestAnimationFrame(draw);
    if (interactive) {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseout", onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (interactive) {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseout", onLeave);
      }
    };
  }, [color, density, interactive]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      // `block h-full w-full` guarantees the canvas's CSS box fills its container
      // regardless of its intrinsic attribute size; the className from the caller
      // (positioning, opacity) is appended after.
      className={`block h-full w-full ${className ?? ""}`}
    />
  );
}
