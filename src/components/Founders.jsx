import { useRef } from 'react'
import { gsap } from 'gsap'
import useReveal from '../animations/useReveal'
import founder1 from '../assets/img/santosh.jpg'
import founder2 from '../assets/img/swyom.jpg'

function FounderCard({ name, role, tags, quote, image, className, ...props }) {
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!cardRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rotateX = ((y - cy) / cy) * -8
    const rotateY = ((x - cx) / cx) * 8
    
    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      transformPerspective: 1000,
      ease: 'power3.out',
      duration: 0.6
    })
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      ease: 'power3.out',
      duration: 1
    })
  }

  return (
    <div 
      className={`f-card ${className || ''}`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div className="f-card-inner">
        <div className="f-card-img">
          <img src={image} alt={name} />
          <div className="f-card-gradient"></div>
        </div>
        <div className="f-card-content">
          <span className="f-badge">{role}</span>
          <h3>{name}</h3>
          <p className="f-tags">{tags}</p>
          <p className="f-quote">{quote}</p>
        </div>
      </div>
    </div>
  )
}

export default function Founders() {
  const sectionRef = useReveal()

  return (
    <section className="section f-section" id="founders" ref={sectionRef}>
      <div className="f-glow-bg"></div>
      <div className="container f-container">
        
        <div className="f-text-col">
          <div className="f-eyebrow" data-reveal>
            <span className="f-line"></span> FOUNDERS
          </div>
          <h2 className="f-heading" data-reveal>
            Two Minds.<br/>
            <span className="f-blue">One Vision.</span>
          </h2>
          <p className="f-desc" data-reveal>
            Wolvo was founded by a passionate duo — driven by technology, creativity and a shared belief in building digital solutions that create real impact.
          </p>
          <p className="f-desc" data-reveal>
            Together, we combine our skills, experiences and vision to help businesses grow, innovate and stay ahead in the digital world.
          </p>
          <div className="f-signature-box" data-reveal>
            <p className="f-signature">Building Tomorrow,<br/>Together.</p>
            <div className="f-swoosh"></div>
          </div>
        </div>

        <div className="f-cards-col">
          <FounderCard 
            className="f-card-1"
            name="Santosh Sahou"
            role="FOUNDER"
            tags="Visionary | Builder | Tech Enthusiast"
            quote='"I believe in turning ideas into products that make a difference."'
            image={founder1}
            data-reveal
          />
          <FounderCard 
            className="f-card-2"
            name="P. Swyom Sanjog"
            role="CO-FOUNDER"
            tags="Developer | Designer | Problem Solver"
            quote='"I love building things that solve real problems."'
            image={founder2}
            data-reveal
          />
        </div>

      </div>
    </section>
  )
}
