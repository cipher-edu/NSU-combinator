export const MOMENTS = Array.from({ length: 19 }, (_, i) =>
  `/images/moments/${String(i + 1).padStart(2, '0')}.jpg`,
)

export const FALLBACK_PARTNERS: { id: string; slug: string; name: string; logo: string | null; url: string }[] = [
  { id: 'p1', slug: 'navdu', name: 'Navoiy davlat universiteti', logo: null, url: 'https://nsuni.uz' },
  { id: 'p2', slug: 'it-park', name: 'IT Park Uzbekistan', logo: null, url: 'https://it-park.uz' },
  { id: 'p3', slug: 'yoshlar', name: 'Yoshlar Ventures', logo: null, url: '' },
  { id: 'p4', slug: 'startup-garage', name: 'Startup Garage', logo: null, url: '' },
  { id: 'p5', slug: 'itpv', name: 'IT Park Ventures', logo: null, url: '' },
  { id: 'p6', slug: 'space', name: 'Space Coworking', logo: null, url: '' },
  { id: 'p7', slug: 'navoiy-it', name: 'Navoiy IT markazi', logo: null, url: '' },
  { id: 'p8', slug: 'texnopark', name: 'Navoiy texnoparki', logo: null, url: '' },
]

const NEWS_COVER: Record<string, string> = {
  'qanday-ariza': '/images/news/qanday-ariza.jpg',
  'demo-day-nima': '/images/news/demo-day-nima.jpg',
  mentorlik: '/images/news/mentorlik.jpg',
  'fakultet-mentor': MOMENTS[14],
  'navoiy-sanoat': MOMENTS[17],
  'birinchi-jamoa': MOMENTS[4],
  'sahna-qorquvi': MOMENTS[18],
  'ulush-talaba': MOMENTS[12],
  'nega-navdu': MOMENTS[17],
  'investor-savol': MOMENTS[16],
  'haftalik-maqsad': MOMENTS[0],
}

export function mediaUrl(path?: string | null) {
  if (!path) return ''
  if (path.startsWith('http') || path.startsWith('/images/')) return path
  return path.startsWith('/') ? path : `/${path}`
}

export function newsCover(slug: string, apiCover?: string | null) {
  return mediaUrl(apiCover) || NEWS_COVER[slug] || MOMENTS[0]
}

export function personPhoto(kind: 'team' | 'investors', slug: string, apiPhoto?: string | null) {
  return mediaUrl(apiPhoto) || `/images/${kind}/${slug}.jpg`
}
