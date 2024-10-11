import { defineConfig } from 'cypress'
import vitePreprocessor from 'cypress-vite'

export default defineConfig({
  chromeWebSecurity: false,
  viewportWidth: 1480,
  viewportHeight: 768,
  video: false,
  blockHosts: ['*.sentry.io'],
  e2e: {
    experimentalRunAllSpecs: true,
    setupNodeEvents(on) {
      on('file:preprocessor', vitePreprocessor())
    },
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/index.js',
  },
  screenshotsFolder: 'cypress/screenshots',
})
