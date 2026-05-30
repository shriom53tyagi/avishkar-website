# Avishkar — AI Audit & Agentic Automation for Healthcare

A futuristic, production-quality landing page for **Avishkar**, an AI lab that audits healthcare
operations, identifies revenue leaks, and deploys custom agentic AI systems inside hospitals,
clinics, and provider groups.

> "Your healthcare system has hidden revenue. AI agents can find it."

## Tech Stack

- **Next.js 15** (App Router, RSC)
- **React 19**
- **TypeScript** (strict)
- **Tailwind CSS** (custom dark-first design system)
- **Framer Motion** (cinematic micro-interactions)
- **Lucide Icons**

## Design language

- Dark-mode-default with a deep ink palette (`#04050A`)
- Layered glassmorphism, animated grid + dot backgrounds
- Subtle neural / scan motion, not cartoonish illustrations
- A "live" feel: tickers, sparklines, agent waves, terminal typing
- Healthcare-grade trust cues: HIPAA, BAA, RBAC, PHI minimization

## Sections

1. **Hero** — animated dashboard, workflow graph, floating chips, live ticker
2. **Problems** — animated alert cards with severity bars
3. **AI Audit Engine** — pipeline + live terminal + leakage map
4. **Agents** — 8-card roster with live waveforms and metrics
5. **Inside Your System** — multi-layer architecture visual + trust pillars
6. **Results** — animated counters across 6 outcome metrics
7. **Process** — premium 4-step timeline (horizontal + mobile vertical)
8. **Final CTA** — full-bleed neural network canvas, cinematic close

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Build

```bash
npm run build
npm start
```

## Project structure

```
app/                 # Next.js App Router
  layout.tsx
  page.tsx
  globals.css
components/
  ui/                # Reusable primitives (buttons, nav, cursor glow, ...)
  sections/          # Page sections
  visuals/           # Heavy animated visuals (canvas + svg)
lib/
  data.ts            # Copy + structured content
  utils.ts
tailwind.config.ts
next.config.ts
```

## Notes

- Honors `prefers-reduced-motion` and avoids overwhelming animations.
- All visuals are hand-built (SVG / canvas) — no stock imagery.
- Mock data lives in `lib/data.ts` — swap with real metrics when ready.
