/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF", // Deep blue
        secondary: "#FBBF24", // Yellow
        accent: "#10B981", // Green
        background: "#242424", // Light black
        text: "#1F2937", // Dark gray
      },
    },
  },
  plugins: [],
};
