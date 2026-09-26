"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { technologies } from "@/data/technologies";
import type { Technology as Tech } from "@/types";
import { useExperience } from "@/components/motion/ExperienceProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const verified = technologies.filter((t) => t.verified);
const pending = verified.length === 0;
// Until WOLVO verifies its stack, the candidate list is shown — clearly labelled.
const shown: Tech[] = pending ? technologies : verified;

// Three orbits; technologies are distributed round-robin.
const orbits = [
  { rx: 0.22, ry: 0.09, speed: 0.05 },
  { rx: 0.34, ry: 0.15, speed: -0.035 },
  { rx: 0.46, ry: 0.21, speed: 0.025 },
];

const groups = Array.from(new Set(shown.map((t) => t.group)));

export function Technology() {
  const { ready, reducedMotion } = useExperience();
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = stage.current!;
      const chips = Array.from(el.querySelectorAll<HTMLElement>("[data-chip]"));
      const layout = (time: number) => {
        const { width: w, height: h } = el.getBoundingClientRect();
        chips.forEach((chip) => {
          const o = orbits[Number(chip.dataset.orbit)];
          const a = Number(chip.dataset.angle) + time * o.speed * Math.PI * 2;
          const depth = Math.sin(a); // -1 back … 1 front
          chip.style.transform = `translate(-50%, -50%) translate(${Math.cos(a) * o.rx * w}px, ${depth * o.ry * w}px) scale(${0.82 + (depth + 1) * 0.11})`;
          chip.style.opacity = String(0.45 + (depth + 1) * 0.275);
          chip.style.zIndex = String(Math.round((depth + 1) * 10));
        });
      };
      layout(0);
      if (!ready || reducedMotion) return;
      // Slow orbital drift, only while the section is on screen.
      let t = 0;
      const tick = (_: number, dt: number) => layout((t += dt / 1000));
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? gsap.ticker.add(tick) : gsap.ticker.remove(tick)),
      });
      const onResize = () => layout(t);
      window.addEventListener("resize", onResize);
      return () => {
        gsap.ticker.remove(tick);
        st.kill();
        window.removeEventListener("resize", onResize);
      };
    },
    { scope: root, dependencies: [ready, reducedMotion] },
  );

  return (
    <section id="technology" ref={root} aria-labelledby="technology-title" className="relative overflow-hidden py-28 md:py-40">
      <div className="container-x grid items-center gap-14 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <SectionHeading
            index="08"
            eyebrow="Technology"
            id="technology-title"
            title={<>Built with modern <span className="text-brand">technology.</span></>}
            intro="The tools behind the apps, websites and platforms we build."
          />
          {pending && (
            <p className="mt-6" data-reveal>
              <span className="placeholder text-xs">[TECHNOLOGY STACK — PENDING VERIFICATION BY WOLVO]</span>
            </p>
          )}
          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3" data-reveal>
            {groups.map((g) => (
              <div key={g}>
                <dt className="text-xs uppercase tracking-[0.2em] text-faint">{g}</dt>
                <dd className="mt-2 space-y-1 text-sm text-ink/85">
                  {shown
                    .filter((t) => t.group === g)
                    .map((t) => (
                      <span key={t.name} className="block">
                        {t.name}
                      </span>
                    ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Orbital visual — decorative; the list above carries the information. */}
        <div ref={stage} aria-hidden className="relative mx-auto hidden aspect-[4/3] w-full max-w-[640px] sm:block">
          <svg viewBox="-50 -50 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
            {orbits.map((o, i) => (
              <ellipse key={i} cx="0" cy="0" rx={o.rx * 100} ry={o.ry * 100 * 1.33} fill="none" stroke="#16345e" strokeWidth="0.25" vectorEffect="non-scaling-stroke" />
            ))}
          </svg>
          <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <div className="absolute inset-[-60%] rounded-full" style={{ background: "radial-gradient(circle, rgb(13 121 253 / 0.35), transparent 65%)" }} />
            <Image src="/assets/branding/wolvo-symbol-160.webp" alt="" width={160} height={118} className="relative h-12 w-auto md:h-16" />
          </div>
          {shown.map((t, i) => (
            <span
              key={t.name}
              data-chip
              data-orbit={i % orbits.length}
              data-angle={(i / shown.length) * Math.PI * 2 * 3}
              className={cn(
                "absolute left-1/2 top-1/2 whitespace-nowrap rounded-[3px] border bg-navy-950/90 px-3 py-1.5 font-display text-xs uppercase tracking-[0.14em] will-change-transform",
                t.verified ? "border-line text-ink" : "border-dashed border-cyan/40 text-ink/80",
              )}
            >
              {t.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
