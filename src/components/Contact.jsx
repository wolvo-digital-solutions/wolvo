import { useState } from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import useReveal from '../animations/useReveal'
import Button from './Button'
import { Social } from './Icons'

const info = [
  { icon: Mail, label: 'Email', value: 'hello@wolvo.com', href: 'mailto:hello@wolvo.com' },
  { icon: Phone, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
  { icon: MapPin, label: 'Location', value: 'Bhubaneswar, Odisha, India' },
]
const socials = [
  { name: 'linkedin', label: 'LinkedIn' },
  { name: 'x', label: 'X' },
  { name: 'github', label: 'GitHub' },
  { name: 'instagram', label: 'Instagram' },
]

export default function Contact() {
  const ref = useReveal()
  const [sent, setSent] = useState(false)
  return (
    <section className="section contact dark" id="contact" ref={ref}>
      <div className="container contact-grid">
        <div>
          <p className="kicker" data-reveal>Get in Touch</p>
          <h2 data-reveal>Let&apos;s Build Something<br />Great Together.</h2>
          <p className="muted" data-reveal>Have a project in mind? We&apos;d love to hear from you.<br />Reach out and let&apos;s create something amazing.</p>
        </div>
        <div className="contact-info" data-stagger>
          {info.map(({ icon: Icon, label, value, href }) => (
            <div className="ci" key={label}>
              <Icon size={16} />
              <div><span>{label}</span>{href ? <a href={href}>{value}</a> : <p>{value}</p>}</div>
            </div>
          ))}
          <div className="socials">
            {socials.map((s) => (
              <motion.a key={s.name} href="#contact" aria-label={s.label} whileHover={{ y: -3 }} whileTap={{ scale: 0.92 }}><Social name={s.name} /></motion.a>
            ))}
          </div>
        </div>
        <form className="form" data-reveal onSubmit={(e) => { e.preventDefault(); setSent(true); e.currentTarget.reset() }}>
          <label>Your Name *<input name="name" required placeholder="Enter your name" autoComplete="name" /></label>
          <label>Email Address *<input name="email" type="email" required placeholder="Enter your email" autoComplete="email" /></label>
          <label className="full">Message *<textarea name="message" required rows="2" placeholder="Tell us about your project..." /></label>
          <div className="full form-foot">
            <Button type="submit">Send Message</Button>
            {sent && <span className="sent" role="status">Thanks! We&apos;ll be in touch soon.</span>}
          </div>
        </form>
      </div>
    </section>
  )
}
