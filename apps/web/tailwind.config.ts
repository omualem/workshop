import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        mist: "#f8fafc",
        sea: "#0891b2",
        sand: "#fef3c7",
      },
      fontFamily: {
        sans: ["Rubik", "Segoe UI", "Arial", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 55px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
