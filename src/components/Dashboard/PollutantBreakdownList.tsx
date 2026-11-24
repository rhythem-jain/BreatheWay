// ============================================================
// src/components/Dashboard/PollutantBreakdownList.tsx
// Pollutant Trend Sparklines & Breakdown Panel
// ============================================================

import { memo } from 'react';
import type { PollutantReading } from '@/types';
import { Sparkline } from '@/components/shared/Sparkline';
import { SparklesIcon } from '@/components/ui/Icons';

export interface PollutantBreakdownListProps {
  pollutantBreakdown: PollutantReading[];
  zoneName: string;
}

/**
 * Pollutant Trend Sparklines & Breakdown Panel
 * Displays multi-parameter gas and particle readings, sparklines, and chemical kinetics advisory.
 */
export const PollutantBreakdownList = memo(function PollutantBreakdownList({
  pollutantBreakdown,
  zoneName,
}: PollutantBreakdownListProps) {
  return (
    <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between gap-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-sky-500 dark:bg-cyan-400" aria-hidden="true" />
          <span className="text-[10px] font-black tracking-widest uppercase text-sky-600 dark:text-cyan-400 font-mono">
            GAS &amp; PARTICLE TELEMETRY
          </span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Pollutant Trend Sparklines
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Multi-parameter gas and particle telemetry ({zoneName})
        </p>
      </div>

      {/* High-Density Pollutant Telemetry List */}
      <div className="flex flex-col gap-2.5">
        {pollutantBreakdown.map((pollutant) => {
          const isExceeded = pollutant.current > pollutant.threshold;
          const ratio = Math.min(100, Math.round((pollutant.current / (pollutant.threshold * 1.5)) * 100));

          return (
            <div
              key={pollutant.type}
              className="bg-slate-50/90 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              {/* Pollutant Name & Numeric Reading */}
              <div className="min-w-[85px]">
                <div className="flex items-baseline gap-1">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">
                    {pollutant.type}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    ({pollutant.unit})
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono mt-0.5">
                  {pollutant.current}{' '}
                  <span className="text-[10px] text-slate-400 font-normal">/ {pollutant.threshold}</span>
                </div>

                {/* Micro Threshold Meter */}
                <div className="w-16 h-1 rounded-full bg-slate-200 dark:bg-slate-800 mt-1 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isExceeded ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${ratio}%` }}
                  />
                </div>
              </div>

              {/* Sparkline Graphic */}
              <div className="flex-1 flex justify-center px-1">
                <Sparkline
                  values={pollutant.history}
                  color={isExceeded ? '#ef4444' : '#10b981'}
                  width={120}
                  height={30}
                  label={`${pollutant.type} 7-hour trend`}
                />
              </div>

              {/* Status Badge */}
              <div className="text-right min-w-[75px]">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                    pollutant.status === 'Hazardous' || pollutant.status === 'Critical'
                      ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/50'
                      : pollutant.status === 'Unhealthy' || pollutant.status === 'Moderate' || pollutant.status === 'High'
                      ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/50'
                      : 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50'
                  }`}
                >
                  {pollutant.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chemical Kinetics & Smog Insight Briefing */}
      <div className="text-[11px] text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/80 rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-800 flex items-start gap-2.5">
        <SparklesIcon size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 dark:text-white font-bold">Atmospheric Aerosol Kinetics:</strong>{' '}
          Secondary PM2.5 surges when ambient humidity exceeds 75% in the presence of vehicle-emitted NO2 and sulfur precursors. Low boundary mixing traps pollutants within breathing elevation.
        </div>
      </div>
    </div>
  );
});
