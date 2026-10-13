import { useEffect, useRef, useState } from 'react';
import { Mail, Menu, Share2, X } from 'lucide-react';
import { gsap, MQ, ScrollTrigger, useGSAP } from '@/animations/gsap';
import { lockScroll, prefersReducedMotion, unlockScroll } from '@/animations/smoothScroll';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useUI } from '@/context/UIContext';
import { primaryNav, sectionIds } from '@/data/navigation';
import { site, socialLinks } from '@/data/site';
import { padNumber } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { SocialIcon, SocialList } from '@/components/ui/SocialIcon';
import { StatusPill } from '@/components/ui/StatusPill';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import './Navbar.css';

export function Navbar() {
  const headerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuTl = useRef<gsap.core.Timeline | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(sectionIds);
  const { openContact, openGitHubShare } = useUI();

  useGSAP(
    () => {
      const header = headerRef.current!;
      const panel = panelRef.current!;

      // Scrolled state — background, blur and border fade in after the first scroll.
      const setScrolled = (y: number) => header.classList.toggle('is-scrolled', y > 32);
      setScrolled(window.scrollY);
      ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => setScrolled(self.scroll()) });

      // Mobile menu timeline (played / reversed on toggle).
      gsap.set(panel, { autoAlpha: 0 });
      menuTl.current = gsap
        .timeline({ paused: true, defaults: { ease: 'power3.out' } })
        .to(panel, { autoAlpha: 1, duration: 0.35 })
        .fromTo(panel.querySelector('.mobile-menu__glow'), { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9 }, 0)
        .fromTo(
          panel.querySelectorAll('[data-menu-item]'),
          { y: 36, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.055 },
          0.08,
        );

      // Load sequence: logo → links → CTA.
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap
          .timeline({ delay: 0.15 })
          .from('.nav__logo', { y: -12, opacity: 0, duration: 0.7 })
          .from('.nav__links li', { y: -10, opacity: 0, duration: 0.6, stagger: 0.06 }, '-=0.45')
          .from('.nav__actions > *', { y: -10, opacity: 0, duration: 0.6, stagger: 0.08 }, '-=0.45');
      });
    },
    { scope: headerRef },
  );

  // Open / close side effects: animation, scroll lock, inert page, focus.
  useEffect(() => {
    const tl = menuTl.current;
    if (!tl) return;
    const page = [document.getElementById('main'), document.querySelector('footer')].filter(Boolean) as HTMLElement[];

    if (menuOpen) {
      lockScroll();
      page.forEach((el) => (el.inert = true));
      if (prefersReducedMotion()) tl.progress(1);
      else tl.timeScale(1).play();
      // Focus once the panel is visible (autoAlpha flips visibility on the first frame).
      const focusTimer = window.setTimeout(
        () => panelRef.current?.querySelector<HTMLElement>('.mobile-menu__link')?.focus({ preventScroll: true }),
        60,
      );

      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setMenuOpen(false);
          toggleRef.current?.focus();
        }
      };
      const desktop = window.matchMedia(MQ.desktop);
      const onResize = () => desktop.matches && setMenuOpen(false);
      document.addEventListener('keydown', onKey);
      desktop.addEventListener('change', onResize);
      return () => {
        window.clearTimeout(focusTimer);
        document.removeEventListener('keydown', onKey);
        desktop.removeEventListener('change', onResize);
        page.forEach((el) => (el.inert = false));
        unlockScroll();
      };
    }

    if (tl.progress() > 0) {
      if (prefersReducedMotion()) tl.progress(0);
      else tl.timeScale(1.7).reverse();
    }
  }, [menuOpen]);

  const startProject = (source: string) => {
    setMenuOpen(false);
    openContact({ source });
  };

  return (
    <header ref={headerRef} className={`nav${menuOpen ? ' is-menu-open' : ''}`}>
      <div className="nav__bar container">
        <Logo href="#home" className="nav__logo" priority />

        <nav className="nav__primary" aria-label="Primary">
          <ul className="nav__links" role="list">
            {primaryNav.map((item) => {
              const isActive = active === item.href.slice(1);
              return (
                <li key={item.href}>
                  <a href={item.href} className={`nav__link${isActive ? ' is-active' : ''}`} aria-current={isActive ? 'true' : undefined}>
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="nav__actions">
          <button
            type="button"
            className="nav__github-btn"
            onClick={openGitHubShare}
            aria-label="GitHub Repository & Share"
            title="GitHub Repository & Share"
          >
            <SocialIcon platform="github" />
            <span className="nav__github-text">Repo</span>
          </button>
          <ThemeToggle className="nav__theme-toggle" />
          <Button size="sm" magnetic className="nav__cta" onClick={() => startProject('nav')}>
            Start a Project
          </Button>
          <button
            ref={toggleRef}
            type="button"
            className="nav__toggle"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X strokeWidth={1.85} aria-hidden="true" /> : <Menu strokeWidth={1.85} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        ref={panelRef}
        className="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        data-lenis-prevent
      >
        <span className="mobile-menu__glow" aria-hidden="true" />
        <div className="mobile-menu__inner container">
          <nav aria-label="Mobile">
            <ol className="mobile-menu__links" role="list">
              {primaryNav.map((item, i) => {
                const isActive = active === item.href.slice(1);
                return (
                  <li key={item.href} data-menu-item>
                    <a
                      href={item.href}
                      className={`mobile-menu__link${isActive ? ' is-active' : ''}`}
                      aria-current={isActive ? 'true' : undefined}
                      tabIndex={menuOpen ? 0 : -1}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="mobile-menu__index">{padNumber(i + 1, 2)}</span>
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className="mobile-menu__footer">
            <div data-menu-item>
              <Button block size="lg" onClick={() => startProject('mobile-menu')} tabIndex={menuOpen ? 0 : -1}>
                Start a Project
              </Button>
            </div>
            <div className="mobile-menu__meta" data-menu-item>
              <ThemeToggle showLabel className="mobile-menu__theme-toggle" />
              <button
                type="button"
                className="mobile-menu__github-btn"
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => {
                  setMenuOpen(false);
                  openGitHubShare();
                }}
              >
                <SocialIcon platform="github" />
                <span>GitHub Repo &amp; Share</span>
                <Share2 size={15} aria-hidden="true" style={{ marginLeft: 'auto' }} />
              </button>
              <a href={`mailto:${site.email}`} className="mobile-menu__email" tabIndex={menuOpen ? 0 : -1}>
                <Mail strokeWidth={1.85} aria-hidden="true" />
                {site.email}
              </a>
              <StatusPill />
            </div>
            <div data-menu-item>
              <SocialList links={socialLinks} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
