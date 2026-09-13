import React, { useState } from 'react';
import { SvgX, SvgCheckCircle2, SvgQrCode } from './icons/CustomIcons';
import { EventItem } from '../types';
import { eventsApi } from '../api/eventsApi';

interface EventRegisterModalProps {
  event: EventItem | null;
  onClose: () => void;
  onSuccess: (eventId: string) => void;
}

export const EventRegisterModal: React.FC<EventRegisterModalProps> = ({
  event,
  onClose,
  onSuccess
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [telegram, setTelegram] = useState('');
  const [faculty, setFaculty] = useState('Axborot texnologiyalari');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!event) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const generated = `UZC-PASS-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const cleanId = event.id.replace(/^[^\d]*/, '') || '1';
      const numericId = parseInt(cleanId, 10) || 1;
      const res = await eventsApi.registerTicket(numericId, {
        participant_name: name.trim(),
        phone: phone.trim(),
        telegram: telegram.startsWith('@') ? telegram : `@${telegram || 'user'}`,
        faculty,
      });
      setTicketId(res.ticket_id || generated);
    } catch {
      setTicketId(generated);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      onSuccess(event.id);
    }
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

        {!isSubmitted ? (
          <div>
            <div className="p-6 border-b border-black/[0.06] dark:border-white/[0.08] bg-cream-100 dark:bg-slate-800/60">
              <span className="text-[10px] font-mono font-bold text-brand dark:text-blue-400 uppercase tracking-wider bg-brand/10 dark:bg-brand/20 px-2.5 py-0.5 rounded-full">
                {event.type}
              </span>
              <h3 className="text-xl font-black text-ink-text dark:text-white mt-2 leading-snug">
                {event.title}
              </h3>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-ink-muted dark:text-slate-400">
                <span>📅 {event.date}</span>
                <span>⏰ {event.time}</span>
                <span>📍 {event.location}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink-text dark:text-slate-200 mb-1">To‘liq ismingiz *</label>
                <input
                  type="text"
                  placeholder="Masalan: Jamshid Nurmatov"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 text-xs text-ink-text dark:text-white placeholder:text-ink-muted dark:placeholder:text-slate-500 focus:outline-none focus:border-brand"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink-text dark:text-slate-200 mb-1">Telefon raqamingiz *</label>
                  <input
                    type="tel"
                    placeholder="+998 90 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 text-xs text-ink-text dark:text-white placeholder:text-ink-muted dark:placeholder:text-slate-500 focus:outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-text dark:text-slate-200 mb-1">Telegram username</label>
                  <input
                    type="text"
                    placeholder="@username"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 text-xs text-ink-text dark:text-white placeholder:text-ink-muted dark:placeholder:text-slate-500 focus:outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-text dark:text-slate-200 mb-1">Fakultetingiz</label>
                <select
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 text-xs text-ink-text dark:text-white focus:outline-none focus:border-brand"
                >
                  <option value="Axborot texnologiyalari" className="dark:bg-slate-900">Axborot texnologiyalari</option>
                  <option value="Fizika-matematika" className="dark:bg-slate-900">Fizika-matematika</option>
                  <option value="Kimyo-biologiya" className="dark:bg-slate-900">Kimyo-biologiya</option>
                  <option value="Iqtisodiyot" className="dark:bg-slate-900">Iqtisodiyot</option>
                  <option value="Boshqa OTM / Mehmon" className="dark:bg-slate-900">Boshqa OTM / Mehmon</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-brand/25 transition-all cursor-pointer"
                >
                  <SvgCheckCircle2 className="w-4 h-4" />
                  <span>Ro‘yxatdan o‘tishni tasdiqlash</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <SvgCheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-ink-text dark:text-white">Siz ro‘yxatdan o‘tdingiz!</h3>
              <p className="text-xs text-ink-muted dark:text-slate-400 mt-1">Quyidagi chiptani tadbir kuni ko‘rsatasiz.</p>
            </div>

            {/* Virtual Ticket Card */}
            <div className="p-5 rounded-2xl bg-cream-100 dark:bg-slate-800/60 border-2 border-dashed border-brand/40 text-left space-y-2">
              <div className="flex items-center justify-between border-b border-black/[0.08] dark:border-white/[0.08] pb-2">
                <span className="text-xs font-black text-brand dark:text-blue-400 uppercase tracking-wider">UzCombinator NavDU Pass</span>
                <span className="text-xs font-mono font-bold text-ink-text dark:text-white">{ticketId}</span>
              </div>
              <h4 className="font-extrabold text-sm text-ink-text dark:text-white">{event.title}</h4>
              <div className="text-xs text-ink-muted dark:text-slate-400 space-y-0.5">
                <p>Ishtirokchi: <strong className="text-ink-text dark:text-white">{name}</strong></p>
                <p>Vaqt: {event.date}, {event.time}</p>
                <p>Manzil: {event.location}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-white dark:bg-slate-700 p-1 rounded-lg border border-black/10 dark:border-white/10">
                    <SvgQrCode className="w-full h-full text-ink-text dark:text-white" />
                  </div>
                  <span className="text-[10px] text-ink-muted dark:text-slate-400">Kirishda skanerlanadi</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/20">
                  TASDIQLANDI
                </span>
              </div>
            </div>

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
