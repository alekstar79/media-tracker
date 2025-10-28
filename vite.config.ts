import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    target: 'esnext',    // Target modern browsers
    minify: 'esbuild',   // Use esbuild for minification (fast)
    sourcemap: true,     // Generate source maps for debugging
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
      },
    },
  },

  // Development server configuration
  server: {
    port: 3000,          // Port for development server
    open: true,          // Automatically open browser
    host: true           // Listen on all addresses
  },

  // Path resolution configuration
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/demo': resolve(__dirname, 'src/demo'),
      '@/lib': resolve(__dirname, 'src/lib'),
      '@/css': resolve(__dirname, 'src/css')
    }
  }
})
