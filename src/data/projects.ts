import type { Project } from "@/types";

/**
 * [CASE STUDIES — TO BE PROVIDED]
 * No real projects have been supplied yet. These slots define structure only;
 * replace each entry with a real project and set placeholder: false.
 * Categories map to WOLVO's real service lines, not to invented clients.
 */
const slot = (n: number, category: string, services: string[]): Project => ({
  id: `project-${n}`,
  name: `[PROJECT ${n} NAME — TO BE PROVIDED]`,
  client: "[CLIENT — TO BE PROVIDED]",
  category,
  services,
  description: "[PROJECT DESCRIPTION — TO BE PROVIDED]",
  technologies: [],
  outcome: "[OUTCOME — TO BE PROVIDED]",
  image: null,
  url: null,
  placeholder: true,
});

export const projects: Project[] = [
  slot(1, "App Development", ["App Development"]),
  slot(2, "Web Development", ["Web Development"]),
  slot(3, "Brand & Graphic Design", ["Graphic Designing", "Social Media Management"]),
  slot(4, "Video & Campaigns", ["Video Editing", "Advertising Management"]),
];
