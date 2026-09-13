import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SvgTrophy, SvgRocket, SvgUsers, SvgSparkles, SvgPlus, SvgSend } from './icons/CustomIcons';

interface TeamPost {
  id: string;
  type: 'team_needs_member' | 'solo_needs_team';
  title: string;
  projectName?: string;
  hackathonName: string;
  authorName: string;
  authorAvatar: string;
  neededRoles: string[];
  description: string;
  telegram: string;
  membersCount?: string;
  createdAt: string;
}

export const HackathonTeamBuilder: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'teams' | 'solos'>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [posts, setPosts] = useState<TeamPost[]>([
    {
      id: 'hp-1',
      type: 'team_needs_member',
      title: 'Backend (Python/FastAPI) dasturchi kerak',
      projectName: 'EcoSense — Zavod chiqindilarini monitoring qilish',
      hackathonName: 'NavDU InnoHack 2026 (60 mln so‘m)',
      authorName: 'Sardorbek Rahimov',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002?w=120&auto=format&fit=crop&q=80',
      neededRoles: ['Backend Python', 'IoT Datchiklar'],
      description: 'Hozir jamoamizda 1 ta Frontendchi va 1 ta AI mutaxassisi bor. Sensorlardan ma’lumotlarni qabul qilib, serverga uzatuvchi va bazaga yozuvchi backendchi kerak. G‘oya va taqdimot tayyor.',
      telegram: '@sardor_ecosense',
      membersCount: '3 / 4 kishi',
      createdAt: 'Bugun'
    },
    {
      id: 'hp-2',
      type: 'solo_needs_team',
      title: 'UI/UX Dizayner sifatida jamoaga qo‘shilaman',
      hackathonName: 'NavDU InnoHack 2026',
      authorName: 'Kamila Yusupova',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      neededRoles: ['UI/UX Dizayner'],
      description: 'Figma bo‘yicha 2 yillik tajribam bor. Hakaton mobaynida mahsulot prototipi, foydalanuvchi oqimi (User Flow) va hakamlar oldidagi slaydlar dizaynini to‘liq o‘z zimmamga olaman.',
      telegram: '@kamila_design',
      createdAt: 'Kecha'
    },
    {
      id: 'hp-3',
      type: 'team_needs_member',
      title: 'Mobil dasturchi (Flutter) va Marketolog kerak',
      projectName: 'AgroRobot — Issiqxonalarni avtomatlashtirish',
      hackathonName: 'NavDU InnoHack 2026 (60 mln so‘m)',
      authorName: 'Jamshid Ergashev',
      authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
      neededRoles: ['Flutter Dasturchi', 'Pitch & Marketing'],
      description: 'Biz 2 kishi — apparat va mikrosxema muhandislarimiz. Dasturimizning mobil ilovasini va 3 daqiqalik zo‘r taqdimotini tayyorlashga yordam beradigan jamoa a’zolari qidiryapmiz.',
      telegram: '@jamshid_agrorobot',
      membersCount: '2 / 4 kishi',
      createdAt: '2 kun oldin'
    },
    {
      id: 'hp-4',
      type: 'solo_needs_team',
      title: 'AI & Data Science mutaxassisi — Jamoa qidiryapman',
      hackathonName: 'NavDU InnoHack 2026',
      authorName: 'Bobur Mirzayev',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      neededRoles: ['Machine Learning', 'Computer Vision'],
      description: 'Computer Vision va tasvirlarni qayta ishlash bo‘yicha modellar bilan ishlayman. Sanoat, tibbiyot yoki xavfsizlik mavzusidagi kuchli jamoaga qo‘shilishni xohlayman.',
      telegram: '@bobur_ai',
      createdAt: '3 kun oldin'
    }
  ]);

  // New post form state
  const [formData, setFormData] = useState({
    title: '',
    projectName: '',
    role: '',
    telegram: '',
    description: '',
    type: 'team_needs_member' as TeamPost['type']
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.telegram) return;

    const newPost: TeamPost = {
      id: `hp-${Date.now()}`,
      type: formData.type,
      title: formData.title,
      projectName: formData.projectName || undefined,
      hackathonName: 'NavDU InnoHack 2026',
      authorName: 'Siz (Talaba)',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      neededRoles: formData.role ? [formData.role] : ['Jamoa a’zosi'],
      description: formData.description || 'NavDU InnoHack 2026 uchun hamkorlikka tayyorman.',
      telegram: formData.telegram.startsWith('@') ? formData.telegram : `@${formData.telegram}`,
      membersCount: formData.type === 'team_needs_member' ? '2 / 4 kishi' : undefined,
      createdAt: 'Hozirgina'
    };

    setPosts([newPost, ...posts]);
    setIsCreateOpen(false);
    setFormData({ title: '', projectName: '', role: '', telegram: '', description: '', type: 'team_needs_member' });
  };

  const filteredPosts = posts.filter(p => {
    if (filter === 'teams') return p.type === 'team_needs_member';
    if (filter === 'solos') return p.type === 'solo_needs_team';
    return true;
  });

  return (
    <div className="mt-12 p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.08] dark:border-white/[0.08] shadow-sm">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-brand uppercase tracking-wider bg-brand/10 dark:bg-brand/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <SvgUsers className="w-3.5 h-3.5" />
              <span>Team Builder Doskasi</span>
            </span>
            <span className="text-xs text-amber-500 font-bold flex items-center gap-1">
              <SvgSparkles className="w-3 h-3" />
              <span>InnoHack 2026</span>
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-ink-text dark:text-white tracking-tight">
            Hakaton Jamoasini Shakllantirish Maydoni
          </h3>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-slate-400 mt-1">
            Jamoangizga yetishmayotgan mutaxassisni toping yoki yolg‘iz bo‘lsangiz boshqa jamoalarga qo‘shiling.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold shadow-md shadow-brand/25 flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
        >
          <SvgPlus className="w-4 h-4" />
          <span>E’lon berish</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 my-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-brand text-white shadow-xs'
              : 'bg-black/[0.04] dark:bg-white/[0.06] text-ink-muted dark:text-slate-400 hover:text-ink-text'
          }`}
        >
          Barcha e’lonlar ({posts.length})
        </button>
        <button
          onClick={() => setFilter('teams')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'teams'
              ? 'bg-brand text-white shadow-xs'
              : 'bg-black/[0.04] dark:bg-white/[0.06] text-ink-muted dark:text-slate-400 hover:text-ink-text'
          }`}
        >
          Jamoaga a’zo kerak
        </button>
        <button
          onClick={() => setFilter('solos')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'solos'
              ? 'bg-brand text-white shadow-xs'
              : 'bg-black/[0.04] dark:bg-white/[0.06] text-ink-muted dark:text-slate-400 hover:text-ink-text'
          }`}
        >
          Jamoa qidirayotganlar
        </button>
      </div>

      {/* Posts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="p-5 rounded-2xl bg-cream-50 dark:bg-slate-800/60 border border-black/[0.06] dark:border-white/[0.08] hover:border-brand/40 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                  post.type === 'team_needs_member'
                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                    : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                }`}>
                  {post.type === 'team_needs_member' ? '👥 Jamoaga a’zo kerak' : '🙋‍♂️ Jamoa qidiryapman'}
                </span>
                <span className="text-[11px] text-ink-muted dark:text-slate-400 font-mono">
                  {post.createdAt}
                </span>
              </div>

              <h4 className="text-sm sm:text-base font-extrabold text-ink-text dark:text-white leading-snug">
                {post.title}
              </h4>

              {post.projectName && (
                <div className="text-xs text-brand font-semibold mt-1">
                  Loyiha: {post.projectName}
                </div>
              )}

              <p className="text-xs text-ink-muted dark:text-slate-300 mt-2 leading-relaxed">
                {post.description}
              </p>

              {/* Roles Badges */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {post.neededRoles.map((role, rIdx) => (
                  <span
                    key={rIdx}
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-ink-text dark:text-slate-200 border border-black/[0.06] dark:border-white/[0.06]"
                  >
                    + {role}
                  </span>
                ))}
              </div>
            </div>

            {/* Author & CTA */}
            <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <div>
                  <div className="text-xs font-bold text-ink-text dark:text-white">
                    {post.authorName}
                  </div>
                  {post.membersCount && (
                    <div className="text-[10px] text-ink-muted dark:text-slate-400">
                      Tarkib: {post.membersCount}
                    </div>
                  )}
                </div>
              </div>

              <a
                href={`https://t.me/${post.telegram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <SvgSend className="w-3 h-3" />
                <span>Bog‘lanish</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-black/10 dark:border-white/10 shadow-2xl z-10"
            >
              <h4 className="text-xl font-black text-ink-text dark:text-white mb-1">
                Hakaton uchun e’lon joylash
              </h4>
              <p className="text-xs text-ink-muted dark:text-slate-400 mb-5">
                Jamoangizga sherik qidiryapsizmi yoki o‘zingiz jamoaga qo‘shilmoqchimisiz?
              </p>

              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-ink-text dark:text-white mb-1.5">
                    E’lon turi
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'team_needs_member' })}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        formData.type === 'team_needs_member'
                          ? 'bg-brand text-white border-brand'
                          : 'bg-black/[0.02] dark:bg-white/[0.04] text-ink-muted border-black/10 dark:border-white/10'
                      }`}
                    >
                      👥 Jamoaga sherik kerak
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'solo_needs_team' })}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        formData.type === 'solo_needs_team'
                          ? 'bg-brand text-white border-brand'
                          : 'bg-black/[0.02] dark:bg-white/[0.04] text-ink-muted border-black/10 dark:border-white/10'
                      }`}
                    >
                      🙋‍♂️ Men jamoa qidiryapman
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-text dark:text-white mb-1.5">
                    Sarlavha
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: Flutterchi va Dizayner kerak..."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 text-xs sm:text-sm text-ink-text dark:text-white focus:border-brand focus:outline-hidden"
                  />
                </div>

                {formData.type === 'team_needs_member' && (
                  <div>
                    <label className="block text-xs font-bold text-ink-text dark:text-white mb-1.5">
                      Loyiha nomi (ixtiyoriy)
                    </label>
                    <input
                      type="text"
                      placeholder="Masalan: EcoSense"
                      value={formData.projectName}
                      onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 text-xs sm:text-sm text-ink-text dark:text-white focus:border-brand focus:outline-hidden"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-ink-text dark:text-white mb-1.5">
                    Talab qilinadigan mahorat / Yo‘nalish
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: Python Backend, UI/UX, IoT..."
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 text-xs sm:text-sm text-ink-text dark:text-white focus:border-brand focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-text dark:text-white mb-1.5">
                    Telegram username (Bog‘lanish uchun)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="@username"
                    value={formData.telegram}
                    onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 text-xs sm:text-sm text-ink-text dark:text-white focus:border-brand focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-text dark:text-white mb-1.5">
                    Tavsif (Qisqacha reja)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Loyihangiz maqsadi va qanday ko‘nikmali sherik qidirayotganingizni yozing..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 text-xs sm:text-sm text-ink-text dark:text-white focus:border-brand focus:outline-hidden resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-ink-muted hover:text-ink-text dark:text-slate-400"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold shadow-md shadow-brand/25"
                  >
                    E’lonni joylash
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
