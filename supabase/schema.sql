-- ============================================================================
-- WOLVO AGENCY CMS — SUPABASE DATABASE SCHEMA & RLS POLICIES
-- ============================================================================
-- Run this complete script in your Supabase project's SQL Editor
-- (Dashboard -> SQL Editor -> New Query -> Run)
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. ADMINS TABLE (Role-Based Access Control)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Admins policy: authenticated admins can view and manage the admins table
CREATE POLICY "Admins can view admins list"
  ON public.admins
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id OR
    EXISTS (SELECT 1 FROM public.admins a WHERE a.id = auth.uid() AND a.role = 'admin')
  );

-- Helper function to check if the current requester is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid() AND role = 'admin') OR
    (auth.jwt() ->> 'role') = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- 2. ARTICLES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Web Development',
  summary TEXT NOT NULL,
  date TEXT NOT NULL,
  cover TEXT NOT NULL DEFAULT 'grid',
  cover_image_url TEXT,
  body JSONB NOT NULL DEFAULT '[]'::jsonb,
  featured BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published articles"
  ON public.articles
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Admins have full access to articles"
  ON public.articles
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- 3. SERVICES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  short_title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'Monitor',
  deliverables JSONB NOT NULL DEFAULT '[]'::jsonb,
  href TEXT NOT NULL DEFAULT '#contact',
  image_url TEXT,
  image_alt TEXT,
  image_fallback TEXT,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published services"
  ON public.services
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Admins have full access to services"
  ON public.services
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- 4. PROJECTS (CASE STUDIES) TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  client TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Website',
  description TEXT NOT NULL,
  challenge TEXT NOT NULL DEFAULT '',
  solution TEXT NOT NULL DEFAULT '',
  result_metric TEXT,
  result_label TEXT,
  overview TEXT NOT NULL DEFAULT '',
  services JSONB NOT NULL DEFAULT '[]'::jsonb,
  technologies JSONB NOT NULL DEFAULT '[]'::jsonb,
  image TEXT,
  image_alt TEXT,
  visual TEXT NOT NULL DEFAULT 'commerce',
  href TEXT,
  featured BOOLEAN NOT NULL DEFAULT true,
  placeholder BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published projects"
  ON public.projects
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Admins have full access to projects"
  ON public.projects
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- 5. TESTIMONIALS (CLIENT STORIES) TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Client',
  company TEXT NOT NULL DEFAULT 'Company',
  avatar TEXT,
  quote TEXT NOT NULL,
  rating NUMERIC(2,1),
  placeholder BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published testimonials"
  ON public.testimonials
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Admins have full access to testimonials"
  ON public.testimonials
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- 6. STORAGE BUCKET FOR MEDIA UPLOADS
-- ----------------------------------------------------------------------------
-- Create public storage bucket `site-media`
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-media', 'site-media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to media files
CREATE POLICY "Public can view site-media files"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'site-media');

-- Allow authenticated admins to upload and delete files
CREATE POLICY "Admins can upload to site-media"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'site-media');

CREATE POLICY "Admins can update and delete in site-media"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'site-media');

-- ----------------------------------------------------------------------------
-- 7. REALTIME REPLICATION SETUP
-- ----------------------------------------------------------------------------
-- Enable Supabase Realtime broadcasting on CMS tables
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'articles'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.articles;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'services'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.services;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'projects'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'testimonials'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.testimonials;
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 8. INITIAL SEED DATA
-- ----------------------------------------------------------------------------

-- Seed Services
INSERT INTO public.services (id, title, short_title, description, icon_name, deliverables, href, image_url, image_alt, image_fallback, status, sort_order)
VALUES
  ('web', 'Web Development', 'Web', 'Fast, modern and fully responsive websites and web apps — engineered to load quickly, rank well and turn visitors into enquiries.', 'Monitor', '["Business websites", "Landing pages", "Web apps", "E-commerce"]'::jsonb, '#contact', '/images/photo-service-web-960.jpg', 'A landing page open in a browser on a desktop monitor', '/images/photo-service-web-960.jpg', 'published', 1),
  ('app', 'App Development', 'App', 'Android, iOS and cross-platform apps with clean interfaces, smooth performance and a launch plan built in.', 'Smartphone', '["iOS & Android", "Cross-platform", "App UI/UX", "Store launch"]'::jsonb, '#contact', '/images/photo-service-app-960.jpg', 'A hand holding a smartphone running a weather and activity app', '/images/photo-service-app-960.jpg', 'published', 2),
  ('ads', 'Digital Marketing', 'Marketing', 'Meta Ads on Facebook and Instagram built around your goals — setup, targeting, creatives and ongoing optimization that turns spend into leads.', 'Megaphone', '["Meta Ads", "Targeting", "Ad creatives", "Optimization"]'::jsonb, '#contact', '/images/photo-service-ads-960.jpg', 'A dark analytics dashboard with traffic charts and conversion metrics', '/images/photo-service-ads-960.jpg', 'published', 3),
  ('video', 'Video Editing', 'Video', 'Reels, promos and brand videos edited for attention — tight pacing, clean motion graphics and formats for every platform.', 'Clapperboard', '["Reels & shorts", "Promo videos", "Brand films", "Motion graphics"]'::jsonb, '#contact', '/images/photo-service-video-960.jpg', 'Close-up of a video editing timeline with clips and transitions', '/images/photo-service-video-960.jpg', 'published', 4),
  ('brand', 'Branding & Design', 'Branding', 'Logos, visual identities, social creatives and UI/UX design that make your brand look as good as the work behind it.', 'PenTool', '["Logo & identity", "Social creatives", "UI/UX design", "Brand guidelines"]'::jsonb, '#contact', '/images/photo-service-brand-960.jpg', 'A letter A sketched on a drawing tablet next to a stylus', '/images/photo-service-brand-960.jpg', 'published', 5),
  ('social', 'Social Media Management', 'Social', 'Content calendars, on-brand posts and community management that keep your channels consistent, active and growing — with clear monthly reporting.', 'Share2', '["Content calendar", "Post design", "Community management", "Monthly reports"]'::jsonb, '#contact', '/images/photo-service-social-960.jpg', 'A hand holding up a phone showing a social media profile grid', '/images/photo-service-social-960.jpg', 'published', 6)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  short_title = EXCLUDED.short_title,
  description = EXCLUDED.description;

-- Seed Projects
INSERT INTO public.projects (id, title, client, category, description, challenge, solution, result_metric, result_label, overview, services, technologies, image, visual, featured, status, sort_order)
VALUES
  (
    'luxetime-chrono',
    'LuxeTime Chrono — Headless E-Commerce Platform',
    'LuxeTime Watches',
    'Website',
    'A lightning-fast headless storefront with custom 3D dial configurator, 1-click checkout, and instant catalog search.',
    'Legacy Shopify template suffered 4.2s mobile load times, high checkout drop-offs (68%), and lacked rich product personalization.',
    'Engineered a bespoke headless Next.js storefront with Stripe 1-click checkout, edge caching, and a real-time product customizer.',
    '+42%',
    'Mobile Checkout Conversion',
    'LuxeTime needed to elevate their digital boutique to match the precision of their horology. We replaced their monolithic template with a headless Next.js architecture deployed to the edge. With sub-second page transitions, a frictionless cart drawer, and optimized media pipelines, customers enjoy an instant luxury purchasing journey on every device.',
    '["Web Development", "UI/UX Design"]'::jsonb,
    '["Next.js", "React", "TypeScript", "Stripe", "Tailwind CSS"]'::jsonb,
    '/images/projects/ecommerce-storefront.webp',
    'commerce',
    true,
    'published',
    1
  ),
  (
    'aurapulse-fitness',
    'AuraPulse — Biometric Workout & Recovery App',
    'Aura Fitness Co.',
    'Mobile App',
    'An offline-first iOS and Android training companion with biometric sync, haptic audio cues, and habit streaks.',
    'Needed an iOS & Android MVP shipped in 8 weeks before investor seed rounds, requiring reliable offline logging in gym deadzones.',
    'Architected a cross-platform React Native app powered by an offline-first SQLite sync engine, Apple HealthKit integration, and smooth dark UI.',
    '4.9★',
    'App Store Rating (14k+ Users)',
    'Aura Fitness wanted a minimalist, non-distracting training companion that lifters and runners could rely on even underground. We designed and shipped AuraPulse for iOS and Android using a shared React Native codebase, integrating seamless HealthKit synchronization and persistent local data storage that syncs quietly when connection returns.',
    '["App Development", "UI/UX Design"]'::jsonb,
    '["React Native", "TypeScript", "Expo", "Firebase", "HealthKit"]'::jsonb,
    '/images/projects/fitness-tracking-app.webp',
    'fitness',
    true,
    'published',
    2
  ),
  (
    'scalecraft-meta-ads',
    'ScaleCraft — Full-Funnel B2B Meta Acquisition',
    'ScaleCraft SaaS',
    'Meta Ads',
    'Targeted Instagram and Facebook campaign matrix with high-converting mobile lead forms and Conversions API tracking.',
    'Client was burning budget at $185 per lead using generic ad graphics with low-intent submissions and zero CRM attribution.',
    'Designed high-contrast video hooks and motion ad variations, built customized mobile instant lead forms, and implemented server-side Meta CAPI.',
    '-54%',
    'Cost Per Qualified Lead',
    'To scale customer acquisition without diluting lead quality, we audited ScaleCraft’s entire ad funnel. We produced 18 tailored creative assets testing different value angles, introduced qualification questions inside native Meta lead forms to weed out spam, and connected server-side CAPI for clean algorithmic attribution.',
    '["Digital Marketing", "Ad Creatives"]'::jsonb,
    '["Meta Ads Manager", "Conversions API (CAPI)", "Zapier", "HubSpot"]'::jsonb,
    '/images/projects/lead-generation-campaign.webp',
    'ads',
    true,
    'published',
    3
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  client = EXCLUDED.client;

-- Seed Articles
INSERT INTO public.articles (id, title, category, summary, date, cover, cover_image_url, body, featured, status, sort_order)
VALUES
  (
    'website-hardest-working-salesperson',
    'Why your website is your hardest-working salesperson',
    'Web Development',
    'Your website works around the clock. Here’s how speed, clarity and a focused structure turn casual visitors into real enquiries.',
    '2026-09-22',
    'grid',
    '/images/photo-article-website-960.jpg',
    '[
      {"paragraphs": ["Before most clients ever speak to you, they have already visited your website. In a few seconds they decide whether you look credible, whether you understand their problem and whether it is worth getting in touch. That makes your website less of a brochure and more of a salesperson: one that never takes a day off."]},
      {"heading": "Speed is the first impression", "paragraphs": ["Visitors notice slow pages before they notice your design. Every extra second of loading gives people a reason to leave, especially on mobile connections. Optimized images, lean code and good hosting are not technical extras; they are the foundation everything else stands on."]},
      {"heading": "Clarity beats cleverness", "paragraphs": ["Your headline should answer three questions immediately: what you do, who it is for and what to do next. Clever taglines can work, but only after the basics are obvious. If a visitor has to scroll to understand your offer, many simply will not."]},
      {"heading": "Structure pages around decisions", "paragraphs": ["Great websites guide visitors through a simple story: the problem, your solution, proof that you can deliver and a clear next step. Each section should earn the scroll."]}
    ]'::jsonb,
    true,
    'published',
    1
  ),
  (
    'native-cross-platform-or-web-app',
    'Native, cross-platform or web app: choosing the right build',
    'App Development',
    'The right technology depends on your users, budget and roadmap. A practical guide to choosing how your app should be built.',
    '2026-09-08',
    'orbit',
    '/images/photo-article-app-960.jpg',
    '[
      {"paragraphs": ["One of the first decisions in any app project is how to build it. There is no universally right answer, but there is usually a right answer for your product, your users and your budget."]},
      {"heading": "Native apps", "paragraphs": ["Native apps are built separately for iOS and Android using each platform’s own tools. They offer the best performance and deepest access to hardware."]},
      {"heading": "Cross-platform apps", "paragraphs": ["Frameworks like React Native let you write once and deploy to both stores, cutting time to market significantly while maintaining 60fps native feel."]}
    ]'::jsonb,
    false,
    'published',
    2
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary;

-- Seed Testimonials
INSERT INTO public.testimonials (id, name, role, company, quote, rating, placeholder, status, sort_order)
VALUES
  ('review-1', 'Alexandre Mercier', 'Founder & CEO', 'LuxeTime Watches', 'Wolvo replaced our slow Shopify store with a custom headless build that transformed our sales. Our mobile checkout conversion shot up by 42% in the first quarter.', 5.0, false, 'published', 1),
  ('review-2', 'Elena Rostova', 'Head of Product', 'Aura Fitness', 'Shipping an offline-first iOS and Android app in eight weeks sounded impossible until Wolvo took charge. The app has over 14,000 active users and a 4.9-star rating.', 5.0, false, 'published', 2),
  ('review-3', 'Marcus Vance', 'VP of Marketing', 'ScaleCraft', 'Working with Wolvo cut our acquisition costs by more than half. Their creative ad angles and clean Meta CAPI setup made our ad budget work twice as hard.', 5.0, false, 'published', 3)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  quote = EXCLUDED.quote;
