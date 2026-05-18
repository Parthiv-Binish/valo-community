import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/kick-api': {
        target: 'https://kick.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/kick-api/, ''),
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        }
      }
    }
  }
})
