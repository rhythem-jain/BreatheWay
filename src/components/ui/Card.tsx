// ============================================================
// src/components/ui/Card.tsx
// Precision Container & Card System (Linear/Stripe Craftsmanship)
// Dual Theme (Light & Dark) Support & Clean Spatial Hierarchy
// ============================================================

import type { HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive' | 'accent';
  children: ReactNode;
}

export function Card({
  variant = 'default',
  className = '',
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    default: 'glass-panel rounded-2xl p-5 sm:p-6',
    elevated: 'glass-panel-elevated rounded-2xl p-5 sm:p-6',
    interactive: 'glass-panel glass-panel-interactive rounded-2xl p-5 sm:p-6 cursor-pointer',
    accent:
      'bg-emerald-50/70 border border-emerald-200/90 dark:bg-emerald-950/20 dark:border-emerald-500/30 rounded-2xl p-5 sm:p-6 shadow-sm',
  };

  return (
    <div className={`${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex flex-col gap-1 mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2 ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-xs text-slate-500 dark:text-slate-400 leading-relaxed ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-3 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
