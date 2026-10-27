import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { navigation, site } from './site'
import Publications from './components/Publications'
import { AnimatedMetric } from './components/AnimatedMetric'
import './App.css'

function Arrow() { return <span className="arrow" aria-hidden="true">↗</span> }
function DownloadIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5" /></svg>
}
function Brand() {
  return <a className="brand" href="#inicio" aria-label="Aarón Andía, inicio"><img src="/brand/aaron-andia-logo-completo-transparente.svg" width="1064" height="750" alt="Aarón Andía, abogado y árbitro. Arbitraje, contratación pública y Dispute Boards" /></a>
}
function Label({ children }: { children: React.ReactNode }) {
  return <div className="section-label"><span className="gold-rule" aria-hidden="true" />{children}</div>
}
function focusSection(id: string) {
  document.querySelector<HTMLElement>(`#${id} h1, #${id} h2`)?.focus({ preventScroll: true })
}
// A stable server snapshot keeps prerendered HTML and initial hydration identical.
const desktopQuery = '(min-width: 1200px)'
function subscribeDesktop(onChange: () => void) {
  const query = matchMedia(desktopQuery)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}
const readDesktop = () => matchMedia(desktopQuery).matches
const readServerDesktop = () => false

function Header() {
  const [open, setOpen] = useState(false)
  const isDesktop = useSyncExternalStore(subscribeDesktop, readDesktop, readServerDesktop)
  const [active, setActive] = useState('inicio')
  const [scrolled, setScrolled] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  const header = useRef<HTMLElement>(null)

  useEffect(() => {
    const desktop = matchMedia(desktopQuery)
    let observer: IntersectionObserver
    const observe = () => {
      const offset = (header.current?.getBoundingClientRect().height ?? 128) + 16
      observer?.disconnect()
      observer = new IntersectionObserver(() => {
        let current = 'inicio'
        navigation.forEach(item => {
          const section = document.getElementById(item.id)
          if (section && section.getBoundingClientRect().top <= offset + 1) current = item.id
        })
        setActive(current)
      }, { rootMargin: `-${offset}px 0px -45% 0px`, threshold: 0 })
      navigation.forEach(item => { const el = document.getElementById(item.id); if (el) observer.observe(el) })
    }
    const onBreakpoint = () => { setOpen(false); observe() }
    const onScroll = () => setScrolled(window.scrollY > 24)
    const onHash = () => {
      const id = location.hash.slice(1)
      if (navigation.some(item => item.id === id)) { setActive(id); focusSection(id) }
    }
    const onPointer = (event: PointerEvent) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(wasOpen => { if (wasOpen) toggle.current?.focus(); return false })
      }
    }
    observe(); onScroll(); onHash()
    // React may mount after the browser first tries to resolve an incoming hash.
    const initialId = location.hash.slice(1)
    const initialFrame = navigation.some(item => item.id === initialId)
      ? requestAnimationFrame(() => document.getElementById(initialId)?.scrollIntoView({ behavior: 'instant', block: 'start' }))
      : 0
    desktop.addEventListener('change', onBreakpoint)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('hashchange', onHash)
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(initialFrame)
      observer.disconnect(); desktop.removeEventListener('change', onBreakpoint)
      window.removeEventListener('scroll', onScroll); window.removeEventListener('hashchange', onHash)
      document.removeEventListener('pointerdown', onPointer); document.removeEventListener('keydown', onKey)
    }
  }, [])

  return <header ref={header} className={`header${scrolled ? ' has-scrolled' : ''}`}>
    <div className="header-inner"><Brand />
      <button ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="main-navigation" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setOpen(!open)}><span className="menu-symbol" aria-hidden="true">{open ? '×' : '☰'}</span><span className="menu-caption">{open ? 'Cerrar' : 'Menú'}</span></button>
      <nav id="main-navigation" hidden={!isDesktop && !open} className={`navigation${open ? ' is-open' : ''}`} aria-label="Navegación principal">
        {navigation.map(item => <a key={item.id} href={`#${item.id}`} aria-current={active === item.id ? 'location' : undefined} onClick={() => { setOpen(false); setActive(item.id); focusSection(item.id) }}>{item.label}</a>)}
      </nav>
    </div>
  </header>
}
function Hero() {
  return <section id="inicio" className="hero">
    <img className="hero-image" src="/images/hero-obra-1280.webp" srcSet="/images/hero-obra-640.webp 640w, /images/hero-obra-960.webp 960w, /images/hero-obra-1280.webp 1280w" sizes="100vw" alt="" fetchPriority="high" width="1280" height="960" />
    <div className="hero-shade" />
    <div className="container hero-content"><span className="gold-rule" aria-hidden="true" /><h1 tabIndex={-1}>AARÓN ANDÍA</h1><p className="hero-subtitle">{site.subtitle}</p><p className="hero-description">{site.hero}</p></div>
  </section>
}
function About() {
  return <section id="sobre-mi" className="about light"><div className="container">
    <div className="profile-grid" data-reveal>
      <div className="profile-heading"><Label>01 / PERFIL</Label><h2 tabIndex={-1}>Aarón Andía</h2></div>
      <div className="profile-portrait"><img src="/images/aaron-andia-retrato.webp" alt="Retrato de Aarón Andía" width="900" height="1374" loading="lazy" /><span className="portrait-caption">{site.subtitle}</span><div className="profile-downloads" role="group" aria-label="Documentos profesionales">{site.profile.documents.map(document => document.url ? <a key={document.label} className="profile-download" href={document.url} download><DownloadIcon /><span>Descargar {document.label}</span></a> : <button key={document.label} className="profile-download" type="button" disabled><DownloadIcon /><span>Descargar {document.label}<small>Próximamente</small></span></button>)}</div></div>
      <div className="profile-copy">{site.profile.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        <details className="profile-education"><summary>Formación y especialización <span className="education-toggle" aria-hidden="true" /></summary><ul>{site.profile.education.map(item => <li key={item}>{item}</li>)}</ul></details>
        <a className="text-link" href="#experiencia">Explorar experiencia destacada <Arrow /></a>
      </div>
    </div>
    <div className="profile-approach" data-reveal><div><h3>Estrategia jurídica.<br /><em>Visión de proyecto.</em></h3><p>{site.approach}</p></div><ol className="profile-pillars">{site.pillars.map((title, i) => <li key={title}><span aria-hidden="true">0{i + 1}</span><span>{title}</span></li>)}</ol></div>
  </div></section>
}
function Experience() {
  return <section id="experiencia" className="experience"><div className="container">
    <div className="experience-heading" data-reveal><Label>03 / TRAYECTORIA</Label><h2 tabIndex={-1}>Experiencia <em>destacada</em></h2></div>
    <dl className="experience-metrics" data-reveal>{site.experience.metrics.map(metric => <div key={metric.value}><dt>{metric.label}</dt><dd><AnimatedMetric value={metric.value} /></dd></div>)}</dl>
    <div className="experience-cases">{site.experience.cases.map((item, i) => <article key={item.title} className="experience-case" data-reveal><div className="case-meta"><span className="case-index" aria-hidden="true">0{i + 1}</span><p className="eyebrow">{item.sector}</p>{item.role && <p className="case-role">{item.role}</p>}</div><details className="case-details" open={i === 0}><summary><h3>{item.title}</h3><span className="case-disclosure"><span className="case-read">Leer caso</span><span className="case-close">Ocultar detalle</span><span className="education-toggle" aria-hidden="true" /></span></summary><div className="case-description"><p>{item.description}</p></div></details></article>)}</div>
  </div></section>
}
function PracticeAreas() {
  return <section id="areas-de-practica" className="practice dark"><div className="container" data-reveal><Label>02 / ESPECIALIDADES</Label><div className="section-heading"><h2 tabIndex={-1}>Áreas de práctica</h2><p className="section-aside">Estrategía jurídica.<br />Visión de proyecto.</p></div>
    <div className="practice-grid">{site.practices.map(item => <article key={item.number} className="practice-item"><div className="practice-title"><span className="roman" aria-hidden="true">{item.number}</span><h3>{item.title}</h3><span className="gold-rule" aria-hidden="true" /></div><p>{item.description}</p></article>)}</div>
  </div></section>
}
function InfrastructureBanner() {
  return <aside className="infrastructure" aria-label="Proyectos de infraestructura"><div className="infrastructure-photo"><img src="/images/vision-juridica-1280.webp" srcSet="/images/vision-juridica-640.webp 640w, /images/vision-juridica-960.webp 960w, /images/vision-juridica-1280.webp 1280w" sizes="100vw" loading="lazy" alt="" width="1280" height="960" /></div><div className="container infrastructure-caption"><p>Visión jurídica para<br /><em>proyectos que trascienden.</em></p></div></aside>
}
function Contact() {
  return <section id="contacto" className="contact dark"><div className="container" data-reveal><Label>05 / CONVERSEMOS</Label><div className="contact-grid"><div className="contact-intro"><h2 tabIndex={-1}>Experiencia en controversias complejas.<br /><em>Resultados que importan.</em></h2><p>Asesoría especializada en arbitraje, contratación pública y Dispute Boards.</p></div><div className="contact-details"><p className="eyebrow">Correo electrónico</p><p className="contact-email" data-nosnippet>{site.contact.email}</p><p className="contact-location">{site.location}</p></div></div></div><img className="contact-monogram" src="/brand/aaron-andia-isotipo.svg" alt="" aria-hidden="true" width="704" height="704" loading="lazy" /></section>
}
const currentYear = new Date().getFullYear()
function Footer() {
  return <footer className="footer dark"><div className="container"><div className="footer-grid"><div className="footer-brand"><Brand /><p>Especialización en arbitraje, contratación pública y resolución de controversias en proyectos de infraestructura en Perú.</p>{site.contact.linkedin && <a className="footer-linkedin" href={site.contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Perfil de Aarón Andía en LinkedIn (abre en otra pestaña)"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="1" y="1" width="22" height="22" rx="2" /><g fill="var(--black)"><circle cx="6.3" cy="6.3" r="1.7" /><path d="M4.8 9h3v10.2h-3zM10 9h2.9v1.4c.5-1 1.5-1.7 3-1.7 3.1 0 3.7 2 3.7 4.6v5.9h-3v-5.3c0-1.3 0-2.8-1.7-2.8s-1.9 1.3-1.9 2.7v5.4h-3z" /></g></svg><span>LinkedIn</span><Arrow /></a>}</div><div className="footer-navigation"><h2 className="eyebrow">Navegación</h2><nav aria-label="Navegación del pie de página">{navigation.map(item => <a key={item.id} href={`#${item.id}`}>{item.label}</a>)}</nav></div><div className="footer-contact"><h2 className="eyebrow">Contacto</h2><p className="footer-email" data-nosnippet>{site.contact.email}</p></div></div><div className="footer-bottom"><span>© {currentYear} {site.name}. Todos los derechos reservados.</span><a href="#inicio">Volver al inicio <span aria-hidden="true">↑</span></a></div></div></footer>
}
export default function App() {
  const main = useRef<HTMLElement>(null)
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const running = new Set<Animation>()
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        observer.unobserve(entry.target)
        if (preference.matches || typeof entry.target.animate !== 'function') return
        const distance = matchMedia('(max-width: 767px)').matches ? 6 : 12
        const animation = entry.target.animate([{ opacity: 0, transform: `translateY(${distance}px)` }, { opacity: 1, transform: 'translateY(0)' }], { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' })
        running.add(animation)
        animation.onfinish = () => running.delete(animation)
      })
    }, { threshold: .12 })
    main.current?.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el))
    const onPreference = () => { if (preference.matches) { running.forEach(animation => animation.cancel()); running.clear() } }
    preference.addEventListener('change', onPreference)
    return () => { observer.disconnect(); running.forEach(animation => animation.cancel()); preference.removeEventListener('change', onPreference) }
  }, [])
  return <><a className="skip-link" href="#contenido">Saltar al contenido</a><Header /><main id="contenido" ref={main} tabIndex={-1}><Hero /><About /><PracticeAreas /><Experience /><InfrastructureBanner /><Publications /><Contact /></main><Footer /></>
}
