# Avishkar — practice technology

Marketing site for **Avishkar**: we connect the systems a practice already uses and
build AI agents, integrations, automation and custom tools around its workflows.

> Technology built around how your practice works.

The site has two jobs: explain what Avishkar is in about ten seconds, and give a
qualified visitor a clear path to trying an agent or booking a conversation.

## Tech stack

- **Next.js 15** (App Router, RSC) · **React 19** · **TypeScript** (strict)
- **Tailwind CSS** with a small token set (see `tailwind.config.ts`)
- **Inter** via `next/font`, single family
- **Framer Motion** for exactly one entrance animatio

## Information architecture

```
/                    Home — 8 sections, in a fixed order
/agents              Agent library, grouped by availability
/agents/[slug]       One page per agent, generated from content
/how-we-work         Engagement model, what we build, common questions
/about               Who we are and how we think
/contact             Booking + "tell us what you're trying to solve"
/security            How access and data are handled
/resources           Existing SEO articles (footer-linked)
/careers /privacy /terms
```

Navigation is three links plus one CTA. The site uses four CTA labels in total:
`Book a 30-min conversation`, `Try agent`, `Explore agents`, and
`Tell us what you're trying to solve` (see `CTA` in `lib/content.ts`).

## Content model

All copy lives in two files, so wording changes never require touching layout:

| File               | Holds                                                      |
| ------------------ | ---------------------------------------------------------- |
| `lib/content.ts`   | Navigation, CTA labels, every page's copy, security claims |
| `lib/agents.ts`    | The agent library — one typed entry per agent              |
| `lib/resources.ts` | The SEO article content                                    |

**Adding an agent** means adding one entry to `AGENTS` in `lib/agents.ts`. The
library grouping, category filter, home page preview, footer list, detail page,
sitemap and structured data all derive from it.

**Shipping an agent** means changing `status` to `"live"` and setting `demoUrl`.
The card then shows a `Try agent` CTA and the detail page links to the demo.

## Claims policy

The site carries no client logos, no invented metrics and no certifications we
have not earned. Before launch, review `SECURITY_PILLARS` in `lib/content.ts` —
if a line cannot be evidenced in a security questionnaire, cut it.

## Design system

- Two neutral surfaces (`canvas`, `alt`), white cards, a three-step ink ramp
- One accent (`#124C5F`), plus a green for available and an amber for in-development
- 8px radius, 1px borders, no shadows, no gradients
- One animation: an 8px rise and fade on section enter, disabled under
  `prefers-reduced-motion` and forced visible under `<noscript>`

## Run locally

```bash
npm install
cp .env.example .env.local   # add NEXT_PUBLIC_CALENDLY_URL
npm run dev
```

## Insights (database-driven)

`/insights` and `/insights/[slug]` are rendered from a Neon Postgres database
instead of static content. Articles are published by the separate Avishkar
Content Engine (`intelligence.avishkar.app`) via the API in
`app/api/insights/`; there is no admin UI on this site.

Setup:

```bash
# In .env.local:
DATABASE_URL=postgres://user:password@ep-xxxx.neon.tech/dbname?sslmode=require
INSIGHTS_PUBLISH_API_KEY=some-long-random-shared-secret

npm run db:migrate
```

If either env var is missing, the app still starts and every other page works
normally — the Insights pages will just show no articles, and the publish API
returns 401/warns in the server log until both are set.

See `db/test-guide.md` for exact curl commands to exercise the publish API,
and `db/migrations/` for the schema. Pages use Next.js ISR
(`revalidate = 60`), and the API calls `revalidatePath` on publish/update/
delete so changes appear within about a second instead of waiting a minute.

This app deploys to a long-running Node.js server (not Vercel) — build with
`npm run build` and run `node .next/standalone/server.js` (or `npm start`),
per `output: "standalone"` in `next.config.ts`.

## Checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Project structure

```
app/                    Routes
components/
  home/                 The eight home page sections
  agents/               Agent library (client-side category filter)
  ui/                   Primitives: Container, Section, Button, Reveal, Nav, Footer
lib/
  content.ts            Site copy and navigation
  agents.ts             Agent library
  schema.ts             Structured data, derived from the content files
```
