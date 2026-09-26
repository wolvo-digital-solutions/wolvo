import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { Play, Lightbulb, Handshake, TrendingUp } from 'lucide-react'
import { gsap, prefersReducedMotion } from '../animations/gsapAnimations'
import Button from './Button'
import wolf from '../assets/img/wolf-hero.webp'

export default function Hero() {
  const ref = useRef(null)
  useGSAP(() => {
    if (prefersReducedMotion()) return
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.from(document.querySelector('[data-header]'), { y: -30, opacity: 0, duration: 0.8, clearProps: 'transform,opacity' })
      .from('.hero-media', { opacity: 0, scale: 1.12, duration: 2, ease: 'power2.out' }, 0)
      .from('.eyebrow', { y: 14, opacity: 0, duration: 0.6 }, 0.3)
      .from('.hero h1 .line > span', { yPercent: 110, duration: 1, stagger: 0.12 }, 0.45)
      .from('.hero-desc', { y: 20, opacity: 0, duration: 0.8 }, 0.85)
      .from('.hero-actions > *', { y: 20, opacity: 0, duration: 0.7, stagger: 0.1 }, 1)
      .from('.hero-features li', { y: 16, opacity: 0, duration: 0.6, stagger: 0.1 }, 1.15)
      .from('.hero-tagline', { x: 24, opacity: 0, duration: 0.9 }, 1.1)
    gsap.to('.hero-media img', {
      yPercent: 4, ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
    })
  }, { scope: ref })

  return (
    <section className="hero" id="home" ref={ref}>
      <div className="hero-media" aria-hidden="true">
        <img src={wolf} alt="" fetchPriority="high" />
      </div>
      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">Technology / Innovation / Impact</p>
          <h1>
            <span className="line"><span>From Ideas to</span></span>
            <span className="line"><span>Impactful <em>Solutions</em></span></span>
          </h1>
          <p className="hero-desc">
            WOLVO is a modern IT solutions company, building scalable software, mobile apps and digital products
            that help businesses grow, adapt and lead in a rapidly changing world.
          </p>
          <div className="hero-actions">
            <Button href="#services">Explore Our Solutions</Button>
            <Button variant="ghost" arrow={false} href="#about" icon={<span className="play"><Play size={9} fill="currentColor" /></span>}>Watch Video</Button>
          </div>
          <ul className="hero-features">
            <li><span className="fi"><Lightbulb size={15} /></span>Innovative Solutions</li>
            <li><span className="fi"><Handshake size={15} /></span>Trusted Partnership</li>
            <li><span className="fi"><TrendingUp size={15} /></span>Scalable Growth</li>
          </ul>
        </div>
        <p className="hero-tagline">Smart<br />Technology<br />for a Stronger<br />Tomorrow<span /></p>
      </div>
    </section>
  )
}
