import { useEffect, useRef, useState } from 'react'
import { DownloadError, getDownloadUrl, getPublishedPage } from '../lib/publications'
import type { Publication } from '../lib/publications'

function PublicationCard({ item, index }: { item: Publication; index: number }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const pending = useRef(false)
  const download = async () => {
    if (pending.current) return
    pending.current = true; setBusy(true); setError('')
    try { window.location.assign(await getDownloadUrl(item.id)) }
    catch (cause) { setError(cause instanceof DownloadError ? cause.message : 'No pudimos descargar el PDF. Inténtalo nuevamente.') }
    finally { pending.current = false; setBusy(false) }
  }
  return <article className="publication-card">
    <div className="publication-card-meta"><span className="eyebrow">{item.category || (item.publication_type === 'document' ? 'Documento' : 'Artículo')}</span><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span></div>
    <h3>{item.title}</h3>{item.summary && <p>{item.summary}</p>}
    {item.publication_type === 'document' && <button type="button" className="text-link publication-download" onClick={download} disabled={busy} aria-busy={busy} aria-label={`Descargar PDF: ${item.title}`}>{busy ? 'Preparando descarga…' : 'Descargar PDF'}<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5" /></svg></button>}
    {error && <p className="publication-error" role="alert">{error}</p>}
  </article>
}

export default function Publications() {
  const [items, setItems] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [refresh, setRefresh] = useState(0)
  const [revision, setRevision] = useState(0)
  const lastRefresh = useRef(0)
  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true); setError('')
      try {
        const result = await getPublishedPage(page, refresh > 0)
        if (!active) return
        setItems(previous => page === 0 ? result.items : [...new Map([...previous, ...result.items].map(item => [item.id, item])).values()])
        setHasMore(result.hasMore)
      } catch { if (active) setError('No pudimos cargar las publicaciones. Puedes volver a intentarlo.') }
      finally { if (active) setLoading(false) }
    }
    void load()
    return () => { active = false }
  }, [page, refresh, revision])
  // Refresh while the visitor keeps the first page open; no subscriptions or admin session.
  useEffect(() => {
    if (page !== 0) return
    lastRefresh.current = Date.now()
    const update = () => {
      if (document.visibilityState !== 'visible' || Date.now() - lastRefresh.current < 60000) return
      lastRefresh.current = Date.now(); setRevision(value => value + 1)
    }
    const timer = window.setInterval(update, 60000)
    window.addEventListener('focus', update)
    return () => { window.clearInterval(timer); window.removeEventListener('focus', update) }
  }, [page])
  return <section id="publicaciones" className="publications light"><div className="container">
    <div className="publications-heading"><div className="section-label"><span className="gold-rule" aria-hidden="true" />04 / PERSPECTIVAS</div><h2 tabIndex={-1}>Publicaciones</h2><p>Análisis y reflexiones sobre arbitraje, contratación pública y mecanismos de resolución de controversias.</p></div>
    {items.length > 0 && <div className="publication-cards">{items.map((item, index) => <PublicationCard key={item.id} item={item} index={index} />)}</div>}
    {loading && items.length === 0 && <><p className="publication-state" role="status">Cargando publicaciones…</p><div className="publication-cards publication-skeletons" aria-hidden="true">{[0, 1, 2].map(key => <div key={key} className="publication-card publication-skeleton"><span /><span /><span /></div>)}</div></>}
    {!loading && !error && items.length === 0 && <p className="publication-state" role="status">Próximamente compartiremos nuevas publicaciones.</p>}
    {error && <div className="publication-state" role="alert"><p>{error}</p><button className="text-link" type="button" onClick={() => setRefresh(value => value + 1)}>Reintentar</button></div>}
    {items.length > 0 && !error && (hasMore || loading) && <button className="text-link publication-more" type="button" disabled={loading} onClick={() => { setLoading(true); setPage(value => value + 1) }}>{loading ? 'Cargando…' : 'Ver más publicaciones'}</button>}
  </div></section>
}
