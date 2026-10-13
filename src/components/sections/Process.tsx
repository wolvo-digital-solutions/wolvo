import { useRef } from 'react';
import { gsap } from '@/animations/gsap';
import { useSectionMotion } from '@/hooks/useSectionMotion';
import { processSteps } from '@/data/about';
import { padNumber } from '@/lib/format';

/**
 * "How we work" — progress line driven by ScrollTrigger; horizontal on desktop,
 * vertical on mobile. Each step's icon "powers on" as the line reaches it.
 */
export function Process() {
  const ref = useRef<HTMLDivElement>(null);

  useSectionMotion(
    ref,
    ({ scope, isDesktop }) => {
      const q = gsap.utils.selector(scope);
      const track = q('.process__track')[0];
      const steps = q('[data-step]');
      const axis = isDesktop ? 'scaleX' : 'scaleY';

      track.classList.add('is-animated');

      gsap.fromTo(
        q('.process__line-fill'),
        { [axis]: 0 },
        {
          [axis]: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: track,
            start: isDesktop ? 'top 72%' : 'top 75%',
            end: isDesktop ? 'bottom 62%' : 'bottom 55%',
            scrub: 0.6,
            onUpdate: (self) => {
              steps.forEach((step, i) => {
                const threshold = (i / Math.max(1, steps.length - 1)) * 0.94 + 0.02;
                step.classList.toggle('is-active', self.progress >= threshold);
              });
            },
          },
        },
      );

      return () => track.classList.remove('is-animated');
    },
    {
      reveals: false,
      intro: (scope) => {
        gsap.from(scope.querySelectorAll('.process__node'), {
          scale: 0.85,
          opacity: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'back.out(1.7)',
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: scope.querySelector('.process__track'), start: 'top 82%', once: true },
        });
      },
    },
  );

  return (
    <div ref={ref} className="process">
      <div className="process__head">
        <h3 className="process__title" data-reveal="lines">
          How we work
        </h3>
        <p className="process__desc" data-reveal="up">
          A simple, transparent process — so you always know what happens next.
        </p>
      </div>

      {/* Shared stroke gradient (user-space units, so straight segments paint too). */}
      <svg className="process__defs" width="0" height="0" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="process-icon-gradient" gradientUnits="userSpaceOnUse" x1="3" y1="3" x2="21" y2="21">
            <stop offset="0" style={{ stopColor: 'var(--process-icon-from)' }} />
            <stop offset="1" style={{ stopColor: 'var(--process-icon-to)' }} />
          </linearGradient>
        </defs>
      </svg>

      <div className="process__track">
        <span className="process__line" aria-hidden="true">
          <span className="process__line-fill" />
        </span>
        <ol className="process__steps" role="list">
          {processSteps.map(({ id, title, description, icon: Icon }, i) => (
            <li key={id} className="process__step" data-step>
              <span className="process__node" aria-hidden="true">
                <Icon className="process__icon" strokeWidth={1.6} color="url(#process-icon-gradient)" />
              </span>
              <span className="process__num">Step {padNumber(i + 1, 2)}</span>
              <h4 className="process__step-title">{title}</h4>
              <p className="process__step-desc">{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
