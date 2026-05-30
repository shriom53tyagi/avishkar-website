"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  showArrow?: boolean;
}

export function Button({
  href,
  onClick,
  variant = "primary",
  children,
  className,
  icon,
  showArrow,
}: ButtonProps) {
  const base =
    "group relative inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 will-change-transform select-none";

  const variants: Record<Variant, string> = {
    primary: cn(
      "text-ink-950 bg-white",
      "shadow-[0_0_0_1px_rgba(255,255,255,0.5),0_10px_40px_-10px_rgba(34,211,238,0.6)]",
      "hover:translate-y-[-1px] hover:shadow-[0_0_0_1px_rgba(34,211,238,0.7),0_18px_60px_-12px_rgba(34,211,238,0.8)]"
    ),
    secondary: cn(
      "text-white glass-strong hover:bg-white/[0.06]",
      "hover:translate-y-[-1px]"
    ),
    ghost: "text-white/70 hover:text-white hover:bg-white/5",
  };

  const inner = (
    <span className={cn(base, variants[variant], className)}>
      {variant === "primary" && (
        <span className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[conic-gradient(from_0deg,rgba(34,211,238,0.0)_0deg,rgba(34,211,238,0.7)_60deg,rgba(167,139,250,0.7)_180deg,rgba(34,211,238,0.0)_300deg)] opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-60" />
      )}
      {icon}
      <span className="relative">{children}</span>
      {showArrow && (
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {inner}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className="inline-flex">
      {inner}
    </button>
  );
}
