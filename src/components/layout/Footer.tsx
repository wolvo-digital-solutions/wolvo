import { useRef } from 'react';
import { ArrowUp, ArrowUpRight, Mail } from 'lucide-react';
import { footerNav } from '@/data/navigation';
import { services } from '@/data/services';
import { site, socialLinks } from '@/data/site';
import { useSectionMotion } from '@/hooks/useSectionMotion';
import { useUI } from '@/context/UIContext';
import { Logo } from '@/components/ui/Logo';
import { SocialList } from '@/components/ui/SocialIcon';
import { StatusPill } from '@/components/ui/StatusPill';
import './Footer.css';

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { openContact } = useUI();
  useSectionMotion(ref);
  const year = new Date().getFullYear();

  return (
    <footer ref={ref} className="footer" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">
        Wolvo — site footer
      </h2>
      <div className="container">
        <div className="footer__top" data-reveal="stagger">
          <div className="footer__brand" data-reveal-item>
            <Logo />
            <p className="footer__statement">{site.statement}</p>
            <StatusPill />
          </div>

          <nav className="footer__col" aria-label="Footer" data-reveal-item>
            <h3 className="footer__heading">Navigate</h3>
            <ul className="footer__links" role="list">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer__col" data-reveal-item>
            <h3 className="footer__heading">Services</h3>
            <ul className="footer__links" role="list">
              {services.map((service) => (
                <li key={service.id}>
                  <a href="#services">{service.title}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col footer__contact" data-reveal-item>
            <h3 className="footer__heading">Contact</h3>
            <a href={`mailto:${site.email}`} className="footer__email">
              <Mail strokeWidth={1.85} aria-hidden="true" />
              {site.email}
            </a>
            <button type="button" className="link-arrow" onClick={() => openContact({ source: 'footer' })}>
              Start a project
              <ArrowUpRight strokeWidth={2} aria-hidden="true" />
            </button>
            <SocialList links={socialLinks} />
          </div>
        </div>

        <div className="footer__wordmark" aria-hidden="true">
          Wolvo
        </div>

        <div className="footer__bottom">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="footer__made">Designed &amp; built by Wolvo.</p>
          <a href="#home" className="footer__top-link">
            Back to top
            <ArrowUp strokeWidth={2} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
