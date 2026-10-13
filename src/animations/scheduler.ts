import { ScrollTrigger } from './gsap';

/**
 * Runs below-the-fold animation setup after the first screen has settled, one
 * section per idle slice, in mount (document) order.
 *
 * Creating tweens and ScrollTriggers alternates style writes with layout reads.
 * Doing it for every section before first paint blocked the main thread, and
 * because the GSAP ticker runs with lagSmoothing(0) (for Lenis) the hero
 * entrance then skipped ahead. Running it *during* the entrance makes the
 * entrance stutter instead. So setup waits until the entrance has played or
 * the visitor first interacts — whichever comes first — and starts right away
 * for deep links. Sections already near the viewport never wait (see
 * useSectionMotion), so nothing visible is ever un-animated.
 */
const queue: Array<() => void> = [];
/** Roughly the hero entrance length. */
const SETTLE_MS = 1600;
const INTERACTIONS = ['scroll', 'wheel', 'touchstart', 'keydown', 'pointerdown'] as const;

let state: 'idle' | 'waiting' | 'draining' = 'idle';
let ready = false;
let settled: Array<() => void> = [];

const idle: (cb: () => void) => void =
  typeof window !== 'undefined' && 'requestIdleCallback' in window
    ? (cb) => window.requestIdleCallback(cb, { timeout: 150 })
    : (cb) => window.setTimeout(cb, 1);

function drain() {
  const task = queue.shift();
  if (task) {
    task();
    idle(drain);
    return;
  }
  state = 'idle';
  // Creation order already matches document order; sorting is cheap insurance for
  // sections that set up early (near the viewport). App refreshes once afterwards.
  ScrollTrigger.sort();
  const waiting = settled;
  settled = [];
  waiting.forEach((resolve) => resolve());
}

function begin() {
  if (state !== 'waiting') return;
  state = 'draining';
  ready = true;
  INTERACTIONS.forEach((type) => window.removeEventListener(type, begin));
  idle(drain);
}

function schedule() {
  if (state !== 'idle' || !queue.length) return;
  if (ready) {
    state = 'draining';
    idle(drain);
    return;
  }
  state = 'waiting';
  INTERACTIONS.forEach((type) => window.addEventListener(type, begin, { passive: true, once: true }));
  // After first paint: deep links need their target's layout now; otherwise let the entrance play.
  requestAnimationFrame(() => requestAnimationFrame(() => (window.location.hash.length > 1 ? begin() : window.setTimeout(begin, SETTLE_MS))));
}

/** Queues `task`; returns a canceller (e.g. for unmount before it ran). */
export function scheduleMotion(task: () => void): () => void {
  let cancelled = false;
  queue.push(() => {
    if (!cancelled) task();
  });
  schedule();
  return () => {
    cancelled = true;
  };
}

/** Resolves once every queued section has been set up (immediately if none are pending). */
export function whenMotionSettled(): Promise<void> {
  if (state === 'idle' && !queue.length) return Promise.resolve();
  return new Promise((resolve) => settled.push(resolve));
}
