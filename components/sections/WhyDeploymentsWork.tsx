"use client";

import { Workflow, Boxes, Activity, ShieldCheck } from "lucide-react";
import { GridBackground } from "@/components/ui/GridBackground";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const PILLARS = [
  {
    icon: Workflow,
    title: "Workflow mapping",
    detail: "We reconstruct how patients, staff, and systems actually interact.",
  },
  {
    icon: Boxes,
    title: "Environment-specific agents",
    detail: "Every deployment is tailored to your workflows and systems.",
  },
  {
    icon: Activity,
    title: "Continuous monitoring",
    detail: "We continuously identify new inefficiencies and opportunities.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise security",
    detail: "HIPAA alignment, audit trails, RBAC, and human oversight.",
  },
];

export function WhyDeploymentsWork() {
  return (
    <section id="deployments" className="relative py-24 sm:py-32">
      <GridBackground />

      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Why our deployments work"
          title={
            <>
              Built for your environment.{" "}
              <span className="text-gradient-cyan">Measured continuously.</span>
            </>
          }
          description="We don't drop in generic automation. Every agent is grounded in your real workflows, watched in production, and held to enterprise-grade security."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <div className="surface h-full rounded-2xl p-6">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-200 bg-cyan-50">
                  <p.icon className="h-4.5 w-4.5 text-cyan-700" />
                </span>
                <div className="mt-4 text-[15px] font-medium text-slate-900">{p.title}</div>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate-500">{p.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
