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
  Layers,
} from 'lucide-react';
import { fetchProjects, saveProject, deleteProject, uploadMediaFile } from '@/lib/supabase';
import { useAdminAuth } from '@/context/AdminAuthContext';
import type { CMSProject } from '@/types/cms';

interface ProjectsManagerProps {
  onNotify: (text: string, type?: 'success' | 'error') => void;
}

const EMPTY_PROJECT: CMSProject = {
  id: '',
  title: '',
  category: 'Fintech & Mobile',
  client: '',
  year: '2026',
  description: '',
  challenge: '',
  solution: '',
  result_value: '+100%',
  result_label: 'Growth metric',
  services: ['Web App Development'],
  technologies: ['React', 'TypeScript', 'Tailwind'],
  image_url: '',
  visual_kind: 'browser',
  accent_from: '#0066ff',
  accent_to: '#00d2ff',
  featured_on_rail: true,
  is_published: true,
  display_order: 1,
};

export function ProjectsManager({ onNotify }: ProjectsManagerProps) {
  const { admin } = useAdminAuth();
  const [projects, setProjects] = useState<CMSProject[]>([]);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState<CMSProject>(EMPTY_PROJECT);
  const [techTagInput, setTechTagInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CMSProject | null>(null);

  const loadData = async () => {
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch {
      onNotify('Failed to fetch projects', 'error');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const categories = Array.from(new Set(projects.map((p) => p.category).filter(Boolean)));

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase()) ||
      p.technologies.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenCreate = () => {
    setEditItem({
      ...EMPTY_PROJECT,
      display_order: projects.length + 1,
    });
    setTechTagInput('');
    setIsEditing(true);
  };

  const handleOpenEdit = (project: CMSProject) => {
    setEditItem(JSON.parse(JSON.stringify(project)));
    setTechTagInput('');
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editItem.title || !editItem.client) {
      onNotify('Project title and client name are required', 'error');
      return;
    }

    try {
      await saveProject(editItem, admin?.email || 'admin');
      onNotify(`Project "${editItem.title}" saved successfully`);
      setIsEditing(false);
      await loadData();
    } catch (err: unknown) {
      onNotify(err instanceof Error ? err.message : 'Save failed', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProject(deleteTarget.id, admin?.email || 'admin');
      onNotify(`Project deleted successfully`);
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
      const url = await uploadMediaFile(file, 'projects');
      setEditItem((prev) => ({ ...prev, image_url: url }));
      onNotify('Project image uploaded to Supabase Storage');
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
          <h1 className="admin-page-title">Recent Projects & Case Studies</h1>
          <p className="admin-page-desc">
            Manage showcase portfolio work, client challenge & solution writeups, and metrics.
          </p>
        </div>

        <button type="button" className="admin-btn admin-btn--primary" onClick={handleOpenCreate}>
          <Plus size={16} />
          <span>New Project</span>
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
              placeholder="Search projects by title, client, or tech..."
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

      {/* Projects Table */}
      <div className="admin-card" style={{ padding: 0 }}>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Project & Client</th>
                <th>Category</th>
                <th>Highlight Result</th>
                <th>Featured Rail</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: '#6b7a90' }}>
                    No projects found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7a90' }}>
                        {item.client} • {item.year}
                      </div>
                    </td>
                    <td>
                      <span className="admin-badge admin-badge--draft" style={{ textTransform: 'none' }}>
                        {item.category}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#00d2ff', fontSize: '0.9rem' }}>
                        {item.result_value}
                      </div>
                      <div style={{ fontSize: '0.725rem', color: '#6b7a90' }}>
                        {item.result_label}
                      </div>
                    </td>
                    <td>
                      {item.featured_on_rail ? (
                        <span className="admin-badge admin-badge--active" style={{ fontSize: '0.7rem' }}>
                          <Layers size={11} /> Featured
                        </span>
                      ) : (
                        <span style={{ color: '#6b7a90', fontSize: '0.75rem' }}>Standard</span>
                      )}
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
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          type="button"
                          className="admin-btn admin-btn--icon admin-btn--secondary"
                          onClick={() => handleOpenEdit(item)}
                          title="Edit project"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn--icon admin-btn--danger"
                          onClick={() => setDeleteTarget(item)}
                          title="Delete project"
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
                {editItem.id ? 'Edit Project' : 'Add New Project'}
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
                  <label className="admin-label">Project Title *</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editItem.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                      setEditItem((prev) => ({
                        ...prev,
                        title,
                        id: prev.id && !prev.id.startsWith('proj-') ? prev.id : id,
                      }));
                    }}
                    placeholder="e.g. Aurora Pay"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Client Name *</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editItem.client}
                    onChange={(e) => setEditItem({ ...editItem, client: e.target.value })}
                    placeholder="e.g. Aurora Financial Inc."
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">Category</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editItem.category}
                    onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                    placeholder="Fintech & Mobile"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Year</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editItem.year}
                    onChange={(e) => setEditItem({ ...editItem, year: e.target.value })}
                    placeholder="2026"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Visual Style</label>
                  <select
                    className="admin-select"
                    value={editItem.visual_kind}
                    onChange={(e) =>
                      setEditItem({
                        ...editItem,
                        visual_kind: e.target.value as 'browser' | 'mobile' | 'code' | 'analytics',
                      })
                    }
                  >
                    <option value="browser">Browser Window Visual</option>
                    <option value="mobile">Mobile Device Visual</option>
                    <option value="code">Code Terminal Visual</option>
                    <option value="analytics">Analytics Dashboard</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Brief Description *</label>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  value={editItem.description}
                  onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                  placeholder="Overview of the product and engagement..."
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">Challenge</label>
                  <textarea
                    className="admin-textarea"
                    rows={3}
                    value={editItem.challenge}
                    onChange={(e) => setEditItem({ ...editItem, challenge: e.target.value })}
                    placeholder="The core business or technical obstacle..."
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Solution</label>
                  <textarea
                    className="admin-textarea"
                    rows={3}
                    value={editItem.solution}
                    onChange={(e) => setEditItem({ ...editItem, solution: e.target.value })}
                    placeholder="How Wolvo solved it with modern tech..."
                  />
                </div>
              </div>

              {/* Key Results */}
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">Highlight Metric Value</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editItem.result_value}
                    onChange={(e) => setEditItem({ ...editItem, result_value: e.target.value })}
                    placeholder="+140% or 0.8s"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Metric Label</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editItem.result_label}
                    onChange={(e) => setEditItem({ ...editItem, result_label: e.target.value })}
                    placeholder="Completed transfer volume"
                  />
                </div>
              </div>

              {/* Tech Stack Chips */}
              <div className="admin-form-group">
                <label className="admin-label">Technologies Used</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Add tech (e.g. Supabase, React, GSAP)..."
                    value={techTagInput}
                    onChange={(e) => setTechTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (techTagInput.trim() && !editItem.technologies.includes(techTagInput.trim())) {
                          setEditItem({
                            ...editItem,
                            technologies: [...editItem.technologies, techTagInput.trim()],
                          });
                          setTechTagInput('');
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="admin-btn admin-btn--secondary"
                    onClick={() => {
                      if (techTagInput.trim() && !editItem.technologies.includes(techTagInput.trim())) {
                        setEditItem({
                          ...editItem,
                          technologies: [...editItem.technologies, techTagInput.trim()],
                        });
                        setTechTagInput('');
                      }
                    }}
                  >
                    Add
                  </button>
                </div>
                <div className="admin-chip-container">
                  {editItem.technologies.map((t) => (
                    <span key={t} className="admin-chip">
                      <span>{t}</span>
                      <button
                        type="button"
                        className="admin-chip-remove"
                        onClick={() =>
                          setEditItem({
                            ...editItem,
                            technologies: editItem.technologies.filter((tech) => tech !== t),
                          })
                        }
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Image Upload */}
              <div className="admin-form-group">
                <label className="admin-label">Screenshot / Artwork Photo</label>
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
                    <img src={editItem.image_url} alt="Project Visual" />
                  </div>
                )}
              </div>

              {/* Status Toggles */}
              <div className="admin-form-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    id="feat-rail"
                    checked={editItem.featured_on_rail}
                    onChange={(e) => setEditItem({ ...editItem, featured_on_rail: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="feat-rail" style={{ cursor: 'pointer', fontWeight: 600, color: '#fff' }}>
                    Pin to Horizontal Rail
                  </label>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    id="proj-pub"
                    checked={editItem.is_published}
                    onChange={(e) => setEditItem({ ...editItem, is_published: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="proj-pub" style={{ cursor: 'pointer', fontWeight: 600, color: '#fff' }}>
                    Publish to Website
                  </label>
                </div>
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
                Save Project
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
              <h2 className="admin-modal-title">Delete Project</h2>
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
                Are you sure you want to delete <strong style={{ color: '#fff' }}>"{deleteTarget.title}"</strong>?
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
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
