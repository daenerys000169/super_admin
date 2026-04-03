/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#EDC523',
        secondary: '#2B2B2B',
        accent: '#0056B3',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        spartan: ['League Spartan', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
