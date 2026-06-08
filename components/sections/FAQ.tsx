"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { GridBackground } from "@/components/ui/GridBackground";
import { Reveal } from "@/components/ui/Reveal";
import { FAQS, CONTACT_EMAIL } from "@/lib/data";
import { cn } from "@/lib/utils";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <GridBackground variant="dots" />

      <div className="mx-auto max-w-3xl px-6">
        {/* Header */}
        <Reveal>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-blue-700">
            Common Questions
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-3 text-[32px] font-semibold leading-[1.15] tracking-[-0.5px] text-gradient sm:text-4xl">
            Everything you need to know before booking.
          </h2>
        </Reveal>

        {/* Accordion */}
        <div className="mt-10 space-y-2">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 0.03}>
                <div
                  className={cn(
                    "overflow-hidden rounded-2xl border transition-colors",
                    isOpen
                      ? "border-blue-200 bg-blue-50/30"
                      : "border-slate-900/[0.08] bg-slate-50/50 hover:border-slate-900/15"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-[16px] font-medium text-slate-900">{item.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      className={cn(
                        "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border",
                        isOpen
                          ? "border-blue-200 text-blue-700"
                          : "border-slate-900/10 text-slate-500"
                      )}
                    >
                      <Plus className="h-4 w-4" />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="space-y-3 px-5 pb-5">
                          {item.a.split("\n\n").map((para, j) => (
                            <p key={j} className="text-[14px] leading-[1.65] text-slate-500">
                              {para}
                            </p>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Chatbot handoff */}
        <Reveal delay={0.1}>
          <p className="mt-8 text-center text-[13px] text-slate-400">
            More questions? The assistant in the corner knows everything.{" "}
            <button
              className="cursor-pointer text-blue-600 hover:underline"
              onClick={() => {
                const el = document.querySelector<HTMLElement>("[data-chat-trigger]");
                el?.click();
              }}
            >
              Ask now →
            </button>
          </p>
        </Reveal>

        {/* Still have questions */}
        <Reveal delay={0.12}>
          <div className="surface mt-6 flex flex-col items-center gap-4 rounded-2xl p-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <div className="text-[15px] font-medium text-slate-900">Still have questions?</div>
              <p className="mt-1 text-[13px] text-slate-500">
                Email{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-blue-600 underline-offset-2 hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>{" "}
                or book a call.
              </p>
            </div>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 rounded-[10px] bg-blue-600 px-5 py-2.5 text-[14px] font-medium text-white hover:bg-blue-500"
            >
              Book an Operational Audit
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
