module.exports = {
  theme: {
    extend: {},
  },
  variants: {},
  purge: [
    './src/**/*.js',
    './src/**/*.jsx'
  ],
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}