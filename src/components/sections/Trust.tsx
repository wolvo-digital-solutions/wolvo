"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { company } from "@/data/company";
import { services } from "@/data/services";
import { useExperience } from "@/components/motion/ExperienceProvider";

export function Trust() {
  const { ready, reducedMotion } = useExperience();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ready || reducedMotion) return;
      const q = gsap.utils.selector(root);
      const counter = { n: 0 };
      const el = q("[data-count]")[0] as HTMLElement;
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: "top 70%", once: true } })
        .to(counter, {
          n: company.happyClients,
          duration: 1.8,
          ease: "power2.out",
          onUpdate: () => (el.textContent = String(Math.round(counter.n))),
        })
        .fromTo(q("[data-sweep]"), { xPercent: -120 }, { xPercent: 120, duration: 1.6, ease: "power2.inOut" }, 0.2);
    },
    { scope: root, dependencies: [ready, reducedMotion] },
  );

  return (
    <section id="intro" ref={root} aria-labelledby="intro-title" className="relative overflow-hidden py-28 md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(80rem,90vw)] -translate-x-1/2 bg-gradient-to-r from-transparent via-sky/40 to-transparent"
      />
      <div className="container-x grid items-end gap-16 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <p className="eyebrow" data-reveal>
            <span className="text-muted">01</span>
            <span aria-hidden className="mx-3 inline-block h-px w-8 translate-y-[-3px] bg-sky/60" />
            Who we are
          </p>
          <h2 id="intro-title" className="mt-6 text-h2 uppercase" data-reveal>
            We build digital experiences that move businesses <span className="text-brand">forward.</span>
          </h2>
          <p className="mt-8 max-w-xl text-lg text-muted" data-reveal>
            One studio for the product, the brand and the campaign — so strategy, design, engineering and content move
            in the same direction.
          </p>
        </div>

        <div className="relative" data-reveal>
          <div className="panel relative overflow-hidden rounded-[6px] p-8 md:p-10">
            <div
              data-sweep
              aria-hidden
              className="pointer-events-none absolute inset-y-0 w-1/2 -translate-x-[120%] bg-gradient-to-r from-transparent via-cyan/10 to-transparent"
            />
            <p className="flex items-start font-display font-medium leading-none tracking-tight">
              <span className="sr-only">{company.happyClients}+ happy clients</span>
              <span aria-hidden data-count className="text-[clamp(6rem,14vw,11rem)]">
                {company.happyClients}
              </span>
              <span aria-hidden className="text-brand mt-3 text-[clamp(3rem,6vw,5rem)]">+</span>
            </p>
            <p aria-hidden className="mt-4 font-display text-lg uppercase tracking-[0.24em]">
              Happy clients
            </p>
            <div className="mt-8 h-px bg-line" />
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted" aria-label="Services">
              {services.map((s) => (
                <li key={s.id}>{s.title}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
