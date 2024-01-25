import { defineConfig, splitVendorChunkPlugin } from 'vite'
import EnvironmentPlugin from 'vite-plugin-environment'
import VitePluginHtmlEnv from 'vite-plugin-html-env'
import react from '@vitejs/plugin-react-swc'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import path from 'path'

export const generateConfig: Parameters<typeof defineConfig>[0] = ({ mode })=> {
  return {
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
        src: path.resolve(__dirname, 'src/'),
      },
    },
    plugins: [
      react(),
      VitePluginHtmlEnv({
        envPrefixes: ['REACT_APP_'],
      }),
      EnvironmentPlugin('all', { prefix: 'REACT_APP_' }),
      splitVendorChunkPlugin(),
      sentryVitePlugin({
        disable: mode !== 'production',
        org: process.env.SENTRY_ORG,
        telemetry: false,
        sourcemaps: {
          assets: 'build/assets/**',
          filesToDeleteAfterUpload: 'build/assets/*.js.map',
        },
        release: {
          deploy: {
            env: process.env.APP_ENV,
          },
        },
      }),
    ],
    server: {
      open: true,
      port: 3000,
    },
    build: {
      outDir: 'build',
      sourcemap: mode === 'production' ? 'hidden' : true,
    },
    esbuild: {
      logOverride: { 'this-is-undefined-in-esm': 'silent' },
    },
  }
}


export default defineConfig(generateConfig)
