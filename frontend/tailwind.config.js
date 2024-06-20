/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
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
      },
      gridTemplateColumns: {
        'auto-fill-159px': 'repeat(auto-fill, minmax(159px, 1fr))',
        'auto-fill-264px': 'repeat(auto-fill, minmax(264px, 1fr))'
      }
    }
  },
  plugins: []
}
