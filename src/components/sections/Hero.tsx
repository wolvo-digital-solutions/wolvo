import { useRef } from 'react';
import { gsap } from '@/animations/gsap';
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
          .from(q('.hero__scroll'), { opacity: 0, duration: 0.8 }, '-=0.4');
        let frame = requestAnimationFrame(() => (frame = requestAnimationFrame(() => tl.play())));

        return () => {
          cancelAnimationFrame(frame);
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
      </div>

      <div className="hero__media" data-hero-media>
        <div className="hero__stage" data-hero-stage>
          <div className="hero__image" data-depth="0.35">
            <Picture
              set={images.heroWorkspace}
              priority
              sizes="100vw"
              alt="A laptop showing a website build and a smartphone displaying the Wolvo logo on a desk in a blue-lit studio"
            />
            <span className="hero__shade" aria-hidden="true" />
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
