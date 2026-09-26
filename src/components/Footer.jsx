import Logo from './Logo'
import { navLinks } from '../data/content'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="f-brand">
          <Logo size={30} />
          <p className="tagline">Innovate <i>•</i> Build <i>•</i> Grow</p>
        </div>
        <nav className="f-links" aria-label="Quick links">
          <h3>Quick Links</h3>
          <ul>{navLinks.map((l) => <li key={l.id}><a href={`#${l.id}`}>{l.label}</a></li>)}</ul>
        </nav>
        <nav className="f-legal" aria-label="Legal">
          <h3>Legal</h3>
          <ul><li><a href="#home">Privacy Policy</a></li><li><a href="#home">Terms &amp; Conditions</a></li></ul>
        </nav>
        <div className="f-copy">
          <p>© 2025 WOLVO. All rights reserved.</p>
          <p>Built with <span aria-label="love">❤️</span> for a better tomorrow.</p>
        </div>
      </div>
    </footer>
  )
}
