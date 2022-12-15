import postcss from 'rollup-plugin-postcss'
import { defineConfig } from 'vite'
import { generateConfig } from './vite.config'

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

  config.plugins = [
    postcss({
      config: {
        path: './postcss.config.js',
      },
    }),
  ]

  return config
})
