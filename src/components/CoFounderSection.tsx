import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SvgPlus, SvgSend } from './icons/CustomIcons';
import { CoFounderVacancy } from '../types';

interface CoFounderSectionProps {
  vacancies: CoFounderVacancy[];
  onOpenCreateVacancy: () => void;
}

export const CoFounderSection: React.FC<CoFounderSectionProps> = ({
  vacancies,
  onOpenCreateVacancy
}) => {
  const navigate = useNavigate();

  return (
    <section className="py-20 sm:py-28 border-t border-black/[0.06] dark:border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-black/[0.06] dark:border-white/[0.08]">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-mono font-bold text-brand dark:text-blue-400 uppercase tracking-widest bg-brand/10 dark:bg-brand/20 px-3 py-1 rounded-full">
                06 / Jamoa
              </span>
              <span className="text-xs text-ink-muted dark:text-slate-400">Co-Founder Matching</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-ink-text dark:text-white tracking-tight">
              Jamoa yig‘ish & Co-Founder topish
            </h2>
            <p className="mt-2 text-sm text-ink-muted dark:text-slate-300 max-w-xl">
              Startap loyihalariga dasturchi, dizayner, marketolog yoki ilmiy tadqiqotchi sherik topish uchun maxsus doska.
            </p>
          </div>

          <button
            onClick={onOpenCreateVacancy}
            className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 hover:bg-cream-200 dark:hover:bg-slate-800 text-ink-text dark:text-white font-bold text-xs sm:text-sm border border-black/10 dark:border-white/10 shadow-xs flex items-center gap-2 self-start sm:self-auto transition-all hover:scale-105 cursor-pointer"
          >
            <SvgPlus className="w-4 h-4 text-brand dark:text-blue-400" />
            <span>Vakansiya e’lon qilish</span>
          </button>
        </div>

        {/* Vacancies Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vacancies.map((vac) => (
            <div
              key={vac.id}
              onClick={() => {
                navigate(`/vacancy/${vac.id}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="cursor-pointer p-6 rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.06] dark:border-white/[0.08] hover:border-brand/40 dark:hover:border-brand/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-cream-100 dark:bg-slate-800 border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center text-2xl shrink-0">
                      {vac.startupLogo}
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-brand dark:text-blue-400 uppercase tracking-wider">{vac.startupName}</h4>
                      <h3 className="text-base font-extrabold text-ink-text dark:text-white group-hover:text-brand dark:group-hover:text-blue-400 transition-colors leading-snug">
                        {vac.roleTitle}
                      </h3>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cream-200 dark:bg-white/[0.06] text-ink-muted dark:text-slate-300 shrink-0">
                    {vac.commitmentType}
                  </span>
                </div>

                <p className="text-xs text-ink-muted dark:text-slate-300 leading-relaxed">
                  {vac.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {vac.requiredSkills.map((sk, idx) => (
                    <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-cream-100 dark:bg-slate-800 text-ink-text dark:text-slate-300 border border-black/[0.04] dark:border-white/[0.06]">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
                <span className="text-[11px] text-ink-muted dark:text-slate-400">
                  {vac.createdAt}
                </span>

                <a
                  href={`https://t.me/${vac.contactTelegram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all hover:scale-105 cursor-pointer"
                >
                  <SvgSend className="w-3.5 h-3.5" />
                  <span>Aloqa ({vac.contactTelegram})</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
