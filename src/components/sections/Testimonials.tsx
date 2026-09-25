"use client";

import { useRef } from "react";
import { Quote } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { testimonials } from "@/data/testimonials";
import { useExperience } from "@/components/motion/ExperienceProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Content } from "@/components/ui/Placeholder";

export function Testimonials() {
  const { ready, reducedMotion, tier } = useExperience();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ready || reducedMotion || tier === "low") return;
      // Subtle horizontal drift while the section passes.
      gsap.fromTo(
        "[data-drift]",
        { xPercent: 4 },
        { xPercent: -4, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.6 } },
      );
    },
    { scope: root, dependencies: [ready, reducedMotion, tier] },
  );

  return (
    <section id="testimonials" ref={root} aria-labelledby="testimonials-title" className="relative overflow-hidden py-28 md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 h-[60%] -translate-y-1/2"
        style={{ background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgb(9 53 202 / 0.16), transparent 70%)" }}
      />
      <div className="container-x relative">
        <SectionHeading index="09" eyebrow="Testimonials" id="testimonials-title" title={<>What our <span className="text-brand">clients say.</span></>} />
      </div>
      <div className="relative mt-16">
        <ul
          data-drift
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-[var(--gutter)] pb-4 [scrollbar-width:none] md:justify-center md:overflow-visible"
          aria-label="Client testimonials"
        >
          {testimonials.map((t, i) => (
            <li
              key={i}
              className="group panel w-[85vw] shrink-0 snap-center rounded-[8px] p-8 backdrop-blur-sm transition-[transform,border-color,opacity] duration-500 hover:-translate-y-1 hover:border-sky/50 sm:w-[420px] md:opacity-80 md:hover:opacity-100"
              data-reveal
            >
              <figure className="flex h-full flex-col">
                <Quote aria-hidden className="size-7 text-sky" strokeWidth={1.2} />
                <blockquote className="mt-6 flex-1 font-display text-xl leading-snug">
                  <Content value={t.quote} />
                </blockquote>
                <figcaption className="mt-8 border-t border-line pt-5 text-sm">
                  <Content value={t.name} className="block" />
                  <span className="mt-2 block text-muted">
                    <Content value={t.company} /> {t.role && <Content value={t.role} />}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
