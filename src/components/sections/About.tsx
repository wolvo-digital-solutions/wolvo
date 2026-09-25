"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { company } from "@/data/company";
import { services } from "@/data/services";
import { useExperience } from "@/components/motion/ExperienceProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Content, isPlaceholder } from "@/components/ui/Placeholder";

// Built only from supplied positioning (services, "ideas → digital → impact",
// global ambition). Mission is left as a placeholder until WOLVO provides it.
const statement =
  "WOLVO is a digital technology and creative studio. We bring app development, web development, video, design, advertising and social media under one roof — so the ideas behind a business can become products, brands and campaigns people actually use.";

const pillars = [
  {
    title: "What we are",
    body: "A studio where technology and creativity work as one team — building, designing and promoting under the same roof.",
  },
  {
    title: "Our approach",
    body: "Clarity before complexity. We understand the idea first, then choose the design, technology and channels that serve it.",
  },
  {
    title: "Our vision",
    body: "To help ambitious businesses — wherever they are — turn ideas into digital impact.",
  },
  { title: "Our mission", body: "[MISSION STATEMENT — TO BE PROVIDED]" },
];

export function About() {
  const { ready, reducedMotion } = useExperience();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ready || reducedMotion) return;
      const q = gsap.utils.selector(root);
      // Words light up as the statement moves through the viewport.
      gsap.fromTo(
        q("[data-word]"),
        { color: "rgb(95 111 136 / 0.45)" },
        {
          color: "rgb(247 250 255 / 1)",
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: q("[data-statement]")[0], start: "top 80%", end: "bottom 45%", scrub: 0.6 },
        },
      );
      gsap.fromTo(
        q("[data-bg-mark]"),
        { yPercent: 12, rotate: -4 },
        { yPercent: -12, rotate: 2, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
      );
    },
    { scope: root, dependencies: [ready, reducedMotion] },
  );

  return (
    <section id="about" ref={root} aria-labelledby="about-title" className="relative overflow-hidden py-28 md:py-40">
      <div data-bg-mark aria-hidden className="pointer-events-none absolute -right-[12%] top-[8%] w-[60vw] max-w-[900px] opacity-[0.05]">
        <Image src="/assets/branding/wolvo-symbol-512.webp" alt="" width={512} height={376} className="h-auto w-full" />
      </div>

      <div className="container-x relative">
        <SectionHeading index="06" eyebrow="About WOLVO" id="about-title" title={<>We turn ideas into <span className="text-brand">digital experiences.</span></>} />

        <p data-statement className="mt-14 max-w-5xl font-display text-[clamp(1.5rem,2.8vw,2.6rem)] leading-[1.25] tracking-tight">
          {statement.split(" ").map((w, i) => (
            <span key={i} data-word>
              {w}{" "}
            </span>
          ))}
        </p>

        <div className="mt-20 grid gap-px overflow-hidden rounded-[6px] border border-line/80 bg-line/60 md:grid-cols-2 xl:grid-cols-4">
          {pillars.map((p, i) => (
            <div key={p.title} className="bg-navy-950 p-8" data-reveal>
              <p className="font-display text-xs tracking-[0.24em] text-sky">0{i + 1}</p>
              <h3 className="mt-3 font-display text-xl uppercase">{p.title}</h3>
              <p className="mt-4 text-muted">
                <Content value={p.body} />
              </p>
            </div>
          ))}
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-8 md:grid-cols-4">
          {[
            { k: "Happy clients", v: `${company.happyClients}+` },
            { k: "Disciplines", v: String(services.length).padStart(2, "0") },
            { k: "Founded", v: "[YEAR — TO BE PROVIDED]" },
            { k: "Based in", v: company.location ?? "[LOCATION — TO BE PROVIDED]" },
          ].map((f) => (
            <div key={f.k} className="border-t border-line pt-5" data-reveal>
              <dt className="text-xs uppercase tracking-[0.2em] text-faint">{f.k}</dt>
              <dd className="mt-2 font-display text-3xl">
                <Content value={f.v} className={isPlaceholder(f.v) ? "text-sm" : undefined} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
