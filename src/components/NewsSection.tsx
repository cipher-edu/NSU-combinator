import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SvgNewspaper, SvgCalendar, SvgClock, SvgEye, SvgArrowRight } from './icons/CustomIcons';
import { NewsItem } from '../types';

interface NewsSectionProps {
  news: NewsItem[];
}

export const NewsSection: React.FC<NewsSectionProps> = ({ news }) => {
  const latestNews = news.slice(0, 3);

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
              <span className="text-xs font-mono font-bold text-brand dark:text-blue-400 uppercase tracking-widest bg-brand/10 dark:bg-brand/20 px-3 py-1 rounded-full">
                08 / Yangiliklar
              </span>
              <span className="text-xs text-ink-muted dark:text-slate-400">Matbuot va E’lonlar</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-ink-text dark:text-white tracking-tight">
              So‘nggi yangiliklar & Press
            </h2>
            <p className="mt-2 text-sm text-ink-muted dark:text-slate-300 max-w-xl">
              NavDU Inkubatsiya markazi, Startap Klubi hamda rezident loyihalarning dolzarb xabarlari.
            </p>
          </motion.div>

          <Link
            to="/news"
            className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 hover:bg-cream-200 dark:hover:bg-slate-800 text-ink-text dark:text-white font-bold text-xs sm:text-sm border border-black/10 dark:border-white/10 shadow-xs flex items-center gap-2 self-start sm:self-auto transition-all hover:scale-105 cursor-pointer"
          >
            <span>Barcha yangiliklarni ko‘rish</span>
            <SvgArrowRight className="w-4 h-4 text-brand dark:text-blue-400" />
          </Link>
        </div>

        {/* 3-Card Grid with Scroll In */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestNews.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link
                to={`/news/${item.id}`}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.07] dark:border-white/[0.08] hover:border-brand/40 dark:hover:border-brand/50 shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between overflow-hidden h-full"
              >
                <div className="space-y-4">
                  {/* Thumbnail */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img 
                      src={item.coverImage} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-ink-text dark:text-white text-[11px] font-bold shadow-xs">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-6 space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-ink-muted dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <SvgCalendar className="w-3.5 h-3.5" />
                        {item.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <SvgClock className="w-3.5 h-3.5" />
                        {item.readTime}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-ink-text dark:text-white group-hover:text-brand dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-ink-muted dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {item.excerpt}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 mt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-xs text-ink-muted dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <SvgEye className="w-3.5 h-3.5" />
                    <span>{item.viewsCount}</span>
                  </div>

                  <span className="font-bold text-brand dark:text-blue-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    <span>Batafsil o‘qish</span>
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
