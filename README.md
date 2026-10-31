# Avishkar — practice technology

Marketing site for **Avishkar**: we connect the systems a practice already uses and build AI
agents, integrations, automation and custom tools around its workflows.

> Technology built around how your practice works.

## Tech stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript** (strict)
- **Tailwind CSS** and CSS modules
- **Framer Motion** for animation
- **Postgres** (via `pg`) for the Insights section, **AWS SES** for form emails

## Prerequisites

- Node.js, the version in [`.nvmrc`](.nvmrc) (`nvm use`)
- npm (the repo uses `package-lock.json`)
- A Postgres database, only if you need the Insights pages to show articles

## Setup

```bash
nvm use
npm ci
cp .env.example .env.local   # then fill in the values you need
npm run dev
```

The app starts without most variables. Pages that depend on a missing service (Insights, form
emails) degrade instead of crashing. Ask the project lead for shared development credentials.

## Environment variables

Defined in [`.env.example`](.env.example).

| Variable                    | Purpose                                                             |
| --------------------------- | ------------------------------------------------------------------- |
| `NEXT_PUBLIC_CALENDLY_URL`  | Booking URL for the contact page's Calendly embed                   |
| `SES_AWS_ACCESS_KEY_ID`     | AWS SES credentials for form emails (set all five or none)          |
| `SES_AWS_SECRET_ACCESS_KEY` | AWS SES credentials for form emails                                 |
| `SES_AWS_REGION`            | AWS SES region                                                      |
| `SES_FROM_EMAIL`            | Verified SES sender identity                                        |
| `SES_TO_EMAIL`              | Inbox that receives early-access, Letter and report requests        |
| `DATABASE_URL`              | Postgres connection string for the Insights section                 |
| `INSIGHTS_PUBLISH_API_KEY`  | Bearer token the Content Engine uses to publish via `/api/insights` |

## Scripts

| Command                  | What it does                                   |
| ------------------------ | ---------------------------------------------- |
| `npm run dev`            | Start the dev server                           |
| `npm run build`          | Production build (standalone output)           |
| `npm start`              | Start the production server                    |
| `npm run lint`           | ESLint                                         |
| `npm run typecheck`      | TypeScript, no emit                            |
| `npm run format`         | Rewrite files with Prettier                    |
| `npm run format:check`   | Fail if any file is not formatted              |
| `npm run check`          | Lint, typecheck and format check               |
| `npm run db:migrate`     | Apply database migrations (needs `.env.local`) |
| `npm run db:seed-legacy` | Seed the legacy Insights articles              |

## Routes

`/` · `/what-we-do` · `/agents` · `/agents/[slug]` · `/audits` · `/audits/[slug]` · `/benchmarks` ·
`/integrations` · `/results` · `/how-we-work` · `/about` · `/careers` · `/contact` · `/security` ·
`/insights` · `/insights/[slug]` · `/letter` · `/letter/[slug]` · `/privacy` · `/terms` ·
`/coming-soon`

## Insights (database-driven)

`/insights` pages are rendered from Postgres. Articles are published by the separate Avishkar
Content Engine through the API in `app/api/insights/`; there is no admin UI. Run
`npm run db:migrate` after setting `DATABASE_URL`. Pages use ISR (`revalidate = 60`) and the API
revalidates on publish, update and delete. See `db/test-guide.md` for curl examples.

## Deployment

The app deploys to a long-running Node.js server (not Vercel) with `output: "standalone"` in
`next.config.ts`: build with `npm run build` and run `npm start`.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
