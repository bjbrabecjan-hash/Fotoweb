import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#262522",
        ivory: "#F7F4EE",
        ash: "#67665F",
        gold: "#5D6956",
        charcoal: "#E9E5DC",
        "emerald-deep": "#FFFDFC",
        "warm-black": "#F7F4EE",
        champagne: "#5D6956",
        beige: "#CDAFA7",
        cream: "#262522"
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "serif"],
        script: ["var(--font-script)", "cursive"],
        sans: ["var(--font-inter)", "sans-serif"]
      },
      letterSpacing: {
        luxe: "0.18em",
        wider: "0.12em"
      },
      boxShadow: {
        gold: "0 18px 60px rgba(124, 137, 117, 0.16)"
      }
    }
  },
  plugins: []
};

export default config;
