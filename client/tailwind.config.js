/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cafe: {
          oscuro: '#3B1F0E',
          medio:  '#6B3A2A',
          claro:  '#C4956A',
        },
        crema: {
          DEFAULT: '#F5ECD7',
          oscura:  '#E8D5B0',
        },
        verde: {
          pistache: '#A8B89A',
          bosque:   '#2D5016',
          marino:   '#1B3A2D',
        },
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        lato:     ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
