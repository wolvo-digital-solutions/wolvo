"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { FrameSequence, heroSets } from "@/lib/frameSequence";
import { heroLoading } from "@/lib/loading";
import { useExperience } from "@/components/motion/ExperienceProvider";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// Story beats mapped onto the supplied sequence (docs/ANIMATION_SPEC.md hero timeline).
const chapters = [
  { at: 0, label: "The wolf" },
  { at: 0.25, label: "Energy" },
  { at: 0.5, label: "Decomposition" },
  { at: 0.72, label: "Formation" },
  { at: 0.9, label: "WOLVO" },
];

/** Portion of the pinned scroll spent on frames; the rest holds the final W for readability. */
const FRAMES_END = 0.9;

export function Hero() {
  const { ready, reducedMotion, tier } = useExperience();
  const root = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const seqRef = useRef<FrameSequence | null>(null);
  const progressRef = useRef(0);
  const zoomRef = useRef(0);

  const animated = ready && !reducedMotion;

  // ---- Frame sequence lifecycle -------------------------------------------------
  useEffect(() => {
    if (!ready) return;
    if (!animated) {
      heroLoading.set(1); // static poster only
      return;
    }
    const canvas = canvasRef.current!;
    const useSmall = tier === "low" || window.innerWidth * Math.min(devicePixelRatio, 2) < 1300;
    const seq = new FrameSequence(
      useSmall ? heroSets.sm : heroSets.lg,
      (first) => heroLoading.set(first),
      () => seq.draw(progressRef.current, true),
    );
    seqRef.current = seq;

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 1.75);
      const { clientWidth: w, clientHeight: h } = canvas;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      seq.attach(canvas);
      seq.zoomOut = zoomRef.current;
      seq.draw(progressRef.current, true);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    seq.load(useSmall ? 4 : 6);

    return () => {
      ro.disconnect();
      seq.dispose();
      seqRef.current = null;
    };
  }, [ready, animated, tier]);

  // ---- Scroll choreography: one scrubbed timeline for the whole hero -----------
  useGSAP(
    () => {
      if (!animated) return;
      const q = gsap.utils.selector(root);
      const state = { frame: 0 };
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          onUpdate: (self) => {
            const label = [...chapters].reverse().find((c) => self.progress >= c.at * FRAMES_END + 0.001) ?? chapters[0];
            const el = q("[data-chapter]")[0];
            if (el && el.textContent !== label.label) el.textContent = label.label;
          },
        },
      });

      tl.to(state, {
        frame: 1,
        duration: FRAMES_END,
        onUpdate: () => {
          const canvas = canvasRef.current!;
          const portrait = canvas.clientWidth / canvas.clientHeight < 1;
          progressRef.current = state.frame;
          zoomRef.current = portrait ? gsap.utils.clamp(0, 1, (state.frame - 0.72) / 0.22) : 0;
          const seq = seqRef.current;
          if (!seq) return;
          seq.zoomOut = zoomRef.current;
          seq.draw(state.frame);
        },
      }, 0)
        // Intro copy steps aside as the wolf activates.
        .to(q("[data-hero-intro]"), { autoAlpha: 0, y: -40, duration: 0.12, ease: "power1.in" }, 0.02)
        .to(q("[data-hero-scrim]"), { opacity: 0.25, duration: 0.15 }, 0.04)
        .to(q("[data-scroll-cue]"), { autoAlpha: 0, duration: 0.05 }, 0)
        .fromTo(q("[data-hero-meter]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05 }, 0.06)
        .fromTo(q("[data-hero-meter-bar]"), { scaleY: 0 }, { scaleY: 1, duration: FRAMES_END - 0.06 }, 0.06)
        // Light vignette deepens during decomposition, lifts for the final mark.
        .to(q("[data-hero-vignette]"), { opacity: 0.85, duration: 0.3 }, 0.35)
        .to(q("[data-hero-vignette]"), { opacity: 0.4, duration: 0.2 }, 0.72)
        // Brand lockup resolves once the W is formed, then holds.
        .fromTo(
          q("[data-hero-lockup] > *"),
          { autoAlpha: 0, y: 24, filter: "blur(6px)" },
          { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.07, stagger: 0.02, ease: "power2.out" },
          FRAMES_END - 0.04,
        )
        .to(q("[data-hero-meter]"), { autoAlpha: 0, duration: 0.04 }, FRAMES_END)
        .to({}, { duration: 1 - FRAMES_END - 0.02 });

      // Intro entrance on load (not scroll-bound).
      gsap.from(q("[data-hero-intro] > *"), { autoAlpha: 0, y: 30, duration: 1.4, stagger: 0.1, ease: "expo.out", delay: 0.5 });
    },
    { scope: root, dependencies: [animated], revertOnUpdate: true },
  );

  // Keep ScrollTrigger positions correct when the pin height changes by tier.
  useEffect(() => {
    if (animated) ScrollTrigger.refresh();
  }, [animated, tier]);

  return (
    <section
      id="top"
      ref={root}
      aria-labelledby="hero-title"
      className={cn("relative", animated ? (tier === "low" ? "h-[260svh]" : "h-[420vh]") : "h-svh min-h-[640px]")}
    >
      <div className="sticky top-0 h-svh min-h-[560px] overflow-hidden bg-navy-950">
        {/* Poster: first supplied frame. Visible before JS and as the reduced-motion hero. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/video-frames/hero/poster-lg.webp"
          srcSet="/assets/video-frames/hero/poster-sm.webp 900w, /assets/video-frames/hero/poster-lg.webp 1600w"
          sizes="100vw"
          alt="A geometric chrome wolf with glowing blue crystal inlays standing in a dark midnight environment."
          fetchPriority="high"
          className="absolute inset-0 size-full object-cover"
        />
        <canvas
          ref={canvasRef}
          aria-hidden
          className={cn("absolute inset-0 size-full", !animated && "hidden")}
        />

        {/* Readability scrims */}
        <div
          data-hero-vignette
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{ background: "radial-gradient(ellipse 70% 60% at 50% 45%, transparent 40%, rgb(3 11 30 / 0.9) 100%)" }}
        />
        <div
          data-hero-scrim
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950 from-5% via-navy-950/75 via-45% to-transparent to-75% md:bg-gradient-to-r md:from-navy-950/90 md:via-navy-950/30 md:to-transparent"
        />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-950 to-transparent" />

        {/* Intro copy */}
        <div className="container-x relative flex h-full items-end pb-24 md:items-center md:pb-0">
          <div data-hero-intro className="max-w-[36rem] md:pt-16">
            <p className="eyebrow">Digital technology &amp; creative studio</p>
            <h1 id="hero-title" className="mt-5 text-[clamp(2.6rem,5vw,5.75rem)] leading-[0.95] uppercase">
              Turning ideas into <span className="text-brand">digital impact.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base text-ink/80 md:text-lg">
              WOLVO is a digital creative and technology studio building apps, websites, brands, campaigns and digital
              experiences for ambitious businesses.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="#contact" magnetic>
                Start a project
              </ButtonLink>
              <ButtonLink href="#work" variant="secondary" icon={false}>
                Explore our work
              </ButtonLink>
            </div>
          </div>
        </div>

        {/* Final lockup, revealed when the sequence lands on the W */}
        <div
          data-hero-lockup
          aria-hidden={!animated}
          className="pointer-events-none absolute inset-x-0 bottom-[7%] flex flex-col items-center text-center"
        >
          <p className={cn("opacity-0 font-display text-[clamp(2.2rem,5.5vw,4.5rem)] font-medium tracking-[0.32em] pl-[0.32em]", !animated && "hidden")}>
            WOLVO
          </p>
          <p className={cn("opacity-0 mt-2 eyebrow text-muted", !animated && "hidden")}>
            Ideas <span className="text-sky">→</span> Digital <span className="text-sky">→</span> Impact
          </p>
        </div>

        {/* Story meter */}
        {animated && (
          <div
            data-hero-meter
            aria-hidden
            className="invisible absolute bottom-10 left-[var(--gutter)] hidden items-end gap-4 md:flex"
          >
            <div className="h-24 w-px bg-line">
              <div data-hero-meter-bar className="h-full w-full origin-top bg-gradient-to-b from-cyan to-electric" />
            </div>
            <div>
              <p className="eyebrow text-muted">Chapter</p>
              <p data-chapter className="mt-1 font-display text-sm uppercase tracking-[0.2em]">
                The wolf
              </p>
            </div>
          </div>
        )}

        {/* Scroll cue */}
        <div
          data-scroll-cue
          aria-hidden
          className="absolute bottom-8 right-[var(--gutter)] hidden flex-col items-center gap-3 md:flex"
        >
          <span className="eyebrow text-muted [writing-mode:vertical-rl]">Scroll</span>
          <span className="relative h-12 w-px overflow-hidden bg-line">
            <span className="absolute inset-x-0 top-0 h-1/2 bg-cyan" style={{ animation: "scroll-cue 1.8s var(--ease-cinematic) infinite" }} />
          </span>
        </div>
      </div>
    </section>
  );
}
