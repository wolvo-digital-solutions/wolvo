import { Layers, HeartHandshake, Hourglass, Sparkles } from 'lucide-react'
import useReveal from '../animations/useReveal'
import Button from './Button'
import office from '../assets/img/office.jpg'

const stats = [
  { icon: Layers, value: '5+', label: 'Projects Delivered' },
  { icon: HeartHandshake, value: '3+', label: 'Happy Clients' },
  { icon: Hourglass, value: '2+', label: 'Years of Journey' },
  { icon: Sparkles, value: '∞', label: 'More to Come' },
]

export default function About() {
  const ref = useReveal()
  return (
    <section className="section about dark" id="about" ref={ref}>
      <div className="container about-grid">
        <div className="about-content">
          <div className="about-copy">
            <p className="kicker" data-reveal>About WOLVO</p>
            <h2 data-reveal>We Build Digital<br />Solutions for a<br />Smarter Tomorrow</h2>
            <p className="muted" data-reveal>
              WOLVO is a team of passionate developers, designers, marketers and problem-solvers. We create technology
              and creative digital experiences that simplify complex challenges and drive real business value. With a focus on innovation, quality and
              long-term partnerships, we help businesses turn ideas into products that make an impact.
            </p>
          </div>
          <div className="stats" data-stagger>
            {stats.map(({ icon: Icon, value, label }) => (
              <div className="stat" key={label}>
                <div className="stat-header">
                  <span className="stat-icon"><Icon size={20} /></span>
                  <strong>{value}</strong>
                </div>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="about-img" data-img>
          <img src={office} alt="WOLVO office with the wolf logo on the wall" loading="lazy" />
        </div>
      </div>
    </section>
  )
}
