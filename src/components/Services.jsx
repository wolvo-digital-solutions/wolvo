import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import useReveal from '../animations/useReveal'
import ServiceCard from './ServiceCard'
import { services } from '../data/content'

export default function Services() {
  const ref = useReveal()
  const [showAll, setShowAll] = useState(false)
  const displayedServices = showAll ? services : services.slice(0, 5)

  return (
    <section className="section services dark" id="services" ref={ref}>
      <div className="container">
        <div className="section-head">
          <div>
            <p className="kicker" data-reveal>Our Services</p>
            <h2 data-reveal>End-to-End IT &amp; Digital Solutions<br />for Your Business</h2>
          </div>
          <button type="button" onClick={() => setShowAll(!showAll)} className="link" style={{ background: 'transparent', border: 'none', padding: 0 }} data-reveal>
            {showAll ? 'Show Less' : 'View All Services'} <ArrowRight size={13} style={{ transform: showAll ? 'rotate(-90deg)' : 'none', transition: 'transform 0.3s' }} />
          </button>
        </div>
        <div className="services-grid" data-stagger>
          {displayedServices.map((s) => <ServiceCard key={s.title} {...s} />)}
        </div>
      </div>
    </section>
  )
}
