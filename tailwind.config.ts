import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#151816', soft: '#353b37', mute: '#5e6660' },
        steel: { 50: '#f4f5f3', 100: '#eceeeb', 200: '#dce0dc', 300: '#c3c9c4' },
        accent: { DEFAULT: '#0e5a44', dark: '#0a4434', tint: '#e3eeea' },
        signal: '#f2c230',
        ok: '#1f7a4d',
        warn: '#b4580c',
      },
      borderRadius: {
        sm: '3px',
        DEFAULT: '4px',
        md: '6px',
        lg: '10px',
        xl: '14px',
        '2xl': '20px',
        '3xl': '28px',
      },
      fontFamily: {
        display: ['var(--font-sans)', 'Helvetica Neue', 'Arial', 'sans-serif'],
        sans: ['var(--font-sans)', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      maxWidth: { site: '1320px' },
      letterSpacing: { tightest: '-0.035em' },
    },
  },
  plugins: [],
};

export default config;
