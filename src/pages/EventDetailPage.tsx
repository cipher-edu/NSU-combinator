import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  SvgArrowLeft, 
  SvgCalendar, 
  SvgClock, 
  SvgMapPin, 
  SvgTrophy, 
  SvgUsers, 
  SvgCheckCircle2, 
  SvgAlertCircle, 
  SvgShare, 
  SvgCheck, 
  SvgQrCode, 
  SvgDownload, 
  SvgSend,
  SvgSparkles
} from '../components/icons/CustomIcons';
import { EventItem } from '../types';

interface EventDetailPageProps {
  events: EventItem[];
  onRegisterSuccess: (eventId: string) => void;
}

export const EventDetailPage: React.FC<EventDetailPageProps> = ({
  events,
  onRegisterSuccess
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const event = events.find(e => e.id === id);

  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    faculty: '',
    phone: '',
    telegram: '',
    teamName: '',
    idea: ''
  });

  const [ticketData, setTicketData] = useState<{
    ticketId: string;
    name: string;
    registeredAt: string;
  } | null>(null);

  if (!event) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-16 h-16 rounded-2xl bg-brand/10 text-brand flex items-center justify-center mb-4">
          <SvgAlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-ink-text dark:text-white">Tadbir topilmadi</h2>
        <p className="text-sm text-ink-muted dark:text-slate-400 mt-2 max-w-md">
          Siz qidirayotgan tadbir mavjud emas yoki o‘chirilgan bo‘lishi mumkin.
        </p>
        <Link 
          to="/events" 
          className="mt-6 px-6 py-3 rounded-xl bg-brand text-white font-bold text-xs shadow-md shadow-brand/25 cursor-pointer"
        >
          Barcha tadbirlarga qaytish
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    const code = `NAV-${event.type.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketData({
      ticketId: code,
      name: formData.name.trim(),
      registeredAt: new Date().toLocaleDateString('uz-UZ')
    });

    onRegisterSuccess(event.id);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2563EB', '#10B981', '#F59E0B']
    });
  };

  const relatedEvents = events.filter(e => e.id !== event.id).slice(0, 3);

  return (
    <div className="min-h-screen pb-24 pt-4 sm:pt-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb & Back */}
        <div className="flex items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-xs text-ink-muted dark:text-slate-400">
            <Link to="/" className="hover:text-brand transition-colors font-medium">Bosh sahifa</Link>
            <span>/</span>
            <Link to="/events" className="hover:text-brand transition-colors font-medium">Tadbirlar & Hakatonlar</Link>
            <span>/</span>
            <span className="text-ink-text dark:text-white font-bold truncate max-w-[200px] sm:max-w-none">{event.title}</span>
          </nav>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 text-xs font-semibold text-ink-muted dark:text-slate-400 hover:text-ink-text dark:hover:text-white hover:bg-cream-100 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
          >
            <SvgArrowLeft className="w-3.5 h-3.5" />
            <span>Orqaga</span>
          </button>
        </div>

        {/* Hero Event Card */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.08] dark:border-white/[0.08] shadow-sm space-y-6 relative overflow-hidden">
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3.5 py-1 rounded-full bg-brand text-white text-xs font-bold shadow-xs">
                {event.type}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800/40">
                {event.mode}
              </span>
              {event.prize && (
                <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 text-xs font-black border border-amber-300 dark:border-amber-800/40 flex items-center gap-1">
                  <SvgTrophy className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>{event.prize}</span>
                </span>
              )}
            </div>

            <button
              onClick={handleShare}
              className="px-3.5 py-1.5 rounded-xl bg-cream-100 dark:bg-slate-800 hover:bg-cream-200 dark:hover:bg-slate-700 border border-black/10 dark:border-white/10 text-xs font-bold text-ink-text dark:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <SvgCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Nusxalandi</span>
                </>
              ) : (
                <>
                  <SvgShare className="w-3.5 h-3.5 text-ink-muted dark:text-slate-400" />
                  <span>Ulashish</span>
                </>
              )}
            </button>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-ink-text dark:text-white tracking-tight leading-[1.15]">
            {event.title}
          </h1>

          <p className="text-base sm:text-lg text-ink-muted dark:text-slate-300 leading-relaxed max-w-3xl">
            {event.description}
          </p>

          {/* Quick Details Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-cream-100/80 dark:bg-slate-800/80 border border-black/[0.05] dark:border-white/[0.06]">
              <SvgCalendar className="w-5 h-5 text-brand shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-ink-muted dark:text-slate-400 block">Sana va Vaqt</span>
                <span className="text-sm font-bold text-ink-text dark:text-white">{event.date} • {event.time}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-cream-100/80 dark:bg-slate-800/80 border border-black/[0.05] dark:border-white/[0.06]">
              <SvgMapPin className="w-5 h-5 text-brand shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-ink-muted dark:text-slate-400 block">Joylashuv</span>
                <span className="text-sm font-bold text-ink-text dark:text-white">{event.location}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-cream-100/80 dark:bg-slate-800/80 border border-black/[0.05] dark:border-white/[0.06]">
              <SvgUsers className="w-5 h-5 text-brand shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-ink-muted dark:text-slate-400 block">Ro‘yxatdan o‘tganlar</span>
                <span className="text-sm font-bold text-brand dark:text-blue-400">{event.registeredCount} nafar ishtirokchi</span>
              </div>
            </div>
          </div>

        </div>

        {/* 2-Column Section: Agenda & Registration Form */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Left: Agenda & Speakers (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Agenda */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.08] dark:border-white/[0.08] shadow-sm space-y-5">
              <h3 className="text-xl font-black text-ink-text dark:text-white flex items-center gap-2">
                <SvgClock className="w-5 h-5 text-brand" />
                <span>Tadbir dasturi (Kun tartibi)</span>
              </h3>

              <div className="space-y-3 pt-2">
                {event.agenda.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-3.5 rounded-2xl bg-cream-100/70 dark:bg-slate-800/70 border border-black/[0.04] dark:border-white/[0.06]">
                    <div className="w-7 h-7 rounded-xl bg-brand/10 dark:bg-brand/20 text-brand dark:text-blue-400 font-black text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Speakers / Mentors if available */}
            {event.speakers && event.speakers.length > 0 && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.08] dark:border-white/[0.08] shadow-sm space-y-4">
                <h3 className="text-lg font-black text-ink-text dark:text-white flex items-center gap-2">
                  <SvgUsers className="w-5 h-5 text-brand" />
                  <span>Hakamlar va Ekspertlar</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {event.speakers.map((sp, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-cream-100 dark:bg-slate-800 border border-black/[0.05] dark:border-white/[0.06] flex items-center gap-3">
                      <img 
                        src={sp.avatar} 
                        alt={sp.name} 
                        className="w-12 h-12 rounded-xl object-cover border border-black/10 dark:border-white/10 shadow-xs"
                      />
                      <div>
                        <h5 className="font-extrabold text-xs text-ink-text dark:text-white">{sp.name}</h5>
                        <span className="text-[11px] text-ink-muted dark:text-slate-400">{sp.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right: Registration Form & Ticket Badge (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.08] dark:border-white/[0.08] shadow-sm space-y-5">
              <h3 className="text-xl font-black text-ink-text dark:text-white flex items-center gap-2">
                <SvgSparkles className="w-5 h-5 text-brand" />
                <span>Ro‘yxatdan o‘tish</span>
              </h3>

              {ticketData ? (
                /* Generated Virtual Badge / Ticket */
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-6 rounded-3xl bg-gradient-to-br from-blue-600 via-brand to-indigo-700 text-white space-y-4 shadow-xl shadow-brand/30 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full text-white">
                      NavDU Ishtirokchi Badji
                    </span>
                    <SvgQrCode className="w-7 h-7 text-white/90" />
                  </div>

                  <div>
                    <h4 className="text-xl font-black tracking-tight">{ticketData.name}</h4>
                    <p className="text-xs text-blue-100 mt-0.5">{event.title}</p>
                  </div>

                  <div className="pt-3 border-t border-white/20 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-blue-200 block">Chipta ID:</span>
                      <span className="font-mono-num font-black text-amber-300">{ticketData.ticketId}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-blue-200 block">Sana:</span>
                      <span className="font-bold">{event.date}</span>
                    </div>
                  </div>

                  <div className="pt-1 text-[11px] text-white/80 italic">
                    Ushbu chipta ro‘yxatga olindi. Tadbir kuni NavDU Inkubatsiya markazida ko‘rsatishingiz kifoya!
                  </div>

                  <button
                    onClick={() => alert(`Chipta yuklab olinmoqda: ${ticketData.ticketId}`)}
                    className="w-full py-2.5 rounded-xl bg-white text-brand font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:bg-cream-100 transition-colors cursor-pointer"
                  >
                    <SvgDownload className="w-3.5 h-3.5" />
                    <span>Chiptani saqlab olish</span>
                  </button>
                </motion.div>
              ) : (
                /* Interactive Form */
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div>
                    <label className="text-xs font-bold text-ink-muted dark:text-slate-300 block mb-1">Ism va familiyangiz</label>
                    <input 
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Masalan: Sardor Komilov"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs focus:outline-none focus:border-brand bg-cream-100/50 dark:bg-slate-800 text-ink-text dark:text-white placeholder:text-ink-muted dark:placeholder:text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-ink-muted dark:text-slate-300 block mb-1">Fakultet va kursingiz</label>
                    <input 
                      type="text"
                      required
                      value={formData.faculty}
                      onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                      placeholder="Masalan: Matematika-informatika, 3-kurs"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs focus:outline-none focus:border-brand bg-cream-100/50 dark:bg-slate-800 text-ink-text dark:text-white placeholder:text-ink-muted dark:placeholder:text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-ink-muted dark:text-slate-300 block mb-1">Telefon raqamingiz</label>
                    <input 
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+998 90 123 45 67"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs focus:outline-none focus:border-brand bg-cream-100/50 dark:bg-slate-800 text-ink-text dark:text-white placeholder:text-ink-muted dark:placeholder:text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-ink-muted dark:text-slate-300 block mb-1">Telegram foydalanuvchi nomi</label>
                    <input 
                      type="text"
                      value={formData.telegram}
                      onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                      placeholder="@username"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs focus:outline-none focus:border-brand bg-cream-100/50 dark:bg-slate-800 text-ink-text dark:text-white placeholder:text-ink-muted dark:placeholder:text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-ink-muted dark:text-slate-300 block mb-1">Jamoangiz yoki loyiha g‘oyangiz (ixtiyoriy)</label>
                    <input 
                      type="text"
                      value={formData.idea}
                      onChange={(e) => setFormData({ ...formData, idea: e.target.value })}
                      placeholder="Masalan: EcoSmart AI yoki Jamoasiz"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs focus:outline-none focus:border-brand bg-cream-100/50 dark:bg-slate-800 text-ink-text dark:text-white placeholder:text-ink-muted dark:placeholder:text-slate-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs shadow-md shadow-brand/25 flex items-center justify-center gap-2 transition-all mt-2 cursor-pointer"
                  >
                    <SvgSend className="w-4 h-4" />
                    <span>Ro‘yxatdan o‘tish va Chipta olish</span>
                  </button>
                </form>
              )}

            </div>

          </div>

        </div>

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <div className="pt-8 space-y-4">
            <h3 className="text-xl font-black text-ink-text dark:text-white">Yaqinlashib kelayotgan boshqa tadbirlar</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedEvents.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/event/${rel.id}`}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-black/[0.07] dark:border-white/[0.08] hover:border-brand/40 dark:hover:border-brand/50 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-brand uppercase tracking-wider block">
                      {rel.type} • {rel.mode}
                    </span>
                    <h4 className="font-bold text-sm text-ink-text dark:text-white group-hover:text-brand transition-colors line-clamp-2">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-ink-muted dark:text-slate-400">{rel.date}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-xs font-bold">
                    <span className="text-brand dark:text-blue-400 flex items-center gap-1.5">
                      <SvgUsers className="w-3.5 h-3.5" />
                      <span>{rel.registeredCount} kishi</span>
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">Batafsil &rarr;</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
