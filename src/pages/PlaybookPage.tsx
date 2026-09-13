import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SvgBookOpen, 
  SvgCheckCircle2, 
  SvgArrowRight, 
  SvgArrowLeft,
  SvgSparkles, 
  SvgClock
} from '../components/icons/CustomIcons';

interface PlaybookGuide {
  id: string;
  category: 'G‘oya' | 'MVP' | 'Grantlar' | 'Pitch' | 'Yuridik';
  title: string;
  readTime: string;
  summary: string;
  author: string;
  authorRole: string;
  keyTakeaway: string;
  checklist: string[];
  templateDownload?: string;
  detailedContent: string[];
}

export const PLAYBOOK_GUIDES: PlaybookGuide[] = [
  {
    id: 'guide-1',
    category: 'G‘oya',
    title: 'G‘oyani tekshirish va Muammoni tasdiqlash (Problem Validation)',
    readTime: '6 daqiqa',
    summary: 'Dasturlashni boshlashdan oldin, odamlar haqiqatan ham sizning yechimingiz uchun to‘lashga tayyormi yoki yo‘qligini aniqlash usullari.',
    author: 'Jasur Shodiyev',
    authorRole: 'NavDU Inkubatsiya Markazi rahbari',
    keyTakeaway: 'Odamlardan "Mening g‘oyam yoqdimi?" deb so‘ramang. Ularning o‘tmishdagi haqiqiy xatti-harakatlari va xarajatlarini so‘rang.',
    checklist: [
      'Kamida 20 nafar potentsial mijoz bilan yuzma-yuz "Mom Test" suhbati o‘tkazing',
      'Muammo hozir qanday va qancha mablag‘ sarflab hal qilinayotganini aniqlang',
      'Hech qanday kod yozmasdan, bitta sahifali Landing Page orqali kutish ro‘yxatini to‘plang',
      'Mijozlardan "Agar bu mahsulot bo‘lsa, qancha to‘lardingiz?" deb emas, muammoning oylik zararini hisoblang'
    ],
    detailedContent: [
      'Ko‘pchilik yangi boshlovchi startapchilar qiladigan eng katta xato — avval mahsulotni 6 oy davomida kodlash, keyin esa hech kimga kerak emasligini bilib qolishdir.',
      'Y Combinator falsafasiga ko‘ra, har qanday startap g‘oyasi avvalo "Muammo borligini isbotlash"dan boshlanishi shart. Buning eng yaxshi usuli — mijozlar bilan suhbat (Customer Discovery).',
      'Navoiy viloyatida ishlab chiqarish yoki ta’lim bo‘yicha startap boshlayotgan bo‘lsangiz, bevosita korxonalarning bosh muhandislari yoki talabalar bilan suhbatlashing. Ular muammodan qanchalik qiynalayotganini o‘rganing.'
    ]
  },
  {
    id: 'guide-2',
    category: 'MVP',
    title: 'MVP (Minimum Viable Product) yaratish qoidalari',
    readTime: '8 daqiqa',
    summary: 'Mukammallikka intilmasdan, 3-4 hafta ichida birinchi ishchi prototipni bozorga chiqarish formulasi.',
    author: 'Otabek Mirzayev',
    authorRole: 'NavDU Tech Mentor • Ex-IT Park',
    keyTakeaway: 'Agar birinchi versiyangizdan uyalmasangiz, demak, uni bozorga juda kech chiqargansiz. (Reid Hoffman)',
    checklist: [
      'Faqat 1 ta asosiy funksiyani (Core Feature) tanlang, qolgan 10 ta qiziq g‘oyani orqaga suring',
      'No-code yoki tayyor shablonlardan foydalaning (Supabase, Firebase, Webflow)',
      '1 oydan ortiq vaqt talab qiladigan murakkab AI yoki dizaynni keyingi bosqichga qoldiring',
      'Birinchi 5 ta mijozga qo‘lda xizmat ko‘rsatib bo‘lsa ham muammoni hal qilib bering (Concierge MVP)'
    ],
    detailedContent: [
      'MVP — bu chala yoki buzuq mahsulot degani emas. Bu mijozning boshlang‘ich dardiga darmon bo‘ladigan eng oddiy, lekin to‘liq ishlaydigan yechimdir.',
      'Dropbox dastlab ishlaydigan tizim o‘rniga shunchaki 3 daqiqalik video-demonstratsiya tayyorlagan. NavDU startapchilariga ham xuddi shu prinsip: avval prototip ko‘rsating, keyin murakkablashtiring.',
      'NavDU 3D laboratoriyasi yordamida fizik mahsulotlarning korpusini 48 soat ichida 3D printerda chiqarib olishingiz mumkin.'
    ]
  },
  {
    id: 'guide-3',
    category: 'Grantlar',
    title: 'NavDU va Davlat Grantlarini ($5k - $10k) yutish sirlari',
    readTime: '7 daqiqa',
    summary: 'Innovatsion rivojlanish agentligi va NavDU rektorat jamg‘armasidan boshlang‘ich beg‘araz grant mablag‘larini jalb qilish.',
    author: 'Kamronbek Jo‘rayev',
    authorRole: '3 karra davlat granti sohibi • AgroTech rezidenti',
    keyTakeaway: 'Grant komissiyasi ilmiy so‘zlarga emas, loyihaning iqtisodiy samarasi va jamiyatga foydasiga pul beradi.',
    checklist: [
      'Loyiha smetasini (Budget) har bir so‘migacha aniq asoslang (server xarajatlari, prototip ehtiyot qismlari)',
      'Patent yoki intellektual mulk talabnomasi topshirilganini tasdiqlovchi hujjat ilova qiling',
      'Navoiy viloyatidagi aniq bir korxona yoki tashkilotdan "Kafolat xati" (Letter of Intent) oling',
      'Grant mablag‘ini marketing yoki reklamaga emas, ilmiy-amaliy mahsulot yaratishga yo‘naltiring'
    ],
    detailedContent: [
      'Davlat grantlari talabalar uchun o‘z g‘oyasini xavfsiz sinovdan o‘tkazish uchun eng yaxshi manbadir, chunki siz o‘z ulushingizni sotmaysiz (Non-dilutive funding).',
      'Navoiy davlat universiteti qoshidagi Startap Klubi har yili 3-mavsum yakunida $5,000 gacha dastlabki grantlarni ajratadi.',
      'Eng ko‘p e’tibor qaratiladigan jihat: jamoaning salohiyati va loyihaning amaliyotga joriy qilinish darajasi.'
    ]
  },
  {
    id: 'guide-4',
    category: 'Pitch',
    title: 'Investorlar oldida 3 daqiqalik Pitch qilish qo‘llanmasi',
    readTime: '5 daqiqa',
    summary: 'Demo Day yoki investitsiya uchrashuvlarida hakamlarni 180 soniya ichida hayratda qoldirish siri.',
    author: 'Zilola Ergasheva',
    authorRole: 'Venture Scout • AloqaVentures',
    keyTakeaway: 'Sizning vazifangiz 3 daqiqada butun kodni tushuntirish emas, balki investorda ikkinchi uchrashuvga qiziqish uyg‘otishdir.',
    checklist: [
      '10-20-30 qoidasiga amal qiling: Ko‘pi bilan 10 ta slayd, 20 daqiqadan kam vaqt, kamida 30 shrift',
      'Hikoya orqali boshlang (Hook): Haqiqiy mijozning qiynalgan real voqeasini ko‘rsating',
      'Slaydlarda matnni minimal qiling, vizual grafiklar va fotosuratlardan foydalaning',
      'Taqdimot oxirida aniq chaqiruv qiling: "Bizga nima kerak? ($10,000 / Pilot maydon / Mentor)"'
    ],
    detailedContent: [
      'Investorlar kuniga o‘nlab taqdimotlarni eshitadilar. Ularning xotirasida faqat ikkita narsa qoladi: Muammoning qanchalik kattaligi va jamoaning bu muammoni hal qila olishiga bo‘lgan ishonch.',
      'Slaydlarni tartibi: Muammo -> Yechim -> Demo -> Bozor hajmi -> Biznes model -> Jamoa -> Talab (The Ask).',
      'Hech qachon texnik jargonlar bilan auditoriyani charchatmang. Oson, tushunarli va ishonchli gapiring.'
    ]
  },
  {
    id: 'guide-5',
    category: 'Yuridik',
    title: 'Yuridik asoslar: MCHJ ochish va Intellektual mulk (IP) himoyasi',
    readTime: '6 daqiqa',
    summary: 'Hammuassislar o‘rtasidagi ulushlarni adolatli taqsimlash (Vesting) va startapni rasmiylashtirish.',
    author: 'Advokat Temur Boboyev',
    authorRole: 'Startap yurist • IP Consult',
    keyTakeaway: 'Dasturchi do‘stingiz bilan bugun kelishmagan ulush ertaga startap muvaffaqiyatli bo‘lganida loyihani parchalab tashlashi mumkin.',
    checklist: [
      'Founders Agreement (Hammuassislar kelishuvi) imzolang: Kim nimaga mas’ul va qancha vaqt ajratadi',
      'Vesting jadvalini kiriting: Ulush 4 yil davomida (har yili 25% dan) berilishi kerak (1-year cliff)',
      'Dasturiy kod va dizayn intellektual mulki MCHJ nomiga rasmiylashtirilganini tekshiring',
      'IT Park rezidentligini oling va soliqlarni 14% dan 7.5% gacha qisqartiring'
    ],
    detailedContent: [
      'Universitetdagi jamoalar ko‘pincha ulushlarni teng 50/50 qilib taqsimlashadi va hech qanday shartnoma tuzishmaydi. Keyin esa bitta asoschi ishni tashlab ketgach, qolganlar uning ulushini qaytara olmay qiynaladi.',
      'Vesting mexanizmi — bu xalqaro standart bo‘lib, jamoa a’zosi startapda kamida 1 yil to‘liq ishlagandan keyingina ulushga ega bo‘la boshlaydi.',
      'NavDU inkubatsiya markazi talabalarga yuridik hujjatlarni tayyorlashda bepul maslahat beradi.'
    ]
  }
];

export const PlaybookPage: React.FC = () => {
  const [selectedGuide, setSelectedGuide] = useState<PlaybookGuide>(PLAYBOOK_GUIDES[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Barchasi');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const categories = ['Barchasi', 'G‘oya', 'MVP', 'Grantlar', 'Pitch', 'Yuridik'];

  const filteredGuides = PLAYBOOK_GUIDES.filter(g => 
    selectedCategory === 'Barchasi' || g.category === selectedCategory
  );

  const toggleCheck = (itemText: string) => {
    setCheckedItems(prev => ({ ...prev, [itemText]: !prev[itemText] }));
  };

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

        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold text-brand uppercase tracking-widest bg-brand/10 dark:bg-brand/20 px-3 py-1 rounded-full">
                NavDU Startup Playbook
              </span>
              <span className="text-xs text-ink-muted dark:text-slate-400">Amaliy bilimlar bazasi</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-ink-text dark:text-white tracking-tight">
              Startap Boshlovchilar Qo‘llanmasi
            </h1>
            <p className="text-sm sm:text-base text-ink-muted dark:text-slate-400 mt-2 max-w-2xl">
              Y Combinator, Stanford va NavDU tajribasiga asoslangan 5 ta amaliy yo‘riqnoma, tekshiruv ro‘yxatlari va andazalar.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              ✓ 100% Bepul & Ochiq resurs
            </span>
          </div>
        </div>

        {/* Category Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-brand text-white shadow-sm shadow-brand/25'
                  : 'bg-white dark:bg-slate-900 text-ink-muted dark:text-slate-400 hover:text-ink-text dark:hover:text-white border border-black/[0.06] dark:border-white/[0.08]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 2-Column Split: Guides Navigation on Left, Active Guide on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Guides List */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-mono uppercase font-bold text-ink-muted dark:text-slate-400 tracking-wider block px-1">
              Qo‘llanmalar ro‘yxati ({filteredGuides.length})
            </span>

            {filteredGuides.map((guide, idx) => {
              const isSelected = selectedGuide.id === guide.id;
              return (
                <div
                  key={guide.id}
                  onClick={() => setSelectedGuide(guide)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-brand/10 dark:bg-brand/20 border-brand shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-black/[0.06] dark:border-white/[0.08] hover:border-brand/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-brand">
                      {guide.category}
                    </span>
                    <span className="text-[11px] text-ink-muted dark:text-slate-400 font-mono flex items-center gap-1">
                      <SvgClock className="w-3 h-3" />
                      {guide.readTime}
                    </span>
                  </div>

                  <h3 className={`text-sm font-extrabold leading-snug ${
                    isSelected ? 'text-brand dark:text-blue-400' : 'text-ink-text dark:text-white'
                  }`}>
                    {guide.title}
                  </h3>

                  <p className="text-xs text-ink-muted dark:text-slate-400 line-clamp-2 mt-1">
                    {guide.summary}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right: Selected Guide Deep View */}
          <div className="lg:col-span-8 p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-black/[0.08] dark:border-white/[0.08] shadow-sm space-y-8">
            
            {/* Guide Header */}
            <div className="space-y-3 pb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-brand/10 text-brand dark:bg-brand/25 dark:text-blue-300">
                  {selectedGuide.category}
                </span>
                <span className="text-xs text-ink-muted dark:text-slate-400 font-mono">
                  O‘qish vaqti: {selectedGuide.readTime}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-ink-text dark:text-white tracking-tight leading-tight">
                {selectedGuide.title}
              </h2>

              {/* Author pill */}
              <div className="flex items-center gap-3 pt-1">
                <div className="w-8 h-8 rounded-full bg-brand/20 text-brand font-bold flex items-center justify-center text-xs">
                  {selectedGuide.author[0]}
                </div>
                <div>
                  <div className="text-xs font-bold text-ink-text dark:text-white">
                    {selectedGuide.author}
                  </div>
                  <div className="text-[11px] text-ink-muted dark:text-slate-400">
                    {selectedGuide.authorRole}
                  </div>
                </div>
              </div>
            </div>

            {/* Key Golden Rule Box */}
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
                <SvgSparkles className="w-4 h-4" />
                <span>Oltin Qoida (Key Takeaway)</span>
              </div>
              <p className="text-sm font-semibold italic">
                "{selectedGuide.keyTakeaway}"
              </p>
            </div>

            {/* Detailed Article Body */}
            <div className="space-y-4 text-sm text-ink-text/90 dark:text-slate-200 leading-relaxed font-normal">
              {selectedGuide.detailedContent.map((paragraph, pIdx) => (
                <p key={pIdx}>
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Interactive Step-by-Step Checklist */}
            <div className="space-y-4 pt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-ink-text dark:text-white flex items-center gap-2">
                  <SvgCheckCircle2 className="w-5 h-5 text-brand" />
                  <span>Amaliy Tekshiruv Ro‘yxati (Action Checklist)</span>
                </h3>
                <span className="text-xs text-ink-muted dark:text-slate-400">
                  Belgilab boring:
                </span>
              </div>

              <div className="space-y-2.5">
                {selectedGuide.checklist.map((item, cIdx) => {
                  const isChecked = !!checkedItems[item];
                  return (
                    <div
                      key={cIdx}
                      onClick={() => toggleCheck(item)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isChecked
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                          : 'bg-cream-50 dark:bg-slate-800/60 border-black/[0.04] dark:border-white/[0.06] text-ink-text dark:text-slate-200 hover:border-brand/40'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border transition-colors ${
                        isChecked 
                          ? 'bg-emerald-500 text-white border-emerald-500' 
                          : 'border-black/20 dark:border-white/20'
                      }`}>
                        {isChecked && <SvgCheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <span className={`text-xs sm:text-sm font-medium leading-snug ${
                        isChecked ? 'line-through opacity-75' : ''
                      }`}>
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Apply & Help CTA */}
            <div className="p-5 rounded-2xl bg-brand/5 dark:bg-brand/10 border border-brand/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-ink-text dark:text-white">
                  Savollaringiz bormi yoki g‘oyangizni muhokama qilmoqchimisiz?
                </h4>
                <p className="text-xs text-ink-muted dark:text-slate-400 mt-0.5">
                  Inkubatsiya markazi mentorlari bilan 1-on-1 uchrashuv belgilang.
                </p>
              </div>

              <a
                href="https://t.me/navdu_startup"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold shrink-0 flex items-center justify-center gap-2 shadow-sm shadow-brand/25 transition-all"
              >
                <span>Mentor bilan uchrashuv</span>
                <SvgArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
