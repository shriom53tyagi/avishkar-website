import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  /** Aspect/size via className on the frame (e.g. "h-[420px]"). */
  className?: string;
  priority?: boolean;
  sizes?: string;
  rounded?: string;
}

/**
 * next/image wrapped in a brand duotone frame (.photo-duotone) so all imagery
 * reads cohesively against the cyan/emerald palette. Fills its frame; control
 * dimensions via the `className` on the wrapper.
 */
export function DuotonePhoto({
  src,
  alt,
  className,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  rounded = "rounded-[22px]",
}: Props) {
  return (
    <div className={`photo-frame photo-duotone ${rounded} ${className ?? ""}`}>
      <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
    </div>
  );
}
