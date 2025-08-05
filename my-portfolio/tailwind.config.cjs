/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
      },
      colors: {
        'background': '#0D1117',
        'text': '#E6EDF3',
        'muted': '#8B949E',
        'surface': '#161B22',
        'primary': '#A78BFA',
        'secondary': '#38BDF8'
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(to right, #38BDF8, #A78BFA)',
      },
    },
  },
  plugins: [],
}
