import { ArrowRight } from 'lucide-react';
import type { Service } from '@/types/content';
import { padNumber } from '@/lib/format';
import { Picture } from '@/components/ui/Picture';

interface ServiceCardProps {
  service: Service;
  index: number;
  onStart: () => void;
}

/** Wide cards (web, social) span more columns, so they request larger image candidates. */
const SIZES = {
  wide: '(min-width: 1280px) 760px, (min-width: 640px) 92vw, 100vw',
  regular: '(min-width: 1280px) 520px, (min-width: 1024px) 40vw, (min-width: 640px) 46vw, 100vw',
};

export function ServiceCard({ service, index, onStart }: ServiceCardProps) {
  const Icon = service.icon;
  const wide = service.id === 'web' || service.id === 'social';
  return (
    <article className={`service-card service-card--${service.id}`} data-reveal-item aria-labelledby={`service-${service.id}`}>
      <span className="service-card__glow" aria-hidden="true" />
      <div className="service-card__top">
        <span className="service-card__index" aria-hidden="true">
          {padNumber(index + 1, 2)}
        </span>
        <span className="service-card__icon" aria-hidden="true">
          <Icon strokeWidth={1.85} />
        </span>
      </div>

      <div className="service-card__visual theme-dark">
        <div className="service-card__media" data-service-media>
          <Picture set={service.image} alt={service.imageAlt} sizes={wide ? SIZES.wide : SIZES.regular} fallbackSrc={service.imageFallback} />
        </div>
      </div>

      <div className="service-card__body">
        <h3 id={`service-${service.id}`} className="service-card__title">
          {service.title}
        </h3>
        <p className="service-card__desc">{service.description}</p>
        <ul className="tag-list service-card__tags" aria-label={`${service.title} deliverables`}>
          {service.deliverables.map((item) => (
            <li key={item} className="badge">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <button type="button" className="link-arrow service-card__cta" onClick={onStart} aria-label={`Start a ${service.title} project`}>
        Get started
        <ArrowRight strokeWidth={2} aria-hidden="true" />
      </button>
    </article>
  );
}
