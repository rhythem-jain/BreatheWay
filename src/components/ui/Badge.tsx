// ============================================================
// src/components/ui/Badge.tsx
// Status Pill & Metric Badge Component (Linear/Stripe Craftsmanship)
// Dual-Theme Support (Light & Dark) with WCAG AA Compliant Contrast
// ============================================================

import type { HTMLAttributes, ReactNode } from 'react';

export type BadgeVariant =
  | 'emerald'
  | 'cyan'
  | 'amber'
  | 'rose'
  | 'violet'
  | 'slate'
  | 'outline';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  hasDot?: boolean;
  isPulsing?: boolean;
  children: ReactNode;
}

export function Badge({
  variant = 'emerald',
  hasDot = false,
  isPulsing = false,
  className = '',
  children,
  ...props
}: BadgeProps) {
  const variantStyles: Record<
    BadgeVariant,
    { classes: string; dot: string }
  > = {
    emerald: {
      classes:
        'bg-emerald-50 text-emerald-800 border-emerald-200/90 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-500/30',
      dot: 'bg-emerald-500 dark:bg-emerald-400',
    },
    cyan: {
      classes:
        'bg-sky-50 text-sky-800 border-sky-200/90 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-500/30',
      dot: 'bg-sky-500 dark:bg-sky-400',
    },
    amber: {
      classes:
        'bg-amber-50 text-amber-900 border-amber-200/90 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-500/30',
      dot: 'bg-amber-500 dark:bg-amber-400',
    },
    rose: {
      classes:
        'bg-rose-50 text-rose-900 border-rose-200/90 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-500/30',
      dot: 'bg-rose-500 dark:bg-rose-400',
    },
    violet: {
      classes:
        'bg-violet-50 text-violet-900 border-violet-200/90 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-500/30',
      dot: 'bg-violet-500 dark:bg-violet-400',
    },
    slate: {
      classes:
        'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700/60',
      dot: 'bg-slate-500 dark:bg-slate-400',
    },
    outline: {
      classes:
        'bg-transparent text-slate-700 border-slate-300 dark:text-slate-300 dark:border-slate-700',
      dot: 'bg-slate-500 dark:bg-slate-400',
    },
  };

  const current = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-tight border shadow-2xs ${current.classes} ${className}`}
      {...props}
    >
      {hasDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${current.dot} ${
            isPulsing ? 'animate-pulse' : ''
          }`}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
}
