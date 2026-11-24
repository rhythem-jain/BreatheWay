// ============================================================
// src/components/Dashboard/InversionCard.tsx
// Inversion Boundary Trap Dynamics Card
// ============================================================

import { memo } from 'react';
import type { InversionRiskResult } from '@/lib/compute/meteorology';
import { AlertTriangleIcon, CheckCircleIcon } from '@/components/ui/Icons';

export interface InversionCardProps {
  inversionStatus: InversionRiskResult;
}

/**
 * Inversion Boundary Trap Dynamics Card
 * Visualizes thermal cap risk level, inversion rationale, and cap ceiling altitude.
 */
export const InversionCard = memo(function InversionCard({ inversionStatus }: InversionCardProps) {
  return (
    <div
      className={`rounded-2xl p-5 border transition-all flex flex-col justify-between gap-4 shadow-2xs ${
        inversionStatus.isInversion
          ? 'bg-amber-50/90 dark:bg-amber-950/30 border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-100'
          : 'bg-emerald-50/90 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-100'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wider font-mono">
          Inversion Dynamics
        </span>
        <span className={`p-2 rounded-xl border ${inversionStatus.isInversion ? 'bg-amber-100/80 dark:bg-amber-900/60 border-amber-300 dark:border-amber-700/60' : 'bg-emerald-100/80 dark:bg-emerald-900/60 border-emerald-300 dark:border-emerald-700/60'}`}>
          {inversionStatus.isInversion ? (
            <AlertTriangleIcon size={16} className="text-amber-600 dark:text-amber-400" />
          ) : (
            <CheckCircleIcon size={16} className="text-emerald-600 dark:text-emerald-400" />
          )}
        </span>
      </div>

      <div>
        <div className="text-lg font-black capitalize tracking-tight flex items-center gap-2">
          <span>{inversionStatus.severity} Risk Status</span>
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed line-clamp-2">
          {inversionStatus.rationale}
        </p>
      </div>

      <div className="text-[11px] font-mono opacity-90 pt-2 border-t border-current/20 flex items-center justify-between">
        <span>Thermal Inversion Cap:</span>
        <span className="font-extrabold">~420m AGL</span>
      </div>
    </div>
  );
});
