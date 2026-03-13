/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        head: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        bg: '#050810',
        bg1: '#080d1a',
        bg2: '#0d1428',
        cyan: '#00e5ff',
        violet: '#7c3aed',
        violet2: '#a855f7',
        pink: '#ec4899',
        green: '#10b981',
        amber: '#f59e0b',
      },
    },
  },
  plugins: [],
}
