import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SvgBookOpen, SvgArrowRight, SvgClock } from './icons/CustomIcons';
import { PLAYBOOK_GUIDES } from '../pages/PlaybookPage';

interface PlaybookSectionProps {
  onNavigatePlaybook?: () => void;
}

export const PlaybookSection: React.FC<PlaybookSectionProps> = ({ onNavigatePlaybook }) => {
  const topGuides = PLAYBOOK_GUIDES.slice(0, 3);

  return (
    <section className="py-20 sm:py-28 border-t border-black/[0.06] dark:border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-black/[0.06] dark:border-white/[0.08]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-mono font-bold text-brand uppercase tracking-widest bg-brand/10 dark:bg-brand/20 px-3 py-1 rounded-full">
                09 / Playbook
              </span>
              <span className="text-xs text-ink-muted dark:text-slate-400">Startapchilar bilishi shart</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-ink-text dark:text-white tracking-tight">
              Startap Boshlovchilar Kutubxonasi
            </h2>
            <p className="mt-2 text-sm text-ink-muted dark:text-slate-400 max-w-xl">
              G‘oyani sinash, birinchi MVPni yaratish, grant yutish va investorlar oldida pitch qilish bo‘yicha 100% amaliy yo‘riqnomalar.
            </p>
          </motion.div>

          <Link
            to="/playbook"
            onClick={onNavigatePlaybook}
            className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 hover:bg-cream-200 dark:hover:bg-slate-800 text-ink-text dark:text-white font-bold text-xs sm:text-sm border border-black/10 dark:border-white/10 shadow-xs flex items-center gap-2 self-start sm:self-auto transition-all hover:scale-105"
          >
            <span>Barcha 5 ta qo‘llanmani o‘qish</span>
            <SvgArrowRight className="w-4 h-4 text-brand" />
          </Link>
        </div>

        {/* 3-Card Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {topGuides.map((guide, idx) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link
                to="/playbook"
                onClick={onNavigatePlaybook}
                className="h-full p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.06] dark:border-white/[0.08] hover:border-brand/40 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group cursor-pointer block"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-brand/10 text-brand dark:bg-brand/20 dark:text-blue-300">
                      {guide.category}
                    </span>
                    <span className="text-[11px] text-ink-muted dark:text-slate-400 font-mono flex items-center gap-1">
                      <SvgClock className="w-3 h-3" />
                      {guide.readTime}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-ink-text dark:text-white group-hover:text-brand transition-colors leading-snug">
                    {guide.title}
                  </h3>

                  <p className="text-xs text-ink-muted dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {guide.summary}
                  </p>

                  <div className="p-3 rounded-xl bg-cream-50 dark:bg-slate-800/60 border border-black/[0.04] dark:border-white/[0.04] text-[11px] text-ink-muted dark:text-slate-300 italic">
                    "{guide.keyTakeaway}"
                  </div>
                </div>

                <div className="pt-5 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between mt-4">
                  <span className="text-xs font-medium text-ink-muted dark:text-slate-400">
                    Muallif: <b className="text-ink-text dark:text-white">{guide.author.split(' ')[0]}</b>
                  </span>

                  <span className="text-xs font-bold text-brand group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>O‘qish</span>
                    <SvgArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
