// ============================================================
// src/components/Auth/views/ForgotPasswordForm.tsx
// Password Recovery Dispatch View
// ============================================================

import type { FormEvent } from 'react';
import { Button } from '@/components/ui/Button';

export interface ForgotPasswordFormProps {
  email: string;
  setEmail: (email: string) => void;
  isLoading: boolean;
  onSubmit: (e: FormEvent) => void;
  onNavigateLogin: () => void;
}

export function ForgotPasswordForm({
  email,
  setEmail,
  isLoading,
  onSubmit,
  onNavigateLogin,
}: ForgotPasswordFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="forgot-email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Account Email
        </label>
        <input
          id="forgot-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="analyst@breatheway.org"
          className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <Button type="submit" variant="primary" size="md" isLoading={isLoading} className="w-full">
        Dispatch Recovery Token
      </Button>

      <div className="text-center text-xs text-slate-500 dark:text-slate-400">
        <button
          type="button"
          onClick={onNavigateLogin}
          className="hover:underline"
        >
          ← Back to Sign In
        </button>
      </div>
    </form>
  );
}
