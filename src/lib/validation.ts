import { z } from "zod";
import { services } from "@/data/services";

export const projectTypes = [...services.map((s) => s.title), "Something else"] as const;

export const budgetRanges = [
  "Not sure yet",
  "[BUDGET RANGE 1 — TO BE PROVIDED]",
  "[BUDGET RANGE 2 — TO BE PROVIDED]",
  "[BUDGET RANGE 3 — TO BE PROVIDED]",
] as const;

// Shared by the client form and the /api/contact route handler.
export const contactSchema = z.object({
  name: z.string({ error: "Please enter your name." }).trim().min(2, "Please enter your name.").max(100),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string({ error: "Please enter your email address." }).trim().email("Please enter a valid email address.").max(200),
  phone: z
    .string()
    .trim()
    .max(30)
    .regex(/^[+()\d\s-]*$/, "Use digits, spaces and + ( ) - only.")
    .optional()
    .or(z.literal("")),
  projectType: z.enum(projectTypes, { error: "Please choose a project type." }),
  budget: z.enum(budgetRanges).optional().or(z.literal("")),
  message: z.string({ error: "Please tell us about your project." }).trim().min(20, "Tell us a little more — at least 20 characters.").max(4000),
  // Honeypot: real users never see or fill this.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
