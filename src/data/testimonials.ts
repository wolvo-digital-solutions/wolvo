import type { Testimonial } from "@/types";

// [TESTIMONIALS — TO BE PROVIDED]. Real, approved client quotes only.
export const testimonials: Testimonial[] = [1, 2, 3].map((n) => ({
  quote: `[TESTIMONIAL ${n} — TO BE PROVIDED]`,
  name: "[CLIENT NAME]",
  company: "[COMPANY]",
  role: "[ROLE — IF APPROVED]",
  placeholder: true,
}));
