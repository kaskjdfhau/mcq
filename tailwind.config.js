/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
      },
      backgroundColor: {
        'theme-bg': 'var(--color-background)',
      },
      textColor: {
        'theme-text': 'var(--color-text)',
      },
    },
  },
  plugins: [],
};