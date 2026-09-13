import React from 'react';
import { SvgSend, SvgMail, SvgPhone, SvgMapPin, SvgHeart, SvgGlobe, SvgArrowRight } from './icons/CustomIcons';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenApply: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenApply }) => {
  return (
    <footer className="border-t border-black/[0.06] dark:border-white/[0.08] bg-cream-100 dark:bg-slate-950 text-ink-muted dark:text-slate-400 text-xs pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Callout */}
        <div className="p-8 sm:p-10 rounded-3xl bg-brand text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-brand/20 mb-16">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full text-white inline-block">
              3-Mavsum Qabuli
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Sizda startap g‘oyasi bormi? Uni birgalikda quramiz.
            </h3>
            <p className="text-xs sm:text-sm text-white/80 max-w-lg">
              $1,000 stipendiya, 24/7 kovorking, 3 mahal bepul ovqat va xalqaro investorlar bilan uchrashuv.
            </p>
          </div>

          <button
            onClick={onOpenApply}
            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-cream-100 text-brand font-extrabold text-sm shadow-md transition-all hover:scale-105 shrink-0 cursor-pointer"
          >
            Arizangizni topshiring &rarr;
          </button>
        </div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-black/[0.06] dark:border-white/[0.08]">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand to-blue-500 text-white font-black flex items-center justify-center text-sm shadow-xs">
                N
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm sm:text-base text-ink-text dark:text-white leading-none">NavDU Startap Klubi</span>
                <span className="text-[10px] text-brand font-bold mt-0.5">Inkubatsiya va Akseleratsiya Markazi</span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-ink-muted dark:text-slate-400">
              Navoiy davlat universiteti talabalari, yosh olimlari va tadqiqotchilarining startap loyihalarini qo‘llab-quvvatlash va investitsiyalarga olib chiqish markazi.
            </p>
            <div className="pt-1 flex items-center gap-2">
              <a
                href="https://t.me/navdu_startup"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 flex items-center justify-center text-ink-muted dark:text-slate-400 hover:text-brand hover:border-brand/40 transition-colors"
                aria-label="Telegram"
              >
                <SvgSend className="w-3.5 h-3.5" />
              </a>
              <a
                href="mailto:startup@navdu.uz"
                className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 flex items-center justify-center text-ink-muted dark:text-slate-400 hover:text-brand hover:border-brand/40 transition-colors"
                aria-label="Email"
              >
                <SvgMail className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://navdu.uz"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 flex items-center justify-center text-ink-muted dark:text-slate-400 hover:text-brand hover:border-brand/40 transition-colors"
                aria-label="NavDU Sayti"
              >
                <SvgGlobe className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-ink-text dark:text-white mb-3">Bo‘limlar</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setActiveTab('program')} className="hover:text-brand transition-colors cursor-pointer">45 kunlik akseleratsiya</button></li>
              <li><button onClick={() => setActiveTab('portfolio')} className="hover:text-brand transition-colors cursor-pointer">Startaplar portfeli</button></li>
              <li><button onClick={() => setActiveTab('news')} className="hover:text-brand transition-colors cursor-pointer">Yangiliklar & Press</button></li>
              <li><button onClick={() => setActiveTab('demoday')} className="hover:text-brand transition-colors cursor-pointer">Demo Day natijalari</button></li>
              <li><button onClick={() => setActiveTab('stories')} className="hover:text-brand transition-colors cursor-pointer">Startaperlar blogi</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-ink-text dark:text-white mb-3">Imkoniyatlar</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/playbook" className="hover:text-brand transition-colors">Startap Playbook (Yo‘riqnoma)</a></li>
              <li><button onClick={() => setActiveTab('team')} className="hover:text-brand transition-colors cursor-pointer">Iqtidorlar & Co-Founderlar</button></li>
              <li><button onClick={() => setActiveTab('events')} className="hover:text-brand transition-colors cursor-pointer">Hakatonlar va meetup'lar</button></li>
              <li><button onClick={() => setActiveTab('mentors')} className="hover:text-brand transition-colors cursor-pointer">Mentorlar bilan 1-on-1</button></li>
              <li><button onClick={onOpenApply} className="hover:text-brand transition-colors cursor-pointer">3-mavsum arizasi</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-ink-text dark:text-white mb-3">Aloqa & Manzil</h4>
            <ul className="space-y-2 text-xs text-ink-muted dark:text-slate-400">
              <li>Navoiy shahri, Ibn Sino ko‘chasi, 45-uy</li>
              <li>NavDU Bosh binosi, 2-qavat, 214-xona</li>
              <li>Tel: +998 (79) 225-41-15</li>
              <li>Email: startup@navdu.uz</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-ink-muted">
          <p>© 2026 Navoiy Davlat Universiteti Inkubatsiya va Akseleratsiya Markazi hamda Startap Klubi.</p>
          <div className="flex items-center gap-2">
            <span>Made with <SvgHeart className="w-3 h-3 text-brand inline" filled /> for NavDU Innovators</span>
            <span>•</span>
            <span>NavDU Ekotizimi</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
