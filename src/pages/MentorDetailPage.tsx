import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  SvgArrowLeft, 
  SvgStar, 
  SvgCalendar, 
  SvgClock, 
  SvgCheckCircle2, 
  SvgAlertCircle, 
  SvgSend, 
  SvgBuilding2, 
  SvgSparkles,
  SvgMessageSquare,
  SvgVideo
} from '../components/icons/CustomIcons';
import { Mentor } from '../types';

interface MentorDetailPageProps {
  mentors: Mentor[];
}

export const MentorDetailPage: React.FC<MentorDetailPageProps> = ({ mentors }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const mentor = mentors.find(m => m.id === id);

  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [bookingName, setBookingName] = useState('');
  const [bookingStartup, setBookingStartup] = useState('');
  const [bookingProblem, setBookingProblem] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  if (!mentor) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-16 h-16 rounded-2xl bg-brand/10 text-brand flex items-center justify-center mb-4">
          <SvgAlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-ink-text dark:text-white">Mentor topilmadi</h2>
        <p className="text-sm text-ink-muted dark:text-slate-400 mt-2 max-w-md">
          Siz qidirayotgan mentor profili mavjud emas yoki o‘chirilgan bo‘lishi mumkin.
        </p>
        <Link 
          to="/mentors" 
          className="mt-6 px-6 py-3 rounded-xl bg-brand text-white font-bold text-xs shadow-md shadow-brand/25 cursor-pointer"
        >
          Mentorlar ro‘yxatiga qaytish
        </Link>
      </div>
    );
  }

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !bookingName.trim() || !bookingProblem.trim()) return;

    setBookingConfirmed(true);
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#2563EB', '#38BDF8', '#10B981']
    });
  };

  const relatedMentors = mentors.filter(m => m.id !== mentor.id).slice(0, 3);

  return (
    <div className="min-h-screen pb-24 pt-4 sm:pt-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-xs text-ink-muted dark:text-slate-400">
            <Link to="/" className="hover:text-brand transition-colors font-medium">Bosh sahifa</Link>
            <span>/</span>
            <Link to="/mentors" className="hover:text-brand transition-colors font-medium">Mentorlar</Link>
            <span>/</span>
            <span className="text-ink-text dark:text-white font-bold truncate max-w-[200px] sm:max-w-none">{mentor.name}</span>
          </nav>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 text-xs font-semibold text-ink-muted dark:text-slate-400 hover:text-ink-text dark:hover:text-white hover:bg-cream-100 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
          >
            <SvgArrowLeft className="w-3.5 h-3.5" />
            <span>Orqaga</span>
          </button>
        </div>

        {/* Mentor Profile Header Card */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.08] dark:border-white/[0.08] shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6 relative overflow-hidden">
          <img 
            src={mentor.avatar} 
            alt={mentor.name} 
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover border-2 border-brand/20 dark:border-brand/40 shadow-md shrink-0"
          />

          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-ink-text dark:text-white">{mentor.name}</h1>
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800/40">
                <SvgStar className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{mentor.rating.toFixed(1)}</span>
                <span className="text-amber-700 dark:text-amber-400 font-normal">({mentor.reviewsCount} sharh)</span>
              </div>
            </div>

            <p className="text-sm sm:text-base font-bold text-brand dark:text-blue-400">{mentor.title}</p>
            <p className="text-xs text-ink-muted dark:text-slate-400 flex items-center gap-1.5">
              <SvgBuilding2 className="w-3.5 h-3.5 text-ink-muted dark:text-slate-400" />
              <span>{mentor.organization}</span>
            </p>

            {/* Expertise Pills */}
            <div className="pt-2 flex flex-wrap gap-2">
              {mentor.expertise.map((exp, idx) => (
                <span key={idx} className="px-3 py-1 rounded-xl bg-cream-100 dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] text-ink-text dark:text-slate-300 text-xs font-semibold">
                  {exp}
                </span>
              ))}
            </div>
          </div>

          {mentor.telegram && (
            <a
              href={`https://t.me/${mentor.telegram.replace('@', '')}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-brand dark:hover:bg-brand hover:text-white text-brand dark:text-blue-400 border border-brand/20 dark:border-blue-800/40 text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer"
            >
              <SvgSend className="w-3.5 h-3.5" />
              <span>Telegramda yozish</span>
            </a>
          )}
        </div>

        {/* 2-Column: Bio & 1-on-1 Booking Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Bio and Advice Area (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.08] dark:border-white/[0.08] shadow-sm space-y-4">
              <h3 className="text-lg font-black text-ink-text dark:text-white flex items-center gap-2">
                <SvgSparkles className="w-5 h-5 text-brand" />
                <span>Mentor haqida va tajriba</span>
              </h3>
              <p className="text-sm sm:text-base text-ink-muted dark:text-slate-300 leading-relaxed font-normal whitespace-pre-line">
                {mentor.bio}
              </p>

              <div className="p-4 rounded-2xl bg-cream-100 dark:bg-slate-800/80 border border-black/[0.05] dark:border-white/[0.06] space-y-2 text-xs">
                <h5 className="font-bold text-ink-text dark:text-white">Ushbu mentor bilan qaysi masalalarni muhokama qilish mumkin?</h5>
                <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 list-disc list-inside">
                  <li>Startap g‘oyasining texnik va iqtisodiy asosliligini tekshirish</li>
                  <li>Dastlabki MVP arxitekturasi va texnologik stakni tanlash</li>
                  <li>Katta sanoat korxonalari (NKMK, Navoiyazot) bilan B2B muzokaralar</li>
                  <li>Xalqaro akseleratorlar va grantlarga hujjat topshirish</li>
                </ul>
              </div>
            </div>

            {/* Testimonials */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.08] dark:border-white/[0.08] shadow-sm space-y-4">
              <h3 className="text-lg font-black text-ink-text dark:text-white flex items-center gap-2">
                <SvgMessageSquare className="w-5 h-5 text-brand" />
                <span>Startaperlarning fikrlari</span>
              </h3>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-cream-100/70 dark:bg-slate-800/70 border border-black/[0.05] dark:border-white/[0.06] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-ink-text dark:text-white">Jamshid N. (AgroSmart)</span>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <SvgStar key={i} className="w-3 h-3 fill-amber-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    "Mentor bilan 45 daqiqalik sessiya bizning IoT datchiklarimiz narxini 2 barobar arzonlashtirish yo‘lini ko‘rsatib berdi. Amaliy tajribaga ega inson!"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Widget (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.08] dark:border-white/[0.08] shadow-sm space-y-5">
              <h3 className="text-xl font-black text-ink-text dark:text-white flex items-center gap-2">
                <SvgCalendar className="w-5 h-5 text-brand" />
                <span>1-on-1 Sessiya bron qilish</span>
              </h3>

              {bookingConfirmed ? (
                <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-center space-y-3">
                  <SvgCheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <h4 className="font-extrabold text-sm text-emerald-900 dark:text-emerald-200">Sessiya muvaffaqiyatli bron qilindi!</h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                    {mentor.name} bilan uchrashuv vaqti: <strong>{selectedSlot}</strong>.<br />
                    Google Meet havolasi va tasdiqnoma sizning Telegramingizga yuborildi.
                  </p>
                  <button
                    onClick={() => {
                      setBookingConfirmed(false);
                      setSelectedSlot('');
                    }}
                    className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
                  >
                    Boshqa vaqtni ko‘rish
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-ink-muted dark:text-slate-300 block mb-1.5">Bo‘sh vaqt slotini tanlang:</label>
                    <div className="space-y-1.5">
                      {mentor.availableSlots.map((slot, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`w-full p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                            selectedSlot === slot
                              ? 'bg-brand text-white border-brand shadow-sm shadow-brand/25'
                              : 'bg-cream-100 dark:bg-slate-800 text-ink-text dark:text-slate-200 border-black/[0.07] dark:border-white/[0.08] hover:border-brand/30 dark:hover:border-brand/50'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <SvgClock className="w-3.5 h-3.5" />
                            <span>{slot}</span>
                          </span>
                          {selectedSlot === slot && <SvgCheckCircle2 className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-ink-muted dark:text-slate-300 block mb-1">Ismingiz va familiyangiz</label>
                    <input 
                      type="text"
                      required
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      placeholder="Masalan: Bekzod Aliyev"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs focus:outline-none focus:border-brand bg-cream-100/50 dark:bg-slate-800 text-ink-text dark:text-white placeholder:text-ink-muted dark:placeholder:text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-ink-muted dark:text-slate-300 block mb-1">Startap yoki g‘oya nomi</label>
                    <input 
                      type="text"
                      value={bookingStartup}
                      onChange={(e) => setBookingStartup(e.target.value)}
                      placeholder="Masalan: EcoSmart AI"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs focus:outline-none focus:border-brand bg-cream-100/50 dark:bg-slate-800 text-ink-text dark:text-white placeholder:text-ink-muted dark:placeholder:text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-ink-muted dark:text-slate-300 block mb-1">Muhokama qilmoqchi bo‘lgan savolingiz</label>
                    <textarea 
                      required
                      rows={3}
                      value={bookingProblem}
                      onChange={(e) => setBookingProblem(e.target.value)}
                      placeholder="Qaysi muammo yoki texnik to‘siq bo‘yicha maslahat olmoqchisiz?"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs focus:outline-none focus:border-brand bg-cream-100/50 dark:bg-slate-800 text-ink-text dark:text-white placeholder:text-ink-muted dark:placeholder:text-slate-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!selectedSlot}
                    className="w-full py-3 rounded-xl bg-brand hover:bg-brand-hover disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold text-xs shadow-md shadow-brand/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed"
                  >
                    <SvgVideo className="w-4 h-4" />
                    <span>Onlayn sessiyani bron qilish</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Related Mentors */}
        {relatedMentors.length > 0 && (
          <div className="pt-8 space-y-4">
            <h3 className="text-xl font-black text-ink-text dark:text-white">Boshqa soha mentorlari</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedMentors.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/mentor/${rel.id}`}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-black/[0.07] dark:border-white/[0.08] hover:border-brand/40 dark:hover:border-brand/50 shadow-xs hover:shadow-md transition-all group flex items-center gap-4"
                >
                  <img 
                    src={rel.avatar} 
                    alt={rel.name} 
                    className="w-12 h-12 rounded-2xl object-cover border border-black/10 dark:border-white/10"
                  />
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm text-ink-text dark:text-white group-hover:text-brand transition-colors truncate">
                      {rel.name}
                    </h4>
                    <p className="text-[11px] text-ink-muted dark:text-slate-400 truncate">{rel.title}</p>
                    <span className="text-[10px] text-brand dark:text-blue-400 font-bold">1-on-1 sessiya &rarr;</span>
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
