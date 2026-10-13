import { useCallback, useEffect, useState, type RefObject } from 'react';

/**
 * Lightweight state for a native scroll-snap carousel: progress (0–1), the
 * nearest item index and prev/next helpers that scroll by one item.
 */
export function useCarousel(trackRef: RefObject<HTMLElement | null>, itemSelector = '[data-carousel-item]') {
  const [progress, setProgress] = useState(0);
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [canScroll, setCanScroll] = useState(false);

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const items = Array.from(track.querySelectorAll<HTMLElement>(itemSelector));
    const max = track.scrollWidth - track.clientWidth;
    setCount(items.length);
    setCanScroll(max > 4);
    setProgress(max > 0 ? Math.min(1, Math.max(0, track.scrollLeft / max)) : 0);

    const origin = track.getBoundingClientRect().left;
    const scrollPad = parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0;
    let nearest = 0;
    let best = Infinity;
    items.forEach((item, i) => {
      const distance = Math.abs(item.getBoundingClientRect().left - origin - scrollPad);
      if (distance < best) {
        best = distance;
        nearest = i;
      }
    });
    setIndex(track.scrollLeft >= max - 4 && max > 0 ? items.length - 1 : nearest);
  }, [trackRef, itemSelector]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    update();
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    const ro = new ResizeObserver(onScroll);
    ro.observe(track);
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener('scroll', onScroll);
      ro.disconnect();
    };
  }, [trackRef, update]);

  const go = useCallback(
    (direction: 1 | -1) => {
      const track = trackRef.current;
      if (!track) return;
      const item = track.querySelector<HTMLElement>(itemSelector);
      const gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0;
      const step = item ? item.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      track.scrollBy({ left: direction * step, behavior: reduce ? 'auto' : 'smooth' });
    },
    [trackRef, itemSelector],
  );

  return {
    progress,
    index,
    count,
    canScroll,
    atStart: progress <= 0.01,
    atEnd: progress >= 0.99,
    prev: () => go(-1),
    next: () => go(1),
  };
}
