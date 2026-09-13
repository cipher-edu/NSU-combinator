import { Startup, Story, EventItem, CoFounderVacancy, Mentor, IncubationApplication, NewsItem } from '../types';

export const INITIAL_STARTUPS: Startup[] = [
  {
    id: 'agrosmart',
    name: 'AgroSmart Drip',
    tagline: 'Qurg‘oqchil hududlarda tomchilatib sug‘orishni AI va IoT orqali 40% tejash',
    fullDescription: 'Navoiy viloyatining qurg‘oqchil va cho‘loldi hududlaridagi fermer xo‘jaliklari uchun avtonom tomchilatib sug‘orish tizimi. Tizim tuproqdagi namlik, havo harorati va ob-havo bashorati orqali suv taqsimotini avtomatlashtiradi.',
    problem: 'Navoiy viloyatida sug‘orish suvining 60% dan ortig‘i samarasiz bug‘lanadi, sho‘rlanish hosildorlikni 35% ga tushiradi.',
    solution: 'Arzon mahalliy IoT datchiklar va AI algoritmlari orqali suv taqsimotini avtomatlashtirish, 40% suv tejami.',
    category: 'AgroTech & Eco',
    stage: 'Traction',
    batch: 'Batch 1 (W25)',
    upvotes: 0,
    raisedAmount: '$0',
    raisedPct: 0,
    logo: '🌱',
    bannerImage: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1200&auto=format&fit=crop&q=80',
    website: 'https://agrosmart.uz',
    founders: [
      {
        name: 'Jamshid Nurmatov',
        role: 'CEO & Co-founder',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        faculty: 'Fizika-matematika fakulteti, 4-kurs',
        telegram: '@jamshid_agro'
      }
    ],
    metrics: {
      users: '18 ta fermer xo‘jaligi',
      pilotLocations: '140 gektar sinov maydoni',
      grantWon: '50 mln so‘m grant'
    },
    tags: ['IoT', 'AgroTech', 'AI', 'NavDU'],
    createdAt: '2026-02-10'
  },
  {
    id: 'edumentor',
    name: 'EduMentor AI',
    tagline: 'Talabalar va abituriyentlar uchun shaxsiylashtirilgan milliy AI repetitor',
    fullDescription: 'O‘zbekiston davlat ta’lim standartlari va universitet dasturlariga moslashtirilgan 24/7 ishlaydigan generativ ta’limiy yordamchi. Har bir talabaning o‘zlashtirishiga qarab topshiriqlar beradi.',
    problem: 'Katta guruhlarda har bir talabaning tushunmagan mavzusiga o‘qituvchi vaqt ajrata olmaydi. Repetitorlar esa qimmat.',
    solution: 'O‘zbek tilida 500+ darslik asosida o‘rgatilgan 24/7 ishlaydigan interaktiv AI repetitor.',
    category: 'AI & EdTech',
    stage: 'Traction',
    batch: 'Batch 1 (W25)',
    upvotes: 0,
    raisedAmount: '$0',
    raisedPct: 0,
    logo: '🤖',
    bannerImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80',
    website: 'https://edumentor.navdu.uz',
    founders: [
      {
        name: 'Malika Karimova',
        role: 'CEO & AI Developer',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        faculty: 'Axborot texnologiyalari fakulteti, 3-kurs',
        telegram: '@malika_edutech'
      }
    ],
    metrics: {
      users: '0 talaba',
      revenue: '$0 MRR',
      pilotLocations: 'NavDU'
    },
    tags: ['AI', 'EdTech', 'LLM', 'Uzbek NLP'],
    createdAt: '2026-01-15'
  },
  {
    id: 'ecoquyosh',
    name: 'EcoQuyosh Navoiy',
    tagline: 'Quyosh fotoelektr stansiyalari panellarini tozalovchi avtomat robotlar',
    fullDescription: 'Navoiy viloyatidagi yirik quyosh fotoelektr stansiyalarida panellarga chang va qum o‘tirishi natijasida yo‘qotiladigan energiyani qaytaruvchi suvsiz elektrostatik robot-dronlar.',
    problem: 'Cho‘l changi panellar samaradorligini 30% ga tushiradi, suv bilan yuvish esa millionlab litr ichimlik suvini talab qiladi.',
    solution: 'Suv ishlatmaydigan mikrotolali avtonom tozalash roboti.',
    category: 'GreenTech & Energy',
    stage: 'MVP',
    batch: 'Batch 2 (S25)',
    upvotes: 0,
    raisedAmount: '$0',
    raisedPct: 0,
    logo: '☀️',
    founders: [
      {
        name: 'Bekzod Aliyev',
        role: 'Hardware Lead',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
        faculty: 'Fizika va texnologik ta’lim, 4-kurs',
        telegram: '@bekzod_robotics'
      }
    ],
    metrics: {
      pilotLocations: 'Navoiy QES sinov maydoni',
      grantWon: '0 so‘m'
    },
    tags: ['GreenTech', 'Hardware', 'Robotics'],
    createdAt: '2026-02-01'
  },
  {
    id: 'mednav',
    name: 'MedNav Hub',
    tagline: 'Viloyat tumanlari uchun teletibbiyot va retseptli dori yetkazish',
    fullDescription: 'Navoiy viloyatining Karmana, Konimex, Xatirchi tumanlari aholisi uchun viloyat markazidagi shifokorlar bilan onlayn qabul va dori vositalarini yetkazish.',
    problem: 'Chekka qishloqlarda tor soha shifokorlari yetishmaydi, viloyat markaziga borish transport xarajati va vaqt talab qiladi.',
    solution: 'Smartfon orqali onlayn video qabul va dorixonalar tarmog‘i integratsiyasi.',
    category: 'MedTech & Salomatlik',
    stage: 'MVP',
    batch: 'Batch 2 (S25)',
    upvotes: 0,
    raisedAmount: '$0',
    raisedPct: 0,
    logo: '🩺',
    founders: [
      {
        name: 'Nilufar Shodiyeva',
        role: 'Loyiha rahbari',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        faculty: 'Biologiya va tibbiyot ishi, Magistrant',
        telegram: '@nilufar_med'
      }
    ],
    metrics: {
      users: '0 bemor',
      pilotLocations: 'Navoiy'
    },
    tags: ['Telehealth', 'HealthTech'],
    createdAt: '2026-02-18'
  },
  {
    id: 'karyeranavdu',
    name: 'KaryeraNavDU',
    tagline: 'Talabalarni NKMK va sanoat korxonalari bilan bog‘lovchi AI karyera portali',
    fullDescription: 'Navoiy kon-metallurgiya kombinati va viloyatdagi 200+ korxonalar amaliyoti hamda bo‘sh ish o‘rinlariga talabalarni bilimi va diplom loyihalari bo‘yicha avtomatik yo‘naltiruvchi AI tizim.',
    problem: 'Talabalar amaliyot o‘rnini topolmaydi, korxonalar esa iqtidorli kadr qidirishda qiynaladi.',
    solution: 'Universitet ichki reytingi va qobiliyatlarni baholovchi avtomatik HR matching.',
    category: 'AI & EdTech',
    stage: 'Traction',
    batch: 'Batch 1 (W25)',
    upvotes: 0,
    raisedAmount: '$0',
    raisedPct: 0,
    logo: '💼',
    founders: [
      {
        name: 'Otabek G‘aniyev',
        role: 'Product Lead',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
        faculty: 'Iqtisodiyot fakulteti, 4-kurs',
        telegram: '@otabek_hr'
      }
    ],
    metrics: {
      users: '0 rezyume',
      pilotLocations: 'Navoiy'
    },
    tags: ['HRTech', 'AI', 'Karyera'],
    createdAt: '2025-11-20'
  },
  {
    id: 'chiqindiyoq',
    name: 'ChiqindiYo‘q',
    tagline: 'Universitet va shahar uchun ikkilamchi xomashyo ekotizimi va bonuslar',
    fullDescription: 'Plastik va qog‘oz chiqindilarni topshirgan talabalarga bonuslar va tekin tushlik taqdim etuvchi aqlli qutilar va mobil ilova.',
    problem: 'Kuniga 150 kg chiqindi saralanmasdan poligonlarga ketadi.',
    solution: 'QR-kodli aqlli qutilar va "EcoCoin" rag‘batlantirish mexanikasi.',
    category: 'AgroTech & Eco',
    stage: 'MVP',
    batch: 'Batch 2 (S25)',
    upvotes: 0,
    raisedAmount: '$0',
    raisedPct: 0,
    logo: '♻️',
    founders: [
      {
        name: 'Gulnoza Rahmatova',
        role: 'Co-founder',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        faculty: 'Ekologiya, 3-kurs'
      }
    ],
    metrics: {
      users: '950+ talaba',
      pilotLocations: '3 ta fakultet binosi'
    },
    tags: ['GreenCampus', 'Gamification'],
    createdAt: '2026-03-01'
  }
];

export const INITIAL_STORIES: Story[] = [
  {
    id: 'story-1',
    title: 'AgroSmart qanday qilib Navoiy cho‘lida 40% suvni tejab, $140,000 investitsiya jalb qildi?',
    excerpt: 'Fizika-matematika fakultetidagi laboratoriyadan boshlangan g‘oyamiz qanday qilib 18 ta fermer xo‘jaligiga yetib bordi?',
    content: `Startap g‘oyasi bizda Karmana tumanidagi fermer amakimning pomidor dalasida suv taqsimoti tufayli qo‘shnilar o‘rtasidagi janjalni ko‘rganimda tug‘ilgan.

Navoiy viloyatida yozda harorat +45 darajadan oshadi va har bir tomchi suv hisobli. UzCombinator NavDU akseleratoriga kelganimizda, mentorlarimiz bizga: "Laboratoriyada o‘tirmanglar, ertagayoq dalaga chiqib fermerlar bilan gaplashinglar!" deyishdi.

Dastlabki 5 ta fermer bizni eshitishni ham xohlamadi. Ammo 6-fermerga 20 sotixli tajriba maydonchasida bepul datchik o‘rnatdik. 3 haftada suv sarfi 38% ga qisqardi! Demo Day 2025 da esa biz investorlardan $140,000 miqdorida sarmoya jalb qildik.

Maslahatim: g‘oyangizdan uyalmang, tezda prototip qiling va mijozlarga sinating!`,
    authorName: 'Jamshid Nurmatov',
    authorRole: 'AgroSmart Drip asoschisi',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    startupName: 'AgroSmart Drip',
    date: '02.03.2026',
    readTime: '4 daqiqa',
    likes: 0,
    commentsCount: 0,
    tags: ['Tajriba', 'AgroTech', 'Investitsiya'],
    comments: []
  },
  {
    id: 'story-2',
    title: '1-kursda startap boshlash: Xatolarim, uyqusiz tunlar va birinchi 3,800 talaba',
    excerpt: 'Dasturchisiz boshlangan loyihamiz qanday qilib universitetning eng mashhur AI ta’lim platformasiga aylandi?',
    content: `Universitetga endi kirganimda eng katta muammo — o‘zbek tilidagi sifatli ilmiy manbalarning yo‘qligi edi. Oddiy Telegram bot shaklida birinchi prototipni 2 kechada yasab ko‘rdim.

Guruhdoshlarimga tashlaganimda, ertasi kuni 100 kishi, 3 kundan keyin butun fakultet ishlatayotgan edi! Keyin UzCombinator Co-founder matching orqali jamoamizga kuchli dasturchi topdik.

Hozir platformamizda 3,800 dan ortiq faol talaba bor va Demo Day da $150,000 investitsiya oldik. Hech qachon "hali 1-kursman, ulguraman" demang!`,
    authorName: 'Malika Karimova',
    authorRole: 'EduMentor AI asoschisi',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    startupName: 'EduMentor AI',
    date: '25.02.2026',
    readTime: '5 daqiqa',
    likes: 0,
    commentsCount: 0,
    tags: ['AI', 'EdTech', 'Talabalar'],
    comments: []
  }
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'event-1',
    title: 'NavDU InnoHack 2026: 48-soatlik Katta Universitet Hakatoni',
    type: 'Hakaton',
    date: '25-27 Sentabr, 2026',
    time: '10:00 - 18:00 (48 soat)',
    location: 'NavDU Bosh binosi, Yoshlar media-markazi',
    mode: 'Oflayn',
    prize: '60 000 000 so‘m mukofot jamg‘armasi',
    registrationDeadline: '20 Sentabr, 2026',
    description: 'Barcha fakultetlar talabalari uchun o‘tkaziladigan yillik eng yirik innovatsion hakaton. Yo‘nalishlar: AI, AgroTech, Yashil energetika va Sanoat avtomatizatsiyasi.',
    agenda: [
      '1-kun: Ochilish marosimi, g‘oyalar taqdimoti va jamoalarni shakllantirish',
      '2-kun: 24 soatlik uzluksiz kod yozish va prototiplash, mentorlar sessiyasi',
      '3-kun: Hakamlar hay’ati oldida Pitching va g‘oliblarni taqdirlash'
    ],
    registeredCount: 0,
    isRegistrationOpen: true,
    featured: true
  },
  {
    id: 'event-2',
    title: 'UzCombinator NavDU 3-Mavsum (Autumn 2026) Qabuli',
    type: 'Qabul',
    date: '10 Sentabr - 05 Oktabr, 2026',
    time: 'Har kuni 09:00 - 18:00',
    location: 'UzCombinator Kovorking maydoni (2-qavat, 214-xona)',
    mode: 'Gibrid',
    prize: '$1,000 stipendiya, bepul ovqat va $100K gacha investitsiya',
    registrationDeadline: '05 Oktabr, 2026',
    description: 'O‘z startap g‘oyasiga ega talabalar va dasturchilar uchun 45 kunlik intensiv dastur. Sizga noldan MVP yaratish, yuridik ro‘yxatdan o‘tish va investitsiya jalb qilishda to‘liq ko‘mak beriladi.',
    agenda: [
      '1-2 hafta: G‘oya tahlili va CustDev',
      '3-4 hafta: MVP va birinchi sotuvlar',
      '5-6 hafta: Pitch va Demo Day'
    ],
    registeredCount: 88,
    isRegistrationOpen: true,
    featured: true
  },
  {
    id: 'event-3',
    title: 'Demo Day 2026: Akseleratsiya bitiruvchilari investorlar sahnasida',
    type: 'Demo Day',
    date: '18 Oktabr, 2026',
    time: '14:00 - 17:30',
    location: 'NavDU Axborot-resurs markazi Katta zali',
    mode: 'Gibrid',
    prize: 'Venchur fondlar va mahalliy tadbirkorlar investitsiyalari',
    registrationDeadline: '15 Oktabr, 2026',
    description: 'Oldingi mavsumda saralangan eng kuchli 10 ta universitet startapi o‘z mahsulotlarini NKMK vakillari, IT Park investitsiya bo‘limi va biznes-farishtalariga 3 daqiqalik nutq bilan taqdim etadi.',
    agenda: [
      '14:00 - Qatnashchilar va investorlar networking qahva tanaffusi',
      '14:30 - Rektorat tabrik so‘zi',
      '15:00 - Jonli Pitch sessiyasi',
      '16:45 - Investitsiya kelishuvlarini imzolash'
    ],
    registeredCount: 230,
    isRegistrationOpen: true
  }
];

export const INITIAL_VACANCIES: CoFounderVacancy[] = [
  {
    id: 'vac-1',
    startupName: 'AgroSmart Drip',
    startupLogo: '🌱',
    category: 'AgroTech & Eco',
    roleTitle: 'Mobile Developer (Flutter / React Native)',
    requiredSkills: ['Flutter', 'REST API', 'Bluetooth BLE', 'Figma'],
    description: 'IoT sensorlaridan keladigan ma’lumotlarni fermerlarga chiroyli ko‘rsatib turuvchi mobil ilova ishlab chiqishimiz kerak. Dala sharoitida oflayn ishlash muhim.',
    commitmentType: 'Erkin grafik',
    faculty: 'Fizika-matematika yoki IT fakulteti',
    contactTelegram: '@jamshid_agro',
    createdAt: 'Bugun'
  },
  {
    id: 'vac-2',
    startupName: 'EduMentor AI',
    startupLogo: '🤖',
    category: 'AI & EdTech',
    roleTitle: 'UI/UX Dizayner (Figma)',
    requiredSkills: ['Figma', 'Web Design', 'Design Systems'],
    description: 'Talabalar uchun o‘quv platformamiz interfeysini foydalanuvchiga juda sodda va chiroyli qilib qayta loyihalash kerak.',
    commitmentType: 'Yarim stavka',
    faculty: 'San’atshunoslik yoki IT fakulteti',
    contactTelegram: '@malika_edutech',
    createdAt: 'Kecha'
  },
  {
    id: 'vac-3',
    startupName: 'EcoQuyosh',
    startupLogo: '☀️',
    category: 'GreenTech & Energy',
    roleTitle: '3D Modellashtiruvchi & Robototexnik',
    requiredSkills: ['AutoCAD / SolidWorks', '3D Printing', 'Arduino'],
    description: 'Quyosh panellarini tozalovchi robottimizning yangi yengil korpusi va g‘ildiraklarini 3D printerda chop etish kerak.',
    commitmentType: 'To‘liq stavka',
    faculty: 'Fizika va texnologik ta’lim',
    contactTelegram: '@bekzod_robotics',
    createdAt: '3 kun oldin'
  }
];

export const INITIAL_MENTORS: Mentor[] = [
  {
    id: 'mentor-1',
    name: 'Dr. Otabek Jo‘rayev',
    title: 'Axborot texnologiyalari kafedrasi mudiri, Dotsent',
    organization: 'Navoiy davlat universiteti',
    bio: 'Sun’iy intellekt, katta hajmdagi ma’lumotlar va ilmiy startaplar bo‘yicha 15 yillik tajribaga ega olim.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    expertise: ['AI & ML', 'Ilmiy grantlar', 'Texnik arxitektura'],
    availableSlots: ['Seshanba 15:00', 'Payshanba 16:00'],
    rating: 4.9,
    reviewsCount: 42,
    telegram: '@ojorayev_navdu'
  },
  {
    id: 'mentor-2',
    name: 'Azamat Shokirov',
    title: 'Senior Tech Lead & Startap maslahatchisi',
    organization: 'UzCombinator Mentor',
    bio: 'Startaplarni noldan $100K+ investitsiyaga yetkazish bo‘yicha amaliy tajribaga ega arxitektor.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    expertise: ['MVP qurish', 'Masshtablash', 'Pitch Deck'],
    availableSlots: ['Chorshanba 19:00', 'Juma 18:00'],
    rating: 5.0,
    reviewsCount: 48,
    telegram: '@azamat_shokirov'
  },
  {
    id: 'mentor-3',
    name: 'Nilufar Ergasheva',
    title: 'Marketing va Growth direktori',
    organization: 'E-commerce guruhi',
    bio: 'Raqamli marketing, CustDev va startaplar PR strategiyasi bo‘yicha ekspert.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    expertise: ['SMM & PR', 'CustDev', 'Mijozlarni jalb qilish'],
    availableSlots: ['Dushanba 14:00', 'Payshanba 14:00'],
    rating: 4.8,
    reviewsCount: 31,
    telegram: '@nilufar_growth'
  }
];

export const INITIAL_APPLICATIONS: IncubationApplication[] = [];

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'NavDU talabalari "InnoHack 2026" hakatoni uchun 60 mln so‘m mukofot jamg‘armasini e’lon qildi',
    slug: 'navdu-innohack-2026-60-mln-som-mukofot',
    excerpt: 'Universitetning eng iqtidorli dasturchilari va tadqiqotchilari 48 soat davomida sun’iy intellekt, yashil energetika va agrotexologiyalar bo‘yicha bellashadilar.',
    content: `Navoiy davlat universiteti Inkubatsiya va akseleratsiya markazi hamda Startap Klubi hamkorligida yillik eng katta texnologik tadbir — "NavDU InnoHack 2026" start olmoqda. 

Ushbu hakatonning bosh maqsadi — viloyatdagi mavjud agrar, sanoat va ekologik muammolarni universitet talabalari hamda yosh mutaxassislarining IT va muhandislik yechimlari orqali hal etishdan iborat.

Hakaton doirasida 4 ta asosiy yo‘nalish bo‘yicha arizalar qabul qilinadi:
1. Sun’iy intellekt va Ta’lim texnologiyalari (AI & EdTech);
2. Agro-sanoat va suvni tejash texnologiyalari (AgroTech);
3. Yashil energetika va ekologiya (GreenTech);
4. Sanoat avtomatizatsiyasi va IoT datchiklari.

G‘olib bo‘lgan jamoalar NavDU Inkubatsiya markazining 45 kunlik intensiv akseleratsiyasiga to‘g‘ridan-to‘g‘ri qabul qilinadi hamda o‘z ishlanmalarini viloyatning yirik korxonalarida sinovdan o‘tkazish imkoniyatiga ega bo‘ladilar.`,
    category: 'Hakatonlar',
    date: '12 Mart, 2026',
    readTime: '3 daqiqa',
    author: {
      name: 'Azizbek Rahmatov',
      role: 'NavDU Axborot xizmati rahbari',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80'
    },
    coverImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80',
    featured: true,
    tags: ['Hakaton', 'InnoHack', 'NavDU', 'Mukofot'],
    viewsCount: 0,
    likesCount: 0
  },
  {
    id: 'news-2',
    title: 'Navoiy kon-metallurgiya kombinati (NKMK) talabalar startaplarini moliyalashtirish bo‘yicha 1.2 mlrd so‘mlik memorandum imzoladi',
    slug: 'nkmk-navdu-startap-memorandum-1-2-mlrd',
    excerpt: 'Kombinat rahbariyati va NavDU ma’muriyati o‘rtasida sanoat chiqindilarini qayta ishlash va energetikani tejovchi talabalar loyihalarini joriy etishga kelishildi.',
    content: `Bugun Navoiy davlat universiteti Bosh binosida Navoiy kon-metallurgiya kombinati (NKMK) bosh muhandislari va innovatsiyalar departamenti vakillari bilan kengaytirilgan uchrashuv bo‘lib o‘tdi.

Uchrashuv yakunida talabalar va yosh olimlarning amaliy startap ishlanmalarini NKMK ishlab chiqarish korxonalarida sinovdan o‘tkazish va sanoatga joriy qilish uchun 1 milliard 200 million so‘mlik maxsus innovatsion grant fondi tashkil etildi.

Xususan, "EcoQuyosh" robotlashgan tozalash dronlari hamda "SanoatIoT" avtomatlashtirilgan datchiklar tizimi dastlabki sanoat sinovlariga jalb qilinadigan bo‘ldi.`,
    category: 'Hamkorlik',
    date: '10 Mart, 2026',
    readTime: '4 daqiqa',
    author: {
      name: 'Dilnoza Boboyeva',
      role: 'Inkubatsiya markazi koordinatori',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80'
    },
    coverImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&auto=format&fit=crop&q=80',
    featured: true,
    tags: ['NKMK', 'Investitsiya', 'Sanoat', 'B2B'],
    viewsCount: 0,
    likesCount: 0
  },
  {
    id: 'news-3',
    title: 'NavDU Inkubatsiya markazida 3-mavsum qabuli boshlandi: 45 kunlik intensiv dastur va $1,000 stipendiya',
    slug: 'navdu-inkubatsiya-3-mavsum-qabul-boshlandi',
    excerpt: 'Har bir saralangan jamoa 24/7 kovorking, 3 mahal bepul ovqat, 3D prototiplash laboratoriyasi va xalqaro mentorlar ko‘magi bilan ta’minlanadi.',
    content: `Universitetning barcha fakultetlari talabalari, magistrantlari va yosh tadqiqotchilari uchun 3-mavsum akseleratsiya dasturiga rasmiy arizalar qabuli e’lon qilindi.

Ushbu mavsumda jami 25 ta istiqbolli startap saralab olinadi. Saralash bosqichidan o‘tgan jamoalarga:
- 45 kunlik yashash va ovqatlanish xarajatlarini qoplovchi $1,000 ekvivalentidagi rag‘batlantiruvchi stipendiya;
- 24/7 ishlovchi yuqori tezlikdagi internet va texnik jihozlarga ega kovorking;
- Demo Day ko‘rgazmasida mahalliy va xorijiy venchur investorlar oldida loyihani taqdim etish imkoniyati beriladi.

Arizalar 2026-yil 25-mart sanasiga qadar rasmiy sayt orqali onlayn qabul qilinadi.`,
    category: 'Akseleratsiya',
    date: '08 Mart, 2026',
    readTime: '2 daqiqa',
    author: {
      name: 'Jamshid Nurmatov',
      role: 'Startap Klubi yetakchisi',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
    },
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
    tags: ['Akseleratsiya', 'Qabul', 'Grant', 'NavDU'],
    viewsCount: 0,
    likesCount: 0
  },
  {
    id: 'news-4',
    title: 'AgroSmart Drip startapi Navoiy viloyatida 140 gektar maydonda ilk sinov loyihasini muvaffaqiyatli ishga tushirdi',
    slug: 'agrosmart-drip-140-gektar-sinov-loyihasi',
    excerpt: 'AI asosidagi tomchilatib sug‘orish texnologiyasi qurg‘oqchil sharoitda suv sarfini 42% ga kamaytirishga muvaffaq bo‘ldi.',
    content: `NavDU Fizika-matematika fakulteti 4-kurs talabasi Jamshid Nurmatov tomonidan yaratilgan "AgroSmart Drip" startapi viloyatning Karmana tumanidagi paxta va g‘alla yetishtiruvchi fermer xo‘jaliklarida o‘zining ikkinchi avlod IoT datchiklarini o‘rnatdi.

Dastlabki sinov natijalariga ko‘ra, tuproq namligi va ob-havo bashoratini tahlil qiluvchi avtonom klapanlar tufayli 1 oyda suv resurslarining 42% tejalishiga erishildi. Loyiha qoshida Navoiy viloyat hokimligi ko‘magida qo‘shimcha 500 gektarlik agro-klaster shartnomasi tayyorlanmoqda.`,
    category: 'Universitet',
    date: '04 Mart, 2026',
    readTime: '3 daqiqa',
    author: {
      name: 'Azizbek Rahmatov',
      role: 'NavDU Axborot xizmati rahbari',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80'
    },
    coverImage: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1200&auto=format&fit=crop&q=80',
    tags: ['AgroTech', 'IoT', 'Muvaffaqiyat', 'Startap'],
    viewsCount: 0,
    likesCount: 0
  },
  {
    id: 'news-5',
    title: 'AQSH va Yevropa venchur fondlari vakillari NavDU Startap Klubi rezidentlari bilan uchrashuv o‘tkazdi',
    slug: 'xalqaro-venchur-fondlar-navdu-tashrif',
    excerpt: 'Kremniy vodiysi va London investorlari NavDU ning sun’iy intellekt va yashil energetika yo‘nalishidagi 6 ta startapiga qiziqish bildirdi.',
    content: `Navoiy shahriga tashrif buyurgan xalqaro venchur ekotizimi mutaxassislari NavDU Inkubatsiya va akseleratsiya markazida bo‘lib, talabalarimiz bilan 1-on-1 mentorlik va sarmoyaviy uchrashuvlar o‘tkazdilar.

Uchrashuv davomida xorijiy investorlar Markaziy Osiyo mintaqasida tabiiy resurslar va cho‘loldi hududlari uchun ishlab chiqilayotgan apparat (hardware) startaplar jahon bozorida katta eksport potensialiga ega ekanligini ta’kidladilar.`,
    category: 'Investitsiya',
    date: '28 Fevral, 2026',
    readTime: '4 daqiqa',
    author: {
      name: 'Dilnoza Boboyeva',
      role: 'Inkubatsiya markazi koordinatori',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80'
    },
    coverImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80',
    tags: ['Venchur', 'Xalqaro', 'Investitsiya', 'SiliconValley'],
    viewsCount: 0,
    likesCount: 0
  },
  {
    id: 'news-6',
    title: 'EcoQuyosh loyihasi Respublika "Yashil Energetika" tanlovida 1-o‘rinni egallab, $10,000 xalqaro grant yutdi',
    slug: 'ecoquyosh-yashil-energetika-1-orin-grant',
    excerpt: 'NavDU robototexniklari ishlab chiqqan suvsiz quyosh panellarini tozalovchi robotlar Markaziy Osiyodagi eng yirik quyosh stansiyalariga tatbiq etilmoqda.',
    content: `Toshkent shahrida o‘tkazilgan "CleanTech Uzbekistan 2026" milliy tanlovida Navoiy davlat universiteti jamoasi "EcoQuyosh" startapi bilan mutlaq g‘oliblikni qo‘lga kiritdi.

Mazkur loyiha cho‘l hududidagi chang bo‘ronlari sharoitida quyosh fotoelektr panellarini bir tomchi suv ishlatmasdan, statik elektr maydoni va maxsus mikrotolalar yordamida tozalash imkonini beradi. Yutilgan $10,000 grant to‘liq NavDU laboratoriyasida yangi robot prototiplarini ishlab chiqarishga sarflanadi.`,
    category: 'Grantlar',
    date: '20 Fevral, 2026',
    readTime: '3 daqiqa',
    author: {
      name: 'Jamshid Nurmatov',
      role: 'Startap Klubi yetakchisi',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
    },
    coverImage: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1200&auto=format&fit=crop&q=80',
    tags: ['Grant', 'EcoQuyosh', 'YashilEnergetika', 'Robot'],
    viewsCount: 0,
    likesCount: 0
  }
];
