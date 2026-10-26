import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { applySeo } from './src/seo.ts'

export default defineConfig({
  plugins: [
    react(), tailwindcss(),
    { name: 'institutional-seo', transformIndexHtml: { order: 'pre', handler: applySeo } },
  ],
})
