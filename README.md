# NSU Combinator

Navoiy davlat universiteti (NavDU / `nsuni.uz`) startap akseleratori platformasi.

Talaba, magistrant va bitiruvchi jamoalar g‘oyani **10 haftada** Demo Day sahnasi gacha olib chiqadi. Bu tashqi akselerator kloni emas: universitet brendi, email OTP, Telegram bot, dekanat ko‘rib chiqish.

## Nima qilingan

- Ommaviy sayt: globus, lattice, aurora, moments galereya, yangiliklar, portfolio, jamoa, investorlar, baho, verify
- Kirish: email OTP (Gmail SMTP), JWT
- Kabinet: profil → Telegram ulash → jamoa → **7 bosqichli ariza**
- Ariza bosqichlari: Asoschilar, G‘oya, Bozor, O‘sish, Yuridik, Tavsiya, Resurslar
- Holat lentasi: draft → submitted → screening → suhbat → qaror
- Admin review: javoblarni o‘qish, holat o‘tkazish, ommaviy Telegram/email
- Telegram bot polling (`/start` deep-link)
- Docker Compose: Postgres 16, Redis 7, Django, Celery, Next.js, telegram_bot

## Stack

| Qatlam | Texnologiya |
|---|---|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind |
| API | Django 5.1, DRF, SimpleJWT |
| Queue | Celery + Redis |
| DB | PostgreSQL 16 |
| Bot | python-telegram-bot 21 (polling) |

## Ishga tushirish

```powershell
cd Desktop\nsu-combinator
copy backend\.env.example backend\.env
docker compose up -d --build
```

| Servis | URL |
|---|---|
| Frontend | http://localhost:3000 |
| API | http://localhost:8002 |
| Swagger | http://localhost:8002/api/docs/ |
| Admin | http://localhost:8002/admin/ |
| Postgres | `localhost:5434` |
| Redis | `localhost:6380` |

Birinchi ishga tushirishda migrate + seed avtomatik.

**Superadmin:** `admin@nsuni.uz` / `admin1234`

## Ariza oqimi

1. http://localhost:3000/cabinet/apply — kirmagan bo‘lsa email OTP
2. Profil (ism, telefon, affiliation)
3. Telegram botni ulash
4. Jamoa yaratish
5. 7 bosqichli savollar → **Arizani topshirish**
6. Holat kabinetda va `/cabinet/review` da

Kirish sahifasi: `/apply`. Ariza formasi: `/cabinet/apply` (kabinetdagi sozlamalar aralashmaydi).

## Muhit o‘zgaruvchilari (`backend/.env`)

```
EMAIL_HOST=smtp.gmail.com
EMAIL_HOST_USER=...
EMAIL_HOST_PASSWORD=...   # Gmail app password
TELEGRAM_BOT_TOKEN=...    # @BotFather
TELEGRAM_BOT_USERNAME=...
```

Token va parolni gitga qo‘ymang. Namuna: `backend/.env.example`.

## Foydali API

- `POST /api/v1/auth/otp/send` · `verify`
- `GET/PATCH /api/v1/auth/me`
- `GET /api/v1/auth/telegram/link`
- `GET /api/v1/applications/form` — 7 bosqich schema
- `POST /api/v1/applications/` · `PATCH .../{id}/` · `POST .../{id}/submit/`
- `GET /api/v1/admin/applications/`
- `POST /api/v1/admin/applications/{id}/transition/`
- `POST /api/v1/admin/notifications/broadcast/`

DEBUG da OTP javobida `debug_otp` ham qaytadi.

## Loyiha tuzilishi

```
backend/     Django apps: users, cms, cohorts, teams, applications, reviews, notifications, portfolio
frontend/    Next.js: sayt, kabinet, ariza, review
docker-compose.yml
```

## Eslatma

Parvona portlari (8001 / 5433 / 6379) band qilinmaydi. UzCombinator brendi, matni, fotosi va hamkor logolari ko‘chirilmagan.
