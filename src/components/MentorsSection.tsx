import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SvgClock, SvgCalendar, SvgSend } from './icons/CustomIcons';
import { Mentor } from '../types';

interface MentorsSectionProps {
  mentors: Mentor[];
  onOpenBooking?: (mentor: Mentor) => void;
}

export const MentorsSection: React.FC<MentorsSectionProps> = ({
  mentors,
  onOpenBooking
}) => {
  const navigate = useNavigate();

  return (
    <section className="py-20 sm:py-28 border-t border-black/[0.06] dark:border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-mono font-bold text-brand dark:text-blue-400 uppercase tracking-widest bg-brand/10 dark:bg-brand/20 px-3 py-1 rounded-full">
            07 / Mentorlar
          </span>
          <span className="text-xs text-ink-muted dark:text-slate-400">Ekspertlar tarmog‘i</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-ink-text dark:text-white tracking-tight">
          Kim bilan ishlaysiz?
        </h2>
        <p className="mt-2 text-sm text-ink-muted dark:text-slate-300 max-w-xl">
          NavDU Startap Klubi va Inkubatsiya markazi mentorlari — o‘z startapini qurgan muvaffaqiyatli tadbirkorlar, universitet olimlari va soha ekspertlari.
        </p>

        {/* Mentors Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              onClick={() => {
                navigate(`/mentor/${mentor.id}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="cursor-pointer p-6 rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.06] dark:border-white/[0.08] hover:border-brand/40 dark:hover:border-brand/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5 group hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <img 
                    src={mentor.avatar} 
                    alt={mentor.name} 
                    className="w-16 h-16 rounded-2xl object-cover border border-black/10 dark:border-white/10 shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-ink-text dark:text-white group-hover:text-brand dark:group-hover:text-blue-400 transition-colors">
                      {mentor.name}
                    </h3>
                    <p className="text-xs text-brand dark:text-blue-400 font-semibold leading-tight">{mentor.title}</p>
                    <p className="text-[11px] text-ink-muted dark:text-slate-400">{mentor.organization}</p>
                  </div>
                </div>

                <p className="text-xs text-ink-muted dark:text-slate-300 leading-relaxed">
                  {mentor.bio}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {mentor.expertise.map((exp, idx) => (
                    <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-cream-100 dark:bg-slate-800 text-ink-text dark:text-slate-300 border border-black/[0.04] dark:border-white/[0.06]">
                      {exp}
                    </span>
                  ))}
                </div>

                <div className="text-xs text-ink-muted dark:text-slate-400 flex items-center gap-1.5 pt-1">
                  <SvgClock className="w-3.5 h-3.5 text-brand dark:text-blue-400" />
                  <span>Yaqin vaqt: <strong className="text-ink-text dark:text-white">{mentor.availableSlots[0]}</strong></span>
                </div>
              </div>

              <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
                {mentor.telegram ? (
                  <a
                    href={`https://t.me/${mentor.telegram.replace('@', '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-ink-muted dark:text-slate-400 hover:text-brand dark:hover:text-blue-400 transition-colors flex items-center gap-1"
                  >
                    <SvgSend className="w-3.5 h-3.5" />
                    <span>Telegram</span>
                  </a>
                ) : <div />}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/mentor/${mentor.id}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all hover:scale-105 cursor-pointer"
                >
                  <SvgCalendar className="w-3.5 h-3.5" />
                  <span>Sessiya belgilash</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
