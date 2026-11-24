// ============================================================
// src/components/Dashboard/MicroclimateCard.tsx
// Meteorological Boundary Microclimate Card
// ============================================================

import { memo } from 'react';
import type { UrbanZone } from '@/types';
import { ThermometerIcon, WindIcon } from '@/components/ui/Icons';

export interface MicroclimateCardProps {
  zone: UrbanZone;
}

/**
 * Meteorological Boundary Microclimate Card
 * Displays ambient temperature, relative humidity, surface wind, and dispersion velocity.
 */
export const MicroclimateCard = memo(function MicroclimateCard({ zone }: MicroclimateCardProps) {
  const isStagnant = zone.windSpeedKmh < 5;

  return (
    <div className="bg-slate-50/90 dark:bg-slate-900/60 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between gap-4 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
          Boundary Microclimate
        </span>
        <span className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200/60 dark:border-sky-800/60">
          <ThermometerIcon size={16} />
        </span>
      </div>

      <div>
        <div className="text-2xl font-black text-slate-900 dark:text-white font-mono-numbers tracking-tight">
          {zone.temperatureC}°C{' '}
          <span className="text-sm text-slate-500 dark:text-slate-400 font-normal">
            / {zone.humidityPercent}% RH
          </span>
        </div>
        <div className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 flex items-center gap-2 font-medium">
          <WindIcon size={14} className="text-sky-500 dark:text-cyan-400 shrink-0" />
          <span>
            Surface Wind: <strong className="text-slate-900 dark:text-slate-100 font-mono font-bold">{zone.windSpeedKmh} km/h</strong>
          </span>
        </div>
      </div>

      <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 font-mono flex items-center justify-between">
        <span>Dispersion Velocity:</span>
        <span className={isStagnant ? 'text-amber-800 dark:text-amber-300 font-bold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/50' : 'text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/50'}>
          {isStagnant ? 'Stagnant Airflow' : 'Active Ventilation'}
        </span>
      </div>
    </div>
  );
});
