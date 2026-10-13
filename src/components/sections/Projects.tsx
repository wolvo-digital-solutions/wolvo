import { useRef, type FocusEvent } from 'react';
import { gsap, ScrollTrigger } from '@/animations/gsap';
import { jumpTo } from '@/animations/smoothScroll';
import { useSectionMotion } from '@/hooks/useSectionMotion';
import { useCarousel } from '@/hooks/useCarousel';
import { useUI } from '@/context/UIContext';
import { featuredProjects, projects } from '@/data/projects';
import { padNumber } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { CarouselControls } from '@/components/ui/CarouselControls';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProjectCard } from './ProjectCard';
import './Projects.css';

interface RailState {
  st: ScrollTrigger;
  distance: () => number;
}

export function Projects() {
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const rail = useRef<RailState | null>(null);
  const { openProject, openProjectsIndex, openContact } = useUI();
  const carousel = useCarousel(trackRef);
  const total = featuredProjects.length;

  useSectionMotion(
    ref,
    ({ isDesktop }) => {
      if (!isDesktop) return;
      const stage = stageRef.current!;
      const track = trackRef.current!;
      const cards = gsap.utils.toArray<HTMLElement>('[data-project-card]', track);

      // Desktop: pin the stage and translate the rail horizontally with scroll.
      stage.classList.add('is-pinned');
      const distance = () => Math.max(0, track.scrollWidth - stage.clientWidth);

      const railTween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 1,
          onUpdate: (self) => {
            if (barRef.current) barRef.current.style.transform = `scaleX(${Math.max(0.04, self.progress)})`;
            if (counterRef.current) {
              const current = Math.min(total, Math.floor(self.progress * total) + 1);
              counterRef.current.textContent = padNumber(current, 2);
            }
          },
        },
      });
      rail.current = { st: railTween.scrollTrigger!, distance };

      // Image drift inside each card, synced to the rail.
      cards.forEach((card) => {
        const inner = card.querySelector('[data-parallax]');
        if (!inner) return;
        gsap.fromTo(
          inner,
          { xPercent: -4, scale: 1.1 },
          {
            xPercent: 4,
            scale: 1.1,
            ease: 'none',
            scrollTrigger: { trigger: card, containerAnimation: railTween, start: 'left right', end: 'right left', scrub: true },
          },
        );
      });

      // A pin re-created after a breakpoint change must be calculated before the triggers below it.
      ScrollTrigger.sort();

      return () => {
        stage.classList.remove('is-pinned');
        rail.current = null;
      };
    },
    {
      // Cards rise into place once as the section arrives (any layout).
      intro: () => {
        const track = trackRef.current!;
        gsap.from([...gsap.utils.toArray<HTMLElement>('[data-project-card]', track), track.querySelector('.projects__end')], {
          y: 60,
          opacity: 0,
          duration: 1,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: stageRef.current, start: 'top 85%', once: true },
        });
      },
    },
  );

  // Keyboard users: bring the focused card into view inside the pinned rail.
  const handleFocus = (e: FocusEvent<HTMLElement>) => {
    const state = rail.current;
    const stage = stageRef.current;
    if (!state || !stage) return;
    // Keyboard focus only: a mouse press also focuses the card's button, and jumping the
    // rail between pointerdown and pointerup moved the card away so the click never fired.
    if (!(e.target as HTMLElement).matches(':focus-visible')) return;
    const card = e.currentTarget;
    const dist = state.distance();
    if (dist <= 0) return;
    const target = Math.min(dist, Math.max(0, card.offsetLeft - (stage.clientWidth - card.offsetWidth) / 2));
    jumpTo(state.st.start + (target / dist) * (state.st.end - state.st.start));
  };

  return (
    <section id="projects" ref={ref} className="projects section" aria-labelledby="projects-title">
      <div className="container">
        <SectionHeading
          id="projects-title"
          index="04"
          eyebrow="Our Work"
          title={
            <>
              Featured <span className="text-muted">Projects</span>
            </>
          }
          description="A selection of the websites, apps, campaigns and content we design and build — each one shaped around a clear business goal."
          actions={
            <Button variant="secondary" onClick={openProjectsIndex}>
              View All Projects
            </Button>
          }
        />
      </div>

      <div ref={stageRef} className="projects__stage">
        <div ref={trackRef} className="projects__track" role="list" aria-label="Featured projects">
          {featuredProjects.map((project, i) => (
            <div role="listitem" key={project.id} className="projects__item">
              <ProjectCard project={project} index={i} onOpen={openProject} onFocus={handleFocus} />
            </div>
          ))}
          <div role="listitem" className="projects__item">
            <div className="projects__end" onFocus={handleFocus}>
              <span className="projects__end-count" aria-hidden="true">
                {padNumber(projects.length, 2)}
              </span>
              <h3 className="projects__end-title">Explore the full portfolio</h3>
              <p className="projects__end-text">Browse every website, app, campaign and video — filtered by the work you need.</p>
              <div className="projects__end-actions">
                <Button onClick={openProjectsIndex}>View All Projects</Button>
                <Button variant="ghost" icon="none" onClick={() => openContact({ source: 'projects-end' })}>
                  Start a project
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="projects__meta container">
          <div className="projects__rail-meta" aria-hidden="true">
            <span className="projects__counter">
              <span ref={counterRef}>01</span> / {padNumber(total, 2)}
            </span>
            <span className="projects__progress">
              <span ref={barRef} />
            </span>
            <span className="projects__hint">Scroll to explore</span>
          </div>
          {carousel.canScroll && (
            <CarouselControls
              className="projects__controls"
              label="project"
              index={carousel.index}
              count={carousel.count}
              progress={carousel.progress}
              atStart={carousel.atStart}
              atEnd={carousel.atEnd}
              onPrev={carousel.prev}
              onNext={carousel.next}
            />
          )}
        </div>
      </div>
    </section>
  );
}
