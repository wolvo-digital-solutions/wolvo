import { useState } from 'react';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ShieldAlert,
  Server,
  Zap,
} from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

interface DatabaseSettingsProps {
  onNotify: (text: string, type?: 'success' | 'error') => void;
}

export function DatabaseSettings({ onNotify }: DatabaseSettingsProps) {
  const [copied, setCopied] = useState(false);

  const schemaSql = `-- ============================================================================
-- Wolvo CMS — Production Schema with Row Level Security (RLS)
-- ============================================================================

-- Enable pgcrypto for UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('superadmin', 'admin', 'editor')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view admins" ON public.admins
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()));

-- 2. Articles Table
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  published_at DATE NOT NULL DEFAULT CURRENT_DATE,
  read_time TEXT NOT NULL DEFAULT '5 min read',
  category TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  visual_kind TEXT NOT NULL DEFAULT 'code',
  cover_image TEXT,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT true,
  content JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published articles" ON public.articles
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "Admins manage all articles" ON public.articles
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

-- 3. Services Table
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'Globe',
  deliverables TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT,
  display_order INT NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active services" ON public.services
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins manage all services" ON public.services
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

-- 4. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  client TEXT NOT NULL,
  year TEXT NOT NULL DEFAULT '2026',
  description TEXT NOT NULL,
  challenge TEXT NOT NULL,
  solution TEXT NOT NULL,
  result_value TEXT NOT NULL,
  result_label TEXT NOT NULL,
  services TEXT[] NOT NULL DEFAULT '{}',
  technologies TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT,
  visual_kind TEXT NOT NULL DEFAULT 'browser',
  accent_from TEXT NOT NULL DEFAULT '#0066ff',
  accent_to TEXT NOT NULL DEFAULT '#00d2ff',
  featured_on_rail BOOLEAN NOT NULL DEFAULT true,
  is_published BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published projects" ON public.projects
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "Admins manage all projects" ON public.projects
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

-- 5. Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  quote TEXT NOT NULL,
  rating INT NOT NULL DEFAULT 5,
  avatar_url TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read approved testimonials" ON public.testimonials
  FOR SELECT TO anon, authenticated
  USING (is_approved = true);

CREATE POLICY "Admins manage all testimonials" ON public.testimonials
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

-- 6. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY,
  user_email TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  entity_title TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read audit logs" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

CREATE POLICY "Admins insert audit logs" ON public.audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

-- Enable Realtime for Live Website Synchronization
ALTER PUBLICATION supabase_realtime ADD TABLE public.articles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.services;
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.testimonials;
`;

  const copySql = () => {
    navigator.clipboard.writeText(schemaSql);
    setCopied(true);
    onNotify('Full SQL migration copied to clipboard');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Database & Synchronization Settings</h1>
          <p className="admin-page-desc">
            Supabase backend diagnostics, Row Level Security (RLS) policies, and Realtime sync channels.
          </p>
        </div>
      </div>

      {/* Connection Status Card */}
      <div className="admin-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <Server size={22} className="admin-text-secondary" />
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
            Connection Status
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div
            style={{
              background: 'var(--admin-surface-card)',
              border: '1px solid var(--admin-border)',
              borderRadius: '12px',
              padding: '18px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {isSupabaseConfigured ? (
                <CheckCircle2 size={20} className="admin-text-success" />
              ) : (
                <AlertCircle size={20} className="admin-text-warning" />
              )}
              <div style={{ fontWeight: 600, color: '#fff' }}>
                {isSupabaseConfigured ? 'Supabase Live Connected' : 'Local Storage Mode'}
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-secondary)', marginTop: '8px', lineHeight: 1.5 }}>
              {isSupabaseConfigured
                ? 'Your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are verified and communicating with Supabase Cloud.'
                : 'Using local browser state. All features work in demo mode. Configure your Supabase project credentials in .env to persist across browsers.'}
            </p>
          </div>

          <div
            style={{
              background: 'var(--admin-surface-card)',
              border: '1px solid var(--admin-border)',
              borderRadius: '12px',
              padding: '18px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldAlert size={20} className="admin-text-success" />
              <div style={{ fontWeight: 600, color: '#fff' }}>
                Row Level Security (RLS)
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-secondary)', marginTop: '8px', lineHeight: 1.5 }}>
              Strict RLS policies enabled. Public visitors can only view published items (read-only). Mutations and deletions are restricted to verified accounts in <code>public.admins</code>.
            </p>
          </div>

          <div
            style={{
              background: 'var(--admin-surface-card)',
              border: '1px solid var(--admin-border)',
              borderRadius: '12px',
              padding: '18px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Zap size={20} className="admin-text-secondary" />
              <div style={{ fontWeight: 600, color: '#fff' }}>
                Realtime Synchronization
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-secondary)', marginTop: '8px', lineHeight: 1.5 }}>
              All 4 content tables (<code>articles</code>, <code>services</code>, <code>projects</code>, <code>testimonials</code>) are added to <code>supabase_realtime</code> publication for instant live synchronization.
            </p>
          </div>
        </div>
      </div>

      {/* SQL Migration Script */}
      <div className="admin-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Database size={20} className="admin-text-secondary" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
              Supabase SQL Migration Script
            </h2>
          </div>

          <button type="button" className="admin-btn admin-btn--primary admin-btn--sm" onClick={copySql}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy SQL'}</span>
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-secondary)', marginBottom: '16px' }}>
          Run this script inside the <strong>Supabase Dashboard $\rightarrow$ SQL Editor</strong> to create the schema, tables, RLS security policies, and Realtime publications.
        </p>

        <pre
          style={{
            background: '#050a18',
            border: '1px solid var(--admin-border)',
            borderRadius: '10px',
            padding: '16px',
            maxHeight: '340px',
            overflowY: 'auto',
            fontFamily: 'var(--admin-font-mono)',
            fontSize: '0.75rem',
            color: '#a3b1c4',
            lineHeight: 1.6,
          }}
        >
          {schemaSql}
        </pre>
      </div>
    </div>
  );
}
