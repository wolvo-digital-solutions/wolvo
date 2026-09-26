import { ArrowRight } from 'lucide-react'
import useReveal from '../animations/useReveal'
import ServiceCard from './ServiceCard'
import { services } from '../data/content'

export default function Services() {
  const ref = useReveal()
  return (
    <section className="section services dark" id="services" ref={ref}>
      <div className="container">
        <div className="section-head">
          <div>
            <p className="kicker" data-reveal>Our Services</p>
            <h2 data-reveal>End-to-End IT &amp; Digital Solutions<br />for Your Business</h2>
          </div>
          <a href="#services" className="link" data-reveal>View All Services <ArrowRight size={13} /></a>
        </div>
        <div className="services-grid" data-stagger>
          {services.map((s) => <ServiceCard key={s.title} {...s} />)}
        </div>
      </div>
    </section>
  )
}
