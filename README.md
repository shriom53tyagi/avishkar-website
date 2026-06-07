# Avishkar AI — Healthcare Operational Intelligence & Automation

A futuristic, production-quality site for **Avishkar AI**, a healthcare operational
intelligence and automation platform that helps hospitals and clinics find and recover
hidden revenue losses. Avishkar starts with a comprehensive AI-powered operational
audit, quantifies the financial impact of every inefficiency, then deploys specialized
AI agents only where they deliver measurable ROI.

> "Find the Leak. Quantify the Impact. Deploy the Fix."

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
8. **Contact** — direct email, Apple-style voice note, Careers (`mailto:`), Security & Compliance
9. **Final CTA** — full-bleed neural network canvas, cinematic close

## Interactive features

- **Domain-locked AI chatbot** — a floating widget (bottom-right) that answers
  questions about Avishkar AI only. All LLM calls run **server-side** through
  `app/api/chat/route.ts`; the API key is read from `ANTHROPIC_API_KEY` and is
  never exposed to the browser. A strict system prompt keeps it on-topic, refuses
  off-domain questions, and defers to `info@avhishkar.app` when it doesn't know.
- **Apple-style voice note** (Contact section) — tap to record with a live
  waveform, timer, playback and re-record, built on the `MediaRecorder` API with
  graceful mic-permission handling. On send it POSTs the audio to
  `app/api/voice-note/route.ts`, which is where you wire up storage or forwarding
  to `info@avhishkar.app` (see the marked `TODO` block in that file).
- **Interactive visitor counter** (footer) — rolls up on load, reacts to
  hover/click, and is persisted server-side via `app/api/visitors/route.ts`
  (a small JSON file under `data/`, with an in-memory fallback).

## Environment variables

Copy `.env.example` to `.env.local` and fill in your key:

```bash
cp .env.example .env.local
```

| Variable            | Required | Description                                                        |
| ------------------- | -------- | ------------------------------------------------------------------ |
| `ANTHROPIC_API_KEY` | Yes      | Anthropic API key for the server-side chatbot. Never commit this.  |
| `ANTHROPIC_MODEL`   | No       | Override the chat model (defaults to a fast, low-cost Claude model).|

> The chatbot still loads without a key — it simply replies asking the user to
> email `info@avhishkar.app` instead of erroring.

## Run locally

```bash
npm install
cp .env.example .env.local   # then add your ANTHROPIC_API_KEY
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
  api/               # Server-side route handlers (key stays on the server)
    chat/            #   POST → domain-locked Avishkar AI chatbot
    voice-note/      #   POST → receives recorded voice notes (multipart)
    visitors/        #   GET/POST → persisted visitor counter
components/
  ui/                # Reusable primitives (buttons, nav, chat widget, voice note, ...)
  sections/          # Page sections (incl. Contact: voice note + careers + security)
  visuals/           # Heavy animated visuals (canvas + svg)
lib/
  data.ts            # Copy + structured content (CONTACT_EMAIL, security pillars, ...)
  utils.ts
data/                # Runtime store for the visitor counter (gitignored JSON)
tailwind.config.ts
next.config.ts
```

## Notes

- Honors `prefers-reduced-motion` and avoids overwhelming animations
- All visuals are hand-built (SVG / canvas) — no stock imagery.
- Mock data lives in `lib/data.ts` — swap with real metrics when ready