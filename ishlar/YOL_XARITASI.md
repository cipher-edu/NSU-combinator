# 🗺️ NAVDU STARTAP KLUBI (UZ COMBINATOR) — BOSQICHMA-BOSQICH YO‘L XARITASI (ROADMAP)

Ushbu yo‘l xaritasi loyihani noldan boshlab to‘liq mikroservis arxitekturasiga o‘tkazish, frontendni adminkadan boshqariladigan qilish (Server-Driven UI) va Telegram OTP tizimini joriy etish bo‘yicha bajarilgan amaliy vazifalar monitoringidir.

---

## 📊 LOYIHA BOSQICHLARI VA PROGRESSI

### ✅ 1-FAZA: TAYYORGARLIK VA ARXITEKTURA (Tugallandi)
- [x] **Frontend Dizayni:** 3 ta oltin qoida asosida to‘liq unifikatsiya qilindi (Less is more, standart 16px/20px o‘lchamlar, monoxrom 1.6px SVG vektorlar).
- [x] **Texnik Hujjatlashtirish:** `ishlar/BAJARILGAN_ISHLAR.md` to‘liq yozildi.
- [x] **Final Mikroservis Arxitekturasi:** `ishlar/MIKROSERVIS_ARXITEKTURA_FINAL.md` master hujjati tasdiqlandi.
- [x] **Mahalliy Yo‘riqnoma:** `ishlar/LOCAL_ISHGA_TUSHIRISH_REJASI.md` tuzildi.

---

### ✅ 2-FAZA: MIKROSERVISLAR SKELETI (SCAFFOLDING) (Tugallandi)
- [x] **2.1. Papkalar va Servislar strukturasini yaratish:**
  - `gateway/` — Nginx konfiguratsiyasi (`gateway/nginx.conf`) va ko‘p bazali PostgreSQL skripti (`gateway/init-multiple-dbs.sh`).
  - `services/cms_service/` — Slayder, Bo‘limlar, Matnlar (Django + DRF).
  - `services/application_service/` — 45 kunlik arizalar & Baholash (Django + DRF).
  - `services/startup_service/` — Startaplar va Upvote hisoblagich (FastAPI + JSON doimiy saqlash).
  - `services/event_service/` — Hakatonlar va QR chiptalar (Django + DRF).
  - `services/bot_worker/` — Telegram Bot OTP xizmati (aiogram 3.x).
- [x] **2.2. Docker Compose fayli:** `docker-compose.yml` loyiha ildiziga joylandi, multi-DB initsializatsiyasi sozlandi.

---

### ✅ 3-FAZA: 1-MIKROSERVIS — CMS & LAYOUT SERVICE (DJANGO) (Tugallandi)
- [x] **3.1. Django Loyihasi va Modellar:**
  - `HeroSlide` (Slayder sarlavhalari, rasm, CTA tugmalari, 1-klik tahrir).
  - `SectionConfig` (Bo‘limlar tartibi va ko‘rinishi: On/Off).
  - `TopTicker` (Tepa e’lon banneri).
  - `PlatformMetric` (Investitsiya va rezidentlar soni).
  - `PartnerLogo` (Hamkor tashkilotlar logotiplari).
- [x] **3.2. Super-qulay Admin Panel:**
  - `admin.py` orqali matnlarni 1-klikda tahrirlash imkoniyati yaratildi.
- [x] **3.3. REST API Endpointlari & Seeding:**
  - `GET /api/v1/cms/layout/` (FullLayoutAPIView).
  - `GET /api/v1/cms/hero-slides/`
  - `GET /api/v1/cms/sections/`
  - `seed_cms.py` boshlang‘ich slaydlarni avtomatik to‘ldirish skripti.

---

### ✅ 4-FAZA: 2-MIKROSERVIS — APPLICATION SERVICE & TELEGRAM BOT OTP (Tugallandi)
- [x] **4.1. Ariza Modeli (`Application`):**
  - Talaba ma’lumotlari, startap g‘oyasi, muammo, yechim, taqdimot PDF havolasi.
  - Holat maydoni: `Kutilmoqda`, `Ko‘rib chiqilmoqda`, `Qabul qilindi`, `Rad etildi`.
  - Rasmiy izoh (Feedback) maydoni.
- [x] **4.2. Telegram Bot OTP Mexanizmi:**
  - Talaba anketani to‘ldirganda `POST /api/v1/applications/draft/` orqali OTP yaratish va `t.me/navdu_startup_bot?start=auth_<id>` linkini berish.
  - `POST /api/v1/applications/verify-otp/` orqali botdan olingan 5 xonali kodni tasdiqlash.
- [x] **4.3. Admin Guruhiga Xabarnoma:**
  - `send_telegram_admin_alert` funksiyasi yangi tasdiqlangan ariza kelganda universitet adminlariga bildirishnoma jo‘natadi.

---

### ✅ 5-FAZA: 3-MIKROSERVIS — STARTUPS & UPVOTES (FASTAPI) (Tugallandi)
- [x] **5.1. Startaplar Modeli va Katalogi:**
  - Rezident loyihalar ro‘yxati, toifalar, mavsumlar (3-Mavsum 2026).
  - Fayl tizimida doimiy JSON xotira (`startups_data.json`) integratsiya qilindi.
- [x] **5.2. Ovoz Berish (Upvotes) va Leaderboard:**
  - `POST /api/v1/startups/{id}/upvote` orqali ovozlar sonini oshirish va darhol saqlash.
  - `GET /api/v1/startups/leaderboard/` reytingi.

---

### ✅ 6-FAZA: 4-MIKROSERVIS — EVENTS & QR-CHIPTA SERVISI (Tugallandi)
- [x] **6.1. Hakatonlar va Tadbirlar:**
  - *NavDU InnoHack 2026*, seminarlar kalendari modeli va API.
- [x] **6.2. Raqamli QR-Chiptalar:**
  - Ro‘yxatdan o‘tgan talabaga unikal QR-kodli chipta generatsiyasi.
  - Nazoratchi uchun chiptani tasdiqlash API (`/api/v1/events/verify-ticket/`).

---

### ✅ 7-FAZA: API GATEWAY & FRONTEND INTEGRATSIYASI (END-TO-END) (Tugallandi)
- [x] **7.1. Nginx Gateway:** Barcha servislarni bitta portga birlashtirish (`:80`).
  - `/api/v1/cms/` -> `cms-service:8001`
  - `/api/v1/applications/` -> `application-service:8002`
  - `/api/v1/startups/` -> `startup-service:8003`
  - `/api/v1/events/` -> `event-service:8004`
- [x] **7.2. Frontend API Mijozlari:**
  - `src/api/client.ts`
  - `src/api/cmsApi.ts`
  - `src/api/applicationsApi.ts`
  - `src/api/startupsApi.ts`
  - `src/api/eventsApi.ts`
- [x] **7.3. Dinamik UI va Server-Driven Boshqaruv:**
  - `src/App.tsx`: `cmsApi.getFullLayout()` orqali serverdan kelgan sozlamalarga ko‘ra bo‘limlarni ko‘rsatish/yashirish (`isSectionVisible`).
  - `src/components/HeroSlider.tsx`: Serverdan kelgan slaydlarni chizish, offline holatda lokal fallback.
  - `src/components/Navbar.tsx`: Adminkadan o‘zgaruvchi tepa mikro-ticker (`customTicker`).
  - `src/components/ApplySection.tsx`: 4 bosqichli anketadan keyin 1-klikli **Telegram Bot OTP Verification** oynasi.
  - `src/components/StatusCheckModal.tsx`: `applicationsApi.checkStatus()` orqali jonli tekshiruv.
- [x] **7.4. Muvaffaqiyatli Kompilyatsiya:** Vite HMR dev server 0 xato bilan `http://localhost:5173` da ishlamoqda.

---

*Hujjat yangilandi: 2026-09-13*  
*NavDU Inkubatsiya Markazi / UZ Combinator Ekotizimi*
