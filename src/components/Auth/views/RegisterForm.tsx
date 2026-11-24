// ============================================================
// src/components/Auth/views/RegisterForm.tsx
// Citizen Profile Enrollment View
// ============================================================

import type { FormEvent } from 'react';
import { Button } from '@/components/ui/Button';

export interface RegisterFormProps {
  fullName: string;
  setFullName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isLoading: boolean;
  onSubmit: (e: FormEvent) => void;
  onNavigateLogin: () => void;
}

export function RegisterForm({
  fullName,
  setFullName,
  email,
  setEmail,
  password,
  setPassword,
  isLoading,
  onSubmit,
  onNavigateLogin,
}: RegisterFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="reg-name" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Full Legal Name
        </label>
        <input
          id="reg-name"
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Dr. Maya Raman"
          className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="reg-email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Official Email
        </label>
        <input
          id="reg-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="maya@delhi-health.gov.in"
          className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="reg-pwd" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Passphrase (Min. 8 characters)
        </label>
        <input
          id="reg-pwd"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••••"
          className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <Button type="submit" variant="ai" size="md" isLoading={isLoading} className="w-full mt-2">
        Create Profile & Continue
      </Button>

      <div className="text-center text-xs text-slate-500 dark:text-slate-400 mt-2">
        Already enrolled?{' '}
        <button
          type="button"
          onClick={onNavigateLogin}
          className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
        >
          Sign in
        </button>
      </div>
    </form>
  );
}
