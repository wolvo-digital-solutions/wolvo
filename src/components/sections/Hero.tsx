import { useRef } from 'react';
import { Clapperboard, Code2, TrendingUp } from 'lucide-react';
import { gsap, ScrollTrigger } from '@/animations/gsap';
import { useSectionMotion } from '@/hooks/useSectionMotion';
import { useUI } from '@/context/UIContext';
import { images } from '@/data/images';
import { services } from '@/data/services';
import { Button } from '@/components/ui/Button';
import { Picture } from '@/components/ui/Picture';
import { StatusPill } from '@/components/ui/StatusPill';
import './Hero.css';

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { openContact } = useUI();

  useSectionMotion(
    ref,
    ({ scope, isDesktop, isFinePointer }) => {
      if (!isDesktop) return;
      const q = gsap.utils.selector(scope);

      // Scroll exit: copy rises and fades faster than the visual (depth).
      const exit = { trigger: scope, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to(q('[data-hero-copy]'), { y: -110, opacity: 0, ease: 'none', scrollTrigger: exit });
      gsap.to(q('[data-hero-media]'), { y: 90, ease: 'none', scrollTrigger: exit });

      if (!isFinePointer) return;

      // Mouse parallax on foreground layers (desktop pointer only), via quickTo.
      const layers = q('[data-depth]').map((el) => ({
        depth: Number(el.dataset.depth),
        x: gsap.quickTo(el, 'x', { duration: 1.1, ease: 'power3.out' }),
        y: gsap.quickTo(el, 'y', { duration: 1.1, ease: 'power3.out' }),
      }));
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        layers.forEach((l) => {
          l.x(nx * l.depth * -36);
          l.y(ny * l.depth * -24);
        });
      };
      scope.addEventListener('pointermove', onMove);
      return () => {
        scope.removeEventListener('pointermove', onMove);
        gsap.set(q('[data-depth]'), { clearProps: 'transform' });
      };
    },
    {
      reveals: false,
      // Entrance plays once per page view: eyebrow → headline lines → copy → CTAs → trust row,
      // with the visual scaling in alongside. Never restarted by resizes or re-renders.
      intro: (scope) => {
        const q = gsap.utils.selector(scope);
        // Starts paused and plays on the frame after first paint, so it always runs from its
        // first frame (the ticker uses lagSmoothing(0), so a busy main thread would skip ahead).
        const tl = gsap.timeline({ paused: true, delay: 0.15, defaults: { ease: 'power4.out' } });
        tl
          .from(q('.hero__eyebrow'), { y: 16, opacity: 0, duration: 0.8 })
          .from(q('.hero__line-inner'), { yPercent: 115, duration: 1.25, stagger: 0.12 }, '-=0.55')
          .from(q('.hero__desc'), { y: 24, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.85')
          .from(q('.hero__action'), { y: 20, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }, '-=0.7')
          .from(q('.hero__trust > *'), { y: 14, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' }, '-=0.6')
          .from(q('[data-hero-stage]'), { scale: 0.96, opacity: 0, duration: 1.4, ease: 'power3.out', clearProps: 'transform' }, 0.05)
          .from(q('.hero-badge__inner'), { y: 26, opacity: 0, scale: 0.92, duration: 0.9, stagger: 0.14, ease: 'back.out(1.6)', clearProps: 'transform' }, 1)
          .from(q('.hero__scroll'), { opacity: 0, duration: 0.8 }, '-=0.4')
          // Ambient float is a CSS animation on `translate` (compositor-only, separate from GSAP's transform).
          .add(() => scope.classList.add('is-floating'));
        let frame = requestAnimationFrame(() => (frame = requestAnimationFrame(() => tl.play())));

        // Pause ambient motion whenever the hero is off-screen.
        ScrollTrigger.create({
          trigger: scope,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => scope.classList.toggle('is-idle', !self.isActive),
        });

        return () => {
          cancelAnimationFrame(frame);
          scope.classList.remove('is-floating', 'is-idle');
        };
      },
    },
  );

  return (
    <section id="home" ref={ref} className="hero theme-dark" aria-labelledby="hero-title">
      <div className="hero__bg" aria-hidden="true">
        <span className="hero__glow hero__glow--a" />
        <span className="hero__glow hero__glow--b" />
        <span className="hero__grid grid-texture" />
      </div>

      <div className="hero__content container">
        <div className="hero__copy" data-hero-copy>
          <p className="eyebrow hero__eyebrow">
            <span className="eyebrow__line" aria-hidden="true" />
            Freelance Digital Agency
          </p>
          <h1 id="hero-title" className="hero__title">
            <span className="hero__line">
              <span className="hero__line-inner">Creative Ideas.</span>
            </span>{' '}
            <span className="hero__line">
              <span className="hero__line-inner">Smart Technology.</span>
            </span>{' '}
            <span className="hero__line">
              <span className="hero__line-inner text-gradient">Real Results.</span>
            </span>
          </h1>
          <p className="hero__desc lead">
            Wolvo helps brands build websites, mobile apps, digital campaigns and engaging content — designed, built and launched by
            one flexible freelance team.
          </p>
          <div className="hero__actions">
            <div className="hero__action">
              <Button size="lg" magnetic onClick={() => openContact({ source: 'hero' })}>
                Start a Project
              </Button>
            </div>
            <div className="hero__action">
              <Button size="lg" variant="secondary" href="#projects" icon="arrow-down">
                View Our Work
              </Button>
            </div>
          </div>
          <div className="hero__trust">
            <StatusPill />
            <ul className="hero__services" role="list" aria-label="Core services">
              {services.slice(0, 4).map((s) => (
                <li key={s.id}>{s.title}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="hero__media" data-hero-media>
          <div className="hero__stage" data-hero-stage>
            <div className="hero__image" data-depth="0.35">
              <Picture
                set={images.heroWorkspace}
                priority
                sizes="(min-width: 1024px) 46vw, calc(100vw - 40px)"
                alt="A laptop showing a website build and a smartphone displaying the Wolvo logo on a desk in a blue-lit studio"
              />
              <span className="hero__shade" aria-hidden="true" />
            </div>

            <div className="hero-badge hero-badge--web" data-depth="0.9" aria-hidden="true">
              <div className="hero-badge__inner">
                <span className="hero-badge__icon">
                  <Code2 strokeWidth={1.85} />
                </span>
                <span className="hero-badge__text">
                  <strong>Web &amp; App Development</strong>
                  <span>Design · Build · Launch</span>
                </span>
              </div>
            </div>

            <div className="hero-badge hero-badge--ads" data-depth="1.25" aria-hidden="true">
              <div className="hero-badge__inner">
                <span className="hero-badge__icon">
                  <TrendingUp strokeWidth={1.85} />
                </span>
                <span className="hero-badge__text">
                  <strong>Meta Ads</strong>
                  <svg className="hero-badge__spark" viewBox="0 0 80 22" fill="none">
                    <path d="M1 19 L14 14 L26 16 L40 9 L53 11 L66 5 L79 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="hero-badge hero-badge--video" data-depth="1.1" aria-hidden="true">
              <div className="hero-badge__inner">
                <span className="hero-badge__icon">
                  <Clapperboard strokeWidth={1.85} />
                </span>
                <span className="hero-badge__text">
                  <strong>Video Editing</strong>
                  <span className="hero-badge__timeline">
                    <i />
                    <i />
                    <i />
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero__scroll container">
        <a href="#about" className="hero__scroll-link">
          <span className="hero__scroll-line" aria-hidden="true" />
          Scroll to explore
        </a>
      </div>
    </section>
  );
}
