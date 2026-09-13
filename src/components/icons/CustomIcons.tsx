import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}


// 1. Rocket Outline Vector (Linear / Vercel style)
export const SvgRocket: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6.05 11a22.35 22.35 0 0 1-3.95 2z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 12H4s.55-3.03 2-4.5c1.62-1.63 5-2 5-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 15v5s3.03-.55 4.5-2c1.63-1.62 2-5 2-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="14" cy="10" r="1.5" fill="currentColor"/>
  </svg>
);

// 2. Trophy Cup Vector
export const SvgTrophy: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 22h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 14.66V17c0 .55-.45 1-1 1H8c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1h8c.55 0 1-.45 1-1v-1c0-.55-.45-1-1-1h-1c-.55 0-1-.45-1-1v-2.34" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 4H6v7a6 6 0 0 0 12 0V4z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 3. Newspaper Article Vector
export const SvgNewspaper: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 4. Diamond Celestial Sparkles
export const SvgSparkles: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 3v4M22 5h-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 5. Graduation Cap Vector
export const SvgGraduation: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 6. Calendar Schedule Vector
export const SvgCalendar: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    style={size ? { width: size, height: size } : undefined}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

// 7. Users / Team Vector
export const SvgUsers: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 8. Optical Search Lens (Lupa)
export const SvgSearch: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 20L16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 9. Command Palette ⌘ Keycap Icon
export const SvgCommand: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 10. Glowing Radiant Sun (Light Mode Icon)
export const SvgSun: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" fill="currentColor" fillOpacity="0.15" />
    <path d="M12 2V4M12 20V22M4 12H2M22 12H20M19.07 4.93L17.66 6.34M6.34 17.66L4.93 19.07M19.07 19.07L17.66 17.66M6.34 6.34L4.93 4.93" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

// 11. Celestial Crescent Moon (Dark Mode Icon)
export const SvgMoon: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path 
      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" 
      stroke="currentColor" 
      strokeWidth="1.6" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.15"
    />
  </svg>
);

// 12. Pitch Deck Presentation Slides Icon
export const SvgPitchDeck: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M7 12l3-3 2 2 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 13. Leaderboard Gold Medal
export const SvgMedalGold: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    style={size ? { width: size, height: size } : undefined}
  >
    <circle cx="12" cy="14" r="6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 2l4 6 4-6M12 8V2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const SvgMedalSilver: React.FC<IconProps> = SvgMedalGold;
export const SvgMedalBronze: React.FC<IconProps> = SvgMedalGold;

// 16. Open Startup Playbook Guide
export const SvgBookOpen: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 17. Official Partner Logo SVGs

// NKMK (Navoiy Mining and Metallurgical Combine) Vector
export const SvgLogoNKMK: React.FC<IconProps> = ({ className = 'h-8', size }) => (
  <svg 
    viewBox="0 0 160 48" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { height: size } : undefined}
  >
    {/* Crest Emblem */}
    <circle cx="24" cy="24" r="18" fill="#1E3A8A" stroke="#F59E0B" strokeWidth="2" />
    <path d="M16 16L24 24L32 16M24 24V32" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="24" cy="24" r="3" fill="#FDE047" />
    {/* Typography */}
    <text x="50" y="24" fontSize="16" fontWeight="900" fill="currentColor" fontFamily="sans-serif" letterSpacing="0.05em">NKMK</text>
    <text x="50" y="35" fontSize="8.5" fontWeight="600" fill="#64748B" fontFamily="sans-serif">NAVOIY METALLURGIYA</text>
  </svg>
);

// Navoiyazot Chemical Industry Vector
export const SvgLogoNavoiyazot: React.FC<IconProps> = ({ className = 'h-8', size }) => (
  <svg 
    viewBox="0 0 180 48" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { height: size } : undefined}
  >
    {/* Hexagon Molecule */}
    <path d="M24 10L35 17V31L24 38L13 31V17L24 10Z" fill="#0284C7" stroke="#38BDF8" strokeWidth="2" />
    <circle cx="24" cy="24" r="4" fill="#FFFFFF" />
    <circle cx="13" cy="17" r="2.5" fill="#38BDF8" />
    <circle cx="35" cy="31" r="2.5" fill="#38BDF8" />
    {/* Typography */}
    <text x="46" y="23" fontSize="14" fontWeight="900" fill="currentColor" fontFamily="sans-serif">NAVOIYAZOT</text>
    <text x="46" y="34" fontSize="8" fontWeight="600" fill="#64748B" fontFamily="sans-serif">KIMYO SANOATI AJ</text>
  </svg>
);

// IT Park Uzbekistan Vector Logo
export const SvgLogoITPark: React.FC<IconProps> = ({ className = 'h-8', size }) => (
  <svg 
    viewBox="0 0 150 48" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { height: size } : undefined}
  >
    {/* IT Park Green Cube */}
    <path d="M22 8L36 16V32L22 40L8 32V16L22 8Z" fill="#10B981" />
    <path d="M22 8L36 16L22 24L8 16L22 8Z" fill="#34D399" />
    <path d="M22 24V40L8 32V16L22 24Z" fill="#059669" />
    {/* IT Text */}
    <text x="44" y="25" fontSize="16" fontWeight="900" fill="currentColor" fontFamily="sans-serif">IT PARK</text>
    <text x="44" y="35" fontSize="8" fontWeight="700" fill="#10B981" fontFamily="sans-serif">UZBEKISTAN</text>
  </svg>
);

// Raqamli Texnologiyalar Vazirligi (Digital Uzbekistan)
export const SvgLogoDigitalGov: React.FC<IconProps> = ({ className = 'h-8', size }) => (
  <svg 
    viewBox="0 0 190 48" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { height: size } : undefined}
  >
    <circle cx="22" cy="24" r="16" fill="#2563EB" />
    <path d="M14 24L20 30L30 18" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <text x="46" y="22" fontSize="11" fontWeight="800" fill="currentColor" fontFamily="sans-serif">RAQAMLI TEXNOLOGIYALAR</text>
    <text x="46" y="33" fontSize="8" fontWeight="600" fill="#64748B" fontFamily="sans-serif">VAZIRLIGI</text>
  </svg>
);

// Oliy Ta'lim, Fan va Innovatsiyalar Vazirligi
export const SvgLogoHigherEdu: React.FC<IconProps> = ({ className = 'h-8', size }) => (
  <svg 
    viewBox="0 0 190 48" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { height: size } : undefined}
  >
    <circle cx="22" cy="24" r="16" fill="#4F46E5" />
    <path d="M14 20L22 15L30 20L22 25L14 20Z" fill="#FFFFFF" />
    <path d="M16 23V28C16 30 19 32 22 32C25 32 28 30 28 28V23" stroke="#FFFFFF" strokeWidth="1.5" />
    <text x="46" y="22" fontSize="11" fontWeight="800" fill="currentColor" fontFamily="sans-serif">OLIY TA’LIM & INNOVATSIYA</text>
    <text x="46" y="33" fontSize="8" fontWeight="600" fill="#64748B" fontFamily="sans-serif">VAZIRLIGI</text>
  </svg>
);

// Aloqabank Venture Fund
export const SvgLogoAloqabank: React.FC<IconProps> = ({ className = 'h-8', size }) => (
  <svg 
    viewBox="0 0 170 48" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { height: size } : undefined}
  >
    <circle cx="22" cy="24" r="15" fill="#EF4444" />
    <circle cx="22" cy="24" r="8" fill="#FFFFFF" />
    <circle cx="22" cy="24" r="4" fill="#EF4444" />
    <text x="44" y="23" fontSize="13" fontWeight="900" fill="currentColor" fontFamily="sans-serif">ALOQA VENTURES</text>
    <text x="44" y="34" fontSize="8" fontWeight="600" fill="#64748B" fontFamily="sans-serif">STARTUP INVEST FUND</text>
  </svg>
);

// GitHub Icon
export const SvgGithub: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

// Home Vector Icon
export const SvgHome: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Plus Circle Action Icon
export const SvgPlusCircle: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    style={size ? { width: size, height: size } : undefined}
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

// 21. SvgArrowRight
export const SvgArrowRight: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 22. SvgArrowLeft
export const SvgArrowLeft: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M19 12H5M5 12L11 18M5 12L11 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 23. SvgChevronRight
export const SvgChevronRight: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 24. SvgChevronLeft
export const SvgChevronLeft: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 25. SvgCheckCircle2
export const SvgCheckCircle2: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" fill="currentColor" fillOpacity="0.12" />
    <path d="M8 12.5L10.5 15L16 9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 26. SvgCheck
export const SvgCheck: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M4.5 12.5L9.5 17.5L19.5 6.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 27. SvgX (Close)
export const SvgX: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 28. SvgMenu (Hamburger)
export const SvgMenu: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M3.75 6.75H20.25M3.75 12H20.25M3.75 17.25H20.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// 29. SvgSend (Telegram / Airplane)
export const SvgSend: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M21.5 2.5L10 14M21.5 2.5L14.5 21.5C14.2 22.3 13 22.3 12.6 21.5L9.5 14.5L2.5 11.4C1.7 11 1.7 9.8 2.5 9.5L21.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 30. SvgHeart
export const SvgHeart: React.FC<IconProps & { filled?: boolean }> = ({ className = 'w-4 h-4', size, filled }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill={filled ? "currentColor" : "none"}
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 31. SvgMessageSquare
export const SvgMessageSquare: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M21 15C21 16.1046 20.1046 17 19 17H7L3 21V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8" cy="10" r="1" fill="currentColor"/>
    <circle cx="12" cy="10" r="1" fill="currentColor"/>
    <circle cx="16" cy="10" r="1" fill="currentColor"/>
  </svg>
);

// 32. SvgClock
export const SvgClock: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 7V12L15.5 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 33. SvgMapPin
export const SvgMapPin: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M12 21C16 16.5 19 13.5 19 9.5C19 5.35786 15.866 2 12 2C8.13401 2 5 5.35786 5 9.5C5 13.5 8 16.5 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

// 34. SvgMail
export const SvgMail: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M3 7L12 13L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 35. SvgPhone
export const SvgPhone: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M22 16.92V19.92C22 20.48 21.54 20.94 20.97 20.92C10.45 20.47 3.53 13.55 3.08 3.03C3.06 2.46 3.52 2 4.08 2H7.08C7.6 2 8.04 2.38 8.1 2.9C8.21 3.86 8.44 4.79 8.78 5.67C8.94 6.09 8.84 6.56 8.52 6.88L6.84 8.56C8.28 11.45 10.55 13.72 13.44 15.16L15.12 13.48C15.44 13.16 15.91 13.06 16.33 13.22C17.21 13.56 18.14 13.79 19.1 13.9C19.62 13.96 20 14.4 20 14.92V16.92H22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 36. SvgGlobe
export const SvgGlobe: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
    <ellipse cx="12" cy="12" rx="4.5" ry="9" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M3.5 9H20.5M3.5 15H20.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

// 37. SvgStar
export const SvgStar: React.FC<IconProps & { filled?: boolean }> = ({ className = 'w-4 h-4', size, filled }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill={filled ? "currentColor" : "none"} 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 38. SvgEye
export const SvgEye: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M2 12C3.8 7.5 7.5 4.5 12 4.5C16.5 4.5 20.2 7.5 22 12C20.2 16.5 16.5 19.5 12 19.5C7.5 19.5 3.8 16.5 2 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2"/>
    <circle cx="13" cy="11" r="1" fill="currentColor"/>
  </svg>
);

// 39. SvgTrendingUp
export const SvgTrendingUp: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M22 7L13.5 15.5L8.5 10.5L2 17M22 7H16M22 7V13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 40. SvgBarChart3
export const SvgBarChart3: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect x="3" y="13" width="4" height="8" rx="1" stroke="currentColor" strokeWidth="2"/>
    <rect x="10" y="8" width="4" height="13" rx="1" stroke="currentColor" strokeWidth="2"/>
    <rect x="17" y="3" width="4" height="18" rx="1" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

// 41. SvgTarget
export const SvgTarget: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
  </svg>
);

// 42. SvgDollarSign
export const SvgDollarSign: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 6V18M15 9.5C15 8.1 13.7 7 12 7C10.3 7 9 8.1 9 9.5C9 10.9 10.3 12 12 12C13.7 12 15 13.1 15 14.5C15 15.9 13.7 17 12 17C10.3 17 9 15.9 9 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// 43. SvgBuilding2
export const SvgBuilding2: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
    <path d="M8 6H10M14 6H16M8 10H10M14 10H16M8 14H10M14 14H16M10 22V18H14V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// 44. SvgBriefcase
export const SvgBriefcase: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect x="2" y="7" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M16 7V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V7M2 12H22M10 12V14H14V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// 45. SvgExternalLink
export const SvgExternalLink: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M18 13V19C18 20.1 17.1 21 16 21H5C3.9 21 3 20.1 3 19V8C3 6.9 3.9 6 5 6H11M15 3H21M21 3V9M21 3L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 46. SvgFileText
export const SvgFileText: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 47. SvgPlus
export const SvgPlus: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 48. SvgAlertCircle
export const SvgAlertCircle: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
    <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
    <circle cx="12" cy="16" r="1" fill="currentColor"/>
  </svg>
);

// 49. SvgQrCode
export const SvgQrCode: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/>
    <rect x="5" y="5" width="3" height="3" fill="currentColor"/>
    <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/>
    <rect x="16" y="5" width="3" height="3" fill="currentColor"/>
    <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/>
    <rect x="5" y="16" width="3" height="3" fill="currentColor"/>
    <path d="M14 14H17M14 17V21M17 17H21M21 14V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// 50. SvgTicket
export const SvgTicket: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M2 9C3.65685 9 5 7.65685 5 6H19C19 7.65685 20.3431 9 22 9V15C20.3431 15 19 16.3431 19 18H5C5 16.3431 3.65685 15 2 15V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2"/>
  </svg>
);

// 51. SvgFlame
export const SvgFlame: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M12 2C9.5 6 6 8.5 6 13.5C6 17 8.5 20 12 20C15.5 20 18 17 18 13.5C18 8.5 14.5 6 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 11C10.5 13 9.5 14.5 9.5 16C9.5 17.5 10.5 18.5 12 18.5C13.5 18.5 14.5 17.5 14.5 16C14.5 14.5 13.5 13 12 11Z" fill="currentColor"/>
  </svg>
);

// 52. SvgZap (Lightning)
export const SvgZap: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 53. SvgAward
export const SvgAward: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <circle cx="12" cy="8" r="6" stroke="currentColor" strokeWidth="2"/>
    <path d="M8.21 13.89L7 22L12 19L17 22L15.79 13.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 54. SvgMaximize
export const SvgMaximize: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M8 3H5C3.9 3 3 3.9 3 5V8M21 8V5C21 3.9 20.1 3 19 3H16M16 21H19C20.1 21 21 20.1 21 19V16M3 16V19C3 20.1 3.9 21 5 21H8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 55. SvgMinimize
export const SvgMinimize: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M4 14H8V18M20 14H16V18M16 10V6M16 10H20M8 10V6M8 10H4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 56. SvgLayers
export const SvgLayers: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 57. SvgDownload
export const SvgDownload: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M21 15V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15M7 10L12 15M12 15L17 10M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 58. SvgTag
export const SvgTag: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M20.59 13.41L13.42 20.58C12.63 21.36 11.37 21.36 10.59 20.58L2.42 12.41C2.15 12.14 2 11.78 2 11.41V4C2 2.9 2.9 2 4 2H11.41C11.78 2 12.14 2.15 12.41 2.42L20.59 10.59C21.37 11.37 21.37 12.63 20.59 13.41Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="7" cy="7" r="1.5" fill="currentColor"/>
  </svg>
);

// 59. SvgLightbulb
export const SvgLightbulb: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M9 18H15M10 22H14M12 2C7.58 2 4 5.58 4 10C4 12.76 5.4 15.19 7.5 16.5V17C7.5 17.55 7.95 18 8.5 18H15.5C16.05 18 16.5 17.55 16.5 17V16.5C18.6 15.19 20 12.76 20 10C20 5.58 16.42 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 60. SvgShieldCheck
export const SvgShieldCheck: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 61. SvgCompass
export const SvgCompass: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
    <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="currentColor" fillOpacity="0.2"/>
  </svg>
);

// 62. SvgHelpCircle
export const SvgHelpCircle: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
    <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 63. SvgShare
export const SvgShare: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2"/>
    <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
    <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M8.59 13.51L15.42 17.49M15.41 6.51L8.59 10.49" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// 64. SvgHandshake
export const SvgHandshake: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M19 11L15 7L10 12L7 9L2 14L6 18L10 14L13 17L22 8L19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 65. SvgFilter
export const SvgFilter: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 66. SvgCode
export const SvgCode: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <polyline points="16 18 22 12 16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="8 6 2 12 8 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 67. SvgPalette
export const SvgPalette: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.93 0 1.65-.75 1.65-1.69 0-.44-.18-.84-.44-1.13-.29-.29-.44-.65-.44-1.13 0-.94.75-1.69 1.69-1.69h2c3.04 0 5.54-2.5 5.54-5.54C22 6.38 17.52 2 12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
    <circle cx="12" cy="6.5" r="1.5" fill="currentColor"/>
    <circle cx="16" cy="8.5" r="1.5" fill="currentColor"/>
    <circle cx="6.5" cy="12.5" r="1.5" fill="currentColor"/>
  </svg>
);

// 68. SvgCpu
export const SvgCpu: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 69. SvgUserPlus
export const SvgUserPlus: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="20" y1="8" x2="20" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="23" y1="11" x2="17" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 70. SvgPieChart
export const SvgPieChart: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 12A10 10 0 0 0 12 2v10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 71. SvgBookmark
export const SvgBookmark: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 72. SvgVideo
export const SvgVideo: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <polygon points="23 7 16 12 23 17 23 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Backward-compatibility aliases
export const Sparkles = SvgSparkles;
export const AlertCircle = SvgAlertCircle;
export const CheckCircle2 = SvgCheckCircle2;
export const ArrowRight = SvgArrowRight;
export const ArrowLeft = SvgArrowLeft;
export const Star = SvgStar;
export const Clock = SvgClock;
export const Calendar = SvgCalendar;
export const Building2 = SvgBuilding2;
export const Users = SvgUsers;
export const Send = SvgSend;
export const Download = SvgDownload;
export const QrCode = SvgQrCode;
export const Trophy = SvgTrophy;
export const Share2 = SvgShare;
export const Check = SvgCheck;
export const Briefcase = SvgBriefcase;
export const Video = SvgVideo;
export const BookOpen = SvgBookOpen;
export const Sun = SvgSun;
export const Moon = SvgMoon;
export const Search = SvgSearch;

