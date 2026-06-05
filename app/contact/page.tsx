import type { Metadata } from "next";
import { Mail, Clock, ShieldCheck, FileText, CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { VoiceNote } from "@/components/ui/VoiceNote";
import { CalendarEmbed } from "@/components/ui/CalendarEmbed";
import { Reveal } from "@/components/ui/Reveal";
import { CONTACT_EMAIL } from "@/lib/data";

export const metadata: Metadata = {
  title: "Book an Operational Audit",
  description:
    "Book a free Operational Intelligence Audit for your hospital or clinic. Identify hidden revenue leakage, get a quantified recovery plan, and deploy AI agents only where ROI is proven.",
  openGraph: {
    title: "Book an Operational Audit — Avishkar AI",
    description:
      "A fixed-scope audit that quantifies hidden revenue loss across your EMR, billing, scheduling and call centers. HIPAA-aligned, read-only, BAA available.",
    url: "https://avishkar.app/contact",
  },
};
export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Get in touch"
        title={
          <>
            Find the leak.{" "}
            <span className="text-gradient-cyan">Let&apos;s quantify the impact.</span>
          </>
        }
        description="Pick a time that works for you, leave a voice note, or email us directly. We typically respond within one business day."
      />

      <section className="relative pb-24 pt-8 sm:pb-32">
        <div className="mx-auto max-w-7xl px-6 space-y-6">

          {/* Row 1: Calendar + Voice note */}
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">

            {/* Calendar booking */}
            <Reveal>
              <div className="surface h-full rounded-2xl p-6 sm:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cyan-200 bg-cyan-50">
                    <CalendarDays className="h-5 w-5 text-cyan-700" />
                  </span>
                  <div>
                    <h2 className="font-display text-2xl font-medium tracking-tight text-gradient">
                      Book a discovery call
                    </h2>
                    <p className="text-[13px] text-slate-400">
                      30 min · Operational audit scoping
                    </p>
                  </div>
                </div>
                <p className="mb-6 max-w-lg text-[15px] leading-relaxed text-slate-500">
                  Pick a time directly in the calendar below. We&apos;ll scope a
                  fixed, read-only audit, walk through a sample leakage report,
                  and show you the numbers before anything gets automated.
                </p>
                <CalendarEmbed />
              </div>
            </Reveal>

            {/* Right column: voice note + direct email */}
            <div className="flex flex-col gap-6">
              {/* Voice note */}
              <Reveal delay={0.08}>
                <div className="flex flex-col">
                  <div className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    <span className="relative inline-flex h-1.5 w-1.5">
                      <span className="absolute inset-0 rounded-full bg-cyan-400" />
                      <span className="absolute inset-0 animate-ping rounded-full bg-cyan-400/60" />
                    </span>
                    Leave a voice note
                  </div>
                  <VoiceNote />
                </div>
              </Reveal>

              {/* Direct email fallback */}
              <Reveal delay={0.14}>
                <div className="surface rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan-200 bg-cyan-50">
                      <Mail className="h-4 w-4 text-cyan-700" />
                    </span>
                    <div>
                      <div className="text-sm font-medium text-slate-900">Prefer email?</div>
                      <p className="mt-0.5 text-[13px] text-slate-500">
                        Reach us directly at{" "}
                        <a
                          href={`mailto:${CONTACT_EMAIL}?subject=Operational%20Audit%20Inquiry`}
                          className="text-cyan-700 underline-offset-4 hover:underline"
                        >
                          {CONTACT_EMAIL}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Row 2: What to expect strip */}
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Clock,
                title: "One business day",
                note: "Typical response time if you email or leave a voice note.",
              },
              {
                icon: ShieldCheck,
                title: "Read-only & HIPAA-aligned",
                note: "BAA available before any system access begins.",
              },
              {
                icon: FileText,
                title: "Fixed-scope audit",
                note: "A quantified leakage map in ~12 weeks.",
              },
            ].map((c, i) => (
              <Reveal key={c.title} delay={0.15 + i * 0.05}>
                <div className="surface h-full rounded-2xl p-5">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-cyan-200 bg-cyan-50">
                    <c.icon className="h-4 w-4 text-cyan-700" />
                  </span>
                  <div className="mt-4 text-sm font-medium text-slate-900">{c.title}</div>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">{c.note}</p>
                </div>
              </Reveal>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
