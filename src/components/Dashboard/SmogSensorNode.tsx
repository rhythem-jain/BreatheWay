// ============================================================
// src/components/Dashboard/SmogSensorNode.tsx
// Interactive Geospatial Telemetry Sensor Node for SVG Heatmap
// Meets WCAG 2.2 AA Focus, Keyboard Navigation & Screen Reader Labels
// ============================================================

import { memo } from 'react';
import type { UrbanZone } from '@/types';

export interface SmogSensorNodeProps {
  zone: UrbanZone;
  pos: { cx: number; cy: number };
  geoInfo?: { code: string; shortLabel: string; quadrant: string };
  color: string;
  isSelected: boolean;
  isDark: boolean;
  onSelectZone: (zoneId: string) => void;
}

export const SmogSensorNode = memo(function SmogSensorNode({
  zone,
  pos,
  geoInfo,
  color,
  isSelected,
  isDark,
  onSelectZone,
}: SmogSensorNodeProps) {
  return (
    <g
      tabIndex={0}
      role="button"
      aria-label={`${zone.aqi} ${geoInfo?.code || 'SECT'}: ${geoInfo?.shortLabel || zone.zoneName} — ${zone.zoneName}, AQI ${zone.aqi}, ${zone.category}`}
      onClick={() => onSelectZone(zone.zoneId)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectZone(zone.zoneId);
        }
      }}
      className="cursor-pointer focus:outline-none group transition-transform duration-150"
    >
      {/* Active Hazardous Smog Inversion Ping Ring */}
      {zone.aqi > 200 && (
        <circle
          cx={pos.cx}
          cy={pos.cy}
          r="32"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          opacity="0.4"
          className="animate-ping"
        />
      )}

      {/* Selected Sector Precision Targeting Reticle */}
      {isSelected && (
        <g>
          <circle
            cx={pos.cx}
            cy={pos.cy}
            r="30"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            strokeDasharray="4 2"
            opacity="0.85"
          />
          {/* Corner Reticle Brackets */}
          <path
            d={`M ${pos.cx - 24} ${pos.cy - 12} L ${pos.cx - 24} ${pos.cy - 24} L ${pos.cx - 12} ${pos.cy - 24}`}
            fill="none"
            stroke="#10b981"
            strokeWidth="1.5"
          />
          <path
            d={`M ${pos.cx + 24} ${pos.cy - 12} L ${pos.cx + 24} ${pos.cy - 24} L ${pos.cx + 12} ${pos.cy - 24}`}
            fill="none"
            stroke="#10b981"
            strokeWidth="1.5"
          />
          <path
            d={`M ${pos.cx - 24} ${pos.cy + 12} L ${pos.cx - 24} ${pos.cy + 24} L ${pos.cx - 12} ${pos.cy + 24}`}
            fill="none"
            stroke="#10b981"
            strokeWidth="1.5"
          />
          <path
            d={`M ${pos.cx + 24} ${pos.cy + 12} L ${pos.cx + 24} ${pos.cy + 24} L ${pos.cx + 12} ${pos.cy + 24}`}
            fill="none"
            stroke="#10b981"
            strokeWidth="1.5"
          />
        </g>
      )}

      {/* Crisp Sensor Housing Disc (Solid surface, zero artificial blur) */}
      <circle
        cx={pos.cx}
        cy={pos.cy}
        r="21"
        fill={isDark ? '#0c1527' : '#ffffff'}
        stroke={color}
        strokeWidth={isSelected ? 3 : 2}
        className="filter drop-shadow-sm transition-all duration-150 group-hover:scale-105"
      />

      {/* Inversion Alert Dot on Sensor Node */}
      {zone.inversionRisk && (
        <circle
          cx={pos.cx + 14}
          cy={pos.cy - 14}
          r="4"
          fill="#f59e0b"
          stroke={isDark ? '#0c1527' : '#ffffff'}
          strokeWidth="1.5"
        />
      )}

      {/* Numeric AQI Readout */}
      <text
        aria-hidden="true"
        x={pos.cx}
        y={pos.cy + 4.5}
        textAnchor="middle"
        fill={isDark ? '#f8fafc' : '#0f172a'}
        fontSize="12.5"
        fontWeight="900"
        fontFamily="JetBrains Mono, ui-monospace, monospace"
      >
        {zone.aqi}
      </text>

      {/* Sector Callout Capsule */}
      <g className="transition-opacity duration-150">
        <rect
          x={pos.cx - 52}
          y={pos.cy + 26}
          width="104"
          height="20"
          rx="6"
          fill={isDark ? '#070f1e' : '#ffffff'}
          stroke={isSelected ? '#10b981' : isDark ? '#1e293b' : '#cbd5e1'}
          strokeWidth={isSelected ? 1.5 : 1}
          className="shadow-sm"
        />
        <text
          aria-hidden="true"
          x={pos.cx}
          y={pos.cy + 40}
          textAnchor="middle"
          fill={isSelected ? (isDark ? '#34d399' : '#059669') : isDark ? '#cbd5e1' : '#334155'}
          fontSize="9.5"
          fontWeight="700"
          letterSpacing="0.2px"
        >
          {geoInfo?.code || 'SECT'}: {geoInfo?.shortLabel || zone.zoneName}
        </text>
      </g>
    </g>
  );
});
