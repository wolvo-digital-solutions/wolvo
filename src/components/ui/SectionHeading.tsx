import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  index,
  eyebrow,
  title,
  intro,
  id,
  className,
  align = "left",
}: {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  id?: string;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <header className={cn("max-w-4xl", align === "center" && "mx-auto text-center", className)}>
      <p className={cn("eyebrow flex items-center gap-3", align === "center" && "justify-center")} data-reveal>
        {index && <span className="text-muted">{index}</span>}
        <span aria-hidden className="h-px w-8 bg-sky/60" />
        {eyebrow}
      </p>
      <h2 id={id} className="mt-6 text-h2 uppercase" data-reveal>
        {title}
      </h2>
      {intro && (
        <p className={cn("mt-6 max-w-2xl text-lg text-muted", align === "center" && "mx-auto")} data-reveal>
          {intro}
        </p>
      )}
    </header>
  );
}
