import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  variant?: "default" | "fine" | "dots";
  fade?: "radial" | "bottom" | "top" | "none";
  glow?: boolean;
}

export function GridBackground({
  className,
  variant = "default",
  fade = "radial",
  glow = true,
}: Props) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
    >
      <div
        className={cn(
          "absolute inset-0",
          variant === "default" && "bg-grid",
          variant === "fine" && "bg-grid-fine",
          variant === "dots" && "bg-dots",
          fade === "radial" && "mask-radial",
          fade === "bottom" && "mask-fade-b",
          fade === "top" && "mask-fade-t"
        )}
      />
      {glow && (
        <>
          {/* Primary indigo top glow — more visible for premium feel */}
          <div className="absolute -top-48 left-1/2 h-[560px] w-[1000px] -translate-x-1/2 rounded-full bg-blue-500/[0.14] blur-[90px]" />
          {/* Secondary violet bottom glow */}
          <div className="absolute -bottom-48 right-0 h-[520px] w-[780px] rounded-full bg-violet-500/[0.10] blur-[90px]" />
        </>
      )}
    </div>
  );
}
