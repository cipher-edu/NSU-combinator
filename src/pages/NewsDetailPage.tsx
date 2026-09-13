import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  SvgArrowLeft, 
  SvgCalendar, 
  SvgClock, 
  SvgEye, 
  SvgHeart, 
  SvgShare, 
  SvgCheck, 
  SvgMessageSquare, 
  SvgSend, 
  SvgAlertCircle, 
  SvgBookmark, 
  SvgNewspaper 
} from '../components/icons/CustomIcons';
import { NewsItem, Comment } from '../types';

interface NewsDetailPageProps {
  news: NewsItem[];
  onLikeNews?: (id: string) => void;
  onAddComment?: (newsId: string, comment: Comment) => void;
}

export const NewsDetailPage: React.FC<NewsDetailPageProps> = ({
  news,
  onLikeNews,
  onAddComment
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const item = news.find(n => n.id === id);

  const [copied, setCopied] = useState(false);
  const [likes, setLikes] = useState(item?.likesCount || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Comments state
  const [commentName, setCommentName] = useState('');
  const [commentRole, setCommentRole] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentsList, setCommentsList] = useState<Comment[]>(() => {
    return item?.comments || [
      {
        id: 'nc-1',
        author: 'Jasur Bekmurodov',
        role: 'NavDU Talabasi',
        avatar: 'https://images.unsplash.com/photo-1535713875002?w=120&auto=format&fit=crop&q=80',
        text: 'Ajoyib tashabbus! Universitetimizda bunday imkoniyatlar yaratilayotganidan juda xursandmiz. Biz ham jamoamiz bilan ariza topshirmoqchimiz.',
        date: '1 kun oldin'
      }
    ];
  });

  if (!item) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-16 h-16 rounded-2xl bg-brand/10 text-brand flex items-center justify-center mb-4">
          <SvgAlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-ink-text">Yangilik topilmadi</h2>
        <p className="text-sm text-ink-muted mt-2 max-w-md">
          Siz qidirayotgan yangilik maqolasi mavjud emas yoki o‘chirilgan bo‘lishi mumkin.
        </p>
        <Link 
          to="/news" 
          className="mt-6 px-6 py-3 rounded-xl bg-brand text-white font-bold text-xs shadow-md shadow-brand/25"
        >
          Barcha yangiliklarga qaytish
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleLike = () => {
    if (!hasLiked) {
      setLikes(prev => prev + 1);
      setHasLiked(true);
      if (onLikeNews) onLikeNews(item.id);

      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#2563EB', '#38BDF8', '#F43F5E']
      });
    } else {
      setLikes(prev => prev - 1);
      setHasLiked(false);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      author: commentName.trim(),
      role: commentRole.trim() || 'NavDU Talabasi',
      avatar: `https://images.unsplash.com/photo-${1535713875002 + Math.floor(Math.random() * 50)}?w=120&auto=format&fit=crop&q=80`,
      text: commentText.trim(),
      date: 'Hozirgina'
    };

    setCommentsList([newComment, ...commentsList]);
    if (onAddComment) onAddComment(item.id, newComment);

    setCommentName('');
    setCommentRole('');
    setCommentText('');
  };

  const relatedNews = news.filter(n => n.id !== item?.id).slice(0, 3);

  if (!item) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-16 h-16 rounded-2xl bg-brand/10 text-brand flex items-center justify-center mb-4">
          <SvgAlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-ink-text">Yangilik topilmadi</h2>
        <p className="text-sm text-ink-muted mt-2 max-w-md">
          Siz qidirayotgan yangilik maqolasi mavjud emas yoki o‘chirilgan bo‘lishi mumkin.
        </p>
        <Link 
          to="/news" 
          className="mt-6 px-6 py-3 rounded-xl bg-brand text-white font-bold text-xs shadow-md shadow-brand/25"
        >
          Barcha yangiliklarga qaytish
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-slate-950 text-ink-text dark:text-white pt-24 pb-20 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-xs font-semibold text-ink-muted dark:text-slate-400">
            <Link to="/" className="hover:text-brand transition-colors">Bosh sahifa</Link>
            <span>/</span>
            <Link to="/news" className="hover:text-brand transition-colors">Yangiliklar</Link>
            <span>/</span>
            <span className="text-ink-text dark:text-white font-bold truncate max-w-[200px] sm:max-w-none">{item.title}</span>
          </nav>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 text-xs font-semibold text-ink-muted dark:text-slate-400 hover:text-ink-text dark:hover:text-white hover:bg-cream-100 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
          >
            <SvgArrowLeft className="w-3.5 h-3.5" />
            <span>Orqaga</span>
          </button>
        </div>

        {/* Article Header Card */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.08] dark:border-white/[0.08] shadow-sm space-y-6">
          
          <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted dark:text-slate-400">
            <span className="px-3 py-1 rounded-full bg-brand/10 dark:bg-brand/20 text-brand font-bold border border-brand/20">
              {item.category}
            </span>
            <span className="flex items-center gap-1">
              <SvgCalendar className="w-3.5 h-3.5" />
              {item.date}
            </span>
            <span className="flex items-center gap-1">
              <SvgClock className="w-3.5 h-3.5" />
              {item.readTime}
            </span>
            <span className="flex items-center gap-1">
              <SvgEye className="w-3.5 h-3.5" />
              {item.viewsCount} ko‘rildi
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-ink-text dark:text-white tracking-tight leading-[1.18]">
            {item.title}
          </h1>

          <p className="text-base sm:text-xl text-ink-muted dark:text-slate-300 font-medium leading-relaxed italic border-l-4 border-brand pl-4">
            "{item.excerpt}"
          </p>

          {/* Author & Action Strip */}
          <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <img 
                src={item.author.avatar} 
                alt={item.author.name} 
                className="w-11 h-11 rounded-2xl object-cover border border-black/10 dark:border-white/10 shadow-xs"
              />
              <div>
                <h4 className="font-extrabold text-sm text-ink-text dark:text-white">{item.author.name}</h4>
                <p className="text-xs text-ink-muted dark:text-slate-400">{item.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLike}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  hasLiked
                    ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/40'
                    : 'bg-cream-100 dark:bg-slate-800 text-ink-muted dark:text-slate-300 border-black/10 dark:border-white/10 hover:text-rose-600'
                }`}
              >
                <SvgHeart className={`w-4 h-4 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{likes}</span>
              </motion.button>

              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                  isBookmarked 
                    ? 'bg-brand text-white border-brand' 
                    : 'bg-cream-100 dark:bg-slate-800 text-ink-muted dark:text-slate-300 border-black/10 dark:border-white/10 hover:text-ink-text dark:hover:text-white'
                }`}
                title="Saqlash"
              >
                <SvgBookmark className="w-4 h-4" />
              </button>

              <button
                onClick={handleShare}
                className="px-3 py-2 rounded-xl bg-cream-100 dark:bg-slate-800 hover:bg-cream-200 dark:hover:bg-slate-700 border border-black/10 dark:border-white/10 text-ink-text dark:text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Ulashish"
              >
                {copied ? (
                  <>
                    <SvgCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Nusxalandi</span>
                  </>
                ) : (
                  <>
                    <SvgShare className="w-3.5 h-3.5" />
                    <span>Ulashish</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* Cover Photo */}
        <div className="rounded-3xl overflow-hidden shadow-sm border border-black/[0.08] dark:border-white/[0.08] max-h-[440px] bg-slate-100 dark:bg-slate-800">
          <img 
            src={item.coverImage} 
            alt={item.title} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.08] dark:border-white/[0.08] shadow-sm space-y-6 text-slate-800 dark:text-slate-200 leading-relaxed text-sm sm:text-base">
          <div className="prose dark:prose-invert max-w-none space-y-4 leading-relaxed">
            {item.content.includes('<') ? (
              <div 
                className="rich-text-content space-y-4"
                dangerouslySetInnerHTML={{ __html: item.content }} 
              />
            ) : (
              item.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="leading-relaxed">
                  {paragraph}
                </p>
              ))
            )}
          </div>

          {/* Tags */}
          <div className="pt-6 border-t border-black/[0.06] dark:border-white/[0.08] flex flex-wrap gap-2">
            {item.tags.map((t, idx) => (
              <span key={idx} className="px-3 py-1 rounded-lg bg-cream-200 dark:bg-slate-800 text-ink-text dark:text-white text-xs font-semibold">
                #{t}
              </span>
            ))}
          </div>
        </div>

        {/* Comments Section */}
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.08] dark:border-white/[0.08] shadow-sm space-y-4">
            <h3 className="text-xl font-black text-ink-text dark:text-white flex items-center gap-2">
              <SvgMessageSquare className="w-5 h-5 text-brand" />
              <span>Fikr va Mulohazalar ({commentsList.length})</span>
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input 
                  type="text"
                  required
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  placeholder="Ismingiz"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs focus:outline-none focus:border-brand bg-cream-100/50 dark:bg-slate-800 text-ink-text dark:text-white"
                />
                <input 
                  type="text"
                  value={commentRole}
                  onChange={(e) => setCommentRole(e.target.value)}
                  placeholder="Fakultet yoki tashkilotingiz"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs focus:outline-none focus:border-brand bg-cream-100/50 dark:bg-slate-800 text-ink-text dark:text-white"
                />
              </div>

              <textarea 
                required
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Ushbu yangilik haqida fikringiz..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs focus:outline-none focus:border-brand bg-cream-100/50 dark:bg-slate-800 text-ink-text dark:text-white resize-none"
              />

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold shadow-md shadow-brand/25 transition-all flex items-center gap-2 cursor-pointer"
              >
                <SvgSend className="w-3.5 h-3.5" />
                <span>Fikr qoldirish</span>
              </button>
            </form>
          </div>

          {/* Comments Feed */}
          <div className="space-y-3">
            {commentsList.map((c) => (
              <div key={c.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-black/[0.06] dark:border-white/[0.08] shadow-2xs space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <img 
                      src={c.avatar} 
                      alt={c.author} 
                      className="w-9 h-9 rounded-full object-cover border border-black/10 dark:border-white/10"
                    />
                    <div>
                      <h5 className="font-extrabold text-xs text-ink-text dark:text-white">{c.author}</h5>
                      <span className="text-[10px] text-ink-muted dark:text-slate-400">{c.role}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-ink-muted dark:text-slate-400">{c.date}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-12">
                  {c.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <div className="pt-8 space-y-4">
            <h3 className="text-xl font-black text-ink-text dark:text-white">Boshqa so‘nggi yangiliklar</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedNews.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/news/${rel.id}`}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-black/[0.07] dark:border-white/[0.08] hover:border-brand/40 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-brand uppercase tracking-wider block">
                      {rel.category}
                    </span>
                    <h4 className="font-bold text-sm text-ink-text dark:text-white group-hover:text-brand transition-colors line-clamp-2 leading-snug">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-ink-muted dark:text-slate-400 line-clamp-2">{rel.excerpt}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-xs text-ink-muted dark:text-slate-400">
                    <span>{rel.date}</span>
                    <span className="text-brand font-bold group-hover:translate-x-1 transition-transform">O‘qish &rarr;</span>
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
