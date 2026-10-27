import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { isPublicSupabaseKey } from './shared/publications.ts'
import { applySeo } from './src/seo.ts'

export default defineConfig({
  plugins: [
    react(), tailwindcss(),
    { name: 'public-environment-guard', configResolved(config) {
      for (const [name, value] of Object.entries(config.env)) {
        if (!name.startsWith('VITE_') || typeof value !== 'string' || !value) continue
        const jwt = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value)
        if (/SECRET|SERVICE_ROLE/i.test(name) || value.startsWith('sb_secret_') || (jwt && !isPublicSupabaseKey(value)) || (name === 'VITE_SUPABASE_PUBLISHABLE_KEY' && !isPublicSupabaseKey(value))) {
          throw new Error('Configuración insegura: las variables VITE_ solo pueden contener credenciales públicas. Build cancelado sin exponer valores.')
        }
      }
    } },
    { name: 'institutional-seo', transformIndexHtml: { order: 'pre', handler: applySeo } },
  ],
})
