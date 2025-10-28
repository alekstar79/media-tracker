import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  publicDir: false,
  plugins: [
    dts({
      include: ['src/lib'],
      outDir: 'dist-lib',
      insertTypesEntry: true
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib/index.ts'),
      name: 'MediaTracker',
      fileName: (format) => `media-tracker.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
    emptyOutDir: true,
    outDir: 'dist-lib',
  }
})
