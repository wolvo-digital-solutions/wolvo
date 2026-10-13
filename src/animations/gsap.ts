import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

gsap.defaults({ ease: 'power3.out', duration: 0.8 });

ScrollTrigger.config({ ignoreMobileResize: true });

/** Media queries shared by every gsap.matchMedia() block. */
export const MQ = {
  motion: '(prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
  desktop: '(min-width: 1024px)',
  fine: '(hover: hover) and (pointer: fine)',
} as const;

/** Motion timing tokens (seconds) from the design system. */
export const DURATION = {
  micro: 0.2,
  hover: 0.3,
  reveal: 0.8,
  hero: 1.2,
  stagger: 0.1,
} as const;

export { gsap, ScrollTrigger, SplitText, useGSAP };
