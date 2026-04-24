/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep Dark palette
        "deep-dark": {
          50: "#f8f8f9",
          100: "#f0f0f3",
          200: "#e0e0e6",
          300: "#c8c8d4",
          400: "#a8a8bb",
          500: "#8888a0",
          600: "#6b6b82",
          700: "#57576b",
          800: "#41414e",
          900: "#262629",
          950: "#09090b", // Primary deep black
        },
        // Neon accents
        neon: {
          cyan: "#00f0ff",
          blue: "#0066ff",
          purple: "#a64dff",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
      letterSpacing: {
        wider: "0.15em",
        widest: "0.3em",
      },
      backgroundImage: {
        "glow-gradient":
          "radial-gradient(circle, rgba(0, 240, 255, 0.1) 0%, rgba(0, 102, 255, 0.05) 50%, transparent 100%)",
      },
      backdropFilter: {
        glass: "blur(10px) brightness(1.1)",
      },
      boxShadow: {
        "glow-sm": "0 0 10px rgba(0, 240, 255, 0.2)",
        glow: "0 0 20px rgba(0, 240, 255, 0.3)",
        "glow-lg": "0 0 40px rgba(0, 240, 255, 0.4)",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
