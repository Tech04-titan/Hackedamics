/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0f172a',
          card: '#1e293b',
          hover: '#334155',
          border: '#475569',
        },
        primary: {
          DEFAULT: '#6366f1',
          hover: '#4f46e5',
          light: '#818cf8',
        },
        secondary: {
          DEFAULT: '#8b5cf6',
          hover: '#7c3aed',
          light: '#a78bfa',
        },
        accent: {
          DEFAULT: '#06b6d4',
          hover: '#0891b2',
          light: '#22d3ee',
        },
        success: {
          DEFAULT: '#10b981',
          hover: '#059669',
          light: '#34d399',
        },
        warning: {
          DEFAULT: '#f59e0b',
          hover: '#d97706',
          light: '#fbbf24',
        },
        danger: {
          DEFAULT: '#ef4444',
          hover: '#dc2626',
          light: '#f87171',
        },
      },
    },
  },
  plugins: [],
}

