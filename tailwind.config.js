// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      "./components/**/*.{js,vue,ts}",
      "./layouts/**/*.vue",
      "./pages/**/*.vue",
      "./plugins/**/*.{js,ts}",
      "./app.vue",
      "./error.vue",
  ],
  theme: {
    extend: {
      // ON AJOUTE CETTE SECTION
      typography: (theme) => ({
        DEFAULT: {
          css: {
            // Ici, on cible les paragraphes (p)
            p: {
              marginTop: theme('spacing.4'), // Marge en haut (ex: 1rem)
              marginBottom: theme('spacing.8'), // Marge en bas (ex: 2rem, soit le double de la normale)
            },
            // Vous pouvez aussi styliser d'autres éléments
            'h2, h3, h4': {
              marginTop: theme('spacing.12'), // Plus de marge avant les titres
              marginBottom: theme('spacing.4'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}