import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EventItem } from '../types';
import { SvgCalendar, SvgTrophy, SvgClock, SvgMapPin, SvgTicket } from './icons/CustomIcons';
import { HackathonTeamBuilder } from './HackathonTeamBuilder';

interface EventsSectionProps {
  events: EventItem[];
  onOpenRegister?: (event: EventItem) => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({ events, onOpenRegister }) => {
  const navigate = useNavigate();

  return (
    <section className="py-20 sm:py-28 border-t border-black/[0.06] dark:border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-mono font-bold text-brand uppercase tracking-widest bg-brand/10 dark:bg-brand/20 px-3 py-1 rounded-full">
            05 / Tadbirlar
          </span>
          <span className="text-xs text-ink-muted dark:text-slate-400">Hakatonlar va Uchrashuvlar</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-ink-text dark:text-white tracking-tight">
          E’lonlar & Hakatonlar
        </h2>
        <p className="mt-2 text-sm text-ink-muted dark:text-slate-400 max-w-xl">
          NavDU Startap Klubi va Inkubatsiya markazi tomonidan tashkil etiladigan nufuzli hakatonlar va seminar-treninglarga qatnashing.
        </p>

        {/* Events Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <div
              key={evt.id}
              onClick={() => {
                navigate(`/event/${evt.id}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="cursor-pointer p-6 rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.06] dark:border-white/[0.08] hover:border-brand/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand/10 text-brand dark:bg-brand/20">
                    {evt.type}
                  </span>
                  <span className="text-[10px] text-ink-muted dark:text-slate-400 bg-cream-200 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {evt.mode}
                  </span>
                </div>

                <h3 className="text-base font-bold text-ink-text dark:text-white group-hover:text-brand transition-colors leading-snug">
                  {evt.title}
                </h3>

                <p className="text-xs text-ink-muted dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {evt.description}
                </p>

                {evt.prize && (
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center gap-1.5">
                    <SvgTrophy className="w-4 h-4 shrink-0" />
                    <span>{evt.prize}</span>
                  </div>
                )}

                <div className="space-y-1 text-xs text-ink-muted dark:text-slate-400 pt-1">
                  <div className="flex items-center gap-2">
                    <SvgCalendar className="w-3.5 h-3.5 text-brand shrink-0" />
                    <span>{evt.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <SvgClock className="w-3.5 h-3.5 text-ink-muted shrink-0" />
                    <span>{evt.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <SvgMapPin className="w-3.5 h-3.5 text-ink-muted shrink-0" />
                    <span className="truncate">{evt.location}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
                <span className="text-xs text-ink-muted dark:text-slate-400 font-medium">
                  👥 {evt.registeredCount} ro‘yxatda
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/event/${evt.id}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all hover:scale-105"
                >
                  <SvgTicket className="w-3.5 h-3.5" />
                  <span>Batafsil & Ro‘yxat</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Hackathon Team Builder Board */}
        <HackathonTeamBuilder />

      </div>
    </section>
  );
};

