import { useEffect } from 'react';

/**
 * Standard cursor fallback: ensures system default cursor is restored.
 */
export function CustomCursor() {
  useEffect(() => {
    document.documentElement.classList.remove('has-custom-cursor');
  }, []);
  return null;
}
