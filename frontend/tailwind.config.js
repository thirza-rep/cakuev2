/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        excel: {
          green: '#107C41',
          dark: '#0B5A2F',
          light: '#E8F5E9',
          border: '#334155',
          header: '#1E293B',
          row: '#0F172A',
          selected: 'rgba(16, 124, 65, 0.2)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace']
      }
    },
  },
  plugins: [],
}
