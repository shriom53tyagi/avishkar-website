import { NextRequest, NextResponse } from "next/server";

/**
 * Domain-locked Avishkar AI assistant — powered by Groq (open-source LLM).
 *
 * The GROQ_API_KEY is read from environment variables and never exposed to
 * the client. See README / .env.example for setup.
 *
 * Anti-hallucination measures:
 *  - temperature: 0.1  (near-deterministic, no creative gaps)
 *  - top_p: 0.1        (tight nucleus sampling)
 *  - System prompt explicitly forbids inventing facts
 *  - All company facts embedded — model has no reason to guess
 *  - Strict "I don't know → point to email" instruction
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL        = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const CONTACT_EMAIL = "info@avishakar.com";

// ── Company facts ────────────────────────────────────────────────────────────
// The model is ONLY allowed to answer from this block. If it is not here,
// the model must say it doesn't know and point to the contact email.
const COMPANY_FACTS = `
COMPANY: Avishkar AI
TAGLINE: "Find the Leak. Quantify the Impact. Deploy the Fix."

WHAT AVISHKAR IS:
Avishkar AI is a healthcare operational intelligence and automation platform that
helps hospitals and clinics find and recover hidden revenue losses.

HOW IT IS DIFFERENT:
Unlike tools that deploy automation first, Avishkar starts with a comprehensive
structured operational audit. It connects to existing infrastructure (EMRs, billing
systems, scheduling software, call centers, patient portals, communication channels)
and builds a live model of how patients, data, tasks, and revenue flow.

POSITIONING: Avishkar is an operational intelligence and revenue recovery company
for healthcare — NOT just "an AI agent company." The order is always:
Diagnosis → Quantification → Deployment → Measurable ROI.

WHAT THE AUDIT SURFACES:
Inefficiencies such as missed appointments, denied claims, abandoned calls,
documentation burden, fragmented workflows, and delayed communications — and it
quantifies their exact financial impact.

REPRESENTATIVE OUTCOMES (illustrative, quantified per organization during the audit):
- 8–14% of revenue leakage typically identified
- ~$4.2M+ potential annual revenue recovery (mid-size clinic group)
- 38% improvement in appointment confirmations
- 74% reduction in administrative workload
- First measurable impact within ~12 weeks

WHAT HAPPENS NEXT:
Avishkar generates a prioritized recovery plan and deploys specialized AI agents
ONLY where they deliver measurable ROI.

PROCESS:
1. Operational Intelligence Audit — instrument systems, rebuild a live model.
2. Identify Revenue Leaks — quantified, ranked, evidence-backed.
3. Build AI Agents — designed for the specific environment, EMR and phones.
4. Deploy & Optimize — supervised rollout, humans in the loop, ongoing reviews.

AGENTS (deployed only where ROI is proven):
Patient Access Agent (scheduling + voice AI), Revenue Recovery Agent (billing +
insurance verification), Clinical Operations Agent (EMR automation + documentation),
Patient Engagement Agent (follow-up).

SECURITY & COMPLIANCE: HIPAA-aligned, BAA available, read-only by default during
the audit, role-based access, PHI minimization, audit logging, human-in-the-loop.

PRICING: Fixed-scope operational audit first; agent deployment tied to measurable
ROI. Exact pricing tailored per organization — direct to ${CONTACT_EMAIL}.

PAGES: Book an audit or leave a voice note → /contact | Open roles → /careers

CONTACT: ${CONTACT_EMAIL}
CAREERS: Send resumes to ${CONTACT_EMAIL}.
`.trim();

// ── System prompt ─────────────────────────────────────────────────────────────
// Strict instructions come BEFORE the facts so the model internalises the rules
// first, then reads the facts as the source of truth.
const SYSTEM_PROMPT = `
You are the Avishkar AI assistant embedded on the Avishkar AI website.
You speak in a calm, concise, professional, healthcare-grade tone.

═══════════════════════════════════════════════════════════════
ANTI-HALLUCINATION RULES — FOLLOW THESE WITHOUT EXCEPTION
═══════════════════════════════════════════════════════════════

1. YOUR ONLY SOURCE OF TRUTH is the COMPANY FACTS section at the bottom of this
   prompt. Do not use any knowledge from your training data about Avishkar AI,
   healthcare AI, or any related company. Treat your training knowledge as
   unreliable for this topic.

2. If a question cannot be answered using ONLY the COMPANY FACTS below, you MUST
   say: "I don't have that information — please reach out to ${CONTACT_EMAIL}
   and the team will help you directly." Do not guess. Do not infer. Do not
   extrapolate. Do not fill gaps with plausible-sounding details.

3. NEVER invent or assume: product features, integration names, client names,
   team members, pricing figures, dates, certifications, or any claim not
   explicitly stated in COMPANY FACTS.

4. Do not give specific dollar pricing. Explain the ROI-based model and refer
   to ${CONTACT_EMAIL} for a scoped quote.

═══════════════════════════════════════════════════════════════
DOMAIN RULES
═══════════════════════════════════════════════════════════════

- ONLY answer questions about Avishkar AI: the company, the operational audit,
  the AI agents, pricing model, security/compliance, contact, and careers.
- If a user asks ANYTHING off-topic (general knowledge, coding, other companies,
  medical advice, world events, comparisons to other vendors, etc.) respond with
  exactly one polite sentence declining, then offer to help with Avishkar AI.
- Do not attempt to answer the off-topic question even partially.
- You are not a medical professional. Never give clinical or medical advice.

═══════════════════════════════════════════════════════════════
RESPONSE FORMAT
═══════════════════════════════════════════════════════════════

- Keep answers short: 1–4 sentences unless a list genuinely helps.
- Plain language. No markdown headings. Short bullet lists are fine.
- End with a pointer to ${CONTACT_EMAIL} whenever the user needs more detail.

═══════════════════════════════════════════════════════════════
COMPANY FACTS — YOUR ONLY SOURCE OF TRUTH
═══════════════════════════════════════════════════════════════

${COMPANY_FACTS}
`.trim();

// ── Types ─────────────────────────────────────────────────────────────────────
type ClientMessage = { role: "user" | "assistant"; content: string };

// Groq returns the OpenAI-compatible response shape.
type GroqResponse = {
  choices?: Array<{
    message?: { content?: string };
    finish_reason?: string;
  }>;
  error?: { message: string };
};

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.error("[chat] Missing GROQ_API_KEY env var");
      return NextResponse.json(
        {
          reply: `I'm not fully set up yet. Please reach out to ${CONTACT_EMAIL} and the team will help you directly.`,
        },
        { status: 200 }
      );
    }

    const body     = (await req.json()) as { messages?: ClientMessage[] };
    const incoming = Array.isArray(body.messages) ? body.messages : [];

    // Sanitize history: valid roles only, non-empty strings, last 12 turns.
    const history = incoming
      .filter(
        (m) =>
          m &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.trim().length > 0
      )
      .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }))
      .slice(-12);

    if (history.length === 0) {
      return NextResponse.json(
        {
          reply:
            "Ask me anything about Avishkar AI — the audit, the agents, security, or how to get in touch.",
        },
        { status: 200 }
      );
    }

    // Groq uses the OpenAI chat completions format.
    // System prompt is prepended as the first message with role "system".
    const groqRes = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 600,
        temperature: 0.1,   // near-deterministic — reduces hallucination
        top_p: 0.1,         // tight nucleus sampling — no creative gap-filling
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...history,
        ],
      }),
    });

    if (!groqRes.ok) {
      const detail = await groqRes.text().catch(() => "");
      console.error("[chat] Groq API error", groqRes.status, detail);
      return NextResponse.json(
        {
          reply: `Sorry — I hit a problem reaching the assistant. Please try again in a moment, or email ${CONTACT_EMAIL}.`,
        },
        { status: 200 }
      );
    }

    const data = (await groqRes.json()) as GroqResponse;

    // Groq (OpenAI format): reply is in choices[0].message.content
    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      `I'm not sure about that one. For anything I can't cover, reach the team at ${CONTACT_EMAIL}.`;

    return NextResponse.json({ reply }, { status: 200 });

  } catch (err) {
    console.error("[chat] Unexpected error", err);
    return NextResponse.json(
      {
        reply: `Something went wrong on my end. Please try again shortly, or contact ${CONTACT_EMAIL}.`,
      },
      { status: 200 }
    );
  }
}
