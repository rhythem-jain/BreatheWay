// ============================================================
// src/components/ui/Skeleton.tsx
// Loading State Skeleton & Empty State Primitive
// Dual-Theme Optimized (Light & Dark)
// ============================================================

import type { HTMLAttributes, ReactNode } from 'react';

export function Skeleton({
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={`skeleton-shimmer rounded-xl bg-slate-200/80 dark:bg-slate-800/50 ${className}`}
      {...props}
    />
  );
}

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 my-4">
      {icon && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20 mb-3">
          {icon}
        </div>
      )}
      <h4 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-4 leading-relaxed">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
