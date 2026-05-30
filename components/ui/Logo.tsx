import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label="Avishkar home"
    >
      <span className="relative inline-flex h-7 w-7 items-center justify-center">
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <defs>
            <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22D3EE" />
              <stop offset="60%" stopColor="#A78BFA" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
          </defs>
          <path
            d="M16 3 L28 27 L22.5 27 L20.6 22 L11.4 22 L9.5 27 L4 27 Z M13 17 L19 17 L16 9 Z"
            fill="url(#lg)"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="0.6"
          />
        </svg>
        <span className="absolute inset-0 -z-10 rounded-full bg-cyan-400/30 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
      </span>
      <span className="text-[15px] font-medium tracking-tight text-white">
        Avishkar
        <span className="ml-1.5 align-middle text-[10px] font-mono uppercase tracking-[0.18em] text-white/40">
          /AI
        </span>
      </span>
    </Link>
  );
}
