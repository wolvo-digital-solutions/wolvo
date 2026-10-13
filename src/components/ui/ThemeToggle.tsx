import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import './ThemeToggle.css';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className = '', showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className={`theme-toggle ${isDark ? 'is-dark' : 'is-light'} ${className}`}
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to day mode' : 'Switch to night mode'}
      title={isDark ? 'Switch to day mode' : 'Switch to night mode'}
    >
      <span className="theme-toggle__track" aria-hidden="true">
        <span className="theme-toggle__thumb">
          {isDark ? (
            <Moon className="theme-toggle__icon theme-toggle__icon--moon" strokeWidth={2} />
          ) : (
            <Sun className="theme-toggle__icon theme-toggle__icon--sun" strokeWidth={2} />
          )}
        </span>
      </span>
      {showLabel && (
        <span className="theme-toggle__label">
          {isDark ? 'Night Mode' : 'Day Mode'}
        </span>
      )}
    </button>
  );
}
