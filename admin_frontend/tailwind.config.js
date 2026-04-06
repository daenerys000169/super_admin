/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#EDC523',
        'primary-hover': '#F3B10C',
        secondary: '#2B2B2B',
        accent: '#0056B3',
        // Card background colors from Figma
        'card-total': '#FEE5D9',
        'card-approved': '#E0FFEC',
        'card-review': '#FFF7E2',
        'card-pending': '#F2F3F5',
        'card-rejected': '#FFD7D9',
        // Status colors
        'status-approved': '#22C55E',
        'status-pending': '#9CA3AF',
        'status-review': '#F59E0B',
        'status-rejected': '#EF4444',
        // Dark mode colors
        'dark-bg': '#1A1A1A',
        'dark-card': '#252525',
        'dark-border': '#3A3A3A',
        'dark-text': '#E5E5E5',
        'dark-muted': '#9CA3AF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        spartan: ['League Spartan', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'speedometer': 'speedometer 1.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        speedometer: {
          '0%': { strokeDashoffset: '283' },
          '100%': { strokeDashoffset: 'var(--target-offset)' },
        },
      },
      transitionDuration: {
        '400': '400ms',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.1)',
        'sidebar': '2px 0 8px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
