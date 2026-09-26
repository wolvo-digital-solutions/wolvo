import useReveal from '../animations/useReveal'
import TechnologyCard from './TechnologyCard'
import { technologies } from '../data/content'

export default function Technologies() {
  const ref = useReveal()
  return (
    <section className="section tech light" id="technology" ref={ref}>
      <div className="container">
        <div className="section-head">
          <div>
            <p className="kicker" data-reveal>Technology</p>
            <h2 data-reveal>Technologies We Work With</h2>
          </div>
          <div className="tech-aside" data-reveal>
            <p className="muted">We use modern and reliable technologies to build scalable, secure and high-performance solutions.</p>
          </div>
        </div>
      </div>
      {/* The list is rendered twice so the left-to-right loop is seamless. */}
      <div className="tech-marquee" data-reveal>
        <div className="tech-track">
          {technologies.map((t) => <TechnologyCard key={t.name} {...t} />)}
          {technologies.map((t) => <TechnologyCard key={`${t.name}-dup`} {...t} hidden />)}
        </div>
      </div>
    </section>
  )
}
