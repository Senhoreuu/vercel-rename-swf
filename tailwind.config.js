/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#f3f4f6',
          100: '#1a1b1e',
          200: '#2c2e33',
          300: '#3d4147',
          400: '#4c5058',
          500: '#696e77',
          600: '#868c97',
          700: '#a3a9b3',
          800: '#c1c6ce',
          900: '#e0e2e7',
        },
      },
    },
  },
  plugins: [],
};