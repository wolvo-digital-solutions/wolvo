"use client";

import { useRef, type ComponentPropsWithoutRef, type PointerEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "group relative inline-flex min-h-12 whitespace-nowrap items-center justify-center gap-3 overflow-hidden rounded-[4px] px-6 font-display text-[0.8rem] font-medium uppercase tracking-[0.16em] transition-[color,background-color,border-color,box-shadow,transform] duration-300 ease-out-expo";

const variants: Record<Variant, string> = {
  primary:
    "bg-electric text-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.18)] hover:bg-sky hover:shadow-[0_10px_40px_-12px_rgb(13_121_253/0.8)]",
  secondary: "border border-line bg-navy-950/30 text-ink hover:border-sky/70 hover:bg-navy-800/60",
  ghost: "px-0 text-ink hover:text-cyan",
};

type Props = ComponentPropsWithoutRef<"a"> & { variant?: Variant; icon?: boolean; magnetic?: boolean };

/** Link-styled call to action. Magnetic hover is pointer-fine only and skips reduced motion. */
export function ButtonLink({ variant = "primary", icon = true, magnetic = false, className, children, ...rest }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (!magnetic || e.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 10;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 8;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <a ref={ref} className={cn(base, variants[variant], className)} onPointerMove={onMove} onPointerLeave={onLeave} {...rest}>
      <span className="relative">{children}</span>
      {icon && (
        <ArrowUpRight
          aria-hidden
          className="relative size-4 transition-transform duration-300 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      )}
    </a>
  );
}
