"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { NeuralBackground } from "@/components/visuals/NeuralBackground";
import { TRUST_LOGOS } from "@/lib/data";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden pb-16 pt-28 sm:pt-36 md:pb-24"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <NeuralBackground className="absolute inset-0 h-full w-full opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_40%,transparent_0%,rgba(236,242,250,0.85)_75%,#ECF2FA_100%)]" />
        <div className="absolute inset-0 bg-grid opacity-[0.22] mix-blend-multiply" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        {/* 2-column: 60% text / 40% card */}
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_420px] lg:gap-16">
          {/* LEFT COLUMN */}
          <div className="flex flex-col items-start">
            {/* Eyebrow pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1">
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-emerald-500" />
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/60" />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-blue-700">
                Operational Intelligence for Healthcare
              </span>
            </div>

            {/* H1 — no gradient, full opacity for LCP */}
            <h1 className="mt-7 max-w-xl text-[42px] font-semibold leading-[1.08] tracking-[-1.5px] text-slate-900 sm:text-5xl lg:text-[52px]">
              We diagnose before we automate. That&apos;s why the revenue actually comes back.
            </h1>

            {/* Tagline */}
            <p className="mt-4 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-blue-700">
              Find the Leak&nbsp;&nbsp;·&nbsp;&nbsp;Quantify the Impact&nbsp;&nbsp;·&nbsp;&nbsp;Deploy the Fix
            </p>

            {/* Subheadline */}
            <p className="mt-5 max-w-[520px] text-[17px] leading-[1.65] text-slate-500">
              Avishkar connects read-only to your EMR, billing, scheduling, and telephony systems
              — maps how revenue actually flows through your organization — and deploys AI agents
              only where the audit proves ROI.{" "}
              <span className="font-medium text-slate-900">
                Diagnosis before automation. Always.
              </span>
            </p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link href="/contact">
                <span className="group inline-flex items-center gap-2 rounded-[10px] bg-blue-600 px-6 py-3.5 text-[15px] font-medium text-white shadow-[0_1px_3px_rgba(20,64,200,0.3),0_8px_24px_-8px_rgba(20,64,200,0.45)] transition-all hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-[0_2px_4px_rgba(20,64,200,0.35),0_16px_32px_-8px_rgba(20,64,200,0.55)]">
                  Book an Operational Audit
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
              <Link href="/contact">
                <span className="inline-flex items-center gap-2 rounded-[10px] border border-slate-200 bg-transparent px-6 py-3.5 text-[15px] font-medium text-slate-600 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900">
                  See a Sample Leakage Report
                </span>
              </Link>
            </motion.div>

            {/* Trust logos */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-10"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">
                Trusted by leading health systems
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
                {TRUST_LOGOS.map((b) => (
                  <span
                    key={b}
                    className="text-[13px] font-medium tracking-tight text-slate-400 transition-colors hover:text-slate-600"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN — Live Audit Preview */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-3 lg:-mt-4"
          >
            <AuditPreviewCard />
            <SmallStatCard label="Time to first impact" value="12 wks" />
            <SmallStatCard label="Avg leakage identified" value="8–14%" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function AuditPreviewCard() {
  const leaks = [
    { name: "No-shows", value: "$1.84M", color: "text-rose-600" },
    { name: "Denials", value: "$612K", color: "text-amber-600" },
    { name: "Call drop-off", value: "$388K", color: "text-amber-600" },
  ];

  return (
    <div className="surface overflow-hidden rounded-2xl border-t-2 border-t-blue-600">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-slate-900/[0.06] px-5 py-3">
        <span className="relative inline-flex h-2 w-2">
          <span className="absolute inset-0 rounded-full bg-emerald-500" />
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/70" />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">
          Live Audit · Mid-Size Clinic
        </span>
      </div>

      {/* Total leakage */}
      <div className="px-5 pt-5">
        <div className="text-[32px] font-semibold leading-none tracking-tight text-rose-600">
          $2.84M
        </div>
        <div className="mt-1 text-[12px] text-slate-500">Annual leakage identified</div>

        {/* Breakdown rows */}
        <div className="mt-4 divide-y divide-slate-900/[0.06] rounded-xl border border-slate-900/[0.08] bg-slate-50/60">
          {leaks.map((l) => (
            <div key={l.name} className="flex items-center justify-between px-4 py-2.5">
              <span className="text-[13px] text-slate-600">{l.name}</span>
              <span className={`font-mono text-[13px] font-medium ${l.color}`}>{l.value}</span>
            </div>
          ))}
        </div>

        {/* Recovery pill */}
        <div className="mt-4 pb-5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[12px] font-medium text-emerald-700 ring-1 ring-emerald-200">
            <span className="text-[10px]">↑</span>
            $2.1M recoverable
          </span>
        </div>
      </div>
    </div>
  );
}

function SmallStatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface flex items-center justify-between rounded-xl px-5 py-3.5">
      <span className="text-[13px] text-slate-500">{label}</span>
      <span className="font-mono text-[14px] font-medium text-slate-900">{value}</span>
    </div>
  );
}
