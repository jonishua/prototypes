import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#F8F8F8",
        surface: "#FFFFFF",
        "surface-muted": "#F2F2F2",
        text: "#1A1A1A",
        "text-muted": "rgba(26,26,26,0.62)",
        accent: "#5A8BF6",
        "accent-soft": "#A0C4FF",
        neutral: "#C0C0C0",
        "neutral-soft": "#E5E5E5"
      },
      fontFamily: {
        display: ["var(--font-urbanist)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"]
      },
      boxShadow: {
        subtle: "0 18px 40px rgba(15, 23, 42, 0.08)",
        soft: "0 28px 65px rgba(15, 23, 42, 0.12)"
      },
      transitionTimingFunction: {
        "gentle-out": "cubic-bezier(0.16, 1, 0.3, 1)",
        "gentle-in": "cubic-bezier(0.7, 0, 0.84, 0)"
      }
    }
  },
  plugins: []
};

export default config;

