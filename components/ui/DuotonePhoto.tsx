import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * A small rounded photo used inline next to quotes/testimonials. No duotone
 * filter is applied yet — kept as a plain, cropped image so it renders
 * correctly today; revisit if the design calls for a true duotone effect.
 */
export function DuotonePhoto({
  src,
  alt,
  className,
  rounded = "rounded-xl",
  sizes = "64px",
}: {
  src: string;
  alt: string;
  className?: string;
  rounded?: string;
  sizes?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden", rounded, className)}>
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
    </div>
  );
}
