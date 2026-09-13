# 🏛️ NAVDU STARTAP KLUBI & INKUBATSIYA MARKAZI (UZ COMBINATOR)
# FINAL MIKROSERVIS ARXITEKTURASI HUJJATI (COMPLETE SYSTEM SPECIFICATION)

> **Hujjat Versiyasi:** 2.0-FINAL  
> **Sana:** 2026-09-13  
> **Loyiha:** Navoiy Davlat Universiteti Inkubatsiya & Akseleratsiya Markazi  
> **Status:** Ishlab chiqish va integratsiya uchun tasdiqlangan bosh arxitektura  

---

## 📑 MUNDARIJA
1. [Tizimning Umumiy Xaritasi & Ma'lumotlar Oqimi](#1-tizimning-umumiy-xaritasi--malumotlar-oqimi)
2. [Mikroservislar Ro'yxati, Portlar va Vazifalari](#2-mikroservislar-royxati-portlar-va-vazifalari)
3. [Server-Driven UI / Headless CMS (Frontendni Adminkadan Boshqarish)](#3-server-driven-ui--headless-cms-frontendni-adminkadan-boshqarish)
4. [Telegram Bot OTP & Ro'yxatdan O'tishning To'liq Zanjiri](#4-telegram-bot-otp--royxatdan-otishning-toliq-zanjiri)
5. [3-Qatlamli Aqlli Kesh Tizimi (Memory & Performance)](#5-3-qatlamli-aqlli-kesh-tizimi-memory--performance)
6. [API Shartnomalari (REST Endpoints & Payloads)](#6-api-shartnomalari-rest-endpoints--payloads)
7. [Ma'lumotlar Bazasi Sxemasi (Database Schemas)](#7-malumotlar-bazasi-sxemasi-database-schemas)
8. [Foydalanuvchi va Admin Huquqlari Matritsasi (RBAC & Security)](#8-foydalanuvchi-va-admin-huquqlari-matritsasi-rbac--security)
9. [Infratuzilma va Konteynerizatsiya (Docker Compose)](#9-infratuzilma-va-konteynerizatsiya-docker-compose)
10. [Loyiha Papkalarining To'liq Arxitekturasi](#10-loyiha-papkalarining-toliq-arxitekturasi)

---

## 1. TIZIMNING UMUMIY XARITASI & MA'LUMOTLAR OQIMI

```
                                FOYDALANUVCHILAR
      ┌────────────────────────────────────────────────────────────────────────┐
      │  Talaba / Tashrifchi (React 19 SPA)  │  Universitet Admini (Admin UI) │
      └───────────────────────────────────┬────────────────────────────────────┘
                                          │
                                          ▼ HTTPS (:443)
      ┌────────────────────────────────────────────────────────────────────────┐
      │                   1. REVERSE PROXY & API GATEWAY                      │
      │   (Nginx / Traefik)                                                    │
      │   • SSL Termination, CORS, DDoS & Rate Limiting                       │
      │   • 304 Not Modified & Gzip/Brotli siqish                             │
      │   • Dinamik yo'naltirish (Reverse Proxy)                               │
      └───────┬──────────────┬──────────────┬──────────────┬─────────────┬─────┘
              │              │              │              │             │
/api/v1/cms/* │/api/v1/app/* │/api/v1/str/* │/api/v1/evt/* │/api/auth/*  │/api/ws/*
              ▼              ▼              ▼              ▼             ▼
┌──────────────────┐┌──────────────────┐┌──────────────────┐┌──────────────────┐┌──────────────────┐
│ 1. CMS SERVICE   ││ 2. APPLICATION   ││ 3. STARTUPS &    ││ 4. EVENTS &      ││ 5. AUTH & RBAC   │
│ (Django/Python)  ││    SERVICE       ││    LEADERBOARD   ││    TICKETING     ││ (Identity)       │
│ Port: :8001      ││ Port: :8002      ││ Port: :8003      ││ Port: :8004      ││ Port: :8005      │
├──────────────────┤├──────────────────┤├──────────────────┤├──────────────────┤├──────────────────┤
│ • Slayderlar     ││ • 45 kunlik qabul││ • Rezidentlar    ││ • InnoHack 2026  ││ • JWT Auth       │
│ • Bo'lim tartibi ││ • Status tekshir ││ • Upvote ovozlar ││ • QR Chiptalar   ││ • Rektorat       │
│ • Ticker banneri ││ • Hakamlar balli ││ • Pitch Deck PDF ││ • QR Validator   ││ • Moderator      │
│ • Metrikalar     ││ • Feedback xati  ││ • Real-time reyting│ • Davomat monitoring│ Mentor rollari  │
└────────┬─────────┘└────────┬─────────┘└────────┬─────────┘└────────┬─────────┘└────────┬─────────┘
         │                   │                   │                   │                   │
         ▼                   ▼                   ▼                   ▼                   ▼
┌──────────────────┐┌──────────────────┐┌──────────────────┐┌──────────────────┐┌──────────────────┐
│ DB: cms_db       ││ DB: apps_db      ││ DB: startups_db  ││ DB: events_db    ││ DB: auth_db      │
│ (PostgreSQL)     ││ (PostgreSQL)     ││ (PostgreSQL)     ││ (PostgreSQL)     ││ (PostgreSQL)     │
└──────────────────┘└────────┬─────────┘└────────┬─────────┘└──────────────────┘└──────────────────┘
                             │                   │
                             └─────────┬─────────┘
                                       │ Event Emitted ("ApplicationSubmitted", "Upvoted")
                                       ▼
      ┌────────────────────────────────────────────────────────────────────────┐
      │        6. ASINXRON XABARLAR SHINASI & KESH (REDIS & RABBITMQ)          │
      │   Port: :6379                                                          │
      │   • Kesh qatlami (In-Memory Data Store)                                │
      │   • Hodisalar navbati (Task Queue / Celery)                            │
      └────────────────────────────────┬───────────────────────────────────────┘
                                       │ Task Consumption
                                       ▼
      ┌────────────────────────────────────────────────────────────────────────┐
      │             7. NOTIFICATION & TELEGRAM BOT WORKER SERVICE              │
      │   (Python aiogram 3.x + Celery Worker)                                 │
      │   • Telegram Bot orqali 1-klikda OTP kod yuborish                      │
      │   • Rektorat & Admin guruhiga talaba arizasini tezkor yuborish         │
      │   • Ariza holati o'zgarganda talabaga Telegram orqali xabar berish    │
      └────────────────────────────────────────────────────────────────────────┘
```

---

## 2. MIKROSERVISLAR RO'YXATI, PORTLAR VA VAZIFALARI

| # | Mikroservis Nomi | Texnologiya | Port | Asosiy Vazifasi |
|---|---|---|---|---|
| **1** | **API Gateway** | Nginx / Alpine | `80`, `443` | Yagona kirish, SSL, CORS, so'rovlarni mikroservislarga taqsimlash, kesh. |
| **2** | **CMS & Layout Service** | Django 5 + DRF | `8001` | Server-Driven UI: Bosh sahifa slaydlari, bo'limlar tartibi, matnlar, logolar. |
| **3** | **Application Service** | Django 5 + DRF | `8002` | 45 kunlik akseleratsiya arizalari, saralash, status tekshirish, rasmiy feedback. |
| **4** | **Startup & Upvote Service** | FastAPI (Async) | `8003` | Startaplar katalogi, Pitch Deck fayllari, soniyasiga minglab upvote ovozlarni qabul qilish. |
| **5** | **Events & Ticket Service** | Django 5 + DRF | `8004` | Hakatonlar, seminarlar, ro'yxatdan o'tish va QR-kodli chiptalar generatsiyasi hamda tekshiruvi. |
| **6** | **Auth & Identity Service** | Django + SimpleJWT | `8005` | Foydalanuvchilar, rollar (Superadmin, Moderator, Mentor), tokenlar. |
| **7** | **Notification & Bot Worker** | Python aiogram + Redis | Worker | Telegram OTP kodlar, admin guruhga xabarnomalar, QR chiptalarni yuborish. |
| **8** | **Message Broker & Cache** | Redis 7 Alpine | `6379` | Tezkor kesh, ovozlar hisobi, xabarlar navbati. |

---

## 3. SERVER-DRIVEN UI / HEADLESS CMS (FRONTENDNI ADMINKADAN BOSHQARISH)

Admin paneldagi o'zgarishlar React 19 frontendida kodga tegmasdan darhol aks etadi:

### 3.1. Boshqariladigan Bloklar Ro'yxati:
1. **HeroSlider (`HeroSlide` modeli):**
   * Sarlavha (`title`), urg'uli so'z (`title_accent`), tavsif (`description`), fon rasmi (`image_url`).
   * Tugmalar: CTA matni (`cta_text`), ikkinchi tugma matni (`secondary_cta_text`), havola yo'nalishi.
   * Ko'rsatilish tartibi (`order`) va faollik holati (`is_active`).
2. **Bo'limlar Ketma-Ketligi va Ko'rinishi (`SectionLayout` modeli):**
   * Har bir bo'limni admin 1 ta klik bilan o'chirib qo'yishi yoki tartibini almashtirishi mumkin:
     * `hero_slider` (Faol: Ha/Yo'q, Tartib: 1)
     * `program_stages` (Faol: Ha/Yo'q, Tartib: 2)
     * `portfolio_section` (Faol: Ha/Yo'q, Tartib: 3)
     * `demo_day_section` (Faol: Ha/Yo'q, Tartib: 4)
     * `news_section` (Faol: Ha/Yo'q, Tartib: 5)
     * `events_section` (Faol: Ha/Yo'q, Tartib: 6)
     * `talent_pool_section` (Faol: Ha/Yo'q, Tartib: 7)
     * `playbook_section` (Faol: Ha/Yo'q, Tartib: 8)
     * `partners_marquee` (Faol: Ha/Yo'q, Tartib: 9)
3. **Sayt Tepa E'lon Banneri (`TopTicker` modeli):**
   * Matn: *"3-Mavsum arizalari qabuli ochiq! Dastur 1-oktyabrdan boshlanadi."*
   * Rang sxemasi (Brand ko'k / Qizil / Yashil).
   * Tugma matni va havolasi.
4. **Platforma Metrikalari (`PlatformMetrics` modeli):**
   * Jami jalb qilingan investitsiya: `$975,000` (Adminda o'zgartirilsa, saytdagi animatsiyali sanagich yangi songacha sanaydi).
   * Rejalashtirilgan grantlar soni, faol rezidentlar soni.
5. **Hamkorlar Logotiplari (`PartnerLogo` modeli):**
   * Yangi hamkor tashkilot qo'shilganda SVG yoki PNG logotipi yuklanadi, avtomatik ravishda Marquee aylanish qatoriga qo'shiladi.

---

## 4. TELEGRAM BOT OTP & RO'YXATDAN O'TISHNING TO'LIQ ZANJIRI

### 4.1. Jarayon Algoritmi:
```
[Talaba Saytda Formani To'ldiradi] 
             │
             ▼ POST /api/v1/applications/draft/
[Application Service: Vaqtinchalik sessiya yaratadi: session_id = "sess_94821"]
             │
             ▼ Hodisa chiqariladi: Redis -> "SendOtpRequest"
[Bot Worker: "https://t.me/navdu_startup_bot?start=sess_94821" havolasini tayyorlaydi]
             │
             ▼ Saytda Telegram Tasdiqlash Modali Chiqadi
[Talaba 1-klikda Telegram Botga o'tadi va /start ni bosadi]
             │
             ▼
[Telegram Bot: 
 1. Talabaning Telegram ID va ismini tasdiqlaydi.
 2. 5 xonali OTP kod beradi: [ 7 4 9 1 2 ] (yoki avtomatik Webhook orqali saytni tasdiqlaydi).]
             │
             ▼ Talaba kodni saytga kiritadi (POST /api/v1/applications/verify-otp/)
[Application Service:
 1. Kod to'g'riligini tekshiradi.
 2. Rasmiy Ariza ID yaratadi: #UZC-NAVDU-2026-308.
 3. Bazaga saqlaydi va status: "Ko'rib chiqilmoqda" qiladi.]
             │
             ▼ Hodisa: Redis -> "ApplicationCreated"
[Bot Worker: Rektorat va Markaz xodimlarining Telegram guruhiga to'liq arizani yuboradi:
 📩 "Yangi Ariza: 'EcoSmart Drip' — Sanjar Qodirov (NavDU 3-kurs) | Deck: [Ochish 👁️]"]
```

---

## 5. 3-QATLAMLI AQLLI KESH TIZIMI (MEMORY & PERFORMANCE)

Serverga uzluksiz so'rov berib bazani zo'riqtirmaslik uchun quyidagi kesh strategiyasi qo'llaniladi:

1. **1-Qatlam: Brauzer Xotirasi (Client Memory):**
   * `TanStack Query (React Query)`: Bosh sahifa slaydlari, dastur bosqichlari va sayt sozlamalari 30 daqiqaga keshlanadi.
   * Sahifalar o'rtasida o'tganda (Home ➔ Portfolio ➔ News ➔ Home) serverga qayta so'rov yuborilmaydi — ma'lumotlar 0 millisekundda ochiladi.
2. **2-Qatlam: Gateway & Redis In-Memory Kesh:**
   * Nginx va Redis API javoblarini (masalan, `/api/v1/cms/layout/` va `/api/v1/startups/`) o'zining tezkor xotirasida saqlaydi.
   * 1,000 ta talaba bir vaqtda kirsa ham, Django bazasiga bormasdan, Redis keshidan 1 millisekundda javob qaytadi.
3. **Keshni Yangilash (Cache Invalidation on Admin Save):**
   * Admin paneldan biror slayd yoki yangilik o'zgartirilib "Saqlash" bosilganda, Django avtomatik ravishda tegishli Redis kesh kalitini tozalaydi (`cache.delete('cms_layout')`).
   * Yangi kirgan talabalar zudlik bilan yangi ma'lumotni ko'radi.

---

## 6. API SHARTNOMALARI (REST ENDPOINTS & PAYLOADS)

### 6.1. CMS & Layout Service API (`:8001`)
* `GET /api/v1/cms/layout/` — Barcha bo'limlar tartibi va faollik holati.
* `GET /api/v1/cms/hero-slides/` — Bosh sahifa slaydlari ro'yxati.
* `GET /api/v1/cms/tickers/` — Tepa e'lon banneri.
* `GET /api/v1/cms/metrics/` — Dinamik platforma ko'rsatkichlari.
* `GET /api/v1/cms/partners/` — Hamkorlar logotiplari.

### 6.2. Application Service API (`:8002`)
* `POST /api/v1/applications/draft/` — Vaqtinchalik ariza yaratish va OTP sessiya olish.
* `POST /api/v1/applications/verify-otp/` — OTP kodni kiritib, arizani rasmiylashtirish.
* `GET /api/v1/applications/status/{application_id}/` — Talaba o'z arizasi holatini tekshirishi uchun.
* `GET /api/v1/applications/admin/list/` — Admin uchun arizalar ro'yxati (filtrlash bilan).
* `PATCH /api/v1/applications/admin/{id}/status/` — Admin arizani tasdiqlashi yoki rad etishi:
  ```json
  {
    "status": "Qabul qilindi",
    "feedback": "Tabriklaymiz, arizangiz 3-mavsum akseleratsiyasiga qabul qilindi. 20-sentyabr kuni kovorking markaziga kelishingiz so'raladi."
  }
  ```

### 6.3. Startups & Leaderboard Service API (`:8003`)
* `GET /api/v1/startups/` — Startaplar ro'yxati (Katalog, kategoriya va mavsum filtri).
* `GET /api/v1/startups/{id}/` — Startapning to'liq pasporti.
* `POST /api/v1/startups/{id}/upvote/` — Ovoz berish (Foydalanuvchi tokeni bilan).
* `GET /api/v1/startups/leaderboard/` — Reyting bo'yicha saralangan ro'yxat.

### 6.4. Events & Ticketing Service API (`:8004`)
* `GET /api/v1/events/` — Hakatonlar va tadbirlar kalendari.
* `POST /api/v1/events/{id}/register/` — Ro'yxatdan o'tish va QR chipta yaratish.
* `POST /api/v1/events/verify-ticket/` — Eshikdagi nazoratchi uchun QR kodni skaner qilib tasdiqlash.

---

## 7. MA'LUMOTLAR BAZASI SXEMASI (DATABASE SCHEMAS)

Har bir mikroservis o'zining alohida ma'lumotlar bazasi yoki sxemasiga ega:

### 7.1. `cms_db` Sxemasi:
```sql
CREATE TABLE hero_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    title_accent VARCHAR(100) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    badge VARCHAR(100),
    cta_text VARCHAR(100),
    secondary_cta_text VARCHAR(100),
    image_url TEXT NOT NULL,
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE section_configs (
    section_id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    order_index INT NOT NULL,
    is_visible BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 7.2. `apps_db` Sxemasi:
```sql
CREATE TABLE applications (
    id VARCHAR(50) PRIMARY KEY, -- masalan: UZC-NAVDU-2026-304
    team_name VARCHAR(200) NOT NULL,
    founder_name VARCHAR(200) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telegram_username VARCHAR(100) NOT NULL,
    telegram_chat_id BIGINT,
    faculty VARCHAR(150) NOT NULL,
    course VARCHAR(50) NOT NULL,
    team_size INT DEFAULT 1,
    project_name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    stage VARCHAR(50) NOT NULL, -- Idea, MVP, Traction, Scaling
    problem TEXT NOT NULL,
    solution TEXT NOT NULL,
    target_market TEXT NOT NULL,
    deck_url TEXT,
    status VARCHAR(50) DEFAULT 'Ko‘rib chiqilmoqda',
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 8. FOYDALANUVCHI VA ADMIN HUQUQLARI MATRITSASI (RBAC & SECURITY)

| Funksiya / Amal | Talaba (Mehmon) | Talaba (Ro'yxatdan o'tgan) | Mentor / Hakam | Moderator (Xodim) | Superadmin (Rahbar) |
|---|---|---|---|---|---|
| **Saytni ko'rish, yangiliklarni o'qish** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Startapga ovoz berish (Upvote)** | ❌ (Login shart) | ✅ (1 marta) | ✅ | ✅ | ✅ |
| **Dasturga ariza topshirish** | ✅ (OTP bilan) | ✅ | ❌ | ❌ | ❌ |
| **O'z arizasi holatini ko'rish** | ✅ (ID bilan) | ✅ (Kabinetda) | ❌ | ✅ (Barchasini) | ✅ (Barchasini) |
| **Arizaga baho va izoh qo'yish** | ❌ | ❌ | ✅ (Baho berish) | ✅ | ✅ |
| **Ariza statusini o'zgartirish (Qabul/Rad)**| ❌ | ❌ | ❌ | ✅ | ✅ |
| **Sayt slayderi va bo'limlarini o'zgartirish**| ❌ | ❌ | ❌ | ❌ | ✅ |
| **Tadbir e'lon qilish va QR tekshirish** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Audit loglarni ko'rish va xodim qo'shish**| ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 9. INFRATUZILMA VA KONTEYNERIZATSIYA (DOCKER COMPOSE)

Loyiha serverda quyidagi `docker-compose.yml` orqali 1 ta buyruq bilan to'liq ishga tushiriladi:

```yaml
version: '3.8'

services:
  # 1. API Gateway & Nginx Reverse Proxy
  api-gateway:
    image: nginx:alpine
    container_name: uzc-api-gateway
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./gateway/nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - cms-service
      - application-service
      - startup-service
      - event-service

  # 2. Frontend CMS & Layout Service
  cms-service:
    build: ./services/cms_service
    container_name: uzc-cms-service
    restart: always
    environment:
      - DATABASE_URL=postgres://navdu_user:navdu_secret@postgres-db:5432/cms_db
      - REDIS_URL=redis://redis-broker:6379/0
    depends_on:
      - postgres-db
      - redis-broker

  # 3. Application Service (45 kunlik qabul)
  application-service:
    build: ./services/application_service
    container_name: uzc-app-service
    restart: always
    environment:
      - DATABASE_URL=postgres://navdu_user:navdu_secret@postgres-db:5432/apps_db
      - REDIS_URL=redis://redis-broker:6379/1
    depends_on:
      - postgres-db
      - redis-broker

  # 4. Startups & Leaderboard Service (FastAPI)
  startup-service:
    build: ./services/startup_service
    container_name: uzc-startup-service
    restart: always
    environment:
      - DATABASE_URL=postgres://navdu_user:navdu_secret@postgres-db:5432/startups_db
      - REDIS_URL=redis://redis-broker:6379/2
    depends_on:
      - postgres-db
      - redis-broker

  # 5. Events & QR Ticket Service
  event-service:
    build: ./services/event_service
    container_name: uzc-event-service
    restart: always
    environment:
      - DATABASE_URL=postgres://navdu_user:navdu_secret@postgres-db:5432/events_db
    depends_on:
      - postgres-db

  # 6. Telegram Bot & Notification Worker
  bot-worker:
    build: ./services/bot_worker
    container_name: uzc-bot-worker
    restart: always
    environment:
      - BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN
      - REDIS_URL=redis://redis-broker:6379/1
    depends_on:
      - redis-broker

  # 7. Redis Cache & Message Broker
  redis-broker:
    image: redis:7-alpine
    container_name: uzc-redis-broker
    restart: always
    ports:
      - "6379:6379"

  # 8. Asosiy PostgreSQL Ma'lumotlar Bazasi
  postgres-db:
    image: postgres:16-alpine
    container_name: uzc-postgres-db
    restart: always
    environment:
      - POSTGRES_USER=navdu_user
      - POSTGRES_PASSWORD=navdu_secret
      - POSTGRES_MULTIPLE_DATABASES=cms_db,apps_db,startups_db,events_db,auth_db
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

---

## 10. LOYIHA PAPKALARINING TO'LIQ ARXITEKTURASI

```bash
D:\uzcombinator\
│
├── gateway/                        # Nginx konfiguratsiyasi
│   └── nginx.conf
│
├── services/                       # Mustaqil mikroservislar
│   ├── cms_service/                # Django: Slayder, Bo'limlar, Ticker boshqaruvi
│   │   ├── apps/layout/
│   │   ├── admin.py
│   │   └── Dockerfile
│   │
│   ├── application_service/        # Django: 45 kunlik arizalar & Baholash
│   │   ├── apps/applications/
│   │   ├── admin.py
│   │   └── Dockerfile
│   │
│   ├── startup_service/            # FastAPI: Startaplar & Tezkor ovozlar
│   │   ├── main.py
│   │   └── Dockerfile
│   │
│   ├── event_service/              # Django: Hakatonlar va QR chiptalar
│   │   ├── apps/events/
│   │   └── Dockerfile
│   │
│   └── bot_worker/                 # Python: Telegram Bot OTP & Alerts
│       ├── bot.py
│       └── Dockerfile
│
├── src/                            # Biz qurgan React 19 + Vite Frontend
│   ├── api/                        # Gateway orqali mikroservislarga ulanuvchi API mijozlar
│   ├── components/                 # UI bloklar
│   ├── pages/                      # Sahifalar
│   └── types/                      # TypeScript interfeyslari
│
├── ishlar/                         # Loyiha hujjatlari
│   ├── BAJARILGAN_ISHLAR.md
│   └── MIKROSERVIS_ARXITEKTURA_FINAL.md  <-- Ushbu master hujjat
│
├── docker-compose.yml
└── package.json
```

---

*Hujjat tasdiqlandi: 2026-09-13*  
*NavDU Inkubatsiya va Akseleratsiya Markazi / UZ Combinator Ekotizimi*
