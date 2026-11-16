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
import { fetchArticles, saveArticle, deleteArticle, uploadMediaFile } from '@/lib/supabase';
import { useAdminAuth } from '@/context/AdminAuthContext';
import type { CMSArticle } from '@/types/cms';

interface ArticlesManagerProps {
  onNotify: (text: string, type?: 'success' | 'error') => void;
}

const EMPTY_ARTICLE: CMSArticle = {
  id: '',
  slug: '',
  title: '',
  excerpt: '',
  published_at: new Date().toISOString().split('T')[0],
  read_time: '5 min read',
  category: 'Engineering & Brand',
  tags: ['Engineering', 'Design'],
  visual_kind: 'code',
  cover_image: '',
  author_name: 'Wolvo Engineering',
  author_role: 'Lead',
  is_published: true,
  content: {
    lead: '',
    sections: [
      {
        heading: 'Introduction',
        paragraphs: [''],
        callout: '',
      },
    ],
  },
};

export function ArticlesManager({ onNotify }: ArticlesManagerProps) {
  const { admin } = useAdminAuth();
  const [articles, setArticles] = useState<CMSArticle[]>([]);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState<CMSArticle>(EMPTY_ARTICLE);
  const [tagInput, setTagInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CMSArticle | null>(null);

  const loadData = async () => {
    try {
      const data = await fetchArticles();
      setArticles(data);
    } catch {
      onNotify('Failed to fetch articles', 'error');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const categories = Array.from(new Set(articles.map((a) => a.category).filter(Boolean)));

  const filtered = articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || a.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenCreate = () => {
    setEditItem({
      ...EMPTY_ARTICLE,
      published_at: new Date().toISOString().split('T')[0],
    });
    setTagInput('');
    setIsEditing(true);
  };

  const handleOpenEdit = (article: CMSArticle) => {
    setEditItem(JSON.parse(JSON.stringify(article)));
    setTagInput('');
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editItem.title || !editItem.slug) {
      onNotify('Title and slug are required', 'error');
      return;
    }

    try {
      await saveArticle(editItem, admin?.email || 'admin');
      onNotify(`Article "${editItem.title}" saved successfully`);
      setIsEditing(false);
      await loadData();
    } catch (err: unknown) {
      onNotify(err instanceof Error ? err.message : 'Save failed', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteArticle(deleteTarget.id, admin?.email || 'admin', deleteTarget.cover_image);
      setArticles((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      onNotify(`Article "${deleteTarget.title}" permanently deleted`);
      setDeleteTarget(null);
      await loadData();
    } catch (err: unknown) {
      onNotify(err instanceof Error ? err.message : 'Delete failed', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadMediaFile(file, 'articles');
      setEditItem((prev) => ({ ...prev, cover_image: url }));
      onNotify('Image uploaded to Supabase Storage');
    } catch (err: unknown) {
      onNotify(err instanceof Error ? err.message : 'Upload failed', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    if (!editItem.tags.includes(tagInput.trim())) {
      setEditItem({ ...editItem, tags: [...editItem.tags, tagInput.trim()] });
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setEditItem({ ...editItem, tags: editItem.tags.filter((t) => t !== tag) });
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Articles & Blog Posts</h1>
          <p className="admin-page-desc">
            Manage thought leadership, case summaries, engineering notes, and company insights.
          </p>
        </div>

        <button type="button" className="admin-btn admin-btn--primary" onClick={handleOpenCreate}>
          <Plus size={16} />
          <span>New Article</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7a90' }}
            />
            <input
              type="text"
              className="admin-input"
              style={{ paddingLeft: '38px' }}
              placeholder="Search articles by title, tag, or content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="admin-select"
            style={{ width: 'auto', minWidth: '180px' }}
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="admin-card" style={{ padding: 0 }}>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title & Slug</th>
                <th>Category</th>
                <th>Status</th>
                <th>Published Date</th>
                <th>Read Time</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: '#6b7a90' }}>
                    No articles found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7a90', fontFamily: 'var(--admin-font-mono)' }}>
                        /{item.slug}
                      </div>
                    </td>
                    <td>
                      <span className="admin-badge admin-badge--draft" style={{ textTransform: 'none' }}>
                        {item.category}
                      </span>
                    </td>
                    <td>
                      {item.is_published ? (
                        <span className="admin-badge admin-badge--published">
                          <CheckCircle size={12} /> Published
                        </span>
                      ) : (
                        <span className="admin-badge admin-badge--draft">
                          <XCircle size={12} /> Draft
                        </span>
                      )}
                    </td>
                    <td style={{ color: 'var(--admin-text-secondary)', fontSize: '0.85rem' }}>
                      {item.published_at}
                    </td>
                    <td style={{ color: 'var(--admin-text-secondary)', fontSize: '0.85rem' }}>
                      {item.read_time}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          type="button"
                          className="admin-btn admin-btn--icon admin-btn--secondary"
                          onClick={() => handleOpenEdit(item)}
                          title="Edit article"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn--icon admin-btn--danger"
                          onClick={() => setDeleteTarget(item)}
                          title="Delete article"
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
          <div className="admin-modal admin-modal--lg" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">
                {editItem.id ? 'Edit Article' : 'Create New Article'}
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
                  <label className="admin-label">Article Title *</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editItem.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-+|-+$/g, '');
                      setEditItem((prev) => ({
                        ...prev,
                        title,
                        slug: prev.id ? prev.slug : slug,
                      }));
                    }}
                    placeholder="e.g. Why web performance is branding"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">URL Slug *</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editItem.slug}
                    onChange={(e) => setEditItem({ ...editItem, slug: e.target.value })}
                    placeholder="why-web-performance-is-branding"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Excerpt / Summary *</label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={editItem.excerpt}
                  onChange={(e) => setEditItem({ ...editItem, excerpt: e.target.value })}
                  placeholder="Short introductory summary displayed on the card..."
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">Category</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editItem.category}
                    onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                    placeholder="Engineering & Brand"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Read Time</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editItem.read_time}
                    onChange={(e) => setEditItem({ ...editItem, read_time: e.target.value })}
                    placeholder="4 min read"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Published Date</label>
                  <input
                    type="date"
                    className="admin-input"
                    value={editItem.published_at}
                    onChange={(e) => setEditItem({ ...editItem, published_at: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">Author Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editItem.author_name}
                    onChange={(e) => setEditItem({ ...editItem, author_name: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Author Role</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editItem.author_role}
                    onChange={(e) => setEditItem({ ...editItem, author_role: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Procedural Visual Style</label>
                  <select
                    className="admin-select"
                    value={editItem.visual_kind}
                    onChange={(e) =>
                      setEditItem({
                        ...editItem,
                        visual_kind: e.target.value as 'code' | 'mesh' | 'dots' | 'rings',
                      })
                    }
                  >
                    <option value="code">Code Syntax Visual</option>
                    <option value="mesh">Mesh Gradient</option>
                    <option value="dots">Dots Matrix</option>
                    <option value="rings">Target Rings</option>
                  </select>
                </div>
              </div>

              {/* Cover Image Upload */}
              <div className="admin-form-group">
                <label className="admin-label">Cover Image (Optional Supabase Storage URL)</label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="admin-input"
                    style={{ flex: 1 }}
                    value={editItem.cover_image || ''}
                    onChange={(e) => setEditItem({ ...editItem, cover_image: e.target.value })}
                    placeholder="https://... or upload below"
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
                {editItem.cover_image && (
                  <div className="admin-image-preview">
                    <img src={editItem.cover_image} alt="Preview" />
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="admin-form-group">
                <label className="admin-label">Tags</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Add a tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <button type="button" className="admin-btn admin-btn--secondary" onClick={addTag}>
                    Add
                  </button>
                </div>
                <div className="admin-chip-container">
                  {editItem.tags.map((tag) => (
                    <span key={tag} className="admin-chip">
                      <span>{tag}</span>
                      <button
                        type="button"
                        className="admin-chip-remove"
                        onClick={() => removeTag(tag)}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Publication Status */}
              <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="checkbox"
                  id="pub-status"
                  checked={editItem.is_published}
                  onChange={(e) => setEditItem({ ...editItem, is_published: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="pub-status" style={{ cursor: 'pointer', fontWeight: 600, color: '#fff' }}>
                  Publish live to company website
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
                Save Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="admin-modal-backdrop" onClick={() => !isDeleting && setDeleteTarget(null)}>
          <div className="admin-modal admin-modal--sm" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">Delete Article</h2>
              <button
                type="button"
                className="admin-btn admin-btn--icon admin-btn--secondary"
                onClick={() => !isDeleting && setDeleteTarget(null)}
                disabled={isDeleting}
              >
                <X size={16} />
              </button>
            </div>
            <div className="admin-modal-body">
              <p style={{ color: 'var(--admin-text-secondary)', fontSize: '0.875rem', lineHeight: 1.5 }}>
                Are you sure you want to permanently delete{' '}
                <strong style={{ color: '#fff' }}>"{deleteTarget.title}"</strong>?
              </p>
              <p
                style={{
                  color: '#f87171',
                  fontSize: '0.8rem',
                  marginTop: '12px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  lineHeight: 1.4,
                }}
              >
                This action cannot be undone. The article, its database record, and any associated Supabase storage images will be permanently erased and removed from the public website immediately.
              </p>
            </div>
            <div className="admin-modal-footer">
              <button
                type="button"
                className="admin-btn admin-btn--secondary"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--danger"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
