import { readFile, writeFile } from 'node:fs/promises'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { createServer } from 'vite'

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
})
try {
  const { default: App } = await server.ssrLoadModule('/src/App.tsx')
  const html = await readFile('dist/index.html', 'utf8')
  if (!html.includes('<div id="root"></div>')) throw new Error('Missing empty React root in built HTML.')
  let markup = renderToString(createElement(App))
  // React 19 emits image resource hints. Keep them in head, outside the hydrated root.
  const hints = markup.match(/<link\b[^>]*rel="preload"[^>]*\/>/g) ?? []
  for (const hint of hints) markup = markup.replace(hint, '')
  const result = html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`)
    .replace('</head>', `${hints.join('')}\n</head>`)
  await writeFile('dist/index.html', result)
  console.log(`Prerendered /: ${Buffer.byteLength(markup)} bytes of crawlable content.`)
} finally {
  await server.close()
}
