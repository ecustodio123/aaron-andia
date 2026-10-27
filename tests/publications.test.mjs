import { test } from 'node:test'
import assert from 'node:assert/strict'
import { DatabaseSync } from 'node:sqlite'
import { readFileSync } from 'node:fs'
import { listPublished, readPublicConfig, PUBLIC_FIELDS } from '../shared/publications.ts'
import { allowDownload, handlePublicationDownload, validDocumentPath } from '../server/publication-download.ts'

const id = '11111111-1111-4111-8111-111111111111'
const config = { url: 'https://supabase.example', key: 'sb_publishable_unit_fixture', storeId: '101' }
const env = { VITE_SUPABASE_URL: config.url, VITE_SUPABASE_PUBLISHABLE_KEY: config.key, VITE_STORE_ID: '101', VITE_STORE_VERIFIED: 'true', SUPABASE_SERVICE_ROLE_KEY: 'sb_secret_unit_fixture' }
const publication = (overrides = {}) => ({ id, store_id: 101, title: 'Documento de prueba', slug: 'prueba', summary: 'Resumen', category: 'Arbitraje', publication_type: 'document', status: 'published', display_order: 1, published_at: '2026-10-26T00:00:00Z', ...overrides })
const path = `101-demo/publications/${id}-prueba/documento-${id}.pdf`
function database() {
  const sqlite = new DatabaseSync(':memory:')
  sqlite.exec(readFileSync(new URL('../migrations/d1/0001_publication_download_limits.sql', import.meta.url), 'utf8'))
  return { prepare(sql) { let values = []; return { bind(...input) { values = input; return this }, async first() { return sqlite.prepare(sql).get(...values) ?? null }, async run() { return sqlite.prepare(sql).run(...values) } } } }
}
const request = (options = {}) => new Request(`https://website.example/api/publications/${id}/download`, { method: 'POST', ...options })
function backend(options = {}) {
  const calls = []
  const transport = async (input, init) => {
    const url = new URL(input); calls.push({ url, init })
    if (options.failure) return Response.json({ error: 'private internal detail' }, { status: 500 })
    if (url.pathname.endsWith('/store_features')) return Response.json([{ publications_enabled: options.enabled ?? true }])
    if (url.pathname.endsWith('/publications')) {
      assert.equal(url.searchParams.get('store_id'), 'eq.101')
      assert.equal(url.searchParams.get('status'), 'eq.published')
      if (init.headers.get('apikey') === config.key) return Response.json(options.visible ?? [publication(options.visibleOverrides)])
      return Response.json([publication({ pdf_storage_path: path, pdf_original_name: 'documento.pdf', ...options.row })])
    }
    assert.ok(url.pathname.startsWith('/storage/v1/object/sign/publication-files/'))
    assert.deepEqual(JSON.parse(init.body), { expiresIn: 60 })
    return Response.json({ signedURL: options.signedURL ?? `/object/sign/publication-files/${path}?token=unit-token` })
  }
  return { calls, transport }
}
async function download(options = {}, overrideEnv = {}, req = request()) {
  const remote = backend(options)
  const response = await handlePublicationDownload(req, id, { ...env, PUBLICATION_LIMITS: database(), ...overrideEnv }, remote.transport)
  return { response, ...remote }
}
const signCalls = calls => calls.filter(call => call.url.pathname.includes('/object/sign/'))

test('configuration uses the explicit store and rejects secret browser keys / unverified stores', () => {
  assert.deepEqual(readPublicConfig(env), config)
  assert.throws(() => readPublicConfig({ ...env, VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_secret_not_public' }))
  assert.throws(() => readPublicConfig({ ...env, VITE_STORE_ID: '' }))
  assert.throws(() => readPublicConfig({ ...env, VITE_STORE_VERIFIED: 'false' }))
  assert.throws(() => readPublicConfig({ ...env, VITE_SUPABASE_URL: 'http://outside.example' }))
})
test('public listing selects only anonymous metadata with tenant, status, stable order and pagination', async () => {
  const result = await listPublished(config, 2, async (input, init) => {
    const url = new URL(input)
    assert.equal(url.searchParams.get('select'), PUBLIC_FIELDS)
    assert.ok(!url.searchParams.get('select').includes('pdf_storage_path'))
    assert.equal(url.searchParams.get('store_id'), 'eq.101')
    assert.equal(url.searchParams.get('status'), 'eq.published')
    assert.equal(url.searchParams.get('order'), 'display_order.asc,published_at.desc.nullslast,id.asc')
    assert.equal(url.searchParams.get('offset'), '24')
    assert.equal(url.searchParams.get('limit'), '13')
    assert.equal(init.headers.get('apikey'), config.key)
    return Response.json(Array.from({ length: 13 }, (_, index) => publication({ id: `${String(index).padStart(8, '0')}-1111-4111-8111-111111111111` })))
  })
  assert.equal(result.items.length, 12); assert.equal(result.hasMore, true)
})
test('no examples are substituted for empty, unavailable or invalid responses', async () => {
  assert.deepEqual(await listPublished(config, 0, async () => Response.json([])), { items: [], hasMore: false })
  await assert.rejects(listPublished(config, 0, async () => new Response('', { status: 500 })))
  for (const override of [{ store_id: 202 }, { status: 'draft' }, { status: 'archived' }]) {
    await assert.rejects(listPublished(config, 0, async () => Response.json([publication(override)])))
  }
})
test('a newly published fixture enters the next uncached read, drafts/archives/other stores stay absent', async () => {
  const rows = [publication({ status: 'draft' }), publication({ status: 'archived' }), publication({ store_id: 202 })]
  const transport = async () => Response.json(rows.filter(row => row.store_id === 101 && row.status === 'published').sort((a, b) => a.display_order - b.display_order || String(b.published_at).localeCompare(String(a.published_at))))
  assert.equal((await listPublished(config, 0, transport)).items.length, 0)
  rows.push(publication({ display_order: 3 }), publication({ id: '22222222-2222-4222-8222-222222222222', display_order: 1 }))
  assert.deepEqual((await listPublished(config, 0, transport)).items.map(row => row.display_order), [1, 3])
})
test('published document passes anonymous RLS gate, feature gate and server validation before a 60-second signature', async () => {
  const { response, calls } = await download()
  assert.equal(response.status, 200)
  const body = await response.json(); const url = new URL(body.url)
  assert.equal(body.expiresIn, 60)
  assert.equal(url.searchParams.get('download'), 'documento.pdf')
  assert.match(response.headers.get('cache-control'), /no-store/)
  assert.equal(calls[0].init.headers.get('apikey'), config.key)
  assert.equal(signCalls(calls).length, 1)
  assert.ok(!calls.some(call => call.url.pathname.includes('/object/public/')))
})
for (const status of ['draft', 'archived']) test(`unpublished ${status} fails before signing`, async () => {
  const { response, calls } = await download({ visibleOverrides: { status } })
  assert.equal(response.status, 404); assert.equal(signCalls(calls).length, 0)
})
for (const [name, options] of Object.entries({ invisible: { visible: [] }, foreign: { visibleOverrides: { store_id: 202 } }, disabled: { enabled: false }, article: { visibleOverrides: { publication_type: 'article' } }, missingPdf: { row: { pdf_storage_path: null } }, foreignPath: { row: { pdf_storage_path: path.replace('101-demo', '202-demo') } }, changedStatus: { row: { status: 'archived' } }, changedTenant: { row: { store_id: 202 } } })) {
  test(`download rejects ${name} and never signs`, async () => {
    const { response, calls } = await download(options)
    assert.equal(response.status, 404); assert.equal(signCalls(calls).length, 0)
  })
}
test('unknown infrastructure fails closed and does not disclose internal messages', async () => {
  for (const extra of [{ SUPABASE_SERVICE_ROLE_KEY: undefined }, { PUBLICATION_LIMITS: undefined }]) {
    const { response, calls } = await download({}, extra)
    assert.equal(response.status, 503); assert.equal(calls.length, 0)
  }
  const { response } = await download({ failure: true })
  assert.equal(response.status, 503)
  assert.ok(!(await response.text()).includes('private internal detail'))
})
test('cross-origin requests and wrong methods cannot sign files', async () => {
  assert.equal((await download({}, {}, request({ method: 'GET' }))).response.status, 405)
  assert.equal((await download({}, {}, request({ headers: { Origin: 'https://outside.example' } }))).response.status, 403)
})
test('storage signatures must stay on the expected Supabase project and exact document', async () => {
  const { response } = await download({ signedURL: 'https://outside.example/?token=bad' })
  assert.equal(response.status, 503)
  assert.equal(validDocumentPath(path, '101', id), true)
  assert.equal(validDocumentPath(`../${path}`, '101', id), false)
  assert.equal(validDocumentPath(path, '202', id), false)
})
test('atomic SQLite rate limits block the 11th request, expire next minute, and cap the whole store', async () => {
  const db = database()
  for (let index = 0; index < 10; index++) assert.equal(await allowDownload(db, '101', 'ip-a', 0), true)
  assert.equal(await allowDownload(db, '101', 'ip-a', 0), false)
  assert.equal(await allowDownload(db, '101', 'ip-a', 60000), true)
  const other = database()
  for (let index = 0; index < 120; index++) assert.equal(await allowDownload(other, '101', `ip-${index}`, 0), true)
  assert.equal(await allowDownload(other, '101', 'new-ip', 0), false)
})
test('rate-limited endpoint returns Retry-After without querying Supabase', async () => {
  const db = database(); const remote = backend()
  for (let index = 0; index < 10; index++) await allowDownload(db, '101', 'unknown')
  const response = await handlePublicationDownload(request(), id, { ...env, PUBLICATION_LIMITS: db }, remote.transport)
  assert.equal(response.status, 429); assert.equal(response.headers.get('retry-after'), '60'); assert.equal(remote.calls.length, 0)
})
