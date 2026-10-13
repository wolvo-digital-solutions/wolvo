interface LogoProps {
  className?: string;
  /** Render as a link to the top of the page. */
  href?: string;
  showWordmark?: boolean;
  /** Load eagerly (above-the-fold placements such as the navbar). */
  priority?: boolean;
}

const MARK = { webp: '/brand/wolvo-mark.webp', png: '/brand/wolvo-mark.png', width: 218, height: 160 } as const;

/** Official Wolvo mark — the wolf-headed "W" from the brand artwork (transparent, works on light and dark). */
export function LogoMark({ className = 'logo__mark', priority = false }: { className?: string; priority?: boolean }) {
  return (
    <picture className={className}>
      <source type="image/webp" srcSet={MARK.webp} />
      <img
        src={MARK.png}
        width={MARK.width}
        height={MARK.height}
        alt=""
        aria-hidden="true"
        decoding="async"
        loading={priority ? 'eager' : 'lazy'}
        draggable={false}
      />
    </picture>
  );
}

export function Logo({ className = '', href, showWordmark = true, priority = false }: LogoProps) {
  const content = (
    <>
      <LogoMark priority={priority} />
      {showWordmark && <span className="logo__word">Wolvo</span>}
    </>
  );
  if (href) {
    return (
      <a href={href} className={`logo ${className}`} aria-label="Wolvo — back to top">
        {content}
      </a>
    );
  }
  return (
    <span className={`logo ${className}`} role="img" aria-label="Wolvo">
      {content}
    </span>
  );
}
