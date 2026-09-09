/**
 * Site copy and navigation.
 *
 * Everything a visitor reads outside the agent library lives here so the
 * wording can be changed without touching layout. Claims in SECURITY_PILLARS
 * and HOW_WE_WORK are intentionally conservative — nothing here should be
 * published that the team cannot defend in a security or legal review.
 */

export const CONTACT_EMAIL = "info@avishkar.app";

export const BOOKING_URL = "/contact";

/** A short, fixed set of CTA labels sitewide. Adding another needs a reason. */
export const CTA = {
  book: "Book a 30-min conversation",
  tryAgent: "Try agent",
  /** Points at the public showcase. Agents are the work visitors can see, not the company. */
  seeWork: "See our work",
  /** Used only once the visitor is already looking at agents. */
  explore: "Explore agents",
  custom: "Tell us what you're trying to solve",
} as const;

export const NAV_LINKS = [
  { href: "/agents", label: "Agents" },
  { href: "/how-we-work", label: "How we work" },
  { href: "/about", label: "About" },
] as const;

/* ── Home ───────────────────────────────────────────────────────────── */

export const HERO = {
  headline: "Technology built around how your practice works.",
  sub: "Avishkar connects the systems you already use and builds the technology your team actually needs — integrations, automation, internal tools, and AI agents.",
  audience: "Built for medspas, aesthetic practices, clinics, and healthcare teams.",
};

export const PROBLEM = {
  headline: "Your practice already has the systems.",
  systems: ["Leads", "Scheduling", "Consultations", "Follow-up", "Billing", "Communication"],
  body: "The problem is that these systems often don't work together — and the data they hold stays hard to access or act on.",
  turn: "That's where Avishkar comes in.",
  turnBody:
    "We connect the technology you already use and build practical tools around your actual workflows.",
};

export const CAPABILITY = {
  headline: "We start with your workflow, not our software.",
  steps: [
    {
      title: "Understand",
      body: "We learn how your practice works and where the problems are.",
    },
    {
      title: "Connect",
      body: "We work with the systems and data you already use.",
    },
    {
      title: "Build",
      body: "We build whatever the workflow needs: an integration, an automation, an internal tool, a report, or an agent.",
    },
    {
      title: "Improve",
      body: "We measure what happens and keep improving the solution.",
    },
  ],
};

/**
 * Agents are a current, important showcase — marketing that lets a visitor
 * see how we work. They are not the company, and copy here should never
 * imply they are.
 */
export const AGENTS_PREVIEW = {
  headline: "Agents we're building for practice teams.",
  sub: "Agents are one of the things we build, and the part of the work you can look at today. Each one starts from a workflow a practice already runs.",
};

export const BUILT_NOT_BOUGHT = {
  headline: "Built around your practice. Not the other way around.",
  body: "Your practice should not have to change how it works just to fit another piece of software. Avishkar works with the systems you already use and builds the technology around your workflow.",
  formsLabel: "What that turns into",
  forms: [
    "An integration between systems",
    "Workflow automation",
    "An internal tool",
    "A reporting system",
    "An AI agent",
    "A custom application",
  ],
  customHeadline: "Don't see what you need?",
  customBody:
    "What you see here is a look at current work, not a catalogue of everything we do. Most builds are specific to one practice — bring us the problem and we'll scope it.",
};

export const HOW_WE_WORK = {
  headline: "A conversation first. Then something small that works.",
  sub: "No long discovery phase, no platform migration, no committee.",
  steps: [
    {
      title: "A 30-minute conversation",
      timing: "Week one",
      body: "You describe the workflow that frustrates you. We ask about the systems involved and who touches them. If technology isn't the answer, we say so.",
    },
    {
      title: "One scoped build",
      timing: "Weeks two to six, typically",
      body: "We agree on a single problem worth solving, connect to the systems that hold the data, and build the smallest thing that solves it properly.",
    },
    {
      title: "Measure, then extend",
      timing: "Ongoing",
      body: "We watch how the solution performs against the workflow it replaced, tune it, and only then talk about what to build next.",
    },
  ],
};

export const TRUST = {
  headline: "Built with privacy and security in mind.",
  sub: "We work inside practices that handle patient information. The way we handle data is part of the build, not an afterthought.",
};

/**
 * Only claims the team can substantiate. Review this list before launch — if
 * any line cannot be evidenced in a security questionnaire, cut it.
 */
export const SECURITY_PILLARS = [
  {
    title: "Least privilege by default",
    body: "We request the narrowest access that the work requires, and read-only wherever reading is enough.",
  },
  {
    title: "Data minimization",
    body: "We work with the fields a solution actually needs. Patient information we don't need, we don't pull.",
  },
  {
    title: "HIPAA-aligned practices",
    body: "Engagements that involve protected health information are handled under HIPAA-aligned practices, with a BAA available on request.",
  },
  {
    title: "Human oversight",
    body: "Anything patient-facing or clinical stays under human review. Agents surface and draft; your team decides.",
  },
];

/**
 * Specialized model — under development. Copy stays operational, not clinical:
 * workflows and practice context, never diagnosis or patient records.
 */
export const EARLY_ACCESS = {
  eyebrow: "Something we're building",
  headline: "What if AI understood your practice?",
  body: "We're building a specialized AI model for medspas and aesthetic practices — designed around the workflows, language, and operational patterns that generic AI doesn't understand.",
  status: "It's early. We're still building it.",
  invite:
    "We're looking for a small group of early adopters who want to see what we're building and help shape where it goes.",
  formLabel: "Want an early look?",
  emailLabel: "Work email",
  submit: "Get early access",
  footnote: "We'll reach out when there's something ready to explore.",
  successTitle: "You're on the list.",
  successBody: "We'll be in touch when there's something ready to explore.",
};

export const FINAL_CTA = {
  headline: "Have a problem you're trying to solve?",
  body: "Tell us what your practice is trying to improve. We'll spend 30 minutes understanding the workflow and figuring out where technology could help.",
};

/* ── Agents page ────────────────────────────────────────────────────── */

/**
 * Marketing lands here cold. The page has to hold two truths at once:
 * agents are important and worth exploring, and Avishkar is a technology
 * company that builds more than agents.
 */
export const AGENTS_PAGE = {
  eyebrow: "Work you can see",
  title: "Agents we've built for practice teams.",
  description:
    "A current look at our work. Agents are not everything we build, but they are a clear way to see how we think: start from the workflow, connect to the systems already in place, and ship something the team can use.",
  breadthHeadline: "This is one part of the work.",
  breadthBody:
    "Avishkar builds technology around how a practice already operates — integrations, automation, internal tools, reporting, and custom software. Agents are the piece we can publish. If your problem doesn't look like one of these, that's normal. Bring it anyway.",
  detailNote:
    "This agent is one example of how we work. Avishkar also builds integrations, automation, internal tools, and reporting inside the systems a practice already runs.",
};

/* ── Footer ─────────────────────────────────────────────────────────── */

export const FOOTER_BRAND = {
  description: "Technology built around how your practice works.",
  descriptionSub:
    "Integrations, automation, internal tools, AI agents, and custom software for modern practices.",
};

export const FOOTER_LINKS = {
  explore: [
    { href: "/agents", label: "Agents" },
    { href: "/how-we-work", label: "How we work" },
    { href: "/about", label: "About" },
    { href: "/resources", label: "Resources" },
  ],
  company: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/security", label: "Security" },
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
    { href: "/careers", label: "Careers" },
  ],
  connect: [
    { href: "/contact", label: CTA.book },
    { href: `mailto:${CONTACT_EMAIL}`, label: "Contact the team" },
    { href: "https://www.linkedin.com/company/avishkarai/", label: "LinkedIn" },
  ],
};

export const LEGAL_NOTE =
  "Avishkar is a technology company. We are not a medical provider, and we do not provide clinical or billing advice.";

/* ── About ──────────────────────────────────────────────────────────── */

export const ABOUT = {
  headline: "We build technology for practices.",
  sub: "Avishkar is a technology company built around practice operations: the leads, the schedule, the consultations, the follow-up, and the systems that hold all of it.",
  body: [
    "Most practices don't have a technology problem in the abstract. They have a specific workflow that costs the team hours a week, a report nobody can produce, or data sitting in a system that won't give it up. The software market answers that with another platform to adopt.",
    "We work the other way around. We start from the workflow, connect to whatever systems are already in place, and build the smallest thing that solves the problem properly — an integration, an internal tool, a report, an agent. Then we measure whether it actually helped.",
  ],
  principles: [
    {
      title: "The workflow comes first",
      body: "We don't ask a practice to change how it works to suit software. The build fits the practice.",
    },
    {
      title: "Start small, prove it",
      body: "One scoped problem, solved properly, beats a platform rollout nobody asked for.",
    },
    {
      title: "Plain answers",
      body: "If technology isn't the right answer to a problem, we'll tell you that in the first conversation.",
    },
    {
      title: "Your systems stay yours",
      body: "We work inside the tools you already run. Nothing gets ripped out and replaced.",
    },
  ],
};

/* ── Careers ────────────────────────────────────────────────────────── */

export const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/avishkarai/" },
] as const;

export const OPEN_ROLES = [
  {
    title: "Forward-Deployed Engineer",
    team: "Engineering",
    location: "Remote · US / India",
    blurb:
      "Work directly with practices: connect to the systems they already run, and build the technology the workflow actually needs.",
  },
  {
    title: "Practice Operations Analyst",
    team: "Operations",
    location: "Remote",
    blurb:
      "Translate how a practice actually works into something we can build around — the workflows, the data, and where the time goes.",
  },
  {
    title: "Solutions Architect",
    team: "Delivery",
    location: "Remote",
    blurb:
      "Own secure integrations across practice management, scheduling, EMR and communication systems.",
  },
] as const;

/* ── How we work page ───────────────────────────────────────────────── */

export const ENGAGEMENT_FAQS = [
  {
    q: "Do we have to replace our existing systems?",
    a: "No. We work inside the tools you already run — your CRM, scheduling, EMR, phone system, spreadsheets. We connect to them and build around them. Nothing is ripped out and replaced.",
  },
  {
    q: "What does the first conversation involve?",
    a: "Thirty minutes on the workflow that frustrates you. Which people touch it, which systems hold the data, and what a good outcome would look like. No slide deck, and no obligation to buy anything at the end of it.",
  },
  {
    q: "What if what we need isn't on your site?",
    a: "The agents on this site are examples of current work, not a product catalogue. Bring us the problem and we'll scope a build around it — that might be an agent, or it might be an integration, an internal tool, or a report.",
  },
  {
    q: "How does pricing work?",
    a: "Each build is scoped and priced individually, because the work depends on the problem and the systems involved. You'll have a scope and a price before anything starts. We'll talk about it in the first conversation rather than publishing a number that fits nobody.",
  },
];
