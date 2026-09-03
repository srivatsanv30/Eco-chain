/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        eco: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        mint: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        slate: {
          850: '#172033',
          925: '#0d1525',
          950: '#0a0f1e',
        },
      },
      backgroundImage: {
        'gradient-eco': 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        'gradient-hero': 'linear-gradient(135deg, #0a0f1e 0%, #0d1a2e 50%, #0a1628 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255,255,255,0.08)',
        'glass-lg': '0 20px 60px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255,255,255,0.1)',
        'eco': '0 4px 20px rgba(34, 197, 94, 0.2)',
        'eco-lg': '0 8px 40px rgba(34, 197, 94, 0.3)',
        'glow-green': '0 0 40px rgba(34, 197, 94, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
      },
      backdropBlur: { xs: '2px' },
      borderRadius: { '2xl': '1rem', '3xl': '1.5rem', '4xl': '2rem' },
    },
  },
  plugins: [],
};
