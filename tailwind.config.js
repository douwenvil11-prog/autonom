/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Identidade AUTONOM: fundo quase preto com tom violeta + roxo como destaque
        ink: {
          950: '#07060d',
          900: '#0b0a14',
          850: '#100e1b',
          800: '#151223',
          700: '#1d1a30',
          600: '#2a2645',
        },
        brand: {
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(139,92,246,0.25), 0 8px 32px -8px rgba(124,58,237,0.35)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out both',
      },
    },
  },
  plugins: [],
}
