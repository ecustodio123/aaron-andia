// Isolated visual fixtures. Never reads or writes Supabase; never part of the production bundle.
import { createServer as httpServer } from 'node:http'
import { createServer as viteServer } from 'vite'
const origin = 'http://127.0.0.1:5201'
Object.assign(process.env, { VITE_SUPABASE_URL: origin, VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_visual_fixture', VITE_STORE_ID: '101', VITE_STORE_VERIFIED: 'true' })
let scenario = 'populated'
let reads = 0
const rows = Array.from({ length: 15 }, (_, i) => ({
  id: `${String(i + 1).padStart(8, '0')}-1111-4111-8111-111111111111`, store_id: 101,
  title: i === 0 ? 'Estrategia contractual y gestión de controversias durante la ejecución de proyectos de infraestructura' : `Publicación de prueba ${i + 1}`,
  slug: `fixture-${i}`, summary: 'Contenido ficticio del entorno de pruebas local. Permite revisar la composición de las tarjetas y sus estados, sin consultar ni modificar la base de datos real.',
  category: i % 2 ? 'Contratación pública' : 'Arbitraje', publication_type: i === 1 ? 'article' : 'document', status: 'published', display_order: i,
  published_at: '2026-10-26T12:00:00Z',
}))
const api = httpServer(async (request, response) => {
  const url = new URL(request.url, origin)
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Headers', 'apikey, content-type, authorization')
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  if (request.method === 'OPTIONS') { response.statusCode = 204; response.end(); return }
  response.setHeader('Content-Type', 'application/json')
  response.setHeader('Cache-Control', 'no-store')
  if (url.pathname === '/scenario') { scenario = url.searchParams.get('name') ?? 'populated'; reads = 0; response.end('{}'); return }
  if (url.pathname === '/metrics') { response.end(JSON.stringify({ reads })); return }
  if (url.pathname === '/rest/v1/publications') {
    reads++
    if (scenario === 'slow') await new Promise(resolve => setTimeout(resolve, 3000))
    if (scenario === 'error') { response.statusCode = 503; response.end('{}'); return }
    const visible = scenario === 'empty' ? [] : rows.filter(row => `eq.${row.store_id}` === url.searchParams.get('store_id') && `eq.${row.status}` === url.searchParams.get('status'))
    const offset = Number(url.searchParams.get('offset') ?? 0), limit = Number(url.searchParams.get('limit') ?? 13)
    response.end(JSON.stringify(visible.slice(offset, offset + limit))); return
  }
  if (url.pathname.startsWith('/api/publications/')) { response.statusCode = 503; response.end('{}'); return }
  response.statusCode = 404; response.end('{}')
})
api.listen(5201, '127.0.0.1')
const app = await viteServer({ mode: 'test', server: { host: '127.0.0.1', port: 5190, strictPort: true, proxy: { '/api': origin } } })
await app.listen()
console.log('Isolated publication fixture UI: http://127.0.0.1:5190/#publicaciones')
const close = async () => { api.close(); await app.close(); process.exit(0) }
process.on('SIGINT', close); process.on('SIGTERM', close)
