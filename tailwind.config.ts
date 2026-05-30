import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular"],
      },
      colors: {
        ink: {
          950: "#04050A",
          900: "#070811",
          850: "#0A0C17",
          800: "#0E1120",
          700: "#141828",
          600: "#1B2034",
          500: "#262C44",
        },
        cyan: {
          400: "#22D3EE",
          500: "#06D6E0",
          600: "#0BBBC9",
        },
        teal: {
          400: "#2DD4BF",
        },
        violet: {
          400: "#A78BFA",
          500: "#8B5CF6",
        },
        emerald: {
          400: "#34D399",
          500: "#10B981",
        },
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(34,211,238,0.10), transparent 70%), radial-gradient(ellipse 60% 50% at 80% 90%, rgba(167,139,250,0.08), transparent 70%)",
        "noise":
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.07 0 0 0 0 0.09 0 0 0 0 0.13 0 0 0 0.55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(34,211,238,0.20), 0 8px 30px -8px rgba(34,211,238,0.35)",
        panel:
          "inset 0 1px 0 rgba(255,255,255,0.04), 0 1px 0 rgba(0,0,0,0.6), 0 30px 80px -40px rgba(0,0,0,0.9)",
      },
      animation: {
        "grid-pan": "grid-pan 30s linear infinite",
        "scan-y": "scan-y 4s ease-in-out infinite",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        "spin-slow": "spin 22s linear infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
        "ticker": "ticker 28s linear infinite",
        "blink": "blink 1.1s steps(2, start) infinite",
        "orbit": "orbit 16s linear infinite",
      },
      keyframes: {
        "grid-pan": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "60px 60px" },
        },
        "scan-y": {
          "0%": { transform: "translateY(-110%)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(110%)", opacity: "0" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg) translateX(120px) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(120px) rotate(-360deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
