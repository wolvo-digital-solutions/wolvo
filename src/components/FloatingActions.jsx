import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Phone, ArrowUp } from 'lucide-react'

const PHONE = '+919876543210'

function WhatsAppIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1s-.5-.1-.7.1-.8 1-.9 1.2-.3.2-.6.1a8.2 8.2 0 01-2.4-1.5 9 9 0 01-1.7-2.1c-.2-.3 0-.5.1-.6l.4-.5.3-.5a.6.6 0 000-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.1 1.1 0 00-.8.4 3.4 3.4 0 00-1.1 2.5 5.9 5.9 0 001.2 3.1 13.5 13.5 0 005.2 4.6c.7.3 1.3.5 1.7.6a4.2 4.2 0 001.9.1 3.1 3.1 0 002-1.4 2.5 2.5 0 00.2-1.4c-.1-.2-.3-.3-.6-.4zM12 21.8a9.9 9.9 0 01-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4a9.8 9.8 0 1118.1-5.2A9.8 9.8 0 0112 21.8zm8.4-18.2A11.8 11.8 0 001.6 17.8L0 24l6.3-1.7a11.8 11.8 0 005.7 1.5A11.8 11.8 0 0020.4 3.6z" />
    </svg>
  )
}

const pop = { whileHover: { y: -3, scale: 1.06 }, whileTap: { scale: 0.92 } }

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toTop = () => {
    if (window.__lenis) window.__lenis.scrollTo(0)
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="fab-stack">
      <motion.a {...pop} className="fab fab-wa" href={`https://wa.me/${PHONE.slice(1)}`} target="_blank" rel="noopener noreferrer" aria-label="Chat with WOLVO on WhatsApp">
        <WhatsAppIcon />
        <span className="fab-tip">WhatsApp</span>
      </motion.a>
      <motion.a {...pop} className="fab fab-call" href={`tel:${PHONE}`} aria-label="Call WOLVO">
        <Phone size={19} />
        <span className="fab-tip">Call us</span>
      </motion.a>
      <AnimatePresence>
        {showTop && (
          <motion.button {...pop} key="top" type="button" className="fab fab-top" onClick={toTop} aria-label="Back to top"
            initial={{ opacity: 0, y: 16, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.8 }} transition={{ duration: 0.25 }}>
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
