import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "quiet";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-accent text-white shadow-card hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-card-hover",
  secondary:
    "border border-line-strong bg-surface text-ink shadow-card hover:-translate-y-0.5 hover:border-ink-subtle hover:shadow-card-hover",
  quiet: "text-accent underline-offset-4 hover:underline",
};

const SIZES: Record<Variant, string> = {
  primary: "rounded px-5 py-3",
  secondary: "rounded px-5 py-3",
  quiet: "",
};

/**
 * The only button on the site. `quiet` is the inline text link used for
 * tertiary actions like "Explore all agents".
 */
export function Button({
  href,
  children,
  variant = "primary",
  className,
  external,
  arrow,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
  arrow?: boolean;
}) {
  const classes = cn(
    "inline-flex items-center gap-2 text-small font-medium transition-all duration-300",
    SIZES[variant],
    VARIANTS[variant],
    className,
  );

  const content = (
    <>
      {children}
      {arrow && (
        <span aria-hidden className="translate-y-[0.5px]">
          &rarr;
        </span>
      )}
    </>
  );

  if (external || href.startsWith("mailto:") || href.startsWith("http")) {
    return (
      <a
        href={href}
        className={classes}
        {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
