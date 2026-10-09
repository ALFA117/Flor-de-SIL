/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Tokens semánticos (cambian con el tema claro/oscuro, ver index.css)
        bg:        token('bg'),
        surface:   token('surface'),
        surface2:  token('surface-2'),
        line:      token('line'),
        ink:       token('ink'),
        muted:     token('muted'),
        accent:    token('accent'),
        leaf:      token('leaf'),
        rose:      token('rose'),
        cta:       token('cta'),
        'on-cta':  token('on-cta'),
        // Colores de marca fijos (los usa el panel de administración)
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
        display:  ['Fraunces', 'Georgia', 'serif'],
        sans:     ['Figtree', 'system-ui', 'sans-serif'],
        mono:     ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        // Alias heredados: el admin usa font-playfair / font-lato
        playfair: ['Fraunces', 'Georgia', 'serif'],
        lato:     ['Figtree', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        petal: '28px 28px 28px 8px',
      },
      boxShadow: {
        soft: '0 1px 2px rgb(var(--shadow) / 0.10), 0 8px 24px -8px rgb(var(--shadow) / 0.25)',
        lift: '0 2px 4px rgb(var(--shadow) / 0.12), 0 24px 48px -16px rgb(var(--shadow) / 0.40)',
      },
    },
  },
  plugins: [],
}
