import { useState, useEffect, type ChangeEvent } from 'react';
import {
  Upload,
  Copy,
  Trash2,
  Check,
  Folder,
  RefreshCw,
  X,
} from 'lucide-react';
import { listMediaFiles, uploadMediaFile, deleteMediaFile } from '@/lib/supabase';
import type { StorageFile } from '@/types/cms';

interface MediaManagerProps {
  onNotify: (text: string, type?: 'success' | 'error') => void;
}

export function MediaManager({ onNotify }: MediaManagerProps) {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [folder, setFolder] = useState('uploads');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StorageFile | null>(null);

  const loadFiles = async () => {
    setIsLoading(true);
    try {
      const data = await listMediaFiles(folder);
      setFiles(data);
    } catch {
      onNotify('Failed to list media files', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [folder]);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setIsUploading(true);
    try {
      for (let i = 0; i < fileList.length; i++) {
        await uploadMediaFile(fileList[i], folder);
      }
      onNotify(`Uploaded ${fileList.length} file(s) to ${folder}`);
      await loadFiles();
    } catch (err: unknown) {
      onNotify(err instanceof Error ? err.message : 'Upload failed', 'error');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const copyUrl = (file: StorageFile) => {
    const url = file.publicUrl || '';
    navigator.clipboard.writeText(url);
    setCopiedId(file.name);
    onNotify('Public URL copied to clipboard');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMediaFile(`${folder}/${deleteTarget.name}`);
      onNotify('File deleted from storage');
      setDeleteTarget(null);
      await loadFiles();
    } catch (err: unknown) {
      onNotify(err instanceof Error ? err.message : 'Delete failed', 'error');
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Media & File Storage</h1>
          <p className="admin-page-desc">
            Upload, manage and inspect assets stored in the Supabase <code>site-media</code> bucket.
          </p>
        </div>

        <div className="admin-page-actions">
          <button
            type="button"
            className="admin-btn admin-btn--secondary"
            onClick={loadFiles}
            title="Refresh files"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
          <label className="admin-btn admin-btn--primary" style={{ cursor: 'pointer' }}>
            <Upload size={16} />
            <span>{isUploading ? 'Uploading...' : 'Upload Media'}</span>
            <input
              type="file"
              multiple
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleUpload}
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {/* Storage Backend Banner */}
      <div className="admin-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Folder size={18} className="admin-text-secondary" />
            <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>Active Storage Bucket:</span>
            <code style={{ fontSize: '0.85rem', color: '#00d2ff', background: 'rgba(0, 210, 255, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
              site-media / {folder}
            </code>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['uploads', 'articles', 'projects', 'services', 'avatars'].map((f) => (
              <button
                key={f}
                type="button"
                className={`admin-btn admin-btn--sm ${folder === f ? 'admin-btn--primary' : 'admin-btn--secondary'}`}
                onClick={() => setFolder(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '48px', color: '#6b7a90' }}>
          Loading storage files...
        </div>
      ) : files.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '64px' }}>
          <Upload size={40} style={{ margin: '0 auto 16px', color: '#6b7a90' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
            No media files in "{folder}"
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#a3b1c4', marginBottom: '18px' }}>
            Upload project screenshots, article banners, or team avatars directly to Supabase Storage.
          </p>
          <label className="admin-btn admin-btn--primary" style={{ cursor: 'pointer', display: 'inline-flex' }}>
            <Upload size={16} />
            <span>Choose Files to Upload</span>
            <input
              type="file"
              multiple
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleUpload}
            />
          </label>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '18px' }}>
          {files.map((file) => (
            <div
              key={file.name}
              className="admin-card"
              style={{
                padding: '14px',
                marginBottom: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '160px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  background: '#050a18',
                  border: '1px solid var(--admin-border)',
                  position: 'relative',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                {file.publicUrl ? (
                  <img
                    src={file.publicUrl}
                    alt={file.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{ fontSize: '0.8rem', color: '#6b7a90' }}>No Preview</span>
                )}
              </div>

              <div>
                <div
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#fff',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={file.name}
                >
                  {file.name}
                </div>
                <div style={{ fontSize: '0.725rem', color: '#6b7a90', marginTop: '2px' }}>
                  {file.created_at ? new Date(file.created_at).toLocaleDateString() : 'Storage asset'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                <button
                  type="button"
                  className="admin-btn admin-btn--secondary admin-btn--sm"
                  style={{ flex: 1 }}
                  onClick={() => copyUrl(file)}
                >
                  {copiedId === file.name ? <Check size={14} className="admin-text-success" /> : <Copy size={14} />}
                  <span>{copiedId === file.name ? 'Copied' : 'Copy URL'}</span>
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn--icon admin-btn--danger admin-btn--sm"
                  onClick={() => setDeleteTarget(file)}
                  title="Delete from storage"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="admin-modal-backdrop" onClick={() => setDeleteTarget(null)}>
          <div className="admin-modal admin-modal--sm" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">Delete File</h2>
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
                Are you sure you want to delete <strong style={{ color: '#fff' }}>"{deleteTarget.name}"</strong> from Supabase Storage?
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
                Delete File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
