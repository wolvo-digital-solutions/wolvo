import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="admin-toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`admin-toast admin-toast--${toast.type}`}>
          {toast.type === 'success' ? (
            <CheckCircle2 size={18} className="admin-text-success" />
          ) : (
            <AlertCircle size={18} className="admin-text-danger" />
          )}
          <span className="admin-toast-text">{toast.text}</span>
          <button
            type="button"
            className="admin-toast-dismiss"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
