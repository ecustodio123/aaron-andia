import { handlePublicationDownload } from '../../../../server/publication-download.ts'
import type { DownloadEnv } from '../../../../server/publication-download.ts'

type Context = { request: Request; params: Record<string, string | string[]>; env: DownloadEnv; waitUntil(task: Promise<unknown>): void }
export const onRequest = (context: Context) => handlePublicationDownload(context.request, typeof context.params.id === 'string' ? context.params.id : '', context.env, fetch, task => context.waitUntil(task))
