/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fdfcfb',
          100: '#fbf9f5',
          200: '#f5f3ec',
          300: '#ece8de',
          400: '#ded8ca',
        },
        brand: {
          DEFAULT: '#2563EB', // Qirollik Ko'ki (Royal Blue)
          hover: '#1d4ed8',
          light: '#eff6ff',
          glow: 'rgba(37, 99, 235, 0.25)',
        },
        ink: {
          950: '#0a0c10',
          900: '#0f1115',
          850: '#15181e',
          800: '#1c2027',
          700: '#2b313c',
          text: '#0e1014',
          muted: '#5a6270',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'monospace'],
      },
      animation: {
        'drift-a': 'driftA 26s cubic-bezier(0.45, 0, 0.55, 1) infinite alternate',
        'drift-b': 'driftB 32s cubic-bezier(0.45, 0, 0.55, 1) infinite alternate',
        'drift-c': 'driftC 38s cubic-bezier(0.45, 0, 0.55, 1) infinite alternate',
        'aurora-sweep': 'auroraSweep 24s ease-in-out infinite alternate',
        'marquee': 'marquee 35s linear infinite',
      },
      keyframes: {
        driftA: {
          '0%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '100%': { transform: 'translate3d(8vw, 9vh, 0) scale(1.18)' },
        },
        driftB: {
          '0%': { transform: 'translate3d(0, 0, 0) scale(1.1)', opacity: '0.8' },
          '100%': { transform: 'translate3d(-7vw, 7vh, 0) scale(0.92)', opacity: '1' },
        },
        driftC: {
          '0%': { transform: 'translate3d(-6vw, -4vh, 0) scale(0.95)' },
          '100%': { transform: 'translate3d(6vw, 6vh, 0) scale(1.15)' },
        },
        auroraSweep: {
          '0%': { transform: 'translateX(-10%)', opacity: '0.4' },
          '100%': { transform: 'translateX(10%)', opacity: '0.85' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
