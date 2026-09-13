import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SvgUsers, 
  SvgGraduation, 
  SvgRocket, 
  SvgGithub, 
  SvgSearch, 
  SvgSend, 
  SvgExternalLink, 
  SvgUserPlus 
} from './icons/CustomIcons';

export interface TalentProfile {
  id: string;
  name: string;
  role: string;
  faculty: string;
  year: string;
  avatar: string;
  skills: string[];
  bio: string;
  status: 'Jamoa qidirmoqda' | 'Startapga tayyor' | 'Yangi g‘oya bor';
  category: 'Dasturchi' | 'Dizayner' | 'AI & Data' | 'Muhandis' | 'Marketing';
  github?: string;
  telegram: string;
  portfolio?: string;
  projectsCount: number;
}

export const INITIAL_TALENTS: TalentProfile[] = [
  {
    id: 't-1',
    name: 'Shaxzod Qodirov',
    role: 'Full-stack Dasturchi',
    faculty: 'Matematika va Informatika fakulteti',
    year: '4-bosqich talabasi',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    bio: '2 ta muvaffaqiyatli hakaton g‘olibi. Web va mobil dasturlar yaratish bo‘yicha 2 yillik tajribaga egaman. GreenTech yoki EdTech startapiga texnik hammuassis (CTO) sifatida qo‘shilishni xohlayman.',
    status: 'Jamoa qidirmoqda',
    category: 'Dasturchi',
    github: 'https://github.com',
    telegram: '@shaxzod_dev',
    portfolio: 'https://shaxzod.dev',
    projectsCount: 6
  },
  {
    id: 't-2',
    name: 'Madina Olimova',
    role: 'UI/UX & Mahsulot Dizayneri',
    faculty: 'Fizika va Muhandislik fakulteti',
    year: '3-bosqich talabasi',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    skills: ['Figma', 'Design Systems', 'UX Research', 'Prototyping', 'User Testing'],
    bio: 'Startaplar uchun chiroyli va qulay interfeyslar chizaman. Inkubatsiya doirasidagi 3 ta startapning dizayn konsepsiyasini ishlab chiqqanman. Jiddiy jamoa bilan ishlashga tayyorman.',
    status: 'Startapga tayyor',
    category: 'Dizayner',
    telegram: '@madina_ux',
    portfolio: 'https://behance.net',
    projectsCount: 8
  },
  {
    id: 't-3',
    name: 'Javohir Eshmurodov',
    role: 'AI & Data Science Muhandisi',
    faculty: 'Matematika va Informatika fakulteti',
    year: 'Magistratura 1-bosqich',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    skills: ['Python', 'PyTorch', 'Computer Vision', 'LLM Prompting', 'FastAPI'],
    bio: 'Tibbiyot va qishloq xo‘jaligida sun’iy intellekt modellarini qo‘llash bo‘yicha ilmiy izlanishlar olib boryapman. AI asosidagi loyihalarga chuqur algoritmlar ishlab chiqishda yordam bera olaman.',
    status: 'Jamoa qidirmoqda',
    category: 'AI & Data',
    github: 'https://github.com',
    telegram: '@javohir_ai',
    projectsCount: 4
  },
  {
    id: 't-4',
    name: 'Dilnoza Karimova',
    role: 'Raqamli Marketing & Growth',
    faculty: 'Iqtisodiyot va Biznes fakulteti',
    year: '4-bosqich talabasi',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    skills: ['Growth Marketing', 'SMM', 'Customer Discovery', 'Google Analytics', 'Pitching'],
    bio: 'B2B va B2C startaplarni bozorga olib chiqish, birinchi 1,000 ta mijozni jalb qilish va investorlar uchun biznes model rejasini tuzishda tajribam bor.',
    status: 'Startapga tayyor',
    category: 'Marketing',
    telegram: '@dilnoza_mktg',
    projectsCount: 5
  },
  {
    id: 't-5',
    name: 'Bekzod Fayzullayev',
    role: 'IoT & Hardware Muhandisi',
    faculty: 'Fizika va Muhandislik fakulteti',
    year: '4-bosqich talabasi',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    skills: ['Arduino', 'ESP32', '3D Modeling', 'PCB Design', 'Embedded C++'],
    bio: 'NavDU 3D prototiplash laboratoriyasi koordinatori. Sanoat va qishloq xo‘jaligi uchun mikrokontrollerli datchiklar va robototexnika vositalarini noldan yasayman.',
    status: 'Yangi g‘oya bor',
    category: 'Muhandis',
    github: 'https://github.com',
    telegram: '@bekzod_iot',
    projectsCount: 7
  },
  {
    id: 't-6',
    name: 'Sardorbek Jo‘rayev',
    role: 'Mobil Dasturchi (Flutter)',
    faculty: 'Matematika va Informatika fakulteti',
    year: '3-bosqich talabasi',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
    skills: ['Flutter', 'Dart', 'Firebase', 'State Management (Bloc)', 'REST API'],
    bio: 'Android va iOS uchun kross-platforma mobil ilovalar ishlab chiqaman. 3 ta ilovam Google Play Store’da e’lon qilingan. Yangi startap loyihalariga qo‘shilishdan mamnun bo‘laman.',
    status: 'Jamoa qidirmoqda',
    category: 'Dasturchi',
    github: 'https://github.com',
    telegram: '@sardor_flutter',
    projectsCount: 5
  }
];

export const TalentPoolSection: React.FC = () => {
  const [talents] = useState<TalentProfile[]>(INITIAL_TALENTS);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Barchasi');
  const [selectedTalent, setSelectedTalent] = useState<TalentProfile | null>(null);

  const categories = ['Barchasi', 'Dasturchi', 'Dizayner', 'AI & Data', 'Muhandis', 'Marketing'];

  const filtered = useMemo(() => {
    return talents.filter((t) => {
      const matchCat = selectedCategory === 'Barchasi' || t.category === selectedCategory;
      const q = search.toLowerCase().trim();
      const matchQ = 
        !q || 
        t.name.toLowerCase().includes(q) || 
        t.role.toLowerCase().includes(q) || 
        t.skills.some(s => s.toLowerCase().includes(q));
      return matchCat && matchQ;
    });
  }, [talents, selectedCategory, search]);

  return (
    <section className="py-20 sm:py-28 border-t border-black/[0.06] dark:border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-black/[0.06] dark:border-white/[0.08]">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-mono font-bold text-brand uppercase tracking-widest bg-brand/10 dark:bg-brand/20 px-3 py-1 rounded-full">
                07 / Talent Pool • Iqtidorlar
              </span>
              <span className="text-xs text-ink-muted dark:text-slate-400">Co-Founder Matching</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-ink-text dark:text-white tracking-tight">
              Iqtidorli Talabalar & Hammuassislar Bazasi
            </h2>
            <p className="mt-2 text-sm text-ink-muted dark:text-slate-400 max-w-xl">
              Startapingiz uchun dasturchi, dizayner, AI muhandisi yoki marketolog toping yoki o‘z nomzodingizni qoldiring.
            </p>
          </div>

          <a
            href="https://t.me/navdu_startup"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-2xl bg-brand hover:bg-brand-hover text-white font-bold text-xs sm:text-sm shadow-md shadow-brand/25 flex items-center gap-2 self-start sm:self-auto transition-all cursor-pointer"
          >
            <SvgUserPlus className="w-4 h-4" />
            <span>O‘z profilingizni qo‘shing</span>
          </a>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <SvgSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted dark:text-slate-400" />
              <input
                type="text"
                placeholder="Ism, mahorat (React, Python, Figma...) yoki soha bo‘yicha qidiring..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 text-xs sm:text-sm text-ink-text dark:text-white placeholder:text-ink-muted focus:outline-hidden focus:border-brand transition-colors"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-brand text-white shadow-sm shadow-brand/20 font-bold'
                    : 'bg-white dark:bg-slate-900 text-ink-muted dark:text-slate-400 hover:text-ink-text dark:hover:text-white border border-black/[0.06] dark:border-white/[0.08]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Talents Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              whileHover={{ y: -5 }}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.06] dark:border-white/[0.08] hover:border-brand/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Profile Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={t.avatar} 
                      alt={t.name} 
                      className="w-13 h-13 rounded-2xl object-cover ring-2 ring-brand/20 shadow-xs shrink-0" 
                    />
                    <div>
                      <h3 className="text-base font-extrabold text-ink-text dark:text-white">
                        {t.name}
                      </h3>
                      <span className="text-xs text-brand font-semibold block">{t.role}</span>
                      <span className="text-[11px] text-ink-muted dark:text-slate-400 block">{t.year}</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                    {t.status}
                  </span>
                </div>

                {/* Faculty */}
                <div className="text-xs text-ink-muted dark:text-slate-400 flex items-center gap-1.5">
                  <SvgGraduation className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{t.faculty}</span>
                </div>

                {/* Bio */}
                <p className="text-xs text-ink-muted dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {t.bio}
                </p>

                {/* Skill Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {t.skills.map((skill, sIdx) => (
                    <span 
                      key={sIdx}
                      className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-lg bg-black/[0.04] dark:bg-white/[0.06] text-ink-text dark:text-slate-200 border border-black/[0.04] dark:border-white/[0.04]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer: Socials & Connect CTA */}
              <div className="mt-5 pt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {t.github && (
                    <a
                      href={t.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-black/[0.04] dark:bg-white/[0.06] text-ink-muted dark:text-slate-400 hover:text-ink-text dark:hover:text-white transition-colors"
                      title="GitHub"
                    >
                      <SvgGithub className="w-4 h-4" />
                    </a>
                  )}
                  {t.portfolio && (
                    <a
                      href={t.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-black/[0.04] dark:bg-white/[0.06] text-ink-muted dark:text-slate-400 hover:text-ink-text dark:hover:text-white transition-colors"
                      title="Portfolio"
                    >
                      <SvgExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <a
                  href={`https://t.me/${t.telegram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-brand/10 hover:bg-brand text-brand hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <SvgSend className="w-3.5 h-3.5" />
                  <span>Bog‘lanish</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
