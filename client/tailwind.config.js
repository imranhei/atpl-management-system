/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateY(40px)", opacity: "0" },
          "5%": { transform: "translateY(0)", opacity: "1" },
          "47%": { transform: "translateY(0)", opacity: "1" },
          "52%": { transform: "translateY(-40px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "0" },
        },
        slideOut: {
          "0%": { transform: "translateY(40px)", opacity: "0" },
          "45%": { transform: "translateY(40px)", opacity: "0" },
          "53%": { transform: "translateY(0)", opacity: "1" },
          "95%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-40px)", opacity: "1" },
        },
        "skew-x-shake": {
          "0%": { transform: "skewX(-10deg) translateY(0)" },
          "5%": { transform: "skewX(10deg) translateY(-3px)" },
          "10%": { transform: "skewX(-10deg) translateY(-5px)" },
          "15%": { transform: "skewX(10deg) translateY(-3px)"},
          "20%": { transform: "skewX(0deg) translateY(0)" },
          "100%": { transform: "skewX(0deg) translateY(0)" },
        },
        waveMove: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-50%)" },
        },
        "slide-horizontal": {
          '0%': { left: '-16px' },
          '100%': { left: '100%' },
        },
      },
      animation: {
        "slide-in": "slideIn 8s infinite ease-in-out",
        "slide-out": "slideOut 8s infinite ease-in-out",
        "skew-shake-x": "skew-x-shake 1.3s infinite;",
        wave: "waveMove 3s linear infinite",
        "slide-horizontal": "slide-horizontal 2s linear infinite",
      },
      fontFamily: {
        arial: ["Arial", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "spread": "0 0 4px rgba(0,0,0,0.15), 0 0 15px rgba(0,0,0,0.1)",
      },
      colors: {
        yellow: "hsl(var(--yellow))",
        yellowDark: "hsl(var(--yellow-dark))",
        textHead: "hsl(var(--textHead))",
        textBody: "hsl(var(--textBody))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        container: "hsl(var(--container))",
        box: "hsl(var(--box))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        navbar: {
          DEFAULT: "hsl(var(--navbar-background))",
          border: "hsl(var(--navbar-border))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
