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
        ink: "#0B0B0B",
        ivory: "#F5F2ED",
        ash: "#A3A3A3",
        gold: "#C6A969",
        charcoal: "#151515"
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"]
      },
      letterSpacing: {
        luxe: "0.18em",
        wider: "0.12em"
      },
      boxShadow: {
        gold: "0 18px 60px rgba(198, 169, 105, 0.16)"
      }
    }
  },
  plugins: []
};

export default config;
