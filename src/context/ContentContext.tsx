import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Article, Project, Service, Testimonial } from '@/types/content';
import {
  fetchArticles,
  fetchProjects,
  fetchServices,
  fetchTestimonials,
  isSupabaseConfigured,
  supabase,
} from '@/lib/supabase';
import { articles as defaultArticles } from '@/data/articles';
import { services as defaultServices } from '@/data/services';
import { projects as defaultProjects } from '@/data/projects';
import { testimonials as defaultTestimonials } from '@/data/testimonials';

interface ContentContextValue {
  articles: Article[];
  services: Service[];
  projects: Project[];
  testimonials: Testimonial[];
  featuredArticle?: Article;
  secondaryArticles: Article[];
  featuredProjects: Project[];
  articleCategories: string[];
  projectCategories: string[];
  loading: boolean;
  refresh: () => Promise<void>;
  getArticle: (id: string) => Article | undefined;
  getProject: (id: string) => Project | undefined;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<Article[]>(defaultArticles);
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const [fetchedArticles, fetchedServices, fetchedProjects, fetchedTestimonials] =
        await Promise.all([
          fetchArticles(true),
          fetchServices(true),
          fetchProjects(true),
          fetchTestimonials(true),
        ]);

      setArticles(fetchedArticles);
      setServices(fetchedServices);
      setProjects(fetchedProjects);
      setTestimonials(fetchedTestimonials);
    } catch (err) {
      console.warn('[ContentProvider] Failed to refresh dynamic content:', err);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    refresh().finally(() => setLoading(false));

    // Listen to local CMS update events
    const onLocalChange = () => {
      refresh();
    };
    window.addEventListener('wolvo:content-changed', onLocalChange);

    // Cross-tab broadcast channel for immediate multi-tab sync
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('wolvo-cms-sync');
      bc.onmessage = () => {
        refresh();
      };
    } catch {
      // BroadcastChannel not available in all envs
    }

    // If Supabase is connected, set up Realtime subscription
    let channel: any = null;
    if (supabase && isSupabaseConfigured) {
      try {
        channel = supabase
          .channel('public-cms-sync')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'articles' },
            () => refresh()
          )
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'services' },
            () => refresh()
          )
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'projects' },
            () => refresh()
          )
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'testimonials' },
            () => refresh()
          )
          .subscribe();
      } catch (e) {
        console.warn('[ContentProvider] Realtime setup warning:', e);
      }
    }

    return () => {
      window.removeEventListener('wolvo:content-changed', onLocalChange);
      if (bc) {
        bc.close();
      }
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [refresh]);

  const featuredArticle = useMemo(
    () => (articles.length > 0 ? (articles.find((a) => a.featured) ?? articles[0]) : undefined),
    [articles]
  );

  const secondaryArticles = useMemo(
    () => (featuredArticle ? articles.filter((a) => a.id !== featuredArticle.id).slice(0, 3) : []),
    [articles, featuredArticle]
  );

  const featuredProjects = useMemo(() => {
    const feat = projects.filter((p) => p.featured);
    return feat.length > 0 ? feat : projects;
  }, [projects]);

  const articleCategories = useMemo(
    () => Array.from(new Set(articles.map((a) => a.category))),
    [articles]
  );

  const projectCategories = useMemo(
    () => Array.from(new Set(projects.map((p) => p.category))),
    [projects]
  );

  const getArticle = useCallback((id: string) => articles.find((a) => a.id === id), [articles]);
  const getProject = useCallback((id: string) => projects.find((p) => p.id === id), [projects]);

  const value = useMemo<ContentContextValue>(
    () => ({
      articles,
      services,
      projects,
      testimonials,
      featuredArticle,
      secondaryArticles,
      featuredProjects,
      articleCategories,
      projectCategories,
      loading,
      refresh,
      getArticle,
      getProject,
    }),
    [
      articles,
      services,
      projects,
      testimonials,
      featuredArticle,
      secondaryArticles,
      featuredProjects,
      articleCategories,
      projectCategories,
      loading,
      refresh,
      getArticle,
      getProject,
    ]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent(): ContentContextValue {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return ctx;
}
