// ============================================================
// src/components/Auth/views/OtpTwoFactorForm.tsx
// Two-Factor Verification Token View
// ============================================================

import type { FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { SparklesIcon } from '@/components/ui/Icons';

export interface OtpTwoFactorFormProps {
  email: string;
  otpCode: string[];
  setOtpCode: (otp: string[]) => void;
  isLoading: boolean;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
}

export function OtpTwoFactorForm({
  email,
  otpCode,
  setOtpCode,
  isLoading,
  onSubmit,
  onCancel,
}: OtpTwoFactorFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2 text-xl">
          <SparklesIcon size={24} />
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          Verification passcode dispatched to <strong>{email || 'your device'}</strong>
        </p>
      </div>

      <div className="flex justify-center gap-2">
        {[0, 1, 2, 3, 4, 5].map((idx) => (
          <input
            key={idx}
            id={`otp-box-${idx}`}
            type="text"
            maxLength={1}
            value={otpCode[idx] || ''}
            onChange={(e) => {
              const val = e.target.value;
              const next = [...otpCode];
              next[idx] = val;
              setOtpCode(next);
              if (val && idx < 5) {
                const nextInput = document.getElementById(`otp-box-${idx + 1}`);
                nextInput?.focus();
              }
            }}
            className="w-10 h-12 text-center text-base font-bold bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
          />
        ))}
      </div>

      <Button type="submit" variant="primary" size="md" isLoading={isLoading} className="w-full">
        Verify & Finalize Access
      </Button>

      <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          className="hover:underline"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            setOtpCode(['7', '2', '9', '4', '1', '0']);
          }}
          className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
        >
          Auto-fill demo token (729410)
        </button>
      </div>
    </form>
  );
}
