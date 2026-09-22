"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { isValidEmail, submitEarlyAccess } from "@/lib/early-access";

const WORDS = ["aesthetics.", "medspas.", "wellness.", "modern practices."];

export type LatestInsight = {
  slug: string;
  art: string;
  img: string;
  cat: string;
  read: string;
  title: string;
  dek: string;
  date: string;
};

type Stage = {
  n: string;
  label: string;
  side: string;
  t: string;
  b: string;
  bubbles?: [string, string][];
  rows?: [string, string][];
  systems: string[];
  gap: string;
  fix: string;
};

const STAGES: Stage[] = [
  {
    n: "01",
    label: "Discover",
    side: "Patient",
    t: "Sarah sees an ad for lip filler",
    b: "Tuesday, 9:40pm. An ad stops her mid-scroll; she taps through, reads the pricing page twice, and closes the tab.",
    systems: ["Meta Ads", "Google Ads", "Website", "Analytics"],
    gap: "Marketing knows someone clicked. Nobody inside the practice knows Sarah exists.",
    fix: "We keep the source, the treatment she looked at and the pages she read attached to her — so the first real conversation starts with context instead of a blank form.",
  },
  {
    n: "02",
    label: "Inquire",
    side: "Patient",
    t: "She sends the message every practice gets",
    b: "One inquiry, one expectation: a fast, specific answer.",
    bubbles: [["Sarah", "Hi, I'm interested in lip filler. How much does it cost and do you have appointments this week?"]],
    systems: ["Web form", "CRM", "SMS", "Email", "Phone system"],
    gap: "Someone has to notice it, answer it, and judge whether it's a real lead — usually between patients.",
    fix: "Every inquiry lands in one queue, deduplicated against the existing record, with the ad and page history already attached.",
  },
  {
    n: "03",
    label: "Converse",
    side: "AI front desk",
    t: "An AI front desk answers in seconds",
    b: "It speaks in the practice's approved language, handles the questions it is allowed to handle, and escalates the moment it shouldn't.",
    bubbles: [
      ["Sarah", "I'm interested in lip filler. How much is it?"],
      ["Front desk", "Happy to help. Pricing depends on the product and the amount your provider recommends at consultation. Would you like me to find you a consultation time this week?"],
    ],
    systems: ["AI front desk", "SMS", "CRM", "Staff inbox"],
    gap: "After hours the reply comes tomorrow. By then most filler shoppers have messaged three practices.",
    fix: "Approved answers, instantly, on your words — never clinical advice, always a clean handoff to a human when judgment is required.",
  },
  {
    n: "04",
    label: "Qualify",
    side: "AI front desk",
    t: "The conversation becomes structured information",
    b: "Treatment interest, location, timing, new-or-existing, and whatever else your intake requires — captured in the conversation, not retyped after it.",
    rows: [
      ["Treatment interest", "Lip filler · first time"],
      ["Location", "Downtown"],
      ["Preferred time", "Thu or Fri, after 3pm"],
      ["Patient status", "New · no chart"],
    ],
    systems: ["Conversation", "CRM", "Routing rules"],
    gap: "Chat details get copied into the CRM by hand. Fields get missed, and the follow-up starts from scratch.",
    fix: "Avishkar writes the structured record into your CRM and scheduling directly — one source, no re-entry.",
  },
  {
    n: "05",
    label: "Book",
    side: "Patient",
    t: "Thursday, 4:00 PM",
    b: "Sarah picks a time and gets a confirmation. That's the whole experience from her side.",
    rows: [
      ["Booked", "Thu 4:00pm · Consultation"],
      ["Confirmation", "SMS + calendar invite"],
      ["Pre-visit", "Intake link · card on file"],
    ],
    systems: ["Scheduler", "Practice management", "Calendar", "Confirmation SMS"],
    gap: "The patient sees one booking. The practice touches four systems to make it real — and one of them is a person.",
    fix: "We orchestrate the handoffs between the systems you already run, so confirmation, intake and payment setup happen in one flow.",
  },
  {
    n: "06",
    label: "Consult",
    side: "Provider",
    t: "The provider assesses and decides",
    b: "Clinical judgment sits entirely with the provider. What changes is how much they already know when Sarah sits down.",
    rows: [
      ["Arrived as", "Ad → chat → booking"],
      ["Asked about", "Lip filler · pricing"],
      ["On file", "Intake, consent, card"],
    ],
    systems: ["Provider", "Clinical workflow", "EMR"],
    gap: "Most providers walk in blind — no view of what she asked for, what she was quoted, or how she found the practice.",
    fix: "The operational history is on the chart screen. Avishkar never diagnoses and never decides treatment.",
  },
  {
    n: "07",
    label: "Document",
    side: "Clinical",
    t: "The visit is documented in the EMR",
    b: "Treatment performed, product and lot, units, photos, consent, provider notes, follow-up instructions.",
    rows: [
      ["Treatment", "0.7ml · lip filler"],
      ["Product / lot", "Logged to inventory"],
      ["Consent + photos", "On chart"],
    ],
    systems: ["EMR", "Inventory", "Consent", "Photo storage"],
    gap: "The chart is complete and isolated. Marketing, CRM and billing each hold a different version of Sarah.",
    fix: "We integrate rather than replace: the EMR stays the clinical record of truth, and every other system reads from it.",
  },
  {
    n: "08",
    label: "Follow up",
    side: "Practice",
    t: "Follow-through stops depending on memory",
    b: "Aftercare, the two-week check-in, the review request, the next appointment — on practice-approved rules and timing.",
    bubbles: [
      ["Front desk", "Hi Sarah — how are your lips feeling three days in? Reply here if anything looks or feels off."],
      ["Sarah", "A little swollen on one side, is that normal?"],
    ],
    systems: ["SMS", "Email", "Task queue", "EMR triggers"],
    gap: "On a busy week follow-up is whatever a person remembers to do.",
    fix: "Workflows run on schedule; anything clinical escalates to a nurse with the chart attached, inside minutes.",
  },
  {
    n: "09",
    label: "Retain",
    side: "Practice",
    t: "Six months later, Sarah hasn't come back",
    b: "The information needed to notice that is spread across four systems.",
    rows: [
      ["Last visit", "184 days ago"],
      ["Treatment", "Lip filler · 1 of 1"],
      ["Segment", "Lapsed · consented to contact"],
    ],
    systems: ["EMR", "CRM", "Scheduling", "Marketing"],
    gap: "Nobody can answer “who hasn't been back and should be?” without three exports and a spreadsheet.",
    fix: "One segment across systems — last visit, treatment, spend, consent — built once and refreshed automatically.",
  },
  {
    n: "10",
    label: "Return",
    side: "Patient",
    t: "She re-enters the same loop",
    b: "Approved outreach goes out, and the reply lands back in the conversation that knows her.",
    bubbles: [
      ["Front desk", "Hi Sarah, it's been a while since your last visit. Would you like to schedule a consultation?"],
      ["Sarah", "Yes — do you have anything next Thursday?"],
    ],
    systems: ["Messaging", "AI front desk", "Scheduler", "CRM"],
    gap: "Blast campaigns go to everyone, and the replies land in an inbox nobody owns.",
    fix: "Conversation → qualification → booking, closed as a loop, with the practice team in the seat whenever it matters.",
  },
];

const mono: CSSProperties = { fontFamily: "'DM Mono', monospace" };

/**
 * Some mobile browsers nudge the page's own vertical scroll position when
 * a horizontally-scrolling element inside it changes (a tap on the stage
 * rail, or the rail's own scrollLeft animating on auto-cycle) — even
 * though nothing about the page layout actually changed. A `scroll` event
 * listener reacts to that drift the instant the browser applies it and
 * snaps back to the position captured just before, which is faster and
 * more reliable than polling or a couple of requestAnimationFrame calls.
 */
function lockPageScroll(durationMs = 600) {
  const y = window.scrollY;
  const onScroll = () => {
    if (window.scrollY !== y) window.scrollTo(0, y);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  setTimeout(() => window.removeEventListener("scroll", onScroll), durationMs);
}

export function HomePage({ latestInsights }: { latestInsights: LatestInsight[] }) {
  const [word, setWord] = useState(0);
  const [step, setStep] = useState(0);
  const [view, setView] = useState<"today" | "avishkar">("today");
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [joinPending, setJoinPending] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setWord((w) => (w + 1) % WORDS.length), 2600);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % STAGES.length), 5200);
    return () => clearInterval(t);
  }, []);

  // Manual selection restarts auto-advance at a slower 9000ms cadence.
  const pickStep = (i: number) => {
    lockPageScroll();
    setStep(i);
    setSlowMode(true);
  };
  const [slowMode, setSlowMode] = useState(false);
  useEffect(() => {
    if (!slowMode) return;
    const t = setInterval(() => setStep((s) => (s + 1) % STAGES.length), 9000);
    return () => clearInterval(t);
  }, [slowMode]);

  const active = STAGES[step];
  const today = view !== "avishkar";

  const railScrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = railScrollRef.current;
    if (!container) return;
    // Only the mobile horizontal-scroll rail (flex-direction: row, below 900px)
    // needs the active pill scrolled into view. On desktop the rail is a
    // vertical, fully-visible list and this effect is a no-op there.
    //
    // Scroll the container's own scrollLeft directly rather than using
    // Element.scrollIntoView: scrollIntoView asks the browser to bring the
    // target into view across *every* scrollable ancestor, including the
    // page itself — if the rail (or the page) isn't fully within the
    // viewport it will also scroll the whole page vertically, which is
    // exactly what must not happen here since this fires on every
    // auto-cycle tick regardless of where the user is looking.
    if (getComputedStyle(container).flexDirection !== "row") return;
    const activePill = container.children[step] as HTMLElement | undefined;
    if (!activePill) return;
    const target = Math.max(
      0,
      activePill.offsetLeft - container.clientWidth / 2 + activePill.clientWidth / 2
    );
    // A single, instant write to scrollLeft — no native scrollTo(),
    // no smooth-scroll, no per-frame writes across a rAF loop. On real
    // Android Chrome a continuous animation (whether native smooth-scroll
    // or a hand-rolled rAF loop) that repeatedly touches an inner
    // scroll container's offset can still be misread by the compositor as
    // page-level scroll activity, which hides the dynamic address-bar
    // toolbar and grows the viewport — this is what showed up as the page
    // "auto-scrolling" on every stage change. A single synchronous write
    // has nothing ongoing for the compositor to misattribute.
    if (container.scrollLeft !== target) container.scrollLeft = target;
  }, [step]);

  const onJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = email.trim();
    if (!isValidEmail(next)) {
      setJoinError("Enter a valid work email.");
      return;
    }
    setJoinError("");
    setJoinPending(true);
    const result = await submitEarlyAccess(next);
    setJoinPending(false);
    if (!result.ok) {
      setJoinError(result.error);
      return;
    }
    setJoined(true);
  };

  return (
    <div style={{ maxWidth: "100%", overflowX: "hidden" }}>
      <section id="top" className="av-hero-section" style={{ maxWidth: 1240, margin: "0 auto", padding: "104px 32px 0" }}>
        <div
          className="av-rise"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            ...mono,
            fontSize: 12,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            color: "#6E7674",
            border: "1px solid rgba(20,24,26,.14)",
            borderRadius: 999,
            padding: "7px 14px",
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2F6B5F", display: "block", animation: "avPulse 2.4s ease-in-out infinite" }} />
          Technology partner for aesthetics, medspas &amp; wellness
        </div>
        <h1
          className="av-rise"
          style={{
            fontSize: "clamp(40px, 6.4vw, 88px)",
            lineHeight: 0.99,
            letterSpacing: "-.036em",
            fontWeight: 500,
            margin: "28px 0 0",
            maxWidth: "19ch",
            textWrap: "balance",
          }}
        >
          We build the technology your practice{" "}
          <span style={{ color: "#2F6B5F" }}>can&apos;t buy off the shelf.</span>
        </h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 40, alignItems: "flex-end", justifyContent: "space-between", marginTop: 36 }}>
          <p style={{ fontSize: "clamp(17px, 1.5vw, 20px)", lineHeight: 1.5, color: "#4E5654", maxWidth: "54ch", margin: 0, textWrap: "pretty" }}>
            Avishkar builds AI, automation and custom systems for aesthetic practices — connecting patient journeys, practice operations, and the technology behind them.
          </p>
          <div className="av-hero-cta-row" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="#how" className="av-hero-btn-dark av-hero-cta-btn" style={{ fontSize: 15, fontWeight: 500, padding: "14px 26px", borderRadius: 999, background: "#14181A", color: "#F1F1ED", textAlign: "center" }}>
              See what we can build →
            </a>
            <Link href="/contact" className="av-hero-btn-outline av-hero-cta-btn" style={{ fontSize: 15, fontWeight: 500, padding: "14px 26px", borderRadius: 999, border: "1px solid rgba(20,24,26,.2)", color: "#14181A", textAlign: "center" }}>
              Talk to Avishkar
            </Link>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "64px 32px 0" }}>
        <div
          className="av-dashboard-card"
          style={{
            position: "relative",
            border: "1px solid rgba(20,24,26,.12)",
            borderRadius: 20,
            background: "linear-gradient(180deg, #F8F8F5, #E9E9E3)",
            padding: 26,
            boxShadow: "0 40px 80px -60px rgba(20,24,26,.55)",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "stretch" }}>
            <div style={{ flex: "2 1 320px", background: "#FDFDFB", border: "1px solid rgba(20,24,26,.1)", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ ...mono, fontSize: 10.5, letterSpacing: ".12em", textTransform: "uppercase", color: "#5E6664" }}>Patient journey</span>
                <span style={{ fontSize: 11, color: "#2F6B5F", background: "rgba(47,107,95,.09)", padding: "3px 8px", borderRadius: 999 }}>Active</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#DCE3DC", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, color: "#566661" }}>MR</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>M. Rowan</div>
                  <div style={{ fontSize: 12.5, color: "#6E7674" }}>Member since 2023 · VIP tier</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {[
                  { dot: "#2F6B5F", title: "Consultation completed", meta: "Mar 12 · Dr. Lane" },
                  { dot: "rgba(20,24,26,.2)", title: "Treatment · Series 2 of 4", meta: "Apr 02 · Room 3" },
                  { dot: "rgba(20,24,26,.2)", title: "Follow-up automation queued", meta: "+14 days · SMS then email" },
                ].map((row) => (
                  <div key={row.title} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: row.dot, marginTop: 5, flex: "none" }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 500 }}>{row.title}</div>
                      <div style={{ fontSize: 12, color: "#586060" }}>{row.meta}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ flex: "1.6 1 260px", display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
              <div style={{ background: "#14181A", color: "#EDF0EC", borderRadius: 14, padding: 18, flex: 1 }}>
                <div style={{ ...mono, fontSize: 10.5, letterSpacing: ".12em", textTransform: "uppercase", color: "#8D9693" }}>Today · scheduling</div>
                <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "8px 10px", borderRadius: 8, background: "rgba(255,255,255,.06)" }}><span>09:00 · Botox</span><span style={{ color: "#BDC5C2" }}>Rm 1</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "8px 10px", borderRadius: 8, background: "rgba(47,107,95,.24)", border: "1px solid rgba(90,150,136,.45)" }}><span>10:30 · Laser series</span><span style={{ color: "#EBD6C6" }}>Rm 3</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "8px 10px", borderRadius: 8, background: "rgba(255,255,255,.06)" }}><span>13:15 · Consult</span><span style={{ color: "#BDC5C2" }}>Rm 2</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "8px 10px", borderRadius: 8, background: "rgba(255,255,255,.06)" }}><span>15:45 · Filler</span><span style={{ color: "#BDC5C2" }}>Rm 1</span></div>
                </div>
              </div>
              <div style={{ background: "#FDFDFB", border: "1px solid rgba(20,24,26,.1)", borderRadius: 14, padding: 16 }}>
                <div style={{ ...mono, fontSize: 10.5, letterSpacing: ".12em", textTransform: "uppercase", color: "#5E6664" }}>Chair utilization</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 56, marginTop: 12 }}>
                  {[52, 68, 44, 82, 71, 90].map((h, idx) => (
                    <div key={idx} style={{ flex: 1, height: `${h}%`, background: idx === 3 ? "#2F6B5F" : "#D3DDD4", borderRadius: 3 }} />
                  ))}
                </div>
              </div>
            </div>

            <div style={{ flex: "1.1 1 200px", display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
              <div style={{ background: "#FDFDFB", border: "1px solid rgba(20,24,26,.1)", borderRadius: 14, padding: 16 }}>
                <div style={{ ...mono, fontSize: 10.5, letterSpacing: ".12em", textTransform: "uppercase", color: "#5E6664" }}>Net revenue · MTD</div>
                <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-.03em", marginTop: 8 }}>$418,260</div>
                <div style={{ fontSize: 12.5, color: "#3F7D6C" }}>▲ 12.4% vs. last month</div>
              </div>
              <div style={{ background: "#FDFDFB", border: "1px solid rgba(20,24,26,.1)", borderRadius: 14, padding: 16, flex: 1 }}>
                <div style={{ ...mono, fontSize: 10.5, letterSpacing: ".12em", textTransform: "uppercase", color: "#5E6664" }}>Automation</div>
                <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#4E5654" }}>Post-care check-ins</span><span style={{ fontWeight: 600 }}>128</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#4E5654" }}>Rebook prompts</span><span style={{ fontWeight: 600 }}>64</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#4E5654" }}>No-show recovery</span><span style={{ fontWeight: 600 }}>19</span></div>
                </div>
                <div style={{ marginTop: 14, height: 4, borderRadius: 2, background: "rgba(20,24,26,.08)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: "40%", background: "#2F6B5F", animation: "avSweep 3.4s ease-in-out infinite" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="early-access" style={{ marginTop: 110, background: "#14181A", color: "#EDF0EC" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "96px 32px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 56, alignItems: "center" }}>
            <div style={{ flex: "1 1 400px", minWidth: 0 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 9, ...mono, fontSize: 11.5, letterSpacing: ".12em", textTransform: "uppercase", color: "#6FA394", border: "1px solid rgba(111,163,148,.32)", borderRadius: 999, padding: "6px 13px" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2F6B5F", display: "block", animation: "avPulse 2.4s ease-in-out infinite" }} />
                In training · early access
              </div>
              <h2 style={{ fontSize: "clamp(30px, 4vw, 54px)", lineHeight: 1.03, letterSpacing: "-.033em", fontWeight: 500, margin: "22px 0 0", maxWidth: "18ch", textWrap: "balance" }}>
                We&apos;re building intelligence for aesthetics.
              </h2>
              <p style={{ fontSize: 17, lineHeight: 1.6, color: "#B2BAB7", maxWidth: "48ch", margin: "20px 0 0", textWrap: "pretty" }}>
                We&apos;re training a model specifically around the workflows and needs of aesthetic practices, medspas, and wellness businesses — the vocabulary, the protocols, the operational reality.
              </p>
              <p style={{ fontSize: 17, lineHeight: 1.6, color: "#EDF0EC", maxWidth: "48ch", margin: "18px 0 0" }}>
                <strong style={{ fontWeight: 600 }}>Want to be an early adopter?</strong> Join the early-access list and we&apos;ll let you know when the model is ready to experience.
              </p>

              {!joined ? (
                <>
                  <form onSubmit={onJoin} style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 28, maxWidth: 480 }}>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (joinError) setJoinError("");
                      }}
                      placeholder="you@yourpractice.com"
                      className="av-dark-input"
                      style={{ flex: "1 1 240px", minWidth: 0, fontFamily: "inherit", fontSize: 15, padding: "14px 18px", borderRadius: 999, border: "1px solid rgba(255,255,255,.22)", background: "rgba(255,255,255,.05)", color: "#F1F1ED", outline: "none" }}
                    />
                    <button
                      type="submit"
                      disabled={joinPending}
                      className="av-join-btn"
                      style={{ fontFamily: "inherit", fontSize: 15, fontWeight: 500, padding: "14px 26px", borderRadius: 999, border: "none", background: "#2F6B5F", color: "#F8F8F5", cursor: joinPending ? "default" : "pointer", opacity: joinPending ? 0.7 : 1 }}
                    >
                      {joinPending ? "Sending…" : "Join the Early Access List"}
                    </button>
                  </form>
                  {joinError ? (
                    <div style={{ ...mono, fontSize: 11.5, color: "#E5A0A0", marginTop: 12 }}>{joinError}</div>
                  ) : (
                    <div style={{ ...mono, fontSize: 11.5, color: "#7F8886", marginTop: 12 }}>No newsletter. One note when there&apos;s something real to try.</div>
                  )}
                </>
              ) : (
                <div style={{ marginTop: 28, border: "1px solid rgba(111,163,148,.35)", background: "rgba(47,107,95,.14)", borderRadius: 14, padding: "20px 22px", maxWidth: 480 }}>
                  <div style={{ fontSize: 17, fontWeight: 500 }}>You&apos;re on the list.</div>
                  <div style={{ fontSize: 14.5, color: "#B2BAB7", marginTop: 6 }}>We&apos;ll reach out before the first practices get access — and we&apos;ll ask what we should train on next.</div>
                </div>
              )}
            </div>

            <div style={{ flex: "1 1 360px", minWidth: 0, border: "1px solid rgba(255,255,255,.14)", borderRadius: 18, background: "#1C2124", padding: 24 }}>
              <div style={{ ...mono, fontSize: 10.5, letterSpacing: ".12em", textTransform: "uppercase", color: "#7F8886" }}>What it learns from</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
                {[
                  ["Practice knowledge & protocols", "indexed", "#8FB6A6"],
                  ["Operational workflows", "indexed", "#8FB6A6"],
                  ["Patient interaction patterns", "training", "#6FA394"],
                  ["Scheduling & revenue signals", "training", "#6FA394"],
                ].map(([label, status, color]) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, border: "1px solid rgba(255,255,255,.1)", borderRadius: 10, padding: "12px 14px", fontSize: 13.5 }}>
                    <span>{label}</span>
                    <span style={{ ...mono, fontSize: 10.5, color }}>{status}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "center", padding: "16px 0 14px" }}>
                <div style={{ width: 1, height: 30, background: "linear-gradient(180deg, rgba(255,255,255,.08), #2F6B5F)" }} />
              </div>
              <div style={{ border: "1px solid rgba(111,163,148,.4)", borderRadius: 14, background: "linear-gradient(180deg, rgba(47,107,95,.22), rgba(47,107,95,.06))", padding: 20, textAlign: "center" }}>
                <div style={{ ...mono, fontSize: 10.5, letterSpacing: ".14em", textTransform: "uppercase", color: "#A9C9BF" }}>Avishkar Model</div>
                <div style={{ fontSize: 20, fontWeight: 500, marginTop: 8 }}>Domain intelligence for practice teams</div>
                <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,.1)", marginTop: 18, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: "34%", background: "#6FA394", animation: "avSweep 3.6s ease-in-out infinite" }} />
                </div>
                <div style={{ ...mono, fontSize: 10.5, color: "#A7B0AD", marginTop: 10 }}>Private by design · practice data never trains other practices</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" style={{ maxWidth: 1240, margin: "0 auto", padding: "110px 32px 0" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 40, alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ ...mono, fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#586060" }}>How it works</div>
            <h2 style={{ fontSize: "clamp(30px, 4vw, 56px)", lineHeight: 1.02, letterSpacing: "-.033em", fontWeight: 500, margin: "18px 0 0", maxWidth: "18ch", textWrap: "balance" }}>
              One patient journey. <span style={{ color: "#2F6B5F" }}>Ten disconnected systems.</span>
            </h2>
          </div>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: "#4E5654", maxWidth: "42ch", margin: 0, textWrap: "pretty" }}>
            Your patient sees one experience. Your team sees a maze of tools, inboxes, spreadsheets and manual handoffs. Here&apos;s a real one, end to end — Sarah wants lip filler.
          </p>
        </div>

        <div style={{ marginTop: 40, border: "1px solid rgba(20,24,26,.12)", borderRadius: 20, background: "linear-gradient(180deg,#F8F8F5,#E9E9E3)", padding: 22, boxShadow: "0 40px 80px -60px rgba(20,24,26,.55)" }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            {STAGES.map((s, idx) => {
              const on = idx <= step;
              return (
                <div
                  key={s.n}
                  style={{
                    flex: "0 1 auto",
                    textAlign: "center",
                    ...mono,
                    fontSize: 11,
                    letterSpacing: ".04em",
                    textTransform: "uppercase",
                    padding: "8px 13px",
                    borderRadius: 999,
                    transition: "all .5s ease",
                    whiteSpace: "nowrap",
                    border: `1px solid ${on ? "rgba(47,107,95,.35)" : "rgba(20,24,26,.14)"}`,
                    background: on ? "rgba(47,107,95,.1)" : "transparent",
                    color: on ? "#245348" : "#59615F",
                  }}
                >
                  {s.label}
                </div>
              );
            })}
          </div>
          <div style={{ height: 4, borderRadius: 2, background: "rgba(20,24,26,.09)", marginTop: 14, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 2, background: "#2F6B5F", transition: "width .6s cubic-bezier(.22,1,.36,1)", width: `${((step + 1) / STAGES.length) * 100}%` }} />
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginTop: 22, alignItems: "stretch" }}>
            <div ref={railScrollRef} className="av-stage-rail" style={{ flex: "1 1 230px", minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
              {STAGES.map((s, idx) => {
                const activeRow = idx === step;
                return (
                  <div
                    key={s.n}
                    className="av-stage-rail-item"
                    onPointerDown={() => lockPageScroll()}
                    onTouchStart={() => lockPageScroll()}
                    onClick={() => pickStep(idx)}
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      gap: 11,
                      alignItems: "center",
                      padding: "11px 14px",
                      borderRadius: 10,
                      transition: "background .35s ease,color .35s ease",
                      background: activeRow ? "#14181A" : "transparent",
                      color: activeRow ? "#EDF0EC" : "#4E5654",
                    }}
                  >
                    <span style={{ ...mono, fontSize: 11, color: activeRow ? "#6FA394" : "#5E6664" }}>{s.n}</span>
                    <span style={{ fontSize: 14.5, fontWeight: 500, lineHeight: 1.3 }}>{s.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="av-stage-detail" style={{ flex: "2.1 1 420px", minWidth: 0, border: "1px solid rgba(20,24,26,.12)", borderRadius: 16, background: "#FDFDFB", padding: 24, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <span style={{ ...mono, fontSize: 10.5, letterSpacing: ".12em", textTransform: "uppercase", color: "#5E6664" }}>Stage {active.n} of 10 · {active.label}</span>
                <span style={{ fontSize: 11.5, padding: "4px 10px", borderRadius: 999, background: "rgba(47,107,95,.1)", color: "#245348", whiteSpace: "nowrap" }}>{active.side}</span>
              </div>
              <div style={{ fontSize: "clamp(21px,2.1vw,28px)", fontWeight: 500, letterSpacing: "-.024em", marginTop: 16, lineHeight: 1.18 }}>{active.t}</div>
              <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "#4E5654", margin: "10px 0 0", maxWidth: "52ch" }}>{active.b}</p>

              {active.bubbles && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
                  {active.bubbles.map(([who, text], idx) => {
                    const mine = who === "Sarah";
                    return (
                      <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: mine ? "flex-start" : "flex-end" }}>
                        <span style={{ ...mono, fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "#5E6664", marginBottom: 6 }}>{who}</span>
                        <div
                          style={{
                            maxWidth: "90%",
                            fontSize: 14,
                            lineHeight: 1.5,
                            padding: "12px 15px",
                            borderRadius: 14,
                            ...(mine
                              ? { background: "#E8E9E4", color: "#23282A", borderBottomLeftRadius: 4 }
                              : { background: "#14181A", color: "#EDF0EC", borderBottomRightRadius: 4 }),
                          }}
                        >
                          {text}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {active.rows && (
                <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 9 }}>
                  {active.rows.map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 14, fontSize: 13.5, borderBottom: "1px solid rgba(20,24,26,.07)", paddingBottom: 8 }}>
                      <span style={{ color: "#586060" }}>{k}</span>
                      <span style={{ fontWeight: 500, textAlign: "right" }}>{v}</span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: 22, borderTop: "1px solid rgba(20,24,26,.08)", paddingTop: 16 }}>
                <div style={{ ...mono, fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "#5E6664" }}>Systems involved today</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 10 }}>
                  {active.systems.map((name) => (
                    <span key={name} style={{ ...mono, fontSize: 11, color: "#5F6866", border: "1px solid rgba(20,24,26,.16)", borderRadius: 999, padding: "5px 11px" }}>{name}</span>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 18 }}>
                <div style={{ flex: "1 1 220px", minWidth: 0, borderLeft: "2px solid rgba(47,107,95,.4)", padding: "2px 0 2px 14px" }}>
                  <div style={{ ...mono, fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "#2A6154" }}>Where it breaks</div>
                  <p style={{ fontSize: 14, lineHeight: 1.55, color: "#4E5654", margin: "7px 0 0" }}>{active.gap}</p>
                </div>
                <div style={{ flex: "1 1 220px", minWidth: 0, borderRadius: 12, background: "#14181A", color: "#EDF0EC", padding: "14px 16px" }}>
                  <div style={{ ...mono, fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "#6FA394" }}>What Avishkar builds</div>
                  <p style={{ fontSize: 14, lineHeight: 1.55, margin: "7px 0 0" }}>{active.fix}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 88, display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-end", justifyContent: "space-between" }}>
          <h3 style={{ fontSize: "clamp(24px,2.8vw,38px)", lineHeight: 1.08, letterSpacing: "-.028em", fontWeight: 500, margin: 0, maxWidth: "22ch" }}>The same ten stages, two architectures.</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={() => setView("today")}
              style={{
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 13.5,
                fontWeight: 500,
                padding: "9px 18px",
                borderRadius: 999,
                border: today ? "1px solid #14181A" : "1px solid rgba(20,24,26,.18)",
                background: today ? "#14181A" : "transparent",
                color: today ? "#F1F1ED" : "#4E5654",
              }}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setView("avishkar")}
              style={{
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 13.5,
                fontWeight: 500,
                padding: "9px 18px",
                borderRadius: 999,
                border: !today ? "1px solid #14181A" : "1px solid rgba(20,24,26,.18)",
                background: !today ? "#14181A" : "transparent",
                color: !today ? "#F1F1ED" : "#4E5654",
              }}
            >
              With Avishkar
            </button>
          </div>
        </div>

        {today ? (
          <div className="av-compare-block" style={{ marginTop: 28, border: "1px solid rgba(20,24,26,.12)", borderRadius: 20, background: "#F8F8F5", padding: "clamp(22px,3vw,36px)" }}>
            <div style={{ ...mono, fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "#2A6154" }}>Today · the lead crosses seven tools and three people</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 22 }}>
              {["Instagram", "Google", "Website form", "Inbox & DMs"].map((s) => (
                <span key={s} style={{ flex: "1 1 140px", textAlign: "center", fontSize: 13.5, padding: "12px 10px", border: "1px dashed rgba(20,24,26,.26)", borderRadius: 10, color: "#4E5654" }}>{s}</span>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, marginTop: 14 }}>
              <div style={{ ...mono, fontSize: 10.5, color: "#2A6154" }}>manual · someone has to notice</div>
              <div style={{ width: 1, height: 22, background: "rgba(20,24,26,.22)" }} />
              <div style={{ border: "1px solid rgba(20,24,26,.2)", borderRadius: 12, background: "#FDFDFB", padding: "14px 26px", textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 500 }}>One staff member, retyping</div>
                <div style={{ ...mono, fontSize: 10.5, color: "#586060", marginTop: 4 }}>copy → paste → remember → follow up</div>
              </div>
              <div style={{ width: 1, height: 22, background: "rgba(20,24,26,.22)" }} />
              <div style={{ ...mono, fontSize: 10.5, color: "#2A6154" }}>manual · 7 handoffs per patient</div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
              {["CRM", "Scheduler", "EMR", "Email tool", "Spreadsheet"].map((s) => (
                <span key={s} style={{ flex: "1 1 120px", textAlign: "center", fontSize: 13.5, padding: "12px 10px", border: "1px dashed rgba(20,24,26,.26)", borderRadius: 10, color: "#4E5654" }}>{s}</span>
              ))}
            </div>
            <div style={{ marginTop: 22, fontSize: 15, color: "#4E5654", maxWidth: "60ch" }}>Nothing here was chosen badly. Each tool solves one stage — and every boundary between two of them is where time, context and leads leak out.</div>
          </div>
        ) : (
          <div className="av-compare-block" style={{ marginTop: 28, borderRadius: 20, background: "#14181A", color: "#EDF0EC", padding: "clamp(22px,3vw,36px)" }}>
            <div style={{ ...mono, fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "#6FA394" }}>With Avishkar · the same tools, orchestrated</div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 22 }}>
              <div style={{ border: "1px solid rgba(255,255,255,.2)", borderRadius: 999, padding: "10px 26px", fontSize: 15 }}>Patient</div>
              <div style={{ width: 1, height: 24, background: "linear-gradient(180deg, rgba(255,255,255,.14), #2F6B5F)" }} />
              <div style={{ width: "100%", maxWidth: 760, border: "1px solid rgba(111,163,148,.45)", borderRadius: 14, background: "linear-gradient(180deg, rgba(47,107,95,.24), rgba(47,107,95,.06))", padding: 18, textAlign: "center" }}>
                <div style={{ ...mono, fontSize: 10.5, letterSpacing: ".14em", textTransform: "uppercase", color: "#A9C9BF" }}>Avishkar</div>
                <div style={{ fontSize: "clamp(17px,1.8vw,21px)", fontWeight: 500, marginTop: 6 }}>Conversation, orchestration, and the workflow layer</div>
              </div>
              <div style={{ width: 1, height: 24, background: "linear-gradient(180deg, #2F6B5F, rgba(255,255,255,.14))" }} />
              <div style={{ width: "100%", display: "flex", flexWrap: "wrap", gap: 12 }}>
                {[
                  ["Patient journey", "Ads · Website", "Messaging · CRM"],
                  ["Practice operations", "Scheduling · Payments", "Inventory · Tasks"],
                  ["Clinical workflow", "EMR · Consent", "Photos · Follow-up"],
                ].map(([title, line1, line2]) => (
                  <div key={title} style={{ flex: "1 1 220px", minWidth: 0, border: "1px solid rgba(255,255,255,.14)", borderRadius: 12, padding: 16 }}>
                    <div style={{ fontSize: 15, fontWeight: 500 }}>{title}</div>
                    <div style={{ ...mono, fontSize: 11, color: "#98A19E", marginTop: 8, lineHeight: 1.8 }}>{line1}<br />{line2}</div>
                  </div>
                ))}
              </div>
              <div style={{ width: 1, height: 24, background: "rgba(255,255,255,.16)" }} />
              <div style={{ width: "100%", maxWidth: 760, border: "1px solid rgba(255,255,255,.16)", borderRadius: 12, padding: 14, textAlign: "center", fontSize: 15 }}>Practice team — one queue, one record, humans where judgment belongs</div>
              <div style={{ width: 1, height: 24, background: "rgba(255,255,255,.16)" }} />
              <div style={{ border: "1px solid rgba(111,163,148,.45)", borderRadius: 999, padding: "10px 26px", fontSize: 15, color: "#EDF0EC" }}>Patient returns</div>
            </div>
            <div style={{ marginTop: 24, fontSize: 15, color: "#B2BAB7", maxWidth: "62ch" }}>We don&apos;t replace your EMR or ask you to start over. We connect, automate and orchestrate the workflows around the systems your practice already uses.</div>
          </div>
        )}

        <div style={{ marginTop: 72, borderRadius: 20, background: "#14181A", color: "#EDF0EC", padding: "clamp(36px,5vw,72px) clamp(26px,4vw,56px)", display: "flex", flexWrap: "wrap", gap: 40, alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "clamp(24px,2.9vw,40px)", lineHeight: 1.12, letterSpacing: "-.03em", fontWeight: 500, maxWidth: "26ch", textWrap: "balance" }}>Your practice doesn&apos;t need another disconnected tool. It needs the systems around it to work together.</div>
            <div style={{ fontSize: "clamp(20px,2.2vw,30px)", fontWeight: 500, letterSpacing: "-.026em", color: "#6FA394", marginTop: 18 }}>That&apos;s what we build.</div>
          </div>
          <Link href="/contact" className="av-contact-btn" style={{ fontSize: 15, fontWeight: 500, padding: "14px 26px", borderRadius: 999, background: "#F1F1ED", color: "#14181A", whiteSpace: "nowrap" }}>Talk to Avishkar</Link>
        </div>
      </section>

      <section id="capabilities" style={{ maxWidth: 1240, margin: "0 auto", padding: "110px 32px 0" }}>
        <div style={{ ...mono, fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#586060" }}>01 — What we build</div>
        <h2 style={{ fontSize: "clamp(32px, 4.4vw, 60px)", lineHeight: 1.02, letterSpacing: "-.034em", fontWeight: 500, margin: "20px 0 0", maxWidth: "18ch" }}>One technology partner. Every critical workflow.</h2>
        <div style={{ height: 1, background: "rgba(20,24,26,.12)", marginTop: 56 }} />

        <div style={{ display: "flex", flexWrap: "wrap", gap: 48, padding: "56px 0", alignItems: "center" }}>
          <div style={{ flex: "1 1 330px", minWidth: 0 }}>
            <div style={{ ...mono, fontSize: 13, color: "#2F6B5F" }}>01</div>
            <h3 style={{ fontSize: "clamp(26px, 2.6vw, 36px)", lineHeight: 1.1, letterSpacing: "-.026em", fontWeight: 500, margin: "12px 0 0" }}>Practice Operations</h3>
            <p style={{ fontSize: 17, color: "#4E5654", lineHeight: 1.6, margin: "14px 0 0", maxWidth: "44ch" }}>Run the practice, not the paperwork. Scheduling, rooms, providers, inventory, and payments in one operating picture — with the handoffs automated.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20, ...mono, fontSize: 11.5, color: "#5F6866" }}>
              {["Scheduling", "Room & provider load", "Payments", "Inventory"].map((c) => (
                <span key={c} style={{ border: "1px solid rgba(20,24,26,.16)", borderRadius: 999, padding: "5px 11px" }}>{c}</span>
              ))}
            </div>
          </div>
          <div style={{ flex: "1.15 1 420px", minWidth: 0, border: "1px solid rgba(20,24,26,.12)", borderRadius: 16, background: "#FDFDFB", padding: 18, boxShadow: "0 30px 60px -50px rgba(20,24,26,.6)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(20,24,26,.08)", paddingBottom: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Wednesday, April 2</span>
              <span style={{ ...mono, fontSize: 11, color: "#586060" }}>4 providers · 3 rooms</span>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <div style={{ flex: "none", width: 44, display: "flex", flexDirection: "column", gap: 8, ...mono, fontSize: 10.5, color: "#5E6664", paddingTop: 22 }}>
                <div style={{ height: 34 }}>09:00</div><div style={{ height: 34 }}>10:30</div><div style={{ height: 34 }}>13:15</div><div style={{ height: 34 }}>15:45</div>
              </div>
              <div style={{ flex: 1, minWidth: 0, display: "flex", gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: "#586060", marginBottom: 8, textAlign: "center" }}>Rm 1</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ height: 34, borderRadius: 7, background: "#E3EAE4", borderLeft: "3px solid #7FA79A", fontSize: 11.5, padding: "6px 8px", color: "#3A4644", overflow: "hidden" }}>Botox · Rivera</div>
                    <div style={{ height: 34, borderRadius: 7, background: "rgba(20,24,26,.05)" }} />
                    <div style={{ height: 34, borderRadius: 7, background: "rgba(20,24,26,.05)" }} />
                    <div style={{ height: 34, borderRadius: 7, background: "#E3EAE4", borderLeft: "3px solid #7FA79A", fontSize: 11.5, padding: "6px 8px", color: "#3A4644", overflow: "hidden" }}>Filler · Rivera</div>
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: "#586060", marginBottom: 8, textAlign: "center" }}>Rm 2</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ height: 34, borderRadius: 7, background: "rgba(20,24,26,.05)" }} />
                    <div style={{ height: 34, borderRadius: 7, background: "#E1E9E4", borderLeft: "3px solid #6E9A8B", fontSize: 11.5, padding: "6px 8px", color: "#2D3B36", overflow: "hidden" }}>Hydrafacial</div>
                    <div style={{ height: 34, borderRadius: 7, background: "#E1E9E4", borderLeft: "3px solid #6E9A8B", fontSize: 11.5, padding: "6px 8px", color: "#2D3B36", overflow: "hidden" }}>Consult · Lane</div>
                    <div style={{ height: 34, borderRadius: 7, background: "rgba(20,24,26,.05)" }} />
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: "#586060", marginBottom: 8, textAlign: "center" }}>Rm 3</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ height: 34, borderRadius: 7, background: "rgba(20,24,26,.05)" }} />
                    <div style={{ height: 34, borderRadius: 7, background: "#DDEAE4", borderLeft: "3px solid #2F6B5F", fontSize: 11.5, padding: "6px 8px", color: "#22463D", overflow: "hidden" }}>Laser · Okafor</div>
                    <div style={{ height: 34, borderRadius: 7, background: "rgba(20,24,26,.05)" }} />
                    <div style={{ height: 34, borderRadius: 7, background: "#DDEAE4", borderLeft: "3px solid #2F6B5F", fontSize: 11.5, padding: "6px 8px", color: "#22463D", overflow: "hidden" }}>Laser · Okafor</div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 14, borderTop: "1px solid rgba(20,24,26,.08)", paddingTop: 12, display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#4E5654", flexWrap: "wrap", gap: 8 }}>
              <span>Utilization 78% · 2 gaps auto-offered to waitlist</span>
              <span style={{ color: "#2F6B5F" }}>1 conflict resolved</span>
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: "rgba(20,24,26,.12)" }} />

        <div style={{ display: "flex", flexWrap: "wrap-reverse", gap: 48, padding: "56px 0", alignItems: "center" }}>
          <div style={{ flex: "1.15 1 420px", minWidth: 0, border: "1px solid rgba(20,24,26,.12)", borderRadius: 16, background: "#FDFDFB", padding: 18, boxShadow: "0 30px 60px -50px rgba(20,24,26,.6)" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#DCE3DC", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, color: "#566661" }}>AC</div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 600 }}>Amara C.</div>
                <div style={{ fontSize: 12.5, color: "#586060" }}>Next: Apr 2, 10:30 · Laser series 2/4</div>
              </div>
              <span style={{ fontSize: 11.5, padding: "5px 10px", borderRadius: 999, background: "rgba(110,154,139,.16)", color: "#2E514A", whiteSpace: "nowrap" }}>Pre-care sent</span>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
              {[["Lifetime value", "$9,840"], ["Visits", "17"], ["Membership", "Gold"]].map(([k, v]) => (
                <div key={k} style={{ flex: "1 1 130px", border: "1px solid rgba(20,24,26,.1)", borderRadius: 10, padding: 11 }}>
                  <div style={{ fontSize: 11, color: "#5E6664" }}>{k}</div>
                  <div style={{ fontSize: 18, fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, borderTop: "1px solid rgba(20,24,26,.08)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["TODAY", "Confirmed appointment via text · replied “see you then”"],
                ["MAR 19", "Post-treatment check-in · reported no irritation"],
                ["MAR 18", "Treatment 1/4 · consent + photos on file"],
              ].map(([tag, text]) => (
                <div key={tag} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ ...mono, fontSize: 10.5, color: "#5E6664", width: 52, flex: "none", paddingTop: 2 }}>{tag}</span>
                  <div style={{ fontSize: 13.5, color: "#333A3B" }}>{text}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ flex: "1 1 330px", minWidth: 0 }}>
            <div style={{ ...mono, fontSize: 13, color: "#2F6B5F" }}>02</div>
            <h3 style={{ fontSize: "clamp(26px, 2.6vw, 36px)", lineHeight: 1.1, letterSpacing: "-.026em", fontWeight: 500, margin: "12px 0 0" }}>Patient Experience</h3>
            <p style={{ fontSize: 17, color: "#4E5654", lineHeight: 1.6, margin: "14px 0 0", maxWidth: "44ch" }}>Create a better experience from first interaction to follow-up. One patient record, one thread of communication, one memory of everything that happened.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20, ...mono, fontSize: 11.5, color: "#5F6866" }}>
              {["Intake & consent", "Unified messaging", "Treatment history"].map((c) => (
                <span key={c} style={{ border: "1px solid rgba(20,24,26,.16)", borderRadius: 999, padding: "5px 11px" }}>{c}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="platform" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ height: 1, background: "rgba(20,24,26,.12)" }} />

        <div style={{ display: "flex", flexWrap: "wrap", gap: 48, padding: "56px 0", alignItems: "center" }}>
          <div style={{ flex: "1 1 330px", minWidth: 0 }}>
            <div style={{ ...mono, fontSize: 13, color: "#2F6B5F" }}>03</div>
            <h3 style={{ fontSize: "clamp(26px, 2.6vw, 36px)", lineHeight: 1.1, letterSpacing: "-.026em", fontWeight: 500, margin: "12px 0 0" }}>Growth &amp; Engagement</h3>
            <p style={{ fontSize: 17, color: "#4E5654", lineHeight: 1.6, margin: "14px 0 0", maxWidth: "44ch" }}>Turn every patient interaction into an opportunity to grow. Memberships, recall, referrals, and campaigns driven by what the record already knows.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20, ...mono, fontSize: 11.5, color: "#5F6866" }}>
              {["Memberships", "Recall & rebook", "Referrals"].map((c) => (
                <span key={c} style={{ border: "1px solid rgba(20,24,26,.16)", borderRadius: 999, padding: "5px 11px" }}>{c}</span>
              ))}
            </div>
          </div>
          <div style={{ flex: "1.15 1 420px", minWidth: 0, border: "1px solid rgba(20,24,26,.12)", borderRadius: 16, background: "#FDFDFB", padding: 18, boxShadow: "0 30px 60px -50px rgba(20,24,26,.6)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Retention cohorts</span>
              <span style={{ ...mono, fontSize: 11, color: "#586060" }}>Last 6 months</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 120, marginTop: 18 }}>
              {[
                [34, 22], [41, 20], [47, 24], [58, 19], [66, 21], [74, 18],
              ].map(([a, b], idx) => (
                <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 3, height: "100%" }}>
                  <div style={{ height: `${a}%`, background: "#2F6B5F", borderRadius: "3px 3px 0 0" }} />
                  <div style={{ height: `${b}%`, background: "#D3DDD4" }} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 18, marginTop: 12, fontSize: 12, color: "#6E7674", flexWrap: "wrap" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 9, height: 9, background: "#2F6B5F", borderRadius: 2 }} />Members</span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 9, height: 9, background: "#D3DDD4", borderRadius: 2 }} />One-time patients</span>
            </div>
            <div style={{ marginTop: 16, borderTop: "1px solid rgba(20,24,26,.08)", paddingTop: 14, display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[["Rebook rate", "71%"], ["Membership growth", "+38%"], ["Referral share", "24%"]].map(([k, v]) => (
                <div key={k} style={{ flex: "1 1 140px" }}>
                  <div style={{ fontSize: 11, color: "#5E6664" }}>{k}</div>
                  <div style={{ fontSize: 20, fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: "rgba(20,24,26,.12)" }} />

        <div style={{ display: "flex", flexWrap: "wrap-reverse", gap: 48, padding: "56px 0", alignItems: "center" }}>
          <div style={{ flex: "1.15 1 420px", minWidth: 0, border: "1px solid rgba(20,24,26,.12)", borderRadius: 16, background: "#14181A", color: "#EDF0EC", padding: 18, boxShadow: "0 30px 60px -50px rgba(20,24,26,.8)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Workflow · Post-treatment care</span>
              <span style={{ ...mono, fontSize: 11, color: "#86AFA0" }}>Running</span>
            </div>
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                { dot: "#2F6B5F", pulse: false, title: "Treatment marked complete", meta: "Trigger · EMR event", hasLine: true },
                { dot: "#2F6B5F", pulse: false, title: "Send aftercare instructions", meta: "SMS · +2 hours · delivered 128/128", hasLine: true },
                { dot: "#2F6B5F", pulse: true, title: "AI reads the reply, routes what matters", meta: "“Slight swelling day 3” → flagged to nurse, 9 min response", hasLine: true },
                { dot: "rgba(255,255,255,.3)", pulse: false, title: "Rebook prompt for series step 3", meta: "+14 days · skipped if already scheduled", hasLine: false },
              ].map((step2, idx) => (
                <div key={idx} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "none" }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: step2.dot, animation: step2.pulse ? "avPulse 2s ease-in-out infinite" : undefined }} />
                    {step2.hasLine && <span style={{ width: 1, flex: 1, minHeight: 34, background: "rgba(255,255,255,.16)" }} />}
                  </div>
                  <div style={{ paddingBottom: step2.hasLine ? 16 : 0 }}>
                    <div style={{ fontSize: 14 }}>{step2.title}</div>
                    <div style={{ fontSize: 12, color: "#98A19E" }}>{step2.meta}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, borderTop: "1px solid rgba(255,255,255,.12)", paddingTop: 12, fontSize: 12.5, color: "#B9C1BE" }}>Every automated message is reviewable, auditable, and owned by the practice.</div>
          </div>
          <div style={{ flex: "1 1 330px", minWidth: 0 }}>
            <div style={{ ...mono, fontSize: 13, color: "#2F6B5F" }}>04</div>
            <h3 style={{ fontSize: "clamp(26px, 2.6vw, 36px)", lineHeight: 1.1, letterSpacing: "-.026em", fontWeight: 500, margin: "12px 0 0" }}>Intelligence</h3>
            <p style={{ fontSize: 17, color: "#4E5654", lineHeight: 1.6, margin: "14px 0 0", maxWidth: "44ch" }}>Bring automation, insights, and AI into the workflows where they matter — triage, follow-up, forecasting — and nowhere they don&apos;t. Clinicians stay in the loop by design.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20, ...mono, fontSize: 11.5, color: "#5F6866" }}>
              {["Workflow automation", "Message triage", "Forecasting"].map((c) => (
                <span key={c} style={{ border: "1px solid rgba(20,24,26,.16)", borderRadius: 999, padding: "5px 11px" }}>{c}</span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: "rgba(20,24,26,.12)" }} />

        <div style={{ display: "flex", flexWrap: "wrap", gap: 48, padding: "56px 0 0", alignItems: "center" }}>
          <div style={{ flex: "1 1 330px", minWidth: 0 }}>
            <div style={{ ...mono, fontSize: 13, color: "#2F6B5F" }}>05</div>
            <h3 style={{ fontSize: "clamp(26px, 2.6vw, 36px)", lineHeight: 1.1, letterSpacing: "-.026em", fontWeight: 500, margin: "12px 0 0" }}>Technology Built Around You</h3>
            <p style={{ fontSize: 17, color: "#4E5654", lineHeight: 1.6, margin: "14px 0 0", maxWidth: "44ch" }}>Integrations, workflows, systems, and technology designed around the practice — not a template you&apos;re asked to conform to.</p>
          </div>
          <div style={{ flex: "1.15 1 420px", minWidth: 0, border: "1px solid rgba(20,24,26,.12)", borderRadius: 16, background: "#FDFDFB", padding: 18, boxShadow: "0 30px 60px -50px rgba(20,24,26,.6)" }}>
            <div style={{ ...mono, fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "#5E6664" }}>Connected systems · live</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 14 }}>
              {[
                ["EMR · charting & consent", "Synced 40s ago", false],
                ["Payments & membership billing", "Synced 2m ago", false],
                ["CRM & campaign tooling", "Synced 5m ago", false],
                ["Custom device & imaging integration", "In build", true],
              ].map(([label, status, dashed]) => (
                <div key={label as string} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: dashed ? "1px dashed rgba(20,24,26,.2)" : "1px solid rgba(20,24,26,.1)", borderRadius: 10, padding: "11px 13px", gap: 12 }}>
                  <span style={{ fontSize: 13.5, color: dashed ? "#6E7674" : undefined }}>{label}</span>
                  <span
                    style={{
                      fontSize: 11.5,
                      color: dashed ? "#2A6154" : "#2E514A",
                      background: dashed ? "rgba(47,107,95,.1)" : "rgba(110,154,139,.16)",
                      padding: "4px 9px",
                      borderRadius: 999,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="partner" style={{ maxWidth: 1240, margin: "0 auto", padding: "104px 32px 0" }}>
        <div style={{ borderRadius: 20, background: "#14181A", color: "#EDF0EC", padding: "clamp(32px,4.4vw,48px)" }}>
          <div style={{ ...mono, fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#98A19E" }}>02 — Partnership</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 48, alignItems: "flex-end", justifyContent: "space-between", marginTop: 18 }}>
            <h2 style={{ fontSize: "clamp(32px, 4.2vw, 58px)", lineHeight: 1.02, letterSpacing: "-.034em", fontWeight: 500, margin: 0, maxWidth: "16ch", color: "#EDF0EC" }}>More than software. Your technology partner.</h2>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: "#B2BAB7", maxWidth: "44ch", margin: 0 }}>We work alongside your team to design, integrate, improve, and evolve the technology behind the business — quarter after quarter, not once at launch.</p>
          </div>
        </div>

        <div style={{ marginTop: 56, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
          <div style={{ border: "1px solid rgba(20,24,26,.16)", borderRadius: 12, padding: "16px 28px", background: "#FDFDFB", textAlign: "center", minWidth: 240 }}>
            <div style={{ ...mono, fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "#5E6664" }}>Your practice</div>
            <div style={{ fontSize: 17, fontWeight: 500, marginTop: 4 }}>Providers, front desk, owners</div>
          </div>
          <div style={{ width: 1, height: 34, background: "rgba(20,24,26,.25)" }} />
          <div style={{ borderRadius: 12, padding: "22px 32px", background: "#14181A", color: "#EDF0EC", textAlign: "center", minWidth: 280 }}>
            <div style={{ ...mono, fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "#98A19E" }}>Avishkar</div>
            <div style={{ fontSize: 20, fontWeight: 500, marginTop: 4 }}>Strategy · Build · Integration · Evolution</div>
          </div>
          <div style={{ width: 1, height: 34, background: "rgba(20,24,26,.25)" }} />
          <div style={{ width: "100%", display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {["EMR / clinical systems", "CRM", "Scheduling", "Payments", "Communication", "Analytics", "AI", "Integrations"].map((s) => (
              <span key={s} style={{ fontSize: 13.5, padding: "11px 18px", border: "1px solid rgba(20,24,26,.14)", borderRadius: 999, background: "#F8F8F5" }}>{s}</span>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 1, marginTop: 64, background: "rgba(20,24,26,.12)", border: "1px solid rgba(20,24,26,.12)", borderRadius: 14, overflow: "hidden" }}>
          {[
            ["01", "Understand the practice", "We sit in your operation before we write anything — rooms, rhythms, the workarounds nobody documented."],
            ["02", "Connect what works", "Keep the systems your team trusts. We integrate around them instead of forcing a rip-and-replace."],
            ["03", "Build what's missing", "Custom surfaces, workflows, and automations built for your model of care and your economics."],
            ["04", "Evolve continuously", "A standing technical team on your side as you add locations, services, and providers."],
          ].map(([n, title, body]) => (
            <div key={n} style={{ flex: "1 1 240px", minWidth: 0, background: "#F1F1ED", padding: "26px 24px" }}>
              <div style={{ ...mono, fontSize: 12, color: "#2F6B5F" }}>{n}</div>
              <div style={{ fontSize: 18, fontWeight: 500, marginTop: 10 }}>{title}</div>
              <p style={{ fontSize: 14.5, color: "#4E5654", lineHeight: 1.55, margin: "8px 0 0" }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="proof" style={{ maxWidth: 1240, margin: "0 auto", padding: "110px 32px 0" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 48, alignItems: "center" }}>
          <div style={{ flex: "1 1 320px", minWidth: 0 }}>
            <div style={{ ...mono, fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#586060" }}>03 — Capabilities</div>
            <h2 style={{ fontSize: "clamp(30px, 3.8vw, 52px)", lineHeight: 1.04, letterSpacing: "-.032em", fontWeight: 500, margin: "18px 0 0", maxWidth: "18ch", textWrap: "balance" }}>Built to clinical and commercial standards.</h2>
            <p style={{ fontSize: 16.5, color: "#4E5654", lineHeight: 1.6, maxWidth: "44ch", margin: "18px 0 0", textWrap: "pretty" }}>The technical groundwork a practice shouldn&apos;t have to think about — handled the same way on every engagement.</p>
          </div>
          <div style={{ flex: "1 1 360px", minWidth: 0, border: "1px solid rgba(20,24,26,.12)", borderRadius: 14, background: "#14181A", color: "#EDF0EC", padding: 30 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 13, fontSize: 15 }}>
              {[
                "HIPAA-aligned architecture & audit trails",
                "Payments, memberships, packages",
                "Data migration & cutover planning",
                "Applied AI with human review",
                "Ongoing product & engineering support",
              ].map((t) => (
                <div key={t} style={{ display: "flex", gap: 10 }}><span style={{ color: "#2F6B5F" }}>—</span>{t}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="insights" style={{ maxWidth: 1240, margin: "0 auto", padding: "110px 32px 0" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 32, alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ ...mono, fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#586060" }}>04 — Insights</div>
            <h2 style={{ fontSize: "clamp(30px, 3.8vw, 52px)", lineHeight: 1.04, letterSpacing: "-.032em", fontWeight: 500, margin: "18px 0 0", maxWidth: "20ch" }}>What&apos;s happening in aesthetics.</h2>
          </div>
          <Link href="/insights" className="av-outline-btn" style={{ fontSize: 15, fontWeight: 500, padding: "12px 22px", borderRadius: 999, border: "1px solid rgba(20,24,26,.2)", whiteSpace: "nowrap" }}>View all insights →</Link>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginTop: 44 }}>
          {latestInsights.map((p) => (
            <Link href={`/insights/${p.slug}`} key={p.slug} style={{ flex: "1 1 300px", minWidth: 0, display: "block" }}>
              <div style={{ position: "relative", height: 168, borderRadius: 14, border: "1px solid rgba(20,24,26,.12)", overflow: "hidden", display: "flex", alignItems: "flex-end", padding: 14 }}>
                <Image src={p.img} alt="" fill sizes="(max-width: 768px) 100vw, 380px" style={{ objectFit: "cover" }} />
                <span style={{ position: "relative", ...mono, fontSize: 10.5, color: "#586060", background: "rgba(248,248,245,.85)", padding: "4px 9px", borderRadius: 999 }}>{p.art}</span>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 16, ...mono, fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "#2F6B5F" }}>{p.cat}<span style={{ color: "#5E6664" }}>· {p.read}</span></div>
              <div style={{ fontSize: 20, fontWeight: 500, lineHeight: 1.3, marginTop: 10, letterSpacing: "-.018em" }}>{p.title}</div>
              <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "#4E5654", margin: "8px 0 0" }}>{p.dek}</p>
              <div style={{ fontSize: 12.5, color: "#5E6664", marginTop: 12 }}>{p.date}</div>
            </Link>
          ))}
        </div>
      </section>

      <section id="contact" style={{ maxWidth: 1240, margin: "0 auto", padding: "120px 32px 0" }}>
        <div className="av-final-cta-band" style={{ borderRadius: 22, background: "#14181A", color: "#F1F1ED", padding: "clamp(40px, 6vw, 88px) clamp(28px, 5vw, 72px)" }}>
          <h2 style={{ fontSize: "clamp(34px, 5.2vw, 72px)", lineHeight: 1.02, letterSpacing: "-.036em", fontWeight: 500, margin: 0, maxWidth: "16ch", textWrap: "balance" }}>Let&apos;s build what&apos;s next for your practice.</h2>
          <p style={{ fontSize: "clamp(16px,1.4vw,19px)", lineHeight: 1.6, color: "#B2BAB7", maxWidth: "52ch", margin: "24px 0 0" }}>Whether you are modernizing an existing practice or building the technology foundation for what&apos;s next, Avishkar can help.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", marginTop: 36 }}>
            <Link href="/contact" className="av-contact-btn" style={{ fontSize: 15.5, fontWeight: 500, padding: "15px 30px", borderRadius: 999, background: "#F1F1ED", color: "#14181A" }}>Talk to Avishkar</Link>
            <span style={{ ...mono, fontSize: 12.5, color: "#868F8C" }}>Typical first conversation: 30 minutes, no deck.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
