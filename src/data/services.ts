import type { Service } from "@/types";

// Titles and scope from docs/PRD.md §5. Descriptions are draft copy derived only
// from that scope — final wording pending WOLVO approval.
export const services: Service[] = [
  {
    id: "app",
    index: "01",
    title: "App Development",
    summary: "Custom mobile applications and digital products.",
    description:
      "We design and build mobile applications and digital product experiences — from the first flow on paper to a release your customers can download.",
    deliverables: ["Mobile apps", "Product UX / UI", "Prototyping", "Release support"],
  },
  {
    id: "web",
    index: "02",
    title: "Web Development",
    summary: "Modern websites and web applications.",
    description:
      "Fast, modern websites and web applications engineered to represent your brand clearly and turn visitors into enquiries.",
    deliverables: ["Marketing websites", "Web applications", "Landing pages", "CMS setup"],
  },
  {
    id: "video",
    index: "03",
    title: "Video Editing",
    summary: "Commercial, social and brand video.",
    description:
      "Editing that gives your footage rhythm and purpose — commercial, social and brand videos cut for the platform they live on.",
    deliverables: ["Brand films", "Social edits", "Reels & shorts", "Motion titles"],
  },
  {
    id: "graphic",
    index: "04",
    title: "Graphic Designing",
    summary: "Identity, creatives and marketing design.",
    description:
      "Brand identity, social creatives and marketing graphics built on one consistent visual system, so every touchpoint looks like it belongs to you.",
    deliverables: ["Brand identity", "Social creatives", "Marketing collateral", "Digital design"],
  },
  {
    id: "ads",
    index: "05",
    title: "Advertising Management",
    summary: "Paid campaigns, optimised and reported.",
    description:
      "Paid campaign setup, management and optimisation, with clear reporting so you always know what your budget is doing.",
    deliverables: ["Campaign setup", "Audience targeting", "Optimisation", "Reporting"],
  },
  {
    id: "social",
    index: "06",
    title: "Social Media Management",
    summary: "Planning, publishing and presence.",
    description:
      "Content planning, creative coordination and publishing that keep your social presence consistent, on-brand and active.",
    deliverables: ["Content calendars", "Creative coordination", "Publishing", "Community presence"],
  },
];
