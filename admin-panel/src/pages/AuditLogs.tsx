import { useState, useEffect } from 'react';
import { Shield, RefreshCw, Filter } from 'lucide-react';
import { fetchAuditLogs } from '@/lib/supabase';
import type { AuditLog } from '@/types/cms';

export function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filterAction, setFilterAction] = useState('all');
  const [, setIsLoading] = useState(true);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAuditLogs();
      setLogs(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filtered = logs.filter((l) =>
    filterAction === 'all' || l.action === filterAction
  );

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Administrative Audit Logs</h1>
          <p className="admin-page-desc">
            Immutable tracking of content creation, modification, deletion and publishing events.
          </p>
        </div>

        <button type="button" className="admin-btn admin-btn--secondary" onClick={loadLogs}>
          <RefreshCw size={16} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Filter */}
      <div className="admin-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--admin-text-secondary)', fontSize: '0.85rem' }}>
            <Filter size={16} />
            <span>Filter by Action:</span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', 'create', 'update', 'delete', 'publish'].map((act) => (
              <button
                key={act}
                type="button"
                className={`admin-btn admin-btn--sm ${filterAction === act ? 'admin-btn--primary' : 'admin-btn--secondary'}`}
                style={{ textTransform: 'capitalize' }}
                onClick={() => setFilterAction(act)}
              >
                {act}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="admin-card" style={{ padding: 0 }}>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Entity Type</th>
                <th>Item / Title</th>
                <th>Admin Account</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '48px', color: '#6b7a90' }}>
                    No audit records match the current filter.
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <span className={`admin-badge ${getActionBadgeClass(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ textTransform: 'capitalize', color: 'var(--admin-text-secondary)' }}>
                      {log.entity_type}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#fff' }}>
                        {log.entity_title}
                      </div>
                      <div style={{ fontSize: '0.725rem', color: '#6b7a90', fontFamily: 'var(--admin-font-mono)' }}>
                        ID: {log.entity_id}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Shield size={14} className="admin-text-secondary" />
                        <span style={{ fontSize: '0.85rem', color: '#fff' }}>{log.user_email}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function getActionBadgeClass(action: string) {
  switch (action) {
    case 'create':
    case 'publish':
      return 'admin-badge--published';
    case 'delete':
      return 'admin-badge--danger';
    case 'update':
      return 'admin-badge--update';
    default:
      return 'admin-badge--active';
  }
}
