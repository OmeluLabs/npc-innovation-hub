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
        // Member-dashboard two-tone palette — dark blue
        navy: {
          50: "#EEF3F9",
          100: "#DCE5F0",
          200: "#BCCBE0",
          300: "#8FA7C6",
          400: "#5E7FA8",
          500: "#3A6EA5",
          600: "#1E4E8C",
          700: "#14375F",
          800: "#0C2340",
          900: "#07182D",
        },
        // Member-dashboard two-tone palette — white / gray
        mist: {
          50: "#FAFBFD",
          100: "#F4F6FA",
          200: "#EDF1F6",
          300: "#E3E8F0",
          400: "#CBD3E0",
          500: "#94A0B4",
          600: "#64748B",
        },
        // Additional semantic colors
        background: {
          primary: "#FFFFFF",
          secondary: "#F8FAFC",
          accent: "#ECF7FC",
        },
        border: {
          light: "#E5EAF2",
          DEFAULT: "#CBD5E1",
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
        soft: "0 2px 8px rgba(0, 43, 86, 0.08)",
        medium: "0 4px 16px rgba(0, 43, 86, 0.12)",
        strong: "0 8px 32px rgba(0, 43, 86, 0.16)",
        hero: "0 20px 60px rgba(0, 43, 86, 0.2)",
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
