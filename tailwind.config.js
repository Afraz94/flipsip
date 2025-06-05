/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        flipsip: "#2b1155",
        blackish: "#110022",
        neon: "#bc6cff",
        dark: "#180038",
      },
      fontFamily: {
        futuristic: ["var(--font-orbitron)", "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 20px 4px #bc6cff, 0 0 40px 8px #2b1155",
      },
    },
  },
  plugins: [],
};
