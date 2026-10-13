import { useRef, useState } from 'react';
import { gsap, useGSAP } from '@/animations/gsap';
import { prefersReducedMotion } from '@/animations/smoothScroll';
import { useUI, useUIState } from '@/context/UIContext';
import { projects, projectCategories } from '@/data/projects';
import { articles, articleCategories } from '@/data/articles';
import { Modal } from '@/components/ui/Modal';
import { ProjectCard } from '@/components/sections/ProjectCard';
import { ArticleCard } from '@/components/sections/ArticleCard';
import './dialogs.css';

const ALL = 'All';

function FilterBar<T extends string>({
  label,
  options,
  counts,
  active,
  onChange,
}: {
  label: string;
  options: T[];
  counts: Record<string, number>;
  active: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="filter" role="group" aria-label={label}>
      {[ALL, ...options].map((option) => (
        <button
          key={option}
          type="button"
          className="filter__btn"
          aria-pressed={active === option}
          onClick={() => onChange(option)}
        >
          {option}
          <span className="filter__count">{counts[option] ?? 0}</span>
        </button>
      ))}
    </div>
  );
}

function useGridAnimation(dep: string) {
  const gridRef = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion() || !gridRef.current) return;
      gsap.from(gridRef.current.children, { y: 24, opacity: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out', clearProps: 'transform,opacity' });
    },
    { dependencies: [dep], scope: gridRef },
  );
  return gridRef;
}

function countBy<T>(items: T[], key: (item: T) => string) {
  return items.reduce<Record<string, number>>(
    (acc, item) => {
      acc[key(item)] = (acc[key(item)] ?? 0) + 1;
      return acc;
    },
    { [ALL]: items.length },
  );
}

export function ProjectsIndexDialog() {
  const { projectsIndex } = useUIState();
  const { closeProjectsIndex, openProject } = useUI();
  const [filter, setFilter] = useState(ALL);
  const gridRef = useGridAnimation(filter);
  const visible = filter === ALL ? projects : projects.filter((p) => p.category === filter);

  return (
    <Modal open={projectsIndex} onClose={closeProjectsIndex} labelledBy="projects-index-title" size="xl">
      <div className="index-dialog">
        <header className="index-dialog__head">
          <p className="eyebrow">
            <span className="eyebrow__line" aria-hidden="true" />
            Portfolio
          </p>
          <h2 id="projects-index-title" className="index-dialog__title">
            All Projects
          </h2>
          <FilterBar
            label="Filter projects by category"
            options={projectCategories}
            counts={countBy(projects, (p) => p.category)}
            active={filter}
            onChange={setFilter}
          />
          <p className="sr-only" aria-live="polite">
            {visible.length} projects shown
          </p>
        </header>
        <div ref={gridRef} className="index-dialog__grid">
          {visible.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={projects.indexOf(project)}
              onOpen={openProject}
              variant="grid"
            />
          ))}
        </div>
      </div>
    </Modal>
  );
}

export function ArticlesIndexDialog() {
  const { articlesIndex } = useUIState();
  const { closeArticlesIndex, openArticle } = useUI();
  const [filter, setFilter] = useState(ALL);
  const gridRef = useGridAnimation(filter);
  const visible = filter === ALL ? articles : articles.filter((a) => a.category === filter);

  return (
    <Modal open={articlesIndex} onClose={closeArticlesIndex} labelledBy="articles-index-title" size="xl">
      <div className="index-dialog">
        <header className="index-dialog__head">
          <p className="eyebrow">
            <span className="eyebrow__line" aria-hidden="true" />
            Insights / Blog
          </p>
          <h2 id="articles-index-title" className="index-dialog__title">
            All Articles
          </h2>
          <FilterBar
            label="Filter articles by category"
            options={articleCategories}
            counts={countBy(articles, (a) => a.category)}
            active={filter}
            onChange={setFilter}
          />
          <p className="sr-only" aria-live="polite">
            {visible.length} articles shown
          </p>
        </header>
        <div ref={gridRef} className="index-dialog__grid index-dialog__grid--articles">
          {visible.map((article) => (
            <ArticleCard key={article.id} article={article} variant="grid" onOpen={openArticle} />
          ))}
        </div>
      </div>
    </Modal>
  );
}

export default function IndexDialogs() {
  return (
    <>
      <ProjectsIndexDialog />
      <ArticlesIndexDialog />
    </>
  );
}
