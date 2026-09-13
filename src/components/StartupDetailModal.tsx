import React from 'react';
import { SvgX, SvgCheckCircle2, SvgUsers, SvgSend, SvgExternalLink } from './icons/CustomIcons';
import { Startup } from '../types';

interface StartupDetailModalProps {
  startup: Startup | null;
  onClose: () => void;
  onUpvote: (id: string, e: React.MouseEvent) => void;
}

export const StartupDetailModal: React.FC<StartupDetailModalProps> = ({
  startup,
  onClose,
  onUpvote
}) => {
  if (!startup) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Banner image if available */}
        {startup.bannerImage && (
          <div className="relative h-44 sm:h-52 w-full overflow-hidden shrink-0">
            <img 
              src={startup.bannerImage} 
              alt={startup.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 via-transparent to-transparent" />
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-800/90 text-ink-muted hover:text-ink-text dark:text-slate-400 dark:hover:text-white flex items-center justify-center border border-black/10 dark:border-white/10 shadow-sm transition-colors cursor-pointer"
        >
          <SvgX className="w-5 h-5" />
        </button>

        {/* Header and Details */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-cream-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 flex items-center justify-center text-4xl shadow-sm shrink-0">
                {startup.logo}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl font-black text-ink-text dark:text-white">{startup.name}</h2>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand/10 text-brand dark:bg-brand/30 dark:text-blue-300 border border-brand/20">
                    {startup.stage}
                  </span>
                  <span className="text-xs text-ink-muted dark:text-slate-400 bg-cream-200 dark:bg-slate-800 px-2.5 py-0.5 rounded-md font-medium border border-black/[0.04] dark:border-white/[0.06]">
                    {startup.batch}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-ink-muted dark:text-slate-400 mt-1 font-medium">{startup.tagline}</p>
              </div>
            </div>

            <button
              onClick={(e) => onUpvote(startup.id, e)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-bold transition-all shrink-0 cursor-pointer ${
                startup.upvotedByUser
                  ? 'bg-brand text-white border-brand shadow-md shadow-brand/30'
                  : 'bg-white dark:bg-slate-800 text-ink-text dark:text-white border-black/10 dark:border-white/10 hover:border-brand/40 hover:bg-cream-100 dark:hover:bg-slate-700'
              }`}
            >
              <span>▲ Ovoz berish</span>
              <span className="bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded-md text-xs">{startup.upvotes}</span>
            </button>
          </div>

          {/* Investment & Metrics summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-cream-100 dark:bg-slate-800/60 border border-black/[0.06] dark:border-white/[0.08]">
            {startup.raisedAmount && (
              <div>
                <span className="text-[11px] text-ink-muted dark:text-slate-400 block">Jalb qilingan</span>
                <span className="text-sm font-black text-brand dark:text-blue-400 font-mono-num">{startup.raisedAmount}</span>
              </div>
            )}
            {startup.metrics.users && (
              <div>
                <span className="text-[11px] text-ink-muted dark:text-slate-400 block">Foydalanuvchilar</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{startup.metrics.users}</span>
              </div>
            )}
            {startup.metrics.pilotLocations && (
              <div>
                <span className="text-[11px] text-ink-muted dark:text-slate-400 block">Sinov maydoni</span>
                <span className="text-sm font-bold text-ink-text dark:text-slate-200">{startup.metrics.pilotLocations}</span>
              </div>
            )}
            {startup.metrics.grantWon && (
              <div>
                <span className="text-[11px] text-ink-muted dark:text-slate-400 block">Grant</span>
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{startup.metrics.grantWon}</span>
              </div>
            )}
          </div>

          {/* Full description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400 mb-2">Loyiha haqida</h4>
            <p className="text-ink-text dark:text-slate-200 text-sm leading-relaxed whitespace-pre-line">
              {startup.fullDescription}
            </p>
          </div>

          {/* Problem & Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1.5 mb-2">
                <span>⚠️ Hal qilinayotgan muammo</span>
              </h4>
              <p className="text-xs sm:text-sm text-rose-950 dark:text-rose-200 leading-relaxed">
                {startup.problem}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 mb-2">
                <SvgCheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Bizning yechim</span>
              </h4>
              <p className="text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 leading-relaxed">
                {startup.solution}
              </p>
            </div>
          </div>

          {/* Founders */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <SvgUsers className="w-4 h-4 text-brand dark:text-blue-400" />
              <span>Jamoa va Asoschilar</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {startup.founders.map((founder, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <img 
                      src={founder.avatar} 
                      alt={founder.name} 
                      className="w-11 h-11 rounded-xl object-cover border border-black/10 dark:border-white/10" 
                    />
                    <div>
                      <h5 className="text-xs sm:text-sm font-bold text-ink-text dark:text-white">{founder.name}</h5>
                      <span className="text-xs text-brand dark:text-blue-400 font-medium block">{founder.role}</span>
                      <span className="text-[11px] text-ink-muted dark:text-slate-400 block">{founder.faculty}</span>
                    </div>
                  </div>
                  {founder.telegram && (
                    <a
                      href={`https://t.me/${founder.telegram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-brand/10 hover:bg-brand/20 dark:bg-brand/20 dark:hover:bg-brand/30 text-brand dark:text-blue-400 transition-colors cursor-pointer"
                      title="Telegramda bog'lanish"
                    >
                      <SvgSend className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2">
              {startup.website && (
                <a
                  href={startup.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-cream-200 hover:bg-cream-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-ink-text dark:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <SvgExternalLink className="w-3.5 h-3.5" />
                  <span>Veb-sayt</span>
                </a>
              )}
            </div>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-cream-200 hover:bg-cream-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-ink-text dark:text-white text-xs font-semibold cursor-pointer transition-colors"
            >
              Yopish
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
