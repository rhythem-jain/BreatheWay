// ============================================================
// src/components/Navigation/MobileNavDrawer.tsx
// Slide-over navigation drawer for mobile form factor
// ============================================================

import { memo } from 'react';
import { TabId, Language, AccessibilityMode, type UrbanZone } from '@/types';
import { BRANDING } from '@/config/branding';
import { ShieldLogo, CloseIcon, UserIcon } from '@/components/ui/Icons';

export interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  tabs: Array<{ id: TabId; label: string; subtitle: string; icon: React.ReactNode }>;
  selectedZone: UrbanZone;
  aqiColor: string;
  currentUser: { name: string; role: string } | null;
  onOpenAuth: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  accessibilityMode: AccessibilityMode;
  onAccessibilityModeChange: (mode: AccessibilityMode) => void;
}

/**
 * Accessible Slide-Over Navigation Drawer for Mobile Viewport
 * Provides sector telemetry overview, navigation tabs, and preference controls.
 */
export const MobileNavDrawer = memo(function MobileNavDrawer({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  tabs,
  selectedZone,
  aqiColor,
  currentUser,
  onOpenAuth,
  language,
  onLanguageChange,
  accessibilityMode,
  onAccessibilityModeChange,
}: MobileNavDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50 flex">
      {/* Backdrop Blur */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="relative w-4/5 max-w-sm bg-white dark:bg-[#070b16] h-full shadow-2xl flex flex-col justify-between border-r border-slate-200 dark:border-slate-800 p-5 z-10 overflow-y-auto animate-fadeIn">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-400 text-white flex items-center justify-center shadow-xs">
                <ShieldLogo size={18} />
              </div>
              <span className="font-extrabold text-base text-slate-900 dark:text-white">
                {BRANDING.productName}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 cursor-pointer"
            >
              <CloseIcon size={18} />
            </button>
          </div>

          {/* Mobile Active Sector Widget */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400 font-mono">Current Sector</span>
              <span className="font-mono font-bold" style={{ color: aqiColor }}>
                AQI {selectedZone.aqi}
              </span>
            </div>
            <div className="font-bold text-slate-900 dark:text-white">{selectedZone.zoneName}</div>
          </div>

          {/* Mobile Nav Tabs */}
          <div className="flex flex-col gap-1.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 font-mono px-1">
              Navigation
            </div>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-3 w-full px-3.5 py-3 min-h-[48px] rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-900 dark:text-cyan-100 border border-cyan-300 dark:border-cyan-800'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span className={isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-500 dark:text-slate-400'}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Drawer Bottom Utilities */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenAuth();
            }}
            className="w-full py-3 min-h-[44px] rounded-xl font-bold text-xs bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98"
          >
            <UserIcon size={14} />
            <span>{currentUser ? currentUser.name : 'Open Citizen Portal'}</span>
          </button>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label htmlFor="mobile-lang" className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                Language
              </label>
              <select
                id="mobile-lang"
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold py-2 px-2 min-h-[44px] rounded-lg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value={Language.English} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">English</option>
                <option value={Language.Hindi} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">हिन्दी</option>
                <option value={Language.Arabic} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">العربية</option>
                <option value={Language.Spanish} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Español</option>
              </select>
            </div>

            <div>
              <label htmlFor="mobile-a11y" className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                Accessibility
              </label>
              <select
                id="mobile-a11y"
                value={accessibilityMode}
                onChange={(e) => onAccessibilityModeChange(e.target.value as AccessibilityMode)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold py-2 px-2 min-h-[44px] rounded-lg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value={AccessibilityMode.Standard} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Standard</option>
                <option value={AccessibilityMode.HighContrast} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Contrast</option>
                <option value={AccessibilityMode.ReducedMotion} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Reduced Motion</option>
                <option value={AccessibilityMode.ScreenReader} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Screen Reader</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
