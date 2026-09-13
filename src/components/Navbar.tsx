import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SvgRocket, 
  SvgTrophy, 
  SvgNewspaper, 
  SvgGraduation, 
  SvgCalendar, 
  SvgUsers, 
  SvgBookOpen, 
  SvgSearch, 
  SvgSun, 
  SvgMoon,
  SvgMenu,
  SvgX,
  SvgArrowRight,
  SvgFileText,
  SvgSparkles
} from './icons/CustomIcons';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenApply: () => void;
  onOpenStatusCheck: () => void;
  onOpenCommandPalette?: () => void;
  isDark?: boolean;
  toggleTheme?: () => void;
  customTicker?: { badge_text: string; message: string; action_text: string } | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenApply,
  onOpenStatusCheck,
  onOpenCommandPalette,
  isDark = false,
  toggleTheme,
  customTicker,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparent = activeTab === 'home' && !scrolled && !mobileMenuOpen;

  const navItems = [
    { id: 'home', label: 'Bosh sahifa', icon: SvgRocket },
    { id: 'portfolio', label: 'Startaplar', icon: SvgRocket },
    { id: 'demoday', label: 'Demo Day', icon: SvgTrophy },
    { id: 'news', label: 'Yangiliklar', icon: SvgNewspaper },
    { id: 'playbook', label: 'Playbook', icon: SvgBookOpen },
    { id: 'events', label: 'Hakatonlar', icon: SvgCalendar },
    { id: 'team', label: 'Talent Pool', icon: SvgUsers },
    { id: 'mentors', label: 'Mentorlar', icon: SvgGraduation },
  ];

  const handleNav = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.header 
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-40 w-full backdrop-blur-md transition-all duration-300 ${
        isTransparent
          ? 'bg-slate-950/40 border-b border-white/10 text-white'
          : 'bg-cream-100/95 dark:bg-slate-950/95 border-b border-black/[0.06] dark:border-white/[0.08] text-ink-text dark:text-white shadow-xs'
      }`}
    >
      {/* Top Micro-Ticker */}
      <div className={`text-[11px] sm:text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 overflow-hidden relative transition-colors ${
        isTransparent
          ? 'bg-brand/85 text-white backdrop-blur-xs border-b border-white/10'
          : 'bg-brand text-white shadow-inner'
      }`}>
        <motion.div 
          animate={{ x: [0, 4, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="bg-white/20 text-white px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shrink-0 backdrop-blur-xs flex items-center gap-1"
        >
          <SvgSparkles className="w-2.5 h-2.5 text-amber-300" />
          <span>{customTicker?.badge_text || 'NavDU 3-Mavsum'}</span>
        </motion.div>
        <span className="truncate">{customTicker?.message || 'Inkubatsiya va Akseleratsiya Markazi: 45 kunlik intensiv dasturiga arizalar ochiq!'}</span>
        <button 
          onClick={onOpenApply}
          className="underline font-bold hover:text-blue-100 transition-colors ml-1 hidden sm:inline shrink-0 cursor-pointer"
        >
          {customTicker?.action_text || 'Ariza topshirish →'}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo with interactive hover */}
          <motion.div 
            onClick={() => handleNav('home')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-brand to-blue-500 flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-md shadow-brand/30 transition-transform group-hover:rotate-3">
              N
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className={`font-extrabold text-base sm:text-lg tracking-tight transition-colors ${
                  isTransparent ? 'text-white' : 'text-ink-text dark:text-white'
                }`}>
                  NavDU
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border transition-colors ${
                  isTransparent 
                    ? 'bg-brand/30 text-blue-300 border-blue-400/30' 
                    : 'bg-brand/10 dark:bg-brand/20 text-brand dark:text-blue-400 border-brand/20 dark:border-brand/40'
                }`}>
                  Startap Klubi
                </span>
              </div>
              <span className={`text-[10px] -mt-0.5 hidden sm:block font-medium transition-colors ${
                isTransparent ? 'text-slate-300' : 'text-ink-muted dark:text-slate-400'
              }`}>
                Inkubatsiya va Akseleratsiya Markazi
              </span>
            </div>
          </motion.div>

          {/* Desktop Navigation Links with animated active pill */}
          <nav className="hidden xl:flex items-center gap-1 relative">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`relative px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors z-10 cursor-pointer ${
                    isActive
                      ? isTransparent ? 'text-white font-bold' : 'text-brand dark:text-blue-400 font-bold'
                      : isTransparent ? 'text-slate-200 hover:text-white' : 'text-ink-muted dark:text-slate-300 hover:text-ink-text dark:hover:text-white'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activePill"
                      className={`absolute inset-0 rounded-lg -z-10 ${
                        isTransparent ? 'bg-white/20' : 'bg-brand/10 dark:bg-brand/25'
                      }`}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action CTAs (Desktop only: xl and up) */}
          {/* Right Action CTAs (Desktop only: xl and up) */}
          <div className="hidden xl:flex items-center gap-2.5">
            {/* Spotlight Search Trigger */}
            <button
              onClick={onOpenCommandPalette}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                isTransparent 
                  ? 'bg-white/15 hover:bg-white/25 border-white/30 text-white shadow-xs' 
                  : 'bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] border-black/[0.1] dark:border-white/[0.15] text-ink-text dark:text-white shadow-2xs'
              }`}
              title="Spotlight tezkor qidiruv (Ctrl + K)"
            >
              <SvgSearch className={`w-4 h-4 ${isTransparent ? 'text-white' : 'text-brand dark:text-blue-400'}`} />
              <span className="hidden lg:inline text-xs font-semibold">Qidirish...</span>
              <kbd className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                isTransparent 
                  ? 'bg-white/20 border-white/30 text-white' 
                  : 'bg-white dark:bg-slate-800 border-black/10 dark:border-white/10 text-ink-muted dark:text-slate-300'
              }`}>
                ⌘K
              </kbd>
            </button>

            {/* Dark Mode Toggle */}
            {toggleTheme && (
              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                  isTransparent 
                    ? 'bg-white/15 hover:bg-white/25 border-white/30 text-white shadow-xs' 
                    : 'bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] border-black/[0.1] dark:border-white/[0.15] text-ink-text dark:text-white shadow-2xs'
                }`}
                title={isDark ? "Yorug‘ rejim (Light Mode)" : "Tungi rejim (Dark Mode)"}
                aria-label="Toggle Theme"
              >
                {isDark ? (
                  <SvgSun className="w-4 h-4 text-amber-400" />
                ) : (
                  <SvgMoon className="w-4 h-4 text-indigo-600 dark:text-blue-400" />
                )}
              </button>
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenStatusCheck}
              className={`text-xs font-semibold px-3 py-2 rounded-xl transition-colors border flex items-center gap-1.5 cursor-pointer ${
                isTransparent
                  ? 'text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border-white/25'
                  : 'text-ink-muted dark:text-slate-300 hover:text-ink-text dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] border-black/[0.08] dark:border-white/[0.1]'
              }`}
            >
              <SvgFileText className={`w-3.5 h-3.5 ${isTransparent ? 'text-blue-300' : 'text-brand dark:text-blue-400'}`} />
              <span>Ariza holati</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 8px 20px -4px rgba(37, 99, 235, 0.35)' }}
              whileTap={{ scale: 0.96 }}
              onClick={onOpenApply}
              className="text-xs font-bold px-4 py-2 rounded-xl bg-brand hover:bg-brand-hover text-white shadow-md shadow-brand/25 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Ariza topshirish</span>
              <SvgArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>

          {/* Mobile controls & hamburger (Shown below xl) */}
          <div className="flex items-center gap-1.5 xl:hidden">
            {/* Search */}
            <button
              onClick={onOpenCommandPalette}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                isTransparent
                  ? 'bg-white/15 border-white/30 text-white hover:bg-white/25'
                  : 'bg-black/[0.04] dark:bg-white/[0.08] border-black/10 dark:border-white/15 text-brand dark:text-blue-400 hover:bg-black/[0.08]'
              }`}
              aria-label="Qidirish"
              title="Qidirish"
            >
              <SvgSearch className="w-4 h-4 text-current" />
            </button>

            {/* Dark Mode Toggle */}
            {toggleTheme && (
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                  isTransparent
                    ? 'bg-white/15 border-white/30 text-white hover:bg-white/25'
                    : 'bg-black/[0.04] dark:bg-white/[0.08] border-black/10 dark:border-white/15 text-ink-text dark:text-white hover:bg-black/[0.08]'
                }`}
                aria-label="Toggle Theme Mobile"
                title={isDark ? "Yorug‘ rejim" : "Tungi rejim"}
              >
                {isDark ? (
                  <SvgSun className="w-4 h-4 text-amber-400" />
                ) : (
                  <SvgMoon className="w-4 h-4 text-indigo-600 dark:text-blue-400" />
                )}
              </button>
            )}

            {/* Quick Apply Button on tablet screens */}
            <button
              onClick={onOpenApply}
              className="hidden sm:inline-flex text-xs font-bold px-3 py-1.5 rounded-xl bg-brand hover:bg-brand-hover text-white shadow-sm shadow-brand/20 active:scale-95 transition-transform cursor-pointer"
            >
              Ariza
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                isTransparent 
                  ? 'bg-white/15 border-white/30 text-white hover:bg-white/25' 
                  : 'bg-black/[0.04] dark:bg-white/[0.08] border-black/10 dark:border-white/15 text-ink-muted dark:text-slate-300 hover:text-ink-text dark:hover:text-white hover:bg-black/[0.08]'
              }`}
              aria-label="Menyu"
            >
              {mobileMenuOpen ? <SvgX className="w-5 h-5 text-brand dark:text-blue-400" /> : <SvgMenu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Hamburger Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="xl:hidden border-t border-black/[0.06] dark:border-white/[0.08] bg-cream-100/98 dark:bg-slate-900/98 backdrop-blur-2xl px-4 py-4 space-y-2 shadow-2xl overflow-hidden"
          >
            {/* Mobile Drawer Search Bar */}
            <button
              onClick={() => { onOpenCommandPalette?.(); setMobileMenuOpen(false); }}
              className="w-full py-2.5 px-3.5 rounded-2xl border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-slate-800 text-xs font-semibold text-ink-muted dark:text-slate-300 flex items-center justify-between shadow-2xs hover:border-brand transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2 text-ink-text dark:text-white">
                <SvgSearch className="w-4 h-4 text-brand dark:text-blue-400" />
                <span>Startaplar yoki yangiliklarni qidirish...</span>
              </span>
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cream-200 dark:bg-slate-700 text-ink-text dark:text-slate-300">
                ⌘K
              </kbd>
            </button>

            {/* Mobile Drawer Dark Mode Switch Row */}
            {toggleTheme && (
              <button
                onClick={() => toggleTheme()}
                className="w-full py-2.5 px-3.5 rounded-2xl border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-slate-800 text-xs font-semibold text-ink-text dark:text-white flex items-center justify-between shadow-2xs hover:border-brand/40 transition-all cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  {isDark ? (
                    <SvgSun className="w-4 h-4 text-amber-400" />
                  ) : (
                    <SvgMoon className="w-4 h-4 text-indigo-600 dark:text-blue-400" />
                  )}
                  <span>{isDark ? 'Yorug‘ rejim (Kunduzgi)' : 'Tungi rejim (Dark Mode)'}</span>
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  isDark ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300' : 'bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300'
                }`}>
                  {isDark ? '☀️ Ochiq' : '🌙 Tungi'}
                </span>
              </button>
            )}

            <div className="grid grid-cols-2 gap-1.5 pt-1 pb-2">
              {navItems.map((item) => {
                const ItemIcon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                      isActive
                        ? 'bg-brand text-white font-bold shadow-sm shadow-brand/25'
                        : 'text-ink-muted dark:text-slate-400 hover:text-ink-text dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                    }`}
                  >
                    <ItemIcon className="w-4 h-4" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-black/[0.08] dark:border-white/[0.08] space-y-2">
              <button
                onClick={() => { onOpenStatusCheck(); setMobileMenuOpen(false); }}
                className="w-full py-2.5 px-3 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-slate-800 text-xs font-semibold text-ink-text dark:text-white flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <SvgFileText className="w-4 h-4 text-brand" />
                <span>Topshirilgan arizani tekshirish</span>
              </button>
              
              <button
                onClick={() => { onOpenApply(); setMobileMenuOpen(false); }}
                className="w-full py-2.5 px-3 rounded-xl bg-brand text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-brand/25 cursor-pointer"
              >
                <span>3-Mavsumga ariza topshirish</span>
                <SvgArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
