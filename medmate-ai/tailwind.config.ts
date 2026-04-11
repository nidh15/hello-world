import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        /* Semantic tokens */
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        /* Brand palette — warm editorial teal + coral */
        ocean: {
          50: "#EFF8F8",
          100: "#D7EFEF",
          200: "#AFDEDE",
          300: "#7BC8C8",
          400: "#47ADAD",
          500: "#0B6E6E",
          600: "#095A5A",
          700: "#074646",
          800: "#053232",
          900: "#031E1E",
          950: "#011010",
        },
        coral: {
          50: "#FFF5F2",
          100: "#FFE8E1",
          200: "#FFD0C3",
          300: "#FFB09A",
          400: "#F08B6D",
          500: "#E8735A",
          600: "#D15A42",
          700: "#B04432",
          800: "#8C3528",
          900: "#6B2A20",
        },
        sage: {
          50: "#F2F7F2",
          100: "#E0EDE0",
          200: "#C2DBC2",
          300: "#97C197",
          400: "#6BA66B",
          500: "#4A8C4A",
          600: "#3A7040",
          700: "#2D5632",
          800: "#234426",
          900: "#1A331C",
        },
        cream: {
          50: "#FEFCFA",
          100: "#FDF6F0",
          200: "#FBEEE2",
          300: "#F5DEC8",
          400: "#EDCBA8",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        warm: "0 2px 10px rgba(11,110,110,0.06), 0 8px 30px rgba(11,110,110,0.04)",
        "warm-lg":
          "0 4px 16px rgba(11,110,110,0.08), 0 12px 40px rgba(11,110,110,0.06)",
        "warm-xl":
          "0 8px 24px rgba(11,110,110,0.1), 0 20px 60px rgba(11,110,110,0.08)",
        glow: "0 0 24px rgba(11,110,110,0.15)",
        "coral-glow": "0 0 24px rgba(232,115,90,0.2)",
        inner: "inset 0 2px 4px rgba(0,0,0,0.04)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-right": {
          "0%": { opacity: "0", transform: "translateX(16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-left": {
          "0%": { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        "typing-bounce": {
          "0%, 60%, 100%": { transform: "translateY(0)", opacity: "0.4" },
          "30%": { transform: "translateY(-4px)", opacity: "1" },
        },
        "blob-morph": {
          "0%, 100%": { borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" },
          "50%": { borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in": "fade-in 0.4s ease-out both",
        "slide-right": "slide-right 0.4s cubic-bezier(0.16,1,0.3,1) both",
        "slide-left": "slide-left 0.4s cubic-bezier(0.16,1,0.3,1) both",
        float: "float 5s ease-in-out infinite",
        "pulse-soft": "pulse-soft 1.5s ease-in-out infinite",
        "blob-morph": "blob-morph 8s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "scale-in": "scale-in 0.3s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
