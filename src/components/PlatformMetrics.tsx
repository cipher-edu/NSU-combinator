import React from 'react';
import { motion } from 'framer-motion';
import { 
  SvgRocket, 
  SvgTrophy, 
  SvgUsers, 
  SvgPitchDeck, 
  SvgSparkles 
} from './icons/CustomIcons';

export const PlatformMetrics: React.FC = () => {
  const metrics = [
    {
      id: 'startups',
      icon: SvgRocket,
      value: '35+',
      label: 'Rezident Startaplar',
      sublabel: 'Faol rivojlanayotgan loyihalar',
      badge: '+8 bu mavsum',
      color: 'from-blue-500/20 to-blue-600/5',
      borderColor: 'border-blue-500/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      id: 'investments',
      icon: SvgTrophy,
      value: '1.2 mlrd',
      label: 'Sarmoya & Grantlar',
      sublabel: 'So‘m miqdorida jalb qilingan',
      badge: 'NKMK & Fondlar',
      color: 'from-amber-500/20 to-amber-600/5',
      borderColor: 'border-amber-500/20',
      textColor: 'text-amber-600 dark:text-amber-400'
    },
    {
      id: 'community',
      icon: SvgUsers,
      value: '1,500+',
      label: 'Klub A’zolari',
      sublabel: 'Talabalar va tadqiqotchilar',
      badge: '12 ta fakultet',
      color: 'from-emerald-500/20 to-emerald-600/5',
      borderColor: 'border-emerald-500/20',
      textColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      id: 'contracts',
      icon: SvgPitchDeck,
      value: '12 ta',
      label: 'Sanoat Shartnomalari',
      sublabel: 'Navoiy korxonalari bilan',
      badge: 'B2B Pilotlar',
      color: 'from-indigo-500/20 to-indigo-600/5',
      borderColor: 'border-indigo-500/20',
      textColor: 'text-indigo-600 dark:text-indigo-400'
    },
    {
      id: 'success',
      icon: SvgSparkles,
      value: '88%',
      label: 'Muvaffaqiyat Ulushi',
      sublabel: 'MVP bozorga chiqqanlar',
      badge: 'Eng yuqori KPI',
      color: 'from-purple-500/20 to-purple-600/5',
      borderColor: 'border-purple-500/20',
      textColor: 'text-purple-600 dark:text-purple-400'
    }
  ];

  return (
    <section className="py-12 sm:py-16 border-b border-black/[0.06] dark:border-white/[0.08] bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold text-brand uppercase tracking-wider bg-brand/10 dark:bg-brand/20 px-2.5 py-0.5 rounded-full">
                Jonli Statistika
              </span>
              <span className="text-xs text-ink-muted dark:text-slate-400">2026-yil holatiga ko‘ra</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-ink-text dark:text-white tracking-tight">
              NavDU Ekotizimining Rivojlanish Ko‘rsatkichlari
            </h3>
          </div>
          <div className="text-xs text-ink-muted dark:text-slate-400 max-w-xs">
            Markaz ochilganidan buyon talabalar va sanoat o‘rtasida yaratilgan aniq natijalar.
          </div>
        </div>

        {/* 5-Column Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5">
          {metrics.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`relative p-5 rounded-2xl bg-gradient-to-b ${item.color} bg-white dark:bg-slate-900 border ${item.borderColor} shadow-xs hover:shadow-md transition-all flex flex-col justify-between`}
              >
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs border border-black/[0.04] dark:border-white/[0.08]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 dark:bg-slate-800/80 text-ink-muted dark:text-slate-300 border border-black/[0.04] dark:border-white/[0.06]">
                    {item.badge}
                  </span>
                </div>

                <div>
                  <div className={`text-2xl sm:text-3xl font-black tracking-tight ${item.textColor}`}>
                    {item.value}
                  </div>
                  <div className="text-xs font-bold text-ink-text dark:text-white mt-1">
                    {item.label}
                  </div>
                  <div className="text-[11px] text-ink-muted dark:text-slate-400 mt-0.5 leading-snug">
                    {item.sublabel}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
