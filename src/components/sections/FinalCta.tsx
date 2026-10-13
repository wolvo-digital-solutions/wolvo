import { useRef } from 'react';
import { Mail } from 'lucide-react';
import { gsap, ScrollTrigger } from '@/animations/gsap';
import { useSectionMotion } from '@/hooks/useSectionMotion';
import { useUI } from '@/context/UIContext';
import { images } from '@/data/images';
import { site } from '@/data/site';
import { services } from '@/data/services';
import { Button } from '@/components/ui/Button';
import { Picture } from '@/components/ui/Picture';
import { StatusPill } from '@/components/ui/StatusPill';
import './FinalCTA.css';

export function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  const { openContact } = useUI();

  useSectionMotion(
    ref,
    ({ scope }) => {
      const q = gsap.utils.selector(scope);
      const panel = q('.cta__panel')[0];

      // Background reveal: panel opens up as it scrolls into view.
      gsap.fromTo(
        panel,
        { scale: 0.92, '--cta-radius': '56px' },
        { scale: 1, '--cta-radius': '32px', ease: 'none', scrollTrigger: { trigger: panel, start: 'top bottom', end: 'top 35%', scrub: true } },
      );
      gsap.fromTo(
        q('.cta__bg img'),
        { yPercent: 8, scale: 1.15 },
        { yPercent: -4, scale: 1.05, ease: 'none', scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: true } },
      );
    },
    {
      intro: (scope) => {
        const q = gsap.utils.selector(scope);
        // Slow ambient light drift — only while the panel is on screen.
        const drift = gsap
          .timeline({ paused: true })
          .to(q('.cta__glow--a'), { xPercent: 18, yPercent: -12, duration: 9, ease: 'sine.inOut', yoyo: true, repeat: -1 }, 0)
          .to(q('.cta__glow--b'), { xPercent: -20, yPercent: 14, duration: 11, ease: 'sine.inOut', yoyo: true, repeat: -1 }, 0);
        ScrollTrigger.create({
          trigger: q('.cta__panel')[0],
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => (self.isActive ? drift.play() : drift.pause()),
        });
      },
    },
  );

  return (
    <section id="contact" ref={ref} className="cta section" aria-labelledby="cta-title">
      <div className="container">
        <div className="cta__panel theme-dark noise">
          <Picture set={images.ctaWaves} alt="" sizes="(min-width: 1280px) 1280px, 100vw" className="cta__bg" />
          <span className="cta__glow cta__glow--a" aria-hidden="true" />
          <span className="cta__glow cta__glow--b" aria-hidden="true" />
          <span className="cta__grid grid-texture" aria-hidden="true" />

          <div className="cta__content">
            <p className="eyebrow cta__eyebrow" data-reveal="fade">
              <span className="eyebrow__index">07</span>
              <span className="eyebrow__line" aria-hidden="true" />
              Let’s work together
            </p>
            <h2 id="cta-title" className="cta__title" data-reveal="lines">
              Have a Project <span className="text-gradient">in Mind?</span>
            </h2>
            <p className="cta__text lead" data-reveal="up" data-reveal-delay="0.1">
              Tell us about your idea — a website, an app, a campaign or a video. We’ll reply with clear next steps, a realistic
              timeline and an honest quote.
            </p>
            <div className="cta__actions" data-reveal="up" data-reveal-delay="0.2">
              <Button size="lg" magnetic onClick={() => openContact({ source: 'final-cta' })}>
                Start a Project
              </Button>
              <a href={`mailto:${site.email}`} className="cta__email">
                <Mail strokeWidth={1.85} aria-hidden="true" />
                <span>
                  <span className="cta__email-label">Or email us</span>
                  {site.email}
                </span>
              </a>
            </div>
            <div className="cta__meta" data-reveal="fade" data-reveal-delay="0.3">
              <StatusPill />
              <ul className="cta__services" role="list" aria-label="Services">
                {services.map((s) => (
                  <li key={s.id}>{s.shortTitle}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
