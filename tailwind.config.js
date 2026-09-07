/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FFF6EA",
        peach: "#FFD9B3",
        blush: "#FFB6B9",
        amber: "#F4A261",
        gold: "#FFD97D",
        cocoa: "#5C3D2E",
      },
      fontFamily: {
        fredoka: ['"Fredoka"', 'cursive', 'sans-serif'],
        quicksand: ['"Quicksand"', 'sans-serif'],
      },
      boxShadow: {
        'cozy': '0 10px 30px -10px rgba(92, 61, 46, 0.15)',
        'cozy-lg': '0 20px 40px -15px rgba(92, 61, 46, 0.22)',
        'glow-gold': '0 0 25px rgba(255, 217, 125, 0.6)',
      },
    },
  },
  plugins: [],
}
