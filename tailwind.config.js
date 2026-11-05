// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}",
//     "./index.html",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand palette - values live in src/index.css as CSS variables.
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        surface: {
          DEFAULT: "rgb(var(--color-surface) / <alpha-value>)",
          muted: "rgb(var(--color-surface-muted) / <alpha-value>)",
        },
        line: "rgb(var(--color-line) / <alpha-value>)",
        "ink-muted": "rgb(var(--color-ink-muted) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        danger: "rgb(var(--color-danger) / <alpha-value>)",
        warning: "rgb(var(--color-warning) / <alpha-value>)",
        // Legacy "npc" names kept so existing components pick up the new
        // palette without a rename: navy -> primary, navy-light -> secondary.
        npc: {
          navy: {
            DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
            light: "rgb(var(--color-secondary) / <alpha-value>)",
            dark: "rgb(var(--color-primary) / <alpha-value>)",
          },
          text: {
            primary: "rgb(var(--color-primary) / <alpha-value>)",
            secondary: "rgb(var(--color-ink-muted) / <alpha-value>)",
          },
        },
        // Dashboard scales, derived from the brand palette (see src/index.css).
        navy: {
          50: "rgb(var(--navy-50) / <alpha-value>)",
          100: "rgb(var(--navy-100) / <alpha-value>)",
          200: "rgb(var(--navy-200) / <alpha-value>)",
          300: "rgb(var(--navy-300) / <alpha-value>)",
          400: "rgb(var(--navy-400) / <alpha-value>)",
          500: "rgb(var(--navy-500) / <alpha-value>)",
          600: "rgb(var(--navy-600) / <alpha-value>)",
          700: "rgb(var(--navy-700) / <alpha-value>)",
          800: "rgb(var(--navy-800) / <alpha-value>)",
          900: "rgb(var(--navy-900) / <alpha-value>)",
        },
        mist: {
          50: "rgb(var(--mist-50) / <alpha-value>)",
          100: "rgb(var(--mist-100) / <alpha-value>)",
          200: "rgb(var(--mist-200) / <alpha-value>)",
          300: "rgb(var(--mist-300) / <alpha-value>)",
          400: "rgb(var(--mist-400) / <alpha-value>)",
          500: "rgb(var(--mist-500) / <alpha-value>)",
          600: "rgb(var(--mist-600) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-body)"],
        heading: ["var(--font-heading)"],
      },
      fontSize: {
        // Custom font sizes matching design
        hero: ["3.25rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "hero-mobile": [
          "2.5rem",
          { lineHeight: "1.2", letterSpacing: "-0.01em" },
        ],
        tagline: ["2.75rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "tagline-mobile": ["2rem", { lineHeight: "1.3" }],
      },
      spacing: {
        // Custom spacing values
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
      },
      boxShadow: {
        soft: "0 2px 8px rgb(var(--color-primary) / 0.08)",
        medium: "0 4px 16px rgb(var(--color-primary) / 0.12)",
        strong: "0 8px 32px rgb(var(--color-primary) / 0.16)",
        hero: "0 20px 60px rgb(var(--color-primary) / 0.2)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      transitionDuration: {
        400: "400ms",
      },
      backdropBlur: {
        xs: "2px",
      },
      screens: {
        xs: "475px",
        "3xl": "1920px",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        slideDown: {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
    },
  },
  plugins: [],
};
