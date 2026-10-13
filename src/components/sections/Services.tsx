import { useRef } from 'react';
import { gsap } from '@/animations/gsap';
import { useSectionMotion } from '@/hooks/useSectionMotion';
import { useUI } from '@/context/UIContext';
import { services } from '@/data/services';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ServiceCard } from './ServiceCard';
import { Process } from './Process';
import './Services.css';

export function Services() {
  const ref = useRef<HTMLElement>(null);
  const { openContact } = useUI();

  useSectionMotion(
    ref,
    ({ scope, isDesktop, isFinePointer }) => {
      if (isDesktop) {
        // Artwork drifts inside its frame as the card scrolls through (a quiet sense of depth).
        gsap.utils.toArray<HTMLElement>('[data-service-media]', scope).forEach((media) => {
          gsap.fromTo(
            media,
            { yPercent: -4 },
            { yPercent: 4, ease: 'none', scrollTrigger: { trigger: media.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } },
          );
        });
      }
      if (!isFinePointer) return;
      // Pointer-following ambient glow on cards (CSS variables only — no layout work).
      const onMove = (e: PointerEvent) => {
        const card = (e.target as HTMLElement).closest<HTMLElement>('.service-card');
        if (!card) return;
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        card.style.setProperty('--my', `${e.clientY - rect.top}px`);
      };
      scope.addEventListener('pointermove', onMove);
      return () => scope.removeEventListener('pointermove', onMove);
    },
    {
      // Artwork settles into its frame as each card arrives.
      intro: (scope) => {
        gsap.utils.toArray<HTMLElement>('[data-service-media]', scope).forEach((media) => {
          gsap.fromTo(
            media,
            { scale: 1.12, opacity: 0.3 },
            { scale: 1, opacity: 1, duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: media.parentElement, start: 'top 90%', once: true } },
          );
        });
      },
    },
  );

  return (
    <section id="services" ref={ref} className="services section" aria-labelledby="services-title">
      <span className="services__glow" aria-hidden="true" />
      <div className="container">
        <SectionHeading
          id="services-title"
          index="02"
          eyebrow="Services"
          title={
            <>
              What We Do <span className="text-gradient">Best</span>
            </>
          }
          description="From the first line of code to the final cut — six core services, one team and a single point of contact."
          actions={
            <Button variant="secondary" onClick={() => openContact({ source: 'services-heading' })}>
              Discuss your project
            </Button>
          }
        />

        <div className="services__grid" data-reveal="stagger">
          {services.map((service, i) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={i}
              onStart={() => openContact({ service: service.title, source: `service-${service.id}` })}
            />
          ))}
        </div>

        <Process />
      </div>
    </section>
  );
}
