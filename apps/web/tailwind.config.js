/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bloom: {
          bg: '#FAF7F5',
          card: '#FFFFFF',
          blush: '#F5ECE9',
          terracotta: '#C86D51',
          wine: '#804646',
          sage: '#8BA888',
          dark: '#1A1817',
          darkCard: '#242120',
          darkBorder: '#363230',
          muted: '#78716C',
          text: '#292524',
          darkText: '#F5F5F4'
        }
      }
    },
  },
  plugins: [],
}
