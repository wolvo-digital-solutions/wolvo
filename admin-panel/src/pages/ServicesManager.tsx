import { useState, useEffect, type ChangeEvent } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  X,
  Upload,
} from 'lucide-react';
import { fetchServices, saveService, deleteService, uploadMediaFile } from '@/lib/supabase';
import { AVAILABLE_ICONS, resolveIcon } from '@/lib/icons';
import { useAdminAuth } from '@/context/AdminAuthContext';
import type { CMSService } from '@/types/cms';

interface ServicesManagerProps {
  onNotify: (text: string, type?: 'success' | 'error') => void;
}

const EMPTY_SERVICE: CMSService = {
  id: '',
  title: '',
  description: '',
  icon_name: 'Globe',
  deliverables: ['Custom design', 'Responsive build'],
  display_order: 1,
  is_active: true,
};

export function ServicesManager({ onNotify }: ServicesManagerProps) {
  const { admin } = useAdminAuth();
  const [services, setServices] = useState<CMSService[]>([]);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState<CMSService>(EMPTY_SERVICE);
  const [deliverableInput, setDeliverableInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CMSService | null>(null);

  const loadData = async () => {
    try {
      const data = await fetchServices();
      setServices(data);
    } catch {
      onNotify('Failed to fetch services', 'error');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = services.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditItem({
      ...EMPTY_SERVICE,
      display_order: services.length + 1,
    });
    setDeliverableInput('');
    setIsEditing(true);
  };

  const handleOpenEdit = (service: CMSService) => {
    setEditItem(JSON.parse(JSON.stringify(service)));
    setDeliverableInput('');
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editItem.title) {
      onNotify('Service title is required', 'error');
      return;
    }

    try {
      await saveService(editItem, admin?.email || 'admin');
      onNotify(`Service "${editItem.title}" saved successfully`);
      setIsEditing(false);
      await loadData();
    } catch (err: unknown) {
      onNotify(err instanceof Error ? err.message : 'Save failed', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteService(deleteTarget.id, admin?.email || 'admin');
      onNotify(`Service deleted successfully`);
      setDeleteTarget(null);
      await loadData();
    } catch (err: unknown) {
      onNotify(err instanceof Error ? err.message : 'Delete failed', 'error');
    }
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadMediaFile(file, 'services');
      setEditItem((prev) => ({ ...prev, image_url: url }));
      onNotify('Service image uploaded to Supabase Storage');
    } catch (err: unknown) {
      onNotify(err instanceof Error ? err.message : 'Upload failed', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const addDeliverable = () => {
    if (!deliverableInput.trim()) return;
    setEditItem({
      ...editItem,
      deliverables: [...editItem.deliverables, deliverableInput.trim()],
    });
    setDeliverableInput('');
  };

  const removeDeliverable = (idx: number) => {
    setEditItem({
      ...editItem,
      deliverables: editItem.deliverables.filter((_, i) => i !== idx),
    });
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Company Services</h1>
          <p className="admin-page-desc">
            Manage agency service offerings, icon representations, deliverables, and display cards.
          </p>
        </div>

        <button type="button" className="admin-btn admin-btn--primary" onClick={handleOpenCreate}>
          <Plus size={16} />
          <span>New Service</span>
        </button>
      </div>

      {/* Search */}
      <div className="admin-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ position: 'relative' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7a90' }}
          />
          <input
            type="text"
            className="admin-input"
            style={{ paddingLeft: '38px' }}
            placeholder="Search services by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Services Table */}
      <div className="admin-card" style={{ padding: 0 }}>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Icon</th>
                <th>Service Name</th>
                <th>Deliverables</th>
                <th>Order</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: '#6b7a90' }}>
                    No services found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const Icon = resolveIcon(item.icon_name);
                  return (
                    <tr key={item.id}>
                      <td>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            background: 'rgba(0, 102, 255, 0.12)',
                            color: 'var(--admin-secondary)',
                            display: 'grid',
                            placeItems: 'center',
                          }}
                        >
                          <Icon size={18} />
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#6b7a90', maxWidth: '380px' }}>
                          {item.description}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '280px' }}>
                          {item.deliverables.slice(0, 3).map((d) => (
                            <span
                              key={d}
                              className="admin-badge admin-badge--draft"
                              style={{ fontSize: '0.65rem', textTransform: 'none' }}
                            >
                              {d}
                            </span>
                          ))}
                          {item.deliverables.length > 3 && (
                            <span style={{ fontSize: '0.7rem', color: '#6b7a90' }}>
                              +{item.deliverables.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ color: 'var(--admin-text-secondary)', fontWeight: 600 }}>
                        #{item.display_order}
                      </td>
                      <td>
                        {item.is_active ? (
                          <span className="admin-badge admin-badge--published">
                            <CheckCircle size={12} /> Active
                          </span>
                        ) : (
                          <span className="admin-badge admin-badge--draft">
                            <XCircle size={12} /> Inactive
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            type="button"
                            className="admin-btn admin-btn--icon admin-btn--secondary"
                            onClick={() => handleOpenEdit(item)}
                            title="Edit service"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            type="button"
                            className="admin-btn admin-btn--icon admin-btn--danger"
                            onClick={() => setDeleteTarget(item)}
                            title="Delete service"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Create Modal */}
      {isEditing && (
        <div className="admin-modal-backdrop" onClick={() => setIsEditing(false)}>
          <div className="admin-modal admin-modal--lg" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">
                {editItem.id ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button
                type="button"
                className="admin-btn admin-btn--icon admin-btn--secondary"
                onClick={() => setIsEditing(false)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">Service Title *</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editItem.title}
                    onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                    placeholder="e.g. Mobile Applications"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Display Order</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={editItem.display_order}
                    onChange={(e) =>
                      setEditItem({ ...editItem, display_order: Number(e.target.value) || 1 })
                    }
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Service Description *</label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={editItem.description}
                  onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                  placeholder="Comprehensive description displayed on the service card..."
                />
              </div>

              {/* Icon Selector */}
              <div className="admin-form-group">
                <label className="admin-label">Select Dynamic Icon</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                  {AVAILABLE_ICONS.map((opt) => {
                    const Icon = opt.component;
                    const isSelected = editItem.icon_name === opt.name;
                    return (
                      <button
                        key={opt.name}
                        type="button"
                        onClick={() => setEditItem({ ...editItem, icon_name: opt.name })}
                        className={`admin-btn ${isSelected ? 'admin-btn--primary' : 'admin-btn--secondary'}`}
                        style={{ justifyContent: 'flex-start', padding: '8px 10px', fontSize: '0.75rem' }}
                      >
                        <Icon size={16} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {opt.label.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Deliverables Chip Editor */}
              <div className="admin-form-group">
                <label className="admin-label">Deliverables Checklist</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Add a deliverable (e.g. Sub-second page speeds)..."
                    value={deliverableInput}
                    onChange={(e) => setDeliverableInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addDeliverable();
                      }
                    }}
                  />
                  <button type="button" className="admin-btn admin-btn--secondary" onClick={addDeliverable}>
                    Add
                  </button>
                </div>
                <div className="admin-chip-container">
                  {editItem.deliverables.map((d, idx) => (
                    <span key={idx} className="admin-chip">
                      <span>{d}</span>
                      <button
                        type="button"
                        className="admin-chip-remove"
                        onClick={() => removeDeliverable(idx)}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Photo Upload */}
              <div className="admin-form-group">
                <label className="admin-label">Card Background Photo (Optional)</label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="admin-input"
                    style={{ flex: 1 }}
                    value={editItem.image_url || ''}
                    onChange={(e) => setEditItem({ ...editItem, image_url: e.target.value })}
                    placeholder="https://... or upload photo"
                  />
                  <label className="admin-btn admin-btn--secondary" style={{ cursor: 'pointer' }}>
                    <Upload size={14} />
                    <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </label>
                </div>
                {editItem.image_url && (
                  <div className="admin-image-preview">
                    <img src={editItem.image_url} alt="Service Visual" />
                  </div>
                )}
              </div>

              {/* Active Toggle */}
              <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="checkbox"
                  id="active-status"
                  checked={editItem.is_active}
                  onChange={(e) => setEditItem({ ...editItem, is_active: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="active-status" style={{ cursor: 'pointer', fontWeight: 600, color: '#fff' }}>
                  Active and visible on company website
                </label>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                className="admin-btn admin-btn--secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button type="button" className="admin-btn admin-btn--primary" onClick={handleSave}>
                Save Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="admin-modal-backdrop" onClick={() => setDeleteTarget(null)}>
          <div className="admin-modal admin-modal--sm" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">Delete Service</h2>
              <button
                type="button"
                className="admin-btn admin-btn--icon admin-btn--secondary"
                onClick={() => setDeleteTarget(null)}
              >
                <X size={16} />
              </button>
            </div>
            <div className="admin-modal-body">
              <p style={{ color: 'var(--admin-text-secondary)' }}>
                Are you sure you want to permanently delete{' '}
                <strong style={{ color: '#fff' }}>"{deleteTarget.title}"</strong>?
              </p>
            </div>
            <div className="admin-modal-footer">
              <button
                type="button"
                className="admin-btn admin-btn--secondary"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button type="button" className="admin-btn admin-btn--danger" onClick={handleDelete}>
                Delete Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
