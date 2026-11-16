import { useEffect, useState } from 'react';
import {
  FileText,
  Layers,
  Briefcase,
  MessageSquareQuote,
  Plus,
  Database,
  ArrowRight,
  Activity,
  HardDrive,
  Radio,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import {
  fetchArticles,
  fetchServices,
  fetchProjects,
  fetchTestimonials,
  fetchAuditLogs,
  isSupabaseConfigured,
} from '@/lib/supabase';
import type { CMSArticle, CMSService, CMSProject, CMSTestimonial, AuditLog } from '@/types/cms';
import type { AdminTab } from '@/components/AdminLayout';

interface DashboardProps {
  onNavigate: (tab: AdminTab) => void;
}

export function AdminDashboard({ onNavigate }: DashboardProps) {
  const [articles, setArticles] = useState<CMSArticle[]>([]);
  const [services, setServices] = useState<CMSService[]>([]);
  const [projects, setProjects] = useState<CMSProject[]>([]);
  const [testimonials, setTestimonials] = useState<CMSTestimonial[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setIsLoading(true);
      try {
        const [a, s, p, t, logs] = await Promise.all([
          fetchArticles(),
          fetchServices(),
          fetchProjects(),
          fetchTestimonials(),
          fetchAuditLogs(),
        ]);
        setArticles(a);
        setServices(s);
        setProjects(p);
        setTestimonials(t);
        setAuditLogs(logs);
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, []);

  const publishedArticles = articles.filter((a) => a.is_published).length;
  const draftArticles = articles.length - publishedArticles;
  const activeServices = services.filter((s) => s.is_active).length;
  const publishedProjects = projects.filter((p) => p.is_published).length;
  const approvedTestimonials = testimonials.filter((t) => t.is_approved).length;

  const formatRelativeTime = (timestamp: string) => {
    try {
      const diffMs = Date.now() - new Date(timestamp).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return timestamp;
    }
  };

  return (
    <div className="admin-fade-in">
      {/* Top Banner Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard Overview</h1>
          <p className="admin-page-desc">
            Centralized content management, live synchronization, and storage control for Wolvo.
          </p>
        </div>

        <div className="admin-page-actions">
          <button
            type="button"
            className="admin-btn admin-btn--secondary"
            onClick={() => onNavigate('projects')}
          >
            <Plus size={15} />
            <span>Add Project</span>
          </button>
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={() => onNavigate('articles')}
          >
            <Plus size={15} />
            <span>New Article</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="admin-stat-grid">
        {/* Articles Stat Card */}
        <div
          className="admin-stat-card"
          onClick={() => onNavigate('articles')}
          role="button"
          tabIndex={0}
        >
          <div className="admin-stat-card-top">
            <div className="admin-stat-icon-wrap admin-stat-icon-wrap--blue">
              <FileText size={20} />
            </div>
            <span className="admin-stat-pill admin-stat-pill--live">
              {publishedArticles} Published
            </span>
          </div>

          <div className="admin-stat-content">
            <div className="admin-stat-value">
              {isLoading ? '...' : articles.length}
            </div>
            <div className="admin-stat-label">Articles & Insights</div>
            <div className="admin-stat-sub">
              {draftArticles > 0 ? `${draftArticles} in drafts` : 'All articles live'}
            </div>
          </div>

          <div className="admin-stat-footer">
            <span>Manage editorial</span>
            <ArrowRight size={13} />
          </div>
        </div>

        {/* Services Stat Card */}
        <div
          className="admin-stat-card"
          onClick={() => onNavigate('services')}
          role="button"
          tabIndex={0}
        >
          <div className="admin-stat-card-top">
            <div className="admin-stat-icon-wrap admin-stat-icon-wrap--cyan">
              <Layers size={20} />
            </div>
            <span className="admin-stat-pill admin-stat-pill--cyan">
              {activeServices} Active
            </span>
          </div>

          <div className="admin-stat-content">
            <div className="admin-stat-value">
              {isLoading ? '...' : services.length}
            </div>
            <div className="admin-stat-label">Company Services</div>
            <div className="admin-stat-sub">Offerings & deliverables</div>
          </div>

          <div className="admin-stat-footer">
            <span>Update offerings</span>
            <ArrowRight size={13} />
          </div>
        </div>

        {/* Projects Stat Card */}
        <div
          className="admin-stat-card"
          onClick={() => onNavigate('projects')}
          role="button"
          tabIndex={0}
        >
          <div className="admin-stat-card-top">
            <div className="admin-stat-icon-wrap admin-stat-icon-wrap--indigo">
              <Briefcase size={20} />
            </div>
            <span className="admin-stat-pill admin-stat-pill--indigo">
              {publishedProjects} Featured
            </span>
          </div>

          <div className="admin-stat-content">
            <div className="admin-stat-value">
              {isLoading ? '...' : projects.length}
            </div>
            <div className="admin-stat-label">Recent Projects</div>
            <div className="admin-stat-sub">Case studies & portfolios</div>
          </div>

          <div className="admin-stat-footer">
            <span>Manage showcase</span>
            <ArrowRight size={13} />
          </div>
        </div>

        {/* Client Stories Stat Card */}
        <div
          className="admin-stat-card"
          onClick={() => onNavigate('testimonials')}
          role="button"
          tabIndex={0}
        >
          <div className="admin-stat-card-top">
            <div className="admin-stat-icon-wrap admin-stat-icon-wrap--emerald">
              <MessageSquareQuote size={20} />
            </div>
            <span className="admin-stat-pill admin-stat-pill--emerald">
              {approvedTestimonials} Approved
            </span>
          </div>

          <div className="admin-stat-content">
            <div className="admin-stat-value">
              {isLoading ? '...' : testimonials.length}
            </div>
            <div className="admin-stat-label">Client Stories</div>
            <div className="admin-stat-sub">Testimonials & ratings</div>
          </div>

          <div className="admin-stat-footer">
            <span>Review client feedback</span>
            <ArrowRight size={13} />
          </div>
        </div>
      </div>

      {/* Cloud & Backend Status Section */}
      <div className="admin-card admin-infra-card">
        <div className="admin-card-header">
          <div className="admin-card-title-group">
            <div className="admin-icon-pill">
              <Database size={16} />
            </div>
            <div>
              <h2 className="admin-card-title">Backend Architecture & Live Sync</h2>
              <p className="admin-card-subtitle">
                Connected infrastructure status powering both the Admin Panel and the public company website.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="admin-btn admin-btn--secondary admin-btn--sm"
            onClick={() => onNavigate('database')}
          >
            <span>Diagnostics</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="admin-infra-grid">
          {/* Item 1: Database */}
          <div className="admin-infra-item">
            <div className="admin-infra-item-header">
              <div className="admin-infra-icon admin-infra-icon--blue">
                <Database size={17} />
              </div>
              <span className="admin-badge admin-badge--published">Active</span>
            </div>
            <div className="admin-infra-title">PostgreSQL Database</div>
            <div className="admin-infra-desc">
              {isSupabaseConfigured
                ? 'Managed Postgres 17 (ap-northeast-1)'
                : 'Local SQLite/Storage Fallback'}
            </div>
            <div className="admin-infra-meta">
              <span>RLS Policies Enforced</span>
            </div>
          </div>

          {/* Item 2: Realtime Engine */}
          <div className="admin-infra-item">
            <div className="admin-infra-item-header">
              <div className="admin-infra-icon admin-infra-icon--cyan">
                <Radio size={17} />
              </div>
              <span className="admin-badge admin-badge--published">Streaming</span>
            </div>
            <div className="admin-infra-title">Realtime Publication</div>
            <div className="admin-infra-desc">
              supabase_realtime publication
            </div>
            <div className="admin-infra-meta">
              <span>Articles, Services, Projects, Reviews</span>
            </div>
          </div>

          {/* Item 3: Storage Bucket */}
          <div className="admin-infra-item">
            <div className="admin-infra-item-header">
              <div className="admin-infra-icon admin-infra-icon--indigo">
                <HardDrive size={17} />
              </div>
              <span className="admin-badge admin-badge--published">CDN Ready</span>
            </div>
            <div className="admin-infra-title">Supabase Storage</div>
            <div className="admin-infra-desc">
              Bucket: site-media
            </div>
            <div className="admin-infra-meta">
              <span>Public Read · Authenticated Upload</span>
            </div>
          </div>

          {/* Item 4: Website Sync */}
          <div className="admin-infra-item">
            <div className="admin-infra-item-header">
              <div className="admin-infra-icon admin-infra-icon--emerald">
                <CheckCircle2 size={17} />
              </div>
              <span className="admin-badge admin-badge--published">Connected</span>
            </div>
            <div className="admin-infra-title">Public Website Sync</div>
            <div className="admin-infra-desc">
              Real-time WebSocket listener
            </div>
            <div className="admin-infra-meta">
              <span>Zero-code instant update</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Activity & Quick Shortcuts */}
      <div className="admin-two-col">
        {/* Recent Activity Log */}
        <div className="admin-card" style={{ flex: 1.4 }}>
          <div className="admin-card-header">
            <div className="admin-card-title-group">
              <div className="admin-icon-pill">
                <Activity size={16} />
              </div>
              <div>
                <h2 className="admin-card-title">Recent Administrative Audit Trail</h2>
                <p className="admin-card-subtitle">
                  Last recorded actions from authorized administrators.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="admin-btn admin-btn--ghost admin-btn--sm"
              onClick={() => onNavigate('audit')}
            >
              <span>View full log</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {auditLogs.length === 0 ? (
            <div className="admin-empty-state">
              <Clock size={32} className="admin-empty-icon" />
              <div className="admin-empty-title">No Audit Logs Yet</div>
              <div className="admin-empty-desc">
                Actions such as creating, updating or deleting content will be logged here with administrator timestamps.
              </div>
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Target Entity</th>
                    <th>Administrator</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.slice(0, 5).map((log) => {
                    const actionClass =
                      log.action === 'create'
                        ? 'admin-badge--create'
                        : log.action === 'delete'
                          ? 'admin-badge--danger'
                          : 'admin-badge--update';
                    return (
                      <tr key={log.id}>
                        <td>
                          <span className={`admin-badge ${actionClass}`}>
                            {log.action}
                          </span>
                        </td>
                        <td>
                          <div className="admin-table-cell-title">
                            {log.entity_title || log.entity_id}
                          </div>
                          <div className="admin-table-cell-sub">
                            {log.entity_type}
                          </div>
                        </td>
                        <td className="admin-table-cell-muted">
                          {log.user_email}
                        </td>
                        <td className="admin-table-cell-time">
                          {formatRelativeTime(log.timestamp)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Management Shortcuts */}
        <div className="admin-card" style={{ flex: 1 }}>
          <div className="admin-card-header">
            <div className="admin-card-title-group">
              <div className="admin-icon-pill">
                <Sparkles size={16} />
              </div>
              <div>
                <h2 className="admin-card-title">Quick Actions</h2>
                <p className="admin-card-subtitle">
                  Common administrative workflows.
                </p>
              </div>
            </div>
          </div>

          <div className="admin-quick-actions-list">
            <button
              type="button"
              className="admin-quick-action-row"
              onClick={() => onNavigate('articles')}
            >
              <div className="admin-quick-action-left">
                <div className="admin-quick-icon admin-quick-icon--blue">
                  <FileText size={16} />
                </div>
                <div>
                  <div className="admin-quick-title">Publish New Blog / Article</div>
                  <div className="admin-quick-desc">Add thought leadership and web insights</div>
                </div>
              </div>
              <ArrowRight size={14} className="admin-quick-arrow" />
            </button>

            <button
              type="button"
              className="admin-quick-action-row"
              onClick={() => onNavigate('services')}
            >
              <div className="admin-quick-action-left">
                <div className="admin-quick-icon admin-quick-icon--cyan">
                  <Layers size={16} />
                </div>
                <div>
                  <div className="admin-quick-title">Edit Company Services</div>
                  <div className="admin-quick-desc">Update deliverables, icons and descriptions</div>
                </div>
              </div>
              <ArrowRight size={14} className="admin-quick-arrow" />
            </button>

            <button
              type="button"
              className="admin-quick-action-row"
              onClick={() => onNavigate('projects')}
            >
              <div className="admin-quick-action-left">
                <div className="admin-quick-icon admin-quick-icon--indigo">
                  <Briefcase size={16} />
                </div>
                <div>
                  <div className="admin-quick-title">Showcase Recent Project</div>
                  <div className="admin-quick-desc">Upload mockups, client results & tech tags</div>
                </div>
              </div>
              <ArrowRight size={14} className="admin-quick-arrow" />
            </button>

            <button
              type="button"
              className="admin-quick-action-row"
              onClick={() => onNavigate('media')}
            >
              <div className="admin-quick-action-left">
                <div className="admin-quick-icon admin-quick-icon--emerald">
                  <ExternalLink size={16} />
                </div>
                <div>
                  <div className="admin-quick-title">Upload Media to Storage</div>
                  <div className="admin-quick-desc">Manage project screenshots and logos</div>
                </div>
              </div>
              <ArrowRight size={14} className="admin-quick-arrow" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
