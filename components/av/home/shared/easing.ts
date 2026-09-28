/**
 * Easing/math helpers consolidated from reference/avishkar-hero.html, where
 * they were duplicated inline across the hero/intro/oval/wheel/library
 * IIFEs. Values and formulas are ported verbatim — nothing re-derived or
 * approximated.
 */

/** Clamp a number to [0, 1]. Used by the intro/oval scroll-math loops. */
export const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

/** Cubic ease-out: `1 - (1 - t) ** 3`. Used by intro/oval scroll progress and the wheel's count-up. */
export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

/** Quartic ease-out: `1 - (1 - t) ** 4`. Used by the library slider's drag-release "throw" tween. */
export const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);

/**
 * Custom cubic-bezier(x1,y1,x2,y2) solver, ported verbatim from the
 * library slider's JS (reference lines ~1440-1447). Given the page's
 * shared `--ease: cubic-bezier(.65,.05,0,1)` control points, returns a
 * function mapping a linear progress `t` (0-1) to the eased value — used
 * for programmatic (non-CSS-transition) rotation tweens because the
 * library ring's rotation is recomputed every frame, including mid-drag.
 */
export function bez(x1: number, y1: number, x2: number, y2: number) {
  return (t: number): number => {
    let u = t;
    for (let i = 0; i < 6; i++) {
      const x = 3 * (1 - u) * (1 - u) * u * x1 + 3 * (1 - u) * u * u * x2 + u * u * u - t;
      const dx =
        3 * (1 - u) * (1 - u) * x1 + 6 * (1 - u) * u * (x2 - x1) + 3 * u * u * (1 - x2);
      if (Math.abs(dx) < 1e-6) break;
      u -= x / dx;
      u = Math.min(1, Math.max(0, u));
    }
    return 3 * (1 - u) * (1 - u) * u * y1 + 3 * (1 - u) * u * u * y2 + u * u * u;
  };
}

/** The page's shared `--ease: cubic-bezier(.65,.05,0,1)` as a JS-tweenable easing function. */
export const easeInOutSnappy = bez(0.65, 0.05, 0, 1);
