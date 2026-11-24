// ============================================================
// src/components/shared/Sparkline.tsx
// Pure Native SVG Sparkline Renderer with Gradient Fill
// Per EFFICIENCY.md §3 & ACCESSIBILITY.md §3
// ============================================================

import { memo } from 'react';

interface SparklineProps {
  values: number[];
  color?: string;
  width?: number;
  height?: number;
  label?: string;
}

export const Sparkline = memo(function Sparkline({
  values,
  color = '#10b981',
  width = 160,
  height = 36,
  label = 'Trend sparkline',
}: SparklineProps) {
  if (!values || values.length === 0) {
    return <span className="text-xs text-slate-500">No telemetry data</span>;
  }

  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const step = width / Math.max(1, values.length - 1);

  const points = values.map((v, i) => ({
    x: i * step,
    y: height - ((v - min) / range) * (height - 8) - 4,
  }));

  const d = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ');

  const areaD = `${d} L${points[points.length - 1].x.toFixed(1)},${height} L${points[0].x.toFixed(1)},${height} Z`;

  const gradId = `sparkline-grad-${label.replace(/[^a-zA-Z0-9]/g, '')}-${Math.round(points[0]?.y || 0)}`;

  return (
    <div className="relative inline-flex items-center">
      {/* Screen-reader only twin representation (WCAG 2.2 AA) */}
      <span className="sr-only">
        {label}: values ranging from {min} to {max}, latest reading {values[values.length - 1]}
      </span>
      {/* Visual SVG marked aria-hidden */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        aria-hidden="true"
        role="presentation"
        className="overflow-visible"
        style={{ width: `${width}px`, height: `${height}px`, aspectRatio: `${width} / ${height}` }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Shaded Area */}
        <path d={areaD} fill={`url(#${gradId})`} />

        {/* Path Line */}
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Nodes */}
        {points.map((p, i) => {
          const isLatest = i === points.length - 1;
          return (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={isLatest ? 3.5 : 1.5}
              fill={isLatest ? '#ffffff' : color}
              stroke={isLatest ? color : 'none'}
              strokeWidth={isLatest ? 2 : 0}
            />
          );
        })}
      </svg>
    </div>
  );
});
