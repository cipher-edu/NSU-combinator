import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SvgChevronLeft, 
  SvgChevronRight, 
  SvgArrowRight, 
  SvgSparkles, 
  SvgAward, 
  SvgBuilding2, 
  SvgCalendar, 
  SvgCheckCircle2, 
  SvgRocket, 
  SvgZap, 
  SvgMaximize, 
  SvgMinimize 
} from './icons/CustomIcons';

import { BackendHeroSlide } from '../api/cmsApi';

interface Slide {
  id: number;
  badge: string;
  badgeIcon: React.ReactNode;
  title: string;
  titleAccent: string;
  subtitle: string;
  description: string;
  highlights: string[];
  ctaText: string;
  secondaryCtaText: string;
  ctaAction: 'apply' | 'events' | 'team' | 'portfolio';
  image: string;
}

interface HeroSliderProps {
  onOpenApply: () => void;
  setActiveTab: (tab: string) => void;
  customSlides?: BackendHeroSlide[];
}

const DEFAULT_SLIDES_DATA = [
  {
    id: 1,
    badge: 'Navoiy Davlat Universiteti',
    badgeIcon: <SvgBuilding2 className="w-3.5 h-3.5 text-blue-400" />,
    title: 'Inkubatsiya va Akseleratsiya',
    titleAccent: 'Markazi',
    subtitle: 'G‘oyadan Investitsiyagacha • 45 Kunlik Dastur',
    description: 'Universitet talabalari, yosh olimlari va tadqiqotchilarining innovatsion loyihalarini qo‘llab-quvvatlash uchun 24/7 kovorking, 3D prototiplash laboratoriyasi va $5,000 gacha dastlabki startap grantlari.',
    highlights: ['100+ o‘rinli zamonaviy Kovorking', '3D Prototyping laboratoriyasi', '$5,000 gacha grantlar'],
    ctaText: 'Akseleratsiyaga ariza topshirish',
    secondaryCtaText: 'Dastur haqida batafsil',
    ctaAction: 'apply' as const,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    badge: 'Talabalar Hamjamiyati',
    badgeIcon: <SvgRocket className="w-3.5 h-3.5 text-indigo-400" size={14} />,
    title: 'NavDU Startap',
    titleAccent: 'Klubi',
    subtitle: 'Iqtidorli Yoshlar Platformasi • Co-Founder Matching',
    description: 'Universitetning eng faol talabalari, dasturchilari, dizaynerlari va yosh mutaxassislarini birlashtiruvchi erkin maydon. Birgalikda jamoa shakllantiring va haftalik meetup hamda vorkshoplarda qatnashing.',
    highlights: ['1,500+ Faol a’zolar', 'Haftalik yopiq meetup’lar', 'Co-Founder matching tizimi'],
    ctaText: 'Startap klubiga qo‘shilish',
    secondaryCtaText: 'Jamoa qidirish',
    ctaAction: 'team' as const,
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1600&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    badge: 'Yillik Universitet Hakatoni',
    badgeIcon: <SvgAward className="w-3.5 h-3.5 text-amber-400" />,
    title: 'NavDU InnoHack',
    titleAccent: '2026',
    subtitle: '60 000 000 so‘m mukofot jamg‘armasi • 48 Soatlik bellashuv',
    description: 'Universitet miqyosidagi yillik eng katta texnologik bellashuv! AI va Ta’lim, Qishloq xo‘jaligi texnologiyalari, Yashil energetika va Sanoat avtomatizatsiyasi bo‘yicha kuch sinashing.',
    highlights: ['48 Soat uzluksiz hakaton', '60 mln so‘m sovrin', 'Respublika yetakchi mentorlari'],
    ctaText: 'Hakatonga ro‘yxatdan o‘tish',
    secondaryCtaText: 'Tadbirlar kalendari',
    ctaAction: 'events' as const,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    badge: 'Sanoat Bilan Hamkorlik',
    badgeIcon: <SvgZap className="w-3.5 h-3.5 text-emerald-400" />,
    title: 'NKMK va Korxonalar Bilan',
    titleAccent: 'B2B Hamkorlik',
    subtitle: 'Haqiqiy Bozor va Investitsiyalar • Sanoat integratsiyasi',
    description: 'Navoiy kon-metallurgiya kombinati (NKMK), Navoiyazot va viloyat quyosh fotoelektr stansiyalari talabalarning innovatsion startaplarini to‘g‘ridan-to‘g‘ri amaliyotga joriy qiladi va sarmoyalaydi.',
    highlights: ['B2B Shartnomalar', 'NKMK Ishlab chiqarish amaliyoti', '$1M gacha sarmoya fondi'],
    ctaText: 'Startaplar portfelini ko‘rish',
    secondaryCtaText: 'Demo Day natijalari',
    ctaAction: 'portfolio' as const,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&auto=format&fit=crop&q=80',
  }
];

export const HeroSlider: React.FC<HeroSliderProps> = ({ onOpenApply, setActiveTab, customSlides }) => {
  const getBadgeIcon = (action: string) => {
    if (action === 'events') return <SvgAward className="w-3.5 h-3.5 text-amber-400" />;
    if (action === 'team') return <SvgRocket className="w-3.5 h-3.5 text-indigo-400" size={14} />;
    if (action === 'portfolio') return <SvgZap className="w-3.5 h-3.5 text-emerald-400" />;
    return <SvgBuilding2 className="w-3.5 h-3.5 text-blue-400" />;
  };

  const slides: Slide[] = (customSlides && customSlides.length > 0)
    ? customSlides.map(cs => ({
        id: cs.id,
        badge: cs.badge,
        badgeIcon: getBadgeIcon(cs.cta_action),
        title: cs.title,
        titleAccent: cs.title_accent,
        subtitle: cs.subtitle,
        description: cs.description,
        highlights: cs.highlights && Array.isArray(cs.highlights) ? cs.highlights : [],
        ctaText: cs.cta_text,
        secondaryCtaText: cs.secondary_cta_text,
        ctaAction: cs.cta_action,
        image: cs.image_url,
      }))
    : DEFAULT_SLIDES_DATA;

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Auto slide every 6 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length]);

  // Fullscreen event listener
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
        }).catch((err) => {
          console.warn('Exit fullscreen failed:', err);
        });
      }
    }
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    setTouchStart(null);
  };

  const currentSlide = slides[current];

  const handleAction = (action: Slide['ctaAction']) => {
    if (action === 'apply') {
      onOpenApply();
    } else if (action === 'events') {
      setActiveTab('events');
    } else if (action === 'team') {
      setActiveTab('team');
    } else if (action === 'portfolio') {
      setActiveTab('portfolio');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div 
      className="relative w-full h-screen h-[100dvh] min-h-[640px] overflow-hidden bg-slate-950 border-b border-black/[0.08] select-none flex flex-col justify-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slide Visuals */}
      <div className="relative w-full h-full flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-0 overflow-hidden"
          >
            {/* Real Full-Quality Photograph - Clearly visible with vivid contrast */}
            <img 
              src={currentSlide.image} 
              alt={currentSlide.title} 
              className="w-full h-full object-cover object-center brightness-[0.88] contrast-[1.05]"
            />

            {/* Subtle, reduced blue tint:
                - Left side has a gentle dark vignette (70%) so text is 100% crisp
                - Center has very light blue tint (15-20%) so the photo is clearly visible
                - Right side is fully transparent, showcasing the raw photo! */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/35 to-transparent" />
            
            {/* Very gentle subtle brand-blue ambient glow on the left, not covering the photo */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/25 via-transparent to-transparent pointer-events-none" />

            {/* Bottom soft gradient to highlight controls & indicators */}
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Content Box */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-24 sm:pb-28 w-full">
          <div className="max-w-3xl space-y-5 sm:space-y-6">
            
            {/* Badge */}
            <motion.div 
              key={`badge-${currentSlide.id}`}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-lg"
            >
              <span>{currentSlide.badgeIcon}</span>
              <span className="text-white">{currentSlide.badge}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-ping ml-1" />
            </motion.div>

            {/* Title & Subtitle */}
            <motion.div 
              key={`title-${currentSlide.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18 }}
              className="space-y-2.5"
            >
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12] drop-shadow-md">
                {currentSlide.title}{' '}
                <span className="text-blue-400 inline-block relative">
                  {currentSlide.titleAccent}
                </span>
              </h2>
              <p className="text-xs sm:text-sm font-bold text-blue-200 uppercase tracking-wider flex items-center gap-1.5 drop-shadow-sm">
                <SvgSparkles className="w-4 h-4 text-amber-300 inline" />
                <span>{currentSlide.subtitle}</span>
              </p>
            </motion.div>

            {/* Description */}
            <motion.p 
              key={`desc-${currentSlide.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.26 }}
              className="text-sm sm:text-base lg:text-lg text-slate-100/95 leading-relaxed max-w-2xl font-normal drop-shadow-sm"
            >
              {currentSlide.description}
            </motion.p>

            {/* Highlight Badges */}
            <motion.div 
              key={`hl-${currentSlide.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.34 }}
              className="flex flex-wrap gap-2.5 pt-1"
            >
              {currentSlide.highlights.map((h, i) => (
                <span 
                  key={i} 
                  className="px-3.5 py-1.5 rounded-xl bg-black/35 backdrop-blur-md border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <SvgCheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{h}</span>
                </span>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              key={`actions-${currentSlide.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.42 }}
              className="pt-3 flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 12px 25px -4px rgba(37, 99, 235, 0.45)' }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleAction(currentSlide.ctaAction)}
                className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-brand hover:bg-brand-hover text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-brand/30 flex items-center gap-2.5 transition-all cursor-pointer"
              >
                <span>{currentSlide.ctaText}</span>
                <SvgArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.25)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (currentSlide.id === 1) setActiveTab('program');
                  else if (currentSlide.id === 2) setActiveTab('team');
                  else if (currentSlide.id === 3) setActiveTab('events');
                  else if (currentSlide.id === 4) setActiveTab('demoday');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm backdrop-blur-md border border-white/25 shadow-sm transition-all cursor-pointer"
              >
                {currentSlide.secondaryCtaText}
              </motion.button>
            </motion.div>

          </div>
        </div>

        {/* Navigation & Fullscreen Controls */}
        <div className="absolute right-4 sm:right-8 bottom-20 sm:bottom-10 z-20 flex items-center gap-2">
          {/* Native Fullscreen Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={toggleFullscreen}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/25 text-white flex items-center justify-center transition-colors shadow-lg active:scale-95 cursor-pointer"
            title={isFullscreen ? "To'liq ekrandan chiqish" : "To'liq ekran rejimi (Fullscreen)"}
            aria-label="To'liq ekran rejimi"
          >
            {isFullscreen ? (
              <SvgMinimize className="w-5 h-5 text-amber-300" />
            ) : (
              <SvgMaximize className="w-5 h-5" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={prevSlide}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/25 text-white flex items-center justify-center transition-colors shadow-lg active:scale-95 cursor-pointer"
            aria-label="Oldingi slayd"
          >
            <SvgChevronLeft className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={nextSlide}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/25 text-white flex items-center justify-center transition-colors shadow-lg active:scale-95 cursor-pointer"
            aria-label="Keyingi slayd"
          >
            <SvgChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Indicator Dots & Progress Bars */}
        <div className="absolute left-4 sm:left-8 bottom-20 sm:bottom-10 z-20 flex items-center gap-2">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrent(idx)}
              className="group relative h-2.5 rounded-full transition-all overflow-hidden cursor-pointer"
              style={{ width: current === idx ? '48px' : '16px' }}
              aria-label={`Slayd ${idx + 1}`}
            >
              <div className={`w-full h-full rounded-full ${current === idx ? 'bg-white' : 'bg-white/35 group-hover:bg-white/55'} transition-colors`} />
              {current === idx && !isPaused && (
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 6, ease: 'linear' }}
                  className="absolute inset-0 bg-brand rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        {/* Animated Scroll-Down Prompt */}
        <motion.button
          onClick={() => {
            document.getElementById('main-hero-content')?.scrollIntoView({ behavior: 'smooth' });
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="absolute left-1/2 -translate-x-1/2 bottom-20 sm:bottom-8 z-30 flex flex-col items-center gap-1.5 text-white/80 hover:text-white transition-colors cursor-pointer group"
          aria-label="Keyingi ma'lumotlarni ko‘rish"
        >
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-200 group-hover:text-white transition-colors flex items-center gap-1">
            <span>Pastga suring</span>
            <svg className="w-3 h-3 animate-bounce text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
          </span>
          <div className="w-5 h-8 rounded-full border-2 border-white/40 group-hover:border-white flex items-start justify-center p-1 transition-colors backdrop-blur-xs bg-black/20">
            <motion.div 
              animate={{ y: [0, 10, 0], opacity: [1, 0.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              className="w-1.5 h-1.5 rounded-full bg-brand shadow-xs"
            />
          </div>
        </motion.button>

      </div>
    </div>
  );
};
