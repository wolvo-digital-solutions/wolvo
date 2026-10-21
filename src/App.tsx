import { useEffect } from 'react';
import { ScrollTrigger } from '@/animations/gsap';
import { initSmoothScroll, scrollToSection } from '@/animations/smoothScroll';
import { whenMotionSettled } from '@/animations/scheduler';
import { ThemeProvider } from '@/context/ThemeContext';
import { UIProvider } from '@/context/UIContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Services } from '@/components/sections/Services';
import { TechStack } from '@/components/sections/TechStack';
import { Projects } from '@/components/sections/Projects';
import { Articles } from '@/components/sections/Articles';
import { Testimonials } from '@/components/sections/Testimonials';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { DialogRoot } from '@/components/dialogs/DialogRoot';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';

/** Page flow: Navbar → Hero → About → Services → Tech Stack → Projects → Articles → Reviews → Final CTA → Footer. */
export default function App() {
  useEffect(() => initSmoothScroll(), []);

  // In-page anchors: smooth scroll with nav offset and focus management.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      const hash = link?.getAttribute('href');
      if (!hash || hash.length < 2 || !document.getElementById(hash.slice(1))) return;
      e.preventDefault();
      scrollToSection(hash);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // Recalculate scroll positions once web fonts and deferred section motion settle
  // (the pinned project rail changes page height), then honour a deep-linked hash.
  useEffect(() => {
    let cancelled = false;
    Promise.all([document.fonts?.ready, whenMotionSettled()]).then(() => {
      if (cancelled) return;
      ScrollTrigger.refresh();
      const hash = window.location.hash;
      if (hash.length > 1 && document.getElementById(hash.slice(1))) {
        requestAnimationFrame(() => scrollToSection(hash, { updateHash: false }));
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ThemeProvider>
      <UIProvider>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        <main id="main" tabIndex={-1}>
          <Hero />
          <About />
          <Services />
          <TechStack />
          <Projects />
          <Articles />
          <Testimonials />
          <FinalCTA />
        </main>
        <Footer />
        <WhatsAppButton />
        <DialogRoot />
      </UIProvider>
    </ThemeProvider>
  );
}
