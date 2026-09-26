"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useExperience } from "@/components/motion/ExperienceProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";

// Draft process copy — describes the working method, no factual claims.
const steps = [
  { name: "Discover", text: "We listen first: your business, your audience, your goals and your constraints." },
  { name: "Plan", text: "Scope, priorities, timeline and what success looks like — agreed before work begins." },
  { name: "Design", text: "Concepts and systems shaped with you, reviewed together and refined until they are right." },
  { name: "Build", text: "Development and production in clear stages, with regular check-ins so nothing drifts." },
  { name: "Launch", text: "Release and handover, with the next steps mapped out for what comes after go-live." },
];

export function Process() {
  const { ready, reducedMotion, tier } = useExperience();
  const horizontal = ready && !reducedMotion && tier === "high";
  return (
    <section id="process" aria-labelledby="process-title" className="relative">
      {horizontal ? <HorizontalProcess /> : <VerticalProcess animate={ready && !reducedMotion} />}
    </section>
  );
}

function StepBody({ i, s }: { i: number; s: (typeof steps)[number] }) {
  return (
    <>
      <p className="font-display text-sm tracking-[0.24em] text-sky">0{i + 1}</p>
      <h3 className="mt-3 font-display text-[clamp(2rem,3.4vw,3.25rem)] uppercase leading-none tracking-tight">{s.name}</h3>
      <p className="mt-5 max-w-sm text-muted">{s.text}</p>
    </>
  );
}

/** Pinned horizontal track; one blue energy line travels Discover → Launch. */
function HorizontalProcess() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const track = q("[data-track]")[0] as HTMLElement;
      const distance = () => track.scrollWidth - window.innerWidth;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
      // Hold briefly at both ends so the first and last steps are read in place.
      const HOLD = 0.1;
      const RUN = 1 - HOLD * 2;
      tl.to(track, { x: () => -distance(), duration: RUN }, HOLD)
        .fromTo(q("[data-energy]"), { scaleX: 0.02 }, { scaleX: 1, duration: RUN + HOLD }, 0)
        .to({}, { duration: HOLD }, RUN + HOLD);
      q("[data-step]").forEach((step, i) => {
        const at = (i / steps.length) * (RUN + HOLD);
        tl.fromTo(step.querySelector("[data-dot]"), { backgroundColor: "#16345e", boxShadow: "0 0 0 rgb(31 203 253 / 0)" }, { backgroundColor: "#1fcbfd", boxShadow: "0 0 24px rgb(31 203 253 / 0.8)", duration: 0.03 }, at);
        tl.fromTo(step.querySelector("[data-body]"), { opacity: 0.25 }, { opacity: 1, duration: 0.08 }, Math.max(0, at - 0.04));
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative h-[360vh]">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden pt-[var(--nav-h)]">
        <div className="container-x">
          <SectionHeading index="05" eyebrow="How we work" id="process-title" title={<>A clear path, <span className="text-brand">start to launch.</span></>} />
        </div>
        <div data-track className="relative mt-16 flex w-max gap-0 pl-[var(--gutter)] pr-[30vw] will-change-transform">
          {/* Energy line spans the whole track */}
          <div aria-hidden className="absolute left-[var(--gutter)] right-[30vw] top-[5px] h-px bg-line" />
          <div
            aria-hidden
            data-energy
            className="absolute left-[var(--gutter)] right-[30vw] top-[4px] h-[3px] origin-left bg-gradient-to-r from-royal via-electric to-cyan shadow-[0_0_18px_rgb(24_172_253/0.7)]"
          />
          <ol className="flex">
            {steps.map((s, i) => (
              <li key={s.name} data-step className="relative w-[34vw] max-w-[520px] pr-16">
                <span data-dot aria-hidden className="relative z-10 block size-3 rotate-45 bg-line" />
                <div data-body className="mt-10">
                  <StepBody i={i} s={s} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function VerticalProcess({ animate }: { animate: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (!animate) return;
      gsap.fromTo(
        "[data-vline]",
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: "[data-vlist]", start: "top 70%", end: "bottom 60%", scrub: 0.5 } },
      );
    },
    { scope: root, dependencies: [animate] },
  );
  return (
    <div ref={root} className="container-x py-28 md:py-36">
      <SectionHeading index="05" eyebrow="How we work" id="process-title" title={<>A clear path, <span className="text-brand">start to launch.</span></>} />
      <ol data-vlist className="relative mt-14 grid gap-12 pl-10 md:grid-cols-2 md:pl-0">
        <span aria-hidden className="absolute bottom-0 left-[5px] top-0 w-px bg-line md:hidden" />
        <span aria-hidden data-vline className="absolute bottom-0 left-[5px] top-0 w-px origin-top bg-gradient-to-b from-electric to-cyan md:hidden" />
        {steps.map((s, i) => (
          <li key={s.name} className="relative" data-reveal>
            <span aria-hidden className="absolute -left-10 top-1 block size-3 rotate-45 bg-sky md:hidden" />
            <StepBody i={i} s={s} />
          </li>
        ))}
      </ol>
    </div>
  );
}
