"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useExperience } from "@/components/motion/ExperienceProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";

// Draft approach copy — describes how WOLVO works, makes no factual claims.
const stages = [
  { name: "Idea", text: "Every engagement starts with your idea, your goals and the people you want to reach." },
  { name: "Strategy", text: "We define scope, priorities and the channels that matter before anything is built." },
  { name: "Design", text: "Interfaces, identities and creatives shaped into one coherent visual system." },
  { name: "Development", text: "Apps, websites and content produced with care for performance and detail." },
  { name: "Launch", text: "Release, publishing and campaign go-live, coordinated end to end." },
  { name: "Growth", text: "Measure, refine and scale — through ads, social and continuous improvement." },
];

// Ascending geometric path (viewBox 0–1000 × 0–420): rises overall, like growth.
const nodes = [
  { x: 40, y: 330 },
  { x: 224, y: 250 },
  { x: 408, y: 300 },
  { x: 592, y: 170 },
  { x: 776, y: 215 },
  { x: 960, y: 70 },
];
const d = nodes.map((n, i) => `${i ? "L" : "M"}${n.x} ${n.y}`).join(" ");

export function Capabilities() {
  const { ready, reducedMotion, tier } = useExperience();
  const root = useRef<HTMLElement>(null);
  const pinned = ready && !reducedMotion && tier === "high";

  useGSAP(
    () => {
      if (!ready || reducedMotion) return;
      const q = gsap.utils.selector(root);

      if (pinned) {
        const path = q("[data-path]") as unknown as SVGPathElement[];
        const len = path[0].getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: q("[data-track]")[0], start: "top top", end: "bottom bottom", scrub: 0.7 },
        });
        tl.to(path, { strokeDashoffset: 0, duration: 1 }, 0);
        q("[data-node]").forEach((node, i) => {
          const at = (i / (nodes.length - 1)) * 0.95;
          tl.fromTo(node, { opacity: 0.25 }, { opacity: 1, duration: 0.04 }, at);
          tl.fromTo(node.querySelector("[data-diamond]"), { scale: 0.6, backgroundColor: "rgb(22 52 94)" }, { scale: 1, backgroundColor: "rgb(31 203 253)", duration: 0.05 }, at);
          tl.fromTo(node.querySelector("[data-copy]"), { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.06 }, at);
        });
      } else {
        // Stacked (mobile): the vertical rail fills as you read.
        tlVertical(q);
      }
    },
    { scope: root, dependencies: [ready, reducedMotion, pinned], revertOnUpdate: true },
  );

  return (
    <section id="capabilities" ref={root} aria-labelledby="capabilities-title" className="relative">
      {pinned ? (
        <div data-track className="relative h-[320vh]">
          <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden pt-[var(--nav-h)]">
            <div className="container-x">
              <SectionHeading
                index="03"
                eyebrow="What we build"
                id="capabilities-title"
                title={<>From idea to <span className="text-brand">growth.</span></>}
              />
              <div className="relative mx-auto mt-4 aspect-[1000/420] w-full max-w-[calc(46svh*1000/420)]">
                <svg viewBox="0 0 1000 420" className="absolute inset-0 size-full overflow-visible" aria-hidden>
                  <defs>
                    <linearGradient id="cap-grad" x1="0" x2="1" y1="0" y2="0">
                      <stop offset="0" stopColor="#0935ca" />
                      <stop offset="0.5" stopColor="#0d79fd" />
                      <stop offset="1" stopColor="#1fcbfd" />
                    </linearGradient>
                    <filter id="cap-glow" x="-10%" y="-50%" width="120%" height="200%">
                      <feGaussianBlur stdDeviation="6" />
                    </filter>
                  </defs>
                  <path d={d} fill="none" stroke="#16345e" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                  <path data-path d={d} fill="none" stroke="url(#cap-grad)" strokeWidth="6" opacity="0.5" filter="url(#cap-glow)" />
                  <path data-path d={d} fill="none" stroke="url(#cap-grad)" strokeWidth="2.5" />
                </svg>
                <ol className="absolute inset-0">
                  {stages.map((s, i) => {
                    const above = i % 2 === 1; // peaks label above, valleys below
                    return (
                      <li
                        key={s.name}
                        data-node
                        className="absolute w-48 -translate-x-1/2 text-center xl:w-56"
                        style={{ left: `${nodes[i].x / 10}%`, top: `${(nodes[i].y / 420) * 100}%` }}
                      >
                        <span data-diamond className="absolute left-1/2 top-0 block size-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-line shadow-[0_0_20px_rgb(31_203_253/0.6)]" />
                        <div data-copy className={above ? "absolute inset-x-0 bottom-6" : "pt-6"}>
                          <p className="font-display text-xs tracking-[0.2em] text-sky">0{i + 1}</p>
                          <h3 className="mt-1 font-display text-lg uppercase tracking-tight">{s.name}</h3>
                          <p className="mt-1.5 text-sm leading-snug text-muted">{s.text}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container-x py-28">
          <SectionHeading
            index="03"
            eyebrow="What we build"
            id="capabilities-title"
            title={<>From idea to <span className="text-brand">growth.</span></>}
          />
          <ol className="relative mt-14 space-y-10 pl-10">
            <span aria-hidden className="absolute bottom-2 left-[5px] top-2 w-px bg-line" />
            <span aria-hidden data-vfill className="absolute bottom-2 left-[5px] top-2 w-px origin-top bg-gradient-to-b from-electric to-cyan" />
            {stages.map((s, i) => (
              <li key={s.name} className="relative" data-reveal>
                <span aria-hidden className="absolute -left-10 top-1.5 block size-3 rotate-45 bg-sky shadow-[0_0_16px_rgb(31_203_253/0.6)]" />
                <p className="font-display text-xs tracking-[0.2em] text-sky">0{i + 1}</p>
                <h3 className="mt-1 font-display text-xl uppercase">{s.name}</h3>
                <p className="mt-2 text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}

function tlVertical(q: (sel: string) => Element[]) {
  const fill = q("[data-vfill]")[0];
  if (!fill) return;
  gsap.fromTo(
    fill,
    { scaleY: 0 },
    { scaleY: 1, ease: "none", scrollTrigger: { trigger: fill.parentElement, start: "top 70%", end: "bottom 60%", scrub: 0.5 } },
  );
}
