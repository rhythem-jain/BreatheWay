// ============================================================
// src/components/Dashboard/AirTelemetryDashboard.tsx
// Modernized Hyperlocal AQI Telemetry, Heatmap & Sparklines (Dual Theme)
// Elite UI/UX Hierarchy, Asymmetric High-Density Layout & WCAG AA
// ============================================================

import { memo, useMemo } from 'react';
import type { UrbanZone } from '@/types';
import { useAirAnalytics } from '@/hooks/useAirAnalytics';
import { ZoneCard } from '@/components/shared/ZoneCard';
import { SmogHeatmap } from './SmogHeatmap';
import { HeroAqiDisplay } from './HeroAqiDisplay';
import { MicroclimateCard } from './MicroclimateCard';
import { InversionCard } from './InversionCard';
import { ExposureCard } from './ExposureCard';
import { PollutantBreakdownList } from './PollutantBreakdownList';
import {
  RefreshIcon,
  TelemetryIcon,
} from '@/components/ui/Icons';

export const AirTelemetryDashboard = memo(function AirTelemetryDashboard() {
  const {
    zones,
    currentZone,
    selectedZoneId,
    setSelectedZoneId,
    aqiCategory,
    aqiColor,
    inversionStatus,
    pollutantBreakdown,
    simulateSmogSpike,
    simulateCleanDispersion,
  } = useAirAnalytics();

  // Calculate spectrum cursor percentage (0-100%)
  const spectrumPosition = Math.min(100, Math.max(0, (currentZone.aqi / 500) * 100));

  // Mesh overview calculations
  const { averageAqi, peakZone, cleanestZone } = useMemo(() => {
    if (!zones.length) return { averageAqi: 0, peakZone: currentZone, cleanestZone: currentZone };
    const avg = Math.round(zones.reduce((sum: number, z: UrbanZone) => sum + z.aqi, 0) / zones.length);
    const sorted = [...zones].sort((a, b) => b.aqi - a.aqi);
    return {
      averageAqi: avg,
      peakZone: sorted[0],
      cleanestZone: sorted[sorted.length - 1],
    };
  }, [zones, currentZone]);

  return (
    <section aria-label="Hyperlocal AQI Telemetry Dashboard" className="flex flex-col gap-8 fade-in">
      {/* ============================================================
          TOP HERO KPI BANNER (Elite Typography & Modern Dashboard Layout)
          ============================================================ */}
      <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 relative border border-slate-200/90 dark:border-slate-800 shadow-sm transition-all duration-200 overflow-hidden">
        {/* Subtle decorative background glow behind primary metric */}
        <div
          className="absolute -top-24 -left-24 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-500"
          style={{ backgroundColor: aqiColor }}
          aria-hidden="true"
        />

        {/* Top Meta Bar: Sensor Station Identity & Telemetry Simulation Engine */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800/80 relative z-10">
          {/* Station Status & Location */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-mono font-bold tracking-wider text-[11px] uppercase">
                Station [STN-{currentZone.zoneId.replace('Z-', '')}]
              </span>
            </div>

            <span className="text-slate-400 dark:text-slate-600 hidden sm:inline">•</span>

            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 bg-white/60 dark:bg-slate-800/60 px-3 py-1 rounded-full border border-slate-200/60 dark:border-slate-700/60">
              <TelemetryIcon size={14} className="text-cyan-600 dark:text-cyan-400" />
              <span>{currentZone.zoneName}</span>
            </div>

            <span className="text-slate-400 dark:text-slate-600 hidden sm:inline">•</span>

            <span className="text-[11px] text-slate-800 dark:text-slate-200 font-mono font-bold">
              Synced: {new Date(currentZone.lastUpdated).toLocaleTimeString()}
            </span>
          </div>

          {/* Telemetry Simulation Engine Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5 mr-1">
              <RefreshIcon size={13} className="text-slate-600 dark:text-slate-400" />
              Simulator:
            </span>
            <button
              type="button"
              onClick={simulateSmogSpike}
              className="px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/80 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-200 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 active:scale-95 shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>⚡</span>
              <span>Simulate Winter Smog Spike (+45 AQI)</span>
            </button>
            <button
              type="button"
              onClick={simulateCleanDispersion}
              className="px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-950/60 dark:hover:bg-cyan-900/80 border border-cyan-200 dark:border-cyan-800/60 text-cyan-700 dark:text-cyan-200 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 active:scale-95 shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>🍃</span>
              <span>Simulate Solar Wind Cleansing (-50 AQI)</span>
            </button>
          </div>
        </div>

        {/* Hero Asymmetric Data Visualization Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6 relative z-10">
          {/* Left Column (lg:col-span-5): Primary AQI Numeric Metric & Spectrum Scale */}
          <HeroAqiDisplay
            aqi={currentZone.aqi}
            aqiColor={aqiColor}
            aqiCategory={aqiCategory}
            dominantPollutant={currentZone.dominantPollutant}
            spectrumPosition={spectrumPosition}
          />

          {/* Right Column (lg:col-span-7): High-Density Environmental Telemetry Matrix */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MicroclimateCard zone={currentZone} />
            <InversionCard inversionStatus={inversionStatus} />
            <ExposureCard pm25={currentZone.pm25} />
          </div>
        </div>
      </div>

      {/* ============================================================
          PRIMARY VISUALIZATION GRID:
          Spatial Smog Heatmap (Left, 7-col) & Pollutant Sparklines (Right, 5-col)
          ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <SmogHeatmap
          zones={zones}
          selectedZoneId={selectedZoneId}
          onSelectZone={setSelectedZoneId}
        />

        {/* Pollutant Sparklines Panel */}
        <PollutantBreakdownList
          pollutantBreakdown={pollutantBreakdown}
          zoneName={currentZone.zoneName}
        />
      </div>

      {/* ============================================================
          MONITORED URBAN SECTORS GRID
          Mesh summary telemetry and interactive focus cards
          ============================================================ */}
      <div className="flex flex-col gap-4">
        {/* Section Header with Mesh Aggregate Readouts */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
              Monitored Urban Sectors ({zones.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Click any sector to focus telemetry across the spatial monitoring mesh
            </p>
          </div>

          {/* Aggregate Telemetry Strip */}
          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <span>
              Mesh Avg:{' '}
              <strong className="text-slate-900 dark:text-white">{averageAqi} AQI</strong>
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span>
              Peak:{' '}
              <strong className="text-rose-700 dark:text-rose-300 font-bold">{peakZone.zoneName} ({peakZone.aqi})</strong>
            </span>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
            <span className="hidden sm:inline">
              Cleanest:{' '}
              <strong className="text-emerald-800 dark:text-emerald-300 font-bold">{cleanestZone.zoneName} ({cleanestZone.aqi})</strong>
            </span>
          </div>
        </div>

        {/* 5-Column Responsive Sector Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {zones.map((zone: UrbanZone) => (
            <ZoneCard
              key={zone.zoneId}
              zone={zone}
              isSelected={zone.zoneId === selectedZoneId}
              onSelect={setSelectedZoneId}
            />
          ))}
        </div>
      </div>
    </section>
  );
});
