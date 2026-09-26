import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'
import Button from './Button'
import { navLinks } from '../data/content'

export default function Header() {
  const [active, setActive] = useState('home')
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    navLinks.forEach(({ id }) => { const el = document.getElementById(id); if (el) obs.observe(el) })
    return () => { window.removeEventListener('scroll', onScroll); obs.disconnect() }
  }, [])

  return (
    <header className={`header ${scrolled ? 'is-scrolled' : ''}`} data-header>
      <div className="container header-inner">
        <Logo />
        <nav className="nav" aria-label="Main">
          {navLinks.map((l) => (
            <a key={l.id} href={`#${l.id}`} className={active === l.id ? 'active' : ''} aria-current={active === l.id ? 'page' : undefined}>
              {l.label}
              {active === l.id && <motion.span layoutId="nav-ind" className="nav-ind" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
            </a>
          ))}
        </nav>
        <Button href="#contact" className="header-cta">Get Started</Button>
        <button className="burger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav className="mobile-nav" aria-label="Mobile"
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
            {navLinks.map((l, i) => (
              <motion.a key={l.id} href={`#${l.id}`} onClick={() => setOpen(false)} className={active === l.id ? 'active' : ''}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 * i }}>
                {l.label}
              </motion.a>
            ))}
            <Button href="#contact" onClick={() => setOpen(false)}>Get Started</Button>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
