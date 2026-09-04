'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type Lang = 'uz' | 'en'

const dict = {
  uz: {
    brand: 'NSU startup-club',
    tagline: 'Navoiy davlat universiteti startap akseleratori',
    navPortfolio: 'Portfolio',
    navTeam: 'Jamoa',
    navInvestors: 'Investorlar',
    navNews: 'Suhbatlar',
    navValuation: 'Baho',
    login: 'Kirish',
    cabinet: 'Kabinet',
    logout: 'Chiqish',
    apply: 'Ariza topshirish',
    heroKicker: '10 hafta · NavDU',
    heroTitle: '10 haftada',
    heroTitle2: 'keyingi bosqichga',
    heroLead:
      'Talaba jamoasi g‘oyani Demo Day’gacha olib chiqadi: mentor, aniq maqsad, universitet sahnasi.',
    statsApps: 'ariza',
    statsAccepted: 'startap qabul qilindi',
    statsSeasons: 'mavsum',
    legendSeason: 'Birinchi mavsum',
    legendDot: 'har bir nuqta — bitta ariza',
    legendApps: 'ariza topshirdi',
    legendAccepted: 'startap qabul qilindi',
    aboutKicker: '01  Biz kimmiz',
    aboutTitle: 'NSU startup-club haqida',
    aboutP1:
      'NSU startup-club — Navoiy davlat universitetidagi startap akseleratori. G‘oyani 10 haftada ishlaydigan mahsulotga aylantiramiz. Har hafta bitta maqsad, bitta mentor, hafta oxirida — aniq natija.',
    aboutP2:
      'Dastur Demo Day bilan tugaydi: dekanat, mentorlar va tashqi investorlar zalda o‘tiradi. Uch daqiqalik hikoyangizni shuncha marta aytasizki, sahnaga chiqqanda hayajon halaqit bermaydi.',
    aboutP3:
      'Har jamoaga ish stoli, mentor va universitet sahnasi. Ariza talaba, magistrant yoki bitiruvchidan kelishi mumkin — dastur Navoiyda, yuzma-yuz.',
    seasonOpen: 'Arizalar ochiq',
    seasonNext: 'keyingi mavsum',
    seasonSoon: 'tez orada',
    seasonTotal: 'Birinchi mavsumda jami',
    demoTitle: 'Birinchi Demo Day',
    demoLead: 'Zal, sahna va birinchi jamoalar — mavsum oxirida.',
    newsLatest: 'So‘nggi yangiliklar',
    howKicker: '02  Yo‘l',
    howTitle: 'Qanday ishlaydi',
    weeksKicker: '03  Ichkarida',
    weeksTitle: 'O‘n hafta qanday o‘tadi',
    galleryTitle: 'Dastur ichkarisidan',
    galleryLead: 'Mentor uchrashuvlari, ish kunlari va Demo Day.',
    newsTitle: 'Yangiliklar va suhbatlar',
    newsAll: 'Barcha suhbatlar',
    partnersTitle: 'Bizning hamkorlar',
    ctaTitle: 'Birinchi qadam sizniki.',
    ctaOpen: 'Arizalar ochiq.',
    ctaClosed: 'Hozir ariza oynasi yopiq.',
    footer: '© 2026 NSU startup-club. Navoiy davlat universiteti.',
    portfolioTitle: 'Portfolio',
    portfolioLead: 'Dasturimizdan o‘tgan va keyingi bosqichga chiqqan startaplar.',
    portfolioEmpty: 'Keyingi mavsum — bu joy sizning startapingiz uchun.',
    teamTitle: 'Bizning jamoa',
    teamLead: 'NavDU startap ekotizimini birga qurayotgan operatorlar.',
    invTitle: 'Investorlar',
    invLead: 'Founderlarimizga va universitet ekotizimiga ishongan odamlar.',
    newsLead: 'Founderlar, mentorlar va dastur haqida suhbatlar.',
    valTitle: 'Startapingiz qancha turadi?',
    valLead: 'Pre-money bahoni uchta usulda chamalang: bitim, daromad × va VC metodi.',
    verifyTitle: 'Sertifikatni tekshirish',
    verifyLead: 'Hujjatdagi kodni kiriting — yozuv shu yerda ko‘rinadi.',
    verifyBtn: 'Tekshirish',
    applyTitle: 'Kirish',
    applyGoogle: 'Email orqali davom etish',
    email: 'Email',
    code: 'Kod',
    sendCode: 'Kod yuborish',
    verifyCode: 'Kirish',
    consentPd: 'Shaxsga doir ma’lumotlarga ishlov berishga roziman',
    consentMk: 'Dastur yangiliklarini emailga olishga roziman',
    steps: ['Ariza', 'Suhbat', '10 hafta', 'Demo Day', 'Keyin'],
    stepBodies: [
      'Bir necha savol, o‘n daqiqa. Slayd shart emas — nima qurayotganingizni o‘z so‘zingiz bilan yozing.',
      'Qisqa suhbat. Slaydlarni emas, sizni tinglaymiz.',
      'Haftada bir mentor, aniq maqsad, ishlaydigan mahsulot.',
      'Zaldagi investorlar oldida uch daqiqa. Tayyorgarlikni birga qilamiz.',
      'Dastur tugaydi, hamjamiyat qoladi.',
    ],
  },
  en: {
    brand: 'NSU startup-club',
    tagline: 'Navoi State University startup accelerator',
    navPortfolio: 'Portfolio',
    navTeam: 'Team',
    navInvestors: 'Investors',
    navNews: 'Talks',
    navValuation: 'Valuation',
    login: 'Sign in',
    cabinet: 'Cabinet',
    logout: 'Log out',
    apply: 'Apply',
    heroKicker: '10 weeks · NavDU',
    heroTitle: 'The next stage',
    heroTitle2: 'in 10 weeks',
    heroLead:
      'Student teams go from idea to Demo Day: a mentor, a weekly goal, a university stage.',
    statsApps: 'applications',
    statsAccepted: 'startups accepted',
    statsSeasons: 'season',
    legendSeason: 'First season',
    legendDot: 'each dot is one application',
    legendApps: 'applied',
    legendAccepted: 'startups accepted',
    aboutKicker: '01  Who we are',
    aboutTitle: 'About NSU startup-club',
    aboutP1:
      'NSU startup-club is Navoi State University’s startup accelerator. In 10 weeks we turn an idea into a working product. One goal a week, one mentor, something ships every Friday.',
    aboutP2:
      'The program ends with Demo Day: faculty, mentors and outside investors in the room. You tell the three-minute story so many times that nerves stop getting in the way.',
    aboutP3:
      'Every team gets a desk, a mentor and a university stage. Students, master’s students and alumni can apply — the program runs in person in Navoi.',
    seasonOpen: 'Applications open',
    seasonNext: 'next season',
    seasonSoon: 'soon',
    seasonTotal: 'Season one so far',
    demoTitle: 'The first Demo Day',
    demoLead: 'The room, the stage and the first teams — at the end of the season.',
    newsLatest: 'Latest news',
    howKicker: '02  The path',
    howTitle: 'How it works',
    weeksKicker: '03  Inside',
    weeksTitle: 'How the ten weeks run',
    galleryTitle: 'From inside the program',
    galleryLead: 'Mentor sessions, workdays and Demo Day.',
    newsTitle: 'News and conversations',
    newsAll: 'All talks',
    partnersTitle: 'Partners',
    ctaTitle: 'The first step is yours.',
    ctaOpen: 'Applications are open.',
    ctaClosed: 'Applications are closed right now.',
    footer: '© 2026 NSU startup-club. Navoi State University.',
    portfolioTitle: 'Portfolio',
    portfolioLead: 'Startups that went through the program.',
    portfolioEmpty: 'Next season — this spot is for your startup.',
    teamTitle: 'The team',
    teamLead: 'Operators building the NavDU startup ecosystem.',
    invTitle: 'Investors',
    invLead: 'People who believe in our founders and the university ecosystem.',
    newsLead: 'Conversations with founders, mentors and the program.',
    valTitle: 'What is your startup worth?',
    valLead: 'Ballpark pre-money with three methods: deal, revenue multiple, VC method.',
    verifyTitle: 'Verify a certificate',
    verifyLead: 'Enter the code from the document.',
    verifyBtn: 'Verify',
    applyTitle: 'Sign in',
    applyGoogle: 'Continue with email',
    email: 'Email',
    code: 'Code',
    sendCode: 'Send code',
    verifyCode: 'Sign in',
    consentPd: 'I agree to processing of personal data',
    consentMk: 'Send me program news by email',
    steps: ['Apply', 'Interview', '10 weeks', 'Demo Day', 'After'],
    stepBodies: [
      'A few questions, ten minutes. No slides — write what you are building.',
      'A short conversation. We listen to you, not the deck.',
      'A weekly mentor, a clear goal, a working product.',
      'Three minutes in front of investors. We prep together.',
      'The program ends. The community stays.',
    ],
  },
} as const

type Dict = (typeof dict)['uz']

const Ctx = createContext<{ lang: Lang; t: Dict; setLang: (l: Lang) => void } | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('uz')
  useEffect(() => {
    const saved = localStorage.getItem('nsu_lang') as Lang | null
    if (saved === 'uz' || saved === 'en') setLang(saved)
  }, [])
  const value = useMemo(
    () => ({
      lang,
      t: dict[lang],
      setLang: (l: Lang) => {
        setLang(l)
        localStorage.setItem('nsu_lang', l)
      },
    }),
    [lang],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useI18n() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('I18n')
  return ctx
}

export function pick(lang: Lang, uz: string, en?: string) {
  return lang === 'en' && en ? en : uz
}
