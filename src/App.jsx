import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from './animations/gsapAnimations'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Products from './components/Products'
import WhyWolvo from './components/WhyWolvo'
import Technologies from './components/Technologies'
import Founders from './components/Founders'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import FloatingActions from './components/FloatingActions'

export default function App() {
  useEffect(() => {
    if (prefersReducedMotion()) return
    const lenis = new Lenis({ duration: 1.1, anchors: { offset: -64 } })
    window.__lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(tick); lenis.destroy(); delete window.__lenis }
  }, [])

  return (
    <>
      <a href="#main" className="skip">Skip to content</a>
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Services />
        <Products />
        <WhyWolvo />
        <Technologies />
        <Founders />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <FloatingActions />
    </>
  )
}
