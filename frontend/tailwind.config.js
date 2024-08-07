/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      proximaNova: ["var(--font-proximanova)"],
    },
    animation: {
      shake: "shake 0.5s infinite",
      floating: "floating 3s ease-in-out infinite",
      ring : "ring 4s .7s ease-in-out infinite",
    },
  },
  plugins: [],
};


