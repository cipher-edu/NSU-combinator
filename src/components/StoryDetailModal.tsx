import React, { useState } from 'react';
import { SvgX, SvgHeart, SvgMessageSquare, SvgSend } from './icons/CustomIcons';
import { Story, Comment } from '../types';

interface StoryDetailModalProps {
  story: Story | null;
  onClose: () => void;
  onLike: (id: string) => void;
  onAddComment: (storyId: string, comment: Comment) => void;
}

export const StoryDetailModal: React.FC<StoryDetailModalProps> = ({
  story,
  onClose,
  onLike,
  onAddComment
}) => {
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');

  if (!story) return null;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: `c_${Date.now()}`,
      author: authorName.trim() || 'NavDU Talabasi',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: authorRole.trim() || 'Startap a’zosi',
      text: commentText.trim(),
      date: 'Hozirgina'
    };

    onAddComment(story.id, newComment);
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-800/90 text-ink-muted hover:text-ink-text dark:text-slate-400 dark:hover:text-white flex items-center justify-center border border-black/10 dark:border-white/10 shadow-xs cursor-pointer transition-colors"
        >
          <SvgX className="w-5 h-5" />
        </button>

        {/* Story Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img 
                src={story.authorAvatar} 
                alt={story.authorName} 
                className="w-12 h-12 rounded-full object-cover border-2 border-brand/30" 
              />
              <div>
                <h4 className="text-base font-bold text-ink-text dark:text-white">{story.authorName}</h4>
                <p className="text-xs text-brand font-semibold">{story.authorRole} • <span className="text-ink-muted dark:text-slate-400">{story.startupName}</span></p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-ink-muted dark:text-slate-400 font-mono">
              <span>{story.date}</span>
              <span>•</span>
              <span>{story.readTime}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-ink-text dark:text-white tracking-tight leading-snug">
              {story.title}
            </h1>
          </div>

          <div className="text-ink-text dark:text-slate-200 text-sm sm:text-base leading-relaxed border-b border-black/[0.06] dark:border-white/[0.08] pb-6">
            {story.content.includes('<') ? (
              <div 
                className="prose dark:prose-invert max-w-none space-y-4"
                dangerouslySetInnerHTML={{ __html: story.content }} 
              />
            ) : (
              <div className="whitespace-pre-line">{story.content}</div>
            )}
          </div>

          {/* Likes & Tags */}
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {story.tags.map((t, idx) => (
                <span key={idx} className="text-xs px-2.5 py-1 rounded-md bg-cream-200 dark:bg-slate-800 text-ink-muted dark:text-slate-400 font-medium">
                  #{t}
                </span>
              ))}
            </div>

            <button
              onClick={() => onLike(story.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                story.likedByUser
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/40'
                  : 'bg-white dark:bg-slate-800 text-ink-muted dark:text-slate-400 border-black/10 dark:border-white/10 hover:text-ink-text dark:hover:text-white'
              }`}
            >
              <SvgHeart className={`w-4 h-4 ${story.likedByUser ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{story.likes} like</span>
            </button>
          </div>

          {/* Comments */}
          <div className="pt-4 space-y-4">
            <h3 className="text-base font-bold text-ink-text dark:text-white flex items-center gap-2">
              <SvgMessageSquare className="w-4 h-4 text-brand dark:text-blue-400" />
              <span>Fikr-mulohazalar ({story.comments.length})</span>
            </h3>

            <form onSubmit={handleCommentSubmit} className="p-4 rounded-2xl bg-cream-100 dark:bg-slate-800/60 border border-black/[0.06] dark:border-white/[0.08] space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Ismingiz (masalan: Rustam Zokirov)"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 text-xs text-ink-text dark:text-white placeholder-ink-muted dark:placeholder-slate-500 focus:outline-none focus:border-brand"
                />
                <input
                  type="text"
                  placeholder="Fakultet / Kasbingiz (masalan: IT 3-kurs)"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 text-xs text-ink-text dark:text-white placeholder-ink-muted dark:placeholder-slate-500 focus:outline-none focus:border-brand"
                />
              </div>

              <textarea
                placeholder="Fikringiz yoki muallifga savolingiz..."
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 text-xs text-ink-text dark:text-white placeholder-ink-muted dark:placeholder-slate-500 focus:outline-none focus:border-brand resize-none"
                required
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <SvgSend className="w-3.5 h-3.5" />
                  <span>Fikr qoldirish</span>
                </button>
              </div>
            </form>

            <div className="space-y-2.5">
              {story.comments.map(c => (
                <div key={c.id} className="p-3.5 rounded-xl bg-cream-50 dark:bg-slate-800/40 border border-black/[0.06] dark:border-white/[0.08] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-ink-text dark:text-white">{c.author} <span className="text-[10px] text-ink-muted dark:text-slate-400 font-normal">• {c.role}</span></span>
                    <span className="text-[10px] text-ink-muted dark:text-slate-400">{c.date}</span>
                  </div>
                  <p className="text-xs text-ink-text dark:text-slate-300 leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
