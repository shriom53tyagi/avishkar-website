"use client";

import { useEffect, useRef } from "react";

interface Props {
  className?: string;
}

export function NeuralBackground({ className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;

    type Node = { x: number; y: number; layer: number; idx: number };
    let nodes: Node[] = [];
    const layers = [5, 7, 9, 7, 5];

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      const parent = canvas.parentElement;
      w = rect.width || canvas.offsetWidth || parent?.clientWidth || 0;
      h = rect.height || canvas.offsetHeight || parent?.clientHeight || 0;
      if (w === 0 || h === 0) {
        raf = requestAnimationFrame(build);
        return;
      }
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      nodes = [];
      const padX = w * 0.08;
      const padY = h * 0.18;
      layers.forEach((count, li) => {
        const x = padX + (li / (layers.length - 1)) * (w - padX * 2);
        for (let i = 0; i < count; i++) {
          const y = padY + (i / (count - 1)) * (h - padY * 2);
          nodes.push({ x, y, layer: li, idx: i });
        }
      });
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      // edges — rich indigo
      for (let li = 0; li < layers.length - 1; li++) {
        const a = nodes.filter((n) => n.layer === li);
        const b = nodes.filter((n) => n.layer === li + 1);
        for (const n of a) {
          for (const m of b) {
            const phase = (t / 2400 + (n.y + m.y) * 0.002) % 1;
            const alpha = 0.07 + Math.sin(phase * Math.PI * 2) * 0.06 + 0.05;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.strokeStyle = `rgba(23,70,219,${alpha.toFixed(3)})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // pulse particles — sky blue
      const pulseCount = 30;
      for (let i = 0; i < pulseCount; i++) {
        const seed = i * 97;
        const li = Math.floor(((t / 1500 + seed * 0.7) % layers.length) | 0);
        const safeLi = Math.max(0, Math.min(layers.length - 2, li));
        const a = nodes.filter((n) => n.layer === safeLi);
        const b = nodes.filter((n) => n.layer === safeLi + 1);
        if (!a.length || !b.length) continue;
        const aN = a[(seed * 3) % a.length];
        const bN = b[(seed * 5) % b.length];
        const p = ((t / 2200 + i * 0.07) % 1 + 1) % 1;
        const x = aN.x + (bN.x - aN.x) * p;
        const y = aN.y + (bN.y - aN.y) * p;
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(2,132,199,0.90)";
        ctx.fill();
        // glow halo
        const grd = ctx.createRadialGradient(x, y, 0, x, y, 10);
        grd.addColorStop(0, "rgba(2,132,199,0.40)");
        grd.addColorStop(1, "rgba(2,132,199,0)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
      }

      // nodes — rich indigo core, sky-blue ring
      for (const n of nodes) {
        // outer glow
        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 12);
        grd.addColorStop(0, "rgba(23,70,219,0.12)");
        grd.addColorStop(1, "rgba(23,70,219,0)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 12, 0, Math.PI * 2);
        ctx.fill();
        // core dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(23,70,219,0.80)";
        ctx.fill();
        // ring
        ctx.beginPath();
        ctx.arc(n.x, n.y, 5.5, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(2,132,199,0.28)";
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(build);
    ro.observe(canvas);
    build();
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`block h-full w-full ${className ?? ""}`}
    />
  );
}
