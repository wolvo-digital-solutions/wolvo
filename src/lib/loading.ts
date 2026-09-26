/** Tiny shared store so the preloader can reflect real hero-asset progress. */
type Listener = (p: number) => void;

let progress = 0;
const listeners = new Set<Listener>();

export const heroLoading = {
  get: () => progress,
  set(p: number) {
    progress = Math.max(progress, Math.min(1, p));
    listeners.forEach((l) => l(progress));
  },
  subscribe(l: Listener) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};
