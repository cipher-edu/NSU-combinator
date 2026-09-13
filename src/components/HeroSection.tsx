import React from 'react';
import { motion } from 'framer-motion';
import { SvgArrowRight, SvgCheckCircle2, SvgFlame } from './icons/CustomIcons';
import { Startup } from '../types';
import { AnimatedCounter } from './AnimatedCounter';

interface HeroSectionProps {
  onOpenApply: () => void;
  setActiveTab: (tab: string) => void;
  startups: Startup[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenApply,
  setActiveTab,
  startups
}) => {
  return (
    <section 
      id="main-hero-content"
      className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Status Pill with Scroll Reveal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.85, y: 25 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-light dark:bg-brand/15 border border-brand/20 dark:border-brand/30 text-brand dark:text-blue-400 text-xs font-bold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
            <span>3-mavsum qabuli ochiq • 45 kunlik intensiv dastur</span>
          </div>
        </motion.div>

        {/* Hero Title and Subtitle with Staggered Scroll Reveal */}
        <motion.div 
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-center max-w-4xl mx-auto space-y-6"
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-ink-text dark:text-white tracking-tight leading-[1.1]">
            Startaplarni{' '}
            <span className="relative inline-block text-brand dark:text-blue-400">
              tez o‘stiruvchi
              <motion.span 
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="absolute left-0 bottom-1 w-full h-2 bg-brand/20 dark:bg-brand/40 -z-10 rounded-full origin-left"
              />
            </span>{' '}
            akselerator
          </h1>

          <p className="text-base sm:text-xl text-ink-muted dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Navoiy davlat universiteti talabalari, yosh olimlari va dasturchilarining xom g‘oyalarini 45 kunda ishchi mahsulot va investitsiyaga aylantiramiz.
          </p>

          {/* Big Interactive CTAs */}
          <div className="pt-2 flex flex-col items-center justify-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 12px 30px -6px rgba(37, 99, 235, 0.4)' }}
                whileTap={{ scale: 0.96 }}
                onClick={onOpenApply}
                className="px-8 py-4 rounded-2xl bg-brand hover:bg-brand-hover text-white font-extrabold text-base sm:text-lg shadow-xl shadow-brand/30 transition-all flex items-center gap-3 group cursor-pointer"
              >
                <span>Arizangizni topshiring</span>
                <SvgArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTab('portfolio')}
                className="px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 text-ink-text dark:text-white hover:bg-cream-100 dark:hover:bg-slate-800 font-bold text-sm sm:text-base border border-black/10 dark:border-white/10 transition-all shadow-sm cursor-pointer"
              >
                Portfelni ko‘rish
              </motion.button>
            </div>

            {/* Perks Badges with hover pop */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-semibold text-ink-muted dark:text-slate-400">
              <span className="flex items-center gap-1.5 transition-transform hover:scale-105">
                <SvgCheckCircle2 className="w-4 h-4 text-emerald-500" />
                $1000 stipendiya
              </span>
              <span className="flex items-center gap-1.5 transition-transform hover:scale-105">
                <SvgCheckCircle2 className="w-4 h-4 text-emerald-500" />
                3 mahal bepul ovqat & kovorking
              </span>
              <span className="flex items-center gap-1.5 transition-transform hover:scale-105">
                <SvgCheckCircle2 className="w-4 h-4 text-emerald-500" />
                $1.000.000 gacha investitsiya
              </span>
            </div>
          </div>
        </motion.div>

        {/* Big Figures Banner with Animated Counters & Hover Glow */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.93, y: 45 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 sm:mt-24 p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.07] dark:border-white/[0.08] shadow-sm max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center hover:border-brand/30 dark:hover:border-brand/50 transition-colors"
        >
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand dark:text-blue-400 font-mono-num">
              <AnimatedCounter prefix="$" end={975} suffix="K" />
            </div>
            <p className="text-xs text-ink-muted dark:text-slate-400 font-medium">Demo Day'da jami jalb qilindi</p>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink-text dark:text-white font-mono-num">
              <AnimatedCounter end={56} />
            </div>
            <p className="text-xs text-ink-muted dark:text-slate-400 font-medium">Startap, ikki mavsum</p>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink-text dark:text-white font-mono-num">
              <AnimatedCounter end={45} suffix=" kun" />
            </div>
            <p className="text-xs text-ink-muted dark:text-slate-400 font-medium">Intensiv akseleratsiya</p>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-600 dark:text-emerald-400 font-mono-num">
              <AnimatedCounter prefix="$" end={150} suffix="K" />
            </div>
            <p className="text-xs text-ink-muted dark:text-slate-400 font-medium">Eng katta yakka investitsiya</p>
          </div>
        </motion.div>

        {/* Smooth Infinite Logo Marquee with Scroll In */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-16 overflow-hidden py-4 max-w-6xl mx-auto relative"
        >
          <p className="text-center text-xs font-bold uppercase tracking-widest text-ink-muted/70 dark:text-slate-400 mb-5">
            Bizning startaplarimiz va loyihalar:
          </p>

          <div className="flex overflow-hidden select-none [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <motion.div 
              animate={{ x: ['0%', '-50%'] }}
              transition={{ repeat: Infinity, ease: 'linear', duration: 25 }}
              className="flex items-center gap-4 flex-nowrap shrink-0"
            >
              {[...startups, ...startups, ...startups].map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveTab('portfolio')}
                  className="cursor-pointer px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-black/[0.06] dark:border-white/[0.08] hover:border-brand/40 dark:hover:border-brand/50 shadow-2xs flex items-center gap-2.5 shrink-0 transition-all hover:scale-105"
                >
                  <span className="text-xl">{s.logo}</span>
                  <span className="text-xs font-bold text-ink-text dark:text-white">{s.name}</span>
                  {s.raisedAmount && (
                    <span className="text-[10px] font-bold text-brand dark:text-blue-400 bg-brand/10 dark:bg-brand/25 px-2 py-0.5 rounded-md">
                      {s.raisedAmount}
                    </span>
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
