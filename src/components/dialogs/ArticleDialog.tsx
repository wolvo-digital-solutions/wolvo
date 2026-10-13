import { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useUI, useUIState } from '@/context/UIContext';
import { useStickyValue } from '@/hooks/useStickyValue';
import { articles } from '@/data/articles';
import { formatDate, readingTime } from '@/lib/format';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { CoverArt } from '@/components/visuals/CoverArt';
import { Picture } from '@/components/ui/Picture';
import './dialogs.css';

export default function ArticleDialog() {
  const { articleId } = useUIState();
  const { closeArticle, openArticle, openContact } = useUI();
  const id = useStickyValue(articleId);
  const index = articles.findIndex((a) => a.id === id);
  const article = articles[index];
  const next = articles.length > 1 ? articles[(index + 1) % articles.length] : undefined;

  useEffect(() => {
    if (id) {
      const scroller = document.querySelector('.modal__scroller');
      if (scroller) scroller.scrollTop = 0;
    }
  }, [id]);

  return (
    <Modal open={articleId !== null} onClose={closeArticle} labelledBy="article-dialog-title" size="md">
      {article && (
        <article className="article-dialog" key={article.id}>
          <div className="article-dialog__cover">
            {article.coverImage ? (
              <Picture
                set={article.coverImage}
                alt=""
                sizes="(min-width: 800px) 760px, 100vw"
                fallback={<CoverArt variant={article.cover} />}
              />
            ) : (
              <CoverArt variant={article.cover} />
            )}
          </div>
          <div className="article-dialog__content">
            <div className="article-dialog__meta">
              <span className="badge badge--accent">{article.category}</span>
              <span>
                <time dateTime={article.date}>{formatDate(article.date)}</time> · {readingTime(article)}
              </span>
            </div>
            <h2 id="article-dialog-title" className="article-dialog__title">
              {article.title}
            </h2>
            <p className="article-dialog__summary">{article.summary}</p>

            <div className="prose">
              {article.body.map((section, i) => (
                <section key={i}>
                  {section.heading && <h3>{section.heading}</h3>}
                  {section.paragraphs.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </section>
              ))}
            </div>

            <aside className="article-dialog__cta">
              <div>
                <p className="article-dialog__cta-title">Have a project in mind?</p>
                <p className="article-dialog__cta-text">Let’s talk about what Wolvo can build for you.</p>
              </div>
              <Button
                onClick={() => {
                  closeArticle();
                  openContact({ source: `article-${article.id}` });
                }}
              >
                Start a Project
              </Button>
            </aside>

            {next && (
              <button type="button" className="article-dialog__next" onClick={() => openArticle(next.id)}>
                <span className="article-dialog__next-label">Read next</span>
                <span className="article-dialog__next-title">{next.title}</span>
                <ArrowRight strokeWidth={2} aria-hidden="true" />
              </button>
            )}
          </div>
        </article>
      )}
    </Modal>
  );
}
