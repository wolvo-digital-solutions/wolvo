import type { SocialLink } from "@/types";

/**
 * Verified company facts. Anything not supplied by WOLVO is null and
 * rendered as an obvious placeholder — never invented.
 */
export const company = {
  name: "WOLVO",
  tagline: "Ideas → Digital → Impact",
  descriptor: "Digital technology & creative studio",
  happyClients: 10, // "10+ happy clients" — supplied metric
  email: null as string | null, // [CONTACT EMAIL — TO BE PROVIDED]
  location: null as string | null, // [LOCATION — TO BE PROVIDED]
};

export const socials: SocialLink[] = [
  { label: "Instagram", href: null },
  { label: "LinkedIn", href: null },
  { label: "X", href: null },
  { label: "Behance", href: null },
];

export const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;
