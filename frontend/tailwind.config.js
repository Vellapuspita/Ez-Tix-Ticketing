/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // pakai Poppins / Inter mirip figma (bold + clean)
        sans: ["Poppins", "system-ui", "sans-serif"],
      },
      colors: {
        primary: "#FF914D",
        yellow: "#F4A623",
        cream: "#FFF8E2",
        dark: "#222222",
        textMuted: "#757575",
      },
      boxShadow: {
        card: "0 18px 45px rgba(0,0,0,0.15)",
      },
      borderRadius: {
        xl2: "1.5rem",
      },
    },
  },
  plugins: [],
};
