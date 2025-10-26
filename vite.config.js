import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ⚙️ Configuración correcta para Vercel:
export default defineConfig({
  plugins: [react()],
  base: './', // 👈 rutas relativas (evita error MIME)
  build: {
    outDir: 'dist',
  },
})
