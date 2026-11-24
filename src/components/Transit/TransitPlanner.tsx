// ============================================================
// src/components/Transit/TransitPlanner.tsx
// Multi-Modal Clean-Corridor Pathfinder (Dual Theme Support)
// Senior Craftsmanship SaaS Design (Light & Dark WCAG AA Compliant)
// ============================================================

import { memo } from 'react';
import { useExposureRouting } from '@/hooks/useExposureRouting';
import { useAppContext } from '@/context/AppContext';
import { TransitComparisonTable } from './TransitComparisonTable';
import {
  TransitIcon,
  SparklesIcon,
  MapPinIcon,
  MetroIcon,
  LeafIcon,
  ArrowRightIcon,
  ChevronDownIcon,
} from '@/components/ui/Icons';

export const TransitPlanner = memo(function TransitPlanner() {
  const { selectedZone } = useAppContext();
  const {
    nodes,
    originId,
    destinationId,
    setOrigin,
    setDestination,
    lowestExposureResult,
    pathNodes,
    routeDistanceKm,
    modalComparisons,
  } = useExposureRouting();

  return (
    <section
      aria-label="Low-Emission Commute & Transit Planner"
      className="flex flex-col gap-8 fade-in"
    >
      {/* Route Pathfinder Selector Console */}
      <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 flex flex-col gap-6 border border-slate-200/90 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold font-mono tracking-wide bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/80 shadow-2xs">
              <SparklesIcon size={13} className="text-sky-600 dark:text-sky-400" />
              DIJKSTRA CLEAN-AIR PATHFINDER
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Low-Exposure Commute & Transit Path Optimizer
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Dijkstra-powered algorithm identifying subterranean and clean-air corridors to bypass surface smog hotspots.
          </p>
        </div>

        {/* Origin / Destination Waypoint Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6 bg-slate-50/80 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          {/* Origin Selector */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="origin-select"
              className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-2xs" />
              <span>Commute Origin Waypoint:</span>
            </label>
            <div className="relative">
              <select
                id="origin-select"
                value={originId}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent cursor-pointer shadow-xs pr-10 appearance-none hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
              >
                {nodes.map((node) => (
                  <option
                    key={node.id}
                    value={node.id}
                    className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  >
                    {node.name} {node.isCleanCorridor ? '(Clean Corridor)' : ''}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                <ChevronDownIcon size={16} />
              </div>
            </div>
          </div>

          {/* Destination Selector */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="destination-select"
              className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-2xs" />
              <span>Destination Waypoint:</span>
            </label>
            <div className="relative">
              <select
                id="destination-select"
                value={destinationId}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent cursor-pointer shadow-xs pr-10 appearance-none hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
              >
                {nodes.map((node) => (
                  <option
                    key={node.id}
                    value={node.id}
                    className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  >
                    {node.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                <ChevronDownIcon size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Lowest Exposure Path Breadcrumbs */}
        {lowestExposureResult && (
          <div className="bg-slate-50/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col gap-4 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
              <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                Optimal Clean-Air Trajectory (Dijkstra Min-Exposure Cost: {lowestExposureResult.totalExposure})
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium bg-white dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                Distance: <strong className="text-slate-900 dark:text-slate-100 font-mono font-bold">{routeDistanceKm} km</strong>
              </span>
            </div>

            <nav aria-label="Lowest pollution route steps">
              <ol className="flex flex-wrap items-center gap-3 text-xs">
                {pathNodes.map((n, idx) => (
                  <li key={n.id} className="flex items-center gap-3">
                    <span
                      className={`px-3.5 py-2 rounded-xl font-bold border flex items-center gap-2 shadow-2xs ${
                        n.isMetro
                          ? 'bg-sky-50 dark:bg-sky-950/80 text-sky-800 dark:text-sky-200 border-sky-300 dark:border-sky-800'
                          : n.isCleanCorridor
                          ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span className="shrink-0">
                        {n.isMetro ? (
                          <MetroIcon size={14} className="text-sky-600 dark:text-sky-400" />
                        ) : n.isCleanCorridor ? (
                          <LeafIcon size={14} className="text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <MapPinIcon size={14} className="text-slate-500 dark:text-slate-400" />
                        )}
                      </span>
                      <span>{n.name}</span>
                    </span>
                    {idx < pathNodes.length - 1 && (
                      <span className="text-slate-400 dark:text-slate-600 font-bold" aria-hidden="true">
                        <ArrowRightIcon size={14} />
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        )}
      </div>

      {/* Multi-Modal Comparison Table */}
      <div className="glass-panel rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
                <TransitIcon size={18} />
              </div>
              <span>Multi-Modal Exposure & Carbon Comparison</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Evaluated against current ambient air quality in {selectedZone.zoneName} (AQI {selectedZone.aqi})
            </p>
          </div>
          <span className="text-xs text-slate-600 dark:text-slate-300 font-mono bg-slate-100 dark:bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
            Trip Length: <strong className="text-slate-900 dark:text-slate-100 font-bold">{routeDistanceKm} km</strong>
          </span>
        </div>

        <TransitComparisonTable modalComparisons={modalComparisons} />
      </div>
    </section>
  );
});
