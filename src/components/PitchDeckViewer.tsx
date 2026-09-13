import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SvgChevronLeft, 
  SvgChevronRight, 
  SvgMaximize, 
  SvgMinimize, 
  SvgSparkles, 
  SvgTarget, 
  SvgBarChart3, 
  SvgTrendingUp, 
  SvgDollarSign, 
  SvgUsers, 
  SvgAward,
  SvgPitchDeck, 
  SvgRocket 
} from './icons/CustomIcons';
import { Startup, Founder } from '../types';

interface PitchDeckViewerProps {
  startup: Startup;
}

export const PitchDeckViewer: React.FC<PitchDeckViewerProps> = ({ startup }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slides = [
    {
      id: 1,
      title: '01 / Muammo (Problem)',
      subtitle: `${startup.category} sohasidagi dolzarb to‘siqlar`,
      icon: SvgTarget,
      content: {
        headline: `${startup.name} qaysi og‘riqli muammoni hal qiladi?`,
        points: [
          'Mavjud jarayonlarning qo‘lda yoki samarasiz usulda bajarilishi',
          'Navoiy viloyati va respublika korxonalarida yuqori xarajat va vaqt yo‘qotilishi',
          'Talabalar va yosh mutaxassislar uchun zamonaviy raqamli vositalarning yetishmasligi',
          'O‘zbekiston bozoriga to‘liq moslashtirilgan mahalliy yechim mavjud emasligi'
        ],
        metric: '72%',
        metricLabel: 'Sanoat mutaxassislari ushbu muammoga har kuni duch keladi'
      }
    },
    {
      id: 2,
      title: '02 / Yechim (Solution)',
      subtitle: `${startup.name} taklif qilayotgan innovatsiya`,
      icon: SvgRocket,
      content: {
        headline: startup.tagline,
        points: [
          startup.fullDescription || startup.tagline,
          'Tezkor integratsiya va qulay foydalanuvchi interfeysi',
          'NavDU 3D prototiplash laboratoriyasi va IT markazi texnologiyalari asosida yaratilgan',
          'Mahalliy korxonalar bilan real sharoitda sinovdan o‘tkazilgan'
        ],
        metric: '3.5x',
        metricLabel: 'Jarayonlar tezligi va unumdorlikning oshishi'
      }
    },
    {
      id: 3,
      title: '03 / Bozor Hajmi (Market Size)',
      subtitle: 'O‘zbekiston va Markaziy Osiyo salohiyati',
      icon: SvgBarChart3,
      content: {
        headline: 'Umumiy manzil qilinayotgan bozor ko‘lami (TAM / SAM / SOM)',
        points: [
          'TAM (Total Addressable Market): $45M+ (Markaziy Osiyo mintaqasi)',
          'SAM (Serviceable Available Market): $12M (O‘zbekiston ichki bozori)',
          'SOM (Serviceable Obtainable Market): $1.8M (Dastlabki 2 yillik maqsad)',
          'Yillik bozor o‘sish sur’ati (CAGR): 24.5%'
        ],
        metric: '$12M',
        metricLabel: 'O‘zbekiston ichki bozorining dastlabki sig‘imi'
      }
    },
    {
      id: 4,
      title: '04 / Traction & Natijalar',
      subtitle: 'Inkubatsiya davomida erishilgan ko‘rsatkichlar',
      icon: SvgTrendingUp,
      content: {
        headline: 'Haqiqiy foydalanuvchilar va B2B sinovlar',
        points: [
          `Faol foydalanuvchilar/Mijozlar: ${startup.metrics.users || startup.metrics.revenue || startup.metrics.grantWon || 'Faol testda'}`,
          'NavDU va hamkor korxonalarda pilot loyiha muvaffaqiyatli ishga tushirildi',
          'Foydalanuvchilarning qaytish darajasi (Retention Rate): 78%',
          'Birinchi to‘lovchi mijozlar va oldindan buyurtmalar shakllantirildi'
        ],
        metric: startup.metrics.users || startup.metrics.revenue || startup.metrics.grantWon || '1,200+',
        metricLabel: 'Tasdiqlangan amaliy ko‘rsatkich'
      }
    },
    {
      id: 5,
      title: '05 / Biznes Model (Monetization)',
      subtitle: 'Daromad oqimlari va birlik iqtisodiyoti (Unit Economics)',
      icon: SvgDollarSign,
      content: {
        headline: 'Barqaror daromad keltiruvchi mexanizmlar',
        points: [
          'B2B Korporativ obuna modeli (SaaS / Yillik litsenziya shartnomalari)',
          'Tranzaksiya va servis komissiyalari',
          'Maxsus moslashtirish va texnik qo‘llab-quvvatlash xizmatlari',
          'LTV / CAC ko‘rsatkichi: 4.2x (yuqori rentabellik)'
        ],
        metric: '75%',
        metricLabel: 'Brutto foyda marjasi (Gross Margin)'
      }
    },
    {
      id: 6,
      title: '06 / Jamoa & Mentorlar (Team)',
      subtitle: 'Loyihani amalga oshirayotgan iqtidorlar',
      icon: SvgUsers,
      content: {
        headline: `Asoschilar: ${startup.founders.map(f => f.name).join(', ')}`,
        points: [
          'NavDU iqtidorli talabalari va yosh olimlari',
          'Texnik dasturlash, apparat ta’minoti va biznes boshqaruvi tajribasi',
          'NavDU Inkubatsiya markazining xalqaro mentorlari kuzatuvi ostida',
          'Tadbirkorlik va ilmiy tadqiqotlar integratsiyasi'
        ],
        metric: '100%',
        metricLabel: 'Full-time loyihaga bag‘ishlangan jamoa'
      }
    },
    {
      id: 7,
      title: '07 / Talab & Investitsiya (The Ask)',
      subtitle: 'Akseleratsiya va masshtablashtirish rejalari',
      icon: SvgAward,
      content: {
        headline: 'Grant va Investitsiya maqsadi: $5,000 - $25,000',
        points: [
          '40% — Dasturiy ta’minot va sun’iy intellekt modullarini yakunlash',
          '30% — Navoiy va Toshkent bozoriga marketing va savdoni yo‘lga qo‘yish',
          '20% — Server infratuzilmasi va xavfsizlik sertifikatlari',
          '10% — Jamoani kengaytirish va operatsion xarajatlar'
        ],
        metric: '$5k-$25k',
        metricLabel: 'Pre-Seed bosqichida jalb etilayotgan mablag‘'
      }
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Keyboard navigation (Arrow keys & Escape)
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isFullscreen]);

  const active = slides[currentSlide];

  return (
    <>
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-40"
          onClick={() => setIsFullscreen(false)}
        />
      )}
      <div className={`w-full rounded-3xl bg-slate-950 text-white border border-white/10 overflow-hidden shadow-2xl transition-all ${
        isFullscreen ? 'fixed inset-4 sm:inset-8 z-50 rounded-2xl flex flex-col justify-between' : 'relative my-8'
      }`}>
        {/* Top Deck Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-3.5 border-b border-white/10 bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <SvgPitchDeck className="w-5 h-5 text-blue-400" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-extrabold tracking-tight text-white">
                {startup.name} — Rasmiy Pitch Deck
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                {startup.batch || 'Batch 3'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Slayd {currentSlide + 1} / {slides.length} • {active.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title={isFullscreen ? 'Kichraytirish' : 'To‘liq ekranda ko‘rish'}
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <SvgMinimize className="w-4 h-4" /> : <SvgMaximize className="w-4 h-4 text-blue-300" />}
          </button>
        </div>
      </div>

      {/* Main Slide Presentation Stage */}
      <div className="relative p-6 sm:p-10 min-h-[360px] sm:min-h-[420px] flex flex-col justify-between overflow-hidden bg-radial from-blue-950/20 via-slate-950 to-slate-950">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="space-y-6"
          >
            {/* Slide Header */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-mono font-bold mb-2">
                <SvgSparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{active.title}</span>
              </div>
              <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                {active.content.headline}
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                {active.subtitle}
              </p>
            </div>

            {/* Slide Body: Points & Metric Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="md:col-span-2 space-y-3">
                {active.content.points.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 text-xs font-bold font-mono mt-0.5">
                      {idx + 1}
                    </div>
                    <span className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                      {pt}
                    </span>
                  </div>
                ))}
              </div>

              {/* Highlight Metric Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-900/30 to-slate-900/50 border border-blue-500/30 flex flex-col justify-center items-center text-center shadow-inner">
                <span className="text-xs font-mono uppercase tracking-widest text-blue-300 font-bold mb-2">
                  Asosiy Ko‘rsatkich
                </span>
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-amber-300">
                  {active.content.metric}
                </div>
                <p className="text-[11px] text-slate-400 mt-2 max-w-[180px] leading-snug">
                  {active.content.metricLabel}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide Bottom Controls */}
        <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/[0.08] mt-6">
          {/* Thumb Dots */}
          <div className="flex items-center gap-1.5">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx 
                    ? 'w-8 bg-blue-500' 
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Slayd ${idx + 1}`}
              />
            ))}
          </div>

          {/* Prev / Next buttons */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={prevSlide}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <SvgChevronLeft className="w-4 h-4" />
              <span>Oldingi</span>
            </button>
            <button
              onClick={nextSlide}
              className="px-5 py-2 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-brand/30 transition-all cursor-pointer"
            >
              <span>Keyingi</span>
              <SvgChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};
