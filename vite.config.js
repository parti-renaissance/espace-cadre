import { defineConfig } from 'vite'
import EnvironmentPlugin from 'vite-plugin-environment'
import VitePluginHtmlEnv from 'vite-plugin-html-env'
import react from '@vitejs/plugin-react'

const path = require('path')

export default defineConfig({
  plugins: [
    react(),
    VitePluginHtmlEnv(),
    EnvironmentPlugin([
      'NODE_ENV',
      'REACT_APP_API_HOST',
      'REACT_APP_OAUTH_HOST',
      'REACT_APP_OAUTH_CLIENT_ID',
      'REACT_APP_INTERNAL_APP_ID',
      'REACT_APP_UNLAYER_PROJECT_ID',
      'REACT_APP_MAPBOX_TOKEN',
      'REACT_APP_MAPBOX_STYLE',
    ]),
  ],
  resolve: {
    alias: {
      api: path.resolve(__dirname, 'src/api'),
      components: path.resolve(__dirname, 'src/components'),
      domain: path.resolve(__dirname, 'src/domain'),
      providers: path.resolve(__dirname, 'src/providers'),
      assets: path.resolve(__dirname, 'src/assets'),
      services: path.resolve(__dirname, 'src/services'),
      style: path.resolve(__dirname, 'src/style'),
      shared: path.resolve(__dirname, 'src/shared'),
      ui: path.resolve(__dirname, 'src/ui'),
    },
  },
  server: {
    open: '/',
  },
  build: {
    outDir: 'build',
  },
})
