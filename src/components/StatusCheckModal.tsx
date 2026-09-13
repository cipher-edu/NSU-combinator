import React, { useState } from 'react';
import { SvgX } from './icons/CustomIcons';
import { IncubationApplication } from '../types';
import { applicationsApi } from '../api/applicationsApi';

interface StatusCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: IncubationApplication[];
}

export const StatusCheckModal: React.FC<StatusCheckModalProps> = ({
  isOpen,
  onClose,
  applications
}) => {
  const [searchId, setSearchId] = useState('');
  const [result, setResult] = useState<IncubationApplication | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchId.trim().toUpperCase();
    if (!query) return;

    setIsLoading(true);
    try {
      const apiRes = await applicationsApi.checkStatus(query);
      if (apiRes && apiRes.id) {
        setResult({
          id: apiRes.id,
          teamName: `${apiRes.project_name} Jamoasi`,
          founderName: apiRes.founder_name,
          phone: '',
          email: '',
          telegram: '',
          faculty: 'NavDU',
          course: '',
          teamMembersCount: 1,
          category: apiRes.category || 'Startap',
          stage: (apiRes.stage as any) || 'MVP',
          projectName: apiRes.project_name,
          problem: '',
          solution: '',
          targetMarket: '',
          hasPrototype: true,
          submittedAt: apiRes.created_at ? apiRes.created_at.split('T')[0] : '2026-09-13',
          status: (apiRes.status as any) || 'Ko‘rib chiqilmoqda',
        });
      } else {
        const found = applications.find(a => a.id.toUpperCase() === query);
        setResult(found || null);
      }
    } catch {
      const found = applications.find(a => a.id.toUpperCase() === query);
      setResult(found || null);
    } finally {
      setIsLoading(false);
      setHasSearched(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden my-8">
        
        <div className="p-6 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-ink-text dark:text-white">Ariza holatini tekshirish</h3>
            <p className="text-xs text-ink-muted dark:text-slate-400">Arizangizning unikal ID raqamini kiriting</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-cream-200 dark:bg-slate-800 hover:bg-cream-300 dark:hover:bg-slate-700 flex items-center justify-center text-ink-muted dark:text-slate-400 cursor-pointer">
            <SvgX className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="UZC-NAVDU-2026-089"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              required
              className="flex-1 px-4 py-2.5 rounded-xl bg-cream-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 text-xs font-mono font-bold text-ink-text dark:text-white placeholder:text-ink-muted dark:placeholder:text-slate-500 focus:outline-none focus:border-brand uppercase"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs shadow-xs cursor-pointer disabled:opacity-60"
            >
              {isLoading ? 'Izlanmoqda...' : 'Tekshirish'}
            </button>
          </form>

          <p className="text-[11px] text-ink-muted dark:text-slate-400">
            Sinov uchun ID: <button type="button" onClick={() => setSearchId('UZC-NAVDU-2026-089')} className="text-brand dark:text-blue-400 font-bold underline cursor-pointer">UZC-NAVDU-2026-089</button> yoki <button type="button" onClick={() => setSearchId('UZC-NAVDU-2026-104')} className="text-brand dark:text-blue-400 font-bold underline cursor-pointer">UZC-NAVDU-2026-104</button>
          </p>

          {hasSearched && (
            result ? (
              <div className="p-5 rounded-2xl bg-cream-100 dark:bg-slate-800/80 border border-black/[0.06] dark:border-white/[0.08] space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.08] pb-2">
                  <span className="font-mono font-bold text-ink-muted dark:text-slate-400">{result.id}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                    {result.status}
                  </span>
                </div>
                <div className="space-y-1 text-ink-text dark:text-slate-200">
                  <p>Loyiha: <strong className="text-ink-text dark:text-white">{result.projectName}</strong></p>
                  <p>Asoschi: {result.founderName} ({result.faculty})</p>
                  <p>Sana: {result.submittedAt}</p>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-black/[0.06] dark:border-white/[0.08] text-xs text-ink-muted dark:text-slate-300">
                  {result.status === 'Qabul qilindi' && 'Tabriklaymiz! Siz UzCombinator NavDU 3-mavsumiga qabul qilindingiz! Tez orada Telegram orqali koordinatordan xabar olasiz.'}
                  {result.status === 'Intervyuga chaqirildi' && 'Sizning arizangiz birinchi saralashdan o‘tdi. Ekspertlar bilan 15 daqiqalik suhbatga chaqirilasiz.'}
                  {result.status === 'Ko‘rib chiqilmoqda' && 'Arizangiz ekspertlarimiz tomonidan baholanmoqda.'}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-800/40 text-center text-xs text-rose-700 dark:text-rose-300">
                Bunday ID ga ega ariza topilmadi.
              </div>
            )
          )}
        </div>

      </div>
    </div>
  );
};
