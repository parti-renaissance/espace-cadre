const { defineConfig } = require('cypress')
const path = require('path')
const { startDevServer } = require('@cypress/vite-dev-server')

module.exports = defineConfig({
  chromeWebSecurity: false,
  viewportWidth: 1480,
  viewportHeight: 768,
  video: false,
  blockHosts: ['*.sentry.io', '*.abla.io'],
  e2e: {
    setupNodeEvents(on, config) {
      const viteConfig = { configFile: path.resolve(__dirname, '..', '..', 'vite.config.js') }

      on('dev-server:start', options => startDevServer({ options, viteConfig }))
      return config
    },
    baseUrl: 'http://localhost:3000',
    supportFile: false,
  },
  screenshotsFolder: 'cypress/screenshots',
  component: {
    specPattern: 'src/**/*.cy.js',
  },
})
