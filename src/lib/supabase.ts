import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import type { Article, Project, Service, Testimonial } from '@/types/content';
import { articles as initialArticles } from '@/data/articles';
import { services as initialServices } from '@/data/services';
import { projects as initialProjects } from '@/data/projects';
import { testimonials as initialTestimonials } from '@/data/testimonials';
import { getIconComponent } from '@/lib/icons';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('YOUR_SUPABASE_URL')
);

if (typeof globalThis !== 'undefined' && typeof (globalThis as any).WebSocket === 'undefined') {
  (globalThis as any).WebSocket = class MockWebSocket {};
}

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// Local storage keys for offline/demo mode fallback
const LOCAL_STORAGE_KEYS = {
  articles: 'wolvo_cms_articles',
  services: 'wolvo_cms_services',
  projects: 'wolvo_cms_projects',
  testimonials: 'wolvo_cms_testimonials',
  demoAdmin: 'wolvo_cms_demo_admin',
};

// Helper to get local data with initial fallback
function getLocalData<T>(key: string, initial: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return initial;
    return JSON.parse(raw) as T[];
  } catch {
    return initial;
  }
}

function setLocalData<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`[CMS] Failed to save to localStorage (${key}):`, e);
  }
}

// ---------------------------------------------------------------------------
// AUTHENTICATION & RBAC
// ---------------------------------------------------------------------------

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin';
  name?: string;
  isDemo?: boolean;
}

/**
 * Validates whether a user has administrative privileges.
 * Checks app_metadata role, user_metadata role, or presence in the `admins` table.
 */
export async function checkIsAdmin(user: User | null): Promise<boolean> {
  if (!user) return false;
  if (!supabase) return false;

  // 1. Direct JWT role check
  if (
    user.app_metadata?.role === 'admin' ||
    user.user_metadata?.role === 'admin' ||
    user.app_metadata?.is_admin === true
  ) {
    return true;
  }

  // 2. Query the admins table in Supabase
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('id, role')
      .eq('id', user.id)
      .maybeSingle();

    if (!error && data && data.role === 'admin') {
      return true;
    }
  } catch (err) {
    console.warn('[CMS Auth] Failed to verify admin in database:', err);
  }

  return false;
}

export async function loginAdmin(email: string, password: string): Promise<{ user: AdminUser | null; error: string | null }> {
  // If Supabase is connected, authenticate through Supabase Auth
  if (supabase && isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { user: null, error: error.message };
      }

      const user = data.user;
      const isAdmin = await checkIsAdmin(user);

      if (!isAdmin) {
        await supabase.auth.signOut();
        return {
          user: null,
          error: 'Access denied: Your account is not authorized as an administrator.',
        };
      }

      return {
        user: {
          id: user.id,
          email: user.email ?? email,
          role: 'admin',
          name: user.user_metadata?.name ?? user.email?.split('@')[0],
        },
        error: null,
      };
    } catch (err: any) {
      return { user: null, error: err?.message || 'Login failed' };
    }
  }

  // Fallback demo authentication when Supabase credentials aren't configured yet
  if (email.toLowerCase() === 'admin@wolvo.agency' && password === 'admin123') {
    const demoUser: AdminUser = {
      id: 'demo-admin-id',
      email: 'admin@wolvo.agency',
      role: 'admin',
      name: 'Wolvo Admin',
      isDemo: true,
    };
    localStorage.setItem(LOCAL_STORAGE_KEYS.demoAdmin, JSON.stringify(demoUser));
    return { user: demoUser, error: null };
  }

  return {
    user: null,
    error: 'Invalid credentials. (Note: Supabase is in preview mode. Use admin@wolvo.agency / admin123 or configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY)',
  };
}

export async function logoutAdmin(): Promise<void> {
  if (supabase) {
    await supabase.auth.signOut();
  }
  localStorage.removeItem(LOCAL_STORAGE_KEYS.demoAdmin);
}

export async function getCurrentAdminUser(): Promise<AdminUser | null> {
  if (supabase && isSupabaseConfigured) {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const isAdmin = await checkIsAdmin(session.user);
        if (isAdmin) {
          return {
            id: session.user.id,
            email: session.user.email ?? '',
            role: 'admin',
            name: session.user.user_metadata?.name ?? session.user.email?.split('@')[0],
          };
        }
      }
    } catch (e) {
      console.warn('[CMS Auth] Session fetch error:', e);
    }
  }

  // Check demo user
  try {
    const demo = localStorage.getItem(LOCAL_STORAGE_KEYS.demoAdmin);
    if (demo) return JSON.parse(demo) as AdminUser;
  } catch {}

  return null;
}

// ---------------------------------------------------------------------------
// ARTICLES
// ---------------------------------------------------------------------------

export interface DbArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  date: string;
  cover: string;
  cover_image_url?: string | null;
  body: any;
  featured?: boolean;
  status: 'published' | 'draft';
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export function mapDbArticleToArticle(row: DbArticle): Article {
  let coverImage = undefined;
  if (row.cover_image_url) {
    coverImage = {
      base: row.cover_image_url,
      widths: [],
      fallback: row.cover_image_url,
      width: 1200,
      height: 750,
    };
  }

  return {
    id: row.id,
    title: row.title,
    category: row.category as any,
    summary: row.summary,
    date: row.date,
    cover: (row.cover as any) || 'grid',
    coverImage,
    body: Array.isArray(row.body) ? row.body : [],
    featured: Boolean(row.featured),
  };
}

export async function fetchArticles(onlyPublished = true): Promise<Article[]> {
  if (supabase && isSupabaseConfigured) {
    try {
      let query = supabase.from('articles').select('*').order('date', { ascending: false });
      if (onlyPublished) {
        query = query.eq('status', 'published');
      }

      const { data, error } = await query;
      if (error) {
        console.warn('[CMS] Failed to fetch articles from Supabase:', error.message);
      } else if (data) {
        setLocalData(LOCAL_STORAGE_KEYS.articles, data as DbArticle[]);
        return (data as DbArticle[]).map(mapDbArticleToArticle);
      }
    } catch (e) {
      console.warn('[CMS] Failed to fetch articles from Supabase, falling back:', e);
    }
  }

  // Local fallback
  const list = getLocalData<DbArticle>(LOCAL_STORAGE_KEYS.articles, initialArticles.map((a, i) => ({
    id: a.id,
    title: a.title,
    category: a.category,
    summary: a.summary,
    date: a.date,
    cover: a.cover,
    cover_image_url: a.coverImage?.fallback ?? null,
    body: a.body,
    featured: a.featured,
    status: 'published',
    sort_order: i,
  })));

  const filtered = onlyPublished ? list.filter((a) => a.status === 'published') : list;
  return filtered.map(mapDbArticleToArticle);
}

export async function fetchAllDbArticles(): Promise<DbArticle[]> {
  if (supabase && isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('date', { ascending: false });
      if (error) {
        console.warn('[CMS] fetchAllDbArticles error:', error.message);
      } else if (data) {
        setLocalData(LOCAL_STORAGE_KEYS.articles, data as DbArticle[]);
        return data as DbArticle[];
      }
    } catch (e) {
      console.warn('[CMS] fetchAllDbArticles error:', e);
    }
  }

  return getLocalData<DbArticle>(LOCAL_STORAGE_KEYS.articles, initialArticles.map((a, i) => ({
    id: a.id,
    title: a.title,
    category: a.category,
    summary: a.summary,
    date: a.date,
    cover: a.cover,
    cover_image_url: a.coverImage?.fallback ?? null,
    body: a.body,
    featured: a.featured,
    status: 'published',
    sort_order: i,
  })));
}

export async function saveArticle(article: DbArticle): Promise<{ success: boolean; error?: string }> {
  article.updated_at = new Date().toISOString();

  if (supabase && isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('articles').upsert(article);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Database write failed' };
    }
  }

  // Local fallback
  const list = await fetchAllDbArticles();
  const idx = list.findIndex((a) => a.id === article.id);
  if (idx >= 0) {
    list[idx] = article;
  } else {
    list.unshift(article);
  }
  setLocalData(LOCAL_STORAGE_KEYS.articles, list);
  return { success: true };
}

export async function deleteArticle(id: string): Promise<{ success: boolean; error?: string }> {
  let coverImageUrl: string | null = null;

  if (supabase && isSupabaseConfigured) {
    try {
      const { data } = await supabase
        .from('articles')
        .select('cover_image_url')
        .eq('id', id)
        .maybeSingle();
      if (data?.cover_image_url) {
        coverImageUrl = data.cover_image_url;
      }
    } catch {
      // Continue
    }

    try {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) return { success: false, error: error.message };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Delete failed' };
    }

    // Clean up Supabase Storage file if stored in site-media
    if (coverImageUrl) {
      const match = coverImageUrl.match(/\/storage\/v1\/object\/public\/site-media\/(.+)$/);
      const filePath = match ? decodeURIComponent(match[1].split('?')[0]) : (coverImageUrl.startsWith('articles/') ? coverImageUrl : null);
      if (filePath) {
        try {
          await supabase.storage.from('site-media').remove([filePath]);
        } catch {
          // ignore
        }
      }
    }
  }

  // Always purge from local storage cache
  const list = getLocalData<DbArticle>(LOCAL_STORAGE_KEYS.articles, []);
  setLocalData(
    LOCAL_STORAGE_KEYS.articles,
    list.filter((a) => a.id !== id)
  );

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('wolvo:content-changed', {
        detail: { type: 'article', id, action: 'delete' },
      })
    );
    try {
      const channel = new BroadcastChannel('wolvo-cms-sync');
      channel.postMessage({ type: 'content-change', entity: 'articles', id, action: 'delete' });
      channel.close();
    } catch {
      // ignore
    }
  }

  return { success: true };
}

// ---------------------------------------------------------------------------
// SERVICES
// ---------------------------------------------------------------------------

export interface DbService {
  id: string;
  title: string;
  short_title: string;
  description: string;
  icon_name: string;
  deliverables: string[];
  href: string;
  image_url: string;
  image_alt: string;
  image_fallback: string;
  status: 'published' | 'draft';
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export function mapDbServiceToService(row: DbService): Service {
  return {
    id: row.id as any,
    title: row.title,
    shortTitle: row.short_title || row.title,
    description: row.description,
    icon: getIconComponent(row.icon_name),
    deliverables: Array.isArray(row.deliverables) ? row.deliverables : [],
    href: row.href || '#contact',
    image: {
      base: row.image_url,
      widths: [],
      fallback: row.image_url || row.image_fallback,
      width: 1200,
      height: 750,
    },
    imageAlt: row.image_alt || row.title,
    imageFallback: row.image_fallback || row.image_url,
  };
}

export async function fetchServices(onlyPublished = true): Promise<Service[]> {
  if (supabase && isSupabaseConfigured) {
    try {
      let query = supabase.from('services').select('*').order('sort_order', { ascending: true });
      if (onlyPublished) {
        query = query.eq('status', 'published');
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return (data as DbService[]).map(mapDbServiceToService);
      }
    } catch (e) {
      console.warn('[CMS] fetchServices error:', e);
    }
  }

  const list = getLocalData<DbService>(LOCAL_STORAGE_KEYS.services, initialServices.map((s, i) => ({
    id: s.id,
    title: s.title,
    short_title: s.shortTitle,
    description: s.description,
    icon_name: s.icon.displayName || s.title.split(' ')[0] || 'Monitor',
    deliverables: s.deliverables,
    href: s.href,
    image_url: s.image.fallback,
    image_alt: s.imageAlt,
    image_fallback: s.imageFallback,
    status: 'published',
    sort_order: i,
  })));

  const filtered = onlyPublished ? list.filter((s) => s.status === 'published') : list;
  return filtered.map(mapDbServiceToService);
}

export async function fetchAllDbServices(): Promise<DbService[]> {
  if (supabase && isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error && data) return data as DbService[];
    } catch (e) {
      console.warn('[CMS] fetchAllDbServices error:', e);
    }
  }

  return getLocalData<DbService>(LOCAL_STORAGE_KEYS.services, initialServices.map((s, i) => ({
    id: s.id,
    title: s.title,
    short_title: s.shortTitle,
    description: s.description,
    icon_name: s.icon.displayName || 'Monitor',
    deliverables: s.deliverables,
    href: s.href,
    image_url: s.image.fallback,
    image_alt: s.imageAlt,
    image_fallback: s.imageFallback,
    status: 'published',
    sort_order: i,
  })));
}

export async function saveService(service: DbService): Promise<{ success: boolean; error?: string }> {
  service.updated_at = new Date().toISOString();

  if (supabase && isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('services').upsert(service);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Database write failed' };
    }
  }

  const list = await fetchAllDbServices();
  const idx = list.findIndex((s) => s.id === service.id);
  if (idx >= 0) {
    list[idx] = service;
  } else {
    list.push(service);
  }
  setLocalData(LOCAL_STORAGE_KEYS.services, list);
  return { success: true };
}

export async function deleteService(id: string): Promise<{ success: boolean; error?: string }> {
  if (supabase && isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Delete failed' };
    }
  }

  const list = await fetchAllDbServices();
  setLocalData(
    LOCAL_STORAGE_KEYS.services,
    list.filter((s) => s.id !== id)
  );
  return { success: true };
}

// ---------------------------------------------------------------------------
// PROJECTS
// ---------------------------------------------------------------------------

export interface DbProject {
  id: string;
  title: string;
  client: string;
  category: string;
  description: string;
  challenge: string;
  solution: string;
  result_metric?: string | null;
  result_label?: string | null;
  overview: string;
  services: string[];
  technologies: string[];
  image?: string | null;
  image_alt?: string | null;
  visual: string;
  href?: string | null;
  featured: boolean;
  placeholder: boolean;
  status: 'published' | 'draft';
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export function mapDbProjectToProject(row: DbProject): Project {
  return {
    id: row.id,
    title: row.title,
    client: row.client,
    category: row.category as any,
    description: row.description,
    challenge: row.challenge,
    solution: row.solution,
    result:
      row.result_metric && row.result_label
        ? { metric: row.result_metric, label: row.result_label }
        : undefined,
    overview: row.overview,
    services: Array.isArray(row.services) ? row.services : [],
    technologies: Array.isArray(row.technologies) ? row.technologies : [],
    image: row.image || undefined,
    imageAlt: row.image_alt || undefined,
    visual: (row.visual as any) || 'commerce',
    href: row.href || undefined,
    featured: Boolean(row.featured),
    placeholder: Boolean(row.placeholder),
  };
}

export async function fetchProjects(onlyPublished = true): Promise<Project[]> {
  if (supabase && isSupabaseConfigured) {
    try {
      let query = supabase.from('projects').select('*').order('sort_order', { ascending: true });
      if (onlyPublished) {
        query = query.eq('status', 'published');
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return (data as DbProject[]).map(mapDbProjectToProject);
      }
    } catch (e) {
      console.warn('[CMS] fetchProjects error:', e);
    }
  }

  const list = getLocalData<DbProject>(LOCAL_STORAGE_KEYS.projects, initialProjects.map((p, i) => ({
    id: p.id,
    title: p.title,
    client: p.client,
    category: p.category,
    description: p.description,
    challenge: p.challenge,
    solution: p.solution,
    result_metric: p.result?.metric ?? null,
    result_label: p.result?.label ?? null,
    overview: p.overview,
    services: p.services,
    technologies: p.technologies,
    image: p.image ?? null,
    image_alt: p.imageAlt ?? null,
    visual: p.visual,
    href: p.href ?? null,
    featured: p.featured,
    placeholder: Boolean(p.placeholder),
    status: 'published',
    sort_order: i,
  })));

  const filtered = onlyPublished ? list.filter((p) => p.status === 'published') : list;
  return filtered.map(mapDbProjectToProject);
}

export async function fetchAllDbProjects(): Promise<DbProject[]> {
  if (supabase && isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error && data) return data as DbProject[];
    } catch (e) {
      console.warn('[CMS] fetchAllDbProjects error:', e);
    }
  }

  return getLocalData<DbProject>(LOCAL_STORAGE_KEYS.projects, initialProjects.map((p, i) => ({
    id: p.id,
    title: p.title,
    client: p.client,
    category: p.category,
    description: p.description,
    challenge: p.challenge,
    solution: p.solution,
    result_metric: p.result?.metric ?? null,
    result_label: p.result?.label ?? null,
    overview: p.overview,
    services: p.services,
    technologies: p.technologies,
    image: p.image ?? null,
    image_alt: p.imageAlt ?? null,
    visual: p.visual,
    href: p.href ?? null,
    featured: p.featured,
    placeholder: Boolean(p.placeholder),
    status: 'published',
    sort_order: i,
  })));
}

export async function saveProject(project: DbProject): Promise<{ success: boolean; error?: string }> {
  project.updated_at = new Date().toISOString();

  if (supabase && isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('projects').upsert(project);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Database write failed' };
    }
  }

  const list = await fetchAllDbProjects();
  const idx = list.findIndex((p) => p.id === project.id);
  if (idx >= 0) {
    list[idx] = project;
  } else {
    list.push(project);
  }
  setLocalData(LOCAL_STORAGE_KEYS.projects, list);
  return { success: true };
}

export async function deleteProject(id: string): Promise<{ success: boolean; error?: string }> {
  if (supabase && isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Delete failed' };
    }
  }

  const list = await fetchAllDbProjects();
  setLocalData(
    LOCAL_STORAGE_KEYS.projects,
    list.filter((p) => p.id !== id)
  );
  return { success: true };
}

// ---------------------------------------------------------------------------
// TESTIMONIALS (CLIENT STORIES)
// ---------------------------------------------------------------------------

export interface DbTestimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar?: string | null;
  quote: string;
  rating?: number | null;
  placeholder: boolean;
  status: 'published' | 'draft';
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export function mapDbTestimonialToTestimonial(row: DbTestimonial): Testimonial {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    company: row.company,
    avatar: row.avatar || undefined,
    quote: row.quote,
    rating: typeof row.rating === 'number' ? row.rating : undefined,
    placeholder: Boolean(row.placeholder),
  };
}

export async function fetchTestimonials(onlyPublished = true): Promise<Testimonial[]> {
  if (supabase && isSupabaseConfigured) {
    try {
      let query = supabase.from('testimonials').select('*').order('sort_order', { ascending: true });
      if (onlyPublished) {
        query = query.eq('status', 'published');
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return (data as DbTestimonial[]).map(mapDbTestimonialToTestimonial);
      }
    } catch (e) {
      console.warn('[CMS] fetchTestimonials error:', e);
    }
  }

  const list = getLocalData<DbTestimonial>(LOCAL_STORAGE_KEYS.testimonials, initialTestimonials.map((t, i) => ({
    id: t.id,
    name: t.name,
    role: t.role,
    company: t.company,
    avatar: t.avatar ?? null,
    quote: t.quote,
    rating: t.rating ?? null,
    placeholder: Boolean(t.placeholder),
    status: 'published',
    sort_order: i,
  })));

  const filtered = onlyPublished ? list.filter((t) => t.status === 'published') : list;
  return filtered.map(mapDbTestimonialToTestimonial);
}

export async function fetchAllDbTestimonials(): Promise<DbTestimonial[]> {
  if (supabase && isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error && data) return data as DbTestimonial[];
    } catch (e) {
      console.warn('[CMS] fetchAllDbTestimonials error:', e);
    }
  }

  return getLocalData<DbTestimonial>(LOCAL_STORAGE_KEYS.testimonials, initialTestimonials.map((t, i) => ({
    id: t.id,
    name: t.name,
    role: t.role,
    company: t.company,
    avatar: t.avatar ?? null,
    quote: t.quote,
    rating: t.rating ?? null,
    placeholder: Boolean(t.placeholder),
    status: 'published',
    sort_order: i,
  })));
}

export async function saveTestimonial(testimonial: DbTestimonial): Promise<{ success: boolean; error?: string }> {
  testimonial.updated_at = new Date().toISOString();

  if (supabase && isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('testimonials').upsert(testimonial);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Database write failed' };
    }
  }

  const list = await fetchAllDbTestimonials();
  const idx = list.findIndex((t) => t.id === testimonial.id);
  if (idx >= 0) {
    list[idx] = testimonial;
  } else {
    list.push(testimonial);
  }
  setLocalData(LOCAL_STORAGE_KEYS.testimonials, list);
  return { success: true };
}

export async function deleteTestimonial(id: string): Promise<{ success: boolean; error?: string }> {
  if (supabase && isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Delete failed' };
    }
  }

  const list = await fetchAllDbTestimonials();
  setLocalData(
    LOCAL_STORAGE_KEYS.testimonials,
    list.filter((t) => t.id !== id)
  );
  return { success: true };
}

// ---------------------------------------------------------------------------
// STORAGE MEDIA
// ---------------------------------------------------------------------------

export const STORAGE_BUCKET = 'site-media';

export interface StorageFile {
  name: string;
  url: string;
  size?: number;
  created_at?: string | null;
}

export async function uploadMediaFile(file: File, folder = 'uploads'): Promise<{ url: string | null; error: string | null }> {
  // Validate file
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return { url: null, error: 'Only images (JPEG, PNG, WebP, SVG, GIF) are allowed.' };
  }

  const maxBytes = 8 * 1024 * 1024; // 8MB
  if (file.size > maxBytes) {
    return { url: null, error: 'File size exceeds maximum limit of 8MB.' };
  }

  if (supabase && isSupabaseConfigured) {
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const cleanName = file.name.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 30);
      const filePath = `${folder}/${Date.now()}-${cleanName}.${ext}`;

      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (error) {
        return { url: null, error: error.message };
      }

      const { data: publicUrlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(data.path);
      return { url: publicUrlData.publicUrl, error: null };
    } catch (err: any) {
      return { url: null, error: err?.message || 'Storage upload failed' };
    }
  }

  // Fallback demo upload using Data URL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ url: reader.result as string, error: null });
    reader.onerror = () => resolve({ url: null, error: 'Failed to read file locally' });
    reader.readAsDataURL(file);
  });
}

export async function listMediaFiles(): Promise<StorageFile[]> {
  if (supabase && isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.storage.from(STORAGE_BUCKET).list('uploads', {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (!error && data) {
        return data.map((item) => {
          const { data: urlData } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(`uploads/${item.name}`);
          return {
            name: item.name,
            url: urlData.publicUrl,
            size: item.metadata?.size,
            created_at: item.created_at,
          };
        });
      }
    } catch (e) {
      console.warn('[CMS Storage] listMediaFiles error:', e);
    }
  }

  return [];
}
