import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { gsap } from '@/animations/gsap';
import { lockScroll, prefersReducedMotion, unlockScroll } from '@/animations/smoothScroll';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  size?: 'md' | 'lg' | 'xl';
  className?: string;
  children: ReactNode;
}

/**
 * Accessible modal built on the native <dialog> element: focus is trapped and
 * restored by the browser, Esc closes, the page behind is inert and locked.
 */
export function Modal({ open, onClose, labelledBy, size = 'md', className = '', children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) setMounted(true);

  // Open: show as modal, lock page scroll, animate in.
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !mounted || !dialog) return;
    if (!dialog.open) dialog.showModal();
    lockScroll();

    const panel = dialog.querySelector('.modal__panel');
    const backdrop = dialog.querySelector('.modal__backdrop');
    const scroller = dialog.querySelector('.modal__scroller');
    if (scroller) scroller.scrollTop = 0;
    if (!prefersReducedMotion()) {
      gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' });
      gsap.fromTo(panel, { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power4.out', clearProps: 'transform' });
    }
    return () => unlockScroll();
  }, [open, mounted]);

  // Close: animate out, then close the dialog and unmount its content.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (open || !mounted || !dialog) return;
    const finish = () => {
      if (dialog.open) dialog.close();
      setMounted(false);
    };
    if (prefersReducedMotion()) {
      finish();
      return;
    }
    const tl = gsap.timeline({ onComplete: finish });
    tl.to(dialog.querySelector('.modal__panel'), { y: 28, opacity: 0, duration: 0.28, ease: 'power2.in' }).to(
      dialog.querySelector('.modal__backdrop'),
      { opacity: 0, duration: 0.28, ease: 'power2.in' },
      0.06,
    );
    return () => {
      tl.kill();
    };
  }, [open, mounted]);

  if (!mounted) return null;

  return (
    <dialog
      ref={dialogRef}
      className={`modal modal--${size} ${className}`}
      aria-labelledby={labelledBy}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClose={() => {
        // Browser-forced close (e.g. repeated Esc): keep React state in sync.
        if (open) onClose();
      }}
    >
      <div className="modal__backdrop" aria-hidden="true" onClick={onClose} />
      <div
        className="modal__scroller"
        data-lenis-prevent
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="modal__panel">
          <div className="modal__close-wrap">
            <button type="button" className="icon-btn modal__close" onClick={onClose} aria-label="Close dialog">
              <X strokeWidth={1.85} aria-hidden="true" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </dialog>
  );
}
