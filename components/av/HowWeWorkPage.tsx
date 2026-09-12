import type { CSSProperties } from "react";
import Link from "next/link";

const mono: CSSProperties = { fontFamily: "'DM Mono', monospace" };

const STEPS = [
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
];

const FORMS = [
  "An integration between systems",
  "Workflow automation",
  "An internal tool",
  "A reporting system",
  "An AI agent",
  "A custom application",
];

const CUSTOM_BODY =
  "What you see here is a look at current work, not a catalogue of everything we do. Most builds are specific to one practice — bring us the problem and we'll scope it.";

const FAQS = [
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

export function HowWeWorkPage() {
  return (
    <div style={{ maxWidth: "100%", overflowX: "hidden" }}>
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "88px 32px 0" }}>
        <div className="av-rise" style={{ ...mono, fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#586060" }}>How we work</div>
        <h1 className="av-rise" style={{ fontSize: "clamp(36px, 5.2vw, 68px)", lineHeight: 1.02, letterSpacing: "-.036em", fontWeight: 500, margin: "20px 0 0", maxWidth: "22ch", textWrap: "balance" }}>
          A conversation first. Then something small that works.
        </h1>
        <p style={{ fontSize: "clamp(16.5px,1.4vw,19px)", lineHeight: 1.6, color: "#4E5654", maxWidth: "58ch", margin: "22px 0 0", textWrap: "pretty" }}>
          No long discovery phase, no platform migration, no committee. We start with the workflow that frustrates you and build the smallest thing that fixes it.
        </p>
        <div style={{ marginTop: 28 }}>
          <Link href="/contact" className="av-hero-btn-dark" style={{ fontSize: 15, fontWeight: 500, padding: "14px 26px", borderRadius: 999, background: "#14181A", color: "#F1F1ED" }}>
            Book a 30-min conversation
          </Link>
        </div>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "72px 32px 0" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {STEPS.map((step, i) => (
            <div key={step.title} style={{ display: "flex", flexWrap: "wrap", gap: 24, borderTop: "1px solid rgba(20,24,26,.14)", paddingTop: 24 }}>
              <div style={{ flex: "1 1 220px", minWidth: 0 }}>
                <div style={{ ...mono, fontSize: 12, color: "#6E7674" }}>{String(i + 1).padStart(2, "0")}</div>
                <h2 style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-.01em", margin: "8px 0 0" }}>{step.title}</h2>
                <p style={{ fontSize: 13, color: "#6E7674", margin: "6px 0 0" }}>{step.timing}</p>
              </div>
              <p style={{ flex: "3 1 480px", minWidth: 0, fontSize: 16, lineHeight: 1.6, color: "#4E5654", margin: 0, maxWidth: "62ch" }}>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "96px 32px 0" }}>
        <div style={{ ...mono, fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#586060" }}>What we build</div>
        <h2 style={{ fontSize: "clamp(24px,2.8vw,36px)", lineHeight: 1.1, letterSpacing: "-.028em", fontWeight: 500, margin: "14px 0 0", maxWidth: "20ch" }}>Built around your practice. Not the other way around.</h2>
        <p style={{ fontSize: 16.5, lineHeight: 1.6, color: "#4E5654", margin: "14px 0 0", maxWidth: "58ch" }}>
          Your practice should not have to change how it works just to fit another piece of software. Avishkar works with the systems you already use and builds the technology around your workflow.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 32px", marginTop: 32 }}>
          {FORMS.map((f) => (
            <div key={f} style={{ flex: "1 1 260px", minWidth: 0, borderTop: "1px solid rgba(20,24,26,.14)", paddingTop: 12, fontSize: 14.5, color: "#14181A" }}>
              {f}
            </div>
          ))}
        </div>

        <p style={{ fontSize: 16, lineHeight: 1.6, color: "#4E5654", margin: "32px 0 0", maxWidth: "62ch" }}>{CUSTOM_BODY}</p>
        <div style={{ marginTop: 16 }}>
          <Link href="/contact?intent=custom" style={{ fontSize: 14.5, fontWeight: 500, color: "#2F6B5F" }}>
            Don&apos;t see what you need? →
          </Link>
        </div>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "96px 32px 0" }}>
        <div style={{ ...mono, fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#586060" }}>Questions</div>
        <h2 style={{ fontSize: "clamp(24px,2.8vw,36px)", lineHeight: 1.1, letterSpacing: "-.028em", fontWeight: 500, margin: "14px 0 0" }}>What practices usually ask first.</h2>

        <div style={{ marginTop: 36, maxWidth: "68ch", display: "flex", flexDirection: "column", gap: 28 }}>
          {FAQS.map((faq) => (
            <div key={faq.q} style={{ borderTop: "1px solid rgba(20,24,26,.14)", paddingTop: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-.01em", margin: 0 }}>{faq.q}</h3>
              <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "#4E5654", margin: "10px 0 0" }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "96px 32px 140px" }}>
        <div style={{ borderTop: "1px solid rgba(20,24,26,.12)", paddingTop: 48 }}>
          <h2 style={{ fontSize: "clamp(24px,2.8vw,36px)", lineHeight: 1.1, letterSpacing: "-.028em", fontWeight: 500, margin: 0, maxWidth: "18ch" }}>Start with the workflow.</h2>
          <p style={{ fontSize: 16.5, lineHeight: 1.6, color: "#4E5654", margin: "14px 0 0", maxWidth: "56ch" }}>
            Thirty minutes, no slide deck. If technology isn&apos;t the right answer, we&apos;ll say so.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
            <Link href="/contact" className="av-hero-btn-dark" style={{ fontSize: 15, fontWeight: 500, padding: "14px 26px", borderRadius: 999, background: "#14181A", color: "#F1F1ED" }}>
              Book a 30-min conversation
            </Link>
            <Link href="/agents" className="av-hero-btn-outline" style={{ fontSize: 15, fontWeight: 500, padding: "14px 26px", borderRadius: 999, border: "1px solid rgba(20,24,26,.2)", color: "#14181A" }}>
              See our work
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
