"use client";

import Image from "next/image";
import { useRef } from "react";
import { UserRound } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { founders } from "@/data/founders";
import type { Person } from "@/types";
import { useExperience } from "@/components/motion/ExperienceProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Content } from "@/components/ui/Placeholder";

/** Dark studio frame with WOLVO blue rim light — applied to real photos too. */
function Portrait({ person }: { person: Person }) {
  return (
    <div data-portrait className="relative aspect-[4/5] max-w-[440px] overflow-hidden rounded-[6px] bg-navy-900">
      {person.photo ? (
        <Image src={person.photo} alt={`${person.name}, ${person.role} of WOLVO`} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <UserRound aria-hidden className="size-24 text-line" strokeWidth={0.8} />
          <span className="placeholder text-[0.7rem]">[{person.role.toUpperCase()} PHOTO — TO BE PROVIDED]</span>
        </div>
      )}
      {/* Rim light + floor falloff */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(100deg, transparent 55%, rgb(24 172 253 / 0.22) 92%, rgb(31 203 253 / 0.5) 100%)" }} />
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(to top, rgb(3 11 30 / 0.85), transparent 45%)" }} />
      <div data-highlight aria-hidden className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    </div>
  );
}

export function Founders() {
  const { ready, reducedMotion } = useExperience();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ready || reducedMotion) return;
      const q = gsap.utils.selector(root);
      q("[data-portrait]").forEach((el) => {
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: "top 80%", once: true } })
          .fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut" })
          .fromTo(el.querySelector("[data-highlight]"), { xPercent: 0 }, { xPercent: 420, duration: 2.2, ease: "power2.inOut" }, 0.6);
      });
    },
    { scope: root, dependencies: [ready, reducedMotion] },
  );

  return (
    <section id="founders" ref={root} aria-labelledby="founders-title" className="relative py-28 md:py-40">
      <div className="container-x">
        <SectionHeading index="07" eyebrow="Leadership" id="founders-title" title={<>The people <span className="text-brand">behind WOLVO.</span></>} />
        <div className="mt-16 grid gap-14 md:grid-cols-2 lg:gap-24">
          {founders.map((f, i) => (
            <article key={f.role} className={i === 1 ? "md:mt-24" : ""} aria-label={f.placeholder ? `${f.role} profile` : `${f.name}, ${f.role}`}>
              <Portrait person={f} />
              <div className="mt-8" data-reveal>
                <p className="eyebrow">{f.role}</p>
                <h3 className="mt-3 font-display text-2xl uppercase">
                  <Content value={f.name} />
                </h3>
                <p className="mt-4 max-w-md text-muted">
                  <Content value={f.bio} />
                </p>
                <ul className="mt-5 flex flex-wrap gap-2" aria-label="Expertise">
                  {f.expertise.map((e) => (
                    <li key={e} className="text-xs">
                      <Content value={e} />
                    </li>
                  ))}
                </ul>
                {f.links.length > 0 && (
                  <ul className="mt-5 flex gap-5">
                    {f.links.map((l) => (
                      <li key={l.href}>
                        <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-sm uppercase tracking-[0.16em] hover:text-cyan">
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
