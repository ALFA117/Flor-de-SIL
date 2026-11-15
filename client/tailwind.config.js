/** @type {import('tailwindcss').Config} */
// Paleta «Herbario»: papel marfil, tinta verde bosque y un solo acento (barro/terracota
// tomado del café del logo). Los nombres antiguos (cafe/crema/verde) se conservan y se
// remapean para que el panel de administración herede el nuevo sistema sin reescribirse.
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Tokens nuevos (sitio público)
        papel: { DEFAULT: '#F6F2EA', hondo: '#EEE8DC', claro: '#FBF9F5' },
        tinta: { DEFAULT: '#1F2A24', suave: '#4A5850', tenue: '#6B7770' },
        bosque: { DEFAULT: '#2F4A3A', hondo: '#22372B', noche: '#18241D' },
        barro: { DEFAULT: '#9A4F36', hondo: '#7E3E29', claro: '#F3E4DC' },
        linea: { DEFAULT: '#DDD5C7', fuerte: '#C9BFAE' },

        // Nombres heredados → nuevo sistema
        cafe: {
          oscuro: '#1F2A24',
          medio: '#4A5850',
          claro: '#9A4F36',
        },
        crema: {
          DEFAULT: '#F6F2EA',
          oscura: '#E4DDD0',
        },
        verde: {
          pistache: '#B9C7B3',
          bosque: '#2F4A3A',
          marino: '#22372B',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
        // alias heredados
        playfair: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        lato: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        hoja: '0 1px 0 rgba(31,42,36,0.04), 0 8px 24px -12px rgba(31,42,36,0.18)',
        marco: '4px 4px 0 0 #1F2A24',
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
      },
    },
  },
  plugins: [],
}
