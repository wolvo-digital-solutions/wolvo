"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { AppWindow, Clapperboard, PenTool, Share2, Smartphone, Target, type LucideIcon } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { services } from "@/data/services";
import type { ServiceId } from "@/types";
import { useExperience } from "@/components/motion/ExperienceProvider";
import { SceneMount } from "@/components/3d/SceneMount";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const ServicesScene = dynamic(() => import("@/components/3d/ServicesScene"), { ssr: false });

const icons: Record<ServiceId, LucideIcon> = {
  app: Smartphone,
  web: AppWindow,
  video: Clapperboard,
  graphic: PenTool,
  ads: Target,
  social: Share2,
};

/** Static visual used on mobile, without WebGL, and for reduced motion. */
function ServiceGlyph({ id, className }: { id: ServiceId; className?: string }) {
  const Icon = icons[id];
  return (
    <div className={cn("relative flex items-center justify-center", className)} aria-hidden>
      <div className="absolute inset-0 rotate-45 border border-line/80 bg-gradient-to-br from-navy-800/80 to-navy-950" />
      <div className="absolute inset-[18%] rotate-45 border border-sky/30" />
      <Icon className="relative size-[34%] text-sky" strokeWidth={1.2} />
    </div>
  );
}

function ServiceDetail({ s, headingLevel = "h3" }: { s: (typeof services)[number]; headingLevel?: "h3" }) {
  const H = headingLevel;
  return (
    <>
      <p className="font-display text-sm tracking-[0.24em] text-sky">{s.index} / 06</p>
      <H className="mt-4 text-h3 uppercase">{s.title}</H>
      <p className="mt-5 max-w-md text-base text-muted md:text-lg">{s.description}</p>
      <ul className="mt-7 flex max-w-md flex-wrap gap-2" aria-label={`${s.title} deliverables`}>
        {s.deliverables.map((d) => (
          <li key={d} className="rounded-[3px] border border-line px-3 py-1.5 text-xs uppercase tracking-[0.14em] text-ink/80">
            {d}
          </li>
        ))}
      </ul>
      <ButtonLink href="#contact" variant="ghost" className="mt-8 min-h-10">
        Discuss {s.title.toLowerCase()}
      </ButtonLink>
    </>
  );
}

export function Services() {
  const { ready, reducedMotion, tier, webgl } = useExperience();
  const pinned = ready && !reducedMotion && tier !== "low";
  return (
    <section id="services" aria-labelledby="services-title" className="relative">
      {pinned ? <PinnedServices webgl={webgl} /> : <StackedServices />}
    </section>
  );
}

function StackedServices() {
  return (
    <div className="container-x py-28 md:py-36">
      <SectionHeading
        index="02"
        eyebrow="What we do"
        id="services-title"
        title={<>Six disciplines. <span className="text-brand">One studio.</span></>}
        intro="From the product your customers use to the campaign that brings them in."
      />
      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {services.map((s) => (
          <article key={s.id} className="panel rounded-[6px] p-7" data-reveal>
            <ServiceGlyph id={s.id} className="mb-8 size-20" />
            <ServiceDetail s={s} />
          </article>
        ))}
      </div>
    </div>
  );
}

function PinnedServices({ webgl }: { webgl: boolean }) {
  const { tier } = useExperience();
  const root = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const items = q("[data-service]");
      const n = items.length;
      gsap.set(items, { autoAlpha: 0, y: 24 });
      gsap.set(items[0], { autoAlpha: 1, y: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.8 },
        // Timeline clock (already scrub-smoothed) drives the 3D morph and active index.
        onUpdate: () => {
          const t = tl.time();
          // Staircase: morph during the text crossfade, hold while a service is read.
          const k = Math.floor(t - 0.45);
          const frac = t - 0.45 - k;
          activeRef.current = gsap.utils.clamp(0, n - 1, k + gsap.utils.clamp(0, 1, frac / 0.6));
          const idx = gsap.utils.clamp(0, n - 1, Math.round(t - 0.3));
          setActive((prev) => (prev === idx ? prev : idx));
        },
      });
      // Each service owns one unit of the timeline: enter → hold → exit.
      items.forEach((el, i) => {
        if (i > 0) tl.to(el, { autoAlpha: 1, y: 0, duration: 0.35 }, i - 0.35);
        if (i < n - 1) tl.to(el, { autoAlpha: 0, y: -24, duration: 0.35 }, i + 0.55);
      });
      tl.to({}, { duration: 0.6 }, n - 1);
      q("[data-rail-fill]").forEach((bar, i) => {
        tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "none" }, i - 0.5 < 0 ? 0 : i - 0.5);
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative h-[680vh]">
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden pt-[var(--nav-h)]">
        {/* Soft blue floor light behind the formation */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-[-10%] top-1/2 size-[70vw] -translate-y-1/2 rounded-full opacity-60"
          style={{ background: "radial-gradient(circle, rgb(13 121 253 / 0.18), transparent 60%)" }}
        />
        <div className="container-x relative grid flex-1 content-center items-center gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-8">
          <div className="relative z-10">
            <p className="eyebrow">
              <span className="text-muted">02</span>
              <span aria-hidden className="mx-3 inline-block h-px w-8 translate-y-[-3px] bg-sky/60" />
              What we do
            </p>
            <h2 id="services-title" className="mt-4 max-w-md font-display text-2xl uppercase tracking-tight text-ink/70 md:text-3xl">
              Six disciplines. <span className="text-brand">One studio.</span>
            </h2>
            <div className="relative mt-8 min-h-[21rem] lg:mt-10 lg:min-h-[25rem]">
              {services.map((s, i) => (
                <article
                  key={s.id}
                  data-service
                  className="absolute inset-x-0 top-0"
                  aria-hidden={i !== active}
                  // Keep inactive CTAs out of the tab order.
                  inert={i !== active}
                >
                  <ServiceDetail s={s} />
                </article>
              ))}
            </div>
          </div>

          <SceneMount
            enabled={webgl}
            className="pointer-events-none h-[34svh] w-full lg:h-[70vh]"
            fallback={
              <div className="flex h-full items-center justify-center">
                <ServiceGlyph id={services[active].id} className="size-56" />
              </div>
            }
          >
            {(visible) => <ServicesScene activeRef={activeRef} visible={visible} tier={tier} />}
          </SceneMount>
        </div>

        {/* Index rail */}
        <div className="container-x relative pb-8">
          <ol className="grid grid-cols-6 gap-3">
            {services.map((s, i) => (
              <li key={s.id} className={cn("transition-colors duration-500", i === active ? "text-ink" : "text-faint")}>
                <div className="h-px overflow-hidden bg-line">
                  <div data-rail-fill className="h-full origin-left bg-gradient-to-r from-electric to-cyan" />
                </div>
                <p className="mt-3 font-display text-[0.7rem] uppercase tracking-[0.16em]">
                  <span className="text-sky">{s.index}</span>
                  <span className="ml-2 hidden xl:inline">{s.title}</span>
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
