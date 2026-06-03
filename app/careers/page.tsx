import type { Metadata } from "next";
import { Mail, MapPin, ArrowUpRight, Microscope, LineChart, HeartPulse } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { CONTACT_EMAIL, OPEN_ROLES } from "@/lib/data";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join Avishkar AI — we're building the operational intelligence layer for healthcare. Engineers and healthcare operators recovering hidden revenue for hospitals and clinics.",
  openGraph: {
    title: "Careers at Avishkar AI",
    description:
      "Work on hard problems at the intersection of AI and healthcare operations. We audit, quantify, and deploy — in that order.",
    url: "https://avishkar.app/careers",
  },
};

const VALUES = [
  {
    icon: Microscope,
    title: "Diagnosis before deployment",
    note: "We earn the right to automate by understanding the problem first — in dollars, not adjectives.",
  },
  {
    icon: LineChart,
    title: "Measurable or it didn't happen",
    note: "Every engagement is tied to financial impact. We ship outcomes, not demos.",
  },
  {
    icon: HeartPulse,
    title: "Healthcare-grade rigor",
    note: "Patient data is sacred. Security, compliance, and human-in-the-loop are non-negotiable.",
  },
];

/**
 * Standalone Careers page (`/careers`). Lists open roles and provides a working
 * `mailto:` for resumes, per the brief.
 */
export default function CareersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title={
          <>
            Build the operating intelligence{" "}
            <span className="text-gradient-cyan">layer for healthcare.</span>
          </>
        }
        description="We're a small team of engineers and healthcare operators recovering hidden revenue for hospitals and clinics. If that sounds like your kind of problem, we want to hear from you."
      />

      <section className="relative pb-12 pt-8">
        <div className="mx-auto max-w-7xl px-6">
          {/* Values */}
          <div className="grid gap-4 sm:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.05}>
                <div className="surface h-full rounded-2xl p-6">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                    <v.icon className="h-4.5 w-4.5 text-cyan-300" />
                  </span>
                  <div className="mt-4 text-sm font-medium text-white">{v.title}</div>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/55">{v.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <h2 className="font-display text-2xl font-medium tracking-tight text-gradient sm:text-3xl">
              Open roles
            </h2>
          </Reveal>

          <div className="mt-8 grid gap-4">
            {OPEN_ROLES.map((role, i) => (
              <Reveal key={role.title} delay={i * 0.05}>
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                    `Avishkar AI — Application: ${role.title}`
                  )}`}
                  className="surface group flex flex-col gap-4 rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-0.5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-base font-medium text-white">{role.title}</span>
                      <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/55">
                        {role.team}
                      </span>
                    </div>
                    <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-white/55">
                      {role.blurb}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1.5 text-[12px] text-white/40">
                      <MapPin className="h-3.5 w-3.5" /> {role.location}
                    </div>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-[13px] font-medium text-white transition-colors group-hover:border-white/30">
                    Apply
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>

          {/* General application */}
          <Reveal delay={0.1}>
            <div className="surface mt-8 flex flex-col items-start gap-5 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <h3 className="font-display text-xl font-medium tracking-tight text-gradient">
                  Don&apos;t see your role?
                </h3>
                <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-white/55">
                  We&apos;re always glad to meet exceptional people. Send your resume and a note
                  about how you&apos;d move the needle.
                </p>
              </div>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Avishkar AI — Resume")}`}
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-ink-950 shadow-[0_0_0_1px_rgba(255,255,255,0.5),0_10px_40px_-10px_rgba(34,211,238,0.6)] transition-transform hover:-translate-y-px"
              >
                <Mail className="h-4 w-4" />
                Send your resume to {CONTACT_EMAIL}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
