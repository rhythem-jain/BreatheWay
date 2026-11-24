// ============================================================
// src/components/Navigation/Header.tsx
// Modern Enterprise Sidebar & Responsive Navigation System
// Linear/Raycast/Stripe craftsmanship with full WCAG 2.2 AA accessibility
// ============================================================

import { memo, useState, useEffect, lazy, Suspense, type SVGProps } from 'react';
import { useAppContext } from '@/context/AppContext';
import { TabId } from '@/types';
import { TRANSLATIONS } from '@/lib/constants';
import { getAQIColor } from '@/lib/aqiCompute';
import { BRANDING } from '@/config/branding';
import { DesktopSidebar } from './DesktopSidebar';
import { MobileNavDrawer } from './MobileNavDrawer';

// Lazy-load AuthModal & Firebase to prevent render-blocking initial load
const AuthModal = lazy(() => import('@/components/Auth/AuthModal').then(m => ({ default: m.AuthModal })));
import {
  ShieldLogo,
  TelemetryIcon,
  RoutineIcon,
  TransitIcon,
  IAQIcon,
  CommunityIcon,
  SunIcon,
  MoonIcon,
  CloseIcon,
} from '@/components/ui/Icons';

function MenuIcon({ size = 18, className = '', ...props }: SVGProps<SVGSVGElement> & { size?: number | string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export const Header = memo(function Header() {
  const {
    activeTab,
    setActiveTab,
    selectedZone,
    setSelectedZoneId,
    zones,
    language,
    setLanguage,
    accessibilityMode,
    setAccessibilityMode,
    theme,
    toggleTheme,
  } = useAppContext();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; role: string } | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const aqiColor = getAQIColor(selectedZone.aqi);

  const tabs = [
    {
      id: TabId.Dashboard,
      label: t.tabDashboard || 'Air Telemetry',
      subtitle: 'Real-time mesh sensors',
      icon: <TelemetryIcon size={17} />,
    },
    {
      id: TabId.Routine,
      label: t.tabRoutine || 'Routine Optimizer',
      subtitle: 'AI exposure schedules',
      icon: <RoutineIcon size={17} />,
    },
    {
      id: TabId.Transit,
      label: t.tabTransit || 'Low-Emission Transit',
      subtitle: 'Dijkstra clean corridors',
      icon: <TransitIcon size={17} />,
    },
    {
      id: TabId.IAQ,
      label: t.tabIAQ || 'Indoor Air & Hacks',
      subtitle: 'CADR & DIY filtration',
      icon: <IAQIcon size={17} />,
    },
    {
      id: TabId.Community,
      label: t.tabCommunity || 'Community Action',
      subtitle: 'Collective smog curbs',
      icon: <CommunityIcon size={17} />,
    },
  ];

  // Close mobile drawer on Escape key for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  // Keyboard navigation for tablist
  const handleTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (index + 1) % tabs.length;
      setActiveTab(tabs[nextIndex].id);
      document.getElementById(`tab-${tabs[nextIndex].id}`)?.focus();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (index - 1 + tabs.length) % tabs.length;
      setActiveTab(tabs[prevIndex].id);
      document.getElementById(`tab-${tabs[prevIndex].id}`)?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveTab(tabs[0].id);
      document.getElementById(`tab-${tabs[0].id}`)?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveTab(tabs[tabs.length - 1].id);
      document.getElementById(`tab-${tabs[tabs.length - 1].id}`)?.focus();
    }
  };

  const handleSelectTab = (tabId: TabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        role="banner"
        aria-label="BreatheWay application header"
        className="transition-colors duration-200"
      >
        {/* ============================================================
            1. DESKTOP PERMANENT SIDEBAR (Hidden on mobile/tablet, visible on lg+)
            ============================================================ */}
        <DesktopSidebar
          tabs={tabs}
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          onTabKeyDown={handleTabKeyDown}
          selectedZone={selectedZone}
          setSelectedZoneId={setSelectedZoneId}
          zones={zones}
          aqiColor={aqiColor}
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthOpen(true)}
          language={language}
          onLanguageChange={setLanguage}
          accessibilityMode={accessibilityMode}
          onAccessibilityModeChange={setAccessibilityMode}
          theme={theme}
          onToggleTheme={toggleTheme}
          appSubtitle={t.appSubtitle || BRANDING.tagline}
        />

        {/* ============================================================
            2. RESPONSIVE MOBILE TOP BAR (Visible only on mobile/tablet <lg)
            ============================================================ */}
        <div className="lg:hidden sticky top-0 z-40 bg-white/90 dark:bg-[#070b16]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-3 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-400 text-white flex items-center justify-center shadow-xs">
                <ShieldLogo size={18} />
              </div>
              <span className="font-extrabold text-slate-900 dark:text-white tracking-tight">
                {BRANDING.productName}
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-cyan-50 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
                ACTIVE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Sector AQI Pill */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border shadow-2xs font-mono"
              style={{
                backgroundColor: `${aqiColor}15`,
                borderColor: `${aqiColor}40`,
                color: aqiColor,
              }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: aqiColor }} />
              <span>AQI {selectedZone.aqi}</span>
            </div>

            {/* Mobile Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              {theme === 'light' ? <MoonIcon size={16} /> : <SunIcon size={16} />}
            </button>
          </div>
        </div>

        {/* ============================================================
            3. MOBILE DRAWER SLIDE-IN OVERLAY (When opened on mobile)
            ============================================================ */}
        <MobileNavDrawer
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          tabs={tabs}
          selectedZone={selectedZone}
          aqiColor={aqiColor}
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthOpen(true)}
          language={language}
          onLanguageChange={setLanguage}
          accessibilityMode={accessibilityMode}
          onAccessibilityModeChange={setAccessibilityMode}
        />
      </header>

      {/* Auth SaaS & Firebase Integration Modal (Lazy-loaded to keep initial bundle ultra-fast) */}
      {isAuthOpen && (
        <Suspense fallback={null}>
          <AuthModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
            onLoginSuccess={(user) => {
              setCurrentUser(user);
            }}
          />
        </Suspense>
      )}
    </>
  );
});