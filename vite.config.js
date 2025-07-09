import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173
  },
  // 🔁 Esto es importante para manejar rutas en producción (Vercel)
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
