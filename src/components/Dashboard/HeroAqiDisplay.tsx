// ============================================================
// src/components/Dashboard/HeroAqiDisplay.tsx
// Primary Numeric AQI Metric & EPA Multi-Segment Spectrum Scale
// ============================================================

import { memo } from 'react';

// AQI Spectrum segments for the 0-500 scale
const AQI_SPECTRUM_SEGMENTS = [
  { label: 'Good', range: '0-50', width: '10%', color: '#10b981' },
  { label: 'Mod', range: '51-100', width: '10%', color: '#f59e0b' },
  { label: 'USG', range: '101-150', width: '10%', color: '#f97316' },
  { label: 'Unhealthy', range: '151-200', width: '10%', color: '#ef4444' },
  { label: 'V.Unhealthy', range: '201-300', width: '20%', color: '#8b5cf6' },
  { label: 'Hazard', range: '301-500', width: '40%', color: '#991b1b' },
] as const;

export interface HeroAqiDisplayProps {
  aqi: number;
  aqiColor: string;
  aqiCategory: string;
  dominantPollutant: string;
  spectrumPosition: number;
}

/**
 * Hero AQI Metric Display & Multi-Segment Spectrum Needle
 * Presents real-time numeric index, category status pill, and 6-band EPA scale.
 */
export const HeroAqiDisplay = memo(function HeroAqiDisplay({
  aqi,
  aqiColor,
  aqiCategory,
  dominantPollutant,
  spectrumPosition,
}: HeroAqiDisplayProps) {
  return (
    <div className="lg:col-span-5 flex flex-col justify-between gap-6">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-slate-600 dark:text-slate-400 font-mono">
            Real-Time Air Quality Index
          </h2>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            EPA Scale
          </span>
        </div>

        <div className="flex items-baseline gap-5 mt-3">
          <div className="relative">
            <div
              role="text"
              aria-label={`Current AQI is ${aqi}`}
              className="text-7xl sm:text-8xl font-black tracking-tight font-mono-numbers transition-colors duration-300"
              style={{ color: aqiColor }}
            >
              {aqi}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border shadow-xs w-fit ${
                aqi > 300
                  ? 'text-rose-900 dark:text-rose-200'
                  : aqi > 200
                  ? 'text-purple-900 dark:text-purple-200'
                  : aqi > 150
                  ? 'text-red-900 dark:text-red-200'
                  : aqi > 100
                  ? 'text-orange-900 dark:text-orange-200'
                  : aqi > 50
                  ? 'text-amber-900 dark:text-amber-200'
                  : 'text-emerald-900 dark:text-emerald-200'
              }`}
              style={{
                backgroundColor: `${aqiColor}18`,
                borderColor: `${aqiColor}50`,
              }}
            >
              <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: aqiColor }} />
              {aqiCategory}
            </div>

            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
              Dominant:
              <strong className="text-slate-900 dark:text-slate-100 font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                {dominantPollutant}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* EPA/NAAQ Multi-Segment AQI Spectrum Scale (0-500) */}
      <div className="flex flex-col gap-2 pt-2 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800/70">
        <div className="flex items-center justify-between text-[10px] text-slate-700 dark:text-slate-300 font-mono font-bold">
          <span>0 (Good / Clean)</span>
          <span>Current: {aqi} AQI</span>
          <span>500 (Hazardous)</span>
        </div>

        {/* Spectrum Track with Needle Marker */}
        <div className="relative w-full h-3 rounded-full overflow-visible bg-slate-200 dark:bg-slate-800 p-0.5 shadow-inner">
          {/* 6 Segment Bands */}
          <div className="w-full h-full rounded-full flex overflow-hidden">
            {AQI_SPECTRUM_SEGMENTS.map((seg) => (
              <div
                key={seg.label}
                className="h-full"
                style={{ width: seg.width, backgroundColor: seg.color }}
                title={`${seg.label} (${seg.range})`}
              />
            ))}
          </div>

          {/* Needle Cursor */}
          <div
            className="absolute -top-2 bottom-0 transition-all duration-300 pointer-events-none"
            style={{ left: `${spectrumPosition}%`, transform: 'translateX(-50%)' }}
          >
            <div className="w-4 h-7 bg-slate-900 dark:bg-white border-2 border-white dark:border-slate-900 rounded-full shadow-lg flex items-center justify-center">
              <div className="w-1.5 h-3 rounded-full" style={{ backgroundColor: aqiColor }} />
            </div>
          </div>
        </div>

        {/* Spectrum Legend Labels */}
        <div className="grid grid-cols-6 text-[9px] text-slate-500 dark:text-slate-400 font-mono text-center pt-1 font-semibold">
          {AQI_SPECTRUM_SEGMENTS.map((seg) => (
            <span key={seg.label}>{seg.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
});
