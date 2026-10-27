import assert from 'node:assert/strict'
import { readFile, access } from 'node:fs/promises'

const html = await readFile('dist/index.html', 'utf8')
const origin = 'https://www.andiaespinoza.com/'
const head = html.split('</head>')[0]
const checks = []
function check(name, callback) { callback(); checks.push(name) }
function meta(key) {
  return head.match(new RegExp(`<meta (?:name|property)="${key}" content="([^"]*)"`))?.[1]
}
check('Dominio y metadatos', () => {
  assert.match(html, /<html lang="es-PE">/)
  assert.equal((head.match(/<title>/g) ?? []).length, 1)
  assert.match(head, /<title>Aarón Andía.*Perú<\/title>/)
  assert.equal((head.match(/name="description"/g) ?? []).length, 1)
  assert.ok(meta('description')?.length > 100)
  assert.equal((head.match(/rel="canonical"/g) ?? []).length, 1)
  assert.ok(head.includes(`rel="canonical" href="${origin}"`))
  assert.equal(meta('og:url'), origin)
  assert.equal(meta('og:image'), `${origin}images/aaron-andia-social.png`)
  assert.equal(meta('twitter:image'), meta('og:image'))
  assert.equal(meta('og:title'), meta('twitter:title'))
  assert.ok(meta('og:image:alt'))
  assert.ok(!meta('robots')?.includes('noindex'))
  assert.ok(!/__SEO_|aaron-andia\.pages\.dev/.test(html))
})
check('Contenido prerenderizado y accesible', () => {
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1)
  for (const id of ['inicio', 'sobre-mi', 'areas-de-practica', 'experiencia', 'publicaciones', 'contacto']) assert.ok(html.includes(`id="${id}"`), id)
  for (const phrase of ['AARÓN ANDÍA', 'Arbitraje', 'Contratación pública', 'Dispute Boards', 'Lima, Perú', 'Formación']) assert.ok(html.includes(phrase), phrase)
  assert.ok(html.includes('<details'))
  for (const img of html.matchAll(/<img\b[^>]*>/g)) assert.match(img[0], /\balt="[^"]*"/)
  assert.ok(html.includes('data-nosnippet'))
  assert.ok(html.includes('<noscript>'))
})
check('Datos estructurados coherentes', () => {
  const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]
  assert.ok(json)
  const data = JSON.parse(json)
  assert.equal(data['@context'], 'https://schema.org')
  const ids = data['@graph'].map(node => node['@id'])
  assert.equal(new Set(ids).size, ids.length)
  for (const node of data['@graph']) assert.ok(node['@id'].startsWith(origin))
  function references(value) {
    if (!value || typeof value !== 'object') return
    if (value['@id']) assert.ok(ids.includes(value['@id']), value['@id'])
    for (const child of Object.values(value)) references(child)
  }
  references(data)
  assert.equal(data['@graph'].filter(node => node['@type'] === 'Service').length, 3)
  assert.ok(!json.includes('aaron@andiaespinoza.com'))
  assert.ok(!json.includes('aggregateRating'))
})
const robots = await readFile('dist/robots.txt', 'utf8')
const sitemap = await readFile('dist/sitemap.xml', 'utf8')
const notFound = await readFile('dist/404.html', 'utf8')
// Validate files linked by the page, social metadata, JSON-LD and the error page.
// Vite copies public/ verbatim; stale references can otherwise survive a successful build.
const localFiles = new Set()
function collectUrl(value) {
  if (!value.startsWith('/') && !value.startsWith(origin)) return
  if (value.startsWith('//')) return
  const url = new URL(value.replaceAll('&amp;', '&'), origin)
  if (url.origin !== new URL(origin).origin) return
  localFiles.add(url.pathname === '/' ? 'dist/index.html' : `dist${decodeURIComponent(url.pathname)}`)
}
for (const document of [html, notFound]) {
  for (const match of document.matchAll(/(?:src|href|content)="([^"<>]+)"/g)) collectUrl(match[1])
}
function collectStructuredUrls(value) {
  if (typeof value === 'string') collectUrl(value)
  else if (value && typeof value === 'object') Object.values(value).forEach(collectStructuredUrls)
}
collectStructuredUrls(JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]))
for (const path of localFiles) await access(path)
console.log(`Recursos locales: ${localFiles.size} destinos válidos (incluye PDFs y retrato SEO).`)
check('Rastreo, sitemap y página 404', () => {
  assert.match(robots, /Allow: \//)
  assert.ok(robots.includes(`Sitemap: ${origin}sitemap.xml`))
  assert.equal((sitemap.match(/<loc>/g) ?? []).length, 1)
  assert.ok(sitemap.includes(`<loc>${origin}</loc>`))
  assert.match(notFound, /noindex/)
})
console.log(`SEO local: ${checks.length} grupos de comprobaciones correctos.\n${checks.map(name => `✓ ${name}`).join('\n')}`)
