import { useRef } from 'react';
import { gsap, ScrollTrigger } from '@/animations/gsap';
import { useSectionMotion } from '@/hooks/useSectionMotion';
import { techGroups, type TechTool } from '@/data/techStack';
import { techLogos } from '@/data/techLogos';
import { SectionHeading } from '@/components/ui/SectionHeading';
import './TechStack.css';

/** Marquee rows: web + brand tools, then app + video tools (unique by name). */
const unique = (tools: TechTool[]) => Array.from(new Map(tools.map((t) => [t.name, t])).values());
const ROWS = [
  unique(techGroups.filter((g) => g.id === 'web' || g.id === 'brand').flatMap((g) => g.tools)),
  unique(techGroups.filter((g) => g.id === 'app' || g.id === 'video').flatMap((g) => g.tools)),
];

/** Pixels per second at rest. */
const SPEED = 42;
/** Speed while hovered (fraction of rest speed). */
const HOVER_SPEED = 0.18;

function Logo({ tool, className }: { tool: TechTool; className: string }) {
  if (!tool.logo) return null;
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={techLogos[tool.logo].path} fill="currentColor" />
    </svg>
  );
}

function Pill({ tool, clone = false }: { tool: TechTool; clone?: boolean }) {
  return (
    <span className={`stack-pill${tool.logo ? '' : ' stack-pill--text'}`} data-clone={clone || undefined}>
      <Logo tool={tool} className="stack-pill__logo" />
      {tool.name}
    </span>
  );
}

export function TechStack() {
  const ref = useRef<HTMLElement>(null);

  useSectionMotion(
    ref,
    undefined,
    {
      intro: (scope) => {
        const rows = gsap.utils.toArray<HTMLElement>('.stack__row', scope);
        const marquee = scope.querySelector<HTMLElement>('.stack__marquee')!;

        // Seamless loops: each track holds the set twice, so moving by half its width wraps exactly.
        const loops = rows.map((row) => {
          row.classList.add('is-looping');
          const track = row.querySelector<HTMLElement>('.stack__track')!;
          const direction = Number(row.dataset.direction);
          const duration = track.scrollWidth / 2 / SPEED;
          return direction < 0
            ? gsap.fromTo(track, { xPercent: 0 }, { xPercent: -50, duration, ease: 'none', repeat: -1, paused: true })
            : gsap.fromTo(track, { xPercent: -50 }, { xPercent: 0, duration, ease: 'none', repeat: -1, paused: true });
        });

        // Speed = rest × hover factor × (1 + scroll boost). Scroll velocity gives a short,
        // eased surge that settles back; hovering a row slows that row to a drift.
        const state = { boost: 0 };
        const hover = rows.map(() => ({ factor: 1 }));
        const apply = () => loops.forEach((loop, i) => loop.timeScale(hover[i].factor * (1 + state.boost)));
        const listeners = rows.map((row, i) => {
          const to = (factor: number) => gsap.to(hover[i], { factor, duration: 0.6, ease: 'power2.out', overwrite: true, onUpdate: apply });
          const enter = () => to(HOVER_SPEED);
          const leave = () => to(1);
          row.addEventListener('pointerenter', enter);
          row.addEventListener('pointerleave', leave);
          return () => {
            row.removeEventListener('pointerenter', enter);
            row.removeEventListener('pointerleave', leave);
          };
        });

        ScrollTrigger.create({
          trigger: marquee,
          start: 'top bottom',
          end: 'bottom top',
          // Loops only run while visible.
          onToggle: (self) => loops.forEach((loop) => (self.isActive ? loop.play() : loop.pause())),
          onUpdate: (self) => {
            const boost = Math.min(Math.abs(self.getVelocity()) / 900, 2.2);
            if (boost <= state.boost) return;
            state.boost = boost;
            gsap.to(state, { boost: 0, duration: 1.4, ease: 'power3.out', overwrite: true, onUpdate: apply });
          },
        });

        // Rows glide in from opposite sides.
        gsap.from(rows, {
          x: (i) => (i % 2 ? 90 : -90),
          opacity: 0,
          duration: 1.2,
          stagger: 0.12,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: marquee, start: 'top 90%', once: true },
        });

        return () => {
          listeners.forEach((off) => off());
          rows.forEach((row) => row.classList.remove('is-looping'));
        };
      },
    },
  );

  return (
    <section id="stack" ref={ref} className="stack section" aria-labelledby="stack-title">
      <span className="stack__glow" aria-hidden="true" />
      <div className="container">
        <SectionHeading
          id="stack-title"
          index="03"
          eyebrow="Tech Stack"
          title={
            <>
              Our Tech <span className="text-gradient">Stack</span>
            </>
          }
          description="The proven frameworks, platforms and creative tools we use to design, build, edit and launch — chosen for speed, reliability and room to grow."
        />
      </div>

      {/* Accessible list of technologies for screen readers */}
      <div className="sr-only">
        <h3>Technologies and Tools</h3>
        <ul>
          {unique(techGroups.flatMap((g) => g.tools)).map((tool) => (
            <li key={tool.name}>{tool.name}</li>
          ))}
        </ul>
      </div>

      <div className="stack__marquee" aria-hidden="true">
        {ROWS.map((tools, i) => (
          <div className="stack__row" data-direction={i % 2 ? 1 : -1} key={i}>
            <div className="stack__track">
              {tools.map((tool) => (
                <Pill key={tool.name} tool={tool} />
              ))}
              {tools.map((tool) => (
                <Pill key={`${tool.name}-clone`} tool={tool} clone />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
