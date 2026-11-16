import { useRef } from 'react';
import { useSectionMotion } from '@/hooks/useSectionMotion';
import { useUI } from '@/context/UIContext';
import { useContent } from '@/context/ContentContext';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ArticleCard } from './ArticleCard';
import './Articles.css';

export function Articles() {
  const ref = useRef<HTMLElement>(null);
  const { openArticle, openArticlesIndex } = useUI();
  const { articles, featuredArticle, secondaryArticles } = useContent();
  useSectionMotion(ref);

  return (
    <section id="articles" ref={ref} className="articles section" aria-labelledby="articles-title">
      <div className="container">
        <SectionHeading
          id="articles-title"
          index="05"
          eyebrow="Insights / Blog"
          title={
            <>
              Ideas, Technology <span className="text-muted">&amp; Digital Growth</span>
            </>
          }
          description="Practical thinking on websites, apps, advertising, branding and content — written for business owners, not engineers."
          actions={
            articles.length > 0 ? (
              <Button variant="secondary" onClick={openArticlesIndex}>
                View All Articles
              </Button>
            ) : undefined
          }
        />

        {articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--color-text-muted)' }}>
            <p style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>
              No Articles Published Yet
            </p>
            <p style={{ fontSize: '0.85rem' }}>
              Check back soon for insights on web performance, mobile apps, and digital growth.
            </p>
          </div>
        ) : (
          <div className="articles__grid">
            {featuredArticle && (
              <div className="articles__featured" data-reveal="stagger">
                <ArticleCard article={featuredArticle} variant="featured" onOpen={openArticle} />
              </div>
            )}
            <div className="articles__list" data-reveal="stagger" data-reveal-delay="0.1">
              {secondaryArticles.map((article) => (
                <ArticleCard key={article.id} article={article} variant="compact" onOpen={openArticle} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
