import { generateConfig } from './vite.config'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  const config = generateConfig({ mode })

  config.preview = {
    port: 3000,
  }

  config.build = {
    watch: {},
    target: 'esnext',
    minify: false,
    rollupOptions: { ...config.build.rollupOptions, treeshake: false },
    outDir: './dist-rollup/',
  }

  return config
})
