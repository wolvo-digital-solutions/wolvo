import { lazy, Suspense, useEffect, useState } from 'react';
import { useUIState } from '@/context/UIContext';

const loaders = {
  contact: () => import('./ContactDialog'),
  project: () => import('./ProjectDialog'),
  article: () => import('./ArticleDialog'),
  indexes: () => import('./IndexDialogs'),
  githubShare: () => import('./GitHubShareDialog'),
};

const ContactDialog = lazy(loaders.contact);
const ProjectDialog = lazy(loaders.project);
const ArticleDialog = lazy(loaders.article);
const IndexDialogs = lazy(loaders.indexes);
const GitHubShareDialog = lazy(loaders.githubShare);

type Key = keyof typeof loaders;

/**
 * Dialogs are code-split: each chunk is prefetched when the browser is idle
 * and mounted the first time it is needed, keeping the initial bundle lean.
 */
export function DialogRoot() {
  const state = useUIState();
  const [seen, setSeen] = useState<Record<Key, boolean>>({
    contact: false,
    project: false,
    article: false,
    indexes: false,
    githubShare: false,
  });

  const isWanted: Record<Key, boolean> = {
    contact: state.contact !== null,
    project: state.projectId !== null,
    article: state.articleId !== null,
    indexes: state.projectsIndex || state.articlesIndex,
    githubShare: state.githubShare,
  };

  useEffect(() => {
    const newlyWanted = (Object.keys(isWanted) as Key[]).filter((k) => isWanted[k] && !seen[k]);
    if (newlyWanted.length) {
      setSeen((s) => ({ ...s, ...Object.fromEntries(newlyWanted.map((k) => [k, true])) }));
    }
  }, [state, seen]);

  useEffect(() => {
    const prefetch = () => Object.values(loaders).forEach((load) => void load());
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(prefetch, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(prefetch, 2500);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <>
      {/* Separate boundaries so loading one dialog never hides another that is open. */}
      {(seen.indexes || isWanted.indexes) && (
        <Suspense fallback={null}>
          <IndexDialogs />
        </Suspense>
      )}
      {(seen.project || isWanted.project) && (
        <Suspense fallback={null}>
          <ProjectDialog />
        </Suspense>
      )}
      {(seen.article || isWanted.article) && (
        <Suspense fallback={null}>
          <ArticleDialog />
        </Suspense>
      )}
      {(seen.contact || isWanted.contact) && (
        <Suspense fallback={null}>
          <ContactDialog />
        </Suspense>
      )}
      {(seen.githubShare || isWanted.githubShare) && (
        <Suspense fallback={null}>
          <GitHubShareDialog />
        </Suspense>
      )}
    </>
  );
}
