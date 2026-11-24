// ============================================================
// src/components/shared/ZoneCard.tsx
// High-tech Urban Zone Status Card (Light & Dark Theme)
// Per CODING_CONVENTIONS.md §4 & ACCESSIBILITY.md §7
// ============================================================

import { memo } from 'react';
import type { UrbanZone } from '@/types';
import { getAQIColor } from '@/lib/aqiCompute';
import { AlertTriangleIcon, CheckCircleIcon } from '@/components/ui/Icons';

interface ZoneCardProps {
  zone: UrbanZone;
  isSelected: boolean;
  onSelect: (zoneId: string) => void;
}

export const ZoneCard = memo(function ZoneCard({
  zone,
  isSelected,
  onSelect,
}: ZoneCardProps) {
  const aqiColor = getAQIColor(zone.aqi);

  return (
    <div
      role="article"
      aria-label={`${zone.zoneName} air quality status`}
      className={`rounded-2xl border p-4 sm:p-5 flex flex-col justify-between gap-4 transition-all duration-200 relative overflow-hidden group cursor-pointer ${
        isSelected
          ? 'bg-gradient-to-b from-cyan-50/90 to-white dark:from-cyan-950/40 dark:to-slate-900 border-cyan-500 dark:border-cyan-400 shadow-md ring-1 ring-cyan-500/40'
          : 'bg-white/90 dark:bg-[#0c1220]/90 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/80 dark:hover:bg-[#10182b] shadow-xs hover:-translate-y-1 hover:shadow-md'
      }`}
      onClick={() => onSelect(zone.zoneId)}
    >
      {/* Top accent highlight indicator for current AQI status */}
      <div
        className="absolute top-0 left-0 right-0 h-1 transition-all duration-300"
        style={{ backgroundColor: aqiColor }}
        aria-hidden="true"
      />

      <div className="flex items-start justify-between gap-2 pt-1">
        <div>
          <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base tracking-tight leading-snug group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
            {zone.zoneName}
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Primary: <span className="text-slate-800 dark:text-slate-200 font-bold">{zone.dominantPollutant}</span>
          </p>
        </div>
        <div
          className="px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-2xs font-mono shrink-0"
          style={{
            backgroundColor: `${aqiColor}15`,
            borderColor: `${aqiColor}50`,
            borderWidth: '1px',
            color: aqiColor,
          }}
        >
          <span
            className="w-2 h-2 rounded-full shadow-2xs animate-pulse"
            style={{ backgroundColor: aqiColor }}
            aria-hidden="true"
          />
          <span>AQI {zone.aqi}</span>
        </div>
      </div>

      {/* 3-Cell Metric Grid with High-Tech Micro Badges */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 px-2.5 bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-slate-200/70 dark:border-slate-800/80">
        <div>
          <div className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider font-mono">PM2.5</div>
          <div className="font-extrabold text-slate-900 dark:text-slate-100 font-mono mt-0.5 text-xs sm:text-sm">{zone.pm25} µg</div>
        </div>
        <div className="border-x border-slate-200 dark:border-slate-800">
          <div className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider font-mono">Wind</div>
          <div className="font-extrabold text-slate-900 dark:text-slate-100 font-mono mt-0.5 text-xs sm:text-sm">{zone.windSpeedKmh} km/h</div>
        </div>
        <div>
          <div className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider font-mono">Temp</div>
          <div className="font-extrabold text-slate-900 dark:text-slate-100 font-mono mt-0.5 text-xs sm:text-sm">{zone.temperatureC}°C</div>
        </div>
      </div>

      {/* Atmospheric Inversion Trap Badge */}
      {zone.inversionRisk && (
        <div className="flex items-center gap-1.5 text-xs text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 rounded-xl border border-amber-300 dark:border-amber-500/40">
          <AlertTriangleIcon size={14} className="shrink-0 text-amber-600 dark:text-amber-400" />
          <span className="font-bold text-[11px]">Atmospheric Inversion Trap</span>
        </div>
      )}

      {/* Telemetry Switch Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(zone.zoneId);
        }}
        aria-pressed={isSelected}
        className={`w-full py-2.5 min-h-[44px] rounded-xl text-xs font-bold transition-all duration-150 flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer ${
          isSelected
            ? 'bg-cyan-700 hover:bg-cyan-800 dark:bg-cyan-600 text-white shadow-xs border border-cyan-700 dark:border-cyan-600 font-bold'
            : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-slate-700/60'
        }`}
      >
        {isSelected ? (
          <>
            <CheckCircleIcon size={14} />
            <span>Active Telemetry</span>
          </>
        ) : (
          <span>Switch Telemetry</span>
        )}
      </button>
    </div>
  );
});
