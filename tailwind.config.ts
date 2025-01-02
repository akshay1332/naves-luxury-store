import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#9b87f5",
          light: "#D6BCFA",
          dark: "#7E69AB",
        },
        secondary: {
          DEFAULT: "#1A1F2C",
          light: "#403E43",
          dark: "#221F26",
        },
        accent: {
          DEFAULT: "#E5DEFF",
          foreground: "#8B5CF6",
        },
        luxury: {
          gold: "#D4AF37",
          silver: "#C0C0C0",
          pearl: "#F5F5F5",
          cream: "#FFFDD0",
          champagne: "#F7E7CE",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui"],
        serif: ["var(--font-serif)", "Georgia"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeOut: {
          from: { opacity: "1", transform: "translateY(0)" },
          to: { opacity: "0", transform: "translateY(10px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 3s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
        fadeIn: "fadeIn 0.5s ease-out",
        fadeOut: "fadeOut 0.5s ease-out",
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(to right, #D4AF37, #C0C0C0)',
        'dark-gradient': 'linear-gradient(to right, #1A1F2C, #403E43)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;