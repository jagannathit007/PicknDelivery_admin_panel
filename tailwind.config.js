import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'outfit': ['Outfit', 'sans-serif'],
      },
      colors: {
        'brand': {
          25: 'var(--color-brand-25)',
          50: 'var(--color-brand-50)',
          100: 'var(--color-brand-100)',
          200: 'var(--color-brand-200)',
          300: 'var(--color-brand-300)',
          400: 'var(--color-brand-400)',
          500: 'var(--color-brand-500)',
          600: 'var(--color-brand-600)',
          700: 'var(--color-brand-700)',
          800: 'var(--color-brand-800)',
          900: 'var(--color-brand-900)',
          950: 'var(--color-brand-950)',
        },
        gray: {
          25: 'var(--color-gray-25)',
          50: 'var(--color-gray-50)',
          100: 'var(--color-gray-100)',
          200: 'var(--color-gray-200)',
          300: 'var(--color-gray-300)',
          400: 'var(--color-gray-400)',
          500: 'var(--color-gray-500)',
          600: 'var(--color-gray-600)',
          700: 'var(--color-gray-700)',
          800: 'var(--color-gray-800)',
          900: 'var(--color-gray-900)',
          950: 'var(--color-gray-950)',
        }
      },
      fontSize: {
        'theme-xl': ['var(--text-theme-xl)', {
          lineHeight: 'var(--text-theme-xl--line-height)',
        }],
        'theme-sm': ['var(--text-theme-sm)', {
          lineHeight: 'var(--text-theme-sm--line-height)',
        }],
        'theme-xs': ['var(--text-theme-xs)', {
          lineHeight: 'var(--text-theme-xs--line-height)',
        }],
      },
      spacing: {
        '6.5': '1.625rem',
      }
    },
  },
  plugins: [forms, typography],
}
