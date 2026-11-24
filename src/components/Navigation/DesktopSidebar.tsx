// ============================================================
// src/components/Navigation/DesktopSidebar.tsx
// Permanent Desktop Sidebar Navigation (lg+ viewports)
// Fully accessible with keyboard navigation, ARIA landmarks, and contrast compliance
// ============================================================

import { memo, type ReactNode } from 'react';
import type { TabId, UrbanZone, Language, AccessibilityMode } from '@/types';
import { BRANDING } from '@/config/branding';
import { ShieldLogo, UserIcon } from '@/components/ui/Icons';
import { SidebarPreferences } from './SidebarPreferences';

function ChevronRightIcon({ size = 14, className = '', ...props }: React.SVGProps<SVGSVGElement> & { size?: number | string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export interface NavTabItem {
  id: TabId;
  label: string;
  subtitle: string;
  icon: ReactNode;
}

export interface DesktopSidebarProps {
  tabs: NavTabItem[];
  activeTab: TabId;
  onSelectTab: (tabId: TabId) => void;
  onTabKeyDown: (e: React.KeyboardEvent, index: number) => void;
  selectedZone: UrbanZone;
  setSelectedZoneId: (zoneId: string) => void;
  zones: UrbanZone[];
  aqiColor: string;
  currentUser: { name: string; role: string } | null;
  onOpenAuth: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  accessibilityMode: AccessibilityMode;
  onAccessibilityModeChange: (mode: AccessibilityMode) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  appSubtitle: string;
}

export const DesktopSidebar = memo(function DesktopSidebar({
  tabs,
  activeTab,
  onSelectTab,
  onTabKeyDown,
  selectedZone,
  setSelectedZoneId,
  zones,
  aqiColor,
  currentUser,
  onOpenAuth,
  language,
  onLanguageChange,
  accessibilityMode,
  onAccessibilityModeChange,
  theme,
  onToggleTheme,
  appSubtitle,
}: DesktopSidebarProps) {
  return (
    <aside
      aria-label="Platform Sidebar Navigation"
      className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-72 z-40 bg-white/90 dark:bg-[#070b16]/95 backdrop-blur-2xl border-r border-slate-200/80 dark:border-slate-800/80 shadow-xs select-none transition-colors duration-200"
    >
      {/* Top Brand Identity Header */}
      <div className="p-5 border-b border-slate-200/70 dark:border-slate-800/70 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 text-white flex items-center justify-center shadow-md shadow-cyan-500/25 ring-1 ring-white/20 shrink-0">
              <ShieldLogo size={22} />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                {BRANDING.productName}
              </span>
              <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold tracking-wide">
                Clean Air Navigator
              </span>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60 shadow-2xs">
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            LIVE
          </span>
        </div>

        {/* Micro subtitle description */}
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
          {appSubtitle}
        </p>
      </div>

      {/* Quick Focused Sector Telemetry Module */}
      <div className="p-4 mx-3 my-3 rounded-2xl bg-slate-50/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black tracking-wider uppercase text-slate-600 dark:text-slate-400 font-mono">
            ACTIVE TELEMETRY SECTOR
          </span>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: aqiColor }} />
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
              {selectedZone.zoneName}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              Dominant: <strong className="text-slate-700 dark:text-slate-300">{selectedZone.dominantPollutant}</strong>
            </span>
          </div>

          <div
            className={`px-2.5 py-1 rounded-xl text-xs font-black font-mono shrink-0 border shadow-2xs ${
              selectedZone.aqi > 300
                ? 'text-rose-900 dark:text-rose-200'
                : selectedZone.aqi > 200
                ? 'text-purple-900 dark:text-purple-200'
                : selectedZone.aqi > 150
                ? 'text-red-900 dark:text-red-200'
                : selectedZone.aqi > 100
                ? 'text-orange-900 dark:text-orange-200'
                : selectedZone.aqi > 50
                ? 'text-amber-900 dark:text-amber-200'
                : 'text-emerald-900 dark:text-emerald-200'
            }`}
            style={{
              backgroundColor: `${aqiColor}15`,
              borderColor: `${aqiColor}40`,
            }}
          >
            AQI {selectedZone.aqi}
          </div>
        </div>

        {/* Quick Sector Select Picker */}
        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
          <label htmlFor="sidebar-zone-select" className="sr-only">
            Change Sector Telemetry
          </label>
          <select
            id="sidebar-zone-select"
            value={selectedZone.zoneId}
            onChange={(e) => setSelectedZoneId(e.target.value)}
            className="w-full bg-white dark:bg-slate-800/80 text-[11px] font-semibold text-slate-700 dark:text-slate-300 py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
          >
            {zones.map((z) => (
              <option
                key={z.zoneId}
                value={z.zoneId}
                className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                {z.zoneName} (AQI {z.aqi})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary Sidebar Vertical Tab Navigation */}
      <nav aria-label="Main application tabs" className="flex-1 px-3 py-1 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 pt-1 text-[10px] font-black tracking-widest text-slate-600 dark:text-slate-400 uppercase font-mono">
          COMMAND VIEWPORTS
        </div>

        <div
          role="tablist"
          aria-label="Main navigation panels"
          className="flex flex-col gap-1.5"
        >
          {tabs.map((tab, idx) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => onSelectTab(tab.id)}
                onKeyDown={(e) => onTabKeyDown(e, idx)}
                className={`group relative flex items-center justify-between w-full px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/10 via-teal-500/10 to-transparent dark:from-cyan-500/20 dark:via-teal-500/10 dark:to-transparent text-cyan-900 dark:text-cyan-100 border border-cyan-500/30 dark:border-cyan-400/30 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? 'bg-cyan-600 dark:bg-cyan-500 text-white shadow-xs shadow-cyan-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 group-hover:text-slate-800 dark:group-hover:text-slate-200'
                    }`}
                    aria-hidden="true"
                  >
                    {tab.icon}
                  </div>

                  <div className="flex flex-col text-left min-w-0">
                    <span className="truncate">{tab.label}</span>
                    <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400 truncate">
                      {tab.subtitle}
                    </span>
                  </div>
                </div>

                {isActive && (
                  <span className="text-cyan-600 dark:text-cyan-400 shrink-0">
                    <ChevronRightIcon size={14} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Sidebar Footer & Utility Strip */}
      <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
        {/* User Account / Sign In Pill */}
        <button
          type="button"
          onClick={onOpenAuth}
          aria-label={currentUser ? `Signed in as ${currentUser.name}` : 'Citizen Portal — Sign In (Secure Operator Mode)'}
          className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/70 shadow-2xs transition-all active:scale-98 cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-xs">
              <UserIcon size={14} />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-extrabold text-slate-900 dark:text-white">
                {currentUser ? currentUser.name : 'Citizen Portal'}
              </span>
              <span className="text-[9px] text-slate-500 dark:text-slate-400 font-normal">
                {currentUser ? currentUser.role : 'Secure Operator Mode'}
              </span>
            </div>
          </div>
          <span className="text-[10px] text-cyan-800 dark:text-cyan-300 font-bold">
            {currentUser ? 'Active' : 'Sign In'}
          </span>
        </button>

        {/* Quick Preferences Bar (Language, A11y & Theme) */}
        <SidebarPreferences
          language={language}
          onLanguageChange={onLanguageChange}
          accessibilityMode={accessibilityMode}
          onAccessibilityModeChange={onAccessibilityModeChange}
          theme={theme}
          onToggleTheme={onToggleTheme}
        />
      </div>
    </aside>
  );
});
