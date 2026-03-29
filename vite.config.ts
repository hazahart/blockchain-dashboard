import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Expuesto a la red
    port: 5173,      // O el puerto 80/5173 que estés usando
    allowedHosts: true
  }
})