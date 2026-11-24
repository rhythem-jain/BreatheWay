// ============================================================
// src/components/IAQ/DIYHackGrid.tsx
// Senior Craftsmanship Low-Cost & DIY Air Purification Hacks
// Dual Theme (Light & Dark) with WCAG 2.2 AA Contrast
// ============================================================

import { memo } from 'react';
import { DIY_HACKS } from '@/lib/constants';
import { LightbulbIcon, SparklesIcon, ActivityIcon } from '@/components/ui/Icons';

export const DIYHackGrid = memo(function DIYHackGrid() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <LightbulbIcon size={18} />
            </div>
            <span>Low-Cost & DIY Indoor Air Purification Hacks</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Peer-reviewed open-source solutions proven to deliver high CADR at minimal household expense.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {DIY_HACKS.map((hack) => (
          <div
            key={hack.id}
            className="glass-panel glass-panel-interactive rounded-2xl sm:rounded-3xl p-6 sm:p-7 flex flex-col justify-between gap-5 border border-slate-200 dark:border-slate-800"
          >
            <div>
              {/* Header: Title & Cost Rating */}
              <div className="flex items-start justify-between gap-3">
                <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-base sm:text-lg tracking-tight leading-snug">
                  {hack.title}
                </h4>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shrink-0">
                  {hack.costRating}
                </span>
              </div>

              {/* Clean Air Output Metric */}
              <div className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 mt-2 flex items-center gap-1.5">
                <ActivityIcon size={13} className="text-emerald-600 dark:text-emerald-400" />
                <span>Clean Air Output: {hack.cadrDelivery}</span>
              </div>

              {/* Materials List */}
              <div className="text-xs text-slate-700 dark:text-slate-300 mt-3.5 p-3.5 bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 leading-relaxed">
                <strong className="text-slate-900 dark:text-slate-100 font-bold">Materials:</strong> {hack.materials}
              </div>

              {/* Instructions */}
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-3.5 leading-relaxed">
                {hack.instructions}
              </p>
            </div>

            {/* Efficiency Bonus Tag */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-sky-800 dark:text-sky-300 font-medium flex items-center gap-2 bg-sky-50/50 dark:bg-sky-950/30 -mx-6 sm:-mx-7 -mb-6 sm:-mb-7 p-4 sm:p-5 rounded-b-2xl sm:rounded-b-3xl">
              <SparklesIcon size={14} className="text-sky-600 dark:text-sky-400 shrink-0" />
              <span>{hack.efficiencyBonus}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
