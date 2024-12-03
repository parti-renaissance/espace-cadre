import { defineConfig, splitVendorChunkPlugin } from 'vite'
import EnvironmentPlugin from 'vite-plugin-environment'
import VitePluginHtmlEnv from 'vite-plugin-html-env'
import react from '@vitejs/plugin-react-swc'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import path from 'path'
import svgr from 'vite-plugin-svgr'

export const generateConfig: Parameters<typeof defineConfig>[0] = ({ mode }) => ({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src/'),
    },
  },
  plugins: [
    react(),
    svgr(),
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
          env: process.env.APP_ENV || 'production',
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
    rollupOptions: {
      onLog(level, log, handler) {
        if (log.cause instanceof Error && log.cause.message === "Can't resolve original location of error.") {
          return
        }
        handler(level, log)
      },
    },
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    dir: 'src',
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
})

export default defineConfig(generateConfig)
