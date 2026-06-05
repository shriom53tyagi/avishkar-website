import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "mx-auto max-w-3xl items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-slate-900/[0.03] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
          <span className="relative inline-flex h-1.5 w-1.5">
            <span className="absolute inset-0 rounded-full bg-cyan-400" />
            <span className="absolute inset-0 animate-ping rounded-full bg-cyan-400/60" />
          </span>
          {eyebrow}
        </span>
      )}
      <h2 className="text-balance font-display text-3xl font-medium leading-[1.05] tracking-tight text-gradient sm:text-4xl md:text-5xl lg:text-[56px]">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "text-pretty text-[15px] leading-relaxed text-slate-500 md:text-base",
            align === "center" ? "max-w-2xl" : "max-w-2xl"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
