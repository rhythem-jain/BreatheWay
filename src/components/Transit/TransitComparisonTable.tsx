// ============================================================
// src/components/Transit/TransitComparisonTable.tsx
// Senior Craftsmanship Multi-Modal Transit Comparison Table
// Dual Theme (Light & Dark) with WCAG 2.2 AA Contrast
// ============================================================

import { memo } from 'react';
import type { TransitRouteComparison } from '@/types';
import {
  CheckCircleIcon,
  AlertTriangleIcon,
  LeafIcon,
  ClockIcon,
  ActivityIcon,
} from '@/components/ui/Icons';

interface TransitComparisonTableProps {
  modalComparisons: TransitRouteComparison[];
}

export const TransitComparisonTable = memo(function TransitComparisonTable({
  modalComparisons,
}: TransitComparisonTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
      <table className="w-full text-left text-xs text-slate-800 dark:text-slate-200 border-collapse">
        <caption className="sr-only">
          Comparison of transit modes by duration, PM2.5 exposure dose, carbon emissions, and health risk
        </caption>
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 uppercase text-[10px] sm:text-[11px] font-bold tracking-wider">
            <th scope="col" className="py-3.5 px-4 sm:px-5">
              Transit Mode
            </th>
            <th scope="col" className="py-3.5 px-4 sm:px-5">
              <span className="flex items-center gap-1.5">
                <ClockIcon size={12} className="text-slate-400 dark:text-slate-500" />
                Duration
              </span>
            </th>
            <th scope="col" className="py-3.5 px-4 sm:px-5">
              <span className="flex items-center gap-1.5">
                <ActivityIcon size={12} className="text-slate-400 dark:text-slate-500" />
                PM2.5 Inhaled Dose
              </span>
            </th>
            <th scope="col" className="py-3.5 px-4 sm:px-5">
              <span className="flex items-center gap-1.5">
                <LeafIcon size={12} className="text-slate-400 dark:text-slate-500" />
                CO₂ Footprint
              </span>
            </th>
            <th scope="col" className="py-3.5 px-4 sm:px-5">
              Health Risk
            </th>
            <th scope="col" className="py-3.5 px-4 sm:px-5">
              Clinical Advisory
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {modalComparisons.map((item) => {
            const isHighDose = item.pm25ExposureDoseUg > 40;
            const isMediumDose = item.pm25ExposureDoseUg > 20;

            return (
              <tr
                key={item.mode}
                className={`transition-colors duration-150 ${
                  item.isRecommended
                    ? 'bg-emerald-50/50 hover:bg-emerald-50/80 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/30'
                    : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                }`}
              >
                {/* Transit Mode Column */}
                <td className="py-4 px-4 sm:px-5">
                  <div className="flex items-center gap-2.5">
                    {item.isRecommended ? (
                      <span
                        className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"
                        title="Recommended Option"
                        aria-hidden="true"
                      />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
                    )}

                    <div className="flex flex-col">
                      <span className="text-slate-900 dark:text-slate-100 font-bold tracking-tight text-sm">
                        {item.modeLabel}
                      </span>
                      {item.isRecommended && (
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                          Lowest Inhaled Burden
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Duration Column */}
                <td className="py-4 px-4 sm:px-5 whitespace-nowrap font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {item.durationMinutes} mins
                </td>

                {/* PM2.5 Inhaled Dose Column */}
                <td className="py-4 px-4 sm:px-5 whitespace-nowrap font-mono font-bold text-sm">
                  <span
                    className={
                      isHighDose
                        ? 'text-rose-700 dark:text-rose-400'
                        : isMediumDose
                        ? 'text-amber-700 dark:text-amber-400'
                        : 'text-emerald-700 dark:text-emerald-400'
                    }
                  >
                    {item.pm25ExposureDoseUg} µg
                  </span>
                </td>

                {/* CO2 Footprint Column */}
                <td className="py-4 px-4 sm:px-5 whitespace-nowrap font-mono text-slate-700 dark:text-slate-300">
                  {item.co2EmissionsKg} kg
                </td>

                {/* Health Risk Rating Badge */}
                <td className="py-4 px-4 sm:px-5 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      item.healthRiskRating === 'severe'
                        ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/80'
                        : item.healthRiskRating === 'moderate'
                        ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/80'
                        : item.healthRiskRating === 'low'
                        ? 'bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800/80'
                        : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80'
                    }`}
                  >
                    {item.healthRiskRating === 'severe' ? (
                      <AlertTriangleIcon size={11} className="text-rose-600 dark:text-rose-400" />
                    ) : item.healthRiskRating === 'low' || item.isRecommended ? (
                      <CheckCircleIcon size={11} className="text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    )}
                    <span>{item.healthRiskRating}</span>
                  </span>
                </td>

                {/* Clinical Advisory Column */}
                <td className="py-4 px-4 sm:px-5 text-slate-600 dark:text-slate-300 max-w-xs leading-relaxed text-xs">
                  {item.advisory}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});
