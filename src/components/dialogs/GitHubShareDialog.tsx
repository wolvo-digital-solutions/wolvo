import { useEffect, useState } from 'react';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  GitBranch,
  GitFork,
  Globe,
  Mail,
  MessageCircle,
  Send,
  Share2,
  Star,
} from 'lucide-react';
import { useUI, useUIState } from '@/context/UIContext';
import { site } from '@/data/site';
import {
  buildCloneUrl,
  copyToClipboard,
  fetchGitHubRepoDetails,
  generateShareLinks,
  shareNatively,
  type GitHubRepoMeta,
} from '@/lib/github';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import './GitHubShareDialog.css';

export default function GitHubShareDialog() {
  const { githubShare } = useUIState();
  const { closeGitHubShare } = useUI();

  const [meta, setMeta] = useState<GitHubRepoMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedClone, setCopiedClone] = useState(false);

  const owner = site.github.owner;
  const repo = site.github.repo;
  const repoUrl = site.github.url;
  const cloneCommand = `git clone ${buildCloneUrl(repoUrl)}`;
  const livePagesUrl = site.github.pagesUrl;

  const shareLinks = generateShareLinks({
    url: repoUrl,
    title: `${site.name} Digital Agency — GitHub Repository`,
    text: `Explore the Wolvo website repository on GitHub:`,
  });

  useEffect(() => {
    let ignore = false;
    if (githubShare && !meta) {
      fetchGitHubRepoDetails(owner, repo)
        .then((result) => {
          if (ignore) return;
          if (result.success && result.data) {
            setMeta(result.data);
          } else if (result.error) {
            setApiError(result.error);
          }
        })
        .catch(() => {
          if (!ignore) {
            setApiError('Unable to connect to GitHub API right now. Direct repository links remain functional.');
          }
        })
        .finally(() => {
          if (!ignore) {
            setLoading(false);
          }
        });
    }
    return () => {
      ignore = true;
    };
  }, [githubShare, meta, owner, repo]);

  const handleCopyLink = async () => {
    const ok = await copyToClipboard(repoUrl);
    if (ok) {
      setCopiedLink(true);
      window.setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyClone = async () => {
    const ok = await copyToClipboard(cloneCommand);
    if (ok) {
      setCopiedClone(true);
      window.setTimeout(() => setCopiedClone(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    await shareNatively({
      title: `${site.name} — GitHub Repository`,
      text: `Check out the ${site.name} digital agency repository on GitHub:`,
      url: repoUrl,
    });
  };

  const hasNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  return (
    <Modal open={githubShare} onClose={closeGitHubShare} labelledBy="github-share-title" size="lg">
      <div className="gh-dialog">
        {/* Header */}
        <div className="gh-dialog__header">
          <div className="gh-dialog__icon-wrap" aria-hidden="true">
            <Share2 strokeWidth={2} size={28} />
          </div>
          <div className="gh-dialog__titles">
            <span className="gh-dialog__badge">Open Source • Wolvo</span>
            <h2 id="github-share-title" className="gh-dialog__title">
              {owner}/{repo}
            </h2>
            <p className="gh-dialog__subtitle">
              Official repository for the Wolvo digital agency platform, built with React, Vite, TypeScript and GSAP.
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="gh-dialog__stats">
          <span className="gh-stat-pill gh-stat-pill--branch" title="Default branch">
            <GitBranch size={14} aria-hidden="true" />
            {meta?.defaultBranch || 'main'}
          </span>
          <span className="gh-stat-pill" title="Repository Stars">
            <Star size={14} aria-hidden="true" />
            {meta ? `${meta.stars} stars` : loading ? 'Loading...' : 'GitHub Repo'}
          </span>
          <span className="gh-stat-pill" title="Repository Forks">
            <GitFork size={14} aria-hidden="true" />
            {meta ? `${meta.forks} forks` : 'Public'}
          </span>
          <span className="gh-stat-pill" title="Public Repository">
            <CheckCircle2 size={14} aria-hidden="true" />
            {meta?.isPrivate ? 'Private' : 'Public Access'}
          </span>
        </div>

        {/* API Error / Notice Banner if applicable */}
        {apiError && (
          <div className="gh-dialog__alert gh-dialog__alert--warn" role="alert">
            <AlertCircle size={18} aria-hidden="true" />
            <div>
              <strong>Notice:</strong> {apiError}
            </div>
          </div>
        )}

        {/* Repository URL Box */}
        <div className="gh-field">
          <label htmlFor="gh-repo-url" className="gh-field__label">
            <span>Repository Sharing URL</span>
            <span className="text-muted text-xs">Direct Web Link</span>
          </label>
          <div className="gh-field__box">
            <input
              id="gh-repo-url"
              type="text"
              readOnly
              value={repoUrl}
              className="gh-field__input"
              onFocus={(e) => e.currentTarget.select()}
            />
            <button
              type="button"
              className={`gh-field__copy-btn${copiedLink ? ' is-copied' : ''}`}
              onClick={handleCopyLink}
              aria-label="Copy repository link"
            >
              {copiedLink ? (
                <>
                  <Check size={14} aria-hidden="true" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={14} aria-hidden="true" />
                  Copy Link
                </>
              )}
            </button>
          </div>
        </div>

        {/* Git Clone Command Box */}
        <div className="gh-field">
          <label htmlFor="gh-clone-cmd" className="gh-field__label">
            <span>Clone with HTTPS</span>
            <span className="text-muted text-xs">Git Terminal</span>
          </label>
          <div className="gh-field__box">
            <input
              id="gh-clone-cmd"
              type="text"
              readOnly
              value={cloneCommand}
              className="gh-field__input gh-field__input--code"
              onFocus={(e) => e.currentTarget.select()}
            />
            <button
              type="button"
              className={`gh-field__copy-btn${copiedClone ? ' is-copied' : ''}`}
              onClick={handleCopyClone}
              aria-label="Copy git clone command"
            >
              {copiedClone ? (
                <>
                  <Check size={14} aria-hidden="true" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={14} aria-hidden="true" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Share via Platform */}
        <div className="gh-share-group">
          <span className="gh-share-group__title">Share this repository:</span>
          <div className="gh-share-grid">
            {hasNativeShare && (
              <button type="button" className="gh-share-btn" onClick={handleNativeShare}>
                <Send size={15} aria-hidden="true" />
                <span>Share Sheet</span>
              </button>
            )}
            <a
              href={shareLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="gh-share-btn"
              title="Share via WhatsApp"
            >
              <MessageCircle size={15} aria-hidden="true" />
              <span>WhatsApp</span>
            </a>
            <a
              href={shareLinks.x}
              target="_blank"
              rel="noopener noreferrer"
              className="gh-share-btn"
              title="Share on X (Twitter)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>X (Twitter)</span>
            </a>
            <a
              href={shareLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="gh-share-btn"
              title="Share on LinkedIn"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.65 1.65 0 1 0 0-3.3 1.65 1.65 0 0 0 0 3.3m1.4 9.74V9.93H5.06v8.57h2.8z" />
              </svg>
              <span>LinkedIn</span>
            </a>
            <a href={shareLinks.email} className="gh-share-btn" title="Share via Email">
              <Mail size={15} aria-hidden="true" />
              <span>Email</span>
            </a>
          </div>
        </div>

        {/* Dialog Action Buttons */}
        <div className="gh-dialog__actions">
          <Button
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            size="md"
            icon="arrow-up-right"
          >
            Open on GitHub
          </Button>
          <Button
            href={livePagesUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
            size="md"
          >
            <Globe size={16} aria-hidden="true" />
            Live Deployment
          </Button>
          <Button
            variant="ghost"
            size="md"
            onClick={closeGitHubShare}
            style={{ marginLeft: 'auto' }}
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
