import { useEffect, type RefObject } from 'react';
import { gsap, MQ } from '@/animations/gsap';

/**
 * Desktop-only magnetic pull toward the pointer. Disabled on touch devices
 * and for reduced-motion users.
 */
export function useMagnetic(ref: RefObject<HTMLElement | null>, { strength = 0.32, enabled = true } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const canHover = window.matchMedia(MQ.fine).matches && window.matchMedia(MQ.motion).matches;
    if (!canHover) return;

    const label = el.querySelector<HTMLElement>('[data-magnetic-label]');
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
    const lxTo = label ? gsap.quickTo(label, 'x', { duration: 0.5, ease: 'power3.out' }) : null;
    const lyTo = label ? gsap.quickTo(label, 'y', { duration: 0.5, ease: 'power3.out' }) : null;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      xTo(dx * strength);
      yTo(dy * strength);
      lxTo?.(dx * strength * 0.35);
      lyTo?.(dy * strength * 0.35);
    };
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.45)', overwrite: true });
      if (label) gsap.to(label, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.45)', overwrite: true });
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf([el, label].filter(Boolean));
      gsap.set([el, label].filter(Boolean), { clearProps: 'transform' });
    };
  }, [ref, strength, enabled]);
}
