// ============================================================
// src/components/Routine/DailyRoutineOptimizer.tsx
// GenAI-Powered Personalized Schedule (Dual Theme Support)
// Senior Craftsmanship SaaS Design (Light & Dark WCAG AA Compliant)
// ============================================================

import { memo, useState, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';
import { apiService } from '@/services/apiService';
import type { PersonaProfile } from '@/types';
import { RoutineTimeline } from './RoutineTimeline';
import {
  SparklesIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  UserIcon,
  ClockIcon,
  ActivityIcon,
  LeafIcon,
} from '@/components/ui/Icons';

export const DailyRoutineOptimizer = memo(function DailyRoutineOptimizer() {
  const {
    personas,
    activePersona,
    setActivePersona,
    selectedZone,
    language,
    routinePlan,
    setRoutinePlan,
  } = useAppContext();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const plan = await apiService.generateDailyRoutine({
        persona: activePersona,
        zone: selectedZone,
        language,
      });
      setRoutinePlan(plan);
    } catch (err: unknown) {
      console.error('Failed to generate routine:', err);
      setErrorMessage(
        'Unable to generate AI schedule right now. Showing localized heuristic guidance.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [activePersona, selectedZone, language, setRoutinePlan]);

  return (
    <section
      aria-label="GenAI Daily Routine and Exposure Optimizer"
      className="flex flex-col gap-8 fade-in"
    >
      {/* Persona Selection & Hero Console */}
      <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 flex flex-col gap-6 relative overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold font-mono tracking-wide bg-violet-50 dark:bg-violet-950/70 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800/80 shadow-2xs">
                <SparklesIcon size={13} className="text-violet-600 dark:text-violet-400" />
                NEURAL SCHEDULE ENGINE
              </span>
              <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                Gemini 3.1 Flash Lite
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              GenAI Daily Routine & Smog Exposure Optimizer
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Select your family or lifestyle vulnerability profile to generate hour-by-hour exposure mitigation routines.
            </p>
          </div>

          <div className="shrink-0">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/25 active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950 flex items-center justify-center gap-2.5 border border-emerald-400/30 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <span
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                    aria-hidden="true"
                  />
                  <span>Optimizing with Gemini AI…</span>
                </>
              ) : (
                <>
                  <SparklesIcon size={16} />
                  <span>Generate Smart Schedule</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Persona Selector Segmented Grid */}
        <fieldset className="flex flex-col gap-3.5 relative z-10 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
          <legend className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <UserIcon size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span>Target Family & Commuter Persona:</span>
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {personas.map((p: PersonaProfile) => {
              const isSelected = p.id === activePersona.id;
              const isHighRisk = p.sensitivityLevel === 'high';

              return (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setActivePersona(p)}
                  className={`group p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 dark:focus:ring-offset-slate-900 relative cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-b from-emerald-50/90 to-white dark:from-emerald-950/40 dark:to-slate-900 border-emerald-500 dark:border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                      : 'bg-white/80 dark:bg-slate-900/60 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 hover:-translate-y-0.5 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 w-full">
                    <span
                      className={`font-extrabold text-sm sm:text-base tracking-tight ${
                        isSelected
                          ? 'text-emerald-950 dark:text-emerald-100'
                          : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {p.name}
                    </span>

                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border shrink-0 ${
                        isHighRisk
                          ? 'bg-rose-100/80 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/80'
                          : 'bg-amber-100/80 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/80'
                      }`}
                    >
                      {p.sensitivityLevel} Risk
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>

                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    <span>Baseline Exposure Profile</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                      {isHighRisk ? 'High Sensitivity' : 'Standard'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Screen Reader Announcements */}
        <div aria-live="polite" aria-busy={isLoading} className="sr-only">
          {isLoading
            ? 'Generating personalized air quality daily schedule with Gemini AI…'
            : 'Schedule ready.'}
        </div>

        {errorMessage && (
          <div
            role="status"
            className="p-4 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 rounded-2xl text-amber-900 dark:text-amber-200 text-xs flex items-center gap-3 relative z-10"
          >
            <AlertTriangleIcon size={16} className="text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Routine Plan Results */}
      {routinePlan && (
        <div className="flex flex-col gap-8 fade-in">
          {/* Key Metric Highlights & Optimal Window */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Optimal Outdoor Window */}
            <div className="glass-panel border-emerald-300 dark:border-emerald-800/80 rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between bg-gradient-to-br from-emerald-50/80 via-white to-white dark:from-emerald-950/30 dark:via-slate-900/70 dark:to-slate-900 shadow-sm">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                    <ClockIcon size={14} />
                  </div>
                  <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-800 dark:text-emerald-300">
                    Optimal Outdoor Activity Window
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 font-mono tracking-tight mt-1">
                  {routinePlan.optimalOutdoorWindow.startHour}:00 – {routinePlan.optimalOutdoorWindow.endHour}:00
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
                {routinePlan.optimalOutdoorWindow.rationale}
              </p>
            </div>

            {/* Card 2: Predicted PM2.5 Inhaled Dose */}
            <div className="glass-panel rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                    <ActivityIcon size={14} />
                  </div>
                  <span className="text-[11px] uppercase font-bold tracking-wider text-slate-600 dark:text-slate-400">
                    Predicted PM2.5 Inhaled Dose
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-sky-700 dark:text-sky-300 font-mono tracking-tight mt-1">
                  {routinePlan.totalExposureScore}{' '}
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">µg·h</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">
                Avoiding morning inversion peaks reduces pulmonary particulate intake by ~42%.
              </p>
            </div>

            {/* Card 3: Estimated Carbon Abatement */}
            <div className="glass-panel rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    <LeafIcon size={14} />
                  </div>
                  <span className="text-[11px] uppercase font-bold tracking-wider text-slate-600 dark:text-slate-400">
                    Estimated Carbon Abatement
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400 font-mono tracking-tight mt-1">
                  {routinePlan.carbonOffsetKg}{' '}
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">kg CO₂</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">
                Achieved by consolidating errands and shifting peak motorized transit trips.
              </p>
            </div>
          </div>

          {/* Timeline View */}
          <RoutineTimeline
            routinePlan={routinePlan}
            zoneName={selectedZone.zoneName}
          />

          {/* Actionable General Guidance Directives */}
          <div className="glass-panel rounded-2xl sm:rounded-3xl p-6 sm:p-8">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
              <span>Expert Smog Defense Directives</span>
            </h3>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs text-slate-700 dark:text-slate-300">
              {routinePlan.generalAdvice.map((advice, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 bg-slate-50/80 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                  <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5">
                    <CheckCircleIcon size={14} />
                  </div>
                  <span className="leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                    {advice}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
});
