import assert from 'node:assert/strict'
import { readFile, access } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'

const required = [
  'functions/api/publications/[id]/download.ts', 'server/publication-download.ts',
  'shared/publications.ts', 'src/lib/publications.ts', 'src/components/Publications.tsx',
  'migrations/d1/0001_publication_download_limits.sql', 'public/_routes.json',
]
for (const path of required) await access(path)
const routes = JSON.parse(await readFile('dist/_routes.json', 'utf8'))
assert.equal(routes.version, 1)
assert.ok(routes.include.includes('/api/publications/*'))
assert.deepEqual(routes.exclude, [])
const names = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean)
for (const path of required) assert.ok(names.includes(path), `Required deployment file is not tracked: ${path}`)
const ignored = execFileSync('git', ['check-ignore', '.env', '.dev.vars'], { encoding: 'utf8' })
assert.ok(ignored.includes('.env') && ignored.includes('.dev.vars'))
for (const path of names) {
  const base = path.split('/').at(-1)
  assert.ok(!((base === '.env' || base.startsWith('.env.') || base === '.dev.vars' || base.startsWith('.dev.vars.')) && !['.env.example', '.dev.vars.example'].includes(base)), 'Environment file tracked by Git')
  if (!/\.(?:[cm]?[jt]sx?|jsonc?|md|ya?ml|toml|example)$/.test(path)) continue
  const source = await readFile(path, 'utf8')
  assert.ok(!/sb_secret_[A-Za-z0-9_-]{28,}/.test(source), `Possible privileged key in ${path}`)
  for (const match of source.matchAll(/\beyJ[A-Za-z0-9_-]+\.([A-Za-z0-9_-]+)\.[A-Za-z0-9_-]+/g)) {
    let payload
    try { payload = JSON.parse(Buffer.from(match[1], 'base64url').toString()) } catch { continue }
    assert.notEqual(payload.role, 'service_role', `Privileged JWT in ${path}`)
  }
}
for (const file of ['.env.example', '.dev.vars.example']) {
  const source = await readFile(file, 'utf8')
  for (const line of source.split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue
    assert.match(line, /^[A-Z_][A-Z0-9_]*=\s*$/, `Non-empty environment template: ${file}`)
  }
}
const html = await readFile('dist/index.html', 'utf8')
const script = html.match(/<script[^>]+src="(\/assets\/[^\"]+\.js)"/)
assert.ok(script)
const bundle = await readFile(`dist${script[1]}`, 'utf8')
for (const marker of ['SUPABASE_SERVICE_ROLE_KEY', 'publication_download_limits', 'sb_secret_', 'visual_fixture', 'unit_fixture']) assert.ok(!bundle.includes(marker), 'Server credential/code or fixture in browser bundle')
console.log('Pages deployment: endpoint files and routes valid; no tracked environment files or privileged credentials; server code excluded from browser bundle.')
