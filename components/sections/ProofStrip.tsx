import { Check, Shield, Clock, TrendingUp, Users } from "lucide-react";

const ITEMS = [
  { icon: TrendingUp, text: "$4.2M+ avg recovery identified — 2025 cohort" },
  { icon: Shield,     text: "Read-only audit · HIPAA-aligned · BAA available" },
  { icon: Clock,      text: "12 weeks to first measurable impact" },
  { icon: Check,      text: "Diagnosis before automation — every engagement" },
  { icon: Users,      text: "6 clinic groups · 2,400+ monthly visits avg" },
] as const;

export function ProofStrip() {
  return (
    <div className="relative border-y border-[rgba(8,145,178,0.14)] bg-[#F0F9FF]">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
          {ITEMS.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0891B2]/10">
                <Icon className="h-3 w-3 text-[#0891B2]" />
              </span>
              <span className="text-[13px] font-medium text-[#164E63]">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
