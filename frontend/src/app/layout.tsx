import type { Metadata } from 'next'
import { Anton, Bricolage_Grotesque, IBM_Plex_Mono, IBM_Plex_Sans, Outfit, Source_Serif_4 } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { SiteFrame } from '@/components/SiteFrame'

const sans = IBM_Plex_Sans({ subsets: ['latin', 'cyrillic'], weight: ['400', '500', '600', '700'], variable: '--font-sans' })
const outfit = Outfit({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-outfit' })
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['500', '600'], variable: '--font-mono' })
const serif = Source_Serif_4({ subsets: ['latin', 'cyrillic'], weight: ['400', '500', '600'], style: ['normal', 'italic'], variable: '--font-serif' })
const anton = Anton({ subsets: ['latin'], weight: '400', variable: '--font-anton' })
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage' })

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'NSU startup-club — NavDU startap akseleratori',
  description: 'Navoiy davlat universiteti startap akseleratori. 10 hafta, mentorlik, Demo Day.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'NSU startup-club',
    description: 'NavDU startap akseleratori',
    images: ['/images/og.jpg'],
  },
}

export const viewport = { themeColor: '#FB6A00' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="uz"
      className={`${sans.variable} ${outfit.variable} ${mono.variable} ${serif.variable} ${anton.variable} ${bricolage.variable}`}
    >
      <body className="overflow-x-hidden antialiased">
        <Providers>
          <SiteFrame>{children}</SiteFrame>
        </Providers>
      </body>
    </html>
  )
}
