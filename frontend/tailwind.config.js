/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        container: '1200px',
      },
      colors: {
        // Royal-blue brand — Paradigm-inspired (#235D94 family)
        orange: {
          50: '#eaf4fb',
          100: '#d9eaf6',
          200: '#a5c7e0',
          300: '#7ec8f2',
          400: '#539ac1',
          500: '#235d94',
          600: '#1d4f7e',
          700: '#0d4669',
          800: '#033051',
          900: '#021b30',
          950: '#010c17',
        },
        // Sky-blue accent (#539AC1 family)
        amber: {
          50: '#eaf4fb',
          100: '#d9eaf6',
          200: '#a5c7e0',
          300: '#7ec8f2',
          400: '#539ac1',
          500: '#235d94',
          600: '#1d4f7e',
          700: '#0d4669',
        },
        // Danger / semantic rose
        rose: {
          100: '#ffd4d4',
          200: '#ffb3b3',
          300: '#ff6b6b',
          400: '#f4544f',
          500: '#c0392b',
          600: '#8a1f1a',
          700: '#5c1512',
        },
      },
      boxShadow: {
        glow: '0 0 40px rgba(35, 93, 148, 0.45)',
        gold: '0 0 40px rgba(83, 154, 193, 0.35)',
      },
    },
  },
  plugins: [],
}
