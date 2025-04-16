// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html"
    ],
    theme: {
      extend: {
        colors: {
          green: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
          },
        },
        fontFamily: {
          sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        },
        spacing: {
          '72': '18rem',
          '84': '21rem',
          '96': '24rem',
          '128': '32rem',
        },
        boxShadow: {
          'outline-green': '0 0 0 3px rgba(34, 197, 94, 0.45)',
        },
        maxWidth: {
          '8xl': '88rem',
          '9xl': '96rem',
        },
        borderRadius: {
          'xl': '1rem',
          '2xl': '1.5rem',
          '3xl': '2rem',
        },
        zIndex: {
          '60': '60',
          '70': '70',
          '80': '80',
          '90': '90',
          '100': '100',
        },
        transitionProperty: {
          'height': 'height',
          'spacing': 'margin, padding',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          slideUpIn: {
            '0%': { 
              opacity: '0',
              transform: 'translateY(10px)' 
            },
            '100%': { 
              opacity: '1',
              transform: 'translateY(0)' 
            },
          },
          slideInRight: {
            '0%': { transform: 'translateX(100%)' },
            '100%': { transform: 'translateX(0)' },
          },
          slideInLeft: {
            '0%': { transform: 'translateX(-100%)' },
            '100%': { transform: 'translateX(0)' },
          },
          pulse: {
            '0%, 100%': {
              opacity: '1',
            },
            '50%': {
              opacity: '0.5',
            },
          },
        },
        animation: {
          'fade-in': 'fadeIn 0.5s ease-out',
          'slide-up': 'slideUpIn 0.3s ease-out',
          'slide-right': 'slideInRight 0.3s ease-out',
          'slide-left': 'slideInLeft 0.3s ease-out',
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
      require('@tailwindcss/typography'),
      require('@tailwindcss/aspect-ratio'),
      require('@tailwindcss/line-clamp'),
    ],
  };