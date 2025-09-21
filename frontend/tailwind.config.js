/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'brand-bg': '#F9F7F3',
        'brand-text': '#3C3C3C',
        'brand-primary': '#E87A5D',
        'brand-primary-hover': '#D96846',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'serif'],
      }
    },
  },
  plugins: [],
}

