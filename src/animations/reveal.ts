import { gsap, ScrollTrigger, SplitText, DURATION } from './gsap';
import { padNumber } from '@/lib/format';

const START = 'top 86%';

interface RevealOptions {
  trigger?: Element;
  delay?: number;
  y?: number;
  stagger?: number;
  start?: string;
  duration?: number;
}

/** Wraps a callback so GSAP objects it creates later still belong to the current context. */
export type ContextSafe = gsap.ContextSafeFunc;

/**
 * Section heading reveal: masked line-by-line rise using SplitText.
 *
 * Splitting measures every word (a forced layout per heading), and autoSplit
 * re-splits once web fonts load — doing that for every heading up front blocked
 * first paint. Each heading is now split only when it approaches the viewport.
 * `contextSafe` keeps the late-created SplitText and tween in the section's GSAP
 * context, so they are still reverted on unmount / breakpoint changes.
 */
export function revealLines(el: HTMLElement, { delay = 0, start = START }: RevealOptions = {}, contextSafe?: ContextSafe) {
  // Hidden until split by `.reveal-armed [data-reveal='lines']` (base.css) — a class on the
  // section, not a per-heading gsap.set, so arming costs no computed-style reads.
  const split = () => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit(self) {
        el.classList.add('is-split');
        // Returned so autoSplit carries the animation's progress over when it re-splits.
        return gsap.from(self.lines, { yPercent: 110, opacity: 0, duration: 1, stagger: 0.09, delay, ease: 'power4.out' });
      },
    });
  };
  return ScrollTrigger.create({
    trigger: el,
    start,
    once: true,
    onEnter: (contextSafe ? contextSafe(split) : split) as () => void,
  });
}

/** Opacity + translateY entrance. */
export function revealUp(targets: gsap.TweenTarget, opts: RevealOptions = {}) {
  const { trigger, delay = 0, y = 40, stagger = 0, start = START, duration = DURATION.reveal } = opts;
  // Explicit end values + CSS transitions suspended: GSAP never reads a mid-transition
  // transform (e.g. a card's hover lift), so elements always land exactly in place.
  return gsap.fromTo(
    targets,
    { y, opacity: 0, transition: 'none' },
    {
      y: 0,
      opacity: 1,
      duration,
      delay,
      stagger,
      // Hand transforms back to CSS afterwards so hover states keep working.
      clearProps: 'transform,opacity,transition',
      scrollTrigger: trigger ? { trigger, start, once: true } : undefined,
    },
  );
}

/** Image mask reveal: clip-path wipes upward while the inner image settles. */
export function revealClip(el: HTMLElement, { delay = 0, start = 'top 80%' }: RevealOptions = {}) {
  const inner = el.querySelector<HTMLElement>('[data-reveal-inner]');
  const tl = gsap.timeline({ scrollTrigger: { trigger: el, start, once: true }, delay });
  tl.fromTo(
    el,
    { clipPath: 'inset(100% 0% 0% 0% round var(--clip-radius, 0px))' },
    { clipPath: 'inset(0% 0% 0% 0% round var(--clip-radius, 0px))', duration: 1.3, ease: 'power4.inOut' },
  );
  if (inner) tl.from(inner, { scale: 1.18, duration: 1.6, ease: 'power3.out' }, 0);
  return tl;
}

/** Counts a number up from zero when it enters the viewport. */
export function countUp(el: HTMLElement, end: number, { pad = 0, suffix = '' } = {}) {
  const state = { value: 0 };
  el.textContent = `${padNumber(0, pad)}${suffix}`;
  return gsap.to(state, {
    value: end,
    duration: 1.6,
    ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    onUpdate: () => {
      el.textContent = `${padNumber(Math.round(state.value), pad)}${suffix}`;
    },
  });
}

/**
 * Wires up declarative reveals inside a section:
 *  data-reveal="lines" | "up" | "fade" | "stagger" | "clip"
 *  data-reveal-delay="0.2"
 * Stagger groups animate their [data-reveal-item] children (or direct children).
 */
export function initReveals(scope: Element, contextSafe?: ContextSafe): () => void {
  scope.classList.add('reveal-armed');
  scope.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    const type = el.dataset.reveal;
    const delay = Number(el.dataset.revealDelay ?? 0);

    switch (type) {
      case 'lines':
        revealLines(el, { delay }, contextSafe);
        break;
      case 'fade':
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 1, delay, scrollTrigger: { trigger: el, start: START, once: true } });
        break;
      case 'stagger': {
        const items = el.querySelectorAll<HTMLElement>('[data-reveal-item]');
        const targets = items.length ? items : el.children;
        revealUp(targets, { trigger: el, delay, stagger: DURATION.stagger, y: 36 });
        break;
      }
      case 'clip':
        revealClip(el, { delay });
        break;
      default:
        revealUp(el, { trigger: el, delay });
    }
  });

  return () => {
    scope.classList.remove('reveal-armed');
    scope.querySelectorAll('.is-split').forEach((el) => el.classList.remove('is-split'));
  };
}
