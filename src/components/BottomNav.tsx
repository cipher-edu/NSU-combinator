import React from 'react';
import { motion } from 'framer-motion';
import { 
  SvgHome, 
  SvgRocket, 
  SvgSparkles, 
  SvgCalendar, 
  SvgUsers 
} from './icons/CustomIcons';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenApply: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenApply,
}) => {
  const navTabs = [
    {
      id: 'home',
      label: 'Bosh sahifa',
      icon: SvgHome,
    },
    {
      id: 'portfolio',
      label: 'Startaplar',
      icon: SvgRocket,
    },
    {
      id: 'apply',
      label: 'Ariza',
      icon: SvgSparkles,
      isCenterAction: true,
    },
    {
      id: 'events',
      label: 'Tadbirlar',
      icon: SvgCalendar,
      badge: 'Yangi',
    },
    {
      id: 'team',
      label: 'Klub',
      icon: SvgUsers,
    },
  ];

  const handleTabClick = (tabId: string, isCenterAction?: boolean) => {
    if (isCenterAction) {
      onOpenApply();
    } else {
      setActiveTab(tabId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-black/[0.08] dark:border-white/[0.08] shadow-[0_-8px_25px_rgba(0,0,0,0.08)] pb-safe-offset-2 transition-colors"
    >
      <div className="max-w-md mx-auto px-3 py-1.5 flex items-center justify-around relative">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isCenterAction) {
            return (
              <div key={tab.id} className="relative -top-4 flex flex-col items-center">
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleTabClick(tab.id, true)}
                  className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-brand to-blue-500 text-white flex flex-col items-center justify-center shadow-lg shadow-brand/35 border-2 border-white dark:border-slate-800 ring-2 ring-brand/20 p-2.5 transition-all cursor-pointer"
                  aria-label="Ariza topshirish"
                >
                  <SvgSparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                  <span className="text-[9px] font-black tracking-tight leading-none mt-0.5">Ariza</span>
                </motion.button>
              </div>
            );
          }

          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.88 }}
              onClick={() => handleTabClick(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl transition-colors min-w-[58px] cursor-pointer ${
                isActive ? 'text-brand font-bold' : 'text-ink-muted dark:text-slate-400 hover:text-ink-text dark:hover:text-white'
              }`}
            >
              {/* Badge if present */}
              {tab.badge && (
                <span className="absolute top-0 right-1.5 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse">
                  {tab.badge}
                </span>
              )}

              {/* Animated active background pill */}
              {isActive && (
                <motion.div
                  layoutId="bottomNavPill"
                  className="absolute inset-0 bg-brand/10 dark:bg-brand/20 rounded-xl -z-10"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}

              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-115' : 'opacity-85'}`} />
              </div>

              <span className={`text-[10px] mt-1 transition-all ${
                isActive ? 'font-bold text-brand scale-105' : 'font-medium text-ink-muted dark:text-slate-400'
              }`}>
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
