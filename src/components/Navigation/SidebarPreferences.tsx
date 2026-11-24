// ============================================================
// src/components/Navigation/SidebarPreferences.tsx
// Quick Preferences Bar (Language, A11y & Theme)
// ============================================================

import { memo } from 'react';
import { Language, AccessibilityMode } from '@/types';
import { SunIcon, MoonIcon } from '@/components/ui/Icons';

export interface SidebarPreferencesProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  accessibilityMode: AccessibilityMode;
  onAccessibilityModeChange: (mode: AccessibilityMode) => void;
  theme: string;
  onToggleTheme: () => void;
}

/**
 * Quick Preferences Selector Bar for Desktop Navigation Sidebar
 * Allows 1-click language toggling, accessibility mode switches, and dual theme toggling.
 */
export const SidebarPreferences = memo(function SidebarPreferences({
  language,
  onLanguageChange,
  accessibilityMode,
  onAccessibilityModeChange,
  theme,
  onToggleTheme,
}: SidebarPreferencesProps) {
  return (
    <div className="grid grid-cols-3 gap-1.5 text-xs">
      {/* Language Selector */}
      <div className="relative col-span-1">
        <label htmlFor="sidebar-lang" className="sr-only">
          Language
        </label>
        <select
          id="sidebar-lang"
          value={language}
          onChange={(e) => onLanguageChange(e.target.value as Language)}
          className="w-full bg-white dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 py-1.5 px-2 rounded-xl border border-slate-200/80 dark:border-slate-700/80 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer text-center"
        >
          <option value={Language.English} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">EN</option>
          <option value={Language.Hindi} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">HI</option>
          <option value={Language.Arabic} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">AR</option>
          <option value={Language.Spanish} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">ES</option>
        </select>
      </div>

      {/* Accessibility Mode Selector */}
      <div className="relative col-span-1">
        <label htmlFor="sidebar-a11y" className="sr-only">
          Accessibility Mode
        </label>
        <select
          id="sidebar-a11y"
          value={accessibilityMode}
          onChange={(e) => onAccessibilityModeChange(e.target.value as AccessibilityMode)}
          className="w-full bg-white dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 py-1.5 px-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer text-center truncate"
        >
          <option value={AccessibilityMode.Standard} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">A11y</option>
          <option value={AccessibilityMode.HighContrast} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Contrast</option>
          <option value={AccessibilityMode.ReducedMotion} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Motion</option>
          <option value={AccessibilityMode.ScreenReader} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Reader</option>
        </select>
      </div>

      {/* Theme Toggle Button */}
      <button
        type="button"
        onClick={onToggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        className="w-full py-1.5 rounded-xl flex items-center justify-center text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 transition-colors shadow-2xs cursor-pointer active:scale-95"
      >
        {theme === 'light' ? <MoonIcon size={14} /> : <SunIcon size={14} />}
      </button>
    </div>
  );
});
