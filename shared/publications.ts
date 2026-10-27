export type PublicConfig = { url: string; key: string; storeId: string }
export type Publication = {
  id: string; store_id: number | string; title: string; slug: string; summary: string | null;
  category: string | null; publication_type: 'document' | 'article'; status: 'published';
  display_order: number; published_at: string | null;
}
export const PUBLIC_FIELDS = 'id,store_id,title,slug,summary,category,publication_type,status,display_order,published_at'
export const PAGE_SIZE = 12
export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isPublicSupabaseKey(key: string) {
  if (key.startsWith('sb_publishable_')) return true
  if (key.split('.').length !== 3) return false
  try { return JSON.parse(atob(key.split('.')[1].replaceAll('-', '+').replaceAll('_', '/'))).role === 'anon' } catch { return false }
}

export function readPublicConfig(env: Record<string, string | undefined>): PublicConfig {
  const url = new URL(env.VITE_SUPABASE_URL ?? '')
  const local = ['localhost', '127.0.0.1'].includes(url.hostname)
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY ?? ''
  const storeId = env.VITE_STORE_ID ?? ''
  if ((!local && url.protocol !== 'https:') || (local && !['http:', 'https:'].includes(url.protocol)) || url.username || url.password || !isPublicSupabaseKey(key) || !/^[1-9]\d{0,18}$/.test(storeId) || BigInt(storeId) > 9223372036854775807n || env.VITE_STORE_VERIFIED !== 'true') throw new Error('Publications configuration unavailable')
  return { url: url.origin, key, storeId }
}

export async function supabaseJson(config: PublicConfig, path: string, query: Record<string, string>, init: RequestInit = {}, transport: typeof fetch = fetch, key = config.key): Promise<unknown> {
  const url = new URL(path, config.url)
  url.search = new URLSearchParams(query).toString()
  const headers = new Headers(init.headers)
  headers.set('apikey', key)
  // Legacy JWT service keys need Authorization; publishable/secret keys use apikey.
  if (key.split('.').length === 3) headers.set('Authorization', `Bearer ${key}`)
  const response = await transport(url, { ...init, headers, cache: 'no-store', signal: init.signal ? AbortSignal.any([init.signal, AbortSignal.timeout(10000)]) : AbortSignal.timeout(10000) })
  if (!response.ok) throw new Error('Publications request failed')
  return response.json()
}

export function isPublication(value: unknown, storeId: string): value is Publication {
  if (!value || typeof value !== 'object') return false
  const row = value as Publication
  return typeof row.id === 'string' && UUID.test(row.id) && String(row.store_id) === storeId && row.status === 'published' && ['document', 'article'].includes(row.publication_type) && typeof row.title === 'string' && row.title.length > 0 && typeof row.slug === 'string' && (row.summary === null || typeof row.summary === 'string') && (row.category === null || typeof row.category === 'string') && Number.isInteger(row.display_order) && (row.published_at === null || typeof row.published_at === 'string')
}

export async function listPublished(config: PublicConfig, page: number, transport: typeof fetch = fetch) {
  if (!Number.isInteger(page) || page < 0 || page > 10000) throw new Error('Invalid page')
  const rows = await supabaseJson(config, '/rest/v1/publications', {
    select: PUBLIC_FIELDS, store_id: `eq.${config.storeId}`, status: 'eq.published',
    order: 'display_order.asc,published_at.desc.nullslast,id.asc', limit: String(PAGE_SIZE + 1), offset: String(page * PAGE_SIZE),
  }, {}, transport)
  if (!Array.isArray(rows) || !rows.every(row => isPublication(row, config.storeId))) throw new Error('Invalid publications response')
  return { items: rows.slice(0, PAGE_SIZE) as Publication[], hasMore: rows.length > PAGE_SIZE }
}
