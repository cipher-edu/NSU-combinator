import React, { useState } from 'react';
import { SvgX, SvgCalendar, SvgCheckCircle2, SvgClock } from './icons/CustomIcons';
import { Mentor } from '../types';

interface MentorBookingModalProps {
  mentor: Mentor | null;
  onClose: () => void;
}

export const MentorBookingModal: React.FC<MentorBookingModalProps> = ({
  mentor,
  onClose
}) => {
  const [selectedSlot, setSelectedSlot] = useState('');
  const [studentName, setStudentName] = useState('');
  const [telegram, setTelegram] = useState('');
  const [question, setQuestion] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  if (!mentor) return null;

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !studentName.trim() || !question.trim()) return;
    setIsBooked(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden my-8">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-cream-200 dark:bg-slate-800 hover:bg-cream-300 dark:hover:bg-slate-700 text-ink-muted dark:text-slate-400 hover:text-ink-text dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <SvgX className="w-5 h-5" />
        </button>

        {!isBooked ? (
          <div>
            <div className="p-6 border-b border-black/[0.06] dark:border-white/[0.08] bg-cream-100 dark:bg-slate-800/60 flex items-center gap-4">
              <img 
                src={mentor.avatar} 
                alt={mentor.name} 
                className="w-14 h-14 rounded-2xl object-cover border border-black/10 dark:border-white/10" 
              />
              <div>
                <h3 className="text-base font-bold text-ink-text dark:text-white">{mentor.name}</h3>
                <p className="text-xs text-brand dark:text-blue-400 font-semibold">{mentor.title}</p>
                <p className="text-[11px] text-ink-muted dark:text-slate-400">{mentor.organization}</p>
              </div>
            </div>

            <form onSubmit={handleBooking} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink-text dark:text-slate-200 mb-1.5">Bo‘sh vaqt oralig‘i *</label>
                <div className="space-y-2">
                  {mentor.availableSlots.map((slot, idx) => (
                    <label
                      key={idx}
                      className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer flex items-center justify-between transition-colors ${
                        selectedSlot === slot
                          ? 'bg-brand/10 dark:bg-brand/20 text-brand dark:text-blue-300 border-brand/40'
                          : 'bg-cream-50 dark:bg-slate-800/40 text-ink-text dark:text-slate-300 border-black/[0.06] dark:border-white/[0.06] hover:bg-cream-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <SvgClock className="w-4 h-4 text-brand dark:text-blue-400" />
                        {slot}
                      </span>
                      <input
                        type="radio"
                        name="slot"
                        value={slot}
                        checked={selectedSlot === slot}
                        onChange={() => setSelectedSlot(slot)}
                        className="text-brand dark:text-blue-400"
                        required
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink-text dark:text-slate-200 mb-1">Ismingiz *</label>
                  <input
                    type="text"
                    placeholder="Jamshid"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 text-xs text-ink-text dark:text-white placeholder:text-ink-muted dark:placeholder:text-slate-500 focus:outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-text dark:text-slate-200 mb-1">Telegram *</label>
                  <input
                    type="text"
                    placeholder="@username"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 text-xs text-ink-text dark:text-white placeholder:text-ink-muted dark:placeholder:text-slate-500 focus:outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-text dark:text-slate-200 mb-1">Savolingiz yoki loyihangiz *</label>
                <textarea
                  rows={3}
                  placeholder="Mentor bilan qanday mavzuda gaplashmoqchisiz?.."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 text-xs text-ink-text dark:text-white placeholder:text-ink-muted dark:placeholder:text-slate-500 focus:outline-none focus:border-brand resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <SvgCalendar className="w-4 h-4" />
                <span>1-on-1 Sessiyani bron qilish</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <SvgCheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-ink-text dark:text-white">Uchrashuv belgilandi!</h3>
            <p className="text-xs text-ink-muted dark:text-slate-300 leading-relaxed">
              <strong>{mentor.name}</strong> bilan <strong>{selectedSlot}</strong> vaqtida 1-on-1 konsultatsiya tasdiqlandi.
            </p>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-cream-200 dark:bg-slate-800 hover:bg-cream-300 dark:hover:bg-slate-700 text-ink-text dark:text-white text-xs font-bold cursor-pointer transition-colors"
            >
              Yopish
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
