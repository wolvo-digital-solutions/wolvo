import { useEffect, useRef } from 'react';
import { site } from '@/data/site';
import { track } from '@/lib/track';
import './WhatsAppButton.css';

/** Scroll distance (px) after which the button appears — keeps the hero CTAs uncluttered. */
const REVEAL_AFTER = 240;
/** Controls the button must never cover; it steps aside while one passes under it. */
const KEEP_CLEAR = '.carousel-controls, [data-float-clear]';

/** Official WhatsApp glyph (speech bubble + handset). */
function WhatsAppIcon() {
  return (
    <svg className="wa-btn__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

export function WhatsAppButton() {
  const ref = useRef<HTMLDivElement>(null);
  const number = site.whatsapp.replace(/[^\d]/g, '');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Appear after the first scroll; step aside while a carousel control is underneath.
    // offsetLeft/Top of a fixed element are viewport-relative and ignore transforms,
    // so this is the button's resting footprint regardless of the footer lift.
    const update = () => {
      el.classList.toggle('is-visible', window.scrollY > REVEAL_AFTER);
      const pad = 8;
      const left = el.offsetLeft - pad;
      const right = el.offsetLeft + el.offsetWidth + pad;
      const top = el.offsetTop - pad;
      const bottom = el.offsetTop + el.offsetHeight + pad;
      const blocked = Array.from(document.querySelectorAll(KEEP_CLEAR)).some((node) => {
        const r = node.getBoundingClientRect();
        return r.width > 0 && r.right > left && r.left < right && r.bottom > top && r.top < bottom;
      });
      el.classList.toggle('is-tucked', blocked);
    };
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Lift above the footer's bottom bar so it never covers "Back to top".
    const bar = document.querySelector('.footer__bottom');
    const observer =
      bar &&
      new IntersectionObserver(
        ([entry]) => el.style.setProperty('--wa-lift', `${entry.isIntersecting ? Math.round(entry.intersectionRect.height) : 0}px`),
        { threshold: Array.from({ length: 21 }, (_, i) => i / 20) },
      );
    if (bar && observer) observer.observe(bar);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      observer?.disconnect();
    };
  }, []);

  if (!number) return null;
  const url = `https://wa.me/${number}?text=${encodeURIComponent(site.whatsappMessage)}`;

  return (
    <div ref={ref} className="wa">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-btn"
        aria-label="Chat with Wolvo on WhatsApp (opens in a new tab)"
        onClick={() => track('whatsapp_click')}
      >
        <span className="wa-btn__label" aria-hidden="true">
          <span className="wa-btn__status" />
          Chat on WhatsApp
        </span>
        <span className="wa-btn__disc">
          <WhatsAppIcon />
        </span>
      </a>
    </div>
  );
}
