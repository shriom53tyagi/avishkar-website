import { cn } from "@/lib/utils";

interface Props {
  tone?: "live" | "warn" | "danger" | "muted";
  className?: string;
  label?: string;
}

const toneMap = {
  live: "text-emerald-400",
  warn: "text-amber-400",
  danger: "text-rose-400",
  muted: "text-white/40",
} as const;

export function StatusDot({ tone = "live", className, label }: Props) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className={cn("relative inline-flex h-1.5 w-1.5 dot-pulse", toneMap[tone])}>
        <span className="absolute inset-0 rounded-full bg-current" />
      </span>
      {label && (
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">
          {label}
        </span>
      )}
    </span>
  );
}
