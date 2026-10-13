import type { ReactNode } from 'react';

interface SectionHeadingProps {
  id: string;
  index: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  layout?: 'split' | 'stacked';
}

/** Eyebrow + large heading + supporting copy, shared by every section. */
export function SectionHeading({ id, index, eyebrow, title, description, actions, layout = 'split' }: SectionHeadingProps) {
  return (
    <header className={`section-heading section-heading--${layout}`}>
      <div className="section-heading__main">
        <p className="eyebrow" data-reveal="fade">
          <span className="eyebrow__index">{index}</span>
          <span className="eyebrow__line" aria-hidden="true" />
          {eyebrow}
        </p>
        <h2 id={id} className="section-heading__title" data-reveal="lines">
          {title}
        </h2>
      </div>
      {(description || actions) && (
        <div className="section-heading__aside" data-reveal="up" data-reveal-delay="0.15">
          {description && <p className="section-heading__desc lead">{description}</p>}
          {actions}
        </div>
      )}
    </header>
  );
}
