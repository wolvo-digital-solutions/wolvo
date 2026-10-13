import { ArrowLeft, ArrowRight } from 'lucide-react';
import { padNumber } from '@/lib/format';

interface CarouselControlsProps {
  label: string;
  index: number;
  count: number;
  progress: number;
  atStart: boolean;
  atEnd: boolean;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}

export function CarouselControls({ label, index, count, progress, atStart, atEnd, onPrev, onNext, className = '' }: CarouselControlsProps) {
  return (
    <div className={`carousel-controls ${className}`}>
      <p className="carousel-controls__count" aria-live="polite">
        <span>{padNumber(Math.min(index + 1, count), 2)}</span> / {padNumber(count, 2)}
        <span className="sr-only"> {label}</span>
      </p>
      <div className="carousel-controls__progress" aria-hidden="true">
        <div className="carousel-controls__bar" style={{ transform: `scaleX(${Math.max(0.08, progress)})` }} />
      </div>
      <button type="button" className="icon-btn" onClick={onPrev} disabled={atStart} aria-label={`Previous ${label}`}>
        <ArrowLeft strokeWidth={1.85} aria-hidden="true" />
      </button>
      <button type="button" className="icon-btn" onClick={onNext} disabled={atEnd} aria-label={`Next ${label}`}>
        <ArrowRight strokeWidth={1.85} aria-hidden="true" />
      </button>
    </div>
  );
}
