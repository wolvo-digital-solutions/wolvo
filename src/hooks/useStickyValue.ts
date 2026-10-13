import { useState } from 'react';

/**
 * Keeps the last non-null value so dialog content stays rendered while the
 * dialog animates out after its state has been cleared.
 */
export function useStickyValue<T>(value: T | null | undefined): T | null {
  const [sticky, setSticky] = useState<T | null>(value ?? null);
  if (value != null && value !== sticky) setSticky(value);
  return value ?? sticky;
}
