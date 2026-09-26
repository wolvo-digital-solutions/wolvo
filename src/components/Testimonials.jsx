import useReveal from '../animations/useReveal'
import TestimonialCard from './TestimonialCard'
import { testimonials } from '../data/content'

export default function Testimonials() {
  const ref = useReveal()
  return (
    <section className="section testimonials light" ref={ref}>
      <div className="container">
        <p className="kicker" data-reveal>Client Testimonials</p>
        <h2 data-reveal>What Our Clients Say</h2>
      </div>
      {/* Rendered twice so the right-to-left loop is seamless. */}
      <div className="t-marquee" data-reveal>
        <div className="t-track">
          {testimonials.map((t) => <TestimonialCard key={t.name} {...t} />)}
          {testimonials.map((t) => <TestimonialCard key={`${t.name}-dup`} {...t} hidden />)}
        </div>
      </div>
    </section>
  )
}
