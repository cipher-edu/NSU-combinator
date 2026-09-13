import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SvgPlus, SvgHeart, SvgMessageSquare } from './icons/CustomIcons';
import { Story } from '../types';

interface StoriesSectionProps {
  stories: Story[];
  onSelectStory?: (story: Story) => void;
  onLike: (id: string, e: React.MouseEvent) => void;
  onOpenCreateStory: () => void;
}

export const StoriesSection: React.FC<StoriesSectionProps> = ({
  stories,
  onSelectStory,
  onLike,
  onOpenCreateStory
}) => {
  const navigate = useNavigate();
  return (
    <section className="py-20 sm:py-28 border-t border-black/[0.06] dark:border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-black/[0.06] dark:border-white/[0.08]">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-mono font-bold text-brand dark:text-blue-400 uppercase tracking-widest bg-brand/10 dark:bg-brand/20 px-3 py-1 rounded-full">
                04 / Kundalik
              </span>
              <span className="text-xs text-ink-muted dark:text-slate-400">Dastur ichkarisidan</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-ink-text dark:text-white tracking-tight">
              Startaperlar hayoti & hikoyalari
            </h2>
            <p className="mt-2 text-sm text-ink-muted dark:text-slate-300 max-w-xl">
              Akseleratsiya ishtirokchilarining haqiqiy tajribalari, muvaffaqiyatlari, xatolari va o‘rgangan saboqlari.
            </p>
          </div>

          <button
            onClick={onOpenCreateStory}
            className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 hover:bg-cream-200 dark:hover:bg-slate-800 text-ink-text dark:text-white font-bold text-xs sm:text-sm border border-black/10 dark:border-white/10 shadow-xs flex items-center gap-2 self-start sm:self-auto transition-all hover:scale-105 cursor-pointer"
          >
            <SvgPlus className="w-4 h-4 text-brand dark:text-blue-400" />
            <span>O‘z hikoyangizni yozing</span>
          </button>
        </div>

        {/* Stories Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <div
              key={story.id}
              onClick={() => {
                if (onSelectStory) onSelectStory(story);
                navigate(`/story/${story.id}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="cursor-pointer p-6 rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.06] dark:border-white/[0.08] hover:border-brand/40 dark:hover:border-brand/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img 
                    src={story.authorAvatar} 
                    alt={story.authorName} 
                    className="w-10 h-10 rounded-full object-cover border border-black/10 dark:border-white/10"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-ink-text dark:text-white">{story.authorName}</h4>
                    <p className="text-[10px] text-brand dark:text-blue-400 font-semibold">{story.authorRole} • <span className="text-ink-muted dark:text-slate-400">{story.startupName}</span></p>
                  </div>
                </div>

                <h3 className="text-base font-bold text-ink-text dark:text-white group-hover:text-brand dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">
                  {story.title}
                </h3>

                <p className="text-xs text-ink-muted dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {story.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-xs text-ink-muted dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <span>{story.date}</span>
                  <span>•</span>
                  <span>{story.readTime}</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => onLike(story.id, e)}
                    className={`flex items-center gap-1 hover:text-rose-600 transition-colors cursor-pointer ${
                      story.likedByUser ? 'text-rose-600 font-bold' : ''
                    }`}
                  >
                    <SvgHeart className={`w-3.5 h-3.5 ${story.likedByUser ? 'fill-rose-600' : ''}`} />
                    <span>{story.likes}</span>
                  </button>

                  <span className="flex items-center gap-1">
                    <SvgMessageSquare className="w-3.5 h-3.5" />
                    <span>{story.comments.length}</span>
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
