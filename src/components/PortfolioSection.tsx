import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Startup, StartupCategory } from '../types';
import { 
  SvgRocket, 
  SvgSearch, 
  SvgTrophy, 
  SvgPitchDeck, 
  SvgMedalGold, 
  SvgMedalSilver, 
  SvgMedalBronze,
  SvgSparkles,
  SvgArrowRight,
  SvgPlus
} from './icons/CustomIcons';

interface PortfolioSectionProps {
  startups: Startup[];
  onSelectStartup?: (startup: Startup) => void;
  onUpvote: (id: string, e: React.MouseEvent) => void;
  onOpenApply: () => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  startups,
  onSelectStartup,
  onUpvote,
  onOpenApply
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<StartupCategory>('Barchasi');
  const [selectedBatch, setSelectedBatch] = useState<string>('Barchasi');
  const [viewMode, setViewMode] = useState<'grid' | 'leaderboard'>('grid');

  const categories: StartupCategory[] = [
    'Barchasi',
    'AI & EdTech',
    'AgroTech & Eco',
    'GreenTech & Energy',
    'Sanoat & IoT',
    'MedTech & Salomatlik'
  ];

  const batches = ['Barchasi', '3-Mavsum (2026)', '2-Mavsum (2025)', '1-Mavsum (2024)'];

  const handleUpvoteWithConfetti = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    confetti({
      particleCount: 35,
      spread: 50,
      origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
      colors: ['#2563EB', '#6366F1', '#38BDF8', '#10B981']
    });
    onUpvote(id, e);
  };

  const filtered = useMemo(() => {
    return startups.filter(item => {
      const matchCat = selectedCategory === 'Barchasi' || item.category === selectedCategory;
      const matchBatch = selectedBatch === 'Barchasi' || (item.batch && item.batch.includes(selectedBatch.split(' ')[0]));
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.tagline.toLowerCase().includes(q) ||
        (item.category && item.category.toLowerCase().includes(q));

      return matchCat && matchBatch && matchSearch;
    });
  }, [startups, selectedCategory, selectedBatch, searchQuery]);

  const leaderboardSorted = useMemo(() => {
    return [...filtered].sort((a, b) => b.upvotes - a.upvotes);
  }, [filtered]);

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
                02 / Portfel
              </span>
              <span className="text-xs text-ink-muted dark:text-slate-400">Akselerator bitiruvchilari</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-ink-text dark:text-white tracking-tight">
              Startaplar & Rezidentlar Loyihalari
            </h2>
            <p className="mt-2 text-sm text-ink-muted dark:text-slate-400 max-w-xl">
              NavDU Inkubatsiya va Akseleratsiya dasturi doirasida ishlab chiqilgan barcha startaplar, ularning natijalari va taqdimotlari.
            </p>
          </motion.div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* View Mode Toggle: Grid vs Leaderboard */}
            <div className="p-1 rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] flex items-center gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-800 text-brand shadow-xs'
                    : 'text-ink-muted dark:text-slate-400 hover:text-ink-text'
                }`}
              >
                Katalog (Grid)
              </button>
              <button
                onClick={() => setViewMode('leaderboard')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'leaderboard'
                    ? 'bg-white dark:bg-slate-800 text-brand shadow-xs'
                    : 'text-ink-muted dark:text-slate-400 hover:text-ink-text'
                }`}
              >
                <SvgTrophy className="w-3.5 h-3.5" />
                <span>Reyting (Top)</span>
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onOpenApply}
              className="px-4 py-2.5 rounded-2xl bg-brand hover:bg-brand-hover text-white font-bold text-xs sm:text-sm shadow-md shadow-brand/25 flex items-center gap-2 transition-all cursor-pointer"
            >
              <SvgPlus className="w-4 h-4" />
              <span>Startap qo‘shish</span>
            </motion.button>
          </div>
        </div>

        {/* Filter, Search & Batch Bar */}
        <div className="mt-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <SvgSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted dark:text-slate-400" />
              <input
                type="text"
                placeholder="Startap nomi, soha yoki kalit so‘z bo‘yicha qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 text-xs sm:text-sm text-ink-text dark:text-white placeholder:text-ink-muted focus:outline-hidden focus:border-brand transition-colors"
              />
            </div>

            {/* Batch Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {batches.map((batch) => (
                <button
                  key={batch}
                  onClick={() => setSelectedBatch(batch)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedBatch === batch
                      ? 'bg-brand text-white shadow-xs font-bold'
                      : 'bg-white dark:bg-slate-900 text-ink-muted dark:text-slate-400 hover:text-ink-text dark:hover:text-white border border-black/[0.06] dark:border-white/[0.08]'
                  }`}
                >
                  {batch}
                </button>
              ))}
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-brand text-white shadow-sm shadow-brand/20 font-bold'
                    : 'bg-white dark:bg-slate-900 text-ink-muted dark:text-slate-400 hover:text-ink-text dark:hover:text-white border border-black/[0.06] dark:border-white/[0.08]'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>

        {/* View Mode: Leaderboard */}
        {viewMode === 'leaderboard' ? (
          <div className="mt-8 rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.06] dark:border-white/[0.08] shadow-xs overflow-hidden">
            <div className="p-5 border-b border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SvgTrophy className="w-5 h-5" />
                <span className="text-sm font-extrabold text-ink-text dark:text-white">
                  NavDU Startaplar Leaderboardi (Reytingi)
                </span>
              </div>
              <span className="text-xs text-ink-muted dark:text-slate-400 font-mono">
                Ovozlar va o‘sish ko‘rsatkichi asosida
              </span>
            </div>

            <div className="divide-y divide-black/[0.06] dark:divide-white/[0.08]">
              {leaderboardSorted.map((s, index) => {
                const rank = index + 1;
                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      if (onSelectStartup) onSelectStartup(s);
                      navigate(`/startup/${s.id}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank Medal or Number */}
                      <div className="w-9 h-9 flex items-center justify-center shrink-0">
                        {rank === 1 && <SvgMedalGold className="w-5 h-5 text-amber-500" />}
                        {rank === 2 && <SvgMedalSilver className="w-5 h-5 text-slate-400" />}
                        {rank === 3 && <SvgMedalBronze className="w-5 h-5 text-amber-700" />}
                        {rank > 3 && (
                          <span className="font-mono font-black text-sm text-ink-muted dark:text-slate-400">
                            #{rank}
                          </span>
                        )}
                      </div>

                      {/* Logo */}
                      <div className="w-11 h-11 rounded-xl bg-cream-100 dark:bg-slate-800 border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center text-2xl shrink-0">
                        {s.logo}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm sm:text-base font-extrabold text-ink-text dark:text-white hover:text-brand transition-colors">
                            {s.name}
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand/10 text-brand">
                            {s.category}
                          </span>
                        </div>
                        <p className="text-xs text-ink-muted dark:text-slate-400 line-clamp-1 mt-0.5">
                          {s.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 pl-13 sm:pl-0">
                      {/* Metric / Traction */}
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 block font-mono">
                          {s.metrics?.users || s.metrics?.revenue || s.metrics?.grantWon || s.stage}
                        </span>
                        <span className="text-[10px] text-ink-muted dark:text-slate-400">Ko‘rsatkich</span>
                      </div>

                      {/* Upvote Pill */}
                      <button
                        onClick={(e) => handleUpvoteWithConfetti(s.id, e)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                          s.upvotedByUser
                            ? 'bg-brand text-white border-brand shadow-sm'
                            : 'bg-white dark:bg-slate-800 text-ink-text dark:text-white border-black/10 dark:border-white/10 hover:border-brand/40'
                        }`}
                      >
                        <span>▲</span>
                        <span>{s.upvotes}</span>
                      </button>

                      <span className="text-brand">
                        <SvgArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* View Mode: Grid */
          <motion.div 
            layout
            className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            <AnimatePresence>
              {filtered.map((s, idx) => (
                <motion.div
                  key={s.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  whileHover={{ y: -6, boxShadow: '0 12px 28px rgba(0, 0, 0, 0.08)' }}
                  onClick={() => {
                    if (onSelectStartup) onSelectStartup(s);
                    navigate(`/startup/${s.id}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="cursor-pointer p-6 rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.06] dark:border-white/[0.08] hover:border-brand/40 shadow-xs transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-13 h-13 rounded-2xl bg-cream-100 dark:bg-slate-800 border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center text-3xl shadow-2xs shrink-0 group-hover:scale-110 transition-transform">
                          {s.logo}
                        </div>
                        <div>
                          <h3 className="text-base font-extrabold text-ink-text dark:text-white group-hover:text-brand transition-colors">
                            {s.name}
                          </h3>
                          <span className="text-[11px] text-ink-muted dark:text-slate-400 block">{s.batch}</span>
                        </div>
                      </div>

                      {s.raisedAmount && (
                        <span className="text-xs font-black text-brand font-mono bg-brand/10 dark:bg-brand/20 px-2.5 py-1 rounded-full shrink-0">
                          {s.raisedAmount}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-ink-muted dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {s.tagline}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cream-200 dark:bg-slate-800 text-ink-text dark:text-slate-200">
                        {s.stage}
                      </span>
                      <span className="text-[10px] text-ink-muted dark:text-slate-400 bg-cream-100 dark:bg-slate-800/80 px-2 py-0.5 rounded border border-black/[0.04] dark:border-white/[0.06]">
                        {s.category}
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                        {s.metrics?.users || s.metrics?.revenue || s.metrics?.grantWon || s.stage}
                      </span>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
                    <span className="text-xs font-bold text-ink-muted dark:text-slate-400 group-hover:text-brand transition-colors inline-flex items-center gap-1">
                      <SvgPitchDeck className="w-3.5 h-3.5 text-brand" />
                      <span>Deck & Ma’lumot</span>
                      <SvgArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>

                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      whileHover={{ scale: 1.08 }}
                      onClick={(e) => handleUpvoteWithConfetti(s.id, e)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                        s.upvotedByUser
                          ? 'bg-brand text-white border-brand shadow-sm'
                          : 'bg-white dark:bg-slate-800 text-ink-text dark:text-white border-black/10 dark:border-white/10 hover:border-brand/40 hover:bg-cream-100'
                      }`}
                      title="Ovoz berish"
                    >
                      <motion.span 
                        animate={s.upvotedByUser ? { scale: [1, 1.4, 1] } : {}}
                        className="text-[11px]"
                      >
                        ▲
                      </motion.span>
                      <span>{s.upvotes}</span>
                    </motion.button>
                  </div>

                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </div>
    </section>
  );
};
