const plugin = require('tailwindcss/plugin')

module.exports = {
  darkMode: "class",
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      backgroundColor: ['group-focus'],
      textColor: ['group-focus']
    }
  },
  purge: [
    './src/**/*.js',
    './src/**/*.jsx'
  ],
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    plugin(function({ addBase, addComponents, theme }) {
      addBase({
        h1: {
          fontSize: theme('fontSize.6xl'),
          lineHeight: theme('lineHeight.none'),
          fontWeight: theme('fontWeight.black'),
          marginBottom: theme('margin.5')
        },
        h2: {
          fontSize: theme('fontSize.4xl'),
          lineHeight: theme('lineHeight.tight'),
          fontWeight: theme('fontWeight.bold'),
          marginBottom: theme('margin.4')
        },
        h3: {
          fontSize: theme('fontSize.lg'),
          fontWeight: theme('fontWeight.semibold'),
          marginBottom: theme('margin.3'),
          textTransform: 'uppercase',
        },
        p: {
          fontSize: theme('fontSize.lg'),
          lineHeight: theme('lineHeight.loose')
        },
        a: {
          fontWeight: theme('fontWeight.medium'),
          color: theme('colors.purple.500'),
          '&:hover': {
            color: theme('colors.purple.400'),
          }
        },
        ol: {},
        ul: {},
        input: {
          width: theme('width.full'),
          padding: `${theme('padding.2')} ${theme('padding.3')}`,
          borderColor: theme('colors.gray.300')
        },
        section: {
          margin: `${theme('margin.10')} 0`,
        }
      })
    }),
  ],
}