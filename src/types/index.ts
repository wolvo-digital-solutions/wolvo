export type ServiceId = "app" | "web" | "video" | "graphic" | "ads" | "social";

export interface Service {
  id: ServiceId;
  index: string;
  title: string;
  summary: string;
  description: string;
  deliverables: string[];
}

export interface Project {
  id: string;
  name: string;
  client: string;
  category: string;
  services: string[];
  description: string;
  technologies: string[];
  outcome: string;
  image: string | null;
  url: string | null;
  /** true until WOLVO supplies the real case study */
  placeholder: boolean;
}

export interface Person {
  role: "Founder" | "Co-Founder";
  name: string;
  bio: string;
  expertise: string[];
  photo: string | null;
  links: { label: string; href: string }[];
  placeholder: boolean;
}

export interface Testimonial {
  quote: string;
  name: string;
  company: string;
  role?: string;
  placeholder: boolean;
}

export interface Technology {
  name: string;
  group: "Frontend" | "Mobile" | "Backend" | "Data" | "Workflow";
  /** Only verified technologies are presented as fact. */
  verified: boolean;
}

export interface SocialLink {
  label: string;
  href: string | null;
}
