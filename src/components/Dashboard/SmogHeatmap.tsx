// ============================================================
// src/components/Dashboard/SmogHeatmap.tsx
// High-Fidelity Geospatial Smog Dispersion Telemetry Grid (Dual Theme)
// WCAG SC 1.1.1 Twin Representation & Native SVG Geospatial Canvas
// ============================================================

import { memo, useId } from 'react';
import type { UrbanZone } from '@/types';
import { getAQIColor } from '@/lib/aqiCompute';
import { useAppContext } from '@/context/AppContext';
import { SmogSensorNode } from './SmogSensorNode';

interface SmogHeatmapProps {
  zones: UrbanZone[];
  selectedZoneId: string;
  onSelectZone: (zoneId: string) => void;
}

interface NodeGeoConfig {
  cx: number;
  cy: number;
  code: string;
  shortLabel: string;
  quadrant: string;
}

const ZONE_GEO_MAP: Record<string, NodeGeoConfig> = {
  'Z-CENTRAL': { cx: 310, cy: 155, code: 'CBD-01', shortLabel: 'Central CBD', quadrant: 'Core Metro' },
  'Z-INDUSTRIAL': { cx: 145, cy: 85, code: 'IND-02', shortLabel: 'North Industrial', quadrant: 'NW Sector' },
  'Z-RESIDENTIAL': { cx: 465, cy: 95, code: 'RES-03', shortLabel: 'Greenwood Res.', quadrant: 'NE Sector' },
  'Z-RIVERSIDE': { cx: 475, cy: 235, code: 'ECO-04', shortLabel: 'Riverside Corridor', quadrant: 'SE Sector' },
  'Z-TRANSIT': { cx: 155, cy: 230, code: 'HUB-05', shortLabel: 'Intermodal Hub', quadrant: 'SW Sector' },
};

const FALLBACK_POSITIONS: NodeGeoConfig[] = [
  { cx: 310, cy: 155, code: 'CBD-01', shortLabel: 'Central CBD', quadrant: 'Core Metro' },
  { cx: 145, cy: 85, code: 'IND-02', shortLabel: 'North Industrial', quadrant: 'NW Sector' },
  { cx: 465, cy: 95, code: 'RES-03', shortLabel: 'Greenwood Res.', quadrant: 'NE Sector' },
  { cx: 475, cy: 235, code: 'ECO-04', shortLabel: 'Riverside Corridor', quadrant: 'SE Sector' },
  { cx: 155, cy: 230, code: 'HUB-05', shortLabel: 'Intermodal Hub', quadrant: 'SW Sector' },
];

export const SmogHeatmap = memo(function SmogHeatmap({
  zones,
  selectedZoneId,
  onSelectZone,
}: SmogHeatmapProps) {
  const { theme } = useAppContext();
  const isDark = theme === 'dark';
  const instanceId = useId().replace(/:/g, '');

  const selectedZone = zones.find((z) => z.zoneId === selectedZoneId) || zones[0];

  return (
    <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between gap-5 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden transition-colors">
      {/* Heatmap Header with Status & Precision Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[10px] font-black tracking-widest uppercase text-emerald-600 dark:text-emerald-400 font-mono">
              LIVE DISPERSION TELEMETRY
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Urban Smog Heatmap & Dispersion Grid
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time spatial visualization across municipal telemetry monitoring nodes
          </p>
        </div>

        {/* Precision Color Legend */}
        <div className="flex items-center gap-1.5 text-[10px] font-semibold bg-slate-50 dark:bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shrink-0">
          <span className="text-slate-700 dark:text-slate-300 font-mono mr-1 font-bold">AQI:</span>
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            &lt;50
          </span>
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/50 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            51-150
          </span>
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-orange-900 dark:text-orange-200 bg-orange-50 dark:bg-orange-950/50 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            151-200
          </span>
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-rose-900 dark:text-rose-200 bg-rose-50 dark:bg-rose-950/50 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            &gt;200
          </span>
        </div>
      </div>

      {/* WCAG SC 1.1.1 Twin Representation Rule: Textual equivalent */}
      <ul className="sr-only" aria-label="Urban air quality heatmap description">
        {zones.map((zone) => (
          <li key={zone.zoneId}>
            Sector {zone.zoneName}: AQI is {zone.aqi}, Category {zone.category},
            PM2.5 is {zone.pm25} micrograms per cubic meter,
            dominant pollutant is {zone.dominantPollutant},
            inversion risk is {zone.inversionRisk ? 'Active hazard' : 'Normal atmospheric mixing'}.
          </li>
        ))}
      </ul>

      {/* Native High-Performance SVG Geospatial Heatmap Canvas */}
      <div className="w-full bg-slate-50 dark:bg-[#050b17] rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-2 sm:p-3 overflow-hidden relative shadow-inner transition-colors duration-200" style={{ aspectRatio: '620 / 330' }}>
        {/* Top-Right In-Canvas HUD Telemetry Badge */}
        <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200/80 dark:border-slate-800 text-[10px] font-mono text-slate-700 dark:text-slate-300 font-semibold">
          <span>MESH: {zones.length}/5 ONLINE</span>
          <span className="text-slate-400 dark:text-slate-600">•</span>
          <span>ELEV: ~420m AGL</span>
        </div>

        <svg
          viewBox="0 0 620 330"
          width="620"
          height="330"
          role="group"
          aria-label="Interactive city air quality sector map"
          className="w-full h-auto max-h-[350px] select-none"
          style={{ aspectRatio: '620 / 330' }}
        >
          <defs>
            {/* Background Map Gradient */}
            <linearGradient id={`${instanceId}-mapGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isDark ? '#081226' : '#f8fafc'} stopOpacity={isDark ? '0.9' : '0.8'} />
              <stop offset="100%" stopColor={isDark ? '#040710' : '#f1f5f9'} stopOpacity="1" />
            </linearGradient>

            {/* Fine Geospatial Grid Pattern */}
            <pattern id={`${instanceId}-geoGrid`} width="25" height="25" patternUnits="userSpaceOnUse">
              <path
                d="M 25 0 L 0 0 0 25"
                fill="none"
                stroke={isDark ? '#1e293b' : '#e2e8f0'}
                strokeWidth="0.5"
                strokeOpacity={isDark ? '0.5' : '0.8'}
              />
            </pattern>

            {/* Atmospheric Dispersion Heatmap Plumes for Each Zone */}
            {zones.map((zone) => {
              const color = getAQIColor(zone.aqi);
              const maxOpacity = zone.aqi > 250 ? 0.35 : zone.aqi > 150 ? 0.25 : 0.16;

              return (
                <radialGradient
                  key={`heat-grad-${zone.zoneId}`}
                  id={`${instanceId}-heat-${zone.zoneId}`}
                  cx="50%"
                  cy="50%"
                  r="50%"
                >
                  <stop offset="0%" stopColor={color} stopOpacity={maxOpacity} />
                  <stop offset="45%" stopColor={color} stopOpacity={maxOpacity * 0.45} />
                  <stop offset="85%" stopColor={color} stopOpacity={maxOpacity * 0.12} />
                  <stop offset="100%" stopColor={color} stopOpacity="0" />
                </radialGradient>
              );
            })}
          </defs>

          {/* Background Technical Surface */}
          <rect x="0" y="0" width="620" height="330" fill={`url(#${instanceId}-mapGrad)`} rx="14" />
          <rect x="0" y="0" width="620" height="330" fill={`url(#${instanceId}-geoGrid)`} rx="14" />

          {/* Geospatial Radar Range Elevation Rings (Centered at Urban Core: 310, 155) */}
          <circle cx="310" cy="155" r="75" fill="none" stroke={isDark ? '#1e293b' : '#cbd5e1'} strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
          <circle cx="310" cy="155" r="145" fill="none" stroke={isDark ? '#1e293b' : '#cbd5e1'} strokeWidth="0.8" strokeDasharray="4 4" opacity="0.4" />
          <circle cx="310" cy="155" r="215" fill="none" stroke={isDark ? '#1e293b' : '#cbd5e1'} strokeWidth="0.6" strokeDasharray="5 5" opacity="0.25" />

          {/* Center Coordinate Crosshairs */}
          <line x1="300" y1="155" x2="320" y2="155" stroke={isDark ? '#38bdf8' : '#0284c7'} strokeWidth="0.8" opacity="0.5" />
          <line x1="310" y1="145" x2="310" y2="165" stroke={isDark ? '#38bdf8' : '#0284c7'} strokeWidth="0.8" opacity="0.5" />

          {/* Radar Radial Distance Markers */}
          <text x="314" y="85" fill={isDark ? '#94a3b8' : '#334155'} fontSize="8" fontFamily="monospace" fontWeight="bold">2.5 KM</text>
          <text x="314" y="25" fill={isDark ? '#94a3b8' : '#334155'} fontSize="8" fontFamily="monospace" fontWeight="bold">5.0 KM</text>

          {/* Coordinate Axis Labels along edges */}
          <text x="20" y="20" fill={isDark ? '#94a3b8' : '#334155'} fontSize="8" fontFamily="monospace" fontWeight="bold">28°42&apos;N / 77°06&apos;E</text>
          <text x="510" y="320" fill={isDark ? '#94a3b8' : '#334155'} fontSize="8" fontFamily="monospace" fontWeight="bold">28°32&apos;N / 77°22&apos;E</text>

          {/* Authentic Atmospheric Dispersion Heat Plumes */}
          {zones.map((zone, idx) => {
            const pos = ZONE_GEO_MAP[zone.zoneId] || FALLBACK_POSITIONS[idx] || { cx: 200, cy: 150 };
            const plumeRadius = Math.max(55, Math.min(105, zone.aqi * 0.28));

            return (
              <g key={`plume-group-${zone.zoneId}`} pointerEvents="none">
                <ellipse
                  cx={pos.cx}
                  cy={pos.cy}
                  rx={plumeRadius * 1.15}
                  ry={plumeRadius * 0.9}
                  fill={`url(#${instanceId}-heat-${zone.zoneId})`}
                />
                {/* Secondary Isopleth Contour Ring */}
                {zone.aqi > 150 && (
                  <ellipse
                    cx={pos.cx}
                    cy={pos.cy}
                    rx={plumeRadius * 0.75}
                    ry={plumeRadius * 0.6}
                    fill="none"
                    stroke={getAQIColor(zone.aqi)}
                    strokeWidth="0.75"
                    strokeDasharray="4 3"
                    opacity="0.35"
                  />
                )}
              </g>
            );
          })}

          {/* Inter-Sector Atmospheric Dispersion Corridors */}
          <g stroke={isDark ? '#334155' : '#cbd5e1'} strokeWidth="1" strokeDasharray="5 5" opacity="0.45">
            <line x1="145" y1="85" x2="310" y2="155" />
            <line x1="310" y1="155" x2="465" y2="95" />
            <line x1="310" y1="155" x2="475" y2="235" />
            <line x1="155" y1="230" x2="310" y2="155" />
            <line x1="155" y1="230" x2="145" y2="85" />
            <line x1="465" y1="95" x2="475" y2="235" />
          </g>

          {/* Aerodynamic Wind Streamline Vectors (NW to SE prevailing drift) */}
          <g stroke={isDark ? '#38bdf8' : '#0284c7'} strokeWidth="1" opacity="0.3">
            <path d="M 40 45 Q 160 25 280 55 T 520 45" fill="none" strokeDasharray="6 6" />
            <path d="M 60 170 Q 220 145 360 175 T 570 160" fill="none" strokeDasharray="6 6" />
            <path d="M 70 280 Q 200 255 350 285 T 550 270" fill="none" strokeDasharray="6 6" />
          </g>

          {/* Directional Wind Flow Chevrons */}
          <g fill={isDark ? '#38bdf8' : '#0284c7'} opacity="0.35">
            <polygon points="280,53 274,50 274,56" />
            <polygon points="360,173 354,170 354,176" />
            <polygon points="350,283 344,280 344,286" />
          </g>

          {/* Interactive Telemetry Sensor Nodes */}
          {zones.map((zone, idx) => {
            const pos = ZONE_GEO_MAP[zone.zoneId] || FALLBACK_POSITIONS[idx] || { cx: 200 + idx * 70, cy: 150 };
            const color = getAQIColor(zone.aqi);
            const isSelected = zone.zoneId === selectedZoneId;
            const geoInfo = ZONE_GEO_MAP[zone.zoneId] || FALLBACK_POSITIONS[idx];

            return (
              <SmogSensorNode
                key={zone.zoneId}
                zone={zone}
                pos={pos}
                geoInfo={geoInfo}
                color={color}
                isSelected={isSelected}
                isDark={isDark}
                onSelectZone={onSelectZone}
              />
            );
          })}
        </svg>
      </div>

      {/* Footer Spatial Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1 gap-2 border-t border-slate-200/70 dark:border-slate-800/70 pt-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Click any sensor node or sector card to focus hyperlocal telemetry.</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px]">
          <span>
            FOCUSED:{' '}
            <strong className="text-slate-900 dark:text-slate-200">{selectedZone.zoneName}</strong>
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
            PM2.5: {selectedZone.pm25} µg/m³
          </span>
        </div>
      </div>
    </div>
  );
});
