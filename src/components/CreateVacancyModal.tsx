import React, { useState } from 'react';
import { SvgX, SvgSend } from './icons/CustomIcons';
import { CoFounderVacancy } from '../types';

interface CreateVacancyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (vac: CoFounderVacancy) => void;
}

export const CreateVacancyModal: React.FC<CreateVacancyModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [startupName, setStartupName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [category, setCategory] = useState('AI & EdTech');
  const [skills, setSkills] = useState('');
  const [description, setDescription] = useState('');
  const [commitmentType, setCommitmentType] = useState<'To‘liq stavka' | 'Erkin grafik' | 'Yarim stavka' | 'Loyiha asosida'>('Erkin grafik');
  const [faculty, setFaculty] = useState('Axborot texnologiyalari');
  const [telegram, setTelegram] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startupName.trim() || !roleTitle.trim() || !telegram.trim()) return;

    const newVac: CoFounderVacancy = {
      id: `vac_${Date.now()}`,
      startupName: startupName.trim(),
      startupLogo: '🚀',
      category,
      roleTitle: roleTitle.trim(),
      requiredSkills: skills.split(',').map(s => s.trim()).filter(Boolean),
      description: description.trim(),
      commitmentType,
      faculty,
      contactTelegram: telegram.startsWith('@') ? telegram : `@${telegram}`,
      createdAt: 'Bugun'
    };

    onSubmit(newVac);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden my-8">
        
        <div className="p-6 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-ink-text dark:text-white">Vakansiya joylashtirish</h3>
            <p className="text-xs text-ink-muted dark:text-slate-400">Startapingiz uchun dasturchi, dizayner yoki co-founder toping</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-cream-200 dark:bg-slate-800 hover:bg-cream-300 dark:hover:bg-slate-700 flex items-center justify-center text-ink-muted dark:text-slate-400 cursor-pointer transition-colors">
            <SvgX className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-text dark:text-slate-200 mb-1">Startap nomi *</label>
              <input
                type="text"
                placeholder="AgroSmart Drip"
                value={startupName}
                onChange={(e) => setStartupName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 text-xs text-ink-text dark:text-white placeholder:text-ink-muted dark:placeholder:text-slate-500 focus:outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-text dark:text-slate-200 mb-1">Kerakli mutaxassis (Rol) *</label>
              <input
                type="text"
                placeholder="Frontendchi, UI dizayner"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 text-xs text-ink-text dark:text-white placeholder:text-ink-muted dark:placeholder:text-slate-500 focus:outline-none focus:border-brand"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-text dark:text-slate-200 mb-1">Kerakli ko‘nikmalar (vergul bilan)</label>
            <input
              type="text"
              placeholder="Flutter, REST API, Figma"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 text-xs text-ink-text dark:text-white placeholder:text-ink-muted dark:placeholder:text-slate-500 focus:outline-none focus:border-brand"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-text dark:text-slate-200 mb-1">Bandlik turi</label>
              <select
                value={commitmentType}
                onChange={(e) => setCommitmentType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 text-xs text-ink-text dark:text-white focus:outline-none focus:border-brand"
              >
                <option value="Erkin grafik" className="dark:bg-slate-900">Erkin grafik</option>
                <option value="Yarim stavka" className="dark:bg-slate-900">Yarim stavka</option>
                <option value="To‘liq stavka" className="dark:bg-slate-900">To‘liq stavka (Co-founder)</option>
                <option value="Loyiha asosida" className="dark:bg-slate-900">Loyiha asosida</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-text dark:text-slate-200 mb-1">Telegram (Bog‘lanish) *</label>
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
            <label className="block text-xs font-semibold text-ink-text dark:text-slate-200 mb-1">Tavsif & Vazifalar *</label>
            <textarea
              rows={3}
              placeholder="Qanday loyiha? Yangi a’zo jamoada nima qiladi?.."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 text-xs text-ink-text dark:text-white placeholder:text-ink-muted dark:placeholder:text-slate-500 focus:outline-none focus:border-brand resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-black/[0.06] dark:border-white/[0.08]">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-ink-muted dark:text-slate-400 hover:text-ink-text dark:hover:text-white cursor-pointer">
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <SvgSend className="w-3.5 h-3.5" />
              <span>E’lon qilish</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
