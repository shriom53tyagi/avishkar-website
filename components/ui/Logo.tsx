import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The Avishkar mark. The link carries the accessible name; the image is
 * decorative inside it so the word isn't read twice.
 */
export function Logo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center", className)}
      aria-label="Avishkar — home"
    >
      <Image
        src="/logo.webp"
        alt=""
        width={96}
        height={52}
        priority={priority}
        className="h-9 w-auto"
      />
    </Link>
  );
}
