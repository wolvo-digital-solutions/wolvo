import { site } from '@/data/site';

export function StatusPill({ label = site.availability, className = '' }: { label?: string; className?: string }) {
  return (
    <span className={`status ${className}`}>
      <span className="status__dot" aria-hidden="true" />
      {label}
    </span>
  );
}
