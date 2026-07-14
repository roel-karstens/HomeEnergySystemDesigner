/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#00A86B",
          dark: "#007E50",
        },
      },
      boxShadow: {
        premium: "0 14px 28px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
}

