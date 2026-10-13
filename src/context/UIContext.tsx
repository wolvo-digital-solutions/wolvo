import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { track } from '@/lib/track';

export interface ContactRequest {
  service?: string;
  message?: string;
  source?: string;
  /** Unique per open, so the form always starts fresh. */
  nonce?: number;
}

export interface UIState {
  contact: ContactRequest | null;
  projectId: string | null;
  articleId: string | null;
  projectsIndex: boolean;
  articlesIndex: boolean;
}

export interface UIActions {
  openContact: (request?: ContactRequest) => void;
  closeContact: () => void;
  openProject: (id: string) => void;
  closeProject: () => void;
  openArticle: (id: string) => void;
  closeArticle: () => void;
  openProjectsIndex: () => void;
  closeProjectsIndex: () => void;
  openArticlesIndex: () => void;
  closeArticlesIndex: () => void;
  closeAll: () => void;
}

const initialState: UIState = {
  contact: null,
  projectId: null,
  articleId: null,
  projectsIndex: false,
  articlesIndex: false,
};

const StateContext = createContext<UIState>(initialState);
const ActionsContext = createContext<UIActions | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UIState>(initialState);

  // Actions never change identity, so components that only trigger dialogs don't re-render.
  const actions = useMemo<UIActions>(
    () => ({
      openContact: (request = {}) => {
        track('contact_open', { source: request.source ?? 'unknown' });
        setState((s) => ({ ...s, contact: { ...request, nonce: Date.now() } }));
      },
      closeContact: () => setState((s) => ({ ...s, contact: null })),
      openProject: (id) => {
        track('project_open', { id });
        setState((s) => ({ ...s, projectId: id }));
      },
      closeProject: () => setState((s) => ({ ...s, projectId: null })),
      openArticle: (id) => {
        track('article_open', { id });
        setState((s) => ({ ...s, articleId: id }));
      },
      closeArticle: () => setState((s) => ({ ...s, articleId: null })),
      openProjectsIndex: () => setState((s) => ({ ...s, projectsIndex: true })),
      closeProjectsIndex: () => setState((s) => ({ ...s, projectsIndex: false })),
      openArticlesIndex: () => setState((s) => ({ ...s, articlesIndex: true })),
      closeArticlesIndex: () => setState((s) => ({ ...s, articlesIndex: false })),
      closeAll: () => setState(initialState),
    }),
    [],
  );

  return (
    <ActionsContext.Provider value={actions}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </ActionsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUI(): UIActions {
  const ctx = useContext(ActionsContext);
  if (!ctx) throw new Error('useUI must be used inside <UIProvider>');
  return ctx;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUIState(): UIState {
  return useContext(StateContext);
}
