import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { flushSync } from 'react-dom';

export type Theme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const STORAGE_KEY = 'wolvo_theme';
/** Browser UI colour per theme — must match --color-bg in tokens.css. */
const THEME_COLOR: Record<Theme, string> = { dark: '#07090e', light: '#f5f7fb' };

const ThemeContext = createContext<ThemeContextValue | null>(null);

const isTheme = (value: unknown): value is Theme => value === 'light' || value === 'dark';

/**
 * The inline script in index.html applies the saved theme before first paint
 * (no flash of the wrong theme); React starts from whatever it set.
 */
function getInitialTheme(): Theme {
  if (typeof document === 'undefined') return 'dark';
  const applied = document.documentElement.dataset.theme;
  return isTheme(applied) ? applied : 'dark';
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);
}

function persist(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* storage unavailable (private mode, blocked cookies) */
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  const setTheme = useCallback((next: Theme) => {
    const root = document.documentElement;
    if (root.dataset.theme === next) return;

    const commit = () => {
      flushSync(() => setThemeState(next));
      applyTheme(next);
    };
    persist(next);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (typeof document.startViewTransition === 'function' && !reduceMotion) {
      // One uniform crossfade of the whole page instead of per-element colour transitions.
      document.startViewTransition(commit);
      return;
    }
    // Fallback: switch every colour in the same frame (no staggered transitions).
    root.classList.add('is-theme-switching');
    commit();
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('is-theme-switching')));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light');
  }, [setTheme]);

  // Keep the DOM in sync on mount, and follow theme changes made in other tabs.
  useEffect(() => {
    applyTheme(theme);
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && isTheme(e.newValue)) {
        setThemeState(e.newValue);
        applyTheme(e.newValue);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only sync
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme, setTheme }), [theme, toggleTheme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
