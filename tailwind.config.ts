import type { Config } from "tailwindcss";

/**
 * Restrained token set: two neutral surfaces, a three-step ink ramp, one
 * accent, and two state colors. Anything that needs a sixth color is a design
 * problem, not a token problem.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      colors: {
        canvas: "#FBFAF7",
        surface: "#FCFBFA",
        alt: "#F4F1EA",
        sand: "#EFE9DD",
        ink: {
          DEFAULT: "#0F172A",
          muted: "#4B5563",
          subtle: "#8A8578",
        },
        line: {
          DEFAULT: "rgba(8,145,178,.20)",
          strong: "rgba(8,145,178,.32)",
        },
        accent: {
          DEFAULT: "#0891B2",
          hover: "#0E7490",
          light: "#3FB0C9",
          tint: "#E8F4F7",
        },
        positive: {
          DEFAULT: "#059669",
          tint: "#D1FAE5",
        },
        attention: {
          DEFAULT: "#8F6412",
          tint: "#F8F2E4",
        },
      },
      fontSize: {
        label: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.08em" }],
        small: ["0.875rem", { lineHeight: "1.45rem" }],
        body: ["1.0625rem", { lineHeight: "1.65" }],
        lead: ["clamp(1.125rem, 1.6vw, 1.3125rem)", { lineHeight: "1.55" }],
        h3: ["1.25rem", { lineHeight: "1.4", letterSpacing: "-0.01em" }],
        h2: ["clamp(1.625rem, 2.6vw, 2.125rem)", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        h1: ["clamp(2rem, 3.4vw, 2.75rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        display: ["clamp(2.25rem, 4.6vw, 3.5rem)", { lineHeight: "1.06", letterSpacing: "-0.025em" }],
      },
      maxWidth: {
        container: "1200px",
        measure: "68ch",
      },
      borderRadius: {
        DEFAULT: "8px",
        lg: "10px",
      },
      boxShadow: {
        /* Resting elevation for cards and panels: barely-there on the neutral
           canvas, just enough to lift a surface off the page. */
        card: "0 1px 3px rgba(8,145,178,.06), 0 1px 2px rgba(0,0,0,.04)",
        /* Hover elevation, paired with a small upward translate. */
        "card-hover": "0 8px 32px -4px rgba(8,145,178,.14), 0 4px 8px rgba(0,0,0,.04)",
        sm: "0 1px 3px rgba(8,145,178,.06), 0 1px 2px rgba(0,0,0,.04)",
        md: "0 4px 16px -2px rgba(8,145,178,.10), 0 2px 4px rgba(0,0,0,.04)",
        lg: "0 8px 32px -4px rgba(8,145,178,.14), 0 4px 8px rgba(0,0,0,.04)",
      },
      transitionDuration: {
        DEFAULT: "180ms",
      },
    },
  },
  plugins: [],
};

export default config;
