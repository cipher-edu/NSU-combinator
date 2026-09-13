# 🚀 NavDU Startap Klubi & Inkubatsiya Markazi (UZ Combinator)
## Loyihada Amalga Oshirilgan Ishlar To‘liq Hisoboti

Ushbu hujjat **Navoiy Davlat Universiteti Startap Klubi, Inkubatsiya va Akseleratsiya Markazi** veb-platformasida bajarilgan barcha funksional, texnik va dizayn ishlarini o‘z ichiga oladi.

---

## 📑 Mundarija
1. [Loyiha Maqsadi va Umumiy Arxitektura](#1-loyiha-maqsadi-va-umumiy-arxitektura)
2. [Asosiy Modullar va Funksional Imkoniyatlar](#2-asosiy-modullar-va-funksional-imkoniyatlar)
3. [Interaktiv Xususiyatlar va Modallar](#3-interaktiv-xususiyatlar-va-modallar)
4. [Dizayn Tizimi va 3 Oltin Qoida](#4-dizayn-tizimi-va-3-oltin-qoida)
5. [SVG Vektorlar va Ikonkalar Unifikatsiyasi](#5-svg-vektorlar-va-ikonkalar-unifikatsiyasi)
6. [Ma'lumotlar Boshqaruvi va Doimiylik (State Management)](#6-malumotlar-boshqaruvi-va-doimiylik-state-management)
7. [Texnologik Stek va Ishga Tushirish](#7-texnologik-stek-va-ishga-tushirish)

---

## 1. Loyiha Maqsadi va Umumiy Arxitektura

Platforma **Y Combinator** va **Linear/Vercel** standartlari asosida ishlab chiqilgan bo‘lib, universitet talabalari, yosh olimlari, dasturchilar va tadqiqotchilarning startap loyihalarini inkubatsiya qilish, jamoa shakllantirish, investorlar bilan bog‘lash hamda sanoat korxonalari (NKMK, Navoiyazot) bilan hamkorlik qilishga xizmat qiladi.

* **Foydalanuvchi qulayligi (UX):** Tezkor qidiruv, yorug‘/tungi rejim, to‘liq moslashuvchan (Responsive) interfeys, SPA arxitekturasi.
* **Vizual uslub:** Minimalistik, tipografik jihatdan aniq, yuqori kontrastli va professional.

---

## 2. Asosiy Modullar va Funksional Imkoniyatlar

### 2.1. Interaktiv Bosh Slayder (`HeroSlider.tsx` & `HeroSection.tsx`)
* **4 ta strategik slayd:**
  1. *Inkubatsiya va Akseleratsiya Markazi* — 45 kunlik intensiv dastur, kovorking va $5,000 grantlar.
  2. *NavDU Startap Klubi* — 1,500+ a’zolar, haftalik uchrashuvlar, Co-founder matching.
  3. *NavDU InnoHack 2026* — 60 mln so‘m sovrinli 48 soatlik yillik universitet hakatoni.
  4. *NKMK va Korxonalar Bilan B2B Hamkorlik* — sanoat integratsiyasi va $1M investitsiya fondi.
* **Boshqaruv elementlari:**
  * To‘liq ekran (Fullscreen) rejimi (`SvgMaximize` / `SvgMinimize`).
  * Avtomatik almashish, pauza (Hover paytida), progress indikatorlari va o‘qlar orqali boshqaruv.
  * Har bir slayddan tegishli bo‘limga (Ariza topshirish, Tadbirlar, Jamoa, Portfel) to‘g‘ridan-to‘g‘ri o‘tish tugmalari.

### 2.2. Dastur Bosqichlari (`ProgramSection.tsx`)
* 45 kunlik dasturning 4 ta bosqichi batafsil yoritilgan:
  1. G‘oya saralash va Qabul (1–10 kun).
  2. Prototip va MVP yaratish (11–25 kun).
  3. Bozor va Mijozlar Validatsiyasi (26–38 kun).
  4. Demo Day va Investorlar Pitchingi (39–45 kun).

### 2.3. Startaplar Katalogi va Reytingi (`PortfolioSection.tsx`)
* **Katalog (Grid) va Leaderboard (Reyting) ko‘rinishlari:**
  * Loyihalarni kategoriyalar bo‘yicha filtrlash (*AI & EdTech, AgroTech & Eco, GreenTech & Energy, Sanoat & IoT, MedTech & Salomatlik*).
  * Mavsumlar (Batch) bo‘yicha ajratish (*3-Mavsum 2026, 2-Mavsum 2025, 1-Mavsum 2024*).
  * Tezkor qidiruv maydoni.
* **Ovoz berish (Upvote) tizimi:**
  * Foydalanuvchilar startaplarni yuqoriga ko‘tarishi mumkin.
  * Ovoz berilganda `canvas-confetti` yordamida rang-barang vizual bayramona animatsiya ishlaydi.
* **Reyting medallari:** 1, 2 va 3-o‘rinlar uchun maxsus oltin, kumush va bronza vektor belgilari.
* **Pitch Deck Viewer:** Startap taqdimot slaydlarini saytning o‘zida interaktiv ko‘rish.

### 2.4. Startap Batafsil Sahifasi (`StartupDetailPage.tsx`)
* Har bir loyihaning to‘liq pasporti: Asoschilar, traksiya, jalb qilingan sarmoya, muammo va yechim, bozor tahlili, texnologik steki, ijtimoiy tarmoqlari va izohlar (Comments) bo‘limi.

### 2.5. Demo Day Natijalari (`DemoDaySection.tsx`)
* Demo Day doirasida jami jalb qilingan mablag‘ ($975,000) va eng katta investitsiya ($150,000) dinamikasi.
* `AnimatedCounter` yordamida raqamlarning silliq o‘sib chiqishi.
* Startaplar bo‘yicha foizli va grafikli sarmoya vizualizatsiyasi.

### 2.6. Yangiliklar va Matbuot Markazi (`NewsSection.tsx`, `NewsPage.tsx`, `NewsDetailPage.tsx`)
* Universitet, klub va rezident startaplar bo‘yicha e’lonlar, press-relizlar va yangiliklar.
* Toifalar, o‘qish vaqti, nashr sanasi, ko‘rishlar soni va to‘liq maqola o‘qish sahifasi.

### 2.7. Startup Playbook — Amaliy Bilimlar Bazasi (`PlaybookSection.tsx`, `PlaybookPage.tsx`)
* Startap boshlovchilar uchun 5 ta eng muhim qo‘llanma:
  1. G‘oyani tekshirish va Bozor tahlili (Idea Validation).
  2. Birinchi MVPni 0 dan yaratish yo‘riqnomasi.
  3. Investorlar oldida muvaffaqiyatli pitch qilish sirlari.
  4. Grantlar va davlat tanlovlarida g‘olib bo‘lish strategiyasi.
  5. Mahsulot va Bozor mosligi (Product-Market Fit)ga erishish.

### 2.8. Talent Pool & Hammuassislar Birjasi (`TalentPoolSection.tsx`, `CoFounderSection.tsx`)
* Dasturchilar, UI/UX dizaynerlar, marketologlar va muhandislarni startap loyihalar bilan bog‘lash.
* Vakansiyalar va ochiq pozitsiyalar ro‘yxati, rezyume yuborish va o‘z profilini Telegram orqali qo‘shish.

### 2.9. Hakatonlar va Tadbirlar (`EventsSection.tsx`, `EventDetailPage.tsx`)
* Universitet hakatoni, seminar va vorkshoplar taqvimi.
* Chipta bron qilish, QR-kodli qatnashuvchi chiptasi generatsiyasi, sana va joylashuv ma’lumotlari.

### 2.10. Mentorlar Tizimi (`MentorsSection.tsx`, `MentorDetailPage.tsx`)
* Tajribali ekspertlar, texnologik liderlar va investorlar profili.
* 1:1 formatda konsultatsiya va sessiya bron qilish.

### 2.11. Hamjamiyat Hikoyalari (`StoriesSection.tsx`, `StoryDetailPage.tsx`)
* Talaba rezidentlarning real tajribalari, startapdagi xatolari va yutuqlari.
* Yangi hikoya yozib nashrga topshirish imkoniyati.

### 2.12. Rasmiy Hamkorlar Marquee (`PartnersMarquee.tsx`)
* NKMK (Navoiy metallurgiya), Navoiyazot, IT Park Uzbekistan, Raqamli Texnologiyalar Vazirligi, Oliy Ta'lim Vazirligi va Aloqabank Ventures rasmiy SVG logotiplari uzluksiz silliq siljish animatsiyasi bilan namoyish etilgan.

---

## 3. Interaktiv Xususiyatlar va Modallar

1. **Spotlight Tezkor Qidiruv (`CommandPalette.tsx`):**
   * Klaviatura orqali `⌘K` yoki `Ctrl + K` bosilganda ochiladi.
   * Startaplar, tadbirlar, yangiliklar, mentorlar, vakansiyalar va qo‘llanmalarni 1 soniyada qidirib, darhol o‘sha sahifaga o‘tish imkonini beradi.
2. **Ariza Topshirish Tizimi (`ApplySection.tsx`):**
   * Talabalar 45 kunlik dasturga loyiha nomi, yo‘nalishi, jamoasi va taqdimoti bilan ariza topshiradi.
   * Muvaffaqiyatli topshirilganda unikal Ariza ID (`APP-...`) beriladi.
3. **Ariza Holatini Tekshirish Modali (`StatusCheckModal.tsx`):**
   * Topshirilgan arizaning holatini (Kutilmoqda, Ko‘rib chiqilmoqda, Qabul qilindi, Rad etildi) kodi orqali real vaqtda tekshirish.
4. **Tadbirga Ro‘yxatdan O‘tish Modali (`EventRegisterModal.tsx`):**
   * Bepul ro‘yxatdan o‘tish va QR-kodli tasdiqnomani olish.
5. **Mentor Sessiyasini Band Qilish Modali (`MentorBookingModal.tsx`):**
   * Mentor bilan vaqt va loyiha muammosini kelishish.
6. **Vakansiya va Hikoya Yaratish Modallari (`CreateVacancyModal.tsx`, `CreateStoryModal.tsx`):**
   * Yangi jamoa a’zosi qidirish yoki muvaffaqiyat hikoyasini bo‘lishish.

---

## 4. Dizayn Tizimi va 3 Oltin Qoida

Platforma interfeysi **3 ta oltin qoida** asosida qayta ishlandi:

### 1-qoida: "Less is more" (Kamroq, lekin sifatli)
* Bo‘limlar tepasidagi barcha badgelar (`02 / Portfel`, `05 / Tadbirlar`, `07 / Talent Pool`, `08 / Yangiliklar`, `09 / Playbook`) ichidagi mayda dekorativ piktogrammalar olib tashlandi.
* Ortiqcha elementlar kamaytirilib, diqqat mazmunli tipografiya va aniq vizual ierarxiyaga qaratildi (Linear/Vercel/YC uslubi).

### 2-qoida: Standart o‘lchamlar
* **`16×16px` (`w-4 h-4`):** Navigatsiya havolalari, qidiruv tugmalari, mavzu almashtirgichlar, matn ichidagi piktogrammalar.
* **`20×20px` (`w-5 h-5`):** Kartalar, reyting medallari va asosiy bo‘lim sarlavhalari.
* **`14×14px` (`w-3.5 h-3.5`):** Sana, o‘qish vaqti kabi mikro metama’lumotlar.

### 3-qoida: Monoxrom & 1.6px Outline vektorlar (`currentColor`)
* Eski 48×48 ko‘p rangli 3D gradientli piktogrammalar butunlay o‘chirildi.
* Barcha piktogrammalar sof **24×24 `viewBox`**, **1.6px stroke** va **`currentColor`** formatiga o‘tkazildi. Bu ularga har qanday fonda, shuningdek Dark/Light rejimida konteyner matn rangiga qarab mukammal moslashish imkonini beradi.

---

## 5. SVG Vektorlar va Ikonkalar Unifikatsiyasi

Barcha piktogrammalar bitta markaziy modulda jamlangan: [`src/components/icons/CustomIcons.tsx`](file:///D:/uzcombinator/src/components/icons/CustomIcons.tsx).
* Tashqi og‘ir ikonka paketlari (lucide-react, react-icons va h.k.) o‘rniga toza, yengil, mustaqil va sifatli SVG komponentlar yaratildi.
* **Asosiy vektorlar:** `SvgRocket`, `SvgTrophy`, `SvgNewspaper`, `SvgSparkles`, `SvgGraduation`, `SvgCalendar`, `SvgUsers`, `SvgSearch`, `SvgCommand`, `SvgSun`, `SvgMoon`, `SvgPitchDeck`, `SvgMedalGold`, `SvgMedalSilver`, `SvgMedalBronze`, `SvgBookOpen`, `SvgLogoNKMK`, `SvgLogoNavoiyazot`, `SvgLogoITPark`, `SvgLogoDigitalGov`, `SvgLogoHigherEdu`, `SvgLogoAloqabank`, `SvgCheckCircle2`, `SvgArrowRight` va boshqa 72+ ta komponent.

---

## 6. Ma'lumotlar Boshqaruvi va Doimiylik (State Management)

* Barcha asosiy ma’lumotlar (`startups`, `stories`, `events`, `vacancies`, `applications`, `news`) brauzerning `localStorage` xotirasiga avtomatik sinxronlanadi:
  * `uzc_startups`
  * `uzc_stories`
  * `uzc_events`
  * `uzc_vacancies`
  * `uzc_applications`
  * `uzc_news`
* Foydalanuvchi yangi ariza topshirsa, ovoz bersa yoki yangi hikoya/vakansiya qo‘shsa, ma’lumotlar sahifa yangilanganidan keyin ham saqlanib qoladi.

---

## 7. Texnologik Stek va Ishga Tushirish

* **Frontend:** React 19, TypeScript
* **Yig‘uvchi (Bundler):** Vite 8
* **Stillash (Styling):** Tailwind CSS, PostCSS
* **Animatsiyalar:** Framer Motion, Canvas Confetti
* **Marshrutlash (Routing):** React Router DOM 7
* **Kompilyatsiya holati:** `npm run build` orqali to‘liq tekshirilgan (0 xato, 800-900ms ichida yig‘iladi).
* **Ishga tushirish buyrug‘i:**
  ```bash
  npm run dev
  ```
  Lokal havola: `http://localhost:5173`

---

*Hujjat yaratildi: 2026-09-13*  
*NavDU Inkubatsiya va Akseleratsiya Markazi / UZ Combinator loyihasi*
