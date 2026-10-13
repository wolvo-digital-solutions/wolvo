import { useState, type ReactNode } from 'react';
import type { ImageSet } from '@/data/images';

interface PictureProps {
  set: ImageSet;
  alt: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  /** Image to try if the set fails to load (e.g. a different, self-contained asset). */
  fallbackSrc?: string;
  /** Rendered if every source fails; otherwise the container's own background shows. */
  fallback?: ReactNode;
  /**
   * Media query where the image is hidden by CSS. Those viewports get a 1×1
   * placeholder source, so the real image is never downloaded there.
   */
  skipWhen?: string;
}

/** Transparent 1×1 GIF. */
const BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

type Stage = 'primary' | 'fallback' | 'failed';

/**
 * AVIF → WebP → JPEG responsive image with intrinsic dimensions (no layout shift).
 * Never shows a broken-image icon: on error it steps to `fallbackSrc`, then to
 * `fallback` (or nothing).
 */
export function Picture({ set, alt, sizes, className, imgClassName, priority = false, fallbackSrc, fallback, skipWhen }: PictureProps) {
  const [stage, setStage] = useState<Stage>('primary');
  const srcset = (ext: string) => set.widths.map((w) => `${set.base}-${w}.${ext} ${w}w`).join(', ');
  const common = {
    className: imgClassName,
    width: set.width,
    height: set.height,
    alt,
    loading: priority ? ('eager' as const) : ('lazy' as const),
    decoding: priority ? ('sync' as const) : ('async' as const),
  };

  if (stage === 'failed') return <>{fallback ?? null}</>;

  if (stage === 'fallback' && fallbackSrc) {
    return (
      <picture className={className}>
        <img {...common} src={fallbackSrc} onError={() => setStage('failed')} />
      </picture>
    );
  }

  return (
    <picture className={className}>
      {skipWhen && <source media={skipWhen} srcSet={BLANK} />}
      <source type="image/avif" srcSet={srcset('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcset('webp')} sizes={sizes} />
      <img
        {...common}
        src={set.fallback}
        fetchPriority={priority ? 'high' : 'auto'}
        onError={() => setStage(fallbackSrc ? 'fallback' : 'failed')}
      />
    </picture>
  );
}
