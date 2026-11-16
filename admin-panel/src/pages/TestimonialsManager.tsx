import { useState, useEffect, type ChangeEvent } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  X,
  Star,
  Upload,
} from 'lucide-react';
import { fetchTestimonials, saveTestimonial, deleteTestimonial, uploadMediaFile } from '@/lib/supabase';
import { useAdminAuth } from '@/context/AdminAuthContext';
import type { CMSTestimonial } from '@/types/cms';

interface TestimonialsManagerProps {
  onNotify: (text: string, type?: 'success' | 'error') => void;
}

const EMPTY_TESTIMONIAL: CMSTestimonial = {
  id: '',
  name: '',
  role: 'Founder & CEO',
  company: '',
  quote: '',
  rating: 5,
  avatar_url: '',
  is_approved: true,
  display_order: 1,
};

export function TestimonialsManager({ onNotify }: TestimonialsManagerProps) {
  const { admin } = useAdminAuth();
  const [testimonials, setTestimonials] = useState<CMSTestimonial[]>([]);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState<CMSTestimonial>(EMPTY_TESTIMONIAL);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CMSTestimonial | null>(null);

  const loadData = async () => {
    try {
      const data = await fetchTestimonials();
      setTestimonials(data);
    } catch {
      onNotify('Failed to fetch client stories', 'error');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = testimonials.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.company.toLowerCase().includes(search.toLowerCase()) ||
    t.quote.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditItem({
      ...EMPTY_TESTIMONIAL,
      display_order: testimonials.length + 1,
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (item: CMSTestimonial) => {
    setEditItem(JSON.parse(JSON.stringify(item)));
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editItem.name || !editItem.quote) {
      onNotify('Client name and quote are required', 'error');
      return;
    }

    try {
      await saveTestimonial(editItem, admin?.email || 'admin');
      onNotify(`Client story for "${editItem.name}" saved successfully`);
      setIsEditing(false);
      await loadData();
    } catch (err: unknown) {
      onNotify(err instanceof Error ? err.message : 'Save failed', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTestimonial(deleteTarget.id, admin?.email || 'admin');
      onNotify(`Client story deleted`);
      setDeleteTarget(null);
      await loadData();
    } catch (err: unknown) {
      onNotify(err instanceof Error ? err.message : 'Delete failed', 'error');
    }
  };

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadMediaFile(file, 'avatars');
      setEditItem((prev) => ({ ...prev, avatar_url: url }));
      onNotify('Avatar uploaded to Supabase Storage');
    } catch (err: unknown) {
      onNotify(err instanceof Error ? err.message : 'Upload failed', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Client Stories & Testimonials</h1>
          <p className="admin-page-desc">
            Manage customer feedback, ratings, client avatars, and public endorsements.
          </p>
        </div>

        <button type="button" className="admin-btn admin-btn--primary" onClick={handleOpenCreate}>
          <Plus size={16} />
          <span>New Client Story</span>
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
            placeholder="Search testimonials by client, company, or quote..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Testimonials Table */}
      <div className="admin-card" style={{ padding: 0 }}>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client & Company</th>
                <th>Quote Preview</th>
                <th>Rating</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '36px', color: '#6b7a90' }}>
                    No client stories found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'var(--admin-surface-hover)',
                            border: '1px solid var(--admin-border)',
                            overflow: 'hidden',
                            display: 'grid',
                            placeItems: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {item.avatar_url ? (
                            <img
                              src={item.avatar_url}
                              alt={item.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.85rem' }}>
                              {item.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: '0.785rem', color: '#6b7a90' }}>
                            {item.role}, {item.company}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.825rem', color: 'var(--admin-text-secondary)', maxWidth: '420px', lineHeight: 1.5 }}>
                        "{item.quote.slice(0, 110)}..."
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '3px', color: '#f59e0b' }}>
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <Star key={i} size={14} fill="#f59e0b" />
                        ))}
                      </div>
                    </td>
                    <td>
                      {item.is_approved ? (
                        <span className="admin-badge admin-badge--published">
                          <CheckCircle size={12} /> Approved
                        </span>
                      ) : (
                        <span className="admin-badge admin-badge--draft">
                          <XCircle size={12} /> Pending
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          type="button"
                          className="admin-btn admin-btn--icon admin-btn--secondary"
                          onClick={() => handleOpenEdit(item)}
                          title="Edit story"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn--icon admin-btn--danger"
                          onClick={() => setDeleteTarget(item)}
                          title="Delete story"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Create Modal */}
      {isEditing && (
        <div className="admin-modal-backdrop" onClick={() => setIsEditing(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">
                {editItem.id ? 'Edit Client Story' : 'Add New Client Story'}
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
                  <label className="admin-label">Client Name *</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editItem.name}
                    onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                    placeholder="e.g. Marcus Vance"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Company Name *</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editItem.company}
                    onChange={(e) => setEditItem({ ...editItem, company: e.target.value })}
                    placeholder="e.g. Aurora Financial"
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">Client Role</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editItem.role}
                    onChange={(e) => setEditItem({ ...editItem, role: e.target.value })}
                    placeholder="e.g. VP of Product"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Star Rating (1 - 5)</label>
                  <select
                    className="admin-select"
                    value={editItem.rating}
                    onChange={(e) => setEditItem({ ...editItem, rating: Number(e.target.value) })}
                  >
                    <option value={5}>5 Stars (Exceptional)</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Client Quote / Testimonial *</label>
                <textarea
                  className="admin-textarea"
                  rows={4}
                  value={editItem.quote}
                  onChange={(e) => setEditItem({ ...editItem, quote: e.target.value })}
                  placeholder="The full client testimonial text..."
                />
              </div>

              {/* Avatar Upload */}
              <div className="admin-form-group">
                <label className="admin-label">Client Avatar Photo</label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="admin-input"
                    style={{ flex: 1 }}
                    value={editItem.avatar_url || ''}
                    onChange={(e) => setEditItem({ ...editItem, avatar_url: e.target.value })}
                    placeholder="https://... or upload photo"
                  />
                  <label className="admin-btn admin-btn--secondary" style={{ cursor: 'pointer' }}>
                    <Upload size={14} />
                    <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleAvatarUpload}
                      disabled={isUploading}
                    />
                  </label>
                </div>
                {editItem.avatar_url && (
                  <div style={{ marginTop: '10px', width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--admin-border)' }}>
                    <img src={editItem.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              {/* Approval status */}
              <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="checkbox"
                  id="approve-status"
                  checked={editItem.is_approved}
                  onChange={(e) => setEditItem({ ...editItem, is_approved: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="approve-status" style={{ cursor: 'pointer', fontWeight: 600, color: '#fff' }}>
                  Approved and visible in Client Stories section
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
                Save Story
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
              <h2 className="admin-modal-title">Delete Client Story</h2>
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
                Are you sure you want to remove the testimonial from{' '}
                <strong style={{ color: '#fff' }}>"{deleteTarget.name}"</strong>?
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
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
