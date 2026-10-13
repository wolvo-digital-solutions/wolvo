import { useEffect, useRef } from 'react';
import { MQ } from '@/animations/gsap';
import './CustomCursor.css';

/** Controls the cursor reacts to. */
const INTERACTIVE = 'a[href], button:not(:disabled), [role="button"], label[for], select, summary, [data-cursor]';
/** Fields that keep the native I-beam (the custom cursor steps aside). */
const TEXT_FIELD =
  'input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="range"]):not([type="color"]), textarea, [contenteditable=""], [contenteditable="true"]';

/** Controls up to this size get hugged by the outline; larger ones get the ring/label states. */
const MAX_HUG = { width: 440, height: 120 };
/** Gap between a hugged control and the outline. */
const HUG_PAD = 6;
/** Resting blob diameter (px). */
const BLOB = 22;
/** Fraction of the remaining distance covered per 60fps frame. */
const FOLLOW = 0.22;
const MORPH = 0.24;

type Mode = 'default' | 'hug' | 'ring' | 'label' | 'text';

interface Shape {
  x: number;
  y: number;
  w: number;
  h: number;
  r: number;
}

/**
 * Wolvo's morphing cursor (mouse only).
 *
 * - A brand-gradient blob trails the pointer and stretches along its direction
 *   of travel (squash & stretch from its velocity).
 * - Over buttons and links it morphs into an outline that hugs the control's
 *   exact box and corner radius, leaning slightly toward the pointer.
 * - Over cards with `data-cursor="View"` it becomes a labelled pill.
 * - A small dot always marks the exact pointer position, so clicks stay precise.
 *
 * One rAF loop animates position/size and stops once everything has settled;
 * pointer moves and scrolling wake it (scrolling can move a hugged control).
 * The system cursor is hidden only while ours is visible, and comes back over
 * text fields and inside modal dialogs (see CustomCursor.css).
 */
export function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const blob = blobRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!root || !blob || !dot || !label) return;

    const fine = window.matchMedia(MQ.fine);
    const motion = window.matchMedia(MQ.motion);
    const html = document.documentElement;

    const pointer = { x: -200, y: -200 };
    const cur: Shape = { x: -200, y: -200, w: BLOB, h: BLOB, r: BLOB / 2 };
    let mode: Mode = 'default';
    let target: HTMLElement | null = null;
    let visible = false;
    let pressed = false;
    let frame = 0;
    let last = 0;

    const goal = (): Shape => {
      if (mode === 'hug' && target?.isConnected) {
        const rect = target.getBoundingClientRect();
        const radius = parseFloat(getComputedStyle(target).borderTopLeftRadius) || 0;
        const w = rect.width + HUG_PAD * 2;
        const h = rect.height + HUG_PAD * 2;
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        return { x: cx + (pointer.x - cx) * 0.1, y: cy + (pointer.y - cy) * 0.1, w, h, r: Math.min(radius + HUG_PAD, h / 2) };
      }
      const size = (mode === 'label' ? 84 : mode === 'ring' ? 56 : BLOB) * (pressed ? 0.82 : 1);
      return { x: pointer.x, y: pointer.y, w: size, h: size, r: size / 2 };
    };

    const render = (now: number) => {
      const dt = last ? Math.min(64, now - last) / 16.667 : 1;
      last = now;
      const g = goal();
      const kPos = 1 - Math.pow(1 - FOLLOW, dt);
      const kSize = 1 - Math.pow(1 - MORPH, dt);
      const vx = (g.x - cur.x) * kPos;
      const vy = (g.y - cur.y) * kPos;
      cur.x += vx;
      cur.y += vy;
      cur.w += (g.w - cur.w) * kSize;
      cur.h += (g.h - cur.h) * kSize;
      cur.r += (g.r - cur.r) * kSize;

      // Squash & stretch along the direction of travel (resting blob only).
      const stretch = mode === 'default' ? Math.min(Math.hypot(vx, vy) / dt / 26, 0.55) : 0;
      const angle = Math.atan2(vy, vx);

      blob.style.width = `${cur.w}px`;
      blob.style.height = `${cur.h}px`;
      blob.style.borderRadius = `${cur.r}px`;
      blob.style.transform =
        `translate3d(${cur.x - cur.w / 2}px, ${cur.y - cur.h / 2}px, 0)` +
        (stretch > 0.01 ? ` rotate(${angle}rad) scale(${1 + stretch}, ${1 - stretch * 0.45}) rotate(${-angle}rad)` : '');
      dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;

      const settled =
        stretch <= 0.01 &&
        Math.abs(g.x - cur.x) < 0.1 &&
        Math.abs(g.y - cur.y) < 0.1 &&
        Math.abs(g.w - cur.w) < 0.1 &&
        Math.abs(g.h - cur.h) < 0.1;
      if (settled) {
        frame = 0;
        last = 0;
      } else {
        frame = requestAnimationFrame(render);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    const setVisible = (next: boolean) => {
      if (visible === next) return;
      visible = next;
      root.classList.toggle('is-visible', next);
      // Hide the system cursor only while ours is on screen.
      html.classList.toggle('has-custom-cursor', next);
      if (!next) {
        cancelAnimationFrame(frame);
        frame = 0;
        last = 0;
      }
    };

    const setMode = (next: Mode, el: HTMLElement | null = null, text = '') => {
      const changed = next !== mode || el !== target || label.textContent !== text;
      target = el;
      if (!changed) return;
      mode = next;
      root.dataset.mode = next;
      label.textContent = text;
      if (visible) schedule();
    };

    const resolve = (el: Element | null) => {
      if (!el) return setMode('default');
      if (el.closest(TEXT_FIELD)) return setMode('text');
      const interactive = el.closest<HTMLElement>(INTERACTIVE);
      if (!interactive) return setMode('default');
      const labelled = interactive.closest<HTMLElement>('[data-cursor]');
      if (labelled?.dataset.cursor) return setMode('label', null, labelled.dataset.cursor);
      const rect = interactive.getBoundingClientRect();
      if (rect.width <= MAX_HUG.width && rect.height <= MAX_HUG.height) return setMode('hug', interactive);
      setMode('ring');
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') {
        setVisible(false);
        return;
      }
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      if (!visible) {
        // Appear in place instead of sweeping in from the last position.
        cur.x = pointer.x;
        cur.y = pointer.y;
        setVisible(true);
      }
      schedule();
    };
    const onOver = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') resolve(e.target as Element | null);
    };
    // Content can scroll under a stationary pointer: re-check what is beneath it.
    const onScroll = () => {
      if (!visible) return;
      resolve(document.elementFromPoint(pointer.x, pointer.y));
      schedule(); // a hugged control may have moved with the page
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      pressed = true;
      root.classList.add('is-pressed');
      schedule();
    };
    const onUp = () => {
      pressed = false;
      root.classList.remove('is-pressed');
      schedule();
    };
    const onLeaveWindow = (e: MouseEvent) => {
      if (!e.relatedTarget) setVisible(false);
    };
    const onBlur = () => setVisible(false);

    let enabled = false;
    const enable = () => {
      if (enabled) return;
      enabled = true;
      window.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerover', onOver, { passive: true });
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('pointerdown', onDown, { passive: true });
      window.addEventListener('pointerup', onUp, { passive: true });
      document.addEventListener('mouseout', onLeaveWindow);
      window.addEventListener('blur', onBlur);
    };
    const disable = () => {
      if (!enabled) return;
      enabled = false;
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('mouseout', onLeaveWindow);
      window.removeEventListener('blur', onBlur);
      setVisible(false);
    };

    // Follow capability changes (mouse plugged in/out, reduced-motion toggled).
    const sync = () => (fine.matches && motion.matches ? enable() : disable());
    sync();
    fine.addEventListener('change', sync);
    motion.addEventListener('change', sync);

    return () => {
      fine.removeEventListener('change', sync);
      motion.removeEventListener('change', sync);
      disable();
    };
  }, []);

  return (
    <div ref={rootRef} className="cursor" data-mode="default" aria-hidden="true">
      <div ref={blobRef} className="cursor__blob">
        <span className="cursor__fill" />
        <span className="cursor__outline" />
        <span ref={labelRef} className="cursor__label" />
      </div>
      <div ref={dotRef} className="cursor__dot" />
    </div>
  );
}
