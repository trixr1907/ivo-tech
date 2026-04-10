import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,js,jsx,mdx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '2.5rem',
        '2xl': '3rem'
      }
    },
    extend: {
      colors: {
        brand: {
          50: '#f3f7ff',
          100: '#e7eeff',
          200: '#c8d8ff',
          300: '#9fb8ff',
          400: '#6f90ff',
          500: '#4169ff',
          600: '#2d4be6',
          700: '#233bb7'
        },
        ink: {
          900: '#0e1726',
          700: '#2f3d55',
          500: '#5b6a82'
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-heading)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace']
      },
      boxShadow: {
        soft: '0 18px 46px -26px rgba(13, 23, 42, 0.34)',
        card: '0 8px 28px -18px rgba(15, 28, 64, 0.2)'
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      animation: {
        'fade-up': 'fade-up 620ms cubic-bezier(0.22, 1, 0.36, 1) both',
        shimmer: 'shimmer 3.6s linear infinite'
      }
    }
  },
  corePlugins: {
    preflight: false
  }
};

export default config;
