import React from 'react';
import { motion } from 'framer-motion';
import { SvgCheckCircle2, SvgArrowRight } from './icons/CustomIcons';

interface ProgramSectionProps {
  onOpenApply: () => void;
}

export const ProgramSection: React.FC<ProgramSectionProps> = ({ onOpenApply }) => {
  const weeks = [
    {
      num: '1-hafta',
      title: 'G‘oyani aniqlash & CustDev',
      desc: 'Mijozlar bilan 30+ intervyu o‘tkazish, aniq og‘riqli muammoni topish va noaniq farazlarni yo‘qotish.',
      tag: 'Muammo tahlili'
    },
    {
      num: '2-hafta',
      title: 'MVP qurish (Prototip)',
      desc: 'Mahsulotning eng muhim asosiy funksiyasini 7 kunda ishlab chiqish va birinchi foydalanuvchilar qo‘liga berish.',
      tag: 'Ishchi mahsulot'
    },
    {
      num: '3-hafta',
      title: 'Birinchi sotuvlar & Traksiya',
      desc: 'Mahsulot uchun birinchi to‘lovlarni qabul qilish, konversiyani o‘lchash va mijozlar fikrini yig‘ish.',
      tag: 'Mijozlar & Daromad'
    },
    {
      num: '4-hafta',
      title: 'Unit-iqtisodiyot & O‘sish',
      desc: 'Har bir foydalanuvchini jalb qilish narxi (CAC) va keltiradigan foydasini (LTV) hisoblab, modelni sozlash.',
      tag: 'Moliyaviy model'
    },
    {
      num: '5-hafta',
      title: 'Pitch Deck & Taqdimot',
      desc: 'Investorlar qarshisida 3 daqiqalik qisqa va ta’sirli nutq (Pitch) tayyorlash, mentorlar bilan repetitsiya.',
      tag: 'Pitching'
    },
    {
      num: '6-hafta',
      title: 'Demo Day & Investitsiyalar',
      desc: 'O‘zbekiston va xalqaro venchur fondlar, biznes-farishtalar hamda universitet rahbariyati oldida yirik taqdimot.',
      tag: 'Sarmoya jalb qilish'
    }
  ];

  return (
    <section className="py-20 sm:py-28 border-t border-black/[0.06] dark:border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Marker */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-4"
        >
          <span className="text-xs font-mono font-bold text-brand dark:text-blue-400 uppercase tracking-widest bg-brand/10 dark:bg-brand/20 px-3 py-1 rounded-full">
            01 / Dastur
          </span>
          <span className="text-xs text-ink-muted dark:text-slate-400">45 kunlik intensiv akseleratsiya</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6 lg:sticky lg:top-28"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-ink-text dark:text-white tracking-tight leading-tight">
              Olti hafta qanday o‘tadi?
            </h2>

            <p className="text-sm sm:text-base text-ink-muted dark:text-slate-300 leading-relaxed">
              UzCombinator NavDU — bu passiv ma’ruzalar emas. Bu har kuni ertalabdan kechgacha o‘z startapingiz ustida ishlash, mijozlar bilan muloqot qilish va daromadga chiqish degani.
            </p>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.07] dark:border-white/[0.08] space-y-3 shadow-2xs">
              <h4 className="font-bold text-sm text-ink-text dark:text-white">Dasturda ishtirok etuvchilar oladi:</h4>
              <ul className="space-y-2 text-xs text-ink-muted dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <SvgCheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Har bir jamoaga $1,000 boshlang‘ich stipendiya</span>
                </li>
                <li className="flex items-center gap-2">
                  <SvgCheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>24/7 zamonaviy kovorking va 3 mahal bepul ovqat</span>
                </li>
                <li className="flex items-center gap-2">
                  <SvgCheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Har haftalik tajribali ekspertlar bilan yopiq suhbatlar</span>
                </li>
                <li className="flex items-center gap-2">
                  <SvgCheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Demo Dayda $1,000,000 gacha investitsiya imkoniyati</span>
                </li>
              </ul>
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onOpenApply}
              className="px-6 py-3.5 rounded-2xl bg-brand hover:bg-brand-hover text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-brand/25 transition-all cursor-pointer"
            >
              <span>3-mavsumga ariza topshirish</span>
              <SvgArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>

          {/* Weeks Cards Timeline with Stagger */}
          <div className="lg:col-span-7 space-y-4">
            {weeks.map((w, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -4, borderColor: 'rgba(37, 99, 235, 0.4)' }}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-black/[0.06] dark:border-white/[0.08] shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group transition-colors"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-brand dark:text-blue-400">{w.num}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cream-200 dark:bg-white/[0.06] text-ink-muted dark:text-slate-300">
                      {w.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-ink-text dark:text-white group-hover:text-brand dark:group-hover:text-blue-400 transition-colors">
                    {w.title}
                  </h3>
                  <p className="text-xs text-ink-muted dark:text-slate-400 leading-relaxed">
                    {w.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
