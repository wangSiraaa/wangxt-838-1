import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useUiStore } from '../../stores/useUiStore';
import { cn } from '../../lib/utils';

const toastStyles = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-orange-50 border-orange-200 text-orange-800',
  info: 'bg-sky-50 border-sky-200 text-sky-800'
};

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info
};

export function ToastContainer() {
  const toasts = useUiStore(state => state.toasts);
  const removeToast = useUiStore(state => state.removeToast);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 w-full max-w-sm">
      {toasts.map(toast => {
        const Icon = toastIcons[toast.type];
        return (
          <div
            key={toast.id}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg',
              'transform transition-all duration-300 animate-in slide-in-from-right fade-in',
              toastStyles[toast.type]
            )}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 rounded-full p-0.5 hover:bg-black/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
