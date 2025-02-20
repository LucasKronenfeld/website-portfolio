/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        contrast: "#8F9FA6", // Muted greyish blue, great for contrasts
        secondary: "#BF996B", // Warm, golden brown
        accent: "#BF9673", // A rich, earthy brown with a hint of red
        background: "#F2F2F2", // Soft, light grey background
        text: "#262626", // Dark grey for text
        darkback: "#4F5A63", // Muted greyish blue, useful for darker sections or shadows
      },
    },
  },
  plugins: [],
};
