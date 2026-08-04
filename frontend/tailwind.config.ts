import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#0B0B0F",
        surface: "#16161D",
        "surface-raised": "#1D1D26",
        line: "#28282F",
        ink: "#F2F1F5",
        "ink-dim": "#9C9BA6",
        lime: "#D4FF3F",
        "lime-dim": "#8CA82C",
        violet: "#7B5CFA",
        "violet-bg": "#221C3D",
        coral: "#FF5A6E",
        "coral-bg": "#3A1E24",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "pulse-glow": "glow 4s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "slide-up": "slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        glow: {
          "0%, 100%": { opacity: "0.8", filter: "drop-shadow(0 0 15px rgba(212, 255, 63, 0.3))" },
          "50%": { opacity: "1", filter: "drop-shadow(0 0 25px rgba(212, 255, 63, 0.6))" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
