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
      },
      colors: {
        canvas: "#FAFAF9",
        surface: "#FFFFFF",
        alt: "#F2F2EF",
        ink: {
          DEFAULT: "#16191D",
          muted: "#5A6169",
          subtle: "#8C939B",
        },
        line: {
          DEFAULT: "#E4E4E0",
          strong: "#D2D2CC",
        },
        accent: {
          DEFAULT: "#124C5F",
          hover: "#0D3B4A",
          tint: "#EAF1F3",
        },
        positive: {
          DEFAULT: "#1F7A4D",
          tint: "#ECF4EF",
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
      transitionDuration: {
        DEFAULT: "180ms",
      },
    },
  },
  plugins: [],
};

export default config;
