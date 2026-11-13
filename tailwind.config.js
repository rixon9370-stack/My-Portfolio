/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgPrimary: '#0a0a0c',
        bgSurface: '#111115',
        bgSurfaceHover: '#18181f',
        textMuted: 'rgba(255, 255, 255, 0.60)',
        borderSubtle: 'rgba(255, 255, 255, 0.10)',
        borderMedium: 'rgba(255, 255, 255, 0.15)',
      },
      fontFamily: {
        display: ['Antonio', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      spacing: {
        'pageMargin': '28px',
      }
    },
  },
  plugins: [],
}
