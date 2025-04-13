/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    scale: {
      '2xl': '1320px'
    },
    extend: {
      colors: {
        primary: '#172554',
        secondary: '#38bdf8',
      },
      scale: {
        '0': '0',
      }
    },
  },
  plugins: [],
}

