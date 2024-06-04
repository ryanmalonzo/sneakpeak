/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // PrimeVue
        primary: 'rgb(var(--primary))',
        'primary-inverse': 'rgb(var(--primary-inverse))',
        'primary-hover': 'rgb(var(--primary-hover))',
        'primary-active-color': 'rgb(var(--primary-active-color))',

        'primary-highlight': 'rgb(var(--primary)/var(--primary-highlight-opacity))',
        'primary-highlight-inverse': 'rgb(var(--primary-highlight-inverse))',
        'primary-highlight-hover': 'rgb(var(--primary)/var(--primary-highlight-hover-opacity))',

        'primary-50': 'rgb(var(--primary-50))',
        'primary-100': 'rgb(var(--primary-100))',
        'primary-200': 'rgb(var(--primary-200))',
        'primary-300': 'rgb(var(--primary-300))',
        'primary-400': 'rgb(var(--primary-400))',
        'primary-500': 'rgb(var(--primary-500))',
        'primary-600': 'rgb(var(--primary-600))',
        'primary-700': 'rgb(var(--primary-700))',
        'primary-800': 'rgb(var(--primary-800))',
        'primary-900': 'rgb(var(--primary-900))',
        'primary-950': 'rgb(var(--primary-950))',

        'surface-0': 'rgb(var(--surface-0))',
        'surface-50': 'rgb(var(--surface-50))',
        'surface-100': 'rgb(var(--surface-100))',
        'surface-200': 'rgb(var(--surface-200))',
        'surface-300': 'rgb(var(--surface-300))',
        'surface-400': 'rgb(var(--surface-400))',
        'surface-500': 'rgb(var(--surface-500))',
        'surface-600': 'rgb(var(--surface-600))',
        'surface-700': 'rgb(var(--surface-700))',
        'surface-800': 'rgb(var(--surface-800))',
        'surface-900': 'rgb(var(--surface-900))',
        'surface-950': 'rgb(var(--surface-950))',

        // Custom
        black: '#121212',
        'sneakpeak-gray': {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#737373',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#3d3d3d',
          950: '#262626'
        }
      },
      spacing: {
        '5px': '5px',
        '30px': '30px',
        '50px': '50px',
        '70px': '70px'
      }
    },
    gridTemplateColumns: {
      'auto-fill-159px': 'repeat(auto-fill, minmax(159px, 1fr))',
      'auto-fill-264px': 'repeat(auto-fill, minmax(264px, 1fr))'
    }
  },
  plugins: []
}
