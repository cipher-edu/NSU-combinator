"""NSU Combinator ariza formasi: 7 bosqich, ketma-ket savollar."""

STEPS = [
    {
        'id': 'asoschilar',
        'n': 1,
        'title_uz': 'Asoschilar',
        'title_en': 'Founders',
        'lead_uz': 'Jamoa kimdan iborat va kim nima qiladi.',
        'lead_en': 'Who is on the team and who does what.',
        'questions': [
            {
                'id': 'founders_list',
                'type': 'textarea',
                'required': True,
                'label_uz': 'Asoschilar kim? Har birini alohida qatorda yozing: ism — rol — nima qiladi.',
                'label_en': 'Who are the founders? One per line: name — role — what they do.',
                'placeholder_uz': 'Ali Valiyev — lead — mahsulot\nNodira Karimova — texnik — backend',
            },
            {
                'id': 'how_met',
                'type': 'textarea',
                'required': True,
                'label_uz': 'Qanday tanishgansiz? Birga qancha vaqtdan beri ishlayapsiz?',
                'label_en': 'How did you meet? How long have you worked together?',
            },
            {
                'id': 'commitment',
                'type': 'select',
                'required': True,
                'label_uz': '10 hafta davomida haftasiga qancha vaqt ajratasiz?',
                'label_en': 'Hours per week for the 10 weeks?',
                'options': [
                    {'value': '10', 'label_uz': '10 soatgacha', 'label_en': 'Up to 10h'},
                    {'value': '20', 'label_uz': '10–20 soat', 'label_en': '10–20h'},
                    {'value': '30', 'label_uz': '20–30 soat', 'label_en': '20–30h'},
                    {'value': 'full', 'label_uz': 'To‘liq kun (30+ soat)', 'label_en': 'Full-time (30+h)'},
                ],
            },
            {
                'id': 'tech_founder',
                'type': 'select',
                'required': True,
                'label_uz': 'Jamoada mahsulotni o‘zi qura oladigan odam bormi?',
                'label_en': 'Is there someone who can build the product?',
                'options': [
                    {'value': 'yes', 'label_uz': 'Ha — o‘zimiz quramiz', 'label_en': 'Yes — we build'},
                    {'value': 'partial', 'label_uz': 'Qisman — yordam kerak', 'label_en': 'Partly — we need help'},
                    {'value': 'no', 'label_uz': 'Yo‘q — tashqaridan qidiramiz', 'label_en': 'No — we will hire'},
                ],
            },
        ],
    },
    {
        'id': 'goya',
        'n': 2,
        'title_uz': 'G‘oya',
        'title_en': 'Idea',
        'lead_uz': 'Nima quryapsiz va kimning muammosini yechasiz.',
        'lead_en': 'What you are building and whose problem it solves.',
        'questions': [
            {
                'id': 'one_liner',
                'type': 'text',
                'required': True,
                'max': 160,
                'label_uz': 'Bir jumlada: nima quryapsiz?',
                'label_en': 'In one sentence: what are you building?',
            },
            {
                'id': 'problem',
                'type': 'textarea',
                'required': True,
                'label_uz': 'Muammo nima? Kim og‘riyapti va hozir qanday chiqib ketyapti?',
                'label_en': 'What is the problem? Who feels it and what do they do today?',
            },
            {
                'id': 'solution',
                'type': 'textarea',
                'required': True,
                'label_uz': 'Yechimingiz nima? Nima qilasiz — dars, ilova, xizmat?',
                'label_en': 'What is the solution? App, service, hardware?',
            },
            {
                'id': 'product_stage',
                'type': 'select',
                'required': True,
                'label_uz': 'Hozir qaysi bosqichdasiz?',
                'label_en': 'What stage are you at?',
                'options': [
                    {'value': 'idea', 'label_uz': 'G‘oya / chizma', 'label_en': 'Idea'},
                    {'value': 'mvp', 'label_uz': 'Ishlaydigan demo / MVP', 'label_en': 'Working demo / MVP'},
                    {'value': 'traction', 'label_uz': 'Foydalanuvchilar bor', 'label_en': 'Users'},
                    {'value': 'revenue', 'label_uz': 'Pul tushyapti', 'label_en': 'Revenue'},
                ],
            },
            {
                'id': 'demo_url',
                'type': 'url',
                'required': False,
                'label_uz': 'Demo, GitHub yoki sayt havolasi (bo‘lsa)',
                'label_en': 'Demo, GitHub or site (if any)',
            },
        ],
    },
    {
        'id': 'bozor',
        'n': 3,
        'title_uz': 'Bozor',
        'title_en': 'Market',
        'lead_uz': 'Mijoz kim va nima uchun siz yutasiz.',
        'lead_en': 'Who the customer is and why you win.',
        'questions': [
            {
                'id': 'customer',
                'type': 'textarea',
                'required': True,
                'label_uz': 'Birinchi mijoz kim? Aniq yozing: talaba, fermer, korxona, o‘qituvchi…',
                'label_en': 'Who is the first customer? Be specific.',
            },
            {
                'id': 'why_now',
                'type': 'textarea',
                'required': True,
                'label_uz': 'Nega hozir? Nima o‘zgardi — qonun, texnologiya, odamlar odatimi?',
                'label_en': 'Why now? What changed?',
            },
            {
                'id': 'competitors',
                'type': 'textarea',
                'required': True,
                'label_uz': 'Raqobatchilar yoki muqobillar kim? Sizdan nima farqingiz bor?',
                'label_en': 'Who are the alternatives? How are you different?',
            },
            {
                'id': 'navoi_fit',
                'type': 'textarea',
                'required': True,
                'label_uz': 'Bu g‘oya nima uchun Navoiy / NavDU kontekstida ishlaydi?',
                'label_en': 'Why does this work in Navoi / at NavDU?',
            },
        ],
    },
    {
        'id': 'osish',
        'n': 4,
        'title_uz': 'O‘sish',
        'title_en': 'Growth',
        'lead_uz': 'Hozirgi raqamlar va keyingi 10 hafta.',
        'lead_en': 'Current numbers and the next 10 weeks.',
        'questions': [
            {
                'id': 'now_metrics',
                'type': 'textarea',
                'required': True,
                'label_uz': 'Hozir nima bor: foydalanuvchi, suhbat, tushum, kutish ro‘yxati?',
                'label_en': 'What do you have now: users, interviews, revenue, waitlist?',
            },
            {
                'id': 'ten_week_goal',
                'type': 'textarea',
                'required': True,
                'label_uz': '10 hafta oxirida qanday aniq natija bo‘ladi? O‘lchanadigan yozing.',
                'label_en': 'What measurable result at the end of 10 weeks?',
            },
            {
                'id': 'channel',
                'type': 'textarea',
                'required': True,
                'label_uz': 'Birinchi 50 ta foydalanuvchini qayerdan olasiz?',
                'label_en': 'Where will the first 50 users come from?',
            },
            {
                'id': 'risk',
                'type': 'textarea',
                'required': True,
                'label_uz': 'Eng katta xavf nima va uni qanday tekshirasiz?',
                'label_en': 'Biggest risk, and how you will test it?',
            },
        ],
    },
    {
        'id': 'yuridik',
        'n': 5,
        'title_uz': 'Yuridik',
        'title_en': 'Legal',
        'lead_uz': 'Kompaniya, ulush va intellektual mulk.',
        'lead_en': 'Company, equity and IP.',
        'questions': [
            {
                'id': 'legal_entity',
                'type': 'select',
                'required': True,
                'label_uz': 'Yuridik shaxs ochilganmi?',
                'label_en': 'Do you have a legal entity?',
                'options': [
                    {'value': 'none', 'label_uz': 'Yo‘q', 'label_en': 'No'},
                    {'value': 'mchj', 'label_uz': 'MChJ / O‘zbekiston', 'label_en': 'LLC / Uzbekistan'},
                    {'value': 'other', 'label_uz': 'Boshqa mamlakat', 'label_en': 'Another country'},
                    {'value': 'process', 'label_uz': 'Ochish jarayonida', 'label_en': 'In progress'},
                ],
            },
            {
                'id': 'equity',
                'type': 'textarea',
                'required': True,
                'label_uz': 'Asoschilar o‘rtasida ulush qanday bo‘linadi? (masalan 50/50 yoki 60/40)',
                'label_en': 'How is equity split?',
            },
            {
                'id': 'ip',
                'type': 'select',
                'required': True,
                'label_uz': 'Kod, brend, ma’lumot kimniki?',
                'label_en': 'Who owns the IP?',
                'options': [
                    {'value': 'team', 'label_uz': 'Jamoa / asoschilar', 'label_en': 'The founders'},
                    {'value': 'uni', 'label_uz': 'Universitet yoki fakultet loyihasi', 'label_en': 'University project'},
                    {'value': 'employer', 'label_uz': 'Ish beruvchi yoki buyurtmachi', 'label_en': 'Employer / client'},
                    {'value': 'unclear', 'label_uz': 'Hali aniqlanmagan', 'label_en': 'Unclear'},
                ],
            },
            {
                'id': 'other_money',
                'type': 'textarea',
                'required': False,
                'label_uz': 'Boshqa akselerator, grant yoki investor bormi? Bo‘lmasa “yo‘q”.',
                'label_en': 'Other accelerator, grant or investor? If none, write “no”.',
            },
        ],
    },
    {
        'id': 'tavsiya',
        'n': 6,
        'title_uz': 'Tavsiya',
        'title_en': 'Referral',
        'lead_uz': 'Nega NSU Combinator va kim yo‘lladi.',
        'lead_en': 'Why NSU Combinator and who sent you.',
        'questions': [
            {
                'id': 'why_us',
                'type': 'textarea',
                'required': True,
                'label_uz': 'Nega aynan NSU Combinator? Toshkentdagi dastur emas — shu yerda nima kerak?',
                'label_en': 'Why NSU Combinator, not a Tashkent program?',
            },
            {
                'id': 'heard',
                'type': 'select',
                'required': True,
                'label_uz': 'Dasturni qayerdan eshitdingiz?',
                'label_en': 'How did you hear about us?',
                'options': [
                    {'value': 'faculty', 'label_uz': 'O‘qituvchi / dekanat', 'label_en': 'Faculty'},
                    {'value': 'friend', 'label_uz': 'Do‘st / kursdosh', 'label_en': 'Friend'},
                    {'value': 'telegram', 'label_uz': 'Telegram / ijtimoiy tarmoq', 'label_en': 'Telegram / social'},
                    {'value': 'event', 'label_uz': 'Tadbir / ochiq eshik', 'label_en': 'Event'},
                    {'value': 'other', 'label_uz': 'Boshqa', 'label_en': 'Other'},
                ],
            },
            {
                'id': 'endorsement',
                'type': 'text',
                'required': False,
                'label_uz': 'Tavsiya qilgan odam (ism, lavozim) — bo‘lsa',
                'label_en': 'Who recommended you (name, role), if anyone',
            },
            {
                'id': 'video_url',
                'type': 'url',
                'required': False,
                'label_uz': '1 daqiqalik video: kim siz va nima quryapsiz (ixtiyoriy)',
                'label_en': '1-minute video: who you are and what you build (optional)',
            },
        ],
    },
    {
        'id': 'resurslar',
        'n': 7,
        'title_uz': 'Resurslar',
        'title_en': 'Resources',
        'lead_uz': 'Sizga nima kerak va nima keltirasiz.',
        'lead_en': 'What you need and what you bring.',
        'questions': [
            {
                'id': 'need',
                'type': 'textarea',
                'required': True,
                'label_uz': 'Dasturdan nima kutasiz: mentor, laboratoriya, mijoz, sahnami?',
                'label_en': 'What do you need: mentor, lab, customers, a stage?',
            },
            {
                'id': 'bring',
                'type': 'textarea',
                'required': True,
                'label_uz': 'Siz nima keltirasiz: kod, soha bilim, auditoriyami?',
                'label_en': 'What do you bring: code, domain knowledge, an audience?',
            },
            {
                'id': 'track',
                'type': 'select',
                'required': True,
                'label_uz': 'Qaysi yo‘nalishga ariza topshirasiz?',
                'label_en': 'Which track are you applying to?',
                'options_from': 'tracks',
            },
            {
                'id': 'else',
                'type': 'textarea',
                'required': False,
                'label_uz': 'Yana nima deyishni xohlaysiz?',
                'label_en': 'Anything else?',
            },
        ],
    },
]


def all_questions():
    out = []
    for step in STEPS:
        for q in step['questions']:
            out.append((step['id'], q))
    return out


def required_ids():
    return [q['id'] for _, q in all_questions() if q.get('required')]


def missing_required(answers: dict) -> list[str]:
    answers = answers or {}
    miss = []
    for qid in required_ids():
        val = answers.get(qid)
        if val is None or str(val).strip() == '':
            miss.append(qid)
    return miss


def step_progress(answers: dict) -> list[dict]:
    answers = answers or {}
    rows = []
    for step in STEPS:
        req = [q['id'] for q in step['questions'] if q.get('required')]
        done = sum(1 for i in req if str(answers.get(i) or '').strip())
        rows.append({
            'id': step['id'],
            'n': step['n'],
            'title_uz': step['title_uz'],
            'required': len(req),
            'filled': done,
            'complete': done == len(req) and len(req) > 0,
        })
    return rows
