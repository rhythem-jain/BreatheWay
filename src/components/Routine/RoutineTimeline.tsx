// ============================================================
// src/components/Routine/RoutineTimeline.tsx
// Senior Craftsmanship Hour-by-Hour Exposure Schedule Timeline
// Dual Theme (Light & Dark) with WCAG 2.2 AA Contrast
// ============================================================

import { memo } from 'react';
import type { DailyRoutinePlan } from '@/types';
import { RoutineIcon, ClockIcon, ActivityIcon, AlertTriangleIcon, CheckCircleIcon } from '@/components/ui/Icons';

interface RoutineTimelineProps {
  routinePlan: DailyRoutinePlan;
  zoneName: string;
}

export const RoutineTimeline = memo(function RoutineTimeline({
  routinePlan,
  zoneName,
}: RoutineTimelineProps) {
  return (
    <div className="glass-panel rounded-2xl sm:rounded-3xl p-5 sm:p-8 flex flex-col gap-6">
      {/* Timeline Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-600 dark:text-emerald-400">
              <RoutineIcon size={18} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Hour-by-Hour Exposure & Routine Timeline
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Tailored for <span className="font-semibold text-slate-700 dark:text-slate-300">{routinePlan.persona}</span> in {zoneName}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <ClockIcon size={13} className="text-slate-400 dark:text-slate-500" />
            24-Hour Predictive Window
          </span>
        </div>
      </div>

      {/* Hourly Schedule Track */}
      <div className="relative flex flex-col gap-3">
        {routinePlan.hourlySchedule.map((slot) => {
          const isOutdoor = slot.recommendation === 'safe-outdoor';
          const isIndoorOnly = slot.recommendation === 'indoor-only';

          return (
            <div
              key={slot.hour}
              className={`group relative p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                isIndoorOnly
                  ? 'bg-rose-50/50 hover:bg-rose-50/80 dark:bg-rose-950/20 dark:hover:bg-rose-950/30 border-rose-200/90 dark:border-rose-900/50'
                  : isOutdoor
                  ? 'bg-emerald-50/50 hover:bg-emerald-50/80 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/30 border-emerald-200/90 dark:border-emerald-900/50'
                  : 'bg-slate-50/70 hover:bg-slate-50 dark:bg-slate-900/60 dark:hover:bg-slate-900/90 border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Left Column: Time & Classification Pill */}
              <div className="flex items-center gap-3 min-w-[170px] shrink-0">
                <div className="flex items-baseline gap-1">
                  <span className="text-base sm:text-lg font-black font-mono tracking-tight text-slate-900 dark:text-slate-100">
                    {slot.timeLabel}
                  </span>
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                    isIndoorOnly
                      ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800/80'
                      : isOutdoor
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/80'
                      : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800/80'
                  }`}
                >
                  {isIndoorOnly ? (
                    <AlertTriangleIcon size={11} className="text-rose-600 dark:text-rose-400" />
                  ) : isOutdoor ? (
                    <CheckCircleIcon size={11} className="text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  )}
                  <span>{slot.recommendation.replace('-', ' ')}</span>
                </span>
              </div>

              {/* Middle Column: Activity & Clinical Advisory */}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
                  {slot.activity}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {slot.healthImpactNotes}
                </p>
              </div>

              {/* Right Column: Telemetry Metrics (AQI & Inversion Risk) */}
              <div className="flex items-center gap-4 text-xs shrink-0 justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-200 dark:border-slate-800">
                <div className="text-left lg:text-right">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                    Predicted AQI
                  </div>
                  <div className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100 mt-0.5 flex items-center lg:justify-end gap-1.5">
                    <ActivityIcon size={13} className="text-slate-400 dark:text-slate-500" />
                    <span>{slot.predictedAQI}</span>
                  </div>
                </div>

                <div className="text-right pl-4 border-l border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                    Inversion Risk
                  </div>
                  <div className="mt-0.5">
                    <span
                      className={`inline-block font-bold text-xs capitalize ${
                        slot.inversionLikelihood === 'high'
                          ? 'text-rose-700 dark:text-rose-400'
                          : slot.inversionLikelihood === 'moderate'
                          ? 'text-amber-700 dark:text-amber-400'
                          : 'text-emerald-700 dark:text-emerald-400'
                      }`}
                    >
                      {slot.inversionLikelihood}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
