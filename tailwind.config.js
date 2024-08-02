/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        marquee: "marquee 20s linear infinite",
      },
      keyframes: {
        "0%": { transform: "translateX(-100%)" },
        "100%": { transform: "translateX(100%)" },
      },
    },
  },
  plugins: [],
};
