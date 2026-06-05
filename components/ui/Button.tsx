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
      "text-white bg-blue-600",
      "shadow-[0_1px_2px_rgba(23,70,219,0.25),0_4px_12px_rgba(23,70,219,0.30),0_12px_40px_-8px_rgba(23,70,219,0.40)]",
      "hover:translate-y-[-2px] hover:bg-blue-500 hover:shadow-[0_2px_4px_rgba(23,70,219,0.30),0_8px_24px_rgba(23,70,219,0.40),0_20px_56px_-8px_rgba(23,70,219,0.50)]",
      "active:translate-y-0"
    ),
    secondary: cn(
      "text-slate-700 glass-strong hover:text-slate-900",
      "hover:translate-y-[-1px]"
    ),
    ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-900/5",
  };

  const inner = (
    <span className={cn(base, variants[variant], className)}>
      {variant === "primary" && (
        <span className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[conic-gradient(from_0deg,rgba(23,70,219,0.0)_0deg,rgba(23,70,219,0.7)_60deg,rgba(109,40,217,0.7)_180deg,rgba(23,70,219,0.0)_300deg)] opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-60" />
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
