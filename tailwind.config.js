const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        re: {
          blue: {
            50: '#F3F6FD',
            100: '#D2DFFB',
            200: '#A2BEF7',
            300: '#5D8EF1',
            400: '#2E6EEE',
            500: '#1254D8',
            600: '#104CC2',
            700: '#0E3FA2',
            800: '#0B3282',
            900: '#09296A',
          },
          green: {
            50: '#EAF6F4',
            100: '#D7F4EE',
            200: '#C2EEE5',
            300: '#ACE8DC',
            400: '#60CBB6',
            500: '#2EA78F',
            600: '#299681',
            700: '#237D6B',
            800: '#1C6456',
            900: '#175246',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        maax: ['Maax', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')({ strategy: 'base' }), require('@tailwindcss/line-clamp')],
}
