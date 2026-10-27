import { listPublished, readPublicConfig } from '../../shared/publications.ts'
export type { Publication } from '../../shared/publications.ts'
export type PublicationsPage = Awaited<ReturnType<typeof listPublished>>
const requests = new Map<string, Promise<PublicationsPage>>()
const cache = new Map<string, { expires: number; data: PublicationsPage }>()

export function getPublishedPage(page = 0, reload = false): Promise<PublicationsPage> {
  const config = readPublicConfig(import.meta.env)
  const key = `${config.url}:${config.storeId}:${page}`
  const active = requests.get(key)
  if (active) return active
  const cached = cache.get(key)
  if (!reload && cached && cached.expires > Date.now()) return Promise.resolve(cached.data)
  const task = listPublished(config, page).then(data => {
    if (cache.size > 50) cache.clear()
    cache.set(key, { data, expires: Date.now() + 5000 })
    return data
  }).finally(() => requests.delete(key))
  requests.set(key, task)
  return task
}

export class DownloadError extends Error {}

export async function getDownloadUrl(id: string) {
  const config = readPublicConfig(import.meta.env)
  const response = await fetch(`/api/publications/${encodeURIComponent(id)}/download`, { method: 'POST', cache: 'no-store', signal: AbortSignal.timeout(15000) })
  if (!response.ok) throw new DownloadError(response.status === 429 ? 'Demasiadas solicitudes. Espera un minuto y vuelve a intentarlo.' : 'No pudimos descargar el PDF. Inténtalo nuevamente en unos momentos.')
  const data = await response.json()
  const url = new URL(data.url)
  if (url.origin !== config.url || !url.pathname.startsWith('/storage/v1/object/sign/publication-files/') || !url.searchParams.get('token')) throw new DownloadError('El enlace de descarga no está disponible.')
  return url.href
}
