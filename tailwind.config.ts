import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#101c26', soft: '#2b3a47', mute: '#5d6b77' },
        steel: { 50: '#f5f7f8', 100: '#eceff1', 200: '#dde2e6', 300: '#c6cdd3' },
        accent: { DEFAULT: '#0a5bd8', dark: '#0847a8', tint: '#e8f0fd' },
        ok: '#1d7a4f',
        warn: '#b4580c',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Arial Narrow', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      maxWidth: { site: '1240px' },
    },
  },
  plugins: [],
};

export default config;
