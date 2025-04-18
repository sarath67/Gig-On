/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        custom: ["Lora", "serif"]
      }
    },
  },
  plugins: [require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("tailwindcss-animate")],
}