const path = require('path')
const { startDevServer } = require('@cypress/vite-dev-server')

module.exports = (on, config) => {
  const viteConfig = { configFile: path.resolve(__dirname, '..', '..', 'vite.config.js') }

  on('dev-server:start', options => startDevServer({ options, viteConfig }))
  return config
}
