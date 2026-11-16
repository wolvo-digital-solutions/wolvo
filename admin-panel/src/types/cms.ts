export type DynamicIconName =
  | 'Code2'
  | 'Compass'
  | 'Cpu'
  | 'MessagesSquare'
  | 'Rocket'
  | 'Search'
  | 'Sparkles'
  | 'Target'
  | 'Globe'
  | 'Smartphone'
  | 'Megaphone'
  | 'Video'
  | 'Palette'
  | 'Share2'
  | 'Layers'
  | 'Shield'
  | 'Zap'
  | 'Database';

export interface CMSArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  published_at: string;
  read_time: string;
  category: string;
  tags: string[];
  visual_kind: 'code' | 'mesh' | 'dots' | 'rings';
  cover_image?: string;
  author_name: string;
  author_role: string;
  is_published: boolean;
  content: {
    lead?: string;
    sections?: Array<{
      heading: string;
      paragraphs: string[];
      callout?: string;
    }>;
  };
  created_at?: string;
  updated_at?: string;
}

export interface CMSService {
  id: string;
  title: string;
  description: string;
  icon_name: DynamicIconName;
  deliverables: string[];
  image_url?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CMSProject {
  id: string;
  title: string;
  category: string;
  client: string;
  year: string;
  description: string;
  challenge: string;
  solution: string;
  result_value: string;
  result_label: string;
  services: string[];
  technologies: string[];
  image_url?: string;
  visual_kind: 'browser' | 'mobile' | 'code' | 'analytics';
  accent_from: string;
  accent_to: string;
  featured_on_rail: boolean;
  is_published: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface CMSTestimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  avatar_url?: string;
  is_approved: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface StorageFile {
  name: string;
  id?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
  last_accessed_at?: string | null;
  metadata?: Record<string, unknown> | null;
  publicUrl?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'superadmin' | 'admin' | 'editor';
}

export interface AuditLog {
  id: string;
  user_email: string;
  action: 'create' | 'update' | 'delete' | 'publish' | 'unpublish';
  entity_type: 'article' | 'service' | 'project' | 'testimonial' | 'media';
  entity_id: string;
  entity_title: string;
  timestamp: string;
}
