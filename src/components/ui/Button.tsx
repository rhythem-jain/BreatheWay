// ============================================================
// src/components/ui/Button.tsx
// Precision Design-System Button Component (Linear/Stripe Craftsmanship)
// Full Dual Theme Support (Light & Dark) & WCAG 2.2 AA Focus Indicators
// ============================================================

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'ai';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    disabled,
    className = '',
    children,
    ...props
  },
  ref
) {
  const baseStyles =
    'relative inline-flex items-center justify-center font-semibold tracking-tight rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] cursor-pointer';

  const sizeStyles: Record<ButtonSize, string> = {
    xs: 'px-2.5 py-1 text-xs gap-1.5',
    sm: 'px-3.5 py-1.5 text-xs gap-2',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-700/20 shadow-xs dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 dark:border-emerald-400/40',
    secondary:
      'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 shadow-xs dark:bg-slate-800/90 dark:hover:bg-slate-700 dark:text-slate-100 dark:border-slate-700/80',
    outline:
      'bg-transparent hover:bg-slate-100/70 text-slate-700 border border-slate-300 dark:hover:bg-slate-800/60 dark:text-slate-200 dark:border-slate-700',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/60',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white border border-rose-700/20 shadow-xs dark:bg-rose-600 dark:hover:bg-rose-500 dark:text-white dark:border-rose-500/30',
    ai:
      'bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/40 shadow-xs dark:bg-slate-900/90 dark:hover:bg-slate-800 dark:text-emerald-300 dark:border-emerald-500/40',
  };

  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0"
          aria-hidden="true"
        />
      ) : (
        leftIcon && <span className="shrink-0 leading-none">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0 leading-none">{rightIcon}</span>}
    </button>
  );
});
