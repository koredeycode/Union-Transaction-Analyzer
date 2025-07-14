/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        shake: "shake 0.3s ease-in-out",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-6px)" },
          "50%": { transform: "translateX(6px)" },
          "75%": { transform: "translateX(-6px)" },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [],
  // plugins: [require("@tailwindcss/forms")],
};
