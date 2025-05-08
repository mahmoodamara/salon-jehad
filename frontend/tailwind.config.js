/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          cairo: ['Cairo', 'sans-serif'],
        },
        colors: {
          gold: '#FFD700',
        },
        animation: {
          fadeIn: 'fadeIn 1.2s ease-out forwards',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: 0, transform: 'translateY(30px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' },
          },
        },
      },
    },
    plugins: [
      require('tailwindcss-rtl'),
    ],
  }
  