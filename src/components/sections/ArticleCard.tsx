import { ArrowRight } from 'lucide-react';
import type { Article } from '@/types/content';
import { formatDate, readingTime } from '@/lib/format';
import { CoverArt } from '@/components/visuals/CoverArt';
import { Picture } from '@/components/ui/Picture';

const COVER_SIZES = {
  featured: '(min-width: 1024px) 60vw, 100vw',
  // Compact covers fill a tall box (object-fit: cover), so they need more width than they occupy.
  compact: '(min-width: 1024px) 340px, (min-width: 480px) 50vw, 320px',
  grid: '(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw',
} as const;

interface ArticleCardProps {
  article: Article;
  variant?: 'featured' | 'compact' | 'grid';
  onOpen: (id: string) => void;
  headingLevel?: 'h3' | 'h4';
}

export function ArticleCard({ article, variant = 'grid', onOpen, headingLevel = 'h3' }: ArticleCardProps) {
  const Heading = headingLevel;
  return (
    <article className={`article-card article-card--${variant}`} data-reveal-item data-carousel-item>
      <div className="article-card__cover">
        {article.coverImage ? (
          <Picture set={article.coverImage} alt="" sizes={COVER_SIZES[variant]} fallback={<CoverArt variant={article.cover} />} />
        ) : (
          <CoverArt variant={article.cover} />
        )}
      </div>
      <div className="article-card__body">
        <div className="article-card__meta">
          <span className="badge badge--accent">{article.category}</span>
          <span className="article-card__date">
            <time dateTime={article.date}>{formatDate(article.date)}</time>
            <span aria-hidden="true"> · </span>
            {readingTime(article)}
          </span>
        </div>
        <Heading className="article-card__title">
          <button type="button" className="article-card__link" onClick={() => onOpen(article.id)}>
            {article.title}
          </button>
        </Heading>
        <p className="article-card__summary">{article.summary}</p>
        <span className="article-card__cta" aria-hidden="true">
          Read article <ArrowRight strokeWidth={2} />
        </span>
      </div>
    </article>
  );
}
