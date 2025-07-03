import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),     
  ],
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash].[ext]',
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js'
      }
    }
  },
  server: {
    historyApiFallback: {
      disableDotRule: true,
      rewrites: [
        { from: /\/.*/, to: '/index.html' } // Catch-all for all routes
      ]
    }
  }
})
