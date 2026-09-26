import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Generic section reveal: [data-reveal] fades up, [data-stagger] children cascade, [data-img] clip reveal.
export function revealSection(root) {
  if (prefersReducedMotion()) return
  const heads = root.querySelectorAll('[data-reveal]')
  if (heads.length)
    gsap.from(heads, {
      y: 28, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1, clearProps: 'transform,opacity',
      scrollTrigger: { trigger: root, start: 'top 80%', once: true },
    })
  root.querySelectorAll('[data-stagger]').forEach((group) => {
    gsap.from(group.children, {
      y: 36, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08, clearProps: 'transform,opacity',
      scrollTrigger: { trigger: group, start: 'top 88%', once: true },
    })
  })
  // Clip the frame, scale only the inner <img> so nothing spills outside its box.
  root.querySelectorAll('[data-img]').forEach((frame) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: frame, start: 'top 85%', once: true } })
    tl.fromTo(frame, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power3.inOut', clearProps: 'clipPath' })
    const img = frame.querySelector('img')
    if (img) tl.fromTo(img, { scale: 1.08 }, { scale: 1, duration: 1.4, ease: 'power3.out', clearProps: 'transform' }, 0)
  })
}

// Lazy images and web fonts change layout after first paint; recompute trigger positions once they settle.
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh())
  document.fonts?.ready.then(() => ScrollTrigger.refresh())
}

export { gsap, ScrollTrigger }
