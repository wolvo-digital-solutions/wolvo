import type { FocusEventHandler } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/types/content';
import { padNumber } from '@/lib/format';
import { ProjectVisual } from '@/components/visuals/ProjectVisual';

interface ProjectCardProps {
  project: Project;
  index: number;
  onOpen: (id: string) => void;
  onFocus?: FocusEventHandler<HTMLElement>;
  variant?: 'rail' | 'grid';
  headingLevel?: 'h3' | 'h4';
}

export function ProjectCard({ project, index, onOpen, onFocus, variant = 'rail', headingLevel = 'h3' }: ProjectCardProps) {
  const Heading = headingLevel;
  return (
    <article className={`project-card project-card--${variant}`} data-carousel-item data-project-card data-cursor="View" onFocus={onFocus}>
      <div className="project-card__media theme-dark">
        <ProjectVisual project={project} />
        <div className="project-card__overlay" aria-hidden="true">
          <ul className="tag-list">
            {project.services.map((s) => (
              <li key={s} className="badge badge--glass">
                {s}
              </li>
            ))}
          </ul>
          <span className="project-card__overlay-cta">
            View project <ArrowUpRight strokeWidth={2} />
          </span>
        </div>
        <span className="badge badge--glass project-card__category">{project.category}</span>
      </div>

      <div className="project-card__info">
        <span className="project-card__index" aria-hidden="true">
          {padNumber(index + 1, 2)}
        </span>
        <div className="project-card__text">
          <Heading className="project-card__title">
            <button type="button" className="project-card__link" onClick={() => onOpen(project.id)}>
              {project.title}
              <span className="sr-only">, view project details</span>
            </button>
          </Heading>
          <p className="project-card__desc">{project.description}</p>
        </div>
        <span className="project-card__arrow" aria-hidden="true">
          <ArrowUpRight strokeWidth={1.85} />
        </span>
      </div>
    </article>
  );
}
