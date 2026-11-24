// ============================================================
// src/components/Community/PledgeCard.tsx
// Senior Craftsmanship Community Action Pledge Card
// Dual Theme (Light & Dark) with WCAG 2.2 AA Contrast
// ============================================================

import { memo } from 'react';
import type { CommunityPledge } from '@/types';
import { CheckCircleIcon, UsersIcon, LeafIcon } from '@/components/ui/Icons';

interface PledgeCardProps {
  pledge: CommunityPledge;
  onToggle: (id: string) => void;
  pledgedLabel: string;
  pledgeNowLabel: string;
}

export const PledgeCard = memo(function PledgeCard({
  pledge,
  onToggle,
  pledgedLabel,
  pledgeNowLabel,
}: PledgeCardProps) {
  const progress = Math.min(
    100,
    Math.round((pledge.currentParticipants / pledge.targetParticipants) * 100)
  );

  return (
    <div
      className={`p-6 sm:p-7 rounded-2xl sm:rounded-3xl border flex flex-col justify-between gap-6 transition-all duration-200 ${
        pledge.userPledged
          ? 'glass-panel-elevated bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-500/80 dark:border-emerald-500 shadow-sm ring-1 ring-emerald-500/30'
          : 'glass-panel bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div>
        {/* Card Header: Title & Active Status Pill */}
        <div className="flex items-start justify-between gap-3">
          <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-base sm:text-lg tracking-tight leading-snug">
            {pledge.title}
          </h4>

          {pledge.userPledged && (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shrink-0">
              <CheckCircleIcon size={12} className="text-emerald-600 dark:text-emerald-400" />
              <span>{pledgedLabel}</span>
            </span>
          )}
        </div>

        {/* Impact Description */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
          {pledge.impactDescription}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {/* Participation Stats & Progress Percentage */}
        <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <UsersIcon size={13} className="text-slate-400 dark:text-slate-500" />
            <span>
              Participation:{' '}
              <strong className="text-slate-900 dark:text-slate-100 font-mono font-bold">
                {pledge.currentParticipants}
              </strong>{' '}
              / {pledge.targetParticipants} households
            </span>
          </span>
          <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-xs">
            {progress}%
          </span>
        </div>

        {/* Sleek Progress Track */}
        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700/80">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={pledge.currentParticipants}
            aria-valuemin={0}
            aria-valuemax={pledge.targetParticipants}
            aria-label={`${pledge.title} progress`}
          />
        </div>

        {/* Footer: Relief Estimate & Toggle Action */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <LeafIcon size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              Est. Relief:{' '}
              <strong className="text-slate-800 dark:text-slate-200 font-mono font-semibold">
                ~{pledge.estimatedEmissionReductionKg} kg CO₂ / wk
              </strong>
            </span>
          </span>

          <button
            type="button"
            onClick={() => onToggle(pledge.id)}
            aria-pressed={pledge.userPledged}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              pledge.userPledged
                ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/30 border border-emerald-500'
            }`}
          >
            {pledge.userPledged ? 'Cancel Pledge' : pledgeNowLabel}
          </button>
        </div>
      </div>
    </div>
  );
});
