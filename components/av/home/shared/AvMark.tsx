"use client";

/**
 * The 6-spoke hex "Avishkar" logo mark. Ported 1:1 from
 * reference/avishkar-hero.html (viewBox 0 0 48 48, six spokes at 60°
 * increments around a core circle, a node dot at the tip of each spoke).
 *
 * TODO: this is a placeholder SVG hub standing in for the real Avishkar
 * logo mark, used in the hero headline, the hero node pill, every library
 * card header, and the CTA preview sidebar. It's built as this single
 * component precisely so the real logo can be swapped in here once, in
 * one place, instead of at each of those call sites.
 *
 * Every visual state (entrance draw-in, hover wiggle, `body.flowing`
 * blip/turn animations, per-context sizing/color) lives in the CSS of
 * whichever section renders this — those rules target `.mark`,
 * `.mark__spokes line`, `.mark__core`, `.mark__node` via normal
 * descendant/parent selectors, so this component only needs to render
 * the exact markup shape and keep the `mark` class on the root `<svg>`.
 */
export function AvMark({
  className,
  style,
  "aria-hidden": ariaHidden = true,
}: {
  className?: string;
  style?: React.CSSProperties;
  "aria-hidden"?: boolean;
}) {
  const spokes: { x: number; y: number }[] = [
    { x: 24.0, y: 7.0 },
    { x: 38.72, y: 15.5 },
    { x: 38.72, y: 32.5 },
    { x: 24.0, y: 41.0 },
    { x: 9.28, y: 32.5 },
    { x: 9.28, y: 15.5 },
  ];

  return (
    <svg
      className={className ? `mark ${className}` : "mark"}
      viewBox="0 0 48 48"
      style={style}
      aria-hidden={ariaHidden}
    >
      <g className="mark__spokes">
        {spokes.map((p, k) => (
          <line
            key={k}
            x1="24"
            y1="24"
            x2={p.x.toFixed(2)}
            y2={p.y.toFixed(2)}
            pathLength={1}
            style={{ ["--k" as string]: k }}
          />
        ))}
      </g>
      <circle className="mark__core" cx="24" cy="24" r="6.5" />
      {spokes.map((p, k) => (
        <circle
          key={k}
          className="mark__node"
          cx={p.x.toFixed(2)}
          cy={p.y.toFixed(2)}
          r="4.2"
          style={{ ["--k" as string]: k }}
        />
      ))}
    </svg>
  );
}
