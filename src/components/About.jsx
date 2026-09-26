import { FolderKanban, Smile, Clock, Rocket } from 'lucide-react'
import useReveal from '../animations/useReveal'
import Button from './Button'
import office from '../assets/img/office.jpg'

const stats = [
  { icon: FolderKanban, value: '5+', label: 'Projects Delivered' },
  { icon: Smile, value: '3+', label: 'Happy Clients' },
  { icon: Clock, value: '2+', label: 'Years of Journey' },
  { icon: Rocket, value: '∞', label: 'More to Come' },
]

export default function About() {
  const ref = useReveal()
  return (
    <section className="section about dark" id="about" ref={ref}>
      <div className="container about-grid">
        <div className="about-copy">
          <p className="kicker" data-reveal>About WOLVO</p>
          <h2 data-reveal>We Build Digital<br />Solutions for a<br />Smarter Tomorrow</h2>
          <p className="muted" data-reveal>
            WOLVO is a team of passionate developers, designers and problem-solvers. We create technology that
            simplifies complex challenges and drives real business value. With a focus on innovation, quality and
            long-term partnerships, we help businesses turn ideas into products that make an impact.
          </p>
          <div data-reveal><Button variant="outline" href="#services">Learn More</Button></div>
        </div>
        <div className="about-img" data-img>
          <img src={office} alt="WOLVO office with the wolf logo on the wall" loading="lazy" />
        </div>
        <div className="stats" data-stagger>
          {stats.map(({ icon: Icon, value, label }) => (
            <div className="stat" key={label}>
              <span className="stat-icon"><Icon size={17} /></span>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
