/**
 * Fixed background layer behind every page: a soft radial-gradient wash plus
 * a faint engineering grid masked to fade toward the edges. Ported verbatim
 * from the brand reference's `#room` / `#room::after`.
 */
export function Room() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background: [
          "radial-gradient(1000px 700px at 82% -8%, rgba(8,145,178,.05) 0%, transparent 60%)",
          "radial-gradient(800px 600px at -5% 35%, rgba(5,150,105,.035) 0%, transparent 60%)",
          "radial-gradient(700px 500px at 60% 105%, rgba(8,145,178,.035) 0%, transparent 60%)",
          "var(--porcelain)",
        ].join(", "),
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "linear-gradient(to right, rgba(8,145,178,.06) 1px, transparent 1px)",
            "linear-gradient(to bottom, rgba(8,145,178,.06) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "56px 56px",
          WebkitMaskImage: "radial-gradient(ellipse at center, #000 40%, transparent 78%)",
          maskImage: "radial-gradient(ellipse at center, #000 40%, transparent 78%)",
        }}
      />
    </div>
  );
}
