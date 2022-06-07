const { defineConfig } = require('cypress')

module.exports = defineConfig({
  chromeWebSecurity: false,
  viewportWidth: 1480,
  viewportHeight: 768,
  video: false,
  blockHosts: ['*.sentry.io', 'www.google-analytics.com'],
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:3000',
  },
  component: {
    setupNodeEvents(on, config) {},
    specPattern: 'src/**/*.spec.js',
  },
})
