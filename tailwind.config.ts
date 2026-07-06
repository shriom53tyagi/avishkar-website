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
        canvas: {
          DEFAULT: "#FBFAF7",
          alt: "#F4F1EA",
        },
        sand: "#EFE9DD",
        blue: {
          500: "#1746DB",
          600: "#1440C8",
          700: "#1034A8",
        },
        cyan: {
          400: "#0284C7",
          500: "#0369A1",
          600: "#0C4A6E",
        },
        teal: {
          400: "#0D9488",
        },
        violet: {
          400: "#7C3AED",
          500: "#6D28D9",
        },
        emerald: {
          400: "#059669",
          500: "#047857",
        },
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(23,70,219,0.12), transparent 70%), radial-gradient(ellipse 60% 50% at 80% 90%, rgba(109,40,217,0.09), transparent 70%)",
        "noise":
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.07 0 0 0 0 0.09 0 0 0 0 0.13 0 0 0 0.55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(23,70,219,0.18), 0 4px 20px -4px rgba(23,70,219,0.30), 0 12px 48px -8px rgba(23,70,219,0.22)",
        panel:
          "0 0 0 1px rgba(255,255,255,0.7), 0 2px 4px rgba(10,30,80,0.04), 0 12px 32px -8px rgba(10,30,80,0.10)",
      },
      animation: {
        "grid-pan": "grid-pan 30s linear infinite",
        "scan-y": "scan-y 4s ease-in-out infinite",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        "spin-slow": "spin 22s linear infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
        "ticker": "ticker 28s linear infinite",
        "marquee": "ticker 34s linear infinite",
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
