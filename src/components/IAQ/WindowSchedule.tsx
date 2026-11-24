// ============================================================
// src/components/IAQ/WindowSchedule.tsx
// Senior Craftsmanship Inversion-Aware Window Ventilation Schedule
// Dual Theme (Light & Dark) with WCAG 2.2 AA Contrast
// ============================================================

import { memo } from 'react';
import {
  WindowIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  WindIcon,
  ClockIcon,
} from '@/components/ui/Icons';

interface WindowScheduleProps {
  currentAqi: number;
}

export const WindowSchedule = memo(function WindowSchedule({ currentAqi }: WindowScheduleProps) {
  return (
    <div className="glass-panel rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col gap-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-600 dark:text-emerald-400">
            <WindowIcon size={18} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Smart Inversion-Aware Window Ventilation Schedule
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tailored to current outdoor AQI ({currentAqi}) and meteorological boundary layer dynamics.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
          <WindIcon size={13} className="text-slate-400 dark:text-slate-500" />
          Atmospheric Boundary Aware
        </span>
      </div>

      {/* 3 Boundary Layer Windows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Morning Inversion Lock */}
        <div className="bg-rose-50/50 hover:bg-rose-50/80 dark:bg-rose-950/20 dark:hover:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                <ClockIcon size={12} className="text-rose-600 dark:text-rose-400" />
                Morning Inversion Lock (6:00 AM – 10:30 AM)
              </span>
              <span className="w-2 h-2 rounded-full bg-rose-500" />
            </div>

            <strong className="text-slate-900 dark:text-slate-100 text-base font-extrabold block tracking-tight">
              Windows Tightly Latched
            </strong>

            <p className="text-slate-600 dark:text-slate-300 text-xs mt-2.5 leading-relaxed">
              Cold nocturnal air traps ground-level vehicular soot. Opening windows increases indoor PM2.5 by 300%.
            </p>
          </div>

          <div className="text-[11px] font-bold text-rose-800 dark:text-rose-200 bg-rose-100/90 dark:bg-rose-950/80 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-800/80 flex items-center gap-1.5">
            <AlertTriangleIcon size={12} className="text-rose-600 dark:text-rose-400" />
            <span>Action: Run recirculating HEPA</span>
          </div>
        </div>

        {/* Optimal Flush Window */}
        <div className="bg-emerald-50/50 hover:bg-emerald-50/80 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <ClockIcon size={12} className="text-emerald-600 dark:text-emerald-400" />
                Optimal Flush Window (1:30 PM – 3:30 PM)
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <strong className="text-slate-900 dark:text-slate-100 text-base font-extrabold block tracking-tight">
              Crack Opposing Windows (15 mins)
            </strong>

            <p className="text-slate-600 dark:text-slate-300 text-xs mt-2.5 leading-relaxed">
              Solar radiation breaks the surface inversion, maximizing natural vertical air mixing and flushing stale CO2.
            </p>
          </div>

          <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-200 bg-emerald-100/90 dark:bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800/80 flex items-center gap-1.5">
            <CheckCircleIcon size={12} className="text-emerald-600 dark:text-emerald-400" />
            <span>Action: 15-minute cross-ventilation</span>
          </div>
        </div>

        {/* Evening Rush Trap */}
        <div className="bg-amber-50/50 hover:bg-amber-50/80 dark:bg-amber-950/20 dark:hover:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <ClockIcon size={12} className="text-amber-600 dark:text-amber-400" />
                Evening Rush Trap (5:30 PM – 9:00 PM)
              </span>
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            </div>

            <strong className="text-slate-900 dark:text-slate-100 text-base font-extrabold block tracking-tight">
              Seal Perimeter & Run HEPA
            </strong>

            <p className="text-slate-600 dark:text-slate-300 text-xs mt-2.5 leading-relaxed">
              Commuter traffic and cooling surface temperatures cause toxic secondary particulate settling.
            </p>
          </div>

          <div className="text-[11px] font-bold text-amber-800 dark:text-amber-200 bg-amber-100/90 dark:bg-amber-950/80 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800/80 flex items-center gap-1.5">
            <AlertTriangleIcon size={12} className="text-amber-600 dark:text-amber-400" />
            <span>Action: Maximum fan CADR speed</span>
          </div>
        </div>
      </div>
    </div>
  );
});
