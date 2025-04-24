/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#13243b', // hippoblue-700
          light: '#436eab',   // Blue-500
          dark: '#091321',    // Blue-800
        },
        secondary: {
          DEFAULT: '#bea771', // Emerald-500
          light: '#f5e5c1',
          dark: '#806b3b',
        },
        accent: {
          DEFAULT: '#F59E0B', // Amber-500
          light: '#FBBF24',
          dark: '#B45309',
        },
        neutral: {
          DEFAULT: '#6B7280', // Gray-500
          light: '#D1D5DB',
          dark: '#374151',
        },
        background: {
          DEFAULT: '#F9FAFB', // Gray-50
          dark: '#737985',    // Gray-900
        },
        text: {
          DEFAULT: '#111827', // Gray-900
          light: '#ebedf2',   // Gray-500
        },
      },
    },
  },
  plugins: [],
}
