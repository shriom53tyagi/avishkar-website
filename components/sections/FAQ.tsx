"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { GridBackground } from "@/components/ui/GridBackground";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { FAQS, CONTACT_EMAIL } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * FAQ — accordion of common questions. One item open at a time. The chevron/plus
 * rotates and the answer expands; honors prefers-reduced-motion via Framer's
 * global reduced-motion handling already wired in globals.css.
 */
export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <GridBackground variant="dots" />

      <div className="mx-auto max-w-3xl px-6">
        <SectionHeading
          eyebrow="FAQ"
          title={
            <>
              Questions, <span className="text-gradient-cyan">answered.</span>
            </>
          }
          description="The things healthcare leaders ask us most. Still curious? The assistant in the corner can help, or reach us directly."
        />

        <div className="mt-12 space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 0.04}>
                <div
                  className={cn(
                    "overflow-hidden rounded-2xl border transition-colors",
                    isOpen
                      ? "border-cyan-400/20 bg-white/[0.03]"
                      : "border-white/[0.06] bg-white/[0.015] hover:border-white/15"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-[15px] font-medium text-white">{item.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className={cn(
                        "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border",
                        isOpen
                          ? "border-cyan-400/30 text-cyan-300"
                          : "border-white/10 text-white/50"
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
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p className="px-5 pb-5 text-[14px] leading-relaxed text-white/60">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Still have questions */}
        <Reveal delay={0.1}>
          <div className="surface mt-8 flex flex-col items-center gap-4 rounded-2xl p-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <div className="text-[15px] font-medium text-white">Still have questions?</div>
              <p className="mt-1 text-[13.5px] text-white/55">
                Talk to the team or email{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-cyan-300 underline-offset-2 hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </div>
            <Button href="/contact" variant="primary" showArrow>
              Book an Operational Audit
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
