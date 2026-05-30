export const NAV_LINKS = [
  { href: "#engine", label: "Audit Engine" },
  { href: "#agents", label: "Agents" },
  { href: "#system", label: "Inside Your System" },
  { href: "#results", label: "Results" },
  { href: "#process", label: "Process" },
] as const;

export const PROBLEMS = [
  {
    code: "OPS-001",
    title: "Missed appointments",
    detail:
      "23–32% of slots leak through no-shows, late cancels, and unconfirmed bookings — bleeding revenue every clinic day.",
    metric: "−$4.2M / yr",
    severity: "critical",
  },
  {
    code: "OPS-002",
    title: "Call center overload",
    detail:
      "Front-desk teams answer the same 9 questions all day. Hold times rise. Patients drop off before scheduling.",
    metric: "47% drop-off",
    severity: "high",
  },
  {
    code: "OPS-003",
    title: "EMR data sprawl",
    detail:
      "Clinical workflows fragment across EMR, scheduling, billing and intake. Nothing talks to nothing.",
    metric: "11 systems",
    severity: "high",
  },
  {
    code: "OPS-004",
    title: "Documentation overhead",
    detail:
      "Physicians spend 2.1 hrs/day on documentation. Burnout climbs. Notes still arrive incomplete.",
    metric: "2.1 hrs/day",
    severity: "high",
  },
  {
    code: "OPS-005",
    title: "Revenue cycle leakage",
    detail:
      "Denials, undercoding, missed eligibility checks and slow A/R quietly compound across the org.",
    metric: "8–14% leak",
    severity: "critical",
  },
  {
    code: "OPS-006",
    title: "Delayed patient comms",
    detail:
      "Pre-visit prep, post-visit follow-up and care plan nudges depend on humans with too much queue.",
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
    name: "Appointment Agent",
    tag: "Scheduling",
    desc: "Books, reschedules and confirms across multi-provider calendars. Handles waitlists and slot recovery.",
    metrics: ["+38% confirms", "<200ms decisions", "24/7 coverage"],
    status: "live",
  },
  {
    name: "Voice AI Receptionist",
    tag: "Front Desk",
    desc: "Natural voice over PSTN/SIP. Triages, books, transfers, captures intent — answers in your clinic's voice.",
    metrics: ["96% intent acc.", "0s hold time", "12 languages"],
    status: "live",
  },
  {
    name: "EMR Automation Agent",
    tag: "Clinical Ops",
    desc: "Reads, writes, and reconciles structured fields across EMR/EHR. Eliminates copy-paste chair work.",
    metrics: ["−74% admin", "Athena · Epic · Cerner", "HIPAA-aligned"],
    status: "live",
  },
  {
    name: "Patient Follow-up Agent",
    tag: "Engagement",
    desc: "Pre-visit prep, post-visit care plans, no-show recovery — across SMS, voice, email and portal.",
    metrics: ["+22% adherence", "Omnichannel", "Care-plan aware"],
    status: "live",
  },
  {
    name: "Billing Workflow Agent",
    tag: "Revenue Cycle",
    desc: "Eligibility, coding hints, denial triage, A/R chase. Surfaces revenue you've already earned.",
    metrics: ["+9.4% capture", "−61% denials", "ANSI 837/835"],
    status: "live",
  },
  {
    name: "Clinical Documentation Agent",
    tag: "Provider",
    desc: "Ambient capture during visits. Drafts SOAP notes, codes, and orders for clinician review in seconds.",
    metrics: ["−2.1 hrs/day", "Clinician-edited", "Note-grade"],
    status: "beta",
  },
  {
    name: "Internal Operations Agent",
    tag: "Back-office",
    desc: "Cross-department orchestration: staffing, supplies, vendor follow-ups, internal SLAs.",
    metrics: ["20+ workflows", "Org-wide", "Audit-logged"],
    status: "beta",
  },
  {
    name: "Insurance Verification Agent",
    tag: "Front Office",
    desc: "Real-time eligibility, prior auth status checks, and benefit summaries before the patient arrives.",
    metrics: ["<8s checks", "270/271 native", "Plan-aware"],
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
