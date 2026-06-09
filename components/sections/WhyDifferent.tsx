"use client";

import { X, Check } from "lucide-react";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

const OTHERS  = ["Deploy first, ask questions later", "Generic agents, hard-to-attribute ROI", "Uncertain payback timelines"] as const;
const OURS    = ["Audit quantifies every leak first", "Agents only where ROI is proven", "First impact within 12 weeks"] as const;

export function WhyDifferent() {
  return (
    <section id="approach" className="bg-[#F0F9FF] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* LEFT — photo */}
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl">
              <Image
                src="https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=80"
                alt="Healthcare team reviewing operational data"
                width={900}
                height={600}
                className="h-[400px] w-full object-cover object-top lg:h-[480px]"
              />
              {/* Overlay badge */}
              <div className="absolute bottom-5 left-5 glass-card rounded-2xl px-4 py-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Methodology</p>
                <p className="mt-0.5 text-[15px] font-bold text-slate-900">Diagnose first. <span className="text-[#0891B2]">Always.</span></p>
              </div>
            </div>
          </Reveal>

          {/* RIGHT — comparison */}
          <Reveal delay={0.08}>
            <div>
              <span className="eyebrow">The Approach</span>
              <h2 className="mt-4 text-[34px] font-bold leading-[1.1] tracking-[-1px] text-gradient sm:text-4xl">
                Diagnose first.<br />
                <span className="text-gradient-cyan">Automate only where proven.</span>
              </h2>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {/* Others */}
                <div className="rounded-2xl border border-rose-200/70 bg-white p-5">
                  <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1">
                    <X className="h-3 w-3 text-rose-500" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-rose-600">Others</span>
                  </div>
                  <ul className="space-y-2.5">
                    {OTHERS.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-[13px] text-slate-500">
                        <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-400" />{p}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Avishkar */}
                <div className="rounded-2xl border border-[rgba(8,145,178,0.2)] bg-white p-5">
                  <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1">
                    <Check className="h-3 w-3 text-emerald-600" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-emerald-700">Avishkar</span>
                  </div>
                  <ul className="space-y-2.5">
                    {OURS.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-[13px] font-medium text-slate-800">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />{p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
