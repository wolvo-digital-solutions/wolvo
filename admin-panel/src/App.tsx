import { useState } from 'react';
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';
import { AdminLayout, type AdminTab } from '@/components/AdminLayout';
import { AdminLogin } from '@/pages/AdminLogin';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { ArticlesManager } from '@/pages/ArticlesManager';
import { ServicesManager } from '@/pages/ServicesManager';
import { ProjectsManager } from '@/pages/ProjectsManager';
import { TestimonialsManager } from '@/pages/TestimonialsManager';
import { MediaManager } from '@/pages/MediaManager';
import { AuditLogs } from '@/pages/AuditLogs';
import { DatabaseSettings } from '@/pages/DatabaseSettings';
import { ToastContainer, type ToastMessage } from '@/components/Toast';
import '@/admin.css';

function AdminContent() {
  const { admin, isLoading } = useAdminAuth();
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: 'var(--admin-bg)',
          color: 'var(--admin-text-secondary)',
          fontSize: '0.9rem',
        }}
      >
        Authenticating administrator session...
      </div>
    );
  }

  if (!admin) {
    return <AdminLogin />;
  }

  return (
    <>
      <AdminLayout currentTab={currentTab} onTabChange={setCurrentTab}>
        {currentTab === 'dashboard' && <AdminDashboard onNavigate={setCurrentTab} />}
        {currentTab === 'articles' && <ArticlesManager onNotify={addToast} />}
        {currentTab === 'services' && <ServicesManager onNotify={addToast} />}
        {currentTab === 'projects' && <ProjectsManager onNotify={addToast} />}
        {currentTab === 'testimonials' && <TestimonialsManager onNotify={addToast} />}
        {currentTab === 'media' && <MediaManager onNotify={addToast} />}
        {currentTab === 'audit' && <AuditLogs />}
        {currentTab === 'database' && <DatabaseSettings onNotify={addToast} />}
      </AdminLayout>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}

export default function App() {
  return (
    <AdminAuthProvider>
      <AdminContent />
    </AdminAuthProvider>
  );
}
