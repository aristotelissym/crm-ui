// tailwind.config.js
module.exports = {
    darkMode: 'class',
    content: [
      './app/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
      './pages/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          offwhite: '#F8F8F8',
          primaryText: '#13243B',
          headerBg: '#13243B',
          headerBorder: '#596575',
        },
      },
    },
    plugins: [],
  }
  