import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The supplied WOLVO symbol (background removed, geometry untouched) plus the
 * company name set in the display face. Swap in the official vector lockup
 * once it is supplied: public/assets/branding/wolvo-logo.svg
 */
export function Logo({ className, showName = true, priority }: { className?: string; showName?: boolean; priority?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src="/assets/branding/wolvo-symbol-160.webp"
        alt={showName ? "" : "WOLVO"}
        width={160}
        height={118}
        priority={priority}
        className="h-7 w-auto"
      />
      {showName && <span className="font-display text-[1.05rem] font-semibold tracking-[0.2em]">WOLVO</span>}
    </span>
  );
}
