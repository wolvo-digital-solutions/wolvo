import { useRef } from 'react';
import { gsap } from '@/animations/gsap';
import { countUp } from '@/animations/reveal';
import { useSectionMotion } from '@/hooks/useSectionMotion';
import { useUI } from '@/context/UIContext';
import { proofPoints, stats } from '@/data/about';
import { founders } from '@/data/founders';
import { images } from '@/data/images';
import { padNumber } from '@/lib/format';
import { LogoMark } from '@/components/ui/Logo';
import { Picture } from '@/components/ui/Picture';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FounderCard } from './FounderCard';
import './About.css';

export function About() {
  const ref = useRef<HTMLElement>(null);
  const { openContact } = useUI();

  useSectionMotion(
    ref,
    ({ scope }) => {
      const q = gsap.utils.selector(scope);

      // Image parallax inside the masked visual.
      gsap.fromTo(
        q('.about__visual-parallax'),
        { yPercent: -4.5 },
        { yPercent: 4.5, ease: 'none', scrollTrigger: { trigger: q('.about__visual')[0], start: 'top bottom', end: 'bottom top', scrub: true } },
      );

      // Founder photos settle as they scroll through.
      q('[data-founder] .founder-card__media > *').forEach((img) => {
        gsap.fromTo(img, { scale: 1.12 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom 40%', scrub: true } });
      });
    },
    {
      intro: (scope) => {
        const q = gsap.utils.selector(scope);
        const isTwoCol = window.matchMedia('(min-width: 1180px)').matches;

        // Stats count upward on entry.
        q('[data-count]').forEach((el) => {
          countUp(el, Number(el.dataset.count), { pad: Number(el.dataset.pad ?? 0), suffix: el.dataset.suffix ?? '' });
        });

        // Studio caption rises into place after the photo is revealed.
        const card = q('.about-card')[0];
        gsap.fromTo(
          card,
          { y: 32, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, delay: 0.5, clearProps: 'transform', scrollTrigger: { trigger: card, start: 'top 92%', once: true } },
        );

        // Founders reveal from opposite directions on desktop; connecting line draws between them.
        const founders = q('.about__founders')[0];
        q('[data-founder]').forEach((el, i) => {
          gsap.from(el, {
            x: isTwoCol ? (i % 2 ? 70 : -70) : 0,
            y: isTwoCol ? 0 : 40,
            opacity: 0,
            duration: 1,
            delay: i * 0.12,
            clearProps: 'transform,opacity',
            scrollTrigger: { trigger: founders, start: 'top 82%', once: true },
          });
        });
        gsap.from(q('.about__founders-line'), {
          scaleX: 0,
          duration: 1.4,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: founders, start: 'top 75%', once: true },
        });
      },
    },
  );

  return (
    <section id="about" ref={ref} className="about section" aria-labelledby="about-title">
      <div className="container">
        <SectionHeading
          id="about-title"
          index="01"
          eyebrow="About Wolvo"
          title={
            <>
              We turn bold ideas into <span className="text-muted">digital products that perform.</span>
            </>
          }
          description="Wolvo is a modern freelance digital agency. We bring design, development, marketing and content together in one flexible team — so every part of your digital presence works as one."
        />

        <div className="about__body">
          <figure className="about__visual" data-reveal="clip">
            <div className="about__visual-media" data-reveal-inner>
              <div className="about__visual-parallax">
                <Picture
                  set={images.aboutOffice}
                  alt="The Wolvo studio: a shared workspace with laptops, the illuminated Wolvo logo on the wall and a whiteboard reading “Big Dreams, Small Team, Real Impact”"
                  sizes="(min-width: 1024px) 42vw, 100vw"
                />
              </div>
            </div>
            <div className="about-card theme-dark" aria-hidden="true">
              <LogoMark className="about-card__mark" />
              <div>
                <p className="about-card__label">Inside the Wolvo studio</p>
                <p className="about-card__title">
                  Design. Develop. <span className="text-gradient">Grow.</span>
                </p>
              </div>
            </div>
          </figure>

          <div className="about__content">
            <p className="about__intro" data-reveal="up">
              No layers of account managers. No templates. Just a focused team of specialists who care about your goals as much as you
              do.
            </p>
            <p className="about__text" data-reveal="up" data-reveal-delay="0.1">
              We work with you directly from the first call to launch day and beyond — keeping communication clear, iterating fast and
              building custom solutions around what your business actually needs.
            </p>

            <ul className="about__points" role="list" data-reveal="stagger">
              {proofPoints.map(({ title, description, icon: Icon }) => (
                <li key={title} className="about__point" data-reveal-item>
                  <span className="about__point-icon" aria-hidden="true">
                    <Icon strokeWidth={1.85} />
                  </span>
                  <div>
                    <h3 className="about__point-title">{title}</h3>
                    <p className="about__point-desc">{description}</p>
                  </div>
                </li>
              ))}
            </ul>

            <button type="button" className="link-arrow about__cta" onClick={() => openContact({ source: 'about' })} data-reveal="up">
              Tell us about your project
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <dl className="about__stats" data-reveal="stagger">
          {stats.map((stat) => (
            <div className="stat" key={stat.label} data-reveal-item>
              <dt className="stat__label">{stat.label}</dt>
              <dd className="stat__value" data-count={stat.value} data-pad={stat.pad ?? 0} data-suffix={stat.suffix ?? ''}>
                {padNumber(stat.value, stat.pad)}
                {stat.suffix}
              </dd>
            </div>
          ))}
        </dl>

        <div className="about__team">
          <div className="about__team-head">
            <p className="eyebrow" data-reveal="fade">
              <span className="eyebrow__line" aria-hidden="true" />
              Founders
            </p>
            <h3 className="about__team-title" data-reveal="lines">
              The people behind Wolvo
            </h3>
            <p className="about__team-desc" data-reveal="up">
              A founding team that stays hands-on — the people you talk to are the people doing the work.
            </p>
          </div>
          <div className="about__founders">
            <span className="about__founders-line" aria-hidden="true" />
            {founders.map((founder) => (
              <FounderCard key={founder.id} founder={founder} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
