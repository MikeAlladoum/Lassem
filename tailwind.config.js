/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // NEUTRAL - Grayscale
        'neutral': {
          '50': '#f9fafb',
          '100': '#f3f4f6',
          '200': '#e5e7eb',
          '300': '#d1d5db',
          '400': '#9ca3af',
          '500': '#6b7280',
          '600': '#4b5563',
          '700': '#374151',
          '800': '#1f2937',
          '900': '#111827',
          '950': '#030712',
        },

        // PRIMARY - Cyan to Blue
        'primary': {
          '50': '#f0f9ff',
          '100': '#e0f2fe',
          '200': '#bae6fd',
          '300': '#7dd3fc',
          '400': '#38bdf8',
          '500': '#0ea5e9',
          '600': '#0284c7',
          '700': '#0369a1',
          '900': '#082f49',
        },

        // ACCENT - Gold
        'accent': {
          '400': '#fbbf24',
          '500': '#f59e0b',
          '600': '#d97706',
        },

        // STATUS COLORS
        'success': {
          '50': '#f0fdf4',
          '500': '#22c55e',
          '600': '#16a34a',
          '700': '#15803d',
        },

        'warning': {
          '50': '#fffbeb',
          '500': '#f59e0b',
          '600': '#d97706',
        },

        'danger': {
          '50': '#fef2f2',
          '500': '#ef4444',
          '600': '#dc2626',
          '700': '#b91c1c',
        },
      },

      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
        'gradient-accent': 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)',
        'gradient-success': 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1a2043 0%, #0a0e27 100%)',
      },

      boxShadow: {
        'glow': '0 0 20px rgba(15, 165, 233, 0.3)',
        'glow-lg': '0 0 40px rgba(15, 165, 233, 0.4)',
        'glow-accent': '0 0 20px rgba(245, 158, 11, 0.3)',
      },

      fontFamily: {
        'sans': ['-apple-system', 'BlinkMacSystemFont', '"Inter"', 'sans-serif'],
        'mono': ['"Fira Code"', 'monospace'],
      },

      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
