import { useEffect, useRef, useState } from 'react'
import { getWhatsappUrl, navigation, site, whatsappUrl } from './site'
import './App.css'

function Arrow() { return <span className="arrow" aria-hidden="true">↗</span> }
function Brand() {
  return <a className="brand" href="#inicio" aria-label="Aarón Andía, inicio"><span>{site.name}</span><small>{site.subtitle}</small></a>
}
function Label({ children }: { children: React.ReactNode }) {
  return <div className="section-label"><span className="gold-rule" aria-hidden="true" />{children}</div>
}
function WhatsappCTA() {
  return <a className="button" href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Consultar con Aarón Andía por WhatsApp">Consultar por WhatsApp <Arrow /></a>
}
function focusSection(id: string) {
  document.querySelector<HTMLElement>(`#${id} h1, #${id} h2`)?.focus({ preventScroll: true })
}
function Header() {
  const [open, setOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(() => matchMedia('(min-width: 1200px)').matches)
  const [active, setActive] = useState('inicio')
  const [scrolled, setScrolled] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  const header = useRef<HTMLElement>(null)

  useEffect(() => {
    const desktop = matchMedia('(min-width: 1200px)')
    let observer: IntersectionObserver
    const observe = () => {
      observer?.disconnect()
      observer = new IntersectionObserver(() => {
        const offset = desktop.matches ? 104 : 88
        let current = 'inicio'
        navigation.forEach(item => {
          const section = document.getElementById(item.id)
          if (section && section.getBoundingClientRect().top <= offset + 1) current = item.id
        })
        setActive(current)
      }, { rootMargin: `-${desktop.matches ? 104 : 88}px 0px -45% 0px`, threshold: 0 })
      navigation.forEach(item => { const el = document.getElementById(item.id); if (el) observer.observe(el) })
    }
    const onBreakpoint = () => { setIsDesktop(desktop.matches); setOpen(false); observe() }
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
    desktop.addEventListener('change', onBreakpoint)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('hashchange', onHash)
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      observer.disconnect(); desktop.removeEventListener('change', onBreakpoint)
      window.removeEventListener('scroll', onScroll); window.removeEventListener('hashchange', onHash)
      document.removeEventListener('pointerdown', onPointer); document.removeEventListener('keydown', onKey)
    }
  }, [])

  return <header ref={header} className={`header${scrolled ? ' has-scrolled' : ''}`}>
    <div className="header-inner"><Brand />
      <button ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="main-navigation" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setOpen(!open)}><span className="menu-symbol" aria-hidden="true">{open ? '×' : '☰'}</span>{open ? 'Cerrar' : 'Menú'}</button>
      <nav id="main-navigation" hidden={!isDesktop && !open} className={`navigation${open ? ' is-open' : ''}`} aria-label="Navegación principal">
        {navigation.map(item => <a key={item.id} href={`#${item.id}`} aria-current={active === item.id ? 'location' : undefined} onClick={() => { setOpen(false); setActive(item.id); focusSection(item.id) }}>{item.label}</a>)}
      </nav>
    </div>
  </header>
}
function Hero() {
  return <section id="inicio" className="hero">
    <img className="hero-image" src="/images/legal-desk.jpg" alt="" fetchPriority="high" width="2200" height="1467" />
    <div className="hero-shade" />
    <div className="container hero-content"><span className="gold-rule" aria-hidden="true" /><p className="eyebrow hero-eyebrow">Estrategia jurídica. Visión de proyecto.</p><h1 tabIndex={-1}>AARÓN ANDÍA</h1><p className="hero-subtitle">{site.subtitle}</p><p className="hero-description">{site.hero}</p><WhatsappCTA /></div>
    <div className="container hero-bottom"><span>ARBITRAJE · CONTRATACIÓN PÚBLICA · DISPUTE BOARDS</span><a className="text-link" href="#sobre-mi">Explorar <span aria-hidden="true">↓</span></a></div>
  </section>
}
function About() {
  return <section id="sobre-mi" className="about light"><div className="container" data-reveal><Label>01 / ENFOQUE</Label>
    <div className="about-grid"><div className="about-intro"><h2 tabIndex={-1}>Estrategia jurídica.<br /><em>Visión de proyecto.</em></h2><p className="lead">{site.about[0]}</p></div>
      <div className="about-pillars"><p>{site.about[1]}</p><ol className="pillars">{site.pillars.map((title, i) => <li key={title}><span aria-hidden="true">0{i + 1}</span><h3>{title}</h3></li>)}</ol><a href="#areas-de-practica" className="text-link">Explorar áreas de práctica <Arrow /></a></div>
    </div>
  </div></section>
}
function PracticeAreas() {
  return <section id="areas-de-practica" className="practice dark"><div className="container" data-reveal><Label>02 / ESPECIALIDADES</Label><div className="section-heading"><h2 tabIndex={-1}>Áreas de práctica</h2><p className="section-aside">Rigor jurídico.<br />Perspectiva estratégica.</p></div>
    <div className="practice-grid">{site.practices.map(item => {
      const subject = item.title === 'Dispute Boards' ? item.title : item.title.toLocaleLowerCase('es')
      return <article key={item.number} className="practice-item"><div className="practice-title"><span className="roman" aria-hidden="true">{item.number}</span><h3>{item.title}</h3><span className="gold-rule" aria-hidden="true" /></div><p>{item.description}</p><a href={getWhatsappUrl(`Hola Aarón, quisiera consultar sobre ${subject}.`)} target="_blank" rel="noopener noreferrer" className="text-link" aria-label={`Consultar sobre ${subject} por WhatsApp`}>Consultar sobre {subject} <Arrow /></a></article>
    })}</div>
  </div></section>
}
function InfrastructureBanner() {
  return <aside className="infrastructure" aria-label="Consulta sobre proyectos de infraestructura"><div className="infrastructure-photo"><img src="/images/infrastructure-reference.png" loading="lazy" alt="" width="1349" height="441" /></div><div className="container infrastructure-caption"><p>Visión jurídica para<br /><em>proyectos que trascienden.</em></p><WhatsappCTA /></div></aside>
}
function Publications() {
  return <section id="publicaciones" className={`publications light${site.publications.length ? ' has-publications' : ''}`}><div className="container" data-reveal><div className="publications-grid"><div><Label>03 / PERSPECTIVAS</Label><h2 tabIndex={-1}>Publicaciones</h2><p>Análisis y reflexiones sobre arbitraje, contratación pública y mecanismos de resolución de controversias.</p></div>
    <div className="publication-list">{site.publications.length ? site.publications.slice(0, 3).map(item => <article key={item.url}><p className="publication-meta"><time>{item.date}</time>{item.medium && <span> · {item.medium}</span>}</p><h3><a href={item.url} target="_blank" rel="noopener noreferrer">{item.title} <Arrow /><span className="sr-only"> (abre en otra pestaña)</span></a></h3><p>{item.description}</p></article>) : <p className="coming-soon">Próximamente compartiremos publicaciones y análisis especializados.</p>}</div>
  </div></div></section>
}
function Contact() {
  return <section id="contacto" className="contact dark"><div className="container" data-reveal><Label>04 / CONVERSEMOS</Label><div className="contact-grid"><div className="contact-intro"><h2 tabIndex={-1}>Experiencia en controversias complejas.<br /><em>Resultados que importan.</em></h2><p>Asesoría especializada en arbitraje, contratación pública y Dispute Boards.</p></div><div className="contact-guide"><p className="eyebrow">Para iniciar la conversación</p><p>Describe brevemente tu consulta e indica el área que te interesa.</p></div><div className="contact-actions"><WhatsappCTA /><a className="contact-phone" href={whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp · {site.contact.whatsapp}</a></div></div></div><span className="contact-monogram" aria-hidden="true">A</span></section>
}
const currentYear = new Date().getFullYear()
function Footer() {
  return <footer className="footer dark"><div className="container"><div className="footer-grid"><div className="footer-brand"><Brand /><p>Especialización en arbitraje, contratación pública y resolución de controversias en proyectos de infraestructura.</p>{site.contact.linkedin && <a className="text-link" href={site.contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <Arrow /></a>}</div><div className="footer-navigation"><h2 className="eyebrow">Navegación</h2><nav aria-label="Navegación del pie de página">{navigation.map(item => <a key={item.id} href={`#${item.id}`}>{item.label}</a>)}</nav></div><div className="footer-contact"><h2 className="eyebrow">Contacto</h2>{site.contact.email && <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>}<a href={whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp <Arrow /><span>{site.contact.whatsapp}</span></a></div></div><div className="footer-bottom"><span>© {currentYear} {site.name}. Todos los derechos reservados.</span><a href="#inicio">Volver al inicio <span aria-hidden="true">↑</span></a></div></div></footer>
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
  return <><a className="skip-link" href="#contenido">Saltar al contenido</a><Header /><main id="contenido" ref={main} tabIndex={-1}><Hero /><About /><PracticeAreas /><InfrastructureBanner /><Publications /><Contact /></main><Footer /></>
}
