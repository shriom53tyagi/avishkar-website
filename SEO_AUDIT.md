# SEO Audit — avishkar.app

Audit date: 2026-11-13. Branch `chore/deps-security` (HEAD `5d87dad`). Audit only; no source file was changed.

**Method.** I ran `next build` (Next 15.5.x) on a clean `git archive` copy of HEAD in a scratch directory outside the repo, then parsed the generated HTML in `.next/server/app/*.html`, `robots.txt.body` and `sitemap.xml.body`.
**Limit:** `DATABASE_URL` was not set, so the build had **zero Insights posts**. Every statement about the Insights index/article HTML is from source, not from rendered output. Nothing was fetched from the live site.

> `SEO_ASSESSMENT.md` in the repo root describes an older "Avishkar AI / healthcare denials" codebase (`lib/data.ts`, `/resources`, `/api/chat`). It does not match the current code and should not be relied on.

---

## 1. Summary

- Stack: Next.js 15 App Router, standalone output run by PM2 behind an nginx that is **not in the repo**. 28 route files, 45 prerendered pages in the build.
- The basics are mostly sound: real `<a href>` navigation, per-page titles/descriptions, absolute self-referencing canonicals on every indexable route except `/`, `/results` and `/what-we-do`, text content in the initial HTML, `lang="en"`, robots.txt + sitemap, fast static HTML with ISR.
- **The brand rule is broken everywhere.** No `<title>` or meta description on any route pairs "Avishkar" with "medspa" or "technology partner". Titles read "About · Avishkar", "Careers · Avishkar", etc.
- **Social previews are broken in two ways.** 26 prerendered routes (20 agent pages, `/audits`, `/benchmarks`, `/integrations`, `/letter`, `/results`, `/what-we-do`) plus every Insights post override `openGraph` and lose the og:image entirely (Next replaces, not merges). 8 more routes keep the image but emit `og:url` = the homepage.
- **Insights has no Article structured data, no per-post social image, no author, no dateModified, no RSS, no pagination/category URLs, and the sitemap lists one hard-coded post instead of the database.** Every post's og:image is the generic site image, or missing.
- Structured data is thin: one Organization block (sameAs = LinkedIn only; logo is a 96×52 WebP), plus Service/FAQPage on one page and ItemList on `/agents`. No WebSite, BreadcrumbList, Article, VideoObject.
- Two legacy pages (`/results`, `/what-we-do`) still carry the old "Avishkar AI / healthcare denials" positioning, have no canonical, and are excluded from the sitemap while `/results` is linked from the footer.
- No analytics, Search Console file/tag or GA/GTM exists in the repo. Bing verification is present.

---

## 2. Site map (Step 1)

Rendering is from the build output table. "Static+ISR" = prerendered HTML, revalidated in the background. All pages ship client JS (framer-motion + CSS-module animations) but the text is in the initial HTML (Step 3).

| Route                                                                          | File                              | Rendering                                                          | Notes                                                                                                         |
| ------------------------------------------------------------------------------ | --------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `/`                                                                            | `app/page.tsx`                    | Static+ISR, 60s                                                    | Latest 3 insights from DB                                                                                     |
| `/about`                                                                       | `app/about/page.tsx`              | Static+ISR 300s                                                    |                                                                                                               |
| `/agents`                                                                      | `app/agents/page.tsx`             | Static+ISR 300s                                                    | ItemList JSON-LD                                                                                              |
| `/agents/[slug]` (20 pages)                                                    | `app/agents/[slug]/page.tsx`      | SSG (`generateStaticParams`)                                       | slugs from `lib/agents.ts`; many are `in_development`                                                         |
| `/audits`                                                                      | `app/audits/page.tsx`             | Static+ISR                                                         | Lists nothing in production (samples gated off, `lib/audits-data.ts:9`)                                       |
| `/audits/[slug]`                                                               | `app/audits/[slug]/page.tsx`      | SSG, `dynamicParams=false`                                         | **0 pages in production**; only noindex samples exist in dev                                                  |
| `/benchmarks`                                                                  | `app/benchmarks/page.tsx`         | Static+ISR                                                         | **Banner says averages are placeholders** (`components/av/BenchmarksPage.tsx:78`), yet indexed and in sitemap |
| `/careers`                                                                     | `app/careers/page.tsx`            | Static+ISR                                                         |                                                                                                               |
| `/coming-soon`                                                                 | `app/coming-soon/page.tsx`        | Static, `noindex`                                                  | Placeholder page (`robots: "noindex"`, line 6). No inbound links found in code                                |
| `/contact`                                                                     | `app/contact/page.tsx`            | **Server-rendered on demand** (reads `searchParams`)               | `?intent=custom` variant; canonical stays `/contact`                                                          |
| `/how-we-work`                                                                 | `app/how-we-work/page.tsx`        | Static+ISR                                                         | Service + FAQPage JSON-LD                                                                                     |
| `/insights`                                                                    | `app/insights/page.tsx`           | Static+ISR 300s                                                    | Client component with filter/search; data from Postgres                                                       |
| `/insights/[slug]`                                                             | `app/insights/[slug]/page.tsx`    | ISR on demand, 300s; `generateStaticParams` returns `[]` (line 12) | Data from Postgres; has `loading.tsx`                                                                         |
| `/integrations`                                                                | `app/integrations/page.tsx`       | Static+ISR                                                         | `lib/integrations-data.ts:3` TODO: statuses unconfirmed                                                       |
| `/letter`                                                                      | `app/letter/page.tsx`             | Static+ISR                                                         | Newsletter signup                                                                                             |
| `/letter/[slug]`                                                               | `app/letter/[slug]/page.tsx`      | SSG, `dynamicParams=false`                                         | **0 pages**: `ISSUES = []` (`lib/letter-data.ts:15`)                                                          |
| `/privacy`, `/terms`                                                           | `app/privacy`, `app/terms`        | Static+ISR                                                         |                                                                                                               |
| `/results`                                                                     | `app/results/page.tsx`            | Static+ISR                                                         | **Legacy** "Avishkar AI" healthcare page, old components (`components/sections/*`)                            |
| `/security`                                                                    | `app/security/page.tsx`           | Static+ISR                                                         |                                                                                                               |
| `/what-we-do`                                                                  | `app/what-we-do/page.tsx`         | Static+ISR                                                         | **Legacy** copy ("healthcare EMR, billing")                                                                   |
| `/robots.txt`, `/sitemap.xml`                                                  | `app/robots.ts`, `app/sitemap.ts` | Static                                                             |                                                                                                               |
| `/opengraph-image`                                                             | `app/opengraph-image.tsx`         | Dynamic, **edge runtime**                                          | 1200×630 PNG, one image for the whole site                                                                    |
| `/api/early-access`, `/api/subscribe`, `/api/insights`, `/api/insights/[slug]` | `app/api/**/route.ts`             | Dynamic                                                            | Disallowed in robots.txt                                                                                      |
| 404                                                                            | none (`app/not-found.tsx` absent) | Next default                                                       | Default page carries `noindex`                                                                                |

**Where Insights come from.** A Postgres `insights` table (`db/migrations/001_create_insights.sql`), read through `lib/db.ts`. There are no markdown files. A post is created when the external "Content Engine" calls `POST /api/insights` with a bearer key (`app/api/insights/route.ts`). The route validates a zod payload (slug `^[a-z0-9-]+$`, `lib/schemas/insight.ts`), inserts the row, and calls `revalidatePath` for `/insights` and `/insights/<slug>`. The URL is `/insights/<slug>`. Only status `PUBLISHED` rows are shown. `bodyHtml` is pre-rendered HTML injected with `dangerouslySetInnerHTML` (`components/av/ArticlePage.tsx:353`). The legacy `/resources` URLs 301 to `/insights` (`next.config.ts:20-26`).
Because the layout, homepage, `/insights` and every article query the DB, a database outage at runtime throws (`lib/db.ts` only swallows errors during build).

---

## 3. On-page table (Step 4)

Source: generated HTML. Lengths are characters of the rendered `<title>` / description. "Gen." = inherits the root layout's generic OG/Twitter block (title "Avishkar — Technology built around how your practice works", `og:url` = `https://avishkar.app`). Every route has exactly one H1, `lang="en"`, the viewport meta and `/logo.png` as favicon. Twitter card is `summary_large_image` on all routes, but `twitter:image` exists only where og:image exists.

| Route                | `<title>`                                                  | T len  | Meta description                                                                           | D len        | H1                                                              | Canonical         | og:title                                 | og:desc | og:image | Issues                                                                           |
| -------------------- | ---------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------ | ------------ | --------------------------------------------------------------- | ----------------- | ---------------------------------------- | ------- | -------- | -------------------------------------------------------------------------------- |
| `/`                  | Avishkar — Technology built around how your practice works | 58     | Avishkar connects the systems your practice already uses…                                  | 163          | "We make your systems talk" (logo `<img alt="">` between words) | **none**          | Gen.                                     | Y       | OK (abs) | No canonical; no "medspa"/"technology partner" in title/desc/H1; desc 163 > ~155 |
| `/about`             | About · Avishkar                                           | 16     | Avishkar is a technology company that builds around how practices already work…            | 148          | "We build technology for practices."                            | abs self          | Gen.                                     | Gen.    | OK       | Bare brand; og:url = homepage                                                    |
| `/agents`            | Agents we've built for practice teams · Avishkar           | 48     | A current look at Avishkar's work for medspas…                                             | 191          | "Agents we've built for practice teams."                        | abs self          | Gen.                                     | Gen.    | OK       | Desc 191 (truncates); og:url = homepage; no "Avishkar medspa" pairing in title   |
| `/agents/[slug]` ×20 | `<Agent name> · Avishkar` (26–40)                          | 26–40  | `agent.oneLiner`                                                                           | 49–88        | Agent name                                                      | abs self          | `<name> · Avishkar`                      | Y       | **none** | Descriptions 49–88 chars, too short; no og:image; no `og:type`; bare brand       |
| `/audits`            | Practice Audits · Avishkar                                 | 26     | Teardowns of practices' stacks…                                                            | 121          | "Practice Audits"                                               | abs self          | ok                                       | Y       | **none** | No og:image; empty in production (no audits)                                     |
| `/benchmarks`        | Benchmarks · Avishkar                                      | 21     | Compare your no-show rate…                                                                 | 91           | "Benchmarks"                                                    | abs self          | ok                                       | Y       | **none** | No og:image; placeholder data page indexed; H1 is one word                       |
| `/careers`           | Careers · Avishkar                                         | 18     | Work at Avishkar: we build technology for medspas…                                         | 141          | "Build technology practices actually use."                      | abs self          | Gen.                                     | Gen.    | OK       | og:url = homepage                                                                |
| `/contact`           | Talk to Avishkar                                           | 16     | Book a 30-minute conversation with Avishkar…                                               | not measured | (one H1)                                                        | abs self          | cannot verify (dynamic, not prerendered) |         |          | Page is server-rendered; not inspected as HTML                                   |
| `/how-we-work`       | How we work · Avishkar                                     | 22     | How Avishkar works with practices…                                                         | 146          | "A conversation first. Then something small that works."        | abs self          | Gen.                                     | Gen.    | OK       | og:url = homepage                                                                |
| `/insights`          | Insights · Avishkar                                        | 19     | Field notes on aesthetics, medspa operations…                                              | 159          | "Insights for the modern practice."                             | abs self          | Gen.                                     | Gen.    | OK       | og:url = homepage; generic title                                                 |
| `/insights/[slug]`   | `<post title> · Avishkar`                                  | varies | `insight.dek`                                                                              | varies       | post title                                                      | abs self (source) | post title                               | dek     | **none** | See Step 6; no Article schema; no per-post image                                 |
| `/integrations`      | Integrations · Avishkar                                    | 23     | Avishkar connects the systems your practice already pays for…                              | 114          | "Works with what you run."                                      | abs self          | ok                                       | Y       | **none** | No og:image                                                                      |
| `/letter`            | The Avishkar Letter · Avishkar                             | 30     | One short email a month…                                                                   | 80           | "The Avishkar Letter"                                           | abs self          | ok                                       | Y       | **none** | Title repeats brand; desc short, has no medspa/partner pairing                   |
| `/privacy`           | Privacy Policy · Avishkar                                  | 25     | How Avishkar collects…                                                                     | 93           | "Privacy Policy"                                                | abs self          | Gen.                                     | Gen.    | OK       | Indexable legal page with homepage OG                                            |
| `/results`           | Results · Avishkar                                         | 18     | Real outcomes from Avishkar's healthcare operational audits…                               | 133          | "The audit found it. The agents recovered it."                  | **none**          | "Results — Avishkar AI"                  | Y       | **none** | Legacy; stale positioning; "Avishkar AI" naming; no canonical                    |
| `/security`          | Security · Avishkar                                        | 19     | How Avishkar handles practice and patient data…                                            | 152          | "Built with privacy and security in mind."                      | abs self          | Gen.                                     | Gen.    | OK       | og:url = homepage                                                                |
| `/terms`             | Terms of Service · Avishkar                                | 27     | Terms governing access to and use of the Avishkar website.                                 | 58           | "Terms of Service"                                              | abs self          | Gen.                                     | Gen.    | OK       | Desc 58 (short)                                                                  |
| `/what-we-do`        | What We Do · Avishkar                                      | 21     | Avishkar's operational audit, AI agents, and revenue recovery for healthcare EMR, billing… | 106          | "Diagnose first. Deploy only where it pays."                    | **none**          | "What We Do — Avishkar AI"               | Y       | **none** | Legacy positioning; no canonical; in main nav + footer but not in sitemap        |
| `/coming-soon`       | Coming soon \| Avishkar                                    | 22     | (root default)                                                                             | 163          | "See you soon."                                                 | none (noindex)    | Gen.                                     | Gen.    | OK       | Intended noindex                                                                 |
| 404 (`/_not-found`)  | 404: This page could not be found.                         | 34     | (root default)                                                                             | 163          | "404"                                                           | none              | Gen.                                     | Gen.    | OK       | `noindex` — fine                                                                 |

**Counts from the build.** Duplicate descriptions: the homepage, `/coming-soon` and the 404 share one (163 chars). Titles using the bare brand with no medspa/technology-partner qualifier: **all**. Titles ≥ 60 chars: none (longest 58). Descriptions > 160 chars: `/` (163), `/agents` (191). Descriptions < 70 chars: 12 of the 20 agent pages, `/letter` (80 is fine), `/terms` (58).

**Heading structure.** On every page the first heading in DOM order is an `<h3>` from the navbar's "latest insight" card (`components/av/AvNavbar.tsx:210`), before the H1. The footer then jumps `h2 → h4 → h5` (`components/av/AvSiteFooter.tsx:52,110,130,147`). Homepage goes H1→H2→H3 correctly in the body. Agent pages run H1 → H2 → H2 → H2 then footer levels. One H1 per page everywhere; the homepage H1 is split into one span per word and contains an `alt=""` logo image (`components/av/home/AvHomeHero.tsx:396`), so it reads as "We make your systems talk" with no brand or category word.

**og:image.** `app/opengraph-image.tsx` exists (file convention), is 1200×630, and Next emits an absolute URL with `og:image:width/height/type/alt`. This part of the earlier finding is fixed. The remaining problem is inheritance, see Finding C-2.

---

## 4. Findings

### Critical (blocks indexing or ranking)

**C-1. The brand rule is violated on every page, so the bare name "Avishkar" competes alone.**

- _What:_ No title, description or OG text pairs "Avishkar" with "medspa" or "technology partner". Root default title `app/layout.tsx:143`, template `:144` (`"%s · Avishkar"`), description `:146`, OG `:160-166`, Twitter `:168-173`. Per-page titles: `app/about/page.tsx:5`, `app/careers/page.tsx:5`, `app/security/page.tsx:5`, etc. The homepage `<h1>` and the OG image (`app/opengraph-image.tsx:50`) have no medspa wording either. The one place the phrase appears is body copy ("Avishkar is the technology partner for medspas and clinics", `components/av/home/AvHomeIntro.tsx`).
- _Why:_ The query "avishkar" belongs to an unrelated topic. Titles are the strongest on-page signal; right now the site gives Google nothing to disambiguate with.
- _Fix:_ Change the template to `"%s · Avishkar medspa technology partner"` for inner pages (or `%s | Avishkar, technology partner for medspas`) and set the homepage title to e.g. `Avishkar: Technology Partner for US Medspas`. Rewrite the root, OG and Twitter descriptions to lead with "Avishkar is a technology partner for medspas…". Keep titles ≤ 60 characters so the suffix doesn't truncate; shorten per-page lead text to fit.
- _Effort:_ S (central template) + S (copy for about 8 descriptions).

**C-2. Homepage has no canonical tag.**

- _What:_ `app/layout.tsx:141-178` defines no `alternates`, and `app/page.tsx` exports no metadata. Build output for `/` shows no `<link rel="canonical">`.
- _Why:_ The homepage is the most-linked URL and is reachable as `/`, `/?utm=…`, and any tracking-param variant. Without a canonical, Google picks one itself.
- _Fix:_ Add `alternates: { canonical: "/" }` to the root metadata (resolves to `https://avishkar.app/` through `metadataBase`). Because child pages that define their own `alternates` override it, this is safe.
- _Effort:_ S.

**C-3. 26 routes plus every Insights post lose the social image, and 8 more emit the homepage as `og:url`.**

- _What:_ Next shallow-replaces the whole `openGraph` object when a page sets one. Pages that set `openGraph` but no `images` therefore have **no og:image and no twitter:image**: all 20 `/agents/[slug]` (`app/agents/[slug]/page.tsx:23-27`), `/audits` (`app/audits/page.tsx:12`), `/benchmarks` (`app/benchmarks/page.tsx:12`), `/integrations` (`app/integrations/page.tsx:12`), `/letter` (`app/letter/page.tsx:12`), `/results` (`app/results/page.tsx:9`), `/what-we-do` (`app/what-we-do/page.tsx:8`), and every `/insights/[slug]` (`app/insights/[slug]/page.tsx:61-67`). Pages that do **not** set `openGraph` (`/about`, `/agents`, `/careers`, `/how-we-work`, `/insights`, `/privacy`, `/security`, `/terms`) inherit the root block, including `og:url: https://avishkar.app` (`app/layout.tsx:165`) and the root title, so a share of `/about` announces the homepage URL.
- _Why:_ Shares and link unfurls on LinkedIn/Slack/iMessage fall back to a bare text card on ~30 URLs; the wrong `og:url` can make Facebook/LinkedIn consolidate shares to the homepage.
- _Fix:_ Remove `url: SITE_URL` from the root `openGraph` (let each page set it, or let Next derive it from `alternates.canonical`). Add a small helper that builds `openGraph` for every page and always includes `images: ["/opengraph-image"]` (or, better, a per-page image). Insights: use `heroImageUrl` as the og:image with its alt.
- _Effort:_ M.

**C-4. Insights has no way to rank as articles: no Article/BlogPosting schema, no author, no dateModified, wrong sitemap.**

- _What:_ The article route emits no JSON-LD at all (`app/insights/[slug]/page.tsx:71-79`; `JsonLd` is never imported). OG has `publishedTime` only (`:66`); no `modifiedTime`, no `authors`, no image. The data exists (`updated_at`, `byline_name`, `hero_image_url` in `lib/db.ts`) but is unused. The sitemap hard-codes a single slug (`app/sitemap.ts:6`: `INSIGHTS_SLUGS = [...]`), so every other post the Content Engine publishes is **absent from the sitemap**, and the post that is listed may not exist (it is only present if that row is in the DB; the `/resources/:slug` redirect also points to it, `next.config.ts:22-24`).
- _Why:_ New posts rely on internal links alone for discovery, and Google gets no author/date/image entity for them. This is the section the business is building for organic growth.
- _Fix:_ (1) In `app/sitemap.ts` make the function `async`, call `listPublishedInsights({})`, and emit one `<url>` per row with `lastModified: insight.updatedAt`. (2) Render `BlogPosting` JSON-LD on `/insights/[slug]` with `headline`, `description`, `image`, `datePublished`, `dateModified`, `author` (Person or Organization), `publisher` (Organization+logo), `mainEntityOfPage`. (3) Add `openGraph.images`, `authors`, `modifiedTime`. (4) Make the sitemap route revalidate (`export const revalidate = 300`) since `POST /api/insights` does not call `revalidatePath("/sitemap.xml")` (`app/api/insights/route.ts`).
- _Effort:_ M.

### High

**H-1. Sitemap `lastmod` is fake and sitemap contents are incomplete.**

- _What:_ Every entry gets `lastModified = new Date()` at build/request time (`app/sitemap.ts:13`; build output shows all 14 static + 20 agent URLs with the identical timestamp `2026-11-13T11:11:35Z`). It also lists `/benchmarks` (placeholder data), `/audits` (no audits in production) and unfinished agent pages with priority 0.6, and omits `/what-we-do`, `/results` (both linked from nav/footer). `changeFrequency` and `priority` are ignored by Google.
- _Why:_ A `lastmod` that always equals "now" teaches Google to ignore the field, which hurts fast recrawl of real updates.
- _Fix:_ Use a per-page constant date for static pages (or git/CMS date), `updatedAt` for insights. Decide `/what-we-do` and `/results`: either rewrite and canonicalize, or `noindex` and 301 them (see H-2). Drop or noindex `/benchmarks` until real figures exist, or remove the placeholder banner.
- _Effort:_ S.

**H-2. Legacy "Avishkar AI / healthcare denials" pages are live, linked, unconfirmed and off-brand.**

- _What:_ `/results` and `/what-we-do` use the old positioning ("healthcare EMR, billing, and scheduling", "Avishkar AI") — `app/what-we-do/page.tsx:7,10`, `app/results/page.tsx:7-12`. They have no `alternates.canonical`. `/results` shows a testimonial with a stock Unsplash photo labelled "Healthcare finance executive" and "$1.1M leakage / $800K recovered" (`components/sections/LatestUpdates.tsx:80-90`) — an unsourced claim. The footer links to it as "Case studies" (`components/av/AvSiteFooter.tsx:153`).
- _Why:_ Conflicting positioning dilutes topical focus ("medspa" vs. "healthcare billing"); an unverifiable results claim is a trust/compliance risk; missing canonicals.
- _Fix:_ Either rewrite both to the medspa positioning with canonicals and sitemap entries, or 301 `/results` → `/insights` (or `/audits`) and `/what-we-do` → `/how-we-work`, and remove the footer link.
- _Effort:_ M.

**H-3. Structured data is minimal and the Organization block is incomplete.**

- _What:_ Only `Organization` (every page, `app/layout.tsx:209`, `lib/schema.ts:9-24`), `Service` + `FAQPage` (`/how-we-work`, `app/how-we-work/page.tsx:17-18`) and `ItemList` (`/agents`, `app/agents/page.tsx:16`). `sameAs` has **one** entry (LinkedIn; `lib/content.ts:255`). The footer also links Instagram (`components/av/AvSiteFooter.tsx:182`) and the navbar Instagram (`components/av/AvNavbar.tsx:183`), but it is not in `sameAs`. No YouTube/Facebook link exists anywhere in the code ("cannot verify" whether profiles exist). `logo` is `/logo.png`, which is a **96×52 WebP file with a .png extension** (`public/logo.png`, magic bytes `RIFF…WEBP`), below Google's minimum and not square. No `WebSite` (with `SearchAction`/name), no `BreadcrumbList` on inner pages, no `VideoObject` for the 12 MB demo video (`components/av/home/AvHomeIntro.tsx:17`, `WhatWeDoPage.tsx:254`). The `Service` JSON-LD has a nested `provider` Organization without logo. FAQ answers are marked up on `/how-we-work`; check the visible text matches (the schema is built from the same `ENGAGEMENT_FAQS`, so it should).
- _Why:_ Weaker entity recognition for the brand name (which is the stated problem), and no rich-result eligibility for the logo/sitelinks.
- _Fix:_ Add `WebSite` (name "Avishkar", `alternateName` "Avishkar medspa technology partner") and a ≥112×112 square PNG/SVG logo; extend `sameAs` with Instagram and any YouTube/Facebook profiles; add `BreadcrumbList` on agents and insights; add `VideoObject` (name, description, thumbnailUrl, uploadDate, contentUrl) where the video is embedded.
- _Effort:_ M.

**H-4. No analytics and no Google Search Console verification.**

- _What:_ No GA4, GTM, or any analytics code (`grep` over `app`, `components`, `lib`, `package.json`). The privacy page says "Scheduling and analytics scripts only load after you accept cookies" (`components/av/PrivacyPage.tsx:17`), but no analytics exists, so that statement is inaccurate. Only a Bing tag (`msvalidate.01`, `app/layout.tsx:176`) exists; no `google-site-verification` meta or HTML file in `public/`.
- _Why:_ No measurement of organic traffic or conversions; Search Console may be verified through DNS (cannot verify from code), but if not, it can't be used.
- _Fix:_ Verify via DNS in Search Console (preferred), or add `verification.google` in the root metadata. Add GA4 behind the existing cookie consent (`components/ui/CookieConsent.tsx`). Fix the privacy copy or the code.
- _Effort:_ S–M.

**H-5. Missing real 404 guarantee for Insights.**

- _What:_ No `app/not-found.tsx`. `/insights/[slug]` calls `notFound()` (`app/insights/[slug]/page.tsx:74`) but also has `app/insights/[slug]/loading.tsx`. When a route streams a loading boundary first, the HTTP status can already be 200 by the time `notFound()` runs; Next may then fall back to a `noindex` meta only (cannot verify from code). `generateStaticParams` returns `[]` (line 12), so every article is first rendered on demand.
- _Why:_ Soft-404s for deleted or mistyped article URLs, and a possible 200-status deleted-post URL that stays in the index.
- _Fix:_ Test `curl -I https://avishkar.app/insights/does-not-exist` on production. If it returns 200, remove `loading.tsx` or move the DB lookup into a layout/`generateMetadata` path that runs before streaming; add `app/not-found.tsx` with links to key pages. Also make deleted posts return 410 or 404 and not stay in the sitemap.
- _Effort:_ S (verify) / M (fix).

### Medium

**M-1. Insights index: no pagination, categories, tags or RSS.**

- _What:_ `app/insights/page.tsx:35` loads all posts in one query; filtering/search is client state only (`components/av/InsightsPage.tsx:59-60`, `applyFilter` at ~line 117), so category views have no URL. No `app/insights/feed.xml/route.ts`, no `<link rel="alternate" type="application/rss+xml">`, no tag/category routes, no `/insights/page/2`.
- _Why:_ Cannot rank for category/topic hubs; no feed for syndication/AI tools; the index grows without limit once the Content Engine publishes weekly.
- _Fix:_ Add `/insights/category/[kicker]` (kickers are an enum, `lib/schemas/insight.ts:3-11`), paginate at ~12/page with `rel` links and self-canonicals, add an RSS route and `<link rel="alternate">` in the layout.
- _Effort:_ M–L.

**M-2. Insights index links are plain `<a href>`, but cards have empty alt and no heading structure for the image link.**

- _What:_ Cards are `<Link href="/insights/slug">` (crawlable; `components/av/InsightsPage.tsx:232,280`). Card images use `alt=""` (`:240`, `:289`) inside a link that also contains the title, so this is acceptable for accessibility, but the featured and article hero image `alt` comes from the DB (`heroImageAlt`) and is not validated non-empty (`lib/schemas/insight.ts:24` — `alt: z.string()` allows `""`).
- _Fix:_ Require `alt` `min(1)` in the zod schema. Keep card images decorative.
- _Effort:_ S.

**M-3. Titles, descriptions and Open Graph for Insights are not tuned.**

- _What:_ Title is `post.title` + `" · Avishkar"` (`app/insights/[slug]/page.tsx:58`, template). A long post title will push past ~60 characters and truncate; description is the `dek` (up to 2000 chars allowed, `lib/schemas/insight.ts:31`). Twitter card uses the generic root text, not the post.
- _Fix:_ Cap `dek` at ~155 characters or add a separate `metaDescription` field; add `twitter` metadata; add `max 60` on title for SEO purposes or a separate `seoTitle`.
- _Effort:_ S–M.

**M-4. Internal linking is thin between articles and product pages.**

- _What:_ Article bodies are raw HTML from the Content Engine (`ArticlePage.tsx:353`); the page template adds exactly one product link: a generic "Talk to Avishkar" CTA to `/contact` (`:411`), plus a "Keep reading" block of 3 latest posts, not topic-matched (`app/insights/[slug]/page.tsx:76`). No links to `/agents`, `/how-we-work`, `/integrations`. Pages link back to Insights only via the footer/nav ("Articles", footer line 133) — product pages don't link to relevant articles.
- _Fix:_ Add a "Related agents" block on articles (map `kicker` → agents), pick related posts by kicker, and add a "From Insights" block on agent pages.
- _Effort:_ M.

**M-5. Orphan and low-value pages.**

- _What:_ `/coming-soon` has no inbound links in code (noindex, fine). `/audits` and `/letter/[slug]` have no content in production, but `/audits` is in the main nav/footer (`AvSiteFooter.tsx:139`) and sitemap. `/benchmarks` is linked and indexed but declares itself placeholder data.
- _Fix:_ Remove empty/placeholder hubs from nav and sitemap until content ships, or `noindex` them.
- _Effort:_ S.

**M-6. Generic anchor text on key links.**

- _What:_ "Learn more"-style anchors were not widespread, but important links use generic labels: "Read more" in the navbar feature card (`components/av/AvNavbar.tsx:~220`), "Read the article" (`InsightsPage.tsx:~258`), "Articles" for the Insights footer link (`AvSiteFooter.tsx:133`, while the page's own H1 is "Insights"), "Case studies" pointing to `/results` (`:153`).
- _Fix:_ Rename to descriptive anchors ("Read: <title>", "Insights for medspa operators"); fix label mismatch.
- _Effort:_ S.

**M-7. Hydration-noise script and DOM-mutating observer in `<head>`.**

- _What:_ `app/layout.tsx:18-130,202` injects an inline script on every page that overrides `console.error` and installs a `MutationObserver` over the whole document for the life of the page.
- _Why:_ Extra main-thread work on every DOM mutation (animation-heavy site) and masks real hydration errors that can cause content mismatch.
- _Fix:_ Remove it from production builds (`suppressHydrationWarning` already exists on `html`/`body`).
- _Effort:_ S.

**M-8. Remote image optimizer is open to any HTTPS host.**

- _What:_ `next.config.ts:9` allows `hostname: "**"`.
- _Why:_ Anyone can use `/_next/image?url=…` to proxy and resize arbitrary images through the server (CPU on a 1 GB box per `scripts/remote-deploy.sh:7`); Insights hero images are not size-checked.
- _Fix:_ Pin to the Content Engine's image host(s).
- _Effort:_ S.

### Low

**L-1.** Favicon/apple-touch icon are the same 96×52 WebP named `.png` (`app/layout.tsx:149-150`). Provide a square `favicon.ico`/PNG 48×48 multiple, 180×180 apple-touch. (S)

**L-2.** Footer/navbar contain `<a href="#" aria-label="X (TODO: no account yet)">` (`components/av/AvNavbar.tsx:194`), a dead link with a visible "TODO" label for assistive tech. Remove until the account exists. (S)

**L-3.** `keywords` meta (`app/layout.tsx:151-158`) is ignored by Google; harmless. Its terms include "custom healthcare software" and omit "medspa technology partner". (S)

**L-4.** `openGraph.type: "article"` on `/audits/[slug]` and `/letter/[slug]`; no pages are generated. (S)

**L-5.** Privacy/terms pages are indexable with generic OG; consider leaving indexable, but give them distinct OG data. (S)

**L-6.** Metadata duplication: each page re-declares an `openGraph` block with `"· Avishkar"` suffix manually (`app/audits/page.tsx:13`, etc.), which will drift from the title template. Centralize in one helper (ties to C-3). (S)

**L-7.** Spelling: `/letter` and `/about` pages inherit the same OG title as the homepage. Covered by C-3. (—)

---

## 5. What is already done correctly

- Real crawlable navigation: navbar/footer/cards are `next/link` `<a href>` elements (`components/av/AvNavbar.tsx`, `AvSiteFooter.tsx`); the only JS handlers are the menu toggle button and the scrim.
- robots.txt exists, allows `/`, disallows `/api/`, and references `https://avishkar.app/sitemap.xml` (`app/robots.ts`).
- Canonicals are absolute (via `metadataBase`), self-referencing, no trailing slash, correct domain on every indexable route except `/`, `/results` and `/what-we-do`.
- `app/opengraph-image.tsx` gives a valid 1200×630 PNG with absolute URL, width, height and alt — the earlier "broken og:image" problem is fixed for pages that inherit it.
- Exactly one `<h1>` per page; `lang="en"`; viewport meta; `theme-color`.
- Main text content is in the initial HTML (homepage: ~730 words of visible text in the static document). Reveal animations are CSS/JS class toggles and do not remove text from the DOM; `<noscript>` forces visibility (`app/layout.tsx:204-206`; `components/ui/Reveal.tsx` comment).
- `/coming-soon` and the 404 page are `noindex`; sample audits are `noindex` and kept out of the sitemap (`app/audits/[slug]/page.tsx:29`, `app/sitemap.ts:50`).
- Old `/resources` URLs have permanent redirects (`next.config.ts:19-26`).
- `poweredByHeader: false`, HSTS, nosniff, frame-deny headers (`next.config.ts:28-43`).
- Fonts use `next/font/google` (self-hosted at build, `display: "swap"`, preloaded) — no render-blocking external font CSS.
- Calendly script loads only after consent/near the viewport (`components/av/AvCalendarEmbed.tsx`, `components/av/home/CalendlyEmbed.tsx`), so no third-party script blocks first paint.
- Bing Webmaster verification tag present (`app/layout.tsx:176`).
- Build tolerates an empty DB and ISR keeps serving last good pages (`lib/db.ts`).
- Valid-looking FAQPage JSON-LD generated from the same data as the visible FAQ.
- Zero `<img>` without an `alt` attribute on any built page (images are few: homepage has 1, `alt=""`, decorative).

---

## 6. Cannot verify from code

- **No nginx/proxy config is in the repo.** Redirects for `www` → apex, `http` → `https`, trailing slashes, gzip/brotli, `Cache-Control` for `/_next/static` and `/hero-demo.mp4`, and any `X-Robots-Tag` header are unknown. `ecosystem.config.cjs` only runs Node via PM2. Check: `curl -I http://www.avishkar.app/`, `curl -I https://avishkar.app/about/`.
- Real HTTP status of unknown URLs and deleted insights (H-5), and of `/insights/<unknown>`.
- Insights output: the build had no DB. Which posts exist, their titles/descriptions/images, whether the one hard-coded sitemap slug is live, and the rendered article headings and internal links in `bodyHtml` need the live site.
- Whether `/contact` renders its text in initial HTML (dynamic route, not prerendered in my build; source suggests yes).
- Whether Search Console is verified via DNS, indexing status, coverage errors, query/impression data, backlinks.
- Whether Instagram, YouTube, Facebook and LinkedIn profiles exist and are correct (`https://www.instagram.com/avishkar.app/`, `https://www.linkedin.com/company/avishkarai/` are the only ones in code; no YouTube/Facebook anywhere).
- Core Web Vitals (LCP/CLS/INP) in the field — only code-based risks below.
- Actual compression ratio and cache headers for static assets; actual `og:image` rendering on the edge runtime in production.
- Whether Google indexes the hero video or reads text inside it. Text appears only as captions in the player UI; the video has no transcript on the page.

### Performance notes from code (Step 9)

- **JS:** shared First Load JS is 103 kB; heaviest routes are `/results` 147 kB, `/` 136 kB (17 kB page), `/agents` 115 kB, `/insights` + article 115 kB. Total chunk directory ≈ 960 kB uncompressed (largest chunks: framework 181 kB, two shared 173–174 kB, main 128 kB, polyfills 113 kB). `framer-motion@11` is the main animation dependency; `optimizePackageImports` is enabled (`next.config.ts:15-17`) but `Reveal` and several pages import `motion`/`useInView` from the whole library; 25 client components under `components/av`. Browserslist (`.browserslistrc`) may be pulling the 113 kB polyfills chunk; check it targets modern browsers.
- **Fonts:** three families, seven weights: Inter Tight (400/500/600/700), JetBrains Mono (400/500), Caveat (500), all `display: swap` (`app/layout.tsx:106-129`); 17 woff2 files in the build, three preloaded (~45+31+32 kB). Drop Caveat if only used decoratively and cut unused weights.
- **CSS:** 3 render-blocking stylesheets on the homepage (`/_next/static/css/*.css`), normal for Next; no `<link rel=preload>` for large images.
- **Video:** `public/hero-demo.mp4` is **12 MB**, the largest asset by far. It is referenced twice on the homepage with `preload="metadata"` for the in-page preview (`components/av/home/AvHomeIntro.tsx:228`) and `preload="none"` for the lightbox (`:271`), and once on `/what-we-do` (`WhatWeDoPage.tsx:251`). `preload="metadata"` still triggers a range request for the file head; no poster image; no WebM/lower-bitrate version. Likely hurts LCP/bandwidth on mobile if the video is in the viewport.
- **LCP:** The H1 is split into per-word spans animated in on `.isIn` after hydration (`AvHomeHero.module.css`, `useEffect`-driven), so the largest text paint waits on JS hydration; the page also renders `0/9` and `$0` counters in static HTML that count up on the client. CLS risk: the logo inside the H1 (96×52, lazy-loaded, `AvHomeHero.tsx:396`) is lazy-loaded despite being above the fold; remote Insights hero images use `fill` (good for CLS if the parent has dimensions).
- **INP:** Pointer/scroll listeners and IntersectionObservers drive many animations on the homepage (`components/av/home/*`); the whole-document `MutationObserver` from M-7 runs on every mutation.
- **Third parties:** Calendly only (consent-gated). No analytics, no tag manager, no external font CSS.
- **Compression/caching:** none configured in the repo (Next compresses by default, `compress` not disabled; static chunks are `immutable` by default; `/public` files such as the mp4 get no long cache by default). Confirm at nginx.
- **Images:** The site is almost image-free: 1 `<img>` on `/`, 1 on `/results` (Unsplash 400 px with `alt`), none elsewhere. All `<img>` have an `alt` attribute (0 missing; homepage logo and Insights card images use `alt=""`, intentionally decorative). Formats: WebP logo (mislabelled `.png`), remote hero images from the Content Engine (type/size unknown). `next/image` is used with `sizes` and `fill`.

---

## 7. Recommended fix order

1. **Brand rule in titles/descriptions (C-1)** — central template + 8 descriptions. Biggest ranking lever, smallest change.
2. **Homepage canonical + OG consolidation (C-2, C-3)** — one metadata helper; add `images` and correct `og:url` everywhere.
3. **Sitemap from the database with real `lastmod` (C-4, H-1)** and revalidate it on publish.
4. **BlogPosting JSON-LD + per-post OG image/author/modified time (C-4)**.
5. **Verify 404 status for missing insights; add `app/not-found.tsx` (H-5).**
6. **Decide the legacy pages (H-2):** rewrite or redirect `/results` and `/what-we-do`; hide `/benchmarks` and `/audits` until real.
7. **Search Console + GA4 behind consent; fix the privacy sentence (H-4).**
8. **Structured data upgrade (H-3):** WebSite, proper square logo, `sameAs` incl. Instagram, BreadcrumbList, VideoObject.
9. **Insights architecture (M-1, M-4):** categories, pagination, RSS, related agents/articles links.
10. **Performance:** compress/poster the 12 MB video, drop the hydration-noise observer (M-7), trim fonts/polyfills, eager-load the hero logo.
11. **Security/hygiene:** pin `images.remotePatterns` (M-8), remove the dead X link (L-2), fix heading levels in navbar/footer, rename generic anchors (M-6).
12. **Confirm nginx behaviour** (www/http redirects, caching, compression) with `curl -I`.
