import type { Config } from "tailwindcss";

const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px"
      }
    },
    extend: {
      screens: {
        "3xl": "1792px",
        "4xl": "2048px"
      },
      fontFamily: {
        "sans-ibm-plex": ["var(--font-ibm-plex-sans)"],
        "helvetica-neue": ["var(--font-helvetica-neue)"],
        "sans-manrope": ["var(--manrope-sans)"]
      },
      fontSize: {
        "2xs": "8px",
        xs: ".75rem",
        sm: ".875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem"
      },
      borderRadius: {
        base: "4px"
      },
      backgroundSize: {
        "size-200": "200% 200%"
      },
      backgroundPosition: {
        "pos-0": "0% 0%",
        "pos-100": "100% 100%"
      },
      colors: {
        "primary-gray": "#0C1820",
        "secondary-gray": "#1F2D3F",
        "dark-gray": "#71757A",
        "base-gray": "#6D6D6D",
        "light-gray": "#ADB1B8",
        "header-gray": "#5F7183",
        "negative-red": "#CF1800",
        "positive-green": "#44BD22",
        "positive-points": "#32CD32",
        "negative-points": "#FF3318",
        "primary-green": "#27AE60",
        "primary-blue": "#01A1FF",
        "secondary-blue": "#0099FF",
        "tertiary-blue": "#0496EC",
        "tab-blue": "#00A0FC",
        "primary-cyan": "#00CCFF",
        "off-white": "#C9C9C9",
        "error-red": "#FF615C"
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "toast-progress": "progress 5s linear forwards"
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        },
        progress: {
          "100%": {
            width: "0%"
          }
        }
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
} satisfies Config;

export default config;
