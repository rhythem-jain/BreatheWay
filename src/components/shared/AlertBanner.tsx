// ============================================================
// src/components/shared/AlertBanner.tsx
// Modern Assertive Smog & Inversion Hazard Notification Toast
// Linear/Stripe Craftsmanship & Full Dual-Theme Support
// Per ACCESSIBILITY.md §6 & ARCHITECTURE_PATTERNS.md §2.1
// ============================================================

import { memo } from 'react';
import type { CommunityAlert } from '@/types';
import { AlertTriangleIcon, CloseIcon } from '@/components/ui/Icons';

interface AlertBannerProps {
  alerts: CommunityAlert[];
  onDismiss: (id: string) => void;
}

export const AlertBanner = memo(function AlertBanner({
  alerts,
  onDismiss,
}: AlertBannerProps) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="false"
      className="fixed top-20 right-4 left-4 md:left-auto md:w-96 z-50 flex flex-col gap-2.5 pointer-events-none"
    >
      {alerts.slice(0, 2).map((alert) => (
        <div
          key={alert.id}
          className={`pointer-events-auto p-4 rounded-2xl border shadow-elevated backdrop-blur-xl transition-all duration-200 animate-in slide-in-from-top-4 ${
            alert.severity === 'emergency'
              ? 'bg-white/95 dark:bg-[#180a0e]/95 border-rose-300 dark:border-rose-500/60 text-slate-900 dark:text-rose-100 ring-1 ring-rose-500/20'
              : 'bg-white/95 dark:bg-[#181206]/95 border-amber-300 dark:border-amber-500/60 text-slate-900 dark:text-amber-100 ring-1 ring-amber-500/20'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                  alert.severity === 'emergency'
                    ? 'bg-rose-100 dark:bg-rose-950 border border-rose-300 dark:border-rose-500/50 text-rose-700 dark:text-rose-400'
                    : 'bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-500/50 text-amber-700 dark:text-amber-400'
                }`}
              >
                <AlertTriangleIcon size={18} className="animate-pulse" />
              </div>
              <div>
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    alert.severity === 'emergency'
                      ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-500/40'
                      : 'bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-500/40'
                  }`}
                >
                  {alert.zone}
                </span>
                <h2 className="font-bold text-sm text-slate-900 dark:text-white mt-1 leading-snug">
                  {alert.headline}
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(alert.id)}
              aria-label={`Dismiss alert for ${alert.zone}`}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-400 cursor-pointer"
            >
              <CloseIcon size={14} />
            </button>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed pl-1">
            {alert.instructions}
          </p>
        </div>
      ))}
    </div>
  );
});
