import { motion } from 'framer-motion'
import { ArrowRight, Lightbulb, ShieldCheck, Network, Headset } from 'lucide-react'
import useReveal from '../animations/useReveal'
import developer from '../assets/img/developer.jpg'

const features = [
  { icon: Lightbulb, title: 'Innovation First', text: 'We turn ideas into impactful products.' },
  { icon: ShieldCheck, title: 'Reliable', text: 'On-time delivery, transparent process.' },
  { icon: Network, title: 'Scalable', text: 'Built to grow with your business.' },
  { icon: Headset, title: 'Customer Focus', text: 'Your success is our success.' },
]

export default function WhyWolvo() {
  const ref = useReveal()
  return (
    <section className="section why dark" ref={ref}>
      <div className="container why-grid">
        <div className="why-img" data-img><img src={developer} alt="Developer working on multiple monitors" loading="lazy" /></div>
        <div className="why-copy">
          <p className="kicker" data-reveal>Why WOLVO</p>
          <h2 data-reveal>Why Choose WOLVO?</h2>
          <p className="muted" data-reveal>We combine technology, creativity and customer focus to deliver solutions that create real value.</p>
          <a href="#about" className="link" data-reveal>Learn More <ArrowRight size={13} /></a>
        </div>
        <div className="why-features" data-stagger>
          {features.map(({ icon: Icon, title, text }) => (
            <div className="why-feature" key={title}>
              <motion.span className="why-icon" whileHover={{ scale: 1.1, rotate: -4 }}><Icon size={18} /></motion.span>
              <div><h3>{title}</h3><p>{text}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
