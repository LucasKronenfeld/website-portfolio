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
        // VT323 as primary display font with monospace fallbacks
        sans: ['"VT323"', 'ui-monospace', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', ...fontFamily.mono],
        mono: ['"VT323"', 'ui-monospace', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace']
      },
      colors: {
        // Retro Macintosh-inspired palette
        background: '#F8F8F8',      // off-white
        surface: '#CCCCCC',         // light gray window/chrome
        text: '#000000',            // black
        muted: '#555555',           // muted gray text
        primary: '#4EA5FF',         // accent blue
        secondary: '#A8D1FF',       // soft pastel blue
        ink: '#000000',
        paper: '#F8F8F8'
      },
      boxShadow: {
        // Minimal hard edges instead of soft glows
        hard: '0 0 0 2px #000',
        insetHard: 'inset 0 0 0 1px #000',
      },
      backgroundImage: {
        // Subtle CRT/halftone grain (composed patterns)
        'crt-dots': 'radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)',
        'crt-scan': 'linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)'
      },
      backgroundSize: {
        dots: '6px 6px',
        scan: '100% 24px'
      },
      borderWidth: {
        3: '3px'
      },
      borderRadius: {
        none: '0'
      }
      ,
      lineHeight: {
        100: '1',
        110: '1.1',
        120: '1.2'
      }
    },
  },
  plugins: [],
}
