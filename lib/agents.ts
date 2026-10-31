/**
 * The agent library.
 *
 * Adding an agent means adding one entry here. Everything else — the library
 * grouping on /agents, the category filter, the four cards on the home page,
 * the detail page at /agents/[slug], the footer list, the sitemap and the
 * structured data — reads from this file. No layout work per agent.
 *
 * `status` is the only field that changes when an agent ships: flip it to
 * "live" and give it a `demoUrl`, and the card grows a "Try agent" CTA.
 */

export type AgentCategory = "Insights" | "Growth" | "Front office" | "Clinical ops" | "Revenue";

export type AgentStatus = "live" | "in_development";

export type AgentOutput = {
  /** One of: what happened, why it matters, what to do next. */
  label: string;
  detail: string;
};

export type Agent = {
  slug: string;
  name: string;
  category: AgentCategory;
  status: AgentStatus;
  /** Card copy and detail-page subhead. Plain English, max ~18 words. */
  oneLiner: string;
  /** Two or three sentences for "What it does". */
  what: string;
  /** Plain labels for "What it analyzes". */
  analyzes: string[];
  /** Three rows for "What you get". */
  outputs: AgentOutput[];
  /** Where "Try agent" goes. Live agents only. */
  demoUrl?: string;
  /** Compact three-step workflow shown on cards. Optional; a fallback is derived. */
  workflow?: {
    from: string;
    action: string;
    to: string;
  };
  /** Picks the cards shown in the home page preview. */
  featured?: boolean;
  /** Up to three slugs shown at the foot of the detail page. */
  related?: string[];
};

/** Display order of categories in the filter row. */
export const AGENT_CATEGORIES: AgentCategory[] = [
  "Insights",
  "Growth",
  "Front office",
  "Clinical ops",
  "Revenue",
];

const OUT = {
  happened: "What happened",
  matters: "Why it matters",
  next: "What to do next",
};

export const AGENTS: Agent[] = [
  /* ── Insights ──────────────────────────────────────────────────────── */
  {
    slug: "win-loss-analyst",
    name: "Win-Loss Analyst",
    category: "Insights",
    status: "live",
    // Paste the demo route or app URL here and the detail page grows a
    // "Try agent" CTA. Until then the page invites a walkthrough instead.
    demoUrl: undefined,
    featured: true,
    workflow: { from: "Consultations", action: "Analyze", to: "Insight" },
    oneLiner:
      "See what your practice is winning, losing, why, and where the biggest opportunities are.",
    what: "The Win-Loss Analyst reads your consultation and lead history and separates the work you won from the work you lost. It groups the losses by reason, service, source and price point, so the pattern behind them is visible instead of anecdotal.",
    analyzes: [
      "Consultations",
      "Lead sources",
      "Services",
      "Pricing",
      "Follow-up activity",
      "Loss reasons",
    ],
    outputs: [
      {
        label: OUT.happened,
        detail:
          "Your win rate over the period, broken down by service, source, provider and price point.",
      },
      {
        label: OUT.matters,
        detail:
          "The reasons behind the losses, ranked by how much opportunity sits behind each one.",
      },
      {
        label: OUT.next,
        detail: "The specific segments worth acting on first, and what the change would be worth.",
      },
    ],
    related: ["service-mix-analyst", "pricing-analyst", "follow-up-agent"],
  },
  {
    slug: "practice-performance-analyst",
    name: "Practice Performance Analyst",
    category: "Insights",
    status: "in_development",
    oneLiner: "One clear read on how the practice is performing week to week.",
    what: "Pulls the numbers your team already tracks in three or four different places into a single weekly read. It reports movement and the likely cause, not a wall of charts.",
    analyzes: [
      "Bookings",
      "Consultations",
      "Treatments performed",
      "Revenue by service",
      "Provider schedules",
    ],
    outputs: [
      { label: OUT.happened, detail: "Week-over-week movement across the numbers that matter." },
      { label: OUT.matters, detail: "Which changes are noise and which are a real shift." },
      { label: OUT.next, detail: "The one or two areas worth attention this week." },
    ],
    related: ["win-loss-analyst", "service-mix-analyst", "provider-utilization-analyst"],
  },
  {
    slug: "service-mix-analyst",
    name: "Service Mix Analyst",
    category: "Insights",
    status: "in_development",
    oneLiner: "Understand which services carry the practice and which quietly cost you.",
    what: "Looks at what you actually deliver, how often, at what price, and with how much provider time behind it. Surfaces the services worth promoting and the ones worth repricing or retiring.",
    analyzes: [
      "Treatments performed",
      "Service pricing",
      "Provider time",
      "Repeat rates",
      "Demand by season",
    ],
    outputs: [
      {
        label: OUT.happened,
        detail: "Your real service mix by volume, revenue and provider hours.",
      },
      { label: OUT.matters, detail: "Where the mix works against capacity or margin." },
      { label: OUT.next, detail: "Services to push, reprice, bundle or step away from." },
    ],
    related: ["pricing-analyst", "win-loss-analyst", "membership-agent"],
  },
  {
    slug: "pricing-analyst",
    name: "Pricing & Package Analyst",
    category: "Insights",
    status: "in_development",
    oneLiner: "See how pricing and packages affect what patients actually say yes to.",
    what: "Compares acceptance across price points, packages and payment options. Shows where a package converts better than a single treatment, and where discounting changed nothing.",
    analyzes: [
      "Quoted prices",
      "Accepted prices",
      "Package uptake",
      "Payment plan use",
      "Discounting",
    ],
    outputs: [
      {
        label: OUT.happened,
        detail: "Acceptance rates across every price point and package you offer.",
      },
      { label: OUT.matters, detail: "Which discounts bought volume and which gave away margin." },
      { label: OUT.next, detail: "Package and price changes to test, with the expected effect." },
    ],
    related: ["service-mix-analyst", "win-loss-analyst", "consult-conversion-agent"],
  },
  {
    slug: "marketing-attribution-analyst",
    name: "Marketing Attribution Analyst",
    category: "Insights",
    status: "in_development",
    oneLiner: "Know which marketing brings patients who actually book and return.",
    what: "Follows each lead source through to treatment and repeat visits, not just to form fill. Tells you which spend produces patients and which produces inquiries.",
    analyzes: [
      "Lead sources",
      "Campaign spend",
      "Consultations booked",
      "Treatments completed",
      "Repeat visits",
    ],
    outputs: [
      {
        label: OUT.happened,
        detail: "Leads, consultations and treatments attributed to each source.",
      },
      { label: OUT.matters, detail: "Cost per patient by channel, not cost per lead." },
      { label: OUT.next, detail: "Where to move budget, and what to stop paying for." },
    ],
    related: ["lead-response-agent", "win-loss-analyst", "review-referral-agent"],
  },
  {
    slug: "provider-utilization-analyst",
    name: "Provider Utilization Analyst",
    category: "Insights",
    status: "in_development",
    oneLiner: "See how provider and room time is really being used across the week.",
    what: "Compares booked time against available time by provider, room and day. Surfaces the recurring gaps and the overloaded blocks behind them.",
    analyzes: [
      "Provider schedules",
      "Room availability",
      "Appointment lengths",
      "Cancellations",
      "Walk-ins",
    ],
    outputs: [
      { label: OUT.happened, detail: "Utilization by provider, room and day of week." },
      {
        label: OUT.matters,
        detail: "Where capacity is lost to gaps, overruns or scheduling rules.",
      },
      { label: OUT.next, detail: "Schedule changes that would recover the most usable time." },
    ],
    related: ["scheduling-waitlist-agent", "practice-performance-analyst", "no-show-agent"],
  },

  /* ── Growth ────────────────────────────────────────────────────────── */
  {
    slug: "lead-response-agent",
    name: "Lead Response Agent",
    category: "Growth",
    status: "in_development",
    featured: true,
    workflow: { from: "New lead", action: "Response", to: "Opportunity" },
    oneLiner: "Help your team respond to new opportunities quickly and consistently.",
    what: "Watches every inbound channel and makes sure a new inquiry gets a real, useful first response in minutes. Your team keeps control of the conversation; the agent makes sure it starts.",
    analyzes: [
      "Inbound forms",
      "Calls and texts",
      "Social messages",
      "Response times",
      "Booking outcomes",
    ],
    outputs: [
      {
        label: OUT.happened,
        detail: "Every new inquiry with its channel and first-response time.",
      },
      { label: OUT.matters, detail: "Where slow or missed first responses are costing bookings." },
      { label: OUT.next, detail: "A drafted first response and a booking path for each lead." },
    ],
    related: ["follow-up-agent", "front-desk-agent", "marketing-attribution-analyst"],
  },
  {
    slug: "follow-up-agent",
    name: "Follow-Up Agent",
    category: "Growth",
    status: "in_development",
    featured: true,
    workflow: { from: "Lead", action: "Attention", to: "Follow-up" },
    oneLiner: "Identify leads and consultations that still need attention.",
    what: "Keeps a live list of the people who showed interest and never came back, ordered by how promising they are. Nothing falls through because someone forgot to check a list.",
    analyzes: [
      "Open consultations",
      "Unbooked leads",
      "Last contact date",
      "Quoted treatments",
      "Stated intent",
    ],
    outputs: [
      {
        label: OUT.happened,
        detail: "Who is waiting on you, and how long they have been waiting.",
      },
      { label: OUT.matters, detail: "Which of them are still realistically winnable." },
      { label: OUT.next, detail: "A prioritized follow-up list with suggested next contact." },
    ],
    related: ["lead-response-agent", "consult-conversion-agent", "reactivation-agent"],
  },
  {
    slug: "reactivation-agent",
    name: "Reactivation Agent",
    category: "Growth",
    status: "in_development",
    featured: true,
    workflow: { from: "Patient base", action: "Identify", to: "Opportunity" },
    oneLiner: "Find opportunities in your existing patient base.",
    what: "Looks through patients you have already treated for the ones who are due, lapsed or a natural fit for something else. Growth from people who already trust you.",
    analyzes: [
      "Treatment history",
      "Visit intervals",
      "Lapsed patients",
      "Service affinities",
      "Contact preferences",
    ],
    outputs: [
      { label: OUT.happened, detail: "Segments of past patients who are due or lapsed." },
      { label: OUT.matters, detail: "Which segments are most likely to return, and for what." },
      { label: OUT.next, detail: "Reactivation lists with a suggested offer and channel." },
    ],
    related: ["follow-up-agent", "membership-agent", "post-treatment-agent"],
  },
  {
    slug: "consult-conversion-agent",
    name: "Consult-to-Treatment Agent",
    category: "Growth",
    status: "in_development",
    oneLiner: "Support the gap between a good consultation and a booked treatment.",
    what: "Tracks each consultation from the room to the calendar and flags the ones stalling. Gives the coordinator the context and the next step rather than a reminder to try harder.",
    analyzes: [
      "Consultation notes",
      "Quoted treatments",
      "Deposits taken",
      "Objections raised",
      "Booking status",
    ],
    outputs: [
      {
        label: OUT.happened,
        detail: "Consultations that did not convert, with where they stalled.",
      },
      { label: OUT.matters, detail: "The objections and gaps that appear again and again." },
      { label: OUT.next, detail: "A per-patient next step for the coordinator to take." },
    ],
    related: ["follow-up-agent", "pricing-analyst", "win-loss-analyst"],
  },
  {
    slug: "membership-agent",
    name: "Membership & Package Agent",
    category: "Growth",
    status: "in_development",
    oneLiner: "Keep memberships and treatment packages used, renewed and worth having.",
    what: "Tracks who has unused sessions, who is due to renew and who is drifting away. Turns a spreadsheet nobody maintains into a working list.",
    analyzes: [
      "Active memberships",
      "Unused sessions",
      "Renewal dates",
      "Usage patterns",
      "Cancellations",
    ],
    outputs: [
      { label: OUT.happened, detail: "Membership and package status across the base." },
      { label: OUT.matters, detail: "Where unused value is heading toward a cancellation." },
      { label: OUT.next, detail: "Who to contact this week, and about what." },
    ],
    related: ["reactivation-agent", "service-mix-analyst", "payments-agent"],
  },
  {
    slug: "review-referral-agent",
    name: "Review & Referral Agent",
    category: "Growth",
    status: "in_development",
    oneLiner: "Ask the right patients for a review or referral at the right moment.",
    what: "Identifies the patients most likely to say something good, and the moment just after treatment when they would mean it. Timing, not volume.",
    analyzes: [
      "Completed treatments",
      "Visit history",
      "Existing reviews",
      "Referral sources",
      "Contact preferences",
    ],
    outputs: [
      { label: OUT.happened, detail: "Recent treatments that are strong review candidates." },
      {
        label: OUT.matters,
        detail: "Which patients are advocates and which should be left alone.",
      },
      { label: OUT.next, detail: "A short, timed ask list for the front desk." },
    ],
    related: ["post-treatment-agent", "marketing-attribution-analyst", "reactivation-agent"],
  },

  /* ── Front office ──────────────────────────────────────────────────── */
  {
    slug: "front-desk-agent",
    name: "Front Desk Agent",
    category: "Front office",
    status: "in_development",
    oneLiner: "Answer routine calls and messages so your team can stay with patients.",
    what: "Handles the questions your front desk answers fifty times a week — hours, pricing ranges, directions, availability — and hands anything real to a person with the context attached.",
    analyzes: [
      "Inbound calls",
      "Text and chat messages",
      "Common questions",
      "Availability",
      "Handoff outcomes",
    ],
    outputs: [
      { label: OUT.happened, detail: "What was asked, what was answered, what was escalated." },
      { label: OUT.matters, detail: "Which repeat questions are eating front desk time." },
      { label: OUT.next, detail: "Clean handoffs with full context, and no missed messages." },
    ],
    related: ["lead-response-agent", "scheduling-waitlist-agent", "intake-agent"],
  },
  {
    slug: "scheduling-waitlist-agent",
    name: "Scheduling & Waitlist Agent",
    category: "Front office",
    status: "in_development",
    oneLiner: "Fill the gaps in the schedule from the people already waiting.",
    what: "When a slot opens, it knows who wanted it. Matches cancellations against the waitlist by service, provider and preference instead of a blast to everyone.",
    analyzes: [
      "Open slots",
      "Cancellations",
      "Waitlist entries",
      "Provider rules",
      "Patient preferences",
    ],
    outputs: [
      { label: OUT.happened, detail: "Gaps created and gaps filled, day by day." },
      { label: OUT.matters, detail: "How much bookable time is being lost to short-notice gaps." },
      { label: OUT.next, detail: "The right patient to offer each open slot to." },
    ],
    related: ["no-show-agent", "provider-utilization-analyst", "front-desk-agent"],
  },
  {
    slug: "intake-agent",
    name: "Intake & Forms Agent",
    category: "Front office",
    status: "in_development",
    oneLiner: "Get paperwork done before the patient arrives, without chasing.",
    what: "Sends the right forms for the right appointment type, follows up on the ones that are not back, and flags what is missing before the patient is in the chair.",
    analyzes: [
      "Appointment types",
      "Required forms",
      "Completion status",
      "Consent records",
      "Missing fields",
    ],
    outputs: [
      { label: OUT.happened, detail: "Intake status for every upcoming appointment." },
      {
        label: OUT.matters,
        detail: "Which appointments are at risk of starting late or incomplete.",
      },
      { label: OUT.next, detail: "Targeted reminders and a clean pre-visit checklist." },
    ],
    related: ["front-desk-agent", "chart-prep-agent", "no-show-agent"],
  },
  {
    slug: "no-show-agent",
    name: "Reminder & No-Show Agent",
    category: "Front office",
    status: "in_development",
    oneLiner: "Reduce no-shows with reminders that fit how each patient actually replies.",
    what: "Learns which patients confirm by text, which need a call, and which never respond at all. Reminds accordingly, and tells the front desk who is likely not coming.",
    analyzes: [
      "Appointment history",
      "No-show patterns",
      "Reminder responses",
      "Channel preferences",
      "Deposit status",
    ],
    outputs: [
      {
        label: OUT.happened,
        detail: "Confirmation and no-show rates by appointment type and channel.",
      },
      { label: OUT.matters, detail: "Which upcoming appointments carry real no-show risk." },
      { label: OUT.next, detail: "Who to call, who to text, and which slots to double-book." },
    ],
    related: ["scheduling-waitlist-agent", "intake-agent", "provider-utilization-analyst"],
  },

  /* ── Clinical ops ──────────────────────────────────────────────────── */
  {
    slug: "chart-prep-agent",
    name: "Chart Prep Agent",
    category: "Clinical ops",
    status: "in_development",
    oneLiner: "Put everything a provider needs for the next patient in one place.",
    what: "Assembles history, prior treatments, photos, consents and open questions into a short pre-visit brief. Less clicking between screens before every appointment.",
    analyzes: [
      "Patient history",
      "Prior treatments",
      "Photos and records",
      "Consents",
      "Open follow-ups",
    ],
    outputs: [
      { label: OUT.happened, detail: "A short brief per patient on the day's schedule." },
      { label: OUT.matters, detail: "What is missing or needs a decision before the visit." },
      { label: OUT.next, detail: "Prep notes the provider can read in under a minute." },
    ],
    related: ["intake-agent", "post-treatment-agent", "provider-utilization-analyst"],
  },
  {
    slug: "post-treatment-agent",
    name: "Post-Treatment Check-In Agent",
    category: "Clinical ops",
    status: "in_development",
    oneLiner: "Check in after treatment and route anything that needs clinical attention.",
    what: "Follows up on the schedule the treatment actually calls for, records what the patient reports, and escalates concerns to a person immediately. Never gives clinical advice on its own.",
    analyzes: [
      "Completed treatments",
      "Aftercare protocols",
      "Patient responses",
      "Reported concerns",
      "Follow-up bookings",
    ],
    outputs: [
      { label: OUT.happened, detail: "Check-in responses across recent treatments." },
      { label: OUT.matters, detail: "Anything a clinician needs to look at, flagged immediately." },
      { label: OUT.next, detail: "Follow-up bookings and aftercare that still need closing out." },
    ],
    related: ["chart-prep-agent", "review-referral-agent", "reactivation-agent"],
  },

  /* ── Revenue ───────────────────────────────────────────────────────── */
  {
    slug: "payments-agent",
    name: "Payments & Balance Agent",
    category: "Revenue",
    status: "in_development",
    oneLiner: "Keep track of outstanding balances and deposits without awkward chasing.",
    what: "Knows who owes what and why, and handles the routine reminders in your practice's tone. Anything sensitive goes to a person with the full picture attached.",
    analyzes: ["Outstanding balances", "Deposits", "Payment plans", "Refunds", "Payment history"],
    outputs: [
      { label: OUT.happened, detail: "Current balances, deposits and plan status in one view." },
      {
        label: OUT.matters,
        detail: "Which balances are aging and which need a human conversation.",
      },
      { label: OUT.next, detail: "A reminder queue and an escalation list for the manager." },
    ],
    related: ["membership-agent", "insurance-eligibility-agent", "practice-performance-analyst"],
  },
  {
    slug: "insurance-eligibility-agent",
    name: "Insurance & Eligibility Agent",
    category: "Revenue",
    status: "in_development",
    oneLiner: "Check coverage before the visit so nobody is surprised at checkout.",
    what: "For practices that bill insurance, it verifies coverage ahead of the appointment and flags mismatches early. Built only where a practice actually needs it.",
    analyzes: [
      "Appointment types",
      "Payer records",
      "Coverage status",
      "Prior authorizations",
      "Claim outcomes",
    ],
    outputs: [
      { label: OUT.happened, detail: "Coverage status for upcoming appointments." },
      {
        label: OUT.matters,
        detail: "Where a mismatch would turn into a denial or a surprise bill.",
      },
      { label: OUT.next, detail: "The checks and conversations to complete before the visit." },
    ],
    related: ["payments-agent", "intake-agent", "practice-performance-analyst"],
  },
];

/* ── Derived views ──────────────────────────────────────────────────── */

export const LIVE_AGENTS = AGENTS.filter((a) => a.status === "live");
export const DEVELOPING_AGENTS = AGENTS.filter((a) => a.status === "in_development");

/** The home page preview. Live agents first, capped at four. */
export const FEATURED_AGENTS = [...AGENTS]
  .filter((a) => a.featured)
  .sort((a, b) => Number(b.status === "live") - Number(a.status === "live"))
  .slice(0, 4);

/** Up to four agent links for the footer. */
export const FOOTER_AGENTS = FEATURED_AGENTS.slice(0, 4);

export function getAgent(slug: string): Agent | undefined {
  return AGENTS.find((a) => a.slug === slug);
}

export function getRelated(agent: Agent): Agent[] {
  return (agent.related ?? [])
    .map(getAgent)
    .filter((a): a is Agent => Boolean(a))
    .slice(0, 3);
}

/** Category counts for the filter row, categories with no agents omitted. */
export function categoryCounts(): { category: AgentCategory; count: number }[] {
  return AGENT_CATEGORIES.map((category) => ({
    category,
    count: AGENTS.filter((a) => a.category === category).length,
  })).filter((c) => c.count > 0);
}

export const STATUS_LABEL: Record<AgentStatus, string> = {
  live: "Available to explore",
  in_development: "In development",
};

const WORKFLOW_BY_CATEGORY: Record<AgentCategory, { action: string; to: string }> = {
  Insights: { action: "Analyze", to: "Insight" },
  Growth: { action: "Act", to: "Opportunity" },
  "Front office": { action: "Handle", to: "Cleared" },
  "Clinical ops": { action: "Prepare", to: "Ready" },
  Revenue: { action: "Track", to: "Collected" },
};

/** Three-step card diagram: what comes in, what the agent does, what comes out. */
export function getWorkflow(agent: Agent): { from: string; action: string; to: string } {
  if (agent.workflow) return agent.workflow;
  const { action, to } = WORKFLOW_BY_CATEGORY[agent.category];
  return { from: agent.analyzes[0] ?? agent.category, action, to };
}
