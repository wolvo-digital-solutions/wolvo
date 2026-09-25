import { clsx, type ClassValue } from "clsx";

export const cn = (...inputs: ClassValue[]) => clsx(inputs);

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

/** Map a global progress (0–1) into a sub-range, clamped to 0–1. */
export const range = (p: number, start: number, end: number) => clamp((p - start) / (end - start));
