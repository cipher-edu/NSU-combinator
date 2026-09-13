import React from 'react';
import { motion } from 'framer-motion';
import { Startup } from '../types';
import { AnimatedCounter } from './AnimatedCounter';
import { SvgArrowRight } from './icons/CustomIcons';

interface DemoDaySectionProps {
  startups: Startup[];
  setActiveTab: (tab: string) => void;
}

export const DemoDaySection: React.FC<DemoDaySectionProps> = ({ startups, setActiveTab }) => {
  const rows = [
    { name: 'Business Robots AI', amount: '$150K', pct: 1.0, cat: 'AI & Avtomatlashtirish' },
    { name: 'AgroSmart Drip (NavDU)', amount: '$140K', pct: 0.93, cat: 'AgroTech & Eco' },
    { name: 'EduMentor AI (NavDU)', amount: '$100K', pct: 0.67, cat: 'AI & EdTech' },
    { name: 'EcoQuyosh (NavDU)', amount: '$100K', pct: 0.67, cat: 'GreenTech & Energy' },
    { name: 'diip.uz', amount: '$100K', pct: 0.67, cat: 'FinTech' },
    { name: 'MedNav Hub (NavDU)', amount: '$80K', pct: 0.53, cat: 'MedTech' },
    { name: 'KaryeraNavDU', amount: '$80K', pct: 0.53, cat: 'HRTech' },
    { name: 'ChiqindiYo‘q (NavDU)', amount: '$50K', pct: 0.33, cat: 'EcoTech' },
    { name: 'RoboNav STEM', amount: '$35K', pct: 0.23, cat: 'Robotics' },
  ];

  return (
    <section className="story-ink relative scroll-mt-24 overflow-hidden py-24 sm:py-32">
      {/* Ambient glow in dark section with Royal Blue and Indigo */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          
          {/* Left Column (Sticky info) */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:sticky lg:top-32 space-y-6"
            >
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-brand uppercase tracking-widest bg-brand/15 px-3 py-1 rounded-full border border-brand/30">
                  03 / Sahna
                </span>
                <span className="text-xs text-[#f5f5ee]/60">Demo Day natijalari</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Demo Day natijalari
              </h2>

              <p className="text-sm sm:text-base text-[#f5f5ee]/70 max-w-md leading-relaxed">
                Akseleratsiya bitiruvchi startaplarining yarmidan ortig‘i shu kuni sarmoya oldi va o‘z biznesini kengaytirdi.
              </p>

              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-brand/40 transition-colors"
                >
                  <div className="text-3xl sm:text-4xl font-black text-brand font-mono-num">
                    <AnimatedCounter prefix="$" end={975} suffix=",000" />
                  </div>
                  <p className="text-xs text-[#f5f5ee]/60 mt-1">Demo Day'da jami jalb qilindi</p>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-brand/40 transition-colors"
                >
                  <div className="text-3xl sm:text-4xl font-black text-white font-mono-num">
                    <AnimatedCounter prefix="$" end={150} suffix=",000" />
                  </div>
                  <p className="text-xs text-[#f5f5ee]/60 mt-1">Eng katta yakka investitsiya</p>
                </motion.div>
              </div>

              <div className="pt-2 text-xs text-[#f5f5ee]/40 font-mono">
                NavDU Demo Day • Yillik Katta Ko‘rgazma
              </div>
            </motion.div>
          </div>

          {/* Right Column (Animated Progress Rows) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#f5f5ee]/60">
                Kim qancha jalb qildi
              </span>
              <span className="text-xs text-brand font-bold">Investitsiya</span>
            </div>

            <div className="space-y-4">
              {rows.map((row, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.06)' }}
                  className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white group-hover:text-brand transition-colors">
                        {row.name}
                      </span>
                      <span className="text-[10px] text-[#f5f5ee]/40 bg-white/[0.05] px-2 py-0.5 rounded">
                        {row.cat}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-brand">
                      {row.amount}
                    </span>
                  </div>

                  {/* Animated Progress Bar in Royal Blue to Indigo */}
                  <div className="w-full h-2 rounded-full bg-white/[0.08] overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${row.pct * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.2 + idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-brand via-indigo-500 to-sky-400 group-hover:brightness-125"
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="pt-4">
              <motion.button
                whileHover={{ x: 4 }}
                onClick={() => setActiveTab('portfolio')}
                className="text-xs font-bold text-[#f5f5ee] hover:text-brand transition-colors inline-flex items-center gap-2"
              >
                <span>Barcha startaplar portfelini ko‘rish</span>
                <SvgArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
