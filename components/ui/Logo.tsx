import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label="Avishkar home"
    >
      {/* Logo image from public/logo.png */}
      <span className="relative inline-flex h-7 w-7 items-center justify-center">
        <Image
          src="/logo.png"
          alt="Avishkar logo"
          width={28}
          height={28}
          priority
          className="h-7 w-7 object-contain"
        />
        <span className="absolute inset-0 -z-10 rounded-full bg-blue-500/20 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
      </span>
      <span className="text-[15px] font-medium tracking-tight text-slate-900">
        Avishkar
        <span className="ml-1.5 align-middle text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400">
          /AI
        </span>
      </span>
    </Link>
  );
}
