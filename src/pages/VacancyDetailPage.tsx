import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  SvgArrowLeft, 
  SvgBriefcase, 
  SvgSend, 
  SvgCheckCircle2, 
  SvgAlertCircle, 
  SvgShare, 
  SvgCheck, 
  SvgGraduation, 
  SvgClock,
  SvgSparkles,
  SvgAward
} from '../components/icons/CustomIcons';
import { CoFounderVacancy } from '../types';

interface VacancyDetailPageProps {
  vacancies: CoFounderVacancy[];
}

export const VacancyDetailPage: React.FC<VacancyDetailPageProps> = ({ vacancies }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const vacancy = vacancies.find(v => v.id === id);

  const [copied, setCopied] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [applicantFaculty, setApplicantFaculty] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantGithub, setApplicantGithub] = useState('');
  const [applicantNote, setApplicantNote] = useState('');
  const [isApplied, setIsApplied] = useState(false);

  if (!vacancy) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-16 h-16 rounded-2xl bg-brand/10 text-brand flex items-center justify-center mb-4">
          <SvgAlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-ink-text dark:text-white">Vakansiya topilmadi</h2>
        <p className="text-sm text-ink-muted dark:text-slate-400 mt-2 max-w-md">
          Siz qidirayotgan e’lon mavjud emas yoki o‘chirilgan bo‘lishi mumkin.
        </p>
        <Link 
          to="/team" 
          className="mt-6 px-6 py-3 rounded-xl bg-brand text-white font-bold text-xs shadow-md shadow-brand/25 cursor-pointer"
        >
          Barcha vakansiyalarga qaytish
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !applicantPhone.trim()) return;

    setIsApplied(true);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#2563EB', '#10B981', '#F59E0B']
    });
  };

  const relatedVacancies = vacancies.filter(v => v.id !== vacancy.id).slice(0, 3);

  return (
    <div className="min-h-screen pb-24 pt-4 sm:pt-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-xs text-ink-muted dark:text-slate-400">
            <Link to="/" className="hover:text-brand transition-colors font-medium">Bosh sahifa</Link>
            <span>/</span>
            <Link to="/team" className="hover:text-brand transition-colors font-medium">Jamoa & Klub</Link>
            <span>/</span>
            <span className="text-ink-text dark:text-white font-bold truncate max-w-[200px] sm:max-w-none">{vacancy.roleTitle}</span>
          </nav>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 text-xs font-semibold text-ink-muted dark:text-slate-400 hover:text-ink-text dark:hover:text-white hover:bg-cream-100 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
          >
            <SvgArrowLeft className="w-3.5 h-3.5" />
            <span>Orqaga</span>
          </button>
        </div>

        {/* Hero Vacancy Card */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.08] dark:border-white/[0.08] shadow-sm space-y-6 relative overflow-hidden">
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-brand/10 dark:bg-brand/20 text-brand dark:text-blue-400 text-xs font-bold border border-brand/20 dark:border-brand/40">
                {vacancy.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800/40">
                {vacancy.commitmentType}
              </span>
              <span className="text-xs text-ink-muted dark:text-slate-400 flex items-center gap-1">
                <SvgClock className="w-3.5 h-3.5 text-ink-muted dark:text-slate-400" />
                <span>{vacancy.createdAt}</span>
              </span>
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

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-cream-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 flex items-center justify-center text-3xl shrink-0 shadow-xs">
              {vacancy.startupLogo}
            </div>
            <div>
              <span className="text-xs font-bold text-brand dark:text-blue-400 uppercase tracking-wider block">
                {vacancy.startupName}
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-ink-text dark:text-white tracking-tight mt-0.5">
                {vacancy.roleTitle}
              </h1>
            </div>
          </div>

          {/* Quick info strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-cream-100/80 dark:bg-slate-800/80 border border-black/[0.05] dark:border-white/[0.06]">
              <SvgGraduation className="w-5 h-5 text-brand shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-ink-muted dark:text-slate-400 block">Tavsiya etilgan fakultet</span>
                <span className="text-xs sm:text-sm font-bold text-ink-text dark:text-white">{vacancy.faculty}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-cream-100/80 dark:bg-slate-800/80 border border-black/[0.05] dark:border-white/[0.06]">
              <SvgAward className="w-5 h-5 text-brand shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-ink-muted dark:text-slate-400 block">Imtiyozlar</span>
                <span className="text-xs sm:text-sm font-bold text-brand dark:text-blue-400">Ulush (Equity) & Kovorking</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-cream-100/80 dark:bg-slate-800/80 border border-black/[0.05] dark:border-white/[0.06]">
              <SvgSend className="w-5 h-5 text-brand shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-ink-muted dark:text-slate-400 block">Tezkor aloqa</span>
                <a 
                  href={`https://t.me/${vacancy.contactTelegram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {vacancy.contactTelegram}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* 2-Column: Details & Application Form */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Details (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.08] dark:border-white/[0.08] shadow-sm space-y-4">
              <h3 className="text-lg font-black text-ink-text dark:text-white flex items-center gap-2">
                <SvgBriefcase className="w-5 h-5 text-brand" />
                <span>Vazifa va Loyiha haqida</span>
              </h3>
              <p className="text-sm sm:text-base text-ink-muted dark:text-slate-300 leading-relaxed font-normal whitespace-pre-line">
                {vacancy.description}
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.08] dark:border-white/[0.08] shadow-sm space-y-4">
              <h3 className="text-lg font-black text-ink-text dark:text-white flex items-center gap-2">
                <SvgSparkles className="w-5 h-5 text-brand" />
                <span>Talab qilinadigan ko‘nikmalar</span>
              </h3>

              <div className="flex flex-wrap gap-2 pt-1">
                {vacancy.requiredSkills.map((sk, idx) => (
                  <span key={idx} className="px-3.5 py-1.5 rounded-xl bg-cream-100 dark:bg-slate-800 border border-black/[0.06] dark:border-white/[0.08] text-ink-text dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5">
                    <SvgCheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{sk}</span>
                  </span>
                ))}
              </div>

              <div className="mt-4 p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <strong>Taklif etiladi:</strong> Startapda dastlabki 5% - 15% ulush (equity), NavDU Inkubatsiya markazida 24/7 ish o‘rni, bepul ovqatlanish vaucherlari va xalqaro hakatonlarda ishtirok etish imkoniyati.
              </div>
            </div>
          </div>

          {/* Direct Application Form (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.08] dark:border-white/[0.08] shadow-sm space-y-5">
              <h3 className="text-xl font-black text-ink-text dark:text-white flex items-center gap-2">
                <SvgSend className="w-5 h-5 text-brand" />
                <span>Jamoaga qo‘shilish</span>
              </h3>

              {isApplied ? (
                <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-center space-y-3">
                  <SvgCheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <h4 className="font-extrabold text-sm text-emerald-900 dark:text-emerald-200">Arizangiz asoschiga yuborildi!</h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                    {vacancy.startupName} asoschisi tez orada siz bilan Telegram orqali bog‘lanadi.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-3.5">
                  <div>
                    <label className="text-xs font-bold text-ink-muted dark:text-slate-300 block mb-1">Ism va familiyangiz</label>
                    <input 
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="Masalan: Jamshid Qodirov"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs focus:outline-none focus:border-brand bg-cream-100/50 dark:bg-slate-800 text-ink-text dark:text-white placeholder:text-ink-muted dark:placeholder:text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-ink-muted dark:text-slate-300 block mb-1">Fakultet va kursingiz</label>
                    <input 
                      type="text"
                      required
                      value={applicantFaculty}
                      onChange={(e) => setApplicantFaculty(e.target.value)}
                      placeholder="Masalan: Fizika-matematika, 2-kurs"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs focus:outline-none focus:border-brand bg-cream-100/50 dark:bg-slate-800 text-ink-text dark:text-white placeholder:text-ink-muted dark:placeholder:text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-ink-muted dark:text-slate-300 block mb-1">Telefon / Telegram</label>
                    <input 
                      type="text"
                      required
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      placeholder="+998 90 ... yoki @username"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs focus:outline-none focus:border-brand bg-cream-100/50 dark:bg-slate-800 text-ink-text dark:text-white placeholder:text-ink-muted dark:placeholder:text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-ink-muted dark:text-slate-300 block mb-1">GitHub / Portfolio (ixtiyoriy)</label>
                    <input 
                      type="url"
                      value={applicantGithub}
                      onChange={(e) => setApplicantGithub(e.target.value)}
                      placeholder="https://github.com/... yoki portfolio"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs focus:outline-none focus:border-brand bg-cream-100/50 dark:bg-slate-800 text-ink-text dark:text-white placeholder:text-ink-muted dark:placeholder:text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-ink-muted dark:text-slate-300 block mb-1">Nima uchun ushbu loyiha?</label>
                    <textarea 
                      rows={3}
                      value={applicantNote}
                      onChange={(e) => setApplicantNote(e.target.value)}
                      placeholder="Qanday tajribangiz bor va startapga nima bera olasiz?"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs focus:outline-none focus:border-brand bg-cream-100/50 dark:bg-slate-800 text-ink-text dark:text-white placeholder:text-ink-muted dark:placeholder:text-slate-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs shadow-md shadow-brand/25 flex items-center justify-center gap-2 transition-all mt-2 cursor-pointer"
                  >
                    <SvgSend className="w-4 h-4" />
                    <span>Murojaat yuborish</span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

        {/* Related Vacancies */}
        {relatedVacancies.length > 0 && (
          <div className="pt-8 space-y-4">
            <h3 className="text-xl font-black text-ink-text dark:text-white">Boshqa startap vakansiyalari</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedVacancies.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/vacancy/${rel.id}`}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-black/[0.07] dark:border-white/[0.08] hover:border-brand/40 dark:hover:border-brand/50 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-cream-100 dark:bg-slate-800 flex items-center justify-center text-xl">
                        {rel.startupLogo}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-brand dark:text-blue-400 uppercase">{rel.startupName}</span>
                        <h4 className="font-bold text-sm text-ink-text dark:text-white group-hover:text-brand transition-colors truncate">
                          {rel.roleTitle}
                        </h4>
                      </div>
                    </div>
                    <p className="text-xs text-ink-muted dark:text-slate-400 line-clamp-2">{rel.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-xs font-bold">
                    <span className="text-emerald-600 dark:text-emerald-400">{rel.commitmentType}</span>
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
