/** Single source of truth for the public contact address (note the spelling). */
export const CONTACT_EMAIL = "info@avhishkar.app";

/** Product tagline, used across hero, CTA and metadata. */
export const TAGLINE = "Find the Leak. Quantify the Impact. Deploy the Fix.";

export const NAV_LINKS = [
  { href: "/#approach", label: "Why us" },
  { href: "/#audit", label: "Audit" },
  { href: "/#agents", label: "Agents" },
  { href: "/#results", label: "Results" },
  { href: "/resources", label: "Resources" },
] as const;

export const PROBLEMS = [
  {
    code: "OPS-001",
    title: "Missed appointments & scheduling gaps",
    detail:
      "No-shows, late cancels and unconfirmed bookings leak slots — and revenue — every clinic day.",
    metric: "−$1.84M / yr",
    severity: "critical",
    pct: 82,
  },
  {
    code: "OPS-002",
    title: "Claim denials & revenue cycle leakage",
    detail:
      "Denials, undercoding and missed eligibility checks quietly compound across the org.",
    metric: "−$1.12M / yr",
    severity: "high",
    pct: 58,
  },
  {
    code: "OPS-003",
    title: "Call center & patient access drop-off",
    detail:
      "Hold times climb and patients abandon calls before they ever reach scheduling.",
    metric: "−$612K / yr",
    severity: "high",
    pct: 34,
  },
  {
    code: "OPS-004",
    title: "Documentation gaps & undercoding",
    detail:
      "Clinicians lose hours a day to notes. Burnout climbs and documentation still arrives incomplete.",
    metric: "−$388K / yr",
    severity: "medium",
    pct: 22,
  },
  {
    code: "OPS-005",
    title: "Authorization & eligibility failures",
    detail:
      "Prior-auth denials and eligibility mismatches delay care and silently erode collections.",
    metric: "−$264K / yr",
    severity: "medium",
    pct: 18,
  },
] as const;

export const AUDIT_STEPS = [
  {
    id: "01",
    label: "Operational Intelligence Audit",
    heading: "AUDIT",
    detail:
      "Connect read-only to your EMR, billing, scheduling, telephony, and patient portal through our pre-built adapter library. Reconstruct a Live Operational Model — a real-time representation of how patients, data, tasks, and revenue flow through your organization.",
    tag: "Fixed scope · Read-only",
    tagColor: "blue" as const,
  },
  {
    id: "02",
    label: "Revenue Leak Detection & Quantification",
    heading: "QUANTIFY",
    detail:
      "Every operational gap — missed appointments, denied claims, abandoned calls, documentation burden, authorization failures — is measured in exact dollars. No estimates. No benchmarks applied to your data. Your actual numbers from your actual systems.",
    tag: "Workflow-level precision",
    tagColor: "blue" as const,
  },
  {
    id: "03",
    label: "Ranked Recovery Plan",
    heading: "PRIORITIZE",
    detail:
      "A prioritized list of recovery opportunities ordered by financial impact and implementation ease. You see exactly what to fix first, second, and third — before any automation is proposed.",
    tag: "Evidence-backed",
    tagColor: "blue" as const,
  },
  {
    id: "04",
    label: "Targeted Agent Deployment",
    heading: "DEPLOY",
    detail:
      "AI agents designed for your specific environment — your EMR, your payer mix, your workflows. Supervised rollout with human oversight at every step. Outcomes measured continuously against the audit baseline.",
    tag: "ROI proven first",
    tagColor: "green" as const,
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
    a: "A fixed-scope engagement where we connect read-only to your existing systems — EMR, billing, scheduling, call center, patient portals — and build a Live Operational Model of how patients, data, tasks, and revenue actually flow through your organization.\n\nWe surface every operational gap, quantify its exact financial impact in dollars, and hand you a prioritized recovery plan — before any automation is proposed. The diagnosis is complete before any agent is deployed.",
  },
  {
    q: "How is Avishkar different from other healthcare AI vendors?",
    a: "Most vendors deploy automation first and look for problems to solve. We diagnose first.\n\nWe quantify where revenue is leaking, rank every opportunity by ROI, and only then deploy targeted AI agents — and only where they deliver measurable return. No agent is proposed until the audit proves it will pay for itself.",
  },
  {
    q: "How long until we see measurable impact?",
    a: "Most organizations see first measurable impact within approximately 12 weeks. The audit itself typically takes 3–4 weeks to reconstruct your operations and produce a quantified leakage map. Agent deployment follows immediately for the highest-ROI opportunities.\n\nWe publish timeframes because speed matters — but we never skip the diagnosis to move faster. The audit is what makes the deployment work.",
  },
  {
    q: "Is my patient data secure and HIPAA-compliant?",
    a: "Yes. During the audit phase, all access is read-only by default. We minimize the PHI we touch — only the data elements necessary for the Operational Model are accessed. We offer a signed BAA before any system access begins.\n\nEvery agent deployment includes role-based access control, a full audit trail on every action, and human-in-the-loop oversight. No clinical or financial workflow changes happen without human review.",
  },
  {
    q: "Do we have to replace our existing systems?",
    a: "No. Avishkar works inside the infrastructure you already run. We connect to your EMR, telephony, billing, and scheduling systems through pre-built adapters — Epic, Cerner, Athena, eClinicalWorks, Meditech, RingCentral, Waystar, and others.\n\nThe audit reads from your systems. The agents operate within them. Nothing is ripped out or replaced.",
  },
  {
    q: "How does pricing work?",
    a: "Every engagement begins with a fixed-scope Operational Intelligence Audit. The audit fee is agreed upfront — no surprises. Ongoing agent deployment is tied directly to measurable ROI: you see the projected recovery before committing to any agent.\n\nExact pricing is tailored to each organization's size, specialty mix, and systems landscape. Reach out and we will scope it together.",
  },
] as const;
