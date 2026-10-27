import { PUBLIC_FIELDS, UUID, isPublication, readPublicConfig, supabaseJson } from '../shared/publications.ts'

type Statement = { bind(...values: (string | number)[]): Statement; first<T>(): Promise<T | null>; run(): Promise<unknown> }
export type RateDatabase = { prepare(sql: string): Statement }
export type DownloadEnv = {
  VITE_SUPABASE_URL?: string; VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  VITE_STORE_ID?: string; VITE_STORE_VERIFIED?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string; PUBLICATION_LIMITS?: RateDatabase;
}
const RATE_SQL = `INSERT INTO publication_download_limits (key, window_start, requests) VALUES (?1, ?2, 1)
ON CONFLICT(key) DO UPDATE SET window_start=excluded.window_start,
requests=CASE WHEN publication_download_limits.window_start=excluded.window_start THEN publication_download_limits.requests+1 ELSE 1 END
RETURNING requests`

export async function allowDownload(db: RateDatabase, store: string, ip: string, now = Date.now()) {
  const window = Math.floor(now / 60000)
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip))
  const hash = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('')
  for (const [key, limit] of [[`ip:${store}:${hash}`, 10], [`store:${store}`, 120]] as const) {
    const row = await db.prepare(RATE_SQL).bind(key, window).first<{ requests: number }>()
    if (!row || row.requests > limit) return false
  }
  return true
}

export function validDocumentPath(path: unknown, store: string, publication: string): path is string {
  if (typeof path !== 'string') return false
  const parts = path.split('/')
  return parts.length === 4 && new RegExp(`^${store}-[a-z0-9]+(?:-[a-z0-9]+)*$`).test(parts[0]) && parts[1] === 'publications' && parts[2].startsWith(`${publication.toLowerCase()}-`) && /^[0-9a-f-]{36}-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(parts[2]) && /^documento-[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}\.pdf$/.test(parts[3])
}

const headers = { 'Cache-Control': 'no-store, private', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' }
const reply = (status: number, message: string) => Response.json({ error: message }, { status, headers: status === 429 ? { ...headers, 'Retry-After': '60' } : headers })
const unavailable = () => reply(404, 'El documento no está disponible.')
function privilegedKey(key: string) {
  if (key.startsWith('sb_secret_')) return true
  try { return JSON.parse(atob(key.split('.')[1].replaceAll('-', '+').replaceAll('_', '/'))).role === 'service_role' } catch { return false }
}

export async function handlePublicationDownload(request: Request, id: string, env: DownloadEnv, transport: typeof fetch = fetch, waitUntil: (task: Promise<unknown>) => void = () => {}) {
  if (request.method !== 'POST') return reply(405, 'Método no permitido.')
  if (!UUID.test(id)) return unavailable()
  const origin = request.headers.get('Origin')
  if ((origin && origin !== new URL(request.url).origin) || request.headers.get('Sec-Fetch-Site') === 'cross-site') return reply(403, 'Solicitud no permitida.')
  try {
    const config = readPublicConfig({ VITE_SUPABASE_URL: env.VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY: env.VITE_SUPABASE_PUBLISHABLE_KEY, VITE_STORE_ID: env.VITE_STORE_ID, VITE_STORE_VERIFIED: env.VITE_STORE_VERIFIED })
    const secret = env.SUPABASE_SERVICE_ROLE_KEY
    if (!secret || !privilegedKey(secret) || !env.PUBLICATION_LIMITS) return reply(503, 'La descarga no está disponible en este momento.')
    if (!await allowDownload(env.PUBLICATION_LIMITS, config.storeId, request.headers.get('CF-Connecting-IP') ?? 'unknown')) return reply(429, 'Demasiadas solicitudes. Inténtalo en un minuto.')
    waitUntil(env.PUBLICATION_LIMITS.prepare('DELETE FROM publication_download_limits WHERE window_start < ?1').bind(Math.floor(Date.now() / 60000) - 1440).run().catch(() => {}))
    const signal = AbortSignal.any([request.signal, AbortSignal.timeout(12000)])
    const query = { id: `eq.${id}`, store_id: `eq.${config.storeId}`, status: 'eq.published', limit: '1' }
    // First require the same anonymous RLS visibility as the website, without privileged credentials.
    const visible = await supabaseJson(config, '/rest/v1/publications', { ...query, select: PUBLIC_FIELDS }, { signal }, transport)
    if (!Array.isArray(visible) || visible.length !== 1 || !isPublication(visible[0], config.storeId) || visible[0].id.toLowerCase() !== id.toLowerCase() || visible[0].publication_type !== 'document') return unavailable()
    const features = await supabaseJson(config, '/rest/v1/store_features', { store_id: `eq.${config.storeId}`, select: 'publications_enabled', limit: '1' }, { signal }, transport, secret)
    if (!Array.isArray(features) || features.length !== 1 || features[0].publications_enabled !== true) return unavailable()
    const records = await supabaseJson(config, '/rest/v1/publications', { ...query, select: 'id,store_id,status,publication_type,pdf_storage_path,pdf_original_name' }, { signal }, transport, secret)
    const row = Array.isArray(records) && records.length === 1 ? records[0] : null
    if (!row || row.id !== visible[0].id || String(row.store_id) !== config.storeId || row.status !== 'published' || row.publication_type !== 'document' || !validDocumentPath(row.pdf_storage_path, config.storeId, row.id)) return unavailable()
    const path = row.pdf_storage_path.split('/').map(encodeURIComponent).join('/')
    const result = await supabaseJson(config, `/storage/v1/object/sign/publication-files/${path}`, {}, { method: 'POST', signal, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ expiresIn: 60 }) }, transport, secret) as { signedURL?: string }
    if (typeof result.signedURL !== 'string') throw new Error('Signing unavailable')
    const signed = new URL(result.signedURL.startsWith('/object/') ? `/storage/v1${result.signedURL}` : result.signedURL, config.url)
    if (signed.origin !== config.url || signed.pathname !== `/storage/v1/object/sign/publication-files/${path}` || !signed.searchParams.get('token')) throw new Error('Invalid signed URL')
    const filename = typeof row.pdf_original_name === 'string' ? [...row.pdf_original_name].filter(character => character.charCodeAt(0) >= 32 && character.charCodeAt(0) !== 127 && !'/\\"<>'.includes(character)).join('').slice(0, 150) : ''
    signed.searchParams.set('download', filename.toLowerCase().endsWith('.pdf') ? filename : 'publicacion.pdf')
    return Response.json({ url: signed.href, expiresIn: 60 }, { headers })
  } catch { return reply(503, 'No pudimos preparar la descarga. Inténtalo nuevamente.') }
}
