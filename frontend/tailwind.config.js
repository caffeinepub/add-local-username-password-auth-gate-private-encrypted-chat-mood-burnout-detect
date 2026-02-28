/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'oklch(var(--border) / <alpha-value>)',
        input: 'oklch(var(--input) / <alpha-value>)',
        ring: 'oklch(var(--ring) / <alpha-value>)',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        'popup-glow': {
          DEFAULT: 'oklch(0.55 0.2 270)',
          soft: 'oklch(0.55 0.2 270 / 0.5)',
        },
        // Crisis modal color tokens
        crisis: {
          warm: 'var(--crisis-warm)',
          mid: 'var(--crisis-mid)',
          cool: 'var(--crisis-cool)',
          surface: 'var(--crisis-surface)',
          highlight: 'var(--crisis-highlight)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'popup-glow': '0 0 32px oklch(0.55 0.2 270 / 0.5), 0 0 64px oklch(0.55 0.2 270 / 0.3), 0 8px 32px oklch(0 0 0 / 0.4)',
        'crisis': '0 0 40px oklch(0.65 0.22 30 / 0.4), 0 0 80px oklch(0.55 0.2 350 / 0.25), 0 16px 48px oklch(0 0 0 / 0.6)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'modal-entrance': {
          from: { opacity: '0', transform: 'scale(0.92) translateY(12px)' },
          to: { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'crisis-entrance': {
          from: { opacity: '0', transform: 'scale(0.88) translateY(20px)' },
          to: { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'modal-entrance': 'modal-entrance 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'crisis-entrance': 'crisis-entrance 0.4s cubic-bezier(0.34, 1.4, 0.64, 1) forwards',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
  ],
};
