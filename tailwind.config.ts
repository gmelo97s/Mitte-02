import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: {
        "2xl": "1240px",
      },
    },
    extend: {
      fontFamily: {
        display: ["Outfit", "system-ui", "sans-serif"],
        sans: ["Outfit", "system-ui", "sans-serif"],
        ticker: ["Anton", "Impact", "sans-serif"],
        marker: ["'Permanent Marker'", "cursive"],
      },
      colors: {
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
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        /* Outs Pub — paleta tirada do cardápio impresso */
        outs: {
          ink: "#0B0A0A",
          coal: "#141110",
          soot: "#1D1917",
          red: "#E8332A",
          blood: "#B81F18",
          kraft: "#F0C040",
          amber: "#E3A72F",
          paper: "#F4F0E6",
          bubble: "#F2C8DE",
          bone: "#CFC7B8",
          smoke: "#8F8779",
        },
      },
      boxShadow: {
        tape: "0 10px 30px -12px rgba(0,0,0,.75)",
        sticker: "0 18px 40px -18px rgba(0,0,0,.9)",
        glow: "0 0 0 1px rgba(232,51,42,.35), 0 20px 60px -24px rgba(232,51,42,.55)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        marquee: {
          from: { transform: "translate3d(0,0,0)" },
          to: { transform: "translate3d(-50%,0,0)" },
        },
        flicker: {
          "0%, 18%, 22%, 25%, 53%, 57%, 100%": { opacity: "1" },
          "20%, 24%, 55%": { opacity: ".35" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(var(--tilt, 0deg))" },
          "50%": { transform: "translateY(-10px) rotate(var(--tilt, 0deg))" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(.9)", opacity: ".8" },
          "70%": { transform: "scale(1.6)", opacity: "0" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        marquee: "marquee var(--marquee-duration, 28s) linear infinite",
        flicker: "flicker 4.5s linear infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(.22,1,.36,1) infinite",
        "slide-down": "slide-down .35s cubic-bezier(.22,1,.36,1) both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
