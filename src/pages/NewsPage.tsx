import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SvgNewspaper, 
  SvgSearch, 
  SvgCalendar, 
  SvgClock, 
  SvgEye, 
  SvgArrowRight, 
  SvgArrowLeft, 
  SvgSparkles, 
  SvgSend 
} from '../components/icons/CustomIcons';
import { NewsItem, NewsCategory } from '../types';

interface NewsPageProps {
  news: NewsItem[];
}

export const NewsPage: React.FC<NewsPageProps> = ({ news }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('Barchasi');

  const categories: NewsCategory[] = [
    'Barchasi',
    'Akseleratsiya',
    'Hamkorlik',
    'Grantlar',
    'Hakatonlar',
    'Investitsiya',
    'Universitet'
  ];

  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      const matchCat = selectedCategory === 'Barchasi' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = 
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q));

      return matchCat && matchQuery;
    });
  }, [news, selectedCategory, searchQuery]);

  const featuredItem = filteredNews.find(n => n.featured) || filteredNews[0];
  const regularItems = filteredNews.filter(n => n.id !== featuredItem?.id);

  return (
    <div className="min-h-screen pb-24 pt-6 sm:pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Back navigation */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 text-xs font-semibold text-ink-muted dark:text-slate-400 hover:text-ink-text dark:hover:text-white transition-colors shadow-2xs"
          >
            <SvgArrowLeft className="w-3.5 h-3.5" />
            <span>Bosh sahifaga qaytish</span>
          </Link>
        </div>

        {/* Header Title & Description */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-brand uppercase tracking-widest bg-brand/10 dark:bg-brand/20 px-3 py-1 rounded-full">
                NavDU Matbuot
              </span>
              <span className="text-xs text-ink-muted dark:text-slate-400">Rasmiy yangiliklar va e’lonlar</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-ink-text dark:text-white tracking-tight">
              Yangiliklar & Innovatsiyalar
            </h1>
            <p className="text-sm sm:text-base text-ink-muted dark:text-slate-400 max-w-2xl font-normal">
              Navoiy davlat universiteti Inkubatsiya va akseleratsiya markazi hamda Startap Klubi hayotidagi eng so‘nggi yutuqlar, grantlar va B2B hamkorlik xabarlari.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <SvgSearch className="w-4 h-4 text-ink-muted dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Yangiliklarni qidirish..."
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 text-xs text-ink-text dark:text-white focus:outline-none focus:border-brand shadow-xs"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-brand text-white shadow-sm shadow-brand/25'
                  : 'bg-white dark:bg-slate-900 hover:bg-cream-200 dark:hover:bg-slate-800 text-ink-muted dark:text-slate-400 hover:text-ink-text dark:hover:text-white border border-black/[0.06] dark:border-white/[0.08]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Hero Article */}
        {featuredItem && !searchQuery && selectedCategory === 'Barchasi' && (
          <Link
            to={`/news/${featuredItem.id}`}
            className="block group"
          >
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.08] dark:border-white/[0.08] shadow-sm hover:shadow-xl hover:border-brand/40 transition-all overflow-hidden grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-7 relative h-64 sm:h-96 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img 
                  src={featuredItem.coverImage} 
                  alt={featuredItem.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3.5 py-1.5 rounded-full bg-brand text-white text-xs font-black shadow-md flex items-center gap-1.5">
                    <SvgSparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Asosiy yangilik</span>
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-ink-muted dark:text-slate-400">
                    <span className="font-bold px-2.5 py-0.5 rounded-md bg-brand/10 dark:bg-brand/20 text-brand">
                      {featuredItem.category}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <SvgCalendar className="w-3.5 h-3.5" />
                      {featuredItem.date}
                    </span>
                    <span>•</span>
                    <span>{featuredItem.readTime}</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-ink-text dark:text-white group-hover:text-brand transition-colors leading-tight">
                    {featuredItem.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-ink-muted dark:text-slate-400 leading-relaxed line-clamp-4">
                    {featuredItem.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={featuredItem.author.avatar} 
                      alt={featuredItem.author.name} 
                      className="w-8 h-8 rounded-full object-cover border border-black/10 dark:border-white/10"
                    />
                    <span className="text-xs font-bold text-ink-text dark:text-white">{featuredItem.author.name}</span>
                  </div>

                  <span className="text-xs font-bold text-brand group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    <span>Batafsil o‘qish</span>
                    <SvgArrowRight className="w-4 h-4" />
                  </span>
                </div>

              </div>
            </div>
          </Link>
        )}

        {/* Regular News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(searchQuery || selectedCategory !== 'Barchasi' ? filteredNews : regularItems).map((item) => (
            <Link
              key={item.id}
              to={`/news/${item.id}`}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.07] dark:border-white/[0.08] hover:border-brand/40 shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between overflow-hidden"
            >
              <div className="space-y-4">
                {/* Thumbnail */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img 
                    src={item.coverImage} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-ink-text dark:text-white text-[11px] font-bold shadow-xs">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-ink-muted dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <SvgCalendar className="w-3 h-3" />
                      {item.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <SvgClock className="w-3 h-3" />
                      {item.readTime}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-ink-text dark:text-white group-hover:text-brand transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-ink-muted dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 py-4 mt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-xs text-ink-muted dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <SvgEye className="w-3.5 h-3.5" />
                  <span>{item.viewsCount}</span>
                  <span className="ml-1">❤️ {item.likesCount}</span>
                </div>

                <span className="font-bold text-brand group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  <span>O‘qish</span>
                  <SvgArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Telegram Subscription Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-brand via-blue-600 to-indigo-600 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-brand/20">
          <div className="space-y-2 text-center md:text-left">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider inline-block">
              Telegram Matbuot Kanali
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              Yangi grantlar va qabullarni birinchi bo‘lib bilib oling!
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              NavDU Startap Klubi va Inkubatsiya markazining barcha e’lonlari, natijalari hamda imkoniyatlari rasmiy Telegram kanalida muntazam yoritib boriladi.
            </p>
          </div>

          <a 
            href="https://t.me/navdu_startup" 
            target="_blank" 
            rel="noreferrer" 
            className="px-6 py-3.5 rounded-2xl bg-white text-brand font-extrabold text-sm shadow-md hover:scale-105 transition-all shrink-0 flex items-center gap-2"
          >
            <SvgSend className="w-4 h-4" />
            <span>Telegram kanaliga obuna bo‘lish</span>
          </a>
        </div>

      </div>
    </div>
  );
};
