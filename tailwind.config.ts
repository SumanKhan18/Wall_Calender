import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        paper: "0 26px 55px rgba(19, 31, 46, 0.18), 0 10px 18px rgba(19, 31, 46, 0.08)",
        flip: "0 28px 40px rgba(18, 36, 53, 0.2)"
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "sans-serif"],
        display: ["var(--font-montserrat)", "sans-serif"]
      },
      backgroundImage: {
        wall: "radial-gradient(circle at top, rgba(255,255,255,0.88), rgba(229,225,218,0.96) 42%, rgba(213,208,200,1) 100%)",
        paper: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(246,243,238,0.98))",
        grain: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='.08'/%3E%3C/svg%3E\")"
      }
    }
  },
  plugins: []
};

export default config;
