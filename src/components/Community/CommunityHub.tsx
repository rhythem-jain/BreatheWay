// ============================================================
// src/components/Community/CommunityHub.tsx
// Community Smog Abatement & Collective Action Hub (Dual Theme)
// Senior Craftsmanship SaaS Design (Light & Dark WCAG AA Compliant)
// ============================================================

import { memo, useState, useMemo, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';
import { calculateCommunityOffset } from '@/lib/aqiCompute';
import { apiService } from '@/services/apiService';
import { TRANSLATIONS } from '@/lib/constants';
import { PledgeCard } from './PledgeCard';
import {
  CommunityIcon,
  SparklesIcon,
  AlertTriangleIcon,
  UsersIcon,
} from '@/components/ui/Icons';

export const CommunityHub = memo(function CommunityHub() {
  const {
    pledges,
    togglePledge,
    alerts,
    dismissAlert,
    selectedZone,
    language,
  } = useAppContext();

  const [aiAdvisory, setAiAdvisory] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const collectiveMetrics = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of pledges) {
      counts[p.category] = p.currentParticipants;
    }
    return calculateCommunityOffset(counts);
  }, [pledges]);

  const handleGenerateAdvisory = useCallback(async () => {
    setIsGenerating(true);
    try {
      const advisory = await apiService.generateEmergencyAdvisory(selectedZone, language);
      setAiAdvisory(advisory);
    } catch {
      setAiAdvisory(
        `URGENT NOTICE for ${selectedZone.zoneName}: AQI is ${selectedZone.aqi}. Please activate indoor filtration, seal doors, and assist vulnerable neighbors.`
      );
    } finally {
      setIsGenerating(false);
    }
  }, [selectedZone, language]);

  return (
    <section
      aria-label="Community Action and Collective Impact Hub"
      className="flex flex-col gap-8 fade-in"
    >
      {/* Top Collective Impact KPI Banner */}
      <div className="glass-panel-elevated bg-gradient-to-br from-emerald-50/90 via-white to-slate-50 dark:from-emerald-950/40 dark:via-slate-900/90 dark:to-slate-900 border-emerald-300 dark:border-emerald-800/80 rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden shadow-sm">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold font-mono tracking-wide bg-emerald-100/90 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 shadow-2xs">
              <UsersIcon size={13} className="text-emerald-600 dark:text-emerald-400" />
              COLLECTIVE NEIGHBORHOOD RESILIENCE
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Community Smog Abatement Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            When neighbors coordinate emission curbs—eliminating backyard burning, coordinating carpools, and wet-sweeping streets—local PM2.5 levels decrease by up to 28%.
          </p>
        </div>

        {/* Impact Counters */}
        <div className="flex flex-wrap sm:flex-nowrap gap-4 shrink-0">
          <div className="glass-panel border-emerald-300 dark:border-emerald-800/80 rounded-2xl p-5 sm:p-6 text-center min-w-[155px] flex-1 sm:flex-none shadow-xs hover:border-emerald-400 dark:hover:border-emerald-700 transition-colors">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider block font-mono">
              CO₂ Prevented
            </span>
            <div className="text-3xl sm:text-4xl font-black text-emerald-700 dark:text-emerald-400 mt-1 font-mono tracking-tight font-mono-numbers">
              {collectiveMetrics.totalCo2Kg} <span className="text-xs text-slate-400 font-normal">kg</span>
            </div>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-1.5 block font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60">
              Carbon Curbs Active
            </span>
          </div>

          <div className="glass-panel border-sky-300 dark:border-sky-800/80 rounded-2xl p-5 sm:p-6 text-center min-w-[155px] flex-1 sm:flex-none shadow-xs hover:border-sky-400 dark:hover:border-sky-700 transition-colors">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider block font-mono">
              PM2.5 Averted
            </span>
            <div className="text-3xl sm:text-4xl font-black text-sky-700 dark:text-sky-400 mt-1 font-mono tracking-tight font-mono-numbers">
              {collectiveMetrics.totalPm25Grams} <span className="text-xs text-slate-400 font-normal">g</span>
            </div>
            <span className="text-[10px] text-sky-700 dark:text-sky-400 mt-1.5 block font-bold px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200/60 dark:border-sky-800/60">
              Pulmonary Relief
            </span>
          </div>
        </div>
      </div>

      {/* Emergency Smog Hazard Advisories & AI Generator */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col gap-6 border border-slate-200/90 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" aria-hidden="true" />
              <span>Multilingual Emergency Smog Advisories</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Live automated broadcast generation for neighborhood associations and school boards.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGenerateAdvisory}
            disabled={isGenerating}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-sm shadow-emerald-600/30 border border-emerald-400/30 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-95"
          >
            <SparklesIcon size={14} />
            <span>{isGenerating ? 'Synthesizing Broadcast…' : 'Generate Localized Advisory'}</span>
          </button>
        </div>

        {/* AI Generated Advisory Box */}
        {aiAdvisory && (
          <div
            role="region"
            aria-label="Generated community advisory"
            className={`p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-slate-100 text-sm leading-relaxed shadow-sm ${
              language === 'ar' ? 'font-arabic text-right' : ''
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Official Air Resilience Broadcast ({language.toUpperCase()}):</span>
            </div>
            <p className="text-slate-800 dark:text-slate-200">{aiAdvisory}</p>
          </div>
        )}

        {/* Community AQI Alert Banners */}
        <div className="flex flex-col gap-3.5">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              role="alert"
              aria-live="assertive"
              className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                alert.severity === 'emergency'
                  ? 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200'
                  : 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                    alert.severity === 'emergency'
                      ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                  }`}
                >
                  <AlertTriangleIcon size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                      {alert.zone}
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">
                      {alert.headline}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                    {alert.instructions}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => dismissAlert(alert.id)}
                className="text-xs px-4 py-2 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 self-end sm:self-center focus:outline-none focus:ring-2 focus:ring-slate-400 font-bold border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
              >
                Acknowledge
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Community Action Pledges Grid */}
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <CommunityIcon size={18} />
            </div>
            <span>Neighborhood Emission Reduction Pledges</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Join collective community pacts to eliminate localized winter pollution hotspots.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {pledges.map((pledge) => (
            <PledgeCard
              key={pledge.id}
              pledge={pledge}
              onToggle={togglePledge}
              pledgedLabel={t.pledged || 'Pledged Active'}
              pledgeNowLabel={t.pledgeNow || 'Take the Pledge'}
            />
          ))}
        </div>
      </div>
    </section>
  );
});
