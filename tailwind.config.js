const config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAFAF8",
        surface: "#F1EFEA",
        ink: "#151515",
        muted: "#6B6B65",
        accent: "#3B82F6",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-fraunces)", "serif"],
      },
      animation: {
        wave: "wave 1.4s ease-in-out infinite",
        ring1: "ring1 2.6s ease-in-out infinite",
        ring2: "ring2 2.6s ease-in-out infinite 0.3s",
      },
      keyframes: {
        wave: {
          "0%, 100%": { transform: "scaleY(0.35)" },
          "50%": { transform: "scaleY(1)" },
        },
        ring1: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.5" },
          "50%": { transform: "scale(1.12)", opacity: "0.9" },
        },
        ring2: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.25" },
          "50%": { transform: "scale(1.22)", opacity: "0.55" },
        },
      },
    },
  },
  plugins: [],
};

module.exports = config;
