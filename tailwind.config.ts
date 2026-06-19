import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#050605',
        'bg-elevated': '#0a0b09',
        panel: '#0d0e0c',
        'panel-hover': '#121410',
        text: '#f2f3ef',
        'text-muted': '#8b8e84',
        accent: '#d7ff3f',
      },
      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-space-mono)', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        content: '1400px',
      },
      borderColor: {
        DEFAULT: 'rgba(255,255,255,0.10)',
        active: 'rgba(215,255,63,0.55)',
      },
    },
  },
  plugins: [],
};

export default config;
