/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // EnergyOS design tokens
        "eos-bg": "#ffffff",
        "eos-bg-alt": "#f8fafc",
        "eos-sidebar": "#0b0b0d",
        "eos-graphite-from": "#3f3f46",
        "eos-graphite-to": "#18181b",
        "eos-emerald": "#059669",
        "eos-emerald-light": "#10b981",
        "eos-text-primary": "#0f172a",
        "eos-text-secondary": "#64748b",
        "eos-text-tertiary": "#94a3b8",
      },
      boxShadow: {
        card: "0 16px 32px -20px rgba(15,23,42,0.12)",
        "card-hover": "0 24px 40px -20px rgba(15,23,42,0.18)",
        button: "0 1px 2px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34,1.56,0.64,1)",
        "spring-gentle": "cubic-bezier(0.16,1,0.3,1)",
      },
    },
  },
  plugins: [],
}

