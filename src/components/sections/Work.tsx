"use client";

import Image from "next/image";
import { useRef } from "react";
import { ImageIcon } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { projects } from "@/data/projects";
import type { Project } from "@/types";
import { useExperience } from "@/components/motion/ExperienceProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Content } from "@/components/ui/Placeholder";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

function ProjectVisual({ p, index }: { p: Project; index: number }) {
  if (p.image) {
    return <Image src={p.image} alt={`${p.name} — project visual`} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />;
  }
  return (
    <div className="absolute inset-0 overflow-hidden bg-navy-900">
      {/* Blueprint grid + angular light, clearly an empty slot */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgb(22 52 94 / 0.7) 1px, transparent 1px), linear-gradient(90deg, rgb(22 52 94 / 0.7) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        aria-hidden
        className="absolute -right-1/4 -top-1/4 size-[80%] rotate-45 opacity-70"
        style={{ background: "linear-gradient(135deg, rgb(13 121 253 / 0.35), transparent 60%)" }}
      />
      <span aria-hidden className="absolute left-6 top-5 font-display text-7xl font-medium text-line md:text-8xl">
        0{index + 1}
      </span>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
        <ImageIcon aria-hidden className="size-8 text-sky/70" strokeWidth={1.2} />
        <span className="placeholder text-[0.7rem]">[PROJECT VISUAL — TO BE PROVIDED]</span>
      </div>
    </div>
  );
}

function ProjectCard({ p, index, className }: { p: Project; index: number; className?: string }) {
  return (
    <article
      className={cn(
        "grid overflow-hidden rounded-[8px] border border-line/80 bg-navy-950 shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9)] lg:grid-cols-[1.35fr_1fr]",
        className,
      )}
      aria-label={p.placeholder ? `Case study slot ${index + 1}` : p.name}
    >
      <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-full">
        <ProjectVisual p={p} index={index} />
      </div>
      <div className="flex flex-col gap-6 p-7 md:p-10">
        <div className="flex items-center justify-between gap-4">
          <p className="eyebrow">{p.category}</p>
          <p className="font-display text-xs tracking-[0.2em] text-faint">
            {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </p>
        </div>
        <h3 className="font-display text-2xl uppercase leading-tight md:text-3xl">
          <Content value={p.name} />
        </h3>
        <dl className="grid gap-4 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-faint">Client</dt>
            <dd className="mt-1">
              <Content value={p.client} />
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-faint">Services</dt>
            <dd className="mt-1 text-ink/85">{p.services.join(" · ")}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-faint">Overview</dt>
            <dd className="mt-1 text-muted">
              <Content value={p.description} />
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-faint">Outcome</dt>
            <dd className="mt-1 text-muted">
              <Content value={p.outcome} />
            </dd>
          </div>
        </dl>
        {p.url && (
          <ButtonLink href={p.url} variant="ghost" target="_blank" rel="noopener noreferrer" className="mt-auto min-h-10">
            View project
          </ButtonLink>
        )}
      </div>
    </article>
  );
}

export function Work() {
  const { ready, reducedMotion, tier } = useExperience();
  const depth = ready && !reducedMotion && tier !== "low";
  return (
    <section id="work" aria-labelledby="work-title" className="relative">
      {depth ? <DepthGallery /> : <StackedWork />}
    </section>
  );
}

const heading = (
  <SectionHeading
    index="04"
    eyebrow="Selected work"
    id="work-title"
    title={<>Work that speaks <span className="text-brand">for itself.</span></>}
    intro={
      <>
        Case studies from WOLVO&rsquo;s client work. <span className="placeholder text-[0.75em]">[REAL PROJECTS — TO BE PROVIDED]</span>
      </>
    }
  />
);

function StackedWork() {
  return (
    <div className="container-x py-28 md:py-36">
      {heading}
      <div className="mt-14 space-y-8">
        {projects.map((p, i) => (
          <div key={p.id} data-reveal>
            <ProjectCard p={p} index={i} />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Stacked depth: the current project sits in front, the next waits behind,
 * and the previous one moves past the camera as you scroll — a 3D gallery
 * built on CSS perspective (cheap, crisp text, no WebGL needed).
 */
function DepthGallery() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const cards = q("[data-card]");
      const n = cards.length;
      const counter = q("[data-work-index]")[0];
      const place = (p: number) => {
        cards.forEach((card, i) => {
          const o = i - p; // >0 waiting behind, <0 already passed
          const passed = Math.min(0, o);
          const ahead = Math.max(0, o);
          gsap.set(card, {
            z: ahead * -420 + passed * -700,
            y: ahead * 46 + passed * 60,
            rotateX: ahead * -5 + passed * 8,
            scale: 1 - passed * 0.12,
            // Passed cards clear out quickly so two layers of text never compete.
            opacity: o < 0 ? Math.max(0, 1 + o * 2.8) : Math.max(0, 1 - ahead * 0.42),
            zIndex: 100 - Math.round(Math.abs(o) * 10),
            pointerEvents: Math.abs(o) < 0.5 ? "auto" : "none",
            filter: `brightness(${1 - Math.min(0.55, ahead * 0.35)}) blur(${Math.min(8, -passed * 18)}px)`,
          });
          card.toggleAttribute("inert", Math.abs(o) >= 0.5);
        });
        if (counter) counter.textContent = String(Math.min(n, Math.round(p) + 1)).padStart(2, "0");
      };
      const state = { p: 0 };
      place(0);
      gsap.to(state, {
        p: n - 1,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.8 },
        // Staircase: each project holds briefly before the next moves forward.
        onUpdate: () => {
          const k = Math.floor(state.p);
          const t = gsap.utils.clamp(0, 1, (state.p - k - 0.3) / 0.7);
          place(Math.min(n - 1, k + gsap.parseEase("power2.inOut")(t)));
        },
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative" style={{ height: `${projects.length * 90 + 60}vh` }}>
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden pt-[calc(var(--nav-h)+2rem)]">
        <div className="container-x flex items-end justify-between gap-8">
          <div className="max-w-3xl">
            <p className="eyebrow">
              <span className="text-muted">04</span>
              <span aria-hidden className="mx-3 inline-block h-px w-8 translate-y-[-3px] bg-sky/60" />
              Selected work
            </p>
            <h2 id="work-title" className="mt-4 font-display text-[clamp(2rem,3.6vw,3.5rem)] uppercase leading-none">
              Work that speaks <span className="text-brand">for itself.</span>
            </h2>
            <p className="mt-4 text-sm text-muted">
              Case studies from WOLVO&rsquo;s client work.{" "}
              <span className="placeholder text-[0.75em]">[REAL PROJECTS — TO BE PROVIDED]</span>
            </p>
          </div>
          <p aria-hidden className="hidden font-display text-sm tracking-[0.2em] text-muted md:block">
            <span data-work-index className="text-ink">01</span> / {String(projects.length).padStart(2, "0")}
          </p>
        </div>

        <div className="relative mt-8 flex-1 [perspective:1400px] [perspective-origin:50%_20%]">
          {projects.map((p, i) => (
            <div key={p.id} data-card className="absolute inset-x-0 top-0 mx-auto w-[min(1120px,calc(100%-2*var(--gutter)))] will-change-transform [transform-style:preserve-3d]">
              <ProjectCard p={p} index={i} className="lg:h-[min(58svh,560px)]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
