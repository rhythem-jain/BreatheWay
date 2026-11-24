// ============================================================
// src/components/Auth/views/AuthSuccessView.tsx
// Authentication Success Confirmation View
// ============================================================

import { CheckCircleIcon } from '@/components/ui/Icons';
import { BRANDING } from '@/config/branding';

export function AuthSuccessView() {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center animate-in zoom-in-95">
      <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
        <CheckCircleIcon size={32} />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Access Granted</h3>
      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xs">
        Welcome to the {BRANDING.productName} Intelligence Network. Initializing telemetry feed…
      </p>
    </div>
  );
}
