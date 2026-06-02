"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Mic,
  ArrowLeft,
  Calculator,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VoiceNote } from "@/components/ui/VoiceNote";

/**
 * Floating Avishkar AI widget (bottom-right) with three modes:
 *
 *   menu  -> pick a mode
 *   query -> domain-locked assistant (POST /api/chat)
 *   roi   -> conversational revenue-leak calculator (client-side estimate)
 *   talk  -> Apple-style voice note recorder (reuses VoiceNote -> /api/voice-note)
 *
 * This file is fully self-contained. It does NOT change the home page or any
 * other component — it only manages the widget's own UI state.
 */

type Msg = { role: "user" | "assistant"; content: string };
type Mode = "menu" | "query" | "roi" | "talk";

const CONTACT_EMAIL = "info@avishakar.com";

const GREETING: Msg = {
  role: "assistant",
  content:
    "Hi — I'm the Avishkar AI assistant. Ask me about the operational audit, our AI agents, security & compliance, pricing, or how to get in touch.",
};

const QUERY_SUGGESTIONS = [
  "What is the operational audit?",
  "How is Avishkar different?",
  "Is it HIPAA-compliant?",
];

type RoiStep = { key: string; question: string; replies?: string[]; freeText?: boolean };

const ROI_FLOW: RoiStep[] = [
  {
    key: "type",
    question: "What type of healthcare organisation are you?",
    replies: [
      "Hospital / Health system",
      "Multi-site clinic group",
      "Specialty practice",
      "Primary care / FQHCs",
    ],
  },
  {
    key: "volume",
    question: "How many appointments do you see each month?",
    replies: ["Under 500", "500 to 2,000", "2,000 to 5,000", "Over 5,000"],
  },
  {
    key: "pain",
    question: "What's your biggest operational pain right now?",
    replies: [
      "No-shows & scheduling",
      "Claim denials & billing",
      "Documentation burden",
      "Staffing & workflows",
    ],
  },
  {
    key: "emr",
    question: "Which EMR or billing system are you on?",
    replies: ["Epic", "Cerner", "Athena / eCW", "Other / Not sure"],
  },
  {
    key: "contact",
    question:
      "Last one — what's your name and work email so I can send you the full report?",
    freeText: true,
  },
];

const ROI_GREETING: Msg = {
  role: "assistant",
  content:
    "I can estimate your organisation's likely annual revenue leakage in about 60 seconds. First — what type of healthcare organisation are you?",
};

type Estimate = { total: number; noshow: number; denial: number; other: number };

function estimateLeakage(answers: Record<string, string>): Estimate {
  const v = answers.volume || "500 to 2,000";
  const mid = v.includes("5,000")
    ? 7500
    : v.includes("2,000")
    ? 3500
    : v.includes("500")
    ? 1200
    : 280;
  const noshow = Math.round(mid * 0.18 * 220 * 12);
  const denial = Math.round(mid * 0.4 * 0.12 * 175 * 12);
  const other = Math.round(mid * 0.06 * 130 * 12);
  return { total: noshow + denial + other, noshow, denial, other };
}

const money = (n: number) => "$" + n.toLocaleString();

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("menu");

  // query state
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // roi state
  const [roiMsgs, setRoiMsgs] = useState<Msg[]>([ROI_GREETING]);
  const [roiStep, setRoiStep] = useState(0);
  const [roiDone, setRoiDone] = useState(false);
  const [roiAnswers, setRoiAnswers] = useState<Record<string, string>>({});
  const [roiInput, setRoiInput] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const roiScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const roiInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    roiScrollRef.current?.scrollTo({ top: roiScrollRef.current.scrollHeight, behavior: "smooth" });
  }, [roiMsgs]);

  useEffect(() => {
    if (open && mode === "query") setTimeout(() => inputRef.current?.focus(), 150);
    if (open && mode === "roi" && roiDone) setTimeout(() => roiInputRef.current?.focus(), 150);
  }, [open, mode, roiDone]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function sendQuery(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next.filter((m) => m !== GREETING) }),
      });
      const data = (await res.json()) as { reply?: string };
      setMessages((p) => [
        ...p,
        {
          role: "assistant",
          content: data.reply?.trim() || `Sorry, I couldn't get an answer. Email ${CONTACT_EMAIL}.`,
        },
      ]);
    } catch {
      setMessages((p) => [
        ...p,
        { role: "assistant", content: `Connection issue. Try again or email ${CONTACT_EMAIL}.` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function roiAnswer(val: string) {
    const step = ROI_FLOW[roiStep];
    if (!step) return;
    const updated = { ...roiAnswers, [step.key]: val };
    setRoiAnswers(updated);
    setRoiMsgs((p) => [...p, { role: "user", content: val }]);
    setRoiInput("");

    const nextIdx = roiStep + 1;

    if (nextIdx < ROI_FLOW.length) {
      setTimeout(() => {
        setRoiMsgs((p) => [...p, { role: "assistant", content: "__typing__" }]);
        setTimeout(() => {
          setRoiMsgs((p) =>
            p
              .filter((m) => m.content !== "__typing__")
              .concat({ role: "assistant", content: ROI_FLOW[nextIdx].question })
          );
          setRoiStep(nextIdx);
        }, 850);
      }, 180);
    } else {
      const est = estimateLeakage(updated);
      setTimeout(() => {
        setRoiMsgs((p) => [...p, { role: "assistant", content: "__typing__" }]);
        setTimeout(() => {
          setRoiMsgs((p) =>
            p
              .filter((m) => m.content !== "__typing__")
              .concat({ role: "assistant", content: "__result__" + JSON.stringify(est) })
          );
          setRoiDone(true);
        }, 1100);
      }, 180);
    }
  }

  function enterMode(m: Mode) {
    setMode(m);
    if (m === "query") {
      setMessages([GREETING]);
      setInput("");
    }
    if (m === "roi") {
      setRoiMsgs([ROI_GREETING]);
      setRoiStep(0);
      setRoiDone(false);
      setRoiAnswers({});
      setRoiInput("");
    }
  }

  const roiReplies =
    !roiDone && roiStep < ROI_FLOW.length && ROI_FLOW[roiStep].replies
      ? ROI_FLOW[roiStep].replies!
      : [];
  const roiFreeText = !roiDone && roiStep < ROI_FLOW.length && !!ROI_FLOW[roiStep].freeText;

  const headerTitle =
    mode === "query"
      ? "Ask the assistant"
      : mode === "roi"
      ? "Revenue leak calculator"
      : mode === "talk"
      ? "Leave a voice note"
      : "Avishkar AI";

  const headerStatus =
    mode === "query"
      ? "domain-locked"
      : mode === "roi"
      ? "takes ~60 seconds"
      : mode === "talk"
      ? "voice note"
      : "online";

  return (
    <>
      {/* Launcher */}
      <motion.button
        type="button"
        aria-label={open ? "Close assistant" : "Open Avishkar AI assistant"}
        onClick={() => setOpen((v) => !v)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed bottom-5 right-5 z-[70] inline-flex h-14 w-14 items-center justify-center rounded-full",
          "bg-white text-ink-950",
          "shadow-[0_0_0_1px_rgba(255,255,255,0.5),0_10px_40px_-10px_rgba(34,211,238,0.6)]",
          "transition-transform duration-300 hover:scale-105"
        )}
      >
        <span className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[conic-gradient(from_0deg,rgba(34,211,238,0)_0deg,rgba(34,211,238,0.7)_60deg,rgba(167,139,250,0.7)_180deg,rgba(34,211,238,0)_300deg)] opacity-60 blur-md" />
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <X className="h-5 w-5" />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <MessageSquare className="h-5 w-5" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Avishkar AI assistant"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "fixed bottom-24 right-5 z-[70] flex w-[calc(100vw-2.5rem)] max-w-[380px] flex-col overflow-hidden rounded-2xl",
              "surface backdrop-blur-xl",
              "h-[min(600px,calc(100vh-8rem))]"
            )}
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
              {mode === "menu" ? (
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.04]">
                  <Sparkles className="h-4 w-4 text-cyan-300" />
                </span>
              ) : (
                <button
                  type="button"
                  aria-label="Back to menu"
                  onClick={() => setMode("menu")}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.04] text-white/70 transition-colors hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              )}
              <div className="min-w-0">
                <div className="text-sm font-medium text-white">{headerTitle}</div>
                <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
                  <span className="relative inline-flex h-1.5 w-1.5">
                    <span className="absolute inset-0 rounded-full bg-emerald-400" />
                    <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/60" />
                  </span>
                  {headerStatus}
                </div>
              </div>
            </div>

            {/* MENU */}
            {mode === "menu" && (
              <div className="flex flex-1 flex-col justify-center gap-3 px-5 py-6">
                <p className="mb-1 px-1 text-[13px] text-white/55">How can I help you today?</p>
                <ModeCard
                  icon={<MessageSquare className="h-4 w-4" />}
                  iconClass="border-cyan-400/20 bg-cyan-400/[0.06] text-cyan-300"
                  hoverClass="hover:border-cyan-400/25"
                  title="Ask the assistant"
                  sub="Instant answers about Avishkar AI"
                  onClick={() => enterMode("query")}
                />
                <ModeCard
                  icon={<Calculator className="h-4 w-4" />}
                  iconClass="border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-300"
                  hoverClass="hover:border-emerald-400/25"
                  title="Calculate my revenue leakage"
                  sub="5 questions. Estimate in 60 seconds."
                  onClick={() => enterMode("roi")}
                />
                <ModeCard
                  icon={<Mic className="h-4 w-4" />}
                  iconClass="border-violet-400/20 bg-violet-400/[0.06] text-violet-300"
                  hoverClass="hover:border-violet-400/25"
                  title="Leave a voice note"
                  sub="Record a message for the team"
                  onClick={() => enterMode("talk")}
                />
                <p className="mt-2 px-1 text-center font-mono text-[9px] uppercase tracking-[0.14em] text-white/25">
                  Avishkar AI · healthcare operations
                </p>
              </div>
            )}

            {/* QUERY */}
            {mode === "query" && (
              <>
                <div ref={scrollRef} className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-4 py-4">
                  {messages.map((m, i) => (
                    <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                      <div
                        className={cn(
                          "max-w-[85%] text-pretty rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed",
                          m.role === "user"
                            ? "bg-white text-ink-950"
                            : "border border-white/[0.06] bg-white/[0.03] text-white/85"
                        )}
                      >
                        {m.content}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="inline-flex items-center gap-1 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-3">
                        <Dot delay="0ms" />
                        <Dot delay="150ms" />
                        <Dot delay="300ms" />
                      </div>
                    </div>
                  )}
                  {messages.length === 1 && !loading && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {QUERY_SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => sendQuery(s)}
                          className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] text-white/70 transition-colors hover:border-white/20 hover:text-white"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="border-t border-white/[0.06] p-3">
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] py-1 pl-4 pr-1.5 focus-within:border-white/25">
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendQuery(input);
                        }
                      }}
                      placeholder="Ask about Avishkar AI..."
                      className="min-w-0 flex-1 bg-transparent text-[13.5px] text-white placeholder:text-white/35 focus:outline-none"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      aria-label="Send"
                      onClick={() => sendQuery(input)}
                      disabled={loading || !input.trim()}
                      className={cn(
                        "inline-flex h-8 w-8 items-center justify-center rounded-full transition-all",
                        input.trim() && !loading ? "bg-white text-ink-950 hover:scale-105" : "bg-white/10 text-white/40"
                      )}
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="mt-2 px-1 text-center font-mono text-[9px] uppercase tracking-[0.14em] text-white/25">
                    Avishkar AI only
                  </p>
                </div>
              </>
            )}

            {/* ROI */}
            {mode === "roi" && (
              <>
                <div ref={roiScrollRef} className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-4 py-4">
                  {roiMsgs.map((m, i) => {
                    if (m.content === "__typing__") {
                      return (
                        <div key={i} className="flex justify-start">
                          <div className="inline-flex items-center gap-1 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-3">
                            <Dot delay="0ms" />
                            <Dot delay="150ms" />
                            <Dot delay="300ms" />
                          </div>
                        </div>
                      );
                    }
                    if (m.content.startsWith("__result__")) {
                      const est = JSON.parse(m.content.replace("__result__", "")) as Estimate;
                      return (
                        <div key={i} className="flex justify-start">
                          <div className="w-full max-w-[92%] rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-4">
                            <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.14em] text-emerald-300/70">
                              Estimated annual leakage
                            </p>
                            <p className="font-display text-3xl font-medium tracking-tight text-emerald-300">
                              {money(est.total)}
                            </p>
                            <div className="mt-3 grid grid-cols-3 gap-2">
                              {[
                                { label: "No-shows", val: est.noshow },
                                { label: "Denials", val: est.denial },
                                { label: "Other", val: est.other },
                              ].map((r) => (
                                <div
                                  key={r.label}
                                  className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-2 text-center"
                                >
                                  <div className="text-[13px] font-medium text-white/85">{money(r.val)}</div>
                                  <div className="text-[10px] text-white/45">{r.label}</div>
                                </div>
                              ))}
                            </div>
                            <p className="mt-3 text-[11px] leading-relaxed text-white/50">
                              Based on 2025 audit cohort benchmarks. A real audit gives you the exact
                              number — to the workflow level.
                            </p>
                            <a
                              href="/contact"
                              className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-white py-2 text-[13px] font-medium text-ink-950 transition-transform hover:-translate-y-px"
                            >
                              Book a free audit to verify this
                              <ChevronRight className="h-4 w-4" />
                            </a>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                        <div
                          className={cn(
                            "max-w-[85%] text-pretty rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed",
                            m.role === "user"
                              ? "bg-white text-ink-950"
                              : "border border-white/[0.06] bg-white/[0.03] text-white/85"
                          )}
                        >
                          {m.content}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {roiReplies.length > 0 && (
                  <div className="flex flex-wrap gap-2 border-t border-white/[0.06] px-4 py-3">
                    {roiReplies.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => roiAnswer(r)}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] text-white/70 transition-colors hover:border-emerald-400/30 hover:bg-emerald-400/[0.06] hover:text-emerald-200"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                )}

                {roiFreeText && (
                  <div className="border-t border-white/[0.06] p-3">
                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] py-1 pl-4 pr-1.5 focus-within:border-white/25">
                      <input
                        ref={roiInputRef}
                        value={roiInput}
                        onChange={(e) => setRoiInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            if (roiInput.trim()) roiAnswer(roiInput.trim());
                          }
                        }}
                        placeholder="Your name and work email..."
                        className="min-w-0 flex-1 bg-transparent text-[13.5px] text-white placeholder:text-white/35 focus:outline-none"
                      />
                      <button
                        type="button"
                        aria-label="Submit"
                        onClick={() => {
                          if (roiInput.trim()) roiAnswer(roiInput.trim());
                        }}
                        disabled={!roiInput.trim()}
                        className={cn(
                          "inline-flex h-8 w-8 items-center justify-center rounded-full transition-all",
                          roiInput.trim() ? "bg-white text-ink-950 hover:scale-105" : "bg-white/10 text-white/40"
                        )}
                      >
                        <Send className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="mt-2 px-1 text-center font-mono text-[9px] uppercase tracking-[0.14em] text-white/25">
                      Used only to send you the report
                    </p>
                  </div>
                )}

                {!roiDone && (
                  <div className="flex items-center justify-center gap-1.5 py-2">
                    {ROI_FLOW.map((_, i) => (
                      <span
                        key={i}
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-300",
                          i < roiStep ? "w-4 bg-emerald-400" : i === roiStep ? "w-4 bg-white/60" : "w-1.5 bg-white/20"
                        )}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* TALK */}
            {mode === "talk" && (
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <p className="mb-4 text-[13px] leading-relaxed text-white/55">
                  Record a short voice note and the team will get back to you.
                </p>
                <VoiceNote />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ModeCard({
  icon,
  iconClass,
  hoverClass,
  title,
  sub,
  onClick,
}: {
  icon: ReactNode;
  iconClass: string;
  hoverClass: string;
  title: string;
  sub: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3.5 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-left transition-colors hover:bg-white/[0.04]",
        hoverClass
      )}
    >
      <span className={cn("inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border", iconClass)}>
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-medium text-white">{title}</span>
        <span className="block text-[12.5px] text-white/50">{sub}</span>
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-white/25 transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-white/50"
      style={{ animationDelay: delay, animationDuration: "1s" }}
    />
  );
}
