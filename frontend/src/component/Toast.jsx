import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

/* ─── Variant definitions ──────────────────────────────────────────────────── */
const VARIANTS = {
  success: {
    Icon:      CheckCircle2,
    bar:       'bg-emerald-400',
    iconColor: 'text-emerald-400',
    border:    'border-emerald-500/25',
    bg:        'bg-emerald-950/70',
    title:     'text-emerald-200',
  },
  error: {
    Icon:      XCircle,
    bar:       'bg-red-400',
    iconColor: 'text-red-400',
    border:    'border-red-500/25',
    bg:        'bg-red-950/70',
    title:     'text-red-200',
  },
  warning: {
    Icon:      AlertTriangle,
    bar:       'bg-amber-400',
    iconColor: 'text-amber-400',
    border:    'border-amber-500/25',
    bg:        'bg-amber-950/70',
    title:     'text-amber-200',
  },
  info: {
    Icon:      Info,
    bar:       'bg-blue-400',
    iconColor: 'text-blue-400',
    border:    'border-blue-500/25',
    bg:        'bg-blue-950/70',
    title:     'text-blue-200',
  },
};

/* ─── Single Toast ─────────────────────────────────────────────────────────── */
export const Toast = ({ type = 'info', title, message, duration = 4500, onClose }) => {
  const [visible, setVisible] = useState(false);
  const v = VARIANTS[type] || VARIANTS.info;
  const { Icon } = v;

  useEffect(() => {
    // Trigger spring-in on next frame
    const raf = requestAnimationFrame(() => setVisible(true));

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 350);
    }, duration);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [duration, onClose]);

  const dismiss = () => {
    setVisible(false);
    setTimeout(onClose, 350);
  };

  return (
    <div
      style={{
        transition: 'opacity 350ms ease, transform 350ms cubic-bezier(0.34,1.56,0.64,1)',
      }}
      className={`
        relative flex items-start gap-3 w-80 rounded-2xl border backdrop-blur-2xl shadow-2xl p-4 overflow-hidden
        ${v.bg} ${v.border}
        ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'}
      `}
    >
      {/* Auto-dismiss progress bar */}
      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/5">
        <div
          className={`h-full ${v.bar} origin-left`}
          style={{ animation: `toast-shrink ${duration}ms linear forwards` }}
        />
      </div>

      <Icon className={`w-5 h-5 mt-0.5 shrink-0 stroke-[1.5] ${v.iconColor}`} />

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold font-geist leading-tight ${v.title}`}>{title}</p>
        {message && (
          <p className="mt-0.5 text-xs text-neutral-400 font-geist leading-snug">{message}</p>
        )}
      </div>

      <button
        onClick={dismiss}
        className="shrink-0 text-neutral-500 hover:text-neutral-200 transition-colors -mt-0.5 -mr-0.5"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4 stroke-[1.5]" />
      </button>

      <style>{`
        @keyframes toast-shrink {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
};

/* ─── Container (fixed bottom-right) ──────────────────────────────────────── */
export const ToastContainer = ({ toasts, removeToast }) => (
  <div
    className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 items-end"
    aria-live="polite"
    aria-label="Notifications"
  >
    {toasts.map((t) => (
      <Toast key={t.id} {...t} onClose={() => removeToast(t.id)} />
    ))}
  </div>
);

export default ToastContainer;
