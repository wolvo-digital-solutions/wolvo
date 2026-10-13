import type { RefObject } from 'react';
import { gsap, MQ, useGSAP } from '@/animations/gsap';
import { initReveals } from '@/animations/reveal';
import { scheduleMotion } from '@/animations/scheduler';

export interface MotionContext {
  scope: HTMLElement;
  isDesktop: boolean;
  isFinePointer: boolean;
}

type Cleanup = void | (() => void);

interface SectionMotionOptions {
  /** Wire up declarative `data-reveal` entrances (default true). */
  reveals?: boolean;
  /**
   * One-shot entrance choreography. Runs once per page view (whenever motion is
   * allowed), independent of viewport size, so resizing across a breakpoint
   * never restarts it.
   */
  intro?: (scope: HTMLElement) => Cleanup;
  /**
   * Set up after first paint when the section starts below the fold (default
   * true). Sections already in or near the viewport always set up immediately,
   * so their initial animation state is in place before they are seen.
   */
  defer?: boolean;
}

/** How far below the viewport (in viewport heights) a section still counts as "near". */
const NEAR_VIEWPORT = 1.25;

/**
 * Standard animation entry point for a section.
 *
 * - `intro` and `data-reveal` entrances depend only on the reduced-motion
 *   preference.
 * - `setup` (scroll scrubs, pinning, pointer effects) re-runs when the desktop
 *   or fine-pointer breakpoints change, because those effects are layout-specific.
 *
 * Everything is created inside the component's GSAP context (deferred work via
 * `contextSafe`), so useGSAP reverts every tween, SplitText and ScrollTrigger
 * on unmount, and matchMedia reverts on breakpoint changes.
 */
export function useSectionMotion(
  scope: RefObject<HTMLElement | null>,
  setup?: (ctx: MotionContext) => Cleanup,
  { reveals = true, intro, defer = true }: SectionMotionOptions = {},
) {
  useGSAP(
    (_context, contextSafe) => {
      const el = scope.current;
      if (!el) return;

      const init = () => {
        const mm = gsap.matchMedia();

        if (reveals || intro) {
          mm.add(MQ.motion, (_ctx, safe) => {
            const disarm = reveals ? initReveals(el, safe) : undefined;
            const outro = intro?.(el);
            return () => {
              disarm?.();
              outro?.();
            };
          });
        }

        if (setup) {
          mm.add({ motion: MQ.motion, desktop: MQ.desktop, fine: MQ.fine }, (context) => {
            const { motion, desktop, fine } = context.conditions as Record<'motion' | 'desktop' | 'fine', boolean>;
            if (!motion) return;
            return setup({ scope: el, isDesktop: desktop, isFinePointer: fine });
          });
        }
      };

      if (!defer || el.getBoundingClientRect().top < window.innerHeight * NEAR_VIEWPORT) {
        init();
        return;
      }
      return scheduleMotion(contextSafe!(init) as () => void);
    },
    { scope },
  );
}
