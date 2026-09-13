import React from 'react';
import { motion } from 'framer-motion';
import { 
  SvgLogoNKMK, 
  SvgLogoNavoiyazot, 
  SvgLogoITPark, 
  SvgLogoDigitalGov, 
  SvgLogoHigherEdu, 
  SvgLogoAloqabank 
} from './icons/CustomIcons';

export const PartnersMarquee: React.FC = () => {
  const partners = [
    { id: 'nkmk', name: 'NKMK AJ', component: SvgLogoNKMK },
    { id: 'itpark', name: 'IT Park Uzbekistan', component: SvgLogoITPark },
    { id: 'navoiyazot', name: 'Navoiyazot AJ', component: SvgLogoNavoiyazot },
    { id: 'digital', name: 'Raqamli Texnologiyalar Vazirligi', component: SvgLogoDigitalGov },
    { id: 'edu', name: 'Oliy Ta’lim Vazirligi', component: SvgLogoHigherEdu },
    { id: 'aloqa', name: 'Aloqa Ventures', component: SvgLogoAloqabank },
  ];

  // Double list for infinite loop
  const marqueeList = [...partners, ...partners];

  return (
    <div className="w-full py-8 sm:py-10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-y border-black/[0.06] dark:border-white/[0.08] overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-ink-muted dark:text-slate-400">
              Rasmiy Hamkorlar & Sanoat Integratsiyasi
            </span>
          </div>
          <span className="text-xs text-ink-muted dark:text-slate-400 font-medium">
            NavDU startaplarini qo‘llab-quvvatlovchi korxona va fondlar
          </span>
        </div>
      </div>

      {/* Infinite Marquee Track */}
      <div className="relative flex overflow-x-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 32, ease: 'linear', repeat: Infinity }}
          className="flex items-center gap-12 sm:gap-16 shrink-0 pr-12 sm:pr-16"
        >
          {marqueeList.map((partner, index) => {
            const PartnerLogo = partner.component;
            return (
              <div 
                key={`${partner.id}-${index}`}
                className="flex items-center justify-center opacity-75 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 cursor-pointer text-slate-800 dark:text-slate-100 px-4 py-2 rounded-xl hover:bg-black/[0.03] dark:hover:bg-white/[0.05]"
                title={partner.name}
              >
                <PartnerLogo className="h-8 sm:h-9 w-auto" />
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};
