import { Check } from "lucide-react";

const PROOF_ITEMS = [
  "Diagnosis before automation — every engagement starts with the audit",
  "$4.2M+ avg recovery identified — 2025 audit cohort",
  "12 weeks to first measurable impact",
  "Read-only audit · HIPAA-aligned · BAA available",
  "Based on 6 clinic groups, 2,400+ monthly visits avg",
] as const;

export function ProofStrip() {
  return (
    <div className="border-y border-emerald-200 bg-emerald-50/70 py-4">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2.5">
          {PROOF_ITEMS.map((item) => (
            <div key={item} className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
              <span className="text-[13px] font-medium text-emerald-800">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
