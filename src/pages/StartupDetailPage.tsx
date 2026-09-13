import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  SvgArrowLeft, 
  SvgExternalLink, 
  SvgShare, 
  SvgCheck, 
  SvgTrendingUp, 
  SvgUsers, 
  SvgFileText, 
  SvgSend, 
  SvgSparkles, 
  SvgBuilding2, 
  SvgCheckCircle2, 
  SvgAlertCircle, 
  SvgCpu, 
  SvgLayers, 
  SvgPieChart, 
  SvgMessageSquare, 
  SvgStar, 
  SvgBriefcase, 
  SvgDownload, 
  SvgCalendar, 
  SvgX,
  SvgPitchDeck 
} from '../components/icons/CustomIcons';
import { Startup, Comment } from '../types';
import { PitchDeckViewer } from '../components/PitchDeckViewer';

interface StartupDetailPageProps {
  startups: Startup[];
  onUpvote: (id: string, e?: React.MouseEvent) => void;
  onAddComment?: (startupId: string, comment: Comment) => void;
}

export const StartupDetailPage: React.FC<StartupDetailPageProps> = ({
  startups,
  onUpvote,
  onAddComment
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const startup = startups.find(s => s.id === id);

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'deck' | 'tech' | 'market' | 'team' | 'comments'>('overview');
  
  // Investor modal state
  const [isInvestorModalOpen, setIsInvestorModalOpen] = useState(false);
  const [investorSent, setInvestorSent] = useState(false);
  const [investorForm, setInvestorForm] = useState({ name: '', organization: '', phone: '', note: '' });

  // Pitch deck modal state
  const [isPitchDeckModalOpen, setIsPitchDeckModalOpen] = useState(false);

  // New Comment state
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentRole, setNewCommentRole] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentRating, setNewCommentRating] = useState(5);
  const [localComments, setLocalComments] = useState<Comment[]>(() => {
    return startup?.comments || [
      {
        id: 'c1',
        author: 'Prof. Anvar Hakimov',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
        role: 'NavDU Ilmiy ishlar bo‘yicha prorektor',
        text: 'Loyiha mintaqamizning dolzarb muammosiga juda to‘g‘ri va amaliy yechim taklif qilgan. Universitet laboratoriyasida 3D prototipi muvaffaqiyatli sinovdan o‘tkazildi.',
        date: '2 kun oldin'
      },
      {
        id: 'c2',
        author: 'Sardorbek Tohirov',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
        role: 'IT Park Navoiy inkubatsiya rezidenti',
        text: 'Arxitekturasi va AI modellarini integratsiyalash uslubi juda yaxshi ishlangan. Keyingi bosqichda mobil ilova bilan yanada kengaytirishni maslahat beraman.',
        date: 'Bugun'
      }
    ];
  });

  if (!startup) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-16 h-16 rounded-2xl bg-brand/10 text-brand flex items-center justify-center mb-4">
          <SvgAlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-ink-text">Startap topilmadi</h2>
        <p className="text-sm text-ink-muted mt-2 max-w-md">
          Siz qidirayotgan startap mavjud emas yoki o‘chirilgan bo‘lishi mumkin.
        </p>
        <Link 
          to="/portfolio" 
          className="mt-6 px-6 py-3 rounded-xl bg-brand text-white font-bold text-xs shadow-md shadow-brand/25"
        >
          Startaplar portfeliga qaytish
        </Link>
      </div>
    );
  }

  const relatedStartups = startups.filter(s => s.id !== startup.id).slice(0, 3);

  // Handle Share / Copy Link
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Handle Upvote with confetti
  const handleUpvoteClick = (e: React.MouseEvent) => {
    onUpvote(startup.id, e);
    if (!startup.upvotedByUser) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#2563EB', '#38BDF8', '#F59E0B']
      });
    }
  };

  // Handle submit comment
  const handleAddCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim()) return;

    const newC: Comment = {
      id: Date.now().toString(),
      author: newCommentName.trim(),
      role: newCommentRole.trim() || 'NavDU Talabasi',
      avatar: `https://images.unsplash.com/photo-${1535713875002 + Math.floor(Math.random() * 100)}?w=120&auto=format&fit=crop&q=80`,
      text: newCommentText.trim(),
      date: 'Hozirgina'
    };

    setLocalComments([newC, ...localComments]);
    if (onAddComment) {
      onAddComment(startup.id, newC);
    }
    setNewCommentName('');
    setNewCommentRole('');
    setNewCommentText('');
  };

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-slate-950 text-ink-text dark:text-white pt-24 pb-20 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Breadcrumb & Back bar */}
        <div className="flex items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-xs font-semibold text-ink-muted dark:text-slate-400">
            <Link to="/" className="hover:text-brand transition-colors">Bosh sahifa</Link>
            <span>/</span>
            <Link to="/portfolio" className="hover:text-brand transition-colors">Startaplar</Link>
            <span>/</span>
            <span className="text-ink-text dark:text-white font-bold">{startup.name}</span>
          </nav>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 text-xs font-semibold text-ink-muted dark:text-slate-400 hover:text-ink-text dark:hover:text-white hover:bg-cream-100 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
          >
            <SvgArrowLeft className="w-3.5 h-3.5" />
            <span>Orqaga</span>
          </button>
        </div>

        {/* Hero Banner Card */}
        <div className="relative rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.08] dark:border-white/[0.08] shadow-sm overflow-hidden">
          
          {/* Cover photo */}
          <div className="relative h-48 sm:h-72 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
            {startup.bannerImage ? (
              <img 
                src={startup.bannerImage} 
                alt={startup.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 flex items-center justify-center text-6xl">
                {startup.logo}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            
            {/* Badges on cover */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-xs font-bold text-ink-text dark:text-white shadow-sm">
                {startup.batch}
              </span>
              <span className="px-3 py-1 rounded-full bg-brand text-white text-xs font-black shadow-sm">
                {startup.stage}
              </span>
            </div>

            {/* Quick action buttons on cover */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={handleShare}
                className="px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-ink-text dark:text-white text-xs font-bold flex items-center gap-1.5 shadow-md backdrop-blur-md transition-all active:scale-95 cursor-pointer"
                title="Havolani nusxalash"
              >
                {copied ? (
                  <>
                    <SvgCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Nusxalandi!</span>
                  </>
                ) : (
                  <>
                    <SvgShare className="w-3.5 h-3.5 text-ink-muted" />
                    <span>Ulashish</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Profile Header Row */}
          <div className="p-6 sm:p-8 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 sm:-mt-20">
              
              {/* Logo & Identity */}
              <div className="flex items-end gap-4 sm:gap-6">
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-3xl bg-white dark:bg-slate-800 p-2 border-2 border-white dark:border-slate-700 shadow-xl flex items-center justify-center text-4xl sm:text-6xl shrink-0 z-10">
                  <div className="w-full h-full rounded-2xl bg-cream-100 dark:bg-slate-900 flex items-center justify-center">
                    {startup.logo}
                  </div>
                </div>

                <div className="space-y-1 pb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl sm:text-4xl font-black text-ink-text dark:text-white tracking-tight">
                      {startup.name}
                    </h1>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand/10 dark:bg-brand/20 text-brand border border-brand/20">
                      {startup.category}
                    </span>
                  </div>
                  <p className="text-xs sm:text-base text-ink-muted dark:text-slate-400 font-medium max-w-2xl leading-snug">
                    {startup.tagline}
                  </p>
                </div>
              </div>

              {/* Upvote & Primary Actions */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={handleUpvoteClick}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl border text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer ${
                    startup.upvotedByUser
                      ? 'bg-brand text-white border-brand shadow-brand/25'
                      : 'bg-white dark:bg-slate-800 text-ink-text dark:text-white border-black/10 dark:border-white/10 hover:border-brand/40 hover:bg-cream-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="text-base leading-none">▲</span>
                  <span>{startup.upvotedByUser ? 'Ovoz berildi' : 'Ovoz berish'}</span>
                  <span className="px-2 py-0.5 rounded-md bg-black/10 dark:bg-white/10 text-xs font-black">
                    {startup.upvotes}
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setIsInvestorModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <SvgBriefcase className="w-4 h-4" />
                  <span>Investor so‘rovi</span>
                </motion.button>
              </div>

            </div>

            {/* Quick Links & Traction Metrics Strip */}
            <div className="mt-8 pt-6 border-t border-black/[0.06] dark:border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-2xl bg-cream-100/80 dark:bg-slate-800/80 border border-black/[0.05] dark:border-white/[0.06]">
                <span className="text-[11px] font-bold text-ink-muted dark:text-slate-400 uppercase tracking-wider block">Jalb qilingan</span>
                <span className="text-base sm:text-xl font-black text-brand font-mono-num mt-0.5 block">
                  {startup.raisedAmount || 'Akseleratsiyada'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-cream-100/80 dark:bg-slate-800/80 border border-black/[0.05] dark:border-white/[0.06]">
                <span className="text-[11px] font-bold text-ink-muted dark:text-slate-400 uppercase tracking-wider block">Foydalanuvchilar</span>
                <span className="text-base sm:text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono-num mt-0.5 block">
                  {startup.metrics.users || 'Sinov bosqichida'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-cream-100/80 dark:bg-slate-800/80 border border-black/[0.05] dark:border-white/[0.06]">
                <span className="text-[11px] font-bold text-ink-muted dark:text-slate-400 uppercase tracking-wider block">Sinov maydoni</span>
                <span className="text-base sm:text-xl font-black text-ink-text dark:text-white font-mono-num mt-0.5 block truncate">
                  {startup.metrics.pilotLocations || 'NavDU'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-cream-100/80 dark:bg-slate-800/80 border border-black/[0.05] dark:border-white/[0.06]">
                <span className="text-[11px] font-bold text-ink-muted dark:text-slate-400 uppercase tracking-wider block">Grant / Yutuq</span>
                <span className="text-base sm:text-xl font-black text-amber-600 dark:text-amber-400 font-mono-num mt-0.5 block">
                  {startup.metrics.grantWon || 'Top 10 Innovator'}
                </span>
              </div>
            </div>

            {/* Outgoing External Links Strip */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
              {startup.website && (
                <a 
                  href={startup.website} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 text-ink-text dark:text-white hover:border-brand hover:text-brand font-bold transition-all shadow-xs"
                >
                  <SvgExternalLink className="w-3.5 h-3.5" />
                  <span>Rasmiy veb-sayt</span>
                </a>
              )}

              <button 
                onClick={() => setActiveTab('deck')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 text-ink-text dark:text-white hover:border-brand hover:text-brand font-bold transition-all shadow-xs cursor-pointer"
              >
                <SvgPitchDeck className="w-4 h-4 text-brand" />
                <span>Pitch Deck (Slaydlar)</span>
              </button>

              {startup.founders[0]?.telegram && (
                <a 
                  href={`https://t.me/${startup.founders[0].telegram.replace('@', '')}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-brand border border-brand/20 font-bold transition-all hover:bg-brand hover:text-white"
                >
                  <SvgSend className="w-3.5 h-3.5" />
                  <span>Asoschi bilan Telegramda bog‘lanish</span>
                </a>
              )}
            </div>

          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 border-b border-black/[0.08] dark:border-white/[0.08] pb-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Loyiha haqida', icon: SvgLayers },
            { id: 'deck', label: 'Pitch Deck Taqdimoti', icon: SvgPitchDeck },
            { id: 'tech', label: 'Texnologik stak', icon: SvgCpu },
            { id: 'market', label: 'Bozor & Metrikalar', icon: SvgPieChart },
            { id: 'team', label: 'Asoschilar & Jamoa', icon: SvgUsers },
            { id: 'comments', label: `Fikrlar (${localComments.length})`, icon: SvgMessageSquare },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                  isActive ? 'text-brand bg-brand/10 dark:bg-brand/20' : 'text-ink-muted dark:text-slate-400 hover:text-ink-text dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.04]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="startupTabActivePill" 
                    className="absolute bottom-0 inset-x-2 h-0.5 bg-brand rounded-full" 
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="space-y-8">
          
          {/* PITCH DECK TAB */}
          {activeTab === 'deck' && (
            <div className="space-y-6">
              <PitchDeckViewer startup={startup} />
            </div>
          )}

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                
                {/* Full Description */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.07] dark:border-white/[0.08] shadow-xs space-y-4">
                  <h3 className="text-lg font-black text-ink-text dark:text-white flex items-center gap-2">
                    <SvgSparkles className="w-5 h-5 text-brand" />
                    <span>Loyiha maqsadi va vazifasi</span>
                  </h3>
                  <p className="text-sm sm:text-base text-ink-muted dark:text-slate-300 leading-relaxed whitespace-pre-line font-normal">
                    {startup.fullDescription}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2">
                    {startup.tags.map((t, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-lg bg-cream-200 dark:bg-slate-800 text-ink-text dark:text-white text-xs font-semibold">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Problem vs Solution split */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-6 rounded-3xl bg-red-50/50 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/40 space-y-2.5">
                    <div className="flex items-center gap-2 text-red-700 dark:text-red-400 text-xs font-black uppercase tracking-wider">
                      <SvgAlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span>Muammo</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {startup.problem}
                    </p>
                  </div>

                  <div className="p-6 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-2.5">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 text-xs font-black uppercase tracking-wider">
                      <SvgCheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Bizning Yechim</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {startup.solution}
                    </p>
                  </div>
                </div>

              </div>

              {/* Sidebar Info Card */}
              <div className="space-y-6">
                <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.07] dark:border-white/[0.08] shadow-xs space-y-4">
                  <h4 className="font-extrabold text-sm text-ink-text dark:text-white uppercase tracking-wider">
                    Universitet aloqadorligi
                  </h4>
                  
                  <div className="space-y-3 text-xs">
                    <div className="flex items-start gap-2.5">
                      <SvgBuilding2 className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-ink-text dark:text-white block">Navoiy Davlat Universiteti</span>
                        <span className="text-ink-muted dark:text-slate-400">{startup.founders[0]?.faculty || 'Inkubatsiya va Akseleratsiya Markazi'}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <SvgCalendar className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-ink-text dark:text-white block">Qabul qilingan sana</span>
                        <span className="text-ink-muted dark:text-slate-400">{startup.createdAt}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <SvgTrendingUp className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-ink-text dark:text-white block">Rivojlanish bosqichi</span>
                        <span className="text-brand font-bold">{startup.stage}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setIsInvestorModalOpen(true)}
                      className="w-full py-3 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs shadow-md shadow-brand/25 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <SvgBriefcase className="w-4 h-4" />
                      <span>Hamkorlik taklif qilish</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TECH STACK TAB */}
          {activeTab === 'tech' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.07] dark:border-white/[0.08] shadow-xs space-y-6">
              <div>
                <h3 className="text-xl font-black text-ink-text dark:text-white">Texnologik arxitektura va stak</h3>
                <p className="text-xs sm:text-sm text-ink-muted dark:text-slate-400 mt-1">
                  Loyihada qo‘llanilgan zamonaviy dasturiy ta’minot, AI modellar va apparat ta’minoti datchiklari.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {(startup.techStack || ['Python', 'TensorFlow & PyTorch', 'FastAPI', 'React 19', 'IoT ESP32', 'LoRaWAN', 'PostgreSQL', 'Tailwind CSS']).map((tech, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-cream-100 dark:bg-slate-800 border border-black/[0.06] dark:border-white/[0.08] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-brand/10 dark:bg-brand/20 text-brand font-black flex items-center justify-center text-xs">
                      #{idx + 1}
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-ink-text dark:text-white">{tech}</span>
                  </div>
                ))}
              </div>

              <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <strong>💡 Texnik xususiyat:</strong> Ushbu arxitektura NavDU Inkubatsiya markazining 3D prototiplash va elektronika laboratoriyasi imkoniyatlaridan to‘liq foydalangan holda mahalliy sharoitlarga to‘liq moslashtirilgan.
              </div>
            </div>
          )}

          {/* MARKET & METRICS TAB */}
          {activeTab === 'market' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.07] dark:border-white/[0.08] shadow-xs space-y-6">
              <div>
                <h3 className="text-xl font-black text-ink-text dark:text-white">Bozor hajmi va ko‘rsatkichlar</h3>
                <p className="text-xs sm:text-sm text-ink-muted dark:text-slate-400 mt-1">
                  Target auditoriya, potensial bozor (TAM/SAM/SOM) va dastlabki traksiya.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-cream-100 dark:bg-slate-800 border border-black/[0.06] dark:border-white/[0.08] space-y-1 text-center">
                  <span className="text-xs font-bold text-ink-muted dark:text-slate-400 uppercase">TAM (Umumiy bozor)</span>
                  <span className="text-2xl font-black text-ink-text dark:text-white font-mono-num block">$48M+</span>
                  <p className="text-[11px] text-ink-muted dark:text-slate-400">Markaziy Osiyo qurg‘oqchil hududlari ehtiyoji</p>
                </div>

                <div className="p-5 rounded-2xl bg-cream-100 dark:bg-slate-800 border border-black/[0.06] dark:border-white/[0.08] space-y-1 text-center">
                  <span className="text-xs font-bold text-ink-muted dark:text-slate-400 uppercase">SAM (Xizmat bozori)</span>
                  <span className="text-2xl font-black text-brand font-mono-num block">$12M</span>
                  <p className="text-[11px] text-ink-muted dark:text-slate-400">O‘zbekiston agrar va sanoat korxonalari</p>
                </div>

                <div className="p-5 rounded-2xl bg-cream-100 dark:bg-slate-800 border border-black/[0.06] dark:border-white/[0.08] space-y-1 text-center">
                  <span className="text-xs font-bold text-ink-muted dark:text-slate-400 uppercase">SOM (Dastlabki nishon)</span>
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono-num block">$1.5M</span>
                  <p className="text-[11px] text-ink-muted dark:text-slate-400">Navoiy va Buxoro viloyatlari fermerlari</p>
                </div>
              </div>
            </div>
          )}

          {/* TEAM TAB */}
          {activeTab === 'team' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.07] dark:border-white/[0.08] shadow-xs space-y-6">
              <div>
                <h3 className="text-xl font-black text-ink-text dark:text-white">Loyiha asoschilari va jamoa</h3>
                <p className="text-xs sm:text-sm text-ink-muted dark:text-slate-400 mt-1">
                  NavDU ning iqtidorli talabalari va ilmiy maslahatchilari.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-2">
                {startup.founders.map((f, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-cream-100 dark:bg-slate-800 border border-black/[0.06] dark:border-white/[0.08] flex items-center gap-4">
                    <img 
                      src={f.avatar} 
                      alt={f.name} 
                      className="w-14 h-14 rounded-2xl object-cover border border-black/10 dark:border-white/10 shadow-xs"
                    />
                    <div className="space-y-0.5">
                      <h4 className="font-extrabold text-sm text-ink-text dark:text-white">{f.name}</h4>
                      <p className="text-xs text-brand font-bold">{f.role}</p>
                      <p className="text-[11px] text-ink-muted dark:text-slate-400">{f.faculty}</p>
                      {f.telegram && (
                        <a 
                          href={`https://t.me/${f.telegram.replace('@', '')}`}
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-[11px] font-bold text-blue-500 hover:underline inline-block pt-1"
                        >
                          {f.telegram}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COMMENTS TAB */}
          {activeTab === 'comments' && (
            <div className="space-y-6">
              
              {/* Write Comment Form */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.07] dark:border-white/[0.08] shadow-xs">
                <h3 className="text-lg font-black text-ink-text dark:text-white mb-4 flex items-center gap-2">
                  <SvgMessageSquare className="w-5 h-5 text-brand" />
                  <span>Startap haqida fikringizni bildiring</span>
                </h3>

                <form onSubmit={handleAddCommentSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-ink-muted dark:text-slate-400 block mb-1">Ism va familiyangiz</label>
                      <input 
                        type="text"
                        required
                        value={newCommentName}
                        onChange={(e) => setNewCommentName(e.target.value)}
                        placeholder="Masalan: Azizbek Ergashev"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs focus:outline-none focus:border-brand bg-cream-100/50 dark:bg-slate-800 text-ink-text dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-ink-muted dark:text-slate-400 block mb-1">Fakultet yoki Lavozimingiz</label>
                      <input 
                        type="text"
                        value={newCommentRole}
                        onChange={(e) => setNewCommentRole(e.target.value)}
                        placeholder="Masalan: AT fakulteti, 3-kurs"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs focus:outline-none focus:border-brand bg-cream-100/50 dark:bg-slate-800 text-ink-text dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-ink-muted dark:text-slate-400 block mb-1">Fikr yoki taklifingiz</label>
                    <textarea 
                      required
                      rows={3}
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Startap haqida qanday fikrdasiz? Savol yoki taklifingiz bormi?"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs focus:outline-none focus:border-brand bg-cream-100/50 dark:bg-slate-800 text-ink-text dark:text-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold shadow-md shadow-brand/25 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <SvgSend className="w-3.5 h-3.5" />
                    <span>Fikr qoldirish</span>
                  </button>
                </form>
              </div>

              {/* Comments List */}
              <div className="space-y-3">
                {localComments.map((c) => (
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
          )}

        </div>

        {/* Related Startups Section */}
        {relatedStartups.length > 0 && (
          <div className="pt-8 space-y-4">
            <h3 className="text-xl font-black text-ink-text dark:text-white">Tavsiya etilayotgan boshqa startaplar</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedStartups.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/startup/${rel.id}`}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-black/[0.07] dark:border-white/[0.08] hover:border-brand/40 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cream-100 dark:bg-slate-800 flex items-center justify-center text-xl">
                        {rel.logo}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-ink-text dark:text-white group-hover:text-brand transition-colors">
                          {rel.name}
                        </h4>
                        <span className="text-[10px] text-ink-muted dark:text-slate-400">{rel.category}</span>
                      </div>
                    </div>
                    <p className="text-xs text-ink-muted dark:text-slate-400 line-clamp-2">{rel.tagline}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-xs text-ink-muted dark:text-slate-400 font-bold">
                    <span className="text-brand">▲ {rel.upvotes} ovoz</span>
                    <span className="text-brand group-hover:translate-x-1 transition-transform">Batafsil &rarr;</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Pitch Deck Preview Modal */}
      <AnimatePresence>
        {isPitchDeckModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-black/10 dark:border-white/10 shadow-2xl relative space-y-5 text-ink-text dark:text-white"
            >
              <button 
                onClick={() => setIsPitchDeckModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-cream-200 dark:hover:bg-slate-800 text-ink-muted dark:text-slate-400 cursor-pointer"
              >
                <SvgX className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-brand/10 dark:bg-brand/20 text-brand flex items-center justify-center">
                <SvgFileText className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-xl font-black text-ink-text dark:text-white">{startup.name} • Pitch Deck</h3>
                <p className="text-xs text-ink-muted dark:text-slate-400 mt-1">
                  Ushbu taqdimot NavDU Demo Day doirasida investorlar va hakamlar hay’ati uchun tayyorlangan (14 slayd, PDF).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-cream-100 dark:bg-slate-800 border border-black/[0.06] dark:border-white/[0.08] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-ink-muted dark:text-slate-400">Fayl hajmi:</span>
                  <span className="font-bold text-ink-text dark:text-white">4.2 MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted dark:text-slate-400">Format:</span>
                  <span className="font-bold text-ink-text dark:text-white">PDF Presentation</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted dark:text-slate-400">Taqdimotchi:</span>
                  <span className="font-bold text-ink-text dark:text-white">{startup.founders[0]?.name}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={`https://navdu.uz/startups/${startup.id}/pitchdeck.pdf`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`"${startup.name}" Pitch Deck fayli yuklab olinmoqda... (Namuna)`);
                    setIsPitchDeckModalOpen(false);
                  }}
                  className="flex-1 py-3 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-brand/25 cursor-pointer transition-colors"
                >
                  <SvgDownload className="w-4 h-4" />
                  <span>PDF Yuklab olish</span>
                </a>

                <button
                  onClick={() => setIsPitchDeckModalOpen(false)}
                  className="px-4 py-3 rounded-xl bg-cream-200 dark:bg-slate-800 text-ink-text dark:text-white font-bold text-xs hover:bg-cream-300 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                >
                  Yopish
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Investor Inquiry Modal */}
      <AnimatePresence>
        {isInvestorModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-black/10 dark:border-white/10 shadow-2xl relative space-y-5 text-ink-text dark:text-white"
            >
              <button 
                onClick={() => { setIsInvestorModalOpen(false); setInvestorSent(false); }}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-cream-200 dark:hover:bg-slate-800 text-ink-muted dark:text-slate-400 cursor-pointer"
              >
                <SvgX className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <SvgBriefcase className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-xl font-black text-ink-text dark:text-white">{startup.name} ga qiziqish</h3>
                <p className="text-xs text-ink-muted dark:text-slate-400 mt-1">
                  Loyiha asoschilari yoki NavDU Inkubatsiya markazi bilan bevosita investitsiya/hamkorlik bo‘yicha bog‘lanish.
                </p>
              </div>

              {investorSent ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
                  <SvgCheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    So‘rovingiz qabul qilindi! Startap rahbari tez orada siz bilan bog‘lanadi.
                  </p>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    setInvestorSent(true);
                  }} 
                  className="space-y-3"
                >
                  <div>
                    <label className="text-xs font-bold text-ink-muted dark:text-slate-400 block mb-1">Ism va familiyangiz</label>
                    <input 
                      type="text" 
                      required
                      value={investorForm.name}
                      onChange={(e) => setInvestorForm({ ...investorForm, name: e.target.value })}
                      placeholder="Masalan: Doniyor Olimov"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs focus:outline-none focus:border-brand bg-cream-100/50 dark:bg-slate-800 text-ink-text dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-ink-muted dark:text-slate-400 block mb-1">Tashkilot / Fond nomi</label>
                    <input 
                      type="text" 
                      value={investorForm.organization}
                      onChange={(e) => setInvestorForm({ ...investorForm, organization: e.target.value })}
                      placeholder="Masalan: Navoiy Ventures / NKMK"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs focus:outline-none focus:border-brand bg-cream-100/50 dark:bg-slate-800 text-ink-text dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-ink-muted dark:text-slate-400 block mb-1">Telefon / Telegram</label>
                    <input 
                      type="text" 
                      required
                      value={investorForm.phone}
                      onChange={(e) => setInvestorForm({ ...investorForm, phone: e.target.value })}
                      placeholder="+998 90 123 45 67 yoki @username"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs focus:outline-none focus:border-brand bg-cream-100/50 dark:bg-slate-800 text-ink-text dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-ink-muted dark:text-slate-400 block mb-1">Qisqacha xabar yoki taklif</label>
                    <textarea 
                      rows={2}
                      value={investorForm.note}
                      onChange={(e) => setInvestorForm({ ...investorForm, note: e.target.value })}
                      placeholder="Pilot loyiha, investitsiya yoki mentorlik taklifi..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs focus:outline-none focus:border-brand bg-cream-100/50 dark:bg-slate-800 text-ink-text dark:text-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <SvgSend className="w-4 h-4" />
                    <span>So‘rovni yuborish</span>
                  </button>
                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
