# 🛠️ NAVDU STARTAP PLATFORMASINI MAHALLIY (LOCAL) ISHLAB CHIQISH BO‘YICHA TO‘LIQ QADAM-BA-QADAM QO‘LLANMA

Ushbu qo‘llanma **Final Mikroservis Arxitekturasi** asosida loyihani kompyuteringizda (Windows muhitida) noldan boshlab bosqichma-bosqich, xavfsiz va xatosiz ishga tushirish bo‘yicha to‘liq amaliy yo‘riqnomadir.

---

## 📑 BOSQICHLAR REJASI
* **0-BOSQICH:** Mahalliy Dasturiy Muhitni Tayyorlash (Prerequisites)
* **1-BOSQICH:** Loyiha Papkalarining Skeletini Hosil Qilish (Scaffolding)
* **2-BOSQICH:** 1-Mikroservis — CMS & Layout Service (Frontendni Boshqaruvchi Django)
* **3-BOSQICH:** 2-Mikroservis — Application Service & Telegram Bot OTP Integratsiyasi
* **4-BOSQICH:** 3-Mikroservis — Startups & Upvote Service (FastAPI / DRF)
* **5-BOSQICH:** 4-Mikroservis — Events & QR-Chiptalar Servisi
* **6-BOSQICH:** API Gateway (Nginx) Yagona Kirish Porti
* **7-BOSQICH:** React Frontendni API larga To‘liq Ulash (End-to-End)
* **8-BOSQICH:** Sinov, Debugging va Ishga Tushirish Tekshiruvi

---

## 0-BOSQICH: MAHALLIY MUHITNI TAYYORLASH (PREREQUISITES)

### 0.1. O‘rnatilgan bo‘lishi lozim bo‘lgan vositalar:
1. **Node.js (v18+) & npm** — Allaqachon kompyuteringizda bor (Frontend hozir `http://localhost:5173` da ishlab turibdi).
2. **Python (v3.11 yoki v3.12)** — Django va FastAPI mikroservislari uchun.
   * Tekshirish buyrug‘i: `python --version`
3. **Git** — Versiyalar nazorati uchun.
4. **Docker Desktop (Ixtiyoriy, lekin tavsiya etiladi)** — Barcha servislarni va PostgreSQL/Redis'ni bitta buyruq bilan yoqish uchun.
   * *Agar Docker bo‘lmasa ham muammo yo‘q: dastlabki bosqichda SQLite va lokal Python bilan juda yengil ishga tushira olamiz!*

---

## 1-BOSQICH: LOYIHA PAPKALARINING SKELETINI HOSIL QILISH

Loyiha ildizida (`D:\uzcombinator`) quyidagi papkalar strukturasini quramiz:

```bash
D:\uzcombinator\
├── src/                     # Allaqachon mavjud bo‘lgan React 19 frontendimiz
├── gateway/                 # Nginx API Gateway sozlamalari
└── services/                # Mikroservislar jamlangan joy
    ├── cms_service/         # 1-servis: Slayder, Bo‘limlar, Matnlar (Django)
    ├── application_service/ # 2-servis: 45 kunlik arizalar (Django)
    ├── startup_service/     # 3-servis: Startaplar va Upvote ovozlar
    ├── event_service/       # 4-servis: Hakatonlar va QR chiptalar
    └── bot_worker/          # 5-servis: Telegram Bot OTP xizmati
```

---

## 2-BOSQICH: 1-MIKROSERVIS — CMS & LAYOUT SERVICE (DJANGO)
> **Maqsad:** Saytning butun ko‘rinishini (Hero Slayder, Ticker, Bo‘limlar ketma-ketligi, Metrikalar) admin paneldan boshqarish.

### Qadamlar:
1. **Virtual muhit (venv) yaratish va paketlarni o‘rnatish:**
   ```powershell
   cd D:\uzcombinator\services\cms_service
   python -m venv venv
   .\venv\Scripts\activate
   pip install django djangorestframework django-cors-headers pillow django-unfold
   ```
2. **Django loyihasini ishga tushirish:**
   ```powershell
   django-admin startproject config .
   python manage.py startapp layout
   ```
3. **`layout/models.py` da modellar yaratish:**
   * `HeroSlide` (Sarlavha, rasm, tugma matni, tartibi, faolligi)
   * `SectionConfig` (Bo‘lim nomi, ko‘rinishi: True/False, tartib raqami)
   * `TopTicker` (Tepa e’lon matni, faolligi)
   * `PlatformMetric` (Investitsiya summasi, rezidentlar soni)
4. **`layout/admin.py` da chiroyli admin panelni sozlash:**
   * Jadvalda sudrab tartiblash (drag & drop order), 1-klikda yoqish/o‘chirish (`list_editable = ['is_active', 'order']`).
5. **Migratsiya va Superadmin yaratish:**
   ```powershell
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser
   # Login: admin
   # Parol: navdu2026!
   ```
6. **DRF API Serializer va ViewSet ochish:**
   * `GET /api/v1/cms/layout/` ➔ Barcha faol bo‘limlar va slaydlarni JSON formatda chiqaradi.
7. **Serverni port 8001 da yoqish:**
   ```powershell
   python manage.py runserver 8001
   ```
   * Natija: `http://localhost:8001/admin/` manzilida to‘liq boshqaruv paneli tayyor!

---

## 3-BOSQICH: 2-MIKROSERVIS — APPLICATION SERVICE & TELEGRAM BOT OTP
> **Maqsad:** Talabalarning 45 kunlik dasturga topshirgan arizalarini qabul qilish, Telegram Bot orqali 1-klikda OTP tasdiqlash va adminga xabar yuborish.

### Qadamlar:
1. **Loyiha va muhit tayyorlash:**
   ```powershell
   cd D:\uzcombinator\services\application_service
   python -m venv venv
   .\venv\Scripts\activate
   pip install django djangorestframework django-cors-headers requests
   django-admin startproject config .
   python manage.py startapp applications
   ```
2. **`applications/models.py` da `Application` modeli:**
   * `id` (masalan: `UZC-NAVDU-2026-301`)
   * `team_name`, `founder_name`, `phone`, `email`, `telegram_username`
   * `faculty`, `course`, `project_name`, `category`, `stage`
   * `problem`, `solution`, `target_market`, `deck_url`
   * `status` (Kutilmoqda, Ko‘rib chiqilmoqda, Qabul qilindi, Rad etildi)
   * `feedback` (Talabaga yuboriladigan izoh)
   * `otp_code`, `is_verified` (Telegram orqali tasdiqlanganlik holati)
3. **Telegram Bot yaratish (@BotFather orqali):**
   * Bot nomi: `@navdu_startup_bot`
   * Bot tokenni olish va `services/bot_worker/` ga kiritish.
4. **OTP va Deep-Linking API:**
   * Talaba ariza to‘ldirganda ➔ `POST /api/v1/applications/draft/`
   * Backend unikal havola beradi: `t.me/navdu_startup_bot?start=auth_9281`
   * Talaba botda `/start` ni bossa, bot unga kod yuboradi: `48192`.
   * Talaba kodni saytga yozsa ➔ `POST /api/v1/applications/verify-otp/` ➔ Ariza rasman qabul qilinadi.
5. **Admin bildirishnomasi:**
   * Ariza tasdiqlanishi bilan Telegram Bot universitet ma’murlarining maxsus Telegram guruhiga talabaning kartochkasi va PDF taqdimot linkini yuboradi.
6. **Serverni port 8002 da yoqish:**
   ```powershell
   python manage.py runserver 8002
   ```

---

## 4-BOSQICH: 3-MIKROSERVIS — STARTUPS & UPVOTE SERVICE
> **Maqsad:** Rezident startaplar katalogi, Pitch Deck tomoshabini va yuqori tezlikdagi Upvote (ovozlar) reytingi.

### Qadamlar:
1. **Modellar:**
   * `Startup` (Nomi, logotip, tavsif, asoschilar, kategoriya, mavsum, investitsiya summasi, taqdimot fayli).
   * `Upvote` (Foydalanuvchi bitta startapga faqat 1 marta ovoz berishi uchun cheklov).
2. **Leaderboard API:**
   * `GET /api/v1/startups/leaderboard/` ➔ Ovozlar soni bo‘yicha eng yuqori startaplarni saralab uzatadi.
3. **Port 8003 da ishga tushirish.**

---

## 5-BOSQICH: 4-MIKROSERVIS — EVENTS & QR-CHIPTA SERVISI
> **Maqsad:** Hakatonlar, seminarlar, ro‘yxatdan o‘tish va QR chiptalar yaratish.

### Qadamlar:
1. **Modellar:**
   * `Event` (Tadbir nomi, turi, sanasi, vaqti, joyi, sovrin fondi).
   * `Ticket` (Talaba F.I.Sh, telefon, unikal `ticket_id`, `qr_code_image`, davomat statusi: kelgan/kelmagan).
2. **QR-kod generatsiyasi (`qrcode` Python kutubxonasi):**
   * Talaba ro‘yxatdan o‘tishi bilan serverda QR-kod yaratiladi va uning brauzerida hamda Telegram botida chipta shaklida ko‘rsatiladi.
3. **Tadbir eshigidagi tekshiruv API:**
   * `POST /api/v1/events/verify-ticket/` ➔ Tashkilotchi QR-kodni skanerlaganda chipta haqiqiyligini tekshirib, davomatga belgi qo‘yadi.
4. **Port 8004 da ishga tushirish.**

---

## 6-BOSQICH: API GATEWAY (NGINX) — YAGONA KIRISH PORTI
> **Maqsad:** Barcha mikroservislarni bitta yagona manzilga birlashtirish (`http://localhost:80`).

### `gateway/nginx.conf` Fayli:
```nginx
events {}

http {
    server {
        listen 80;

        # Frontend SPA
        location / {
            proxy_pass http://localhost:5173;
            proxy_set_header Host $host;
        }

        # 1. CMS Service
        location /api/v1/cms/ {
            proxy_pass http://localhost:8001/api/v1/cms/;
        }
        location /admin/cms/ {
            proxy_pass http://localhost:8001/admin/;
        }

        # 2. Application Service
        location /api/v1/applications/ {
            proxy_pass http://localhost:8002/api/v1/applications/;
        }
        location /admin/apps/ {
            proxy_pass http://localhost:8002/admin/;
        }

        # 3. Startups Service
        location /api/v1/startups/ {
            proxy_pass http://localhost:8003/api/v1/startups/;
        }

        # 4. Events & Tickets Service
        location /api/v1/events/ {
            proxy_pass http://localhost:8004/api/v1/events/;
        }
    }
}
```

---

## 7-BOSQICH: REACT FRONTENDNI API LARGA ULASH (END-TO-END)

React 19 loyihamizdagi statik/lokal ma’lumotlarni haqiqiy backendga ulaymiz:

1. **`src/api/client.ts` — Axios/Fetch bazaviy mijozini yaratish:**
   * Baza URL: `/api/v1`
2. **`src/api/cmsApi.ts`:**
   * `fetchLayout()` ➔ Serverdan bo‘limlar tartibini oladi.
   * `fetchHeroSlides()` ➔ Slayderlarni serverdan yuklaydi.
3. **`src/api/applicationsApi.ts`:**
   * `submitApplication(data)` ➔ Ariza topshirish va Telegram OTP oynasini chaqirish.
   * `checkApplicationStatus(id)` ➔ Talabaning ariza holatini bazadan ko‘rsatish.
4. **`src/components/HeroSlider.tsx`:**
   * Slaydlar statik massivdan emas, serverdan kelgan real ma’lumotlar asosida dinamik aylanadi.

---

## 8-BOSQICH: TEST VA TEKSHIRUV SIKLI

1. **Test 1 (CMS Boshqaruv):**
   * `http://localhost:8001/admin/` ga kirib, 1-slayd sarlavhasini *"NavDU 2026 Yangi Mavsum"* deb o‘zgartiramiz.
   * `http://localhost:5173` sahifasini yangilaymiz — matn darhol o‘zgarganini tekshiramiz!
2. **Test 2 (Ariza & Telegram OTP):**
   * Saytda test arizasini to‘ldiramiz.
   * Telegram Bot orqali OTP kod olib, saytga kiritamiz.
   * Admin panelda va Telegram guruhda yangi ariza tushganini ko‘ramiz.
3. **Test 3 (Ariza Statusini O‘zgartirish):**
   * Adminkada arizani ochib, statusini *"Qabul qilindi"* qilamiz.
   * Saytdagi "Ariza holati" tugmasini bosib, kiritilgan kod bo‘yicha talabaga yashil diplom va taklifnoma chiqqanini ko‘ramiz.

---

*Hujjat saqlandi: 2026-09-13*  
*NavDU Inkubatsiya Markazi — Mahalliy Ishga Tushirish Qo‘llanmasi*
