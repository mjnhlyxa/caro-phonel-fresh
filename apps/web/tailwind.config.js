/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-page': '#0d1117',
        'bg-surface': '#161b22',
        'bg-elevated': '#21262d',
        'board-bg': '#2d1f0f',
        'board-line': '#4a3728',
        'board-hover': '#3d2a16',
        'stone-black': '#1a1a1a',
        'stone-white': '#e8e8e8',
        'stone-white-border': '#888888',
        'stone-win': '#ffd700',
        'accent-primary': '#c9a227',
        'accent-secondary': '#8b6914',
        'accent-success': '#238636',
        'accent-error': '#da3633',
        'accent-warning': '#d29922',
        'text-primary': '#f0f6fc',
        'text-secondary': '#8b949e',
        'text-on-accent': '#0d1117',
        'border-default': '#30363d',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
