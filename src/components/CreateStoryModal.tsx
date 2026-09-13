import React, { useState } from 'react';
import { SvgX, SvgSend } from './icons/CustomIcons';
import { Story } from '../types';

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (story: Story) => void;
}

export const CreateStoryModal: React.FC<CreateStoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [startupName, setStartupName] = useState('');
  const [tags, setTags] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !authorName.trim()) return;

    const newStory: Story = {
      id: `story_${Date.now()}`,
      title: title.trim(),
      excerpt: content.trim().slice(0, 120) + '...',
      content: content.trim(),
      authorName: authorName.trim(),
      authorRole: authorRole.trim() || 'Startap asoschisi',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      startupName: startupName.trim() || 'NavDU Startapi',
      date: 'Bugun',
      readTime: '3 daqiqa',
      likes: 1,
      likedByUser: true,
      commentsCount: 0,
      comments: [],
      tags: tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    onSubmit(newStory);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden my-8">
        
        <div className="p-6 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-ink-text dark:text-white">Startap tajribangizni ulashing</h3>
            <p className="text-xs text-ink-muted dark:text-slate-400">Akseleratsiya davomida olgan darslaringiz va yutuqlaringizni yozing</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-cream-200 dark:bg-slate-800 hover:bg-cream-300 dark:hover:bg-slate-700 flex items-center justify-center text-ink-muted dark:text-slate-400 cursor-pointer">
            <SvgX className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-text dark:text-slate-300 mb-1">Ism va familiyangiz *</label>
              <input
                type="text"
                placeholder="Sardor Aliyev"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 text-xs text-ink-text dark:text-white placeholder:text-ink-muted dark:placeholder:text-slate-500 focus:outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-text dark:text-slate-300 mb-1">Startap / Rolingiz</label>
              <input
                type="text"
                placeholder="AgroSmart CEO, 4-kurs talabasi"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 text-xs text-ink-text dark:text-white placeholder:text-ink-muted dark:placeholder:text-slate-500 focus:outline-none focus:border-brand"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-text dark:text-slate-300 mb-1">Sarlavha *</label>
            <input
              type="text"
              placeholder="Qanday qilib 1 oyda birinchi mijozlarni topdik?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 text-xs font-bold text-ink-text dark:text-white placeholder:text-ink-muted dark:placeholder:text-slate-500 focus:outline-none focus:border-brand"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-text dark:text-slate-300 mb-1">Maqola matni / Hikoyangiz *</label>
            <textarea
              rows={5}
              placeholder="Qanday muammolarga duch keldingiz? Qanday xatolardan saboq oldingiz?.."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 text-xs text-ink-text dark:text-white placeholder:text-ink-muted dark:placeholder:text-slate-500 focus:outline-none focus:border-brand resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-text dark:text-slate-300 mb-1">Teglar (vergul bilan)</label>
            <input
              type="text"
              placeholder="Tajriba, AI, DemoDay, Sotuv"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-slate-800 border border-black/10 dark:border-white/10 text-xs text-ink-text dark:text-white placeholder:text-ink-muted dark:placeholder:text-slate-500 focus:outline-none focus:border-brand"
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
              <span>Chop etish</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
