import { useState, type ReactNode } from 'react';
import {
  LayoutDashboard,
  FileText,
  Layers,
  Briefcase,
  MessageSquareQuote,
  Images,
  History,
  Database,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';

export type AdminTab =
  | 'dashboard'
  | 'articles'
  | 'services'
  | 'projects'
  | 'testimonials'
  | 'media'
  | 'audit'
  | 'database';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  children: ReactNode;
}

interface NavItemDef {
  id: AdminTab;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: string;
}

export function AdminLayout({ currentTab, onTabChange, children }: AdminLayoutProps) {
  const { admin, logout, isConfigured } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const publicWebsiteUrl = import.meta.env.VITE_PUBLIC_WEBSITE_URL || 'http://localhost:5174';

  const navItems: NavItemDef[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'articles', label: 'Articles & Blogs', icon: FileText },
    { id: 'services', label: 'Services', icon: Layers },
    { id: 'projects', label: 'Recent Projects', icon: Briefcase },
    { id: 'testimonials', label: 'Client Stories', icon: MessageSquareQuote },
    { id: 'media', label: 'Media & Storage', icon: Images },
    { id: 'audit', label: 'Audit Logs', icon: History },
    { id: 'database', label: 'Database & Sync', icon: Database },
  ];

  const currentItem = navItems.find((n) => n.id === currentTab);

  return (
    <div className="admin-shell">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-brand">
            <div className="admin-brand-logo-frame">
              <img
                src="/brand/wolvo-mark.webp"
                alt="Wolvo"
                width="28"
                height="21"
                className="admin-brand-logo-img"
                onError={(e) => {
                  // Fallback to PNG if webp is not supported
                  (e.target as HTMLImageElement).src = '/brand/wolvo-mark.png';
                }}
              />
            </div>
            <div className="admin-brand-meta">
              <span className="admin-brand-name">Wolvo</span>
              <span className="admin-brand-badge">SaaS CMS</span>
            </div>
          </div>

          <button
            type="button"
            className="admin-btn admin-btn--icon admin-btn--ghost admin-mobile-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="admin-nav" role="navigation" aria-label="CMS Sections">
          <div className="admin-nav-group-label">Core Management</div>
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`admin-nav-item ${isActive ? 'is-active' : ''}`}
                onClick={() => {
                  onTabChange(item.id);
                  setSidebarOpen(false);
                }}
              >
                <Icon size={18} className="admin-nav-icon" />
                <span className="admin-nav-label">{item.label}</span>
                {item.badge && <span className="admin-nav-counter">{item.badge}</span>}
              </button>
            );
          })}

          <div className="admin-nav-group-label" style={{ marginTop: '16px' }}>
            System & Storage
          </div>
          {navItems.slice(5).map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`admin-nav-item ${isActive ? 'is-active' : ''}`}
                onClick={() => {
                  onTabChange(item.id);
                  setSidebarOpen(false);
                }}
              >
                <Icon size={18} className="admin-nav-icon" />
                <span className="admin-nav-label">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer User Info */}
        <div className="admin-sidebar-footer">
          <div className="admin-user-card">
            <div className="admin-user-avatar">
              <span>{admin?.email?.charAt(0).toUpperCase() || 'A'}</span>
              <span className="admin-user-status-dot" aria-hidden="true" />
            </div>
            <div className="admin-user-details">
              <span className="admin-user-email" title={admin?.email}>
                {admin?.email || 'admin@wolvo.agency'}
              </span>
              <span className="admin-user-role-pill">
                <Sparkles size={10} />
                <span>{admin?.role || 'Administrator'}</span>
              </span>
            </div>
          </div>

          <div className="admin-sidebar-actions">
            <a
              href={publicWebsiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn admin-btn--secondary admin-btn--sm admin-sidebar-link"
              title="Open public website in a new tab"
            >
              <ExternalLink size={14} />
              <span>Visit Site</span>
            </a>
            <button
              type="button"
              onClick={logout}
              className="admin-btn admin-btn--ghost admin-btn--sm admin-btn--logout"
              title="Sign out of Admin Dashboard"
              aria-label="Sign out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main App Container */}
      <div className="admin-main">
        {/* Top Header Bar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              className="admin-btn admin-btn--icon admin-btn--ghost admin-mobile-toggle"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar menu"
            >
              <Menu size={20} />
            </button>

            <nav className="admin-breadcrumb" aria-label="Breadcrumb">
              <span className="admin-breadcrumb-root">Admin</span>
              <ChevronRight size={14} className="admin-breadcrumb-sep" />
              <span className="admin-breadcrumb-current">{currentItem?.label}</span>
            </nav>
          </div>

          <div className="admin-topbar-right">
            {isConfigured ? (
              <div className="admin-status-badge admin-status-badge--live">
                <span className="admin-live-pulse" />
                <span className="admin-status-text">Supabase Live</span>
                <span className="admin-status-sub">Postgres 17</span>
              </div>
            ) : (
              <div className="admin-status-badge admin-status-badge--local">
                <span className="admin-status-dot admin-status-dot--warn" />
                <span className="admin-status-text">Local Storage Mode</span>
              </div>
            )}

            <a
              href={publicWebsiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn admin-btn--secondary admin-btn--sm admin-topbar-view-site"
            >
              <ExternalLink size={13} />
              <span>Public Site</span>
            </a>
          </div>
        </header>

        {/* Content View */}
        <main className="admin-content-stage">{children}</main>
      </div>
    </div>
  );
}
