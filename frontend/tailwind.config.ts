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
    },
  },
  plugins: [],
};
export default config;
