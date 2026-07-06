import { Check, Shield, Clock, TrendingUp, Users, Activity } from "lucide-react";
import { Marquee } from "@/components/ui/Marquee";

const ITEMS = [
  { icon: TrendingUp, text: "$4.2M+ avg recovery identified — 2025 cohort" },
  { icon: Shield,     text: "Read-only audit · HIPAA-aligned · BAA available" },
  { icon: Clock,      text: "12 weeks to first measurable impact" },
  { icon: Check,      text: "Diagnosis before automation — every engagement" },
  { icon: Users,      text: "6 clinic groups · 2,400+ monthly visits avg" },
  { icon: Activity,   text: "−61% denial rate · +38% appointment confirms" },
] as const;

export function ProofStrip() {
  return (
    <div className="relative border-y border-[rgba(8,145,178,0.12)] bg-canvas-alt py-4">
      <Marquee>
        {ITEMS.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2.5 whitespace-nowrap">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0891B2]/10">
              <Icon className="h-3.5 w-3.5 text-[#0891B2]" />
            </span>
            <span className="text-[14px] font-medium text-[#164E63]">{text}</span>
          </div>
        ))}
      </Marquee>
    </div>
  );
}
