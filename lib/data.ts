/** Single source of truth for the public contact address (note the spelling). */
export const CONTACT_EMAIL = "info@avhishkar.app";

/** Product tagline, used across hero, CTA and metadata. */
export const TAGLINE = "Find the Leak. Quantify the Impact. Deploy the Fix.";

export const NAV_LINKS = [
  { href: "/#why", label: "Why Avishkar" },
  { href: "/#revenue", label: "Revenue" },
  { href: "/#engine", label: "Operational Audit" },
  { href: "/#agents", label: "Agents" },
  { href: "/#results", label: "Results" },
] as const;

export const PROBLEMS = [
  {
    code: "OPS-001",
    title: "Missed appointments",
    detail:
      "No-shows, late cancels and unconfirmed bookings leak slots — and revenue — every clinic day.",
    metric: "−$1.84M / yr",
    severity: "critical",
  },
  {
    code: "OPS-002",
    title: "Call center drop-off",
    detail:
      "Hold times climb and patients abandon calls before they ever reach scheduling.",
    metric: "−$612K / yr",
    severity: "high",
  },
  {
    code: "OPS-003",
    title: "Revenue cycle leakage",
    detail:
      "Denials, undercoding and missed eligibility checks quietly compound across the org.",
    metric: "−$1.12M / yr",
    severity: "critical",
  },
  {
    code: "OPS-004",
    title: "Documentation overhead",
    detail:
      "Clinicians lose hours a day to notes. Burnout climbs and documentation still arrives incomplete.",
    metric: "2.1 hrs/day",
    severity: "high",
  },
  {
    code: "OPS-005",
    title: "Patient communication delays",
    detail:
      "Pre-visit prep, follow-up and care-plan nudges depend on humans with too much queue.",
    metric: "36 hr lag",
    severity: "medium",
  },
] as const;

export const AUDIT_STEPS = [
  {
    id: "01",
    label: "Connect systems",
    detail:
      "Read-only integrations into EMR, scheduling, telephony, billing, and intake. Zero rip-and-replace.",
  },
  {
    id: "02",
    label: "Map workflows",
    detail:
      "We reconstruct how patients, staff and data actually move — not how the org chart says they do.",
  },
  {
    id: "03",
    label: "Detect inefficiencies",
    detail:
      "Models surface dropped hand-offs, repeat work, queue stalls, comms gaps and SLA risk patterns.",
  },
  {
    id: "04",
    label: "Predict revenue impact",
    detail:
      "We quantify leakage in dollars: no-shows, denials, undercoding, conversion loss and staff cost.",
  },
  {
    id: "05",
    label: "Recommend automation",
    detail:
      "A prioritized agent map tied to ROI, complexity, time-to-deploy and operational risk.",
  },
  {
    id: "06",
    label: "Deploy AI agents",
    detail:
      "Custom-built, supervised, monitored — running inside your environment with human handoffs.",
  },
] as const;

export const AGENTS = [
  {
    name: "Patient Access Agent",
    tag: "Scheduling + Voice AI",
    desc: "Books, reschedules and confirms across providers, and answers the phone in your clinic's voice — triaging, scheduling and recovering no-shows 24/7.",
    metrics: ["+38% confirms", "0s hold time", "24/7 coverage"],
    status: "live",
  },
  {
    name: "Revenue Recovery Agent",
    tag: "Billing + Insurance Verification",
    desc: "Runs eligibility and prior-auth checks, surfaces coding gaps, and works denials and A/R — recovering revenue you've already earned.",
    metrics: ["+9.4% capture", "−61% denials", "270/271 native"],
    status: "live",
  },
  {
    name: "Clinical Operations Agent",
    tag: "EMR Automation + Documentation",
    desc: "Reads, writes and reconciles structured fields across the EMR and drafts clinician-ready notes from the visit — eliminating chair work.",
    metrics: ["−74% admin", "−2.1 hrs/day", "Athena · Epic · Cerner"],
    status: "live",
  },
  {
    name: "Patient Engagement Agent",
    tag: "Follow-Up",
    desc: "Pre-visit prep, post-visit care plans and follow-up across SMS, voice, email and portal — so nothing falls through the cracks.",
    metrics: ["+22% adherence", "Omnichannel", "Care-plan aware"],
    status: "live",
  },
] as const;

export const RESULTS = [
  { value: 74, suffix: "%", label: "reduction in admin workload", hint: "Across pilot deployments" },
  { value: 38, suffix: "%", label: "increase in appointment confirmations", hint: "First 60 days post-deploy" },
  { value: 9.4, suffix: "%", label: "additional revenue capture", hint: "Eligibility + denial triage" },
  { value: 21, suffix: "min", label: "median first-response time", prefix: "−", hint: "Voice + SMS combined" },
  { value: 2.1, suffix: "hrs/day", label: "documentation time returned", prefix: "−", hint: "Per active clinician" },
  { value: 4.2, suffix: "M", label: "annualized revenue recovered", prefix: "$", hint: "Mid-size clinic group" },
] as const;

export const PROCESS = [
  {
    n: "01",
    title: "AI Audit",
    body: "We instrument your systems and rebuild a live model of your operations — in days, not quarters.",
    duration: "Week 1–2",
  },
  {
    n: "02",
    title: "Identify Revenue Leaks",
    body: "Quantified, ranked, evidence-backed. Each leak tied to a workflow, a team and a dollar value.",
    duration: "Week 2–3",
  },
  {
    n: "03",
    title: "Build AI Agents",
    body: "We design and ship agents specific to your environment, your EMR, your phones, your team.",
    duration: "Week 3–6",
  },
  {
    n: "04",
    title: "Deploy & Optimize",
    body: "Supervised rollout with humans in the loop. Continuous learning. Monthly impact reviews.",
    duration: "Ongoing",
  },
] as const;

export const TICKER = [
  "agent.appointment_followup OK",
  "emr.write[athena] +312 fields",
  "voice.intake session_id=AX-9182",
  "denial.triage queued=14",
  "eligibility.check 270 → 271 0.42s",
  "noshow.recovery booked=27",
  "soap.draft awaiting_review=3",
  "ops.alert sla=98.6%",
  "agent.billing reconciled=$24,118",
  "patient.followup channel=sms sent=1,204",
  "agent.scheduler conflicts_resolved=46",
  "emr.read[epic] cohort=oncology",
] as const;

/**
 * Security & compliance pillars shown in the Contact section. The `icon` field
 * is a key resolved to a lucide component in the Contact component, so this data
 * file stays free of JSX/presentation imports.
 */
export const SECURITY_PILLARS = [
  {
    icon: "lock",
    title: "PHI minimization",
    detail:
      "We read only what an audit requires. Connections are read-only by default and scoped to the minimum necessary.",
  },
  {
    icon: "shield",
    title: "HIPAA-aligned",
    detail:
      "Built to HIPAA standards with a BAA available. Encryption in transit and at rest across every integration.",
  },
  {
    icon: "file",
    title: "Audit logging",
    detail:
      "Every agent action is logged and reviewable. Full traceability from recommendation to deployed workflow.",
  },
  {
    icon: "users",
    title: "Human-in-the-loop",
    detail:
      "Role-based access and supervised rollouts. Clinicians and staff stay in control, with clear handoffs.",
  },
] as const;

/* ------------------------------------------------------------------ */
/* Positioning content (operational-intelligence / revenue-recovery)  */
/* ------------------------------------------------------------------ */

/** Executive-summary outcomes shown high on the home page. */
export const EXEC_OUTCOMES = [
  "8–14% revenue recovery opportunities identified",
  "38% improvement in appointment confirmations",
  "74% reduction in administrative workload",
  "First measurable impact within 12 weeks",
] as const;

/** "Why Avishkar is different" — diagnosis-first vs automation-first. */
export const WHY_DIFFERENT = {
  traditional: {
    label: "Traditional Healthcare AI",
    points: [
      "Deploys AI first",
      "Assumes workflows",
      "Generic automation",
      "Limited operational visibility",
      "Difficult ROI attribution",
    ],
  },
  avishkar: {
    label: "Avishkar AI",
    points: [
      "Diagnoses first",
      "Maps real workflows",
      "Quantifies revenue impact",
      "Deploys targeted agents",
      "Measures outcomes continuously",
    ],
  },
} as const;

/**
 * Revenue-recovery KPI cards. `value`/`prefix`/`suffix`/`decimals` feed the
 * existing AnimatedNumber count-up; `note` is the descriptive label.
 */
export const REVENUE_METRICS = [
  {
    value: 4.2,
    prefix: "$",
    suffix: "M+",
    decimals: 1,
    note: "Potential annual revenue recovery",
    accent: "cyan",
  },
  {
    value: 1.84,
    prefix: "$",
    suffix: "M",
    decimals: 2,
    note: "No-show recovery opportunity",
    accent: "emerald",
  },
  {
    value: 1.12,
    prefix: "$",
    suffix: "M",
    decimals: 2,
    note: "Denial & undercoding recovery",
    accent: "violet",
  },
  {
    value: 612,
    prefix: "$",
    suffix: "K",
    decimals: 0,
    note: "Call center conversion leakage",
    accent: "cyan",
  },
  {
    value: 14,
    prefix: "8–",
    suffix: "%",
    decimals: 0,
    note: "Average revenue leakage identified",
    accent: "emerald",
  },
  {
    value: 12,
    suffix: " wks",
    decimals: 0,
    note: "Average time to first impact",
    accent: "violet",
  },
] as const;

/** Enterprise trust logos (text wordmarks, rendered in grayscale). */
export const TRUST_LOGOS = [
  "Mayo Clinic",
  "Stanford Health",
  "Cleveland Clinic",
  "Kaiser Permanente",
  "Apollo Hospitals",
  "MedStar Health",
] as const;

/** Open roles shown on the Careers page. */
export const OPEN_ROLES = [
  {
    title: "Forward-Deployed Engineer",
    team: "Engineering",
    location: "Remote · US / India",
    blurb:
      "Embed with healthcare clients to instrument their systems, build the operational model, and ship the agents the audit recommends.",
  },
  {
    title: "Healthcare Operations Analyst",
    team: "Operations Intelligence",
    location: "Remote",
    blurb:
      "Turn raw workflow data into quantified revenue-leakage maps. Translate clinical and billing operations into financial impact.",
  },
  {
    title: "Revenue Cycle Specialist",
    team: "Revenue Recovery",
    location: "Remote · US",
    blurb:
      "Bring deep RCM expertise to denial triage, eligibility and undercoding recovery, and validate agent output against payer rules.",
  },
  {
    title: "Solutions Architect",
    team: "Enterprise Deployment",
    location: "Remote",
    blurb:
      "Own secure, HIPAA-aligned integrations across EMRs, telephony and billing systems for enterprise health-system rollouts.",
  },
] as const;

/** Social links shown in the footer. Replace hrefs with real handles. */
export const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/", icon: "linkedin" },
  { label: "X", href: "https://x.com/", icon: "x" },
  { label: "GitHub", href: "https://github.com/", icon: "github" },
  { label: "YouTube", href: "https://www.youtube.com/", icon: "youtube" },
] as const;

/** Frequently asked questions shown on the home page (accordion). */
export const FAQS = [
  {
    q: "What exactly is the Operational Intelligence Audit?",
    a: "A fixed-scope engagement where we connect to your existing systems — EMR, billing, scheduling, call center, patient portals — and build a live model of how patients, data, tasks and revenue actually flow. We surface inefficiencies, quantify their financial impact, and hand you a prioritized recovery plan before any automation is deployed.",
  },
  {
    q: "How is Avishkar different from other healthcare AI vendors?",
    a: "Most vendors deploy automation first and look for problems to solve. We diagnose first. We quantify where value is leaking, rank opportunities by ROI, and only then deploy targeted agents — and only where they deliver measurable return.",
  },
  {
    q: "How long until we see measurable impact?",
    a: "Most organizations see first measurable impact within about 12 weeks. The audit itself reconstructs your operations and produces a quantified leakage map; agents are then deployed where ROI is provable.",
  },
  {
    q: "Is my patient data secure and HIPAA-compliant?",
    a: "Yes. We operate read-only by default during the audit, minimize the PHI we touch, and offer a signed BAA. Every deployment includes role-based access, audit logging, and human-in-the-loop oversight.",
  },
  {
    q: "Do we have to replace our existing systems?",
    a: "No. Avishkar works inside the infrastructure you already run. We integrate with your EMR, phones, and billing systems rather than asking you to rip and replace anything.",
  },
  {
    q: "How does pricing work?",
    a: "Engagements begin with a fixed-scope operational audit; ongoing agent deployment is tied to measurable ROI. Exact pricing is tailored to each organization — reach out and we'll scope it with you.",
  },
] as const;
