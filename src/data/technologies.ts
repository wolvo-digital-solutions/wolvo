import type { Technology } from "@/types";

/**
 * Candidate list from docs/PRD.md §15 — "to be verified with WOLVO".
 * Flip verified → true only once WOLVO confirms it is used in client work.
 * Unverified entries render as clearly labelled candidates, never as claims.
 */
export const technologies: Technology[] = [
  { name: "React", group: "Frontend", verified: false },
  { name: "TypeScript", group: "Frontend", verified: false },
  { name: "JavaScript", group: "Frontend", verified: false },
  { name: "React Native", group: "Mobile", verified: false },
  { name: "Python", group: "Backend", verified: false },
  { name: "Django", group: "Backend", verified: false },
  { name: "PostgreSQL", group: "Data", verified: false },
  { name: "Firebase", group: "Data", verified: false },
  { name: "Supabase", group: "Data", verified: false },
  { name: "Git", group: "Workflow", verified: false },
  { name: "GitHub", group: "Workflow", verified: false },
];
