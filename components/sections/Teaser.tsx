"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const UPDATES = [
  {
    href: "/results",
    title: "$4.2M+ recovered on average",
    description:
      "The 2025 audit cohort found an average of $4.2M in annual recoverable revenue, with 12 weeks to first measurable impact.",
    date: "2026",
    category: "Results",
  },
  {
    href: "/what-we-do",
    title: "Revenue recovery agent, live",
    description:
      "Billing and insurance automation that cuts denial rates and captures revenue your team doesn't have time to chase.",
    date: "2026",
    category: "Agents",
  },
  {
    href: "/what-we-do",
    title: "Security & compliance, by default",
    description:
      "HIPAA-aligned, read-only by default, with a human in the loop at every step. Your data stays yours.",
    date: "2026",
    category: "Compliance",
  },
] as const;

const LINKS = [
  { href: "/what-we-do", label: "What we do", category: "Product" },
  { href: "/results", label: "Results", category: "Outcomes" },
  { href: "/what-we-do", label: "Security & compliance", category: "Trust" },
  { href: "/careers", label: "Careers", category: "Company" },
  { href: "/resources", label: "Resources", category: "Learn" },
] as const;

export function Teaser() {
  return (
    <section className="border-t border-slate-200/70 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        {/* Announcement-style card grid */}
        <div className="grid gap-5 sm:grid-cols-3">
          {UPDATES.map((u, i) => (
            <Reveal key={u.title} delay={i * 0.07}>
              <div className="flex h-full flex-col rounded-2xl bg-canvas-alt p-6">
                <h3 className="text-[19px] font-semibold leading-snug text-slate-900">
                  {u.title}
                </h3>
                <p className="mt-3 flex-1 text-[14px] leading-relaxed text-slate-500">
                  {u.description}
                </p>

                <div className="mt-6 border-t border-slate-900/10 pt-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-slate-400">DATE</span>
                    <span className="text-slate-600">{u.date}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t border-slate-900/10 pt-2 text-[11px]">
                    <span className="font-medium text-slate-400">CATEGORY</span>
                    <span className="text-slate-600">{u.category}</span>
                  </div>
                </div>

                <Link
                  href={u.href}
                  className="group mt-5 inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-[13px] font-medium text-white transition-colors duration-200 hover:bg-slate-800"
                >
                  Read more
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Manifesto + link list */}
        <div className="mt-20 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <p className="font-display text-[26px] font-medium leading-[1.25] text-slate-900 sm:text-[30px]">
              At Avishkar, we build the operational intelligence layer for healthcare.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div>
              {LINKS.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="group flex items-center justify-between border-b border-slate-200 py-4 text-[15px] font-medium text-slate-900 transition-colors hover:text-[#0E7490] first:pt-0"
                >
                  {l.label}
                  <span className="text-[13px] font-normal text-slate-400 transition-colors group-hover:text-[#0E7490]">
                    {l.category}
                  </span>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
