import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
    open: true,
    proxy: {
      '/api': {
        target: 'https://gig-onapi.sarath-s2022cse.workers.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  base: 'https://gig-on.pages.dev',
  plugins: [react()],
})
