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
          <div className="absolute -top-40 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-cyan-400/[0.10] blur-[120px]" />
          <div className="absolute -bottom-40 right-0 h-[420px] w-[620px] rounded-full bg-violet-500/[0.08] blur-[120px]" />
        </>
      )}
    </div>
  );
}
