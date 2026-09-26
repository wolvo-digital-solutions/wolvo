import { useRef } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import useReveal from '../animations/useReveal'
import PortfolioCard from './PortfolioCard'
import { portfolio } from '../data/content'

export default function Portfolio() {
  const ref = useReveal()
  const track = useRef(null)
  const scroll = (dir) => {
    const el = track.current
    el.scrollBy({ left: dir * (el.firstElementChild.offsetWidth + 12), behavior: 'smooth' })
  }
  return (
    <section className="section portfolio dark" id="portfolio" ref={ref}>
      <div className="container">
        <div className="section-head">
          <div>
            <p className="kicker" data-reveal>Our Portfolio</p>
            <h2 data-reveal>Selected Work</h2>
          </div>
          <a href="#portfolio" className="link" data-reveal>View All Projects <ArrowRight size={13} /></a>
        </div>
        <div className="work-wrap">
          <button className="work-arrow prev" aria-label="Previous project" onClick={() => scroll(-1)}><ArrowLeft size={14} /></button>
          <div className="work-track" ref={track} data-stagger>
            {portfolio.map((p) => <PortfolioCard key={p.name} {...p} />)}
          </div>
          <button className="work-arrow next" aria-label="Next project" onClick={() => scroll(1)}><ArrowRight size={14} /></button>
        </div>
      </div>
    </section>
  )
}
