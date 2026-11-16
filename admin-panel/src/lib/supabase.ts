import { createClient } from '@supabase/supabase-js';
import type {
  CMSArticle,
  CMSService,
  CMSProject,
  CMSTestimonial,
  StorageFile,
  AdminUser,
  AuditLog,
} from '@/types/cms';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-anon-key')
);

if (typeof globalThis !== 'undefined' && typeof (globalThis as any).WebSocket === 'undefined') {
  (globalThis as any).WebSocket = class MockWebSocket {};
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// ============================================================================
// Local State Fallback (used when Supabase credentials are not yet configured)
// ============================================================================

const STORAGE_KEYS = {
  articles: 'wolvo_cms_articles',
  services: 'wolvo_cms_services',
  projects: 'wolvo_cms_projects',
  testimonials: 'wolvo_cms_testimonials',
  auditLogs: 'wolvo_cms_audit_logs',
  media: 'wolvo_cms_media_files',
  adminSession: 'wolvo_cms_admin_session',
};

function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors
  }
}

// Initial seed data for fallback mode
const INITIAL_ARTICLES: CMSArticle[] = [
  {
    id: 'website-hardest-working-salesperson',
    slug: 'website-hardest-working-salesperson',
    title: 'Why your website is your hardest-working salesperson',
    excerpt: 'Your website works around the clock. Here’s how speed, clarity and a focused structure turn casual visitors into real enquiries.',
    published_at: '2026-09-22',
    read_time: '4 min read',
    category: 'Web Development',
    tags: ['Web Development', 'Strategy', 'Conversion'],
    visual_kind: 'code',
    cover_image: '/images/photo-article-website-960.jpg',
    author_name: 'Wolvo Editorial',
    author_role: 'Lead',
    is_published: true,
    content: {
      lead: 'Before most clients ever speak to you, they have already visited your website.',
      sections: [
        {
          heading: 'Speed is the first impression',
          paragraphs: [
            'Visitors notice slow pages before they notice your design. Every extra second of loading gives people a reason to leave, especially on mobile connections.',
          ],
        },
        {
          heading: 'Clarity beats cleverness',
          paragraphs: [
            'Your headline should answer three questions immediately: what you do, who it is for and what to do next.',
          ],
        },
      ],
    },
  },
  {
    id: 'native-cross-platform-or-web-app',
    slug: 'native-cross-platform-or-web-app',
    title: 'Native, cross-platform or web app: choosing the right build',
    excerpt: 'The right technology depends on your users, budget and roadmap. A practical guide to choosing how your app should be built.',
    published_at: '2026-09-08',
    read_time: '5 min read',
    category: 'App Development',
    tags: ['App Development', 'Mobile', 'React Native'],
    visual_kind: 'mesh',
    cover_image: '/images/photo-article-app-960.jpg',
    author_name: 'Wolvo Engineering',
    author_role: 'Mobile Lead',
    is_published: true,
    content: {
      lead: 'One of the first decisions in any app project is how to build it.',
      sections: [
        {
          heading: 'Native apps vs Cross-platform',
          paragraphs: [
            'Frameworks like React Native let you write once and deploy to both stores, cutting time to market significantly.',
          ],
        },
      ],
    },
  },
];

const INITIAL_SERVICES: CMSService[] = [
  {
    id: 'web',
    title: 'Web Development',
    description: 'Fast, modern and fully responsive websites and web apps — engineered to load quickly, rank well and turn visitors into enquiries.',
    icon_name: 'Globe',
    deliverables: ['Business websites', 'Landing pages', 'Web apps', 'E-commerce'],
    image_url: '/images/photo-service-web-960.jpg',
    display_order: 1,
    is_active: true,
  },
  {
    id: 'app',
    title: 'App Development',
    description: 'Android, iOS and cross-platform apps with clean interfaces, smooth performance and a launch plan built in.',
    icon_name: 'Smartphone',
    deliverables: ['iOS & Android', 'Cross-platform', 'App UI/UX', 'Store launch'],
    image_url: '/images/photo-service-app-960.jpg',
    display_order: 2,
    is_active: true,
  },
  {
    id: 'ads',
    title: 'Digital Marketing',
    description: 'Meta Ads on Facebook and Instagram built around your goals — setup, targeting, creatives and ongoing optimization that turns spend into leads.',
    icon_name: 'Megaphone',
    deliverables: ['Meta Ads', 'Targeting', 'Ad creatives', 'Optimization'],
    image_url: '/images/photo-service-ads-960.jpg',
    display_order: 3,
    is_active: true,
  },
  {
    id: 'video',
    title: 'Video Editing',
    description: 'Reels, promos and brand videos edited for attention — tight pacing, clean motion graphics and formats for every platform.',
    icon_name: 'Video',
    deliverables: ['Reels & shorts', 'Promo videos', 'Brand films', 'Motion graphics'],
    image_url: '/images/photo-service-video-960.jpg',
    display_order: 4,
    is_active: true,
  },
  {
    id: 'brand',
    title: 'Branding & Design',
    description: 'Logos, visual identities, social creatives and UI/UX design that make your brand look as good as the work behind it.',
    icon_name: 'Palette',
    deliverables: ['Logo & identity', 'Social creatives', 'UI/UX design', 'Brand guidelines'],
    image_url: '/images/photo-service-brand-960.jpg',
    display_order: 5,
    is_active: true,
  },
  {
    id: 'social',
    title: 'Social Media Management',
    description: 'Content calendars, on-brand posts and community management that keep your channels consistent, active and growing — with clear monthly reporting.',
    icon_name: 'Share2',
    deliverables: ['Content calendar', 'Post design', 'Community management', 'Monthly reports'],
    image_url: '/images/photo-service-social-960.jpg',
    display_order: 6,
    is_active: true,
  },
];

const INITIAL_PROJECTS: CMSProject[] = [
  {
    id: 'luxetime-chrono',
    title: 'LuxeTime Chrono — Headless E-Commerce Platform',
    category: 'Website',
    client: 'LuxeTime Watches',
    year: '2026',
    description: 'A lightning-fast headless storefront with custom 3D dial configurator, 1-click checkout, and instant catalog search.',
    challenge: 'Legacy Shopify template suffered 4.2s mobile load times, high checkout drop-offs (68%), and lacked rich product personalization.',
    solution: 'Engineered a bespoke headless Next.js storefront with Stripe 1-click checkout, edge caching, and a real-time product customizer.',
    result_value: '+42%',
    result_label: 'Mobile Checkout Conversion',
    services: ['Web Development', 'UI/UX Design'],
    technologies: ['Next.js', 'React', 'TypeScript', 'Stripe', 'Tailwind CSS'],
    image_url: '/images/projects/ecommerce-storefront.webp',
    visual_kind: 'browser',
    accent_from: '#0066ff',
    accent_to: '#00d2ff',
    featured_on_rail: true,
    is_published: true,
    display_order: 1,
  },
  {
    id: 'aurapulse-fitness',
    title: 'AuraPulse — Biometric Workout & Recovery App',
    category: 'Mobile App',
    client: 'Aura Fitness Co.',
    year: '2026',
    description: 'An offline-first iOS and Android training companion with biometric sync, haptic audio cues, and habit streaks.',
    challenge: 'Needed an iOS & Android MVP shipped in 8 weeks before investor seed rounds, requiring reliable offline logging in gym deadzones.',
    solution: 'Architected a cross-platform React Native app powered by an offline-first SQLite sync engine, Apple HealthKit integration, and smooth dark UI.',
    result_value: '4.9★',
    result_label: 'App Store Rating (14k+ Users)',
    services: ['App Development', 'UI/UX Design'],
    technologies: ['React Native', 'TypeScript', 'Expo', 'Firebase', 'HealthKit'],
    image_url: '/images/projects/fitness-tracking-app.webp',
    visual_kind: 'mobile',
    accent_from: '#10b981',
    accent_to: '#00d2ff',
    featured_on_rail: true,
    is_published: true,
    display_order: 2,
  },
  {
    id: 'scalecraft-meta-ads',
    title: 'ScaleCraft — Full-Funnel B2B Meta Acquisition',
    category: 'Meta Ads',
    client: 'ScaleCraft SaaS',
    year: '2026',
    description: 'Targeted Instagram and Facebook campaign matrix with high-converting mobile lead forms and Conversions API tracking.',
    challenge: 'Client was burning budget at $185 per lead using generic ad graphics with low-intent submissions and zero CRM attribution.',
    solution: 'Designed high-contrast video hooks and motion ad variations, built customized mobile instant lead forms, and implemented server-side Meta CAPI.',
    result_value: '-54%',
    result_label: 'Cost Per Qualified Lead',
    services: ['Digital Marketing', 'Ad Creatives'],
    technologies: ['Meta Ads Manager', 'Conversions API (CAPI)', 'Zapier', 'HubSpot'],
    image_url: '/images/projects/lead-generation-campaign.webp',
    visual_kind: 'analytics',
    accent_from: '#8b5cf6',
    accent_to: '#ec4899',
    featured_on_rail: true,
    is_published: true,
    display_order: 3,
  },
];

const INITIAL_TESTIMONIALS: CMSTestimonial[] = [
  {
    id: 'review-1',
    name: 'Alexandre Mercier',
    role: 'Founder & CEO',
    company: 'LuxeTime Watches',
    quote: 'Wolvo replaced our slow Shopify store with a custom headless build that transformed our sales. Our mobile checkout conversion shot up by 42% in the first quarter.',
    rating: 5,
    avatar_url: '',
    is_approved: true,
    display_order: 1,
  },
  {
    id: 'review-2',
    name: 'Elena Rostova',
    role: 'Head of Product',
    company: 'Aura Fitness',
    quote: 'Shipping an offline-first iOS and Android app in eight weeks sounded impossible until Wolvo took charge. The app has over 14,000 active users and a 4.9-star rating.',
    rating: 5,
    avatar_url: '',
    is_approved: true,
    display_order: 2,
  },
  {
    id: 'review-3',
    name: 'Marcus Vance',
    role: 'VP of Marketing',
    company: 'ScaleCraft',
    quote: 'Working with Wolvo cut our acquisition costs by more than half. Their creative ad angles and clean Meta CAPI setup made our ad budget work twice as hard.',
    rating: 5,
    avatar_url: '',
    is_approved: true,
    display_order: 3,
  },
];

// ============================================================================
// Audit Logging
// ============================================================================

export async function logAdminAction(
  action: AuditLog['action'],
  entity_type: AuditLog['entity_type'],
  entity_id: string,
  entity_title: string,
  user_email: string
): Promise<void> {
  const log: AuditLog = {
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    user_email,
    action,
    entity_type,
    entity_id,
    entity_title,
    timestamp: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('audit_logs').insert([log]);
    } catch {
      // Fallback
    }
  }

  const logs = readLocal<AuditLog[]>(STORAGE_KEYS.auditLogs, []);
  logs.unshift(log);
  writeLocal(STORAGE_KEYS.auditLogs, logs.slice(0, 100));
}

export async function fetchAuditLogs(): Promise<AuditLog[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);
      if (!error && data && data.length > 0) return data as AuditLog[];
    } catch {
      // Fall back
    }
  }
  return readLocal<AuditLog[]>(STORAGE_KEYS.auditLogs, []);
}

// ============================================================================
// Authentication & RBAC
// ============================================================================

export async function loginAdmin(email: string, password: string): Promise<AdminUser> {
  const normalizedEmail = email.trim().toLowerCase();

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error || !data.user) {
      throw new Error(error?.message || 'Authentication failed. Please verify credentials.');
    }

    // Role verification against public.admins
    const { data: adminRecord } = await supabase
      .from('admins')
      .select('role')
      .or(`id.eq.${data.user.id},user_id.eq.${data.user.id}`)
      .maybeSingle();

    if (!adminRecord) {
      const isRoleAdmin =
        data.user.app_metadata?.role === 'admin' ||
        data.user.user_metadata?.role === 'admin';

      if (!isRoleAdmin) {
        // Check if there are ANY admins
        const { count } = await supabase
          .from('admins')
          .select('*', { count: 'exact', head: true });

        if (count === 0) {
          // First user becomes admin
          await supabase.from('admins').insert({
            id: data.user.id,
            user_id: data.user.id,
            email: data.user.email || normalizedEmail,
            role: 'admin',
          });
        } else {
          await supabase.auth.signOut();
          throw new Error('Access denied: your account is not authorized as an administrator.');
        }
      }
    }

    const user: AdminUser = {
      id: data.user.id,
      email: data.user.email || normalizedEmail,
      role: (adminRecord?.role || 'admin') as 'admin',
    };

    writeLocal(STORAGE_KEYS.adminSession, user);
    return user;
  }

  // Local demo fallback
  if (normalizedEmail === 'admin@wolvo.agency' && password === 'admin123') {
    const user: AdminUser = {
      id: 'demo-admin-id',
      email: 'admin@wolvo.agency',
      role: 'superadmin',
    };
    writeLocal(STORAGE_KEYS.adminSession, user);
    return user;
  }

  throw new Error('Invalid credentials. Use admin@wolvo.agency / admin123');
}

export async function registerAdmin(email: string, password: string): Promise<AdminUser> {
  const normalizedEmail = email.trim().toLowerCase();

  if (isSupabaseConfigured && supabase) {
    // 1. Try public.create_admin_user RPC (auto-confirms and assigns admin role)
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc('create_admin_user', {
        p_email: normalizedEmail,
        p_password: password,
      });

      if (!rpcError && rpcData?.success) {
        return await loginAdmin(normalizedEmail, password);
      }
    } catch {
      // Fallback to standard signUp
    }

    // 2. Standard signUp fallback
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: { role: 'admin' },
      },
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('Registration failed.');

    return await loginAdmin(normalizedEmail, password);
  }

  const user: AdminUser = {
    id: `demo-${Date.now()}`,
    email: normalizedEmail,
    role: 'admin',
  };
  writeLocal(STORAGE_KEYS.adminSession, user);
  return user;
}

export async function logoutAdmin(): Promise<void> {
  localStorage.removeItem(STORAGE_KEYS.adminSession);
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore network errors
    }
  }
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  if (isSupabaseConfigured && supabase) {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      localStorage.removeItem(STORAGE_KEYS.adminSession);
      return null;
    }

    // Check cached session first for instantaneous loading
    const cached = readLocal<AdminUser | null>(STORAGE_KEYS.adminSession, null);
    if (cached && cached.id === session.user.id) {
      return cached;
    }

    // Verify against public.admins table
    try {
      const { data: adminRecord } = await supabase
        .from('admins')
        .select('role')
        .or(`id.eq.${session.user.id},user_id.eq.${session.user.id}`)
        .maybeSingle();

      const isRoleAdmin =
        adminRecord?.role === 'admin' ||
        session.user.app_metadata?.role === 'admin' ||
        session.user.user_metadata?.role === 'admin';

      if (isRoleAdmin) {
        const user: AdminUser = {
          id: session.user.id,
          email: session.user.email || '',
          role: (adminRecord?.role || 'admin') as 'admin',
        };
        writeLocal(STORAGE_KEYS.adminSession, user);
        return user;
      }
    } catch {
      // If table query momentarily fails, allow cached user if session is valid
      if (cached) return cached;
    }

    return null;
  }

  return readLocal<AdminUser | null>(STORAGE_KEYS.adminSession, null);
}

// ============================================================================
// Storage Path Helper & Event Broadcast
// ============================================================================

export function extractStoragePath(url: string | null | undefined): string | null {
  if (!url) return null;
  const match = url.match(/\/storage\/v1\/object\/public\/site-media\/(.+)$/);
  if (match) {
    const rawPath = match[1].split('?')[0];
    return decodeURIComponent(rawPath);
  }
  if (/^(articles|uploads|projects|services|avatars)\//.test(url)) {
    return url.split('?')[0];
  }
  return null;
}

function broadcastContentChange(entity: string, id: string, action: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('wolvo:content-changed', {
        detail: { type: entity, id, action },
      })
    );
    try {
      const channel = new BroadcastChannel('wolvo-cms-sync');
      channel.postMessage({ type: 'content-change', entity, id, action });
      channel.close();
    } catch {
      // BroadcastChannel not available in all environments
    }
  }
}

// ============================================================================
// Articles CRUD (Maps to public.articles)
// ============================================================================

export async function fetchArticles(): Promise<CMSArticle[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.warn('[CMS] Failed to fetch articles from Supabase:', error.message);
    } else if (data) {
      const mapped: CMSArticle[] = data.map((row: any) => ({
        id: row.id,
        slug: row.id,
        title: row.title,
        excerpt: row.summary || '',
        published_at: row.date || new Date().toISOString().split('T')[0],
        read_time: '5 min read',
        category: row.category || 'Web Development',
        tags: [row.category || 'Web Development'],
        visual_kind: (row.cover as any) || 'code',
        cover_image: row.cover_image_url || '',
        author_name: 'Wolvo Editorial',
        author_role: 'Lead',
        is_published: row.status === 'published',
        content: {
          lead: row.summary || '',
          sections: Array.isArray(row.body) ? row.body : [],
        },
        created_at: row.created_at,
        updated_at: row.updated_at,
      }));
      writeLocal(STORAGE_KEYS.articles, mapped);
      return mapped;
    }
  }
  return readLocal<CMSArticle[]>(STORAGE_KEYS.articles, INITIAL_ARTICLES);
}

export async function saveArticle(article: CMSArticle, userEmail: string): Promise<CMSArticle> {
  const isNew = !article.id || article.id.startsWith('new-');
  const now = new Date().toISOString();
  const id = isNew ? (article.slug || `art-${Date.now()}`) : article.id;

  const toSave: CMSArticle = {
    ...article,
    id,
    slug: id,
    updated_at: now,
    created_at: article.created_at || now,
  };

  if (isSupabaseConfigured && supabase) {
    const dbRow = {
      id,
      title: article.title,
      category: article.category || 'Web Development',
      summary: article.excerpt || article.content?.lead || '',
      date: article.published_at || new Date().toISOString().split('T')[0],
      cover: article.visual_kind || 'grid',
      cover_image_url: article.cover_image || null,
      body: article.content?.sections || [],
      featured: Boolean(article.is_published),
      status: article.is_published ? 'published' : 'draft',
      sort_order: 1,
      updated_at: now,
    };

    const { error } = await supabase.from('articles').upsert(dbRow);
    if (error) throw new Error(error.message);
    broadcastContentChange('articles', id, isNew ? 'create' : 'update');
    await logAdminAction(isNew ? 'create' : 'update', 'article', id, article.title, userEmail);
    return toSave;
  }

  const list = readLocal<CMSArticle[]>(STORAGE_KEYS.articles, INITIAL_ARTICLES);
  const idx = list.findIndex((a) => a.id === toSave.id);
  if (idx >= 0) {
    list[idx] = toSave;
  } else {
    list.unshift(toSave);
  }
  writeLocal(STORAGE_KEYS.articles, list);
  broadcastContentChange('articles', id, isNew ? 'create' : 'update');
  await logAdminAction(isNew ? 'create' : 'update', 'article', toSave.id, toSave.title, userEmail);
  return toSave;
}

export async function deleteArticle(
  id: string,
  userEmail: string,
  coverImageUrl?: string
): Promise<void> {
  let targetCoverImage = coverImageUrl;

  // 1. If coverImageUrl is not supplied, look it up from database
  if (!targetCoverImage && isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase
        .from('articles')
        .select('cover_image_url')
        .eq('id', id)
        .maybeSingle();
      if (data?.cover_image_url) {
        targetCoverImage = data.cover_image_url;
      }
    } catch {
      // continue
    }
  }

  // 2. Permanently delete from Supabase Database
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (error) throw new Error(`Supabase database error: ${error.message}`);
  }

  // 3. Permanently remove associated storage file from Supabase Storage
  if (targetCoverImage) {
    const storagePath = extractStoragePath(targetCoverImage);
    if (storagePath) {
      try {
        await deleteMediaFile(storagePath);
      } catch (mediaErr) {
        console.warn(`[CMS] Notice: could not remove storage file ${storagePath}:`, mediaErr);
      }
    }
  }

  // 4. Purge from local storage caches
  const list = readLocal<CMSArticle[]>(STORAGE_KEYS.articles, []);
  writeLocal(STORAGE_KEYS.articles, list.filter((a) => a.id !== id));

  try {
    const pubList = readLocal<any[]>('wolvo_public_articles', []);
    if (Array.isArray(pubList)) {
      writeLocal('wolvo_public_articles', pubList.filter((a) => a.id !== id));
    }
  } catch {
    // ignore
  }

  // 5. Broadcast synchronization across all open browser windows and tabs
  broadcastContentChange('articles', id, 'delete');

  // 6. Audit log
  await logAdminAction('delete', 'article', id, `Article ${id}`, userEmail);
}

// ============================================================================
// Services CRUD (Maps to public.services)
// ============================================================================

export async function fetchServices(): Promise<CMSService[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.warn('[CMS] Failed to fetch services from Supabase:', error.message);
    } else if (data) {
      const mapped: CMSService[] = data.map((row: any) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        icon_name: row.icon_name || 'Globe',
        deliverables: Array.isArray(row.deliverables) ? row.deliverables : [],
        image_url: row.image_url || '',
        display_order: row.sort_order ?? 1,
        is_active: row.status === 'published',
        created_at: row.created_at,
        updated_at: row.updated_at,
      }));
      writeLocal(STORAGE_KEYS.services, mapped);
      return mapped;
    }
  }
  return readLocal<CMSService[]>(STORAGE_KEYS.services, INITIAL_SERVICES);
}

export async function saveService(service: CMSService, userEmail: string): Promise<CMSService> {
  const isNew = !service.id || service.id.startsWith('new-');
  const now = new Date().toISOString();
  const id = isNew ? `srv-${Date.now()}` : service.id;

  const toSave: CMSService = {
    ...service,
    id,
    updated_at: now,
    created_at: service.created_at || now,
  };

  if (isSupabaseConfigured && supabase) {
    const dbRow = {
      id,
      title: service.title,
      short_title: service.title.split(' ')[0] || service.title,
      description: service.description,
      icon_name: service.icon_name || 'Monitor',
      deliverables: service.deliverables || [],
      href: '#contact',
      image_url: service.image_url || null,
      image_alt: service.title,
      image_fallback: service.image_url || null,
      status: service.is_active ? 'published' : 'draft',
      sort_order: service.display_order ?? 1,
      updated_at: now,
    };

    const { error } = await supabase.from('services').upsert(dbRow);
    if (error) throw new Error(error.message);
    broadcastContentChange('services', id, isNew ? 'create' : 'update');
    await logAdminAction(isNew ? 'create' : 'update', 'service', id, service.title, userEmail);
    return toSave;
  }

  const list = readLocal<CMSService[]>(STORAGE_KEYS.services, INITIAL_SERVICES);
  const idx = list.findIndex((s) => s.id === toSave.id);
  if (idx >= 0) {
    list[idx] = toSave;
  } else {
    list.push(toSave);
  }
  writeLocal(STORAGE_KEYS.services, list);
  broadcastContentChange('services', id, isNew ? 'create' : 'update');
  await logAdminAction(isNew ? 'create' : 'update', 'service', toSave.id, toSave.title, userEmail);
  return toSave;
}

export async function deleteService(id: string, userEmail: string, imageUrl?: string): Promise<void> {
  let targetImage = imageUrl;

  if (!targetImage && isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase.from('services').select('image_url').eq('id', id).maybeSingle();
      if (data?.image_url) targetImage = data.image_url;
    } catch {
      // continue
    }
  }

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }

  if (targetImage) {
    const storagePath = extractStoragePath(targetImage);
    if (storagePath) {
      try {
        await deleteMediaFile(storagePath);
      } catch {
        // ignore
      }
    }
  }

  const list = readLocal<CMSService[]>(STORAGE_KEYS.services, []);
  writeLocal(STORAGE_KEYS.services, list.filter((s) => s.id !== id));
  broadcastContentChange('services', id, 'delete');
  await logAdminAction('delete', 'service', id, `Service ${id}`, userEmail);
}

// ============================================================================
// Projects CRUD (Maps to public.projects)
// ============================================================================

export async function fetchProjects(): Promise<CMSProject[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.warn('[CMS] Failed to fetch projects from Supabase:', error.message);
    } else if (data) {
      const mapped: CMSProject[] = data.map((row: any) => ({
        id: row.id,
        title: row.title,
        category: row.category || 'Website',
        client: row.client || '',
        year: '2026',
        description: row.description || '',
        challenge: row.challenge || '',
        solution: row.solution || '',
        result_value: row.result_metric || '+40%',
        result_label: row.result_label || 'Conversion rate',
        services: Array.isArray(row.services) ? row.services : ['Web Development'],
        technologies: Array.isArray(row.technologies) ? row.technologies : ['React', 'TypeScript'],
        image_url: row.image || '',
        visual_kind: (row.visual as any) || 'browser',
        accent_from: '#0066ff',
        accent_to: '#00d2ff',
        featured_on_rail: Boolean(row.featured),
        is_published: row.status === 'published',
        display_order: row.sort_order ?? 1,
        created_at: row.created_at,
        updated_at: row.updated_at,
      }));
      writeLocal(STORAGE_KEYS.projects, mapped);
      return mapped;
    }
  }
  return readLocal<CMSProject[]>(STORAGE_KEYS.projects, INITIAL_PROJECTS);
}

export async function saveProject(project: CMSProject, userEmail: string): Promise<CMSProject> {
  const isNew = !project.id || project.id.startsWith('new-');
  const now = new Date().toISOString();
  const id = isNew ? `proj-${Date.now()}` : project.id;

  const toSave: CMSProject = {
    ...project,
    id,
    updated_at: now,
    created_at: project.created_at || now,
  };

  if (isSupabaseConfigured && supabase) {
    const dbRow = {
      id,
      title: project.title,
      client: project.client || 'Client',
      category: project.category || 'Website',
      description: project.description,
      challenge: project.challenge || '',
      solution: project.solution || '',
      result_metric: project.result_value || null,
      result_label: project.result_label || null,
      overview: project.description,
      services: project.services || [],
      technologies: project.technologies || [],
      image: project.image_url || null,
      image_alt: project.title,
      visual: project.visual_kind || 'commerce',
      href: '#',
      featured: Boolean(project.featured_on_rail),
      placeholder: false,
      status: project.is_published ? 'published' : 'draft',
      sort_order: project.display_order ?? 1,
      updated_at: now,
    };

    const { error } = await supabase.from('projects').upsert(dbRow);
    if (error) throw new Error(error.message);
    broadcastContentChange('projects', id, isNew ? 'create' : 'update');
    await logAdminAction(isNew ? 'create' : 'update', 'project', id, project.title, userEmail);
    return toSave;
  }

  const list = readLocal<CMSProject[]>(STORAGE_KEYS.projects, INITIAL_PROJECTS);
  const idx = list.findIndex((p) => p.id === toSave.id);
  if (idx >= 0) {
    list[idx] = toSave;
  } else {
    list.push(toSave);
  }
  writeLocal(STORAGE_KEYS.projects, list);
  broadcastContentChange('projects', id, isNew ? 'create' : 'update');
  await logAdminAction(isNew ? 'create' : 'update', 'project', toSave.id, toSave.title, userEmail);
  return toSave;
}

export async function deleteProject(id: string, userEmail: string, imageUrl?: string): Promise<void> {
  let targetImage = imageUrl;

  if (!targetImage && isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase.from('projects').select('image').eq('id', id).maybeSingle();
      if (data?.image) targetImage = data.image;
    } catch {
      // continue
    }
  }

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }

  if (targetImage) {
    const storagePath = extractStoragePath(targetImage);
    if (storagePath) {
      try {
        await deleteMediaFile(storagePath);
      } catch {
        // ignore
      }
    }
  }

  const list = readLocal<CMSProject[]>(STORAGE_KEYS.projects, []);
  writeLocal(STORAGE_KEYS.projects, list.filter((p) => p.id !== id));
  broadcastContentChange('projects', id, 'delete');
  await logAdminAction('delete', 'project', id, `Project ${id}`, userEmail);
}

// ============================================================================
// Testimonials CRUD (Maps to public.testimonials)
// ============================================================================

export async function fetchTestimonials(): Promise<CMSTestimonial[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.warn('[CMS] Failed to fetch testimonials from Supabase:', error.message);
    } else if (data) {
      const mapped: CMSTestimonial[] = data.map((row: any) => ({
        id: row.id,
        name: row.name,
        role: row.role || 'Client',
        company: row.company || '',
        quote: row.quote,
        rating: Number(row.rating) || 5,
        avatar_url: row.avatar || '',
        is_approved: row.status === 'published',
        display_order: row.sort_order ?? 1,
        created_at: row.created_at,
        updated_at: row.updated_at,
      }));
      writeLocal(STORAGE_KEYS.testimonials, mapped);
      return mapped;
    }
  }
  return readLocal<CMSTestimonial[]>(STORAGE_KEYS.testimonials, INITIAL_TESTIMONIALS);
}

export async function saveTestimonial(testimonial: CMSTestimonial, userEmail: string): Promise<CMSTestimonial> {
  const isNew = !testimonial.id || testimonial.id.startsWith('new-');
  const now = new Date().toISOString();
  const id = isNew ? `test-${Date.now()}` : testimonial.id;

  const toSave: CMSTestimonial = {
    ...testimonial,
    id,
    updated_at: now,
    created_at: testimonial.created_at || now,
  };

  if (isSupabaseConfigured && supabase) {
    const dbRow = {
      id,
      name: testimonial.name,
      role: testimonial.role || 'Client',
      company: testimonial.company || 'Company',
      avatar: testimonial.avatar_url || null,
      quote: testimonial.quote,
      rating: testimonial.rating || 5,
      placeholder: false,
      status: testimonial.is_approved ? 'published' : 'draft',
      sort_order: testimonial.display_order ?? 1,
      updated_at: now,
    };

    const { error } = await supabase.from('testimonials').upsert(dbRow);
    if (error) throw new Error(error.message);
    broadcastContentChange('testimonials', id, isNew ? 'create' : 'update');
    await logAdminAction(isNew ? 'create' : 'update', 'testimonial', id, testimonial.name, userEmail);
    return toSave;
  }

  const list = readLocal<CMSTestimonial[]>(STORAGE_KEYS.testimonials, INITIAL_TESTIMONIALS);
  const idx = list.findIndex((t) => t.id === toSave.id);
  if (idx >= 0) {
    list[idx] = toSave;
  } else {
    list.push(toSave);
  }
  writeLocal(STORAGE_KEYS.testimonials, list);
  broadcastContentChange('testimonials', id, isNew ? 'create' : 'update');
  await logAdminAction(isNew ? 'create' : 'update', 'testimonial', toSave.id, toSave.name, userEmail);
  return toSave;
}

export async function deleteTestimonial(id: string, userEmail: string, avatarUrl?: string): Promise<void> {
  let targetAvatar = avatarUrl;

  if (!targetAvatar && isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase.from('testimonials').select('avatar').eq('id', id).maybeSingle();
      if (data?.avatar) targetAvatar = data.avatar;
    } catch {
      // continue
    }
  }

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }

  if (targetAvatar) {
    const storagePath = extractStoragePath(targetAvatar);
    if (storagePath) {
      try {
        await deleteMediaFile(storagePath);
      } catch {
        // ignore
      }
    }
  }

  const list = readLocal<CMSTestimonial[]>(STORAGE_KEYS.testimonials, []);
  writeLocal(STORAGE_KEYS.testimonials, list.filter((t) => t.id !== id));
  broadcastContentChange('testimonials', id, 'delete');
  await logAdminAction('delete', 'testimonial', id, `Testimonial ${id}`, userEmail);
}

// ============================================================================
// Media Management (Supabase Storage: site-media bucket)
// ============================================================================

const BUCKET_NAME = 'site-media';

export async function uploadMediaFile(file: File, folder = 'uploads'): Promise<string> {
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `${folder}/${Date.now()}-${sanitizedName}`;

  if (isSupabaseConfigured && supabase) {
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (uploadError) throw new Error(uploadError.message);

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
    return data.publicUrl;
  }

  // Local storage demo fallback
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const mediaFiles = readLocal<StorageFile[]>(STORAGE_KEYS.media, []);
      mediaFiles.unshift({
        name: file.name,
        id: `media-${Date.now()}`,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        publicUrl: dataUrl,
      });
      writeLocal(STORAGE_KEYS.media, mediaFiles);
      resolve(dataUrl);
    };
    reader.onerror = () => reject(new Error('Failed to read file locally'));
    reader.readAsDataURL(file);
  });
}

export async function listMediaFiles(folder = 'uploads'): Promise<StorageFile[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.storage.from(BUCKET_NAME).list(folder, {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' },
    });

    if (error) throw new Error(error.message);

    return (data || []).map((f) => {
      const publicUrl = supabase!.storage.from(BUCKET_NAME).getPublicUrl(`${folder}/${f.name}`).data.publicUrl;
      return {
        ...f,
        publicUrl,
      };
    });
  }

  return readLocal<StorageFile[]>(STORAGE_KEYS.media, []);
}

export async function deleteMediaFile(pathOrName: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([pathOrName]);
    if (error) throw new Error(error.message);
  } else {
    const mediaFiles = readLocal<StorageFile[]>(STORAGE_KEYS.media, []);
    writeLocal(STORAGE_KEYS.media, mediaFiles.filter((f) => f.name !== pathOrName && f.publicUrl !== pathOrName));
  }
}
