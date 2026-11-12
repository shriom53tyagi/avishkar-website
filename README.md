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

Merging to `main` deploys to production automatically (`.github/workflows/deploy.yml`):

1. CI runs lint, type check, format check and the build.
2. A release is built in GitHub Actions with `output: "standalone"` and packed as
   `release-<sha>.tar.gz`. The production database URL and `NEXT_PUBLIC_*` values come from the
   GitHub `production` environment.
3. The tarball is copied to the server and `scripts/remote-deploy.sh` unpacks it into
   `releases/<sha>`, repoints the `current` symlink and restarts the single PM2 process
   `avishkar` (`ecosystem.config.cjs`). If the health check fails it rolls back to the previous
   release.

The server never pulls from git, builds, or installs packages. Runtime variables stay in the
server's env file and are not in the repo. PM2 must stay at one instance in fork mode, because
the ISR cache is per process.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
