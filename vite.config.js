import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Forwards /api/* to the local dev server (api/dev-server.js)
      // In production (Vercel), /api/* is handled by serverless functions directly
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})