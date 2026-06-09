"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { FAQS, CONTACT_EMAIL } from "@/lib/data";
import { cn } from "@/lib/utils";

const SHOWN_FAQS = FAQS.slice(0, 4);

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-6">

        <Reveal>
          <div className="mb-10 text-center">
            <span className="eyebrow mx-auto">Common Questions</span>
            <h2 className="mt-4 text-[34px] font-bold leading-[1.1] tracking-[-1px] text-gradient sm:text-4xl">
              Before you book.
            </h2>
          </div>
        </Reveal>

        <div className="space-y-2">
          {SHOWN_FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 0.04}>
                <div className={cn(
                  "overflow-hidden rounded-2xl border transition-all duration-200",
                  isOpen
                    ? "border-[rgba(8,145,178,0.25)] bg-[#F0F9FF]"
                    : "border-[rgba(8,145,178,0.10)] bg-white hover:border-[rgba(8,145,178,0.2)]"
                )}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-[15px] font-semibold text-slate-900">{item.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className={cn(
                        "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors",
                        isOpen
                          ? "border-[rgba(8,145,178,0.3)] bg-[#0891B2] text-white"
                          : "border-slate-200 text-slate-400"
                      )}
                    >
                      <Plus className="h-3.5 w-3.5" />
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
                        <div className="space-y-2.5 px-5 pb-5">
                          {item.a.split("\n\n").map((para, j) => (
                            <p key={j} className="text-[14px] leading-[1.7] text-slate-600">{para}</p>
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

        <Reveal delay={0.14}>
          <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl border border-[rgba(8,145,178,0.15)] bg-[#F0F9FF] p-5 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="text-[15px] font-semibold text-slate-900">Still have questions?</p>
              <p className="mt-0.5 text-[13px] text-slate-500">
                Email{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-[#0891B2] underline-offset-2 hover:underline">
                  {CONTACT_EMAIL}
                </a>
              </p>
            </div>
            <a href="/contact" className="btn-primary shrink-0 cursor-pointer rounded-xl text-[14px]">
              Book an Audit
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
