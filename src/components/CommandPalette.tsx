import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  SvgSearch, 
  SvgCommand, 
  SvgRocket, 
  SvgNewspaper, 
  SvgTrophy, 
  SvgGraduation, 
  SvgCalendar, 
  SvgSun, 
  SvgMoon, 
  SvgBookOpen,
  SvgPitchDeck
} from './icons/CustomIcons';
import { Startup, NewsItem } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  startups: Startup[];
  news: NewsItem[];
  setActiveTab: (tab: string) => void;
  onOpenApply: () => void;
  onOpenStatusCheck: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

interface CommandItem {
  id: string;
  category: 'Sahifalar' | 'Startaplar' | 'Yangiliklar' | 'Amallar';
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  badge?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  startups,
  news,
  setActiveTab,
  onOpenApply,
  onOpenStatusCheck,
  isDark,
  toggleTheme,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const items: CommandItem[] = useMemo(() => {
    const list: CommandItem[] = [
      // Actions
      {
        id: 'act-apply',
        category: 'Amallar',
        title: 'Inkubatsiyaga ariza topshirish',
        subtitle: '45 kunlik intensiv dasturga qabul',
        icon: SvgRocket,
        badge: 'Yangi',
        action: () => {
          onClose();
          onOpenApply();
        }
      },
      {
        id: 'act-status',
        category: 'Amallar',
        title: 'Topshirilgan arizani tekshirish',
        subtitle: 'Ariza ID kodi bo‘yicha natija',
        icon: SvgCommand,
        action: () => {
          onClose();
          onOpenStatusCheck();
        }
      },
      {
        id: 'act-theme',
        category: 'Amallar',
        title: isDark ? 'Yorug‘ rejimga o‘tish (Light Mode)' : 'Tungi rejimga o‘tish (Dark Mode)',
        subtitle: 'Interfeys ko‘rinishini o‘zgartirish',
        icon: isDark ? SvgSun : SvgMoon,
        action: () => {
          toggleTheme();
        }
      },
      // Navigation Pages
      {
        id: 'nav-home',
        category: 'Sahifalar',
        title: 'Bosh sahifa',
        subtitle: 'Hero slider va umumiy ko‘rinish',
        icon: SvgRocket,
        action: () => {
          onClose();
          setActiveTab('home');
          navigate('/');
        }
      },
      {
        id: 'nav-news',
        category: 'Sahifalar',
        title: 'Yangiliklar & Press',
        subtitle: 'NavDU e’lonlari va matbuot relizlari',
        icon: SvgNewspaper,
        action: () => {
          onClose();
          setActiveTab('news');
          navigate('/news');
        }
      },
      {
        id: 'nav-portfolio',
        category: 'Sahifalar',
        title: 'Startaplar Katalogi',
        subtitle: 'Barcha 35+ rezident loyihalar',
        icon: SvgRocket,
        action: () => {
          onClose();
          setActiveTab('portfolio');
          navigate('/portfolio');
        }
      },
      {
        id: 'nav-playbook',
        category: 'Sahifalar',
        title: 'Startup Playbook (Bilimlar Bazasi)',
        subtitle: 'G‘oyadan investitsiyagacha qo‘llanma',
        icon: SvgBookOpen,
        badge: 'Tavsiya',
        action: () => {
          onClose();
          setActiveTab('playbook');
          navigate('/playbook');
        }
      },
      {
        id: 'nav-demoday',
        category: 'Sahifalar',
        title: 'Demo Day & Bitiruvchilar',
        subtitle: 'Investorlar oldidagi taqdimotlar',
        icon: SvgTrophy,
        action: () => {
          onClose();
          setActiveTab('demoday');
          navigate('/demoday');
        }
      },
      {
        id: 'nav-events',
        category: 'Sahifalar',
        title: 'Hakatonlar & InnoHack',
        subtitle: '48 soatlik bellashuvlar va tadbirlar',
        icon: SvgCalendar,
        action: () => {
          onClose();
          setActiveTab('events');
          navigate('/events');
        }
      },
      {
        id: 'nav-mentors',
        category: 'Sahifalar',
        title: 'Mentorlar Tarmog‘i',
        subtitle: 'Ekspertlar bilan 1-on-1 uchrashuv',
        icon: SvgGraduation,
        action: () => {
          onClose();
          setActiveTab('mentors');
          navigate('/mentors');
        }
      },
    ];

    // Add Startups
    startups.forEach((s) => {
      list.push({
        id: `startup-${s.id}`,
        category: 'Startaplar',
        title: s.name,
        subtitle: `${s.category} • ${s.tagline}`,
        icon: SvgPitchDeck,
        badge: s.batch || 'Batch 3',
        action: () => {
          onClose();
          navigate(`/startup/${s.id}`);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });

    // Add News
    news.forEach((n) => {
      list.push({
        id: `news-${n.id}`,
        category: 'Yangiliklar',
        title: n.title,
        subtitle: `${n.category} • ${n.date}`,
        icon: SvgNewspaper,
        action: () => {
          onClose();
          navigate(`/news/${n.id}`);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });

    return list;
  }, [startups, news, isDark, navigate, onClose, onOpenApply, onOpenStatusCheck, setActiveTab, toggleTheme]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items.slice(0, 10);
    const q = query.toLowerCase().trim();
    return items.filter(
      item => 
        item.title.toLowerCase().includes(q) || 
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q)
    ).slice(0, 12);
  }, [items, query]);

  // Handle Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-black/[0.08] dark:border-white/[0.12] shadow-2xl overflow-hidden z-10"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-black/[0.06] dark:border-white/[0.08]">
              <SvgSearch className="w-5 h-5 text-brand shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Qidiring: startaplar, yangiliklar, hakatonlar, bilimlar..."
                className="w-full bg-transparent text-ink-text dark:text-white placeholder:text-ink-muted/60 dark:placeholder:text-slate-400 text-sm sm:text-base font-medium focus:outline-hidden"
              />
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-1 rounded-md bg-black/[0.04] dark:bg-white/[0.08] text-ink-muted dark:text-slate-400">
                <span>ESC</span>
              </span>
            </div>

            {/* Results List */}
            <div className="max-h-[60vh] overflow-y-auto p-2.5 space-y-1">
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center text-ink-muted dark:text-slate-400 text-sm">
                  "{query}" bo‘yicha hech qanday natija topilmadi.
                </div>
              ) : (
                filteredItems.map((item, index) => {
                  const Icon = item.icon;
                  const isSelected = selectedIndex === index;
                  return (
                    <div
                      key={item.id}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-brand/10 dark:bg-brand/20 text-brand' 
                          : 'hover:bg-black/[0.03] dark:hover:bg-white/[0.04] text-ink-text dark:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2 rounded-xl shrink-0 transition-colors ${
                          isSelected 
                            ? 'bg-brand text-white shadow-xs' 
                            : 'bg-black/[0.04] dark:bg-white/[0.06] text-ink-muted dark:text-slate-300'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className={`text-xs sm:text-sm font-bold truncate ${
                            isSelected ? 'text-brand dark:text-blue-400' : ''
                          }`}>
                            {item.title}
                          </div>
                          {item.subtitle && (
                            <div className="text-[11px] text-ink-muted dark:text-slate-400 truncate">
                              {item.subtitle}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand/10 text-brand dark:bg-brand/30 dark:text-blue-300 border border-brand/20">
                            {item.badge}
                          </span>
                        )}
                        <span className="text-[10px] font-medium text-ink-muted/70 dark:text-slate-500">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Keyboard Guide */}
            <div className="px-5 py-3 bg-black/[0.02] dark:bg-white/[0.03] border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-[11px] text-ink-muted dark:text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 font-mono text-[10px]">↑↓</kbd> Tanlash
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 font-mono text-[10px]">↵</kbd> O‘tish
                </span>
              </div>
              <div className="flex items-center gap-1 font-mono text-[10px]">
                <span>NavDU Spotlight</span>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
