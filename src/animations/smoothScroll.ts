import Lenis from 'lenis';
import { gsap, MQ, ScrollTrigger } from './gsap';

let lenis: Lenis | null = null;
let lockCount = 0;
/** Scroll requested while the page was locked (e.g. a mobile-menu link); runs on unlock. */
let pendingScroll: (() => void) | null = null;

/**
 * Starts Lenis smooth scrolling, driven by the GSAP ticker so ScrollTrigger
 * stays perfectly in sync. Skipped entirely for reduced-motion users.
 */
export function initSmoothScroll(): () => void {
  if (window.matchMedia(MQ.reduce).matches) return () => {};

  lenis = new Lenis({
    duration: 1.05,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    autoRaf: false,
  });
  lenis.on('scroll', ScrollTrigger.update);

  const tick = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
}

/**
 * Scrolls to an in-page section, then moves keyboard focus to it so screen
 * reader and keyboard users land in the right place.
 */
export function scrollToSection(hash: string, { updateHash = true } = {}) {
  if (lockCount > 0) {
    pendingScroll = () => scrollToSection(hash, { updateHash });
    return;
  }
  const id = hash.replace(/^#/, '');
  const target = document.getElementById(id);
  if (!target) return;

  // Deferred so the page is no longer inert (e.g. right after closing the mobile menu).
  const done = () =>
    window.setTimeout(() => {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }, 80);

  if (updateHash) history.replaceState(null, '', `#${id}`);

  if (id === 'home') {
    if (lenis) lenis.scrollTo(0, { force: true, onComplete: done });
    else {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      done();
    }
    return;
  }

  if (lenis) {
    // Lenis honours the root's scroll-padding-top (the nav height), like native scrollIntoView.
    lenis.scrollTo(target, { duration: 1.2, force: true, onComplete: done });
  } else {
    target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    done();
  }
}

/** Jumps instantly to a scroll position (used to reveal focused rail cards). */
export function jumpTo(y: number) {
  if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
  else window.scrollTo({ top: y, behavior: 'auto' });
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia(MQ.reduce).matches;
}

/** Ref-counted page scroll lock shared by dialogs and the mobile menu. */
export function lockScroll() {
  if (lockCount++ === 0) {
    lenis?.stop();
    document.documentElement.classList.add('is-scroll-locked');
  }
}

export function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.documentElement.classList.remove('is-scroll-locked');
    lenis?.start();
    if (pendingScroll) {
      const run = pendingScroll;
      pendingScroll = null;
      requestAnimationFrame(run);
    }
  }
}
