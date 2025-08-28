import aspectRatio from "@tailwindcss/aspect-ratio";
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        neutral: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#E5E5E5",
          300: "#D4D4D4",
          400: "#A3A3A3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0A0A0A",
        },
        system: {
          success: "#10B981",
          error: "#EF4444",
          warning: "#F59E0B",
          info: "#3B82F6",
        },
        accent: {
          gold: "#F59E0B",
          emerald: "#10B981",
        },
        primary: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
          950: "#1E1B4B",
        },
        secondary: {
          violet: "#8B5CF6",
          purple: "#A855F7",
          pink: "#EC4899",
          rose: "#F43F5E",
        },
        brand: {
          blue: "#0EA5E9",
          cyan: "#06B6D4",
          teal: "#14B8A6",
          green: "#22C55E",
        },
      },
      backgroundColor: {
        DEFAULT: "#FAFAFA",
        card: "#FFFFFF",
        secondary: "#F8FAFC",
        accent: "#F1F5F9",
      },
      borderColor: {
        DEFAULT: "#E5E5E5",
        light: "#F5F5F5",
        medium: "#D4D4D4",
      },
      borderRadius: {
        "2xl": "16px",
        xl: "12px",
        lg: "8px",
        md: "6px",
        sm: "4px",
      },
      fontFamily: {
        spoqa: ["Spoqa Han Sans Neo", "sans-serif"],
      },
      fontWeight: {
        thin: "100",
        extralight: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },
      fontSize: {
        xl: "24px",
        lg: "20px",
        md: "18px",
        mmd: "16px",
        sm: "14px",
        xs: "12px",
      },
      transitionDuration: {
        DEFAULT: "300ms",
        fast: "150ms",
        slow: "500ms",
      },
    },
  },
  plugins: [animate, aspectRatio],
};
