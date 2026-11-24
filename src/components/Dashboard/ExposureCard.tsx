// ============================================================
// src/components/Dashboard/ExposureCard.tsx
// PM2.5 Exposure Load Comparison Card
// ============================================================

import { memo } from 'react';

export interface ExposureCardProps {
  pm25: number;
}

/**
 * PM2.5 Exposure Load Comparison Card
 * Compares current particulate mass concentration against WHO 24h health guidelines.
 */
export const ExposureCard = memo(function ExposureCard({ pm25 }: ExposureCardProps) {
  const whoRatio = Math.round((pm25 / 15) * 10) / 10;

  return (
    <div className="sm:col-span-2 bg-slate-50/90 dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
      <div className="flex items-center gap-2.5">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
        <span className="text-slate-600 dark:text-slate-400">
          PM2.5 Mass Concentration:{' '}
          <strong className="text-slate-900 dark:text-white font-mono text-sm">{pm25} µg/m³</strong>
        </span>
      </div>
      <div className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50 font-bold">
        {whoRatio}x WHO 24h Guideline (15 µg/m³)
      </div>
    </div>
  );
});
