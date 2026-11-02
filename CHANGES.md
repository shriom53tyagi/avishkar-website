# CHANGES — Avishkar AI website

Worked entirely within the existing Next.js 15 (App Router) + React 19 + Tailwind +
Framer Motion + lucide-react stack. No new framework, styling system, or state
library was introduced. All new UI reuses the existing design tokens (`surface`,
`glass`, `text-gradient-cyan`, ink/cyan/violet/emerald colors), the `cn()` helper,
and the established `"use client"` + Framer Motion patterns

## New files

### Backend route handlers (App Router convention: `app/api/<name>/route.ts`)

- **`app/api/chat/route.ts`** — Domain-locked chatbot. Calls the Anthropic Messages
  API **server-side** using `process.env.ANTHROPIC_API_KEY` (never exposed to the
  client). Strict system prompt with embedded company facts: answers only about
  Avishkar AI (product, audit, pricing, security/compliance, contact, careers),
  politely refuses off-domain questions, never invents facts, and defers to
  `info@avhishkar.app` when unsure. Sanitizes/clamps history; wrapped in try/catch
  with graceful fallback replies. Model overridable via `ANTHROPIC_MODEL`.
- **`app/api/voice-note/route.ts`** — Receives the recorded audio as
  `multipart/form-data` (field `audio`, plus optional `name`/`email`). Validates
  size/emptiness, reads the bytes, and contains a clearly marked `TODO` block
  showing exactly where to save to object storage or forward as an email
  attachment to `info@avhishkar.app`. Currently logs metadata and acknowledges.
- **`app/api/visitors/route.ts`** — `GET` returns the count; `POST` increments it.
  Persists to `data/visitors.json` (created at runtime), with an in-memory fallback
  for read-only/serverless filesystems.

### Components

- **`components/ui/ChatWidget.tsx`** — Floating bottom-right chat widget. Matches the
  site's primary-button gradient halo, glass surfaces and status-dot styling.
  Typing indicator, starter suggestions, Escape-to-close, auto-scroll.
- **`components/ui/VoiceNote.tsx`** — Apple/iPhone-voicemail-style recorder:
  tap-to-record, live analyser-driven waveform, timer, stop, playback, re-record,
  send. Built on `MediaRecorder` with graceful mic-permission and unsupported-browser
  handling. SSR-safe (browser APIs only touched in effects/handlers); honors
  `prefers-reduced-motion` (static bars instead of live animation).
- **`components/ui/VisitorCounter.tsx`** — Animated count-up (easeOutCubic, matching
  the existing `AnimatedNumber`), hover lift + click pulse, server-persisted via the
  visitors route. Reduced-motion fallback snaps to the value.
- **`components/sections/Contact.tsx`** — New section providing the previously-missing
  `#contact` target plus `#careers` and `#security` anchors. Includes the voice note,
  a working `mailto:info@avhishkar.app` for resumes (Careers), and a Security &
  Compliance grid.

### Config / docs

- **`.env.example`** — documents `ANTHROPIC_API_KEY` (and optional `ANTHROPIC_MODEL`).

## Modified files

- **`app/layout.tsx`** — render `<ChatWidget />` globally; updated `metadata`
  (title/description/keywords/OG/Twitter) to the Avishkar AI positioning + tagline.
- **`app/page.tsx`** — render `<Contact />` between Process and FinalCTA.
- **`components/sections/Hero.tsx`** — rewrote the sub-headline to the brief
  (connects to EMRs/billing/scheduling/call centers/portals; surfaces + quantifies;
  deploys agents only where ROI is measurable) and added the tagline line.
- **`components/ui/Footer.tsx`** — fixed dead `href="#"` links (Careers → `#careers`,
  Security/Compliance → `#security`, plus other anchors now point to real sections);
  added `<VisitorCounter />`; refreshed the brand blurb to the brief.
- **`lib/data.ts`** — added `CONTACT_EMAIL`, `TAGLINE`, and `SECURITY_PILLARS`
  (presentation-free icon keys resolved in the Contact component).
- **`README.md`** — new "Interactive features", "Environment variables", and updated
  structure/run instructions; tagline + positioning updated.
- **`.gitignore`** — ignore the runtime `data/visitors.json`.

## Notes

- `info@avhishkar.app` is used verbatim throughout (matching the brief's spelling).
- Verified: `tsc --noEmit` passes; `next build` compiles all routes and the page
  (all three API routes register as dynamic server functions); visitor-counter
  persistence and chat history sanitization were tested end-to-end.
- The only build hiccup in a sandboxed/offline environment is `next/font` fetching
  Inter / JetBrains Mono from Google Fonts — pre-existing and unrelated to these
  changes (works fine with normal network access).

---

# Round 2 — Positioning, separate pages, KPI cards, social

Applied the conversion/positioning brief and the requested structural changes.

## New routes (separate pages, as requested)

- **`app/contact/page.tsx`** — dedicated `/contact` page: "Book an Operational
  Audit" email CTA, the Apple-style voice note, and a "what to expect" strip.
- **`app/careers/page.tsx`** — dedicated `/careers` page: values, open-role cards
  (each a working `mailto:` apply link), and a general-application CTA to
  `info@avhishkar.app`.
- The combined `components/sections/Contact.tsx` section was removed; its pieces
  now live on the two pages above + the new `Security` section.

## New home-page sections (brief priorities)

- **`ExecutiveSummary.tsx`** (Priority 6) — sits directly under the hero.
- **`WhyDifferent.tsx`** (Priority 2) — "diagnosis before automation" with a
  Traditional-vs-Avishkar comparison and the closing positioning line.
- **`RevenueMetrics.tsx`** (Priority 3) — six premium **KPI cards** with count-up
  animation (reuses `AnimatedNumber`), accent glows, hover lift.
- **`FounderConviction.tsx`** (Priority 8) — cinematic conviction statement.
- **`Security.tsx`** — security/compliance extracted to its own home section
  (`/#security`).
- New home order: Hero → Executive Summary → Why Different → Revenue Metrics →
  Problems → Operational Intelligence Audit → Agents → Inside System → Results →
  Process → Founder Conviction → Security → Final CTA.

## Content / positioning

- **Hero** (Priority 1): headline "Stop losing revenue to operational blind
  spots.", new subheadline, CTA "Book an Operational Audit" → `/contact`,
  secondary "See Sample Leakage Report" → `#revenue`.
- **Audit Engine renamed** to "Operational Intelligence Audit" (Priority 5) with
  the fixed-scope supporting copy.
- **Trust logos** (Priority 4): Mayo Clinic, Stanford Health, Cleveland Clinic,
  Kaiser Permanente, Apollo Hospitals, MedStar Health — rendered grayscale,
  color on hover.
- **Language scrub** (Priority 7): removed "AI-powered", "agentic OS", etc.
- Final CTA copy + buttons re-pointed to `/contact`.

## Navigation / footer / social

- `NAV_LINKS` now use `/#anchor` form and render via Next `<Link>` so they work
  from sub-pages; labels updated (Why Avishkar, Operational Audit, …).
- Navbar Contact + primary CTA route to `/contact`; mobile menu adds Careers.
- **Footer**: all links corrected to `/contact`, `/careers`, `/#…`; added a row
  of **social icons** (LinkedIn, X, GitHub, YouTube) driven by `SOCIAL_LINKS`;
  refreshed brand blurb; direct email link.

## Data / branding

- `lib/data.ts`: added `EXEC_OUTCOMES`, `WHY_DIFFERENT`, `REVENUE_METRICS`,
  `TRUST_LOGOS`, `OPEN_ROLES`, `SOCIAL_LINKS`; updated `NAV_LINKS`.
- Chatbot facts updated with the new positioning, representative KPIs, and the
  `/contact` + `/careers` locations.
- **Logo**: no logo file was uploaded, so the existing on-brand inline SVG mark
  is retained. `public/BRANDING.md` documents exactly how to drop in a real logo
  and where to set real social handles.

## Verified

- `tsc --noEmit` passes; `next build` prerenders `/`, `/contact`, `/careers` and
  keeps all three API routes as dynamic server functions. No dead links remain.

---

# Round 3 — Cleanup & conversion optimization

Applied the cleanup brief to cut repetition and shorten the page (~30–40%).

## Removed

- **Executive Summary** section (duplicated Hero + Why Different) — file deleted.
- **Our Conviction** (FounderConviction) — removed before the CTA — file deleted.
- **Inside Your System** (InsideSystem) — replaced (see below) — file deleted.
- **The Process** section — merged into the audit concept — file deleted.
- **Problems** standalone section — merged into Revenue (see below) — file deleted.

## Merged

- **Revenue Recovery + Problems → "Hidden Revenue Is Already Flowing Through Your
  Organization"** (`RevenueMetrics.tsx`): KPI cards first, then a compact
  "Where revenue leaks" breakdown. `PROBLEMS` data reduced from 6 → 5 items
  (Missed Appointments, Call Center Drop-Off, Revenue Cycle Leakage,
  Documentation Overhead, Patient Communication Delays).
- **Operational Intelligence Audit + Process**: kept the richer AuditEngine
  ("Operational Intelligence Audit" concept) and dropped the redundant Process
  timeline.

## Reduced

- **Agents 8 → 4** (`lib/data.ts` + `Agents.tsx`): Patient Access (Scheduling +
  Voice AI), Revenue Recovery (Billing + Insurance Verification), Clinical
  Operations (EMR Automation + Documentation), Patient Engagement (Follow-Up).
  Heading + icon map updated.

## Added

- **`WhyDeploymentsWork.tsx`** — compact 4-pillar replacement for InsideSystem
  (Workflow Mapping, Environment-Specific Agents, Continuous Monitoring,
  Enterprise Security).

## Final home flow

Hero → Why Avishkar Is Different → Hidden Revenue (KPIs + leaks) → Operational
Intelligence Audit → Agent Solutions (4) → Why Our Deployments Work → Outcomes,
Not Adjectives → Security & Compliance → Final CTA.

## Wiring

- `NAV_LINKS` updated (Process removed; Revenue added): Why Avishkar, Revenue,
  Operational Audit, Agents, Results.
- Footer "Process" link → "How We Deploy" (`/#deployments`).
- `PROCESS` data export is now unused (left in place, harmless).

## Verified

- `tsc --noEmit` passes; `next build` succeeds; home page bundle shrank
  (23 kB → 19 kB). No dead links/dangling section refs.

---

# Round 4 — Neural hero, FAQ, dual-mode chat

- **Hero neural background**: the Hero now uses the same neural-network canvas
  treatment as the Final CTA (opacity bumped to 70, grid overlay with
  mix-blend-overlay, lighter radial fade). Removed the competing GridBackground
  layer and dialed the ParticleField back so the mesh reads clearly. Hero and CTA
  now bookend the page with matching visuals.
- **FAQ section** (`components/sections/FAQ.tsx`, data in `lib/data.ts → FAQS`):
  accessible accordion (one panel open at a time, keyboard-friendly, animated
  expand) placed between Security and the Final CTA. Includes a "still have a
  question" email + "Talk to the team" CTA.
- **Chat widget — two modes**: opening the widget now shows a menu with
  **"Text the assistant"** (the live domain-locked chatbot) and **"Talk to us"**
  (records a voice note via the existing VoiceNote recorder → /api/voice-note).
  A back arrow returns to the menu.
- **Bug fixes found along the way**: corrected a broken JSX structure in
  ChatWidget (unclosed fragment) and removed a duplicate `FAQS` declaration in
  lib/data.ts. `tsc --noEmit` and `next build` both pass.

---

# Round 5 — Hero canvas sizing fix

- **Root cause**: the Hero's `ParticleField` canvas was stuck at the intrinsic
  HTML default of 300×150 (visible in the DOM as `width="300" height="150"`).
  Its `getBoundingClientRect()` returned 0 on first paint, so the `canvas.width`/
  `height` attributes were never set and it never filled the section.
- **Fix** (`ParticleField.tsx` and, defensively, `NeuralBackground.tsx`):
  resize/build now falls back through offset size → parent box → viewport when
  the rect is collapsed, retries on the next animation frame if it still can't
  measure, and the canvas elements render with `block h-full w-full` so their CSS
  box always fills the container responsively. This sizes the canvas to the hero
  (e.g. ~1637×1506 on a desktop viewport) rather than a fixed value, so it always
  covers the section on every screen size.
