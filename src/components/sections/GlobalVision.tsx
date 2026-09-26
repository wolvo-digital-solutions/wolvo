"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useExperience } from "@/components/motion/ExperienceProvider";
import { SceneMount } from "@/components/3d/SceneMount";
import { SectionHeading } from "@/components/ui/SectionHeading";

const GlobeScene = dynamic(() => import("@/components/3d/GlobeScene"), { ssr: false });

/** Static fallback: a dotted sphere outline with a few connection arcs. */
function GlobeFallback() {
  return (
    <svg viewBox="-110 -110 220 220" className="mx-auto h-full max-h-[520px] w-full" aria-hidden>
      <defs>
        <radialGradient id="gf-atmo" r="0.6">
          <stop offset="0.8" stopColor="#0d79fd" stopOpacity="0" />
          <stop offset="0.9" stopColor="#0d79fd" stopOpacity="0.35" />
          <stop offset="1" stopColor="#0d79fd" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle r="100" fill="url(#gf-atmo)" />
      <circle r="80" fill="#06132d" stroke="#16345e" />
      {[-60, -30, 0, 30, 60].map((lat) => (
        <ellipse key={lat} cy={lat * 0.9} rx={80 * Math.cos((lat * Math.PI) / 180)} ry={8} fill="none" stroke="#16345e" strokeWidth="0.6" />
      ))}
      {[20, 55, 90].map((w) => (
        <ellipse key={w} rx={w * 0.8} ry="80" fill="none" stroke="#16345e" strokeWidth="0.6" />
      ))}
      <path d="M-40 -20 Q 0 -70 45 -10" fill="none" stroke="#1fcbfd" strokeWidth="1" strokeDasharray="3 4" />
      <path d="M-50 30 Q 0 0 30 50" fill="none" stroke="#1fcbfd" strokeWidth="1" strokeDasharray="3 4" />
      {[[-40, -20], [45, -10], [-50, 30], [30, 50]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="2.2" fill="#9fe7ff" />
      ))}
    </svg>
  );
}

export function GlobalVision() {
  const { ready, reducedMotion, tier, webgl } = useExperience();
  const root = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const use3d = ready && webgl && !reducedMotion && tier !== "low";

  useGSAP(
    () => {
      if (!use3d) return;
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => (progressRef.current = self.progress),
      });
    },
    { scope: root, dependencies: [use3d] },
  );

  return (
    <section id="vision" ref={root} aria-labelledby="vision-title" className="relative overflow-hidden py-28 md:py-40">
      <div className="container-x grid items-center gap-10 lg:grid-cols-[1fr_1.15fr]">
        <div className="relative z-10">
          <SectionHeading
            index="10"
            eyebrow="Global vision"
            id="vision-title"
            title={<>Building without <span className="text-brand">borders.</span></>}
          />
          <p className="mt-6 max-w-lg text-lg text-muted" data-reveal>
            Ideas aren&rsquo;t limited by geography — and neither is our ambition. WOLVO aims to partner with ambitious
            businesses wherever they are, with clear communication and digital-first ways of working.
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-faint" data-reveal>
            Illustrative network — not a map of client locations.
          </p>
        </div>
        <SceneMount
          enabled={use3d}
          className="aspect-square w-full max-w-[680px] justify-self-center"
          fallback={<GlobeFallback />}
        >
          {(visible) => <GlobeScene progressRef={progressRef} visible={visible} tier={tier} />}
        </SceneMount>
      </div>
    </section>
  );
}
