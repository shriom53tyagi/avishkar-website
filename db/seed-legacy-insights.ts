/**
 * One-off seed: migrates the 10 posts that existed in the old static
 * InsightsPage/ArticlePage into the insights table.
 *
 * Only "the-practice-operating-system-nobody-sold-you" ever had a real
 * article body in the old code — the other 9 were index cards with no
 * article behind them. Their body_html here is placeholder copy built from
 * their existing title/dek, clearly marked, meant to be replaced by the
 * Content Engine.
 *
 * Safe to re-run: skips any slug that already exists.
 *
 * Usage: npm run db:seed-legacy
 */
import { createInsight, getInsightBySlug } from "@/lib/db";
import type { InsightPayload } from "@/lib/schemas/insight";

const NOW = new Date("2026-09-04T12:00:00Z");

function daysBefore(days: number): string {
  return new Date(NOW.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
}

function placeholderBody(dek: string, kicker: string): string {
  return `<p>${dek}</p><h2 id="s1">${kicker}</h2><p>This article was migrated from the site's earlier static content. The full piece has not been written yet — check back soon, or reach out to the editorial team for the complete version.</p>`;
}

const REAL_ARTICLE_BODY_HTML = `
<p>A practice at two million dollars in revenue and a practice at six million rarely differ in the quality of care. They differ in how many decisions the owner still has to make personally. Technology is how that gap closes — or doesn't.</p>
<p>The pattern we see over and over: nothing was chosen badly. The booking tool was right in year one. The EMR was right when the first injector joined. The spreadsheet was a reasonable stopgap. Each decision was locally correct and collectively expensive.</p>
<h2 id="s1">The accidental stack</h2>
<p>Ask a front desk lead to narrate a single patient visit and count the systems they touch. Six is common. Each boundary between two systems is a place where a human becomes the integration — retyping a phone number, re-checking a consent, remembering that this patient is mid-series.</p>
<blockquote>
  <div>&ldquo;The software wasn't the problem. The gaps between the software were the problem.&rdquo;</div>
  <cite>Owner, four-location medspa group</cite>
</blockquote>
<h2 id="s2">Four questions before you buy anything else</h2>
<ul>
  <li><strong>Who becomes the integration?</strong> If the answer is a person at the front desk, you are buying labor, not software.</li>
  <li><strong>Where does the patient record actually live?</strong> One system should be the source of truth. Every other tool should read from it.</li>
  <li><strong>Can you get your data out?</strong> An export button is not an API. Ask before signing, not at renewal.</li>
  <li><strong>Does it survive a second location?</strong> Per-site instances that can't roll up will force a migration exactly when you're busiest.</li>
</ul>
<h2 id="s3">Keep, connect, or build</h2>
<p>Sort every tool into one of three buckets. <strong>Keep</strong> the ones your team is fluent in and that hold clinical or financial record. <strong>Connect</strong> the ones that are fine but isolated. <strong>Build</strong> only where your model of care is genuinely unusual — a proprietary protocol, a membership structure nobody sells software for, a device that needs to talk to the chart.</p>
<p>Practices that skip the sorting exercise tend to over-build. Practices that never do it at all keep hiring around the problem.</p>
<h2 id="s4">What to do this quarter</h2>
<p>Pick the single handoff that costs your team the most time — usually the one between booking and the chart — and fix that one properly. Measure it before and after in hours, not opinions. A practice that closes one gap per quarter is unrecognizable in a year.</p>
`.trim();

const LEGACY_INSIGHTS: InsightPayload[] = [
  {
    slug: "the-practice-operating-system-nobody-sold-you",
    title: "The practice operating system nobody sold you",
    kicker: "Practice management",
    readTimeMinutes: 11,
    dek: "Most growing practices assemble their technology one urgent decision at a time. A framework for deciding what to keep, what to connect, and what to build — before the next location makes it harder.",
    heroImage: {
      url: "https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=1600&q=80",
      alt: "Clinic interior",
      tagChipText: "lead image · clinic interior, 16:9",
    },
    byline: { name: "Avishkar Editorial", publishedAt: daysBefore(0) },
    sections: [
      { id: "s1", heading: "The accidental stack", blocks: [] },
      { id: "s2", heading: "Four questions before you buy", blocks: [] },
      { id: "s3", heading: "Keep, connect, or build", blocks: [] },
      { id: "s4", heading: "What to do this quarter", blocks: [] },
    ],
    sources: [],
    bodyHtml: REAL_ARTICLE_BODY_HTML,
  },
  {
    slug: "the-real-cost-of-a-five-tool-front-desk",
    title: "The real cost of a five-tool front desk",
    kicker: "Operations",
    readTimeMinutes: 6,
    dek: "We timed the handoffs in three multi-room practices. The pattern was remarkably consistent — and expensive.",
    heroImage: {
      url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
      alt: "Front desk detail",
      tagChipText: "front desk detail",
    },
    byline: { name: "Avishkar Editorial", publishedAt: daysBefore(17) },
    sections: [{ id: "s1", heading: "Operations", blocks: [] }],
    sources: [],
    bodyHtml: placeholderBody(
      "We timed the handoffs in three multi-room practices. The pattern was remarkably consistent — and expensive.",
      "Operations",
    ),
  },
  {
    slug: "where-automation-belongs-and-where-it-doesnt",
    title: "Where automation belongs — and where it doesn't",
    kicker: "AI in aesthetics",
    readTimeMinutes: 8,
    dek: "A practical line between the messages a model should draft and the ones a nurse must read.",
    heroImage: {
      url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
      alt: "Treatment room detail",
      tagChipText: "treatment room detail",
    },
    byline: { name: "Avishkar Editorial", publishedAt: daysBefore(31) },
    sections: [{ id: "s1", heading: "AI in aesthetics", blocks: [] }],
    sources: [],
    bodyHtml: placeholderBody(
      "A practical line between the messages a model should draft and the ones a nurse must read.",
      "AI in aesthetics",
    ),
  },
  {
    slug: "memberships-are-a-data-problem-not-a-pricing-one",
    title: "Memberships are a data problem, not a pricing one",
    kicker: "Growth",
    readTimeMinutes: 5,
    dek: "Why retention programs stall when billing, booking and the chart don't share a definition of a member.",
    heroImage: {
      url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
      alt: "Membership dashboard",
      tagChipText: "membership dashboard",
    },
    byline: { name: "Avishkar Editorial", publishedAt: daysBefore(45) },
    sections: [{ id: "s1", heading: "Growth", blocks: [] }],
    sources: [],
    bodyHtml: placeholderBody(
      "Why retention programs stall when billing, booking and the chart don't share a definition of a member.",
      "Growth",
    ),
  },
  {
    slug: "what-a-second-location-breaks-first",
    title: "What a second location breaks first",
    kicker: "Operations",
    readTimeMinutes: 7,
    dek: "Inventory, provider credentials, and the schedule. In that order, almost every time.",
    heroImage: {
      url: "https://images.unsplash.com/photo-1608303588026-884930af2559?auto=format&fit=crop&w=1200&q=80",
      alt: "Two-location floorplan",
      tagChipText: "two-location floorplan",
    },
    byline: { name: "Avishkar Editorial", publishedAt: daysBefore(59) },
    sections: [{ id: "s1", heading: "Operations", blocks: [] }],
    sources: [],
    bodyHtml: placeholderBody(
      "Inventory, provider credentials, and the schedule. In that order, almost every time.",
      "Operations",
    ),
  },
  {
    slug: "consent-photos-and-the-paperwork-nobody-audits",
    title: "Consent, photos, and the paperwork nobody audits",
    kicker: "Technology",
    readTimeMinutes: 9,
    dek: "Aesthetic practices carry clinical risk with consumer-grade tooling. A calmer way to handle documentation.",
    heroImage: {
      url: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80",
      alt: "Chart interface",
      tagChipText: "chart interface",
    },
    byline: { name: "Avishkar Editorial", publishedAt: daysBefore(76) },
    sections: [{ id: "s1", heading: "Technology", blocks: [] }],
    sources: [],
    bodyHtml: placeholderBody(
      "Aesthetic practices carry clinical risk with consumer-grade tooling. A calmer way to handle documentation.",
      "Technology",
    ),
  },
  {
    slug: "the-first-ninety-seconds-of-a-patient-relationship",
    title: "The first ninety seconds of a patient relationship",
    kicker: "Patient experience",
    readTimeMinutes: 6,
    dek: "Intake is the only moment where every patient touches your technology. Most practices waste it.",
    heroImage: {
      url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
      alt: "Intake on tablet",
      tagChipText: "intake on tablet",
    },
    byline: { name: "Avishkar Editorial", publishedAt: daysBefore(84) },
    sections: [{ id: "s1", heading: "Patient experience", blocks: [] }],
    sources: [],
    bodyHtml: placeholderBody(
      "Intake is the only moment where every patient touches your technology. Most practices waste it.",
      "Patient experience",
    ),
  },
  {
    slug: "reading-your-schedule-like-a-pl",
    title: "Reading your schedule like a P&L",
    kicker: "Growth",
    readTimeMinutes: 8,
    dek: "Revenue per chair hour changes which appointments you actually want. Here's how to see it.",
    heroImage: {
      url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      alt: "Utilization chart",
      tagChipText: "utilization chart",
    },
    byline: { name: "Avishkar Editorial", publishedAt: daysBefore(98) },
    sections: [{ id: "s1", heading: "Growth", blocks: [] }],
    sources: [],
    bodyHtml: placeholderBody(
      "Revenue per chair hour changes which appointments you actually want. Here's how to see it.",
      "Growth",
    ),
  },
  {
    slug: "buying-vs-building-in-a-3m-practice",
    title: "Buying vs. building in a $3M practice",
    kicker: "Technology",
    readTimeMinutes: 10,
    dek: "A blunt decision tree for practice owners weighing another subscription against a custom build.",
    heroImage: {
      url: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
      alt: "Systems diagram",
      tagChipText: "systems diagram",
    },
    byline: { name: "Avishkar Editorial", publishedAt: daysBefore(119) },
    sections: [{ id: "s1", heading: "Technology", blocks: [] }],
    sources: [],
    bodyHtml: placeholderBody(
      "A blunt decision tree for practice owners weighing another subscription against a custom build.",
      "Technology",
    ),
  },
  {
    slug: "wellness-services-dont-fit-aesthetic-software",
    title: "Wellness services don't fit aesthetic software",
    kicker: "Wellness",
    readTimeMinutes: 7,
    dek: "Programs, packages and longitudinal care break tools designed around single treatments.",
    heroImage: {
      url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
      alt: "Wellness suite",
      tagChipText: "wellness suite",
    },
    byline: { name: "Avishkar Editorial", publishedAt: daysBefore(133) },
    sections: [{ id: "s1", heading: "Wellness", blocks: [] }],
    sources: [],
    bodyHtml: placeholderBody(
      "Programs, packages and longitudinal care break tools designed around single treatments.",
      "Wellness",
    ),
  },
];

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set. Aborting seed.");
    process.exit(1);
  }

  for (const payload of LEGACY_INSIGHTS) {
    const existing = await getInsightBySlug(payload.slug);
    if (existing) {
      console.log(`skip  ${payload.slug} (already exists)`);
      continue;
    }
    await createInsight(payload);
    console.log(`seed  ${payload.slug}`);
  }

  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
