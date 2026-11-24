// ============================================================
// src/components/Auth/views/LoginForm.tsx
// SaaS Login Form View with Credentials & Quick-Fill Demo Hooks
// ============================================================

import type { FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { UserIcon, LockIcon } from '@/components/ui/Icons';

export interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  rememberMe: boolean;
  setRememberMe: (remember: boolean) => void;
  isLoading: boolean;
  onSubmit: (e: FormEvent) => void;
  onQuickFill: (role: 'operator' | 'citizen') => void;
  onNavigateRegister: () => void;
  onNavigateForgot: () => void;
}

export function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  rememberMe,
  setRememberMe,
  isLoading,
  onSubmit,
  onQuickFill,
  onNavigateRegister,
  onNavigateForgot,
}: LoginFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="auth-email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Work / Public Health Email
        </label>
        <div className="relative">
          <span className="absolute left-3 top-3 text-slate-400">
            <UserIcon size={16} />
          </span>
          <input
            id="auth-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="analyst@breatheway.org"
            className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <label htmlFor="auth-password" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Security Key / Password
          </label>
          <button
            type="button"
            onClick={onNavigateForgot}
            className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Forgot key?
          </button>
        </div>
        <div className="relative">
          <span className="absolute left-3 top-3 text-slate-400">
            <LockIcon size={16} />
          </span>
          <input
            id="auth-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="rounded accent-emerald-600"
          />
          <span>Remember this terminal</span>
        </label>
      </div>

      <Button type="submit" variant="primary" size="md" isLoading={isLoading} className="w-full mt-2">
        Authenticate & Open Dashboard
      </Button>

      {/* Quick Demo Pre-fill Links for Testing */}
      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span>Fast Prototype Fill:</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onQuickFill('operator')}
            className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            Director Chen
          </button>
          <button
            type="button"
            onClick={() => onQuickFill('citizen')}
            className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            Citizen Delhi
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-slate-500 dark:text-slate-400 mt-2">
        New municipal stakeholder?{' '}
        <button
          type="button"
          onClick={onNavigateRegister}
          className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
        >
          Enroll here
        </button>
      </div>
    </form>
  );
}
