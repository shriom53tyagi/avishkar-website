# SEO & Information Architecture Assessment — avishkar.app

Read-only audit. Stack: Next.js 15 App Router, `app/` directory only (no Pages Router — no migration debt).

---

## ⚠️ Positioning mismatch — read this first

The brief for this audit describes the product as **"Loomis," an AI voice agent for US medspas** targeting queries like "medspa answering service" / "AI receptionist for medspa" / "missed call medspa booking."

The actual codebase is a completely different product: **"Avishkar AI,"** a _healthcare operational-intelligence and revenue-recovery platform for hospitals and clinics_, built around EMR/billing/scheduling audits, claim-denial management, and patient no-show reduction. This is present everywhere — `app/layout.tsx` metadata, `lib/schema.ts`, `lib/resources.ts` (6 SEO articles on denial rates / no-show benchmarks / revenue leakage), the Navbar, Footer, Hero copy, and `lib/data.ts`.

There is no mention of "Loomis," medspas, voice receptionists, or missed-call recovery anywhere in the repo. Everything in Phase 3 below is written against **what actually exists** (Avishkar/healthcare). If Loomis/medspa is in fact the real target product, either this is the wrong repo/branch, or the site is mid-rebrand and the content hasn't caught up — worth confirming before building anything on top of the medspa positioning.

---

## Phase 1 — Inventory

### Routing (App Router only)

| Route                                           | File                                                                         |
| ----------------------------------------------- | ---------------------------------------------------------------------------- |
| `/`                                             | `app/page.tsx`                                                               |
| `/contact`                                      | `app/contact/page.tsx`                                                       |
| `/careers`                                      | `app/careers/page.tsx`                                                       |
| `/privacy`                                      | `app/privacy/page.tsx`                                                       |
| `/terms`                                        | `app/terms/page.tsx`                                                         |
| `/resources`                                    | `app/resources/page.tsx`                                                     |
| `/resources/[slug]`                             | `app/resources/[slug]/page.tsx` (6 static params via `generateStaticParams`) |
| `/api/chat`, `/api/visitors`, `/api/voice-note` | route handlers, correctly excluded from crawling                             |

No `not-found.tsx` at root (Next falls back to default 404, unstyled). No route groups. No Pages Router coexistence.

Resource slugs (`lib/resources.ts`): `no-show-benchmarks`, `denial-rate-benchmarks`, `calculate-revenue-leakage`, `healthcare-revenue-leakage`, `reduce-claim-denials`, `reduce-patient-no-shows`.

### Per-page metadata

**`/` (`app/page.tsx`, metadata inherited from root `layout.tsx`)**

- Title: `"Avishkar AI"` → renders as `"Avishkar AI · Avishkar AI"`... actually root `title.default` has no template applied to itself, but note the **trailing space** in `"Avishkar AI "` (layout.tsx:158) — sloppy, shows in tab title.
- Description: present, keyword-rich (healthcare operational intelligence, revenue leakage, denial management, HIPAA).
- OG: title/description/image (`/og-image.png`) present. **`/og-image.png` was not verified to exist in `public/`** — only `logo.png` and `hero-demo.mp4` are in `public/`, so this OG image reference is likely broken.
- Twitter: present, `summary_large_image`.
- Canonical: **absent** — no `alternates.canonical` anywhere in the codebase (checked every metadata export).
- H1: exactly 1 (`Hero.tsx:56`, "Find the leak. Recover the revenue.") — good, no duplication.
- Word count: ~170 words of literal JSX text in `page.tsx` itself, but actual rendered word count is much higher since content lives in imported section components (`Agents`, `Results`, `WhyDifferent`, `FAQ`, etc. pull from `lib/data.ts` arrays) — homepage is not thin in practice, just data-driven rather than hardcoded.
- JSON-LD: `FAQPage` schema injected inline (`app/page.tsx:25`), `Organization` schema injected globally in `layout.tsx:230`. **`serviceSchema` is defined in `lib/schema.ts:79` but never imported or rendered anywhere in the app** — dead code, a missed opportunity since it's the schema type most relevant to describing what Avishkar sells.

**`/contact`**

- Title: `"Book an Operational Audit"` → resolves via template to `"Book an Operational Audit · Avishkar AI"`. Good, specific.
- Description: present, on-topic.
- OG: partial override (title/description/url) — inherits image/type from root, fine.
- Canonical: absent.
- H1 via `PageHeader`: 1. Good.
- Word count: ~526 (JSX literal).
- Internal links: none _to_ other pages (calendar embed + voice note + mailto only) — no link back to `/resources` or `/`.

**`/careers`**

- Title: `"Careers"` → `"Careers · Avishkar AI"`.
- Description: present, on-topic.
- OG: partial override, no dedicated image.
- Canonical: absent.
- H1: 1. Word count: ~517.
- Internal links out: none (all CTAs are `mailto:`). No inbound links except Footer.

**`/privacy`, `/terms`**

- Titles/descriptions present but minimal (no OG override, inherits root OG image/copy which is off-topic for a legal page — low priority but worth a plain `noindex`-style treatment since these shouldn't compete for rankings anyway; currently they're fully indexable with generic homepage OG data).
- H1: 1 each. Word count: 306 / 237 — thin, acceptable for legal boilerplate.
- **Content bug, not just SEO**: both pages reference `info@avishakar.com` (misspelled domain — extra "a") while every other file in the codebase (`lib/data.ts`, JSON-LD `contactPoint`) uses `info@avishkar.app`. This is a real, live discrepancy in externally-facing legal copy.

**`/resources`**

- Title: `"Healthcare Operations Resources"`, description good.
- OG override present.
- Canonical: absent.
- H1: 1. Word count: ~435 (plus 6 dynamically-rendered card summaries).
- Internal links: strong — links to all 6 resource articles, links to `/contact`. This is the best internally-linked page on the site.

**`/resources/[slug]`** (6 pages, `generateMetadata` per-article)

- Title: `resource.metaTitle` — per-article, unique, keyword-targeted (e.g. `"No-Show Rate Benchmarks by Medical Specialty 2025 | Avishkar AI"`). This is the **only route using a different title convention** (raw suffix with `|` instead of the root's `%s · Avishkar AI` template) — inconsistent but not wrong.
- Description: per-article, unique, substantive.
- OG: `type: "article"`, `publishedTime` set — correctly typed for content pages. **No Twitter card override** (falls back to root Twitter card, which shows the homepage's OG image/copy, not the article's) — mismatch for social shares of articles.
- Canonical: absent.
- H1: 1 per article (`resource.headline`).
- Word count: these are the most substantial pages on the site — full sections with stats/tables/callouts, easily 800–1500+ words each based on the 710-line data file backing 6 articles.
- Internal links: each article has a `relatedLinks` array (article→article) plus a CTA to `/contact` — good internal linking discipline, better than the static pages.
- Images: none in article template — no OG-eligible content image beyond the auto-generated `opengraph-image.tsx`.

### Root SEO infrastructure

- **`robots.txt`** — dynamically generated via `app/robots.ts`. Allows `/`, disallows `/api/`, correctly references `${SITE_URL}/sitemap.xml`. No issues, no accidental blocking.
- **`sitemap.xml`** — dynamically generated via `app/sitemap.ts`, **but incomplete**: it lists `/`, `/contact`, `/careers`, `/privacy`, `/terms` — it's **missing `/resources` and all 6 `/resources/[slug]` articles**, which are the site's most substantial, most link-worthy, most keyword-targeted content. These 7 URLs are fully built, statically generated (`generateStaticParams`), internally linked, and crawlable — they're just invisible to the sitemap. `lastModified` is `new Date()` computed at build/request time for every entry (not real per-page dates), so "lastmod" is meaningless as a freshness signal.
- **No `next-sitemap` package** — using Next's native `MetadataRoute.Sitemap`, which is fine, but explains why new routes aren't auto-included; someone has to remember to add each one manually (the file's own comment says "Add a new page -> add a line here" — the resources routes were simply never added).
- **Structured data**: `Organization` (sitewide, `layout.tsx`) and `FAQPage` (homepage only) are actually rendered. `Service` schema exists in code but is orphaned/unused. No `Article` schema on the 6 resource pages despite them being genuine long-form articles with publish dates — a clear miss for rich-result eligibility.
- **`next.config.ts`**: no redirects/rewrites configured (nothing to break crawlability). `images.remotePatterns` only allows `images.unsplash.com` — fine since actual images are local (`/public`). Security headers (HSTS, X-Frame-Options, etc.) are set globally and don't interfere with crawling.
- **Favicon/manifest**: `icons.icon`/`icons.apple` both point to `/logo.png` (works, but not a real favicon — no multi-size `.ico`/PNG set, no `manifest.json`/`site.webmanifest` for PWA metadata). Minor.

### Performance-adjacent signals

- `next/image` is used in exactly 2 components (`DuotonePhoto.tsx`, `Logo.tsx`) — the 4 photographic images on the homepage (Results, WhyDifferent, Agents, RevenueMetrics sections) all go through `next/image` with **descriptive, on-topic alt text** (100% coverage, verified — "Healthcare finance executive," "Clinician reviewing operational and billing data," etc.). No raw `<img>` tags anywhere.
- The homepage hero uses a raw `<video>` tag (12MB `hero-demo.mp4`, `autoPlay muted loop`, `preload="metadata"`) — not an SEO issue directly, but a real page-weight/LCP concern given the file size sits in `public/` at ~12MB and autoplays above the fold.
- Fonts: `Inter` + `JetBrains_Mono` via `next/font/google` with `display: "swap"` — correctly self-hosted/optimized, no external font-loading blocking.
- `app/layout.tsx` injects a fairly large inline `<script>` (`SUPPRESS_HYDRATION_NOISE`, ~100 lines) directly in `<head>`, executed synchronously before hydration. It's small in bytes and not render-blocking in the CSS sense, but it does monkey-patch `Element.prototype.setAttribute` and `console.error` globally on every page load — unusual for a production `<head>`, worth knowing about if any crawler/tooling behaves oddly, though it's unlikely to affect Googlebot's rendering.
- Metadata is **static per page** (no dynamic per-route computation) except `/resources/[slug]`, which correctly uses `generateMetadata()` driven by the `resources.ts` data array. This pattern already proves out dynamic metadata works in this codebase — the same approach can be reused for future service pages driven by a data file.

### Content model

- `lib/resources.ts` is a genuine structured content model: typed `Resource` objects with `sections[]` supporting `body`, `stats`, `table`, `list`, and `callout` blocks, each rendered generically by `app/resources/[slug]/page.tsx`. This is effectively a lightweight CMS-in-code and is **directly reusable** for any new templated page type (e.g. service pages) — the section-block renderer, stat-grid, table, and callout components already exist and are style-consistent.
- Existing reusable design-system components confirmed: `PageHeader` (eyebrow + H1 + description, used by every non-homepage page), `Reveal` (scroll-in animation wrapper), `surface` utility class (card styling used everywhere), category badge pattern (`CATEGORY_LABELS`/`CATEGORY_ICONS`/`CATEGORY_COLORS` in `resources/page.tsx`), CTA block pattern (heading/body/primary+secondary buttons, repeated identically across `resources/[slug]` and elsewhere). No FAQ accordion or pricing table component currently exists (FAQ section on homepage is a flat list, not a collapsible accordion — check `components/sections/FAQ.tsx` if an accordion pattern is needed later).
- No existing "service" or "product" page concept at all — `NAV_LINKS` in `lib/data.ts` only points to homepage anchor sections (`/#why`, `/#engine`, etc.), not standalone pages. There is no `/services` anything today.

---

## Phase 2 — Gap Analysis

| Page                    | Title tag OK?                      | Meta description OK?  | H1 OK? | Schema present?                                     | Internal links in/out                                                                    | Word count               | Verdict                                                                |
| ----------------------- | ---------------------------------- | --------------------- | ------ | --------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------ | ---------------------------------------------------------------------- |
| `/`                     | ⚠️ trailing space in default title | ✅                    | ✅ (1) | ✅ Organization + FAQPage (Service schema orphaned) | In: nav/footer everywhere. Out: `/contact` only                                          | Data-driven, substantial | **Needs work**                                                         |
| `/contact`              | ✅                                 | ✅                    | ✅ (1) | ➖ (inherits Organization only)                     | In: nav, footer, homepage CTA. Out: none                                                 | ~526                     | **Needs work** (no outbound links)                                     |
| `/careers`              | ✅                                 | ✅                    | ✅ (1) | ➖                                                  | In: footer only. Out: none                                                               | ~517                     | Good                                                                   |
| `/privacy`              | ✅ (thin)                          | ✅ (thin)             | ✅ (1) | ➖                                                  | In: footer only. Out: none                                                               | 306                      | Good (low-priority page)                                               |
| `/terms`                | ✅ (thin)                          | ✅ (thin)             | ✅ (1) | ➖                                                  | In: footer only. Out: none                                                               | 237                      | Good (low-priority page)                                               |
| `/resources`            | ✅                                 | ✅                    | ✅ (1) | ➖ (no `CollectionPage`/`ItemList`)                 | In: footer("Resources" links point elsewhere — see below). Out: all 6 articles + contact | ~435 + cards             | **Needs work** (missing from sitemap)                                  |
| `/resources/[slug]` × 6 | ✅ unique per article              | ✅ unique per article | ✅ (1) | ❌ no `Article` schema                              | In: `/resources` index only — **not linked from nav, footer, or homepage**               | 800–1500+ each           | **Needs work** (missing from sitemap, no Article schema, under-linked) |

Note: the Footer's "Resources" column (`components/ui/Footer.tsx:29-37`) doesn't actually link to `/resources` or any article — it links to homepage anchors (`/#engine`, `/#security`, `/#results`) and `/contact`. The footer column is mislabeled; the real resources hub has no footer/nav presence at all.

### Direct answers

**Is there a dedicated page that could rank for "AI voice agent for medspas" / "medspa front desk AI"?**
No — and this is moot for the current codebase, because the site isn't about medspas or voice agents at all; it's a healthcare-operations-audit platform for hospitals/clinics. If Loomis/medspa is genuinely the product going forward, that intent is **100% unaddressed**: zero pages, zero content, zero schema, nothing in `lib/data.ts` or `lib/resources.ts` touches medspas, voice receptionists, or missed-call recovery. This would be a from-scratch build, not a gap-fill.

**Single biggest structural blocker to organic visibility right now?**
The **incomplete sitemap** is the highest-impact, lowest-effort fix: 7 fully-built, well-written, internally-consistent, keyword-targeted pages (`/resources` + 6 articles) are invisible to `sitemap.xml`, under-linked from nav/footer, and missing `Article` schema despite being the strongest content on the site. Fixing the one-line omission in `app/sitemap.ts` and adding the missing `Article` JSON-LD is the single highest-ROI action available before any new pages are built.

---

## Phase 3 — Service Page Recommendation

**Caveat repeated**: everything below is written against the actual product in this repo (Avishkar / healthcare operational intelligence), not "Loomis / medspa," since that product doesn't exist in this codebase. If the real target is Loomis, treat this section as a template to re-run once medspa positioning/content actually exists, not as directly actionable.

### URL structure

Recommend a **`/services` hub + `/services/[slug]` detail pages**, mirroring the `/resources` + `/resources/[slug]` pattern that already exists and works (per Phase 1's content-model findings: the section-block renderer, `generateStaticParams`, `generateMetadata`, `PageHeader`, CTA block, and related-links pattern are all directly reusable with zero new components). A single flat `/services` page with anchors would waste the one piece of infrastructure this codebase already has proven out.

### Page list (ranked by likely search-intent match, using the actual Avishkar service line)

1. Operational Intelligence Audit (the core offering — already has a `Service` JSON-LD written, just orphaned) — highest intent match, direct product page.
2. Claim Denial Management / AI Denial Triage — matches `reduce-claim-denials` resource article already published; a service page here captures commercial-intent traffic the article can't (article is informational, not transactional).
3. Patient No-Show Reduction — same logic, pairs with `reduce-patient-no-shows` article.
4. Revenue Leakage Recovery (EMR/billing/scheduling) — pairs with `healthcare-revenue-leakage` and `calculate-revenue-leakage` articles.

Each of these already has a matching top-of-funnel article in `lib/resources.ts` — building the service page is the missing bottom-of-funnel counterpart, and the `relatedLinks` field already on every resource object gives a ready-made slot to cross-link article → service page.

### Per-page metadata template

Follow the convention already established by `/resources/[slug]`'s `generateMetadata()` (the strongest existing pattern):

- Title: `"{Specific Service Name} for Hospitals & Clinics | Avishkar AI"` — matches the resources pages' `| Avishkar AI` suffix, not the root's `%s · Avishkar AI` template (worth picking one convention sitewide, but if forced to choose, standardize on the resources pattern since it's already used for the highest-value pages).
- Description: problem → mechanism → outcome, under ~160 chars, matching the tone of existing `metaDescription` fields.
- H1: `PageHeader` component, same as every other page — eyebrow + H1 + supporting description, zero new component work.
- **Add `alternates: { canonical: ... }`** on every service page metadata export — currently absent sitewide, and it matters most on pages with any risk of duplicate/near-duplicate content (service pages describing overlapping offerings).

### Schema plan

- `Service` type (the exact shape already written in `lib/schema.ts:79` — just needs to actually be rendered per-page instead of sitting unused, one `serviceType` value per page).
- `BreadcrumbList` for `/services/[slug]` (Home → Services → [Service]) — not present anywhere on the site currently, cheap to add, helps rich-result breadcrumb display.
- Keep `Organization` inherited from root layout (already correct).

### Internal linking plan

- **Nav**: add "Services" to `NAV_LINKS` in `lib/data.ts` — currently every nav link is a homepage anchor; this would be the first real top-level nav destination.
- **Footer**: fix the mislabeled "Resources" column (currently links to homepage anchors) and add a genuine "Services" column — this reuses an existing structural slot rather than growing the footer.
- **Homepage**: link from `Agents` / `AuditEngine` sections (which already describe these offerings in prose) directly to their corresponding `/services/[slug]` page.
- **From resources articles**: use the existing `relatedLinks` field to point each article at its matching service page (e.g. `reduce-claim-denials` → `/services/claim-denial-management`).
- **Service pages should link to**: `/contact` (primary CTA, matching every other page's pattern), the matching `/resources/[slug]` article (for readers wanting the data/evidence first), and sibling service pages.

### What NOT to build yet

- **Any new page** before fixing `app/sitemap.ts` to include `/resources` + the 6 existing articles — shipping more unindexed content on top of already-unindexed content compounds the problem.
- **`Article` schema and Twitter-card overrides for resource articles** should land before service pages — cheap, high-leverage, and touches infrastructure the service pages will also depend on (`generateMetadata` pattern, JSON-LD injection).
- A pricing/comparison page — no pricing table component exists yet, and the product's sales motion (audit-first, fixed-scope) doesn't map cleanly to a self-serve pricing grid; premature until sales motion is more standardized.
- A blog/CMS integration — the current in-code `Resource[]` array in `lib/resources.ts` is working fine at 6 articles; don't add MDX/headless-CMS infrastructure until that array is unwieldy (20+ articles).
- Multi-language/locale routing — no signal anywhere in the codebase that this is needed.

---

## Prioritized action list (max 10, ordered by impact/effort)

1. **Add `/resources` + all 6 `/resources/[slug]` URLs to `app/sitemap.ts`.** One-line-per-route fix; the highest-value content on the site is currently invisible to search engines.
2. **Render the existing but orphaned `serviceSchema` from `lib/schema.ts` on the homepage** (it's already written, just needs a `<JsonLd data={serviceSchema} />` import in `app/page.tsx`).
3. **Fix the Footer "Resources" column** to actually link to `/resources` and its articles instead of homepage anchors — currently the real content hub has zero nav/footer presence.
4. **Add `Article` JSON-LD schema to `app/resources/[slug]/page.tsx`** — these are genuine dated long-form articles with none of the structured data that qualifies them for rich results.
5. **Add `alternates.canonical` to every page's metadata export** — absent sitewide, zero-risk, low-effort, standard hygiene.
6. **Fix `info@avishakar.com` → `info@avishkar.app`** in `app/privacy/page.tsx` and `app/terms/page.tsx` — live, real, externally-visible discrepancy from the domain used everywhere else in the codebase.
7. **Verify `/og-image.png` actually exists** — referenced in root metadata (`app/layout.tsx:186`) but not found in `public/`; if missing, every social share of the homepage is broken.
8. **Fix trailing space in `title.default: "Avishkar AI "`** (`app/layout.tsx:158`) — cosmetic but visible in every browser tab and SERP title for the homepage.
9. **Add per-article Twitter card overrides in `app/resources/[slug]/page.tsx`'s `generateMetadata()`** — currently falls back to the homepage's Twitter image/copy when an article is shared.
10. **Resolve the product/positioning question (Avishkar vs. Loomis) before any further SEO or content investment** — every recommendation above optimizes the current Avishkar/healthcare-audit content; if the real target is a medspa voice-agent product, none of the existing pages, schema, or resource articles serve that intent, and this is a from-scratch content build, not a gap-f
