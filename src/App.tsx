import { useEffect, useRef, useState } from 'react'
import { navigation, site, whatsappUrl } from './site'
import './App.css'
function Arrow() { return <span className="arrow" aria-hidden="true">↗</span> }
function Brand() { return <a className="brand" href="#inicio"><span>{site.name}</span><small>{site.subtitle}</small></a> }
function Label({ children }: { children: React.ReactNode }) { return <div className="section-label"><span className="gold-rule" />{children}</div> }
function Header() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('inicio')
  const toggle = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id) }), { rootMargin: '-20% 0px -55% 0px' })
    navigation.forEach(item => { const el = document.getElementById(item.id); if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])
  return <header className="header"><div className="header-inner"><Brand /><button ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="main-navigation" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setOpen(!open)}><span aria-hidden="true">{open ? '×' : '☰'}</span>{open ? 'Cerrar' : 'Menú'}</button><nav id="main-navigation" className={open ? 'navigation is-open' : 'navigation'} aria-label="Navegación principal" onKeyDown={e => { if (e.key === 'Escape') { setOpen(false); toggle.current?.focus() } }}>{navigation.map(item => <a key={item.id} href={`#${item.id}`} aria-current={active === item.id ? 'location' : undefined} onClick={() => setOpen(false)}>{item.label}</a>)}</nav></div></header>
}
function Hero() {
  return <section id="inicio" className="hero"><img className="hero-image" src="/images/legal-desk.jpg" alt="" fetchPriority="high" width="2200" height="1467" /><div className="hero-shade" /><div className="container hero-content"><span className="gold-rule" /><p className="eyebrow hero-eyebrow">Estrategia jurídica. Visión de proyecto.</p><h1>AARÓN ANDÍA</h1><p className="hero-subtitle">{site.subtitle}</p><p className="hero-description">{site.hero}</p><a className="button" href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Agendar reunión por WhatsApp">Agendar reunión <Arrow /></a></div><div className="container hero-bottom"><span>ARBITRAJE · CONTRATACIÓN PÚBLICA · DISPUTE BOARDS</span><a href="#sobre-mi">EXPLORAR <span aria-hidden="true">↓</span></a></div></section>
}
function About() {
  return <section id="sobre-mi" className="about light"><div className="container"><Label>01 / SOBRE MÍ</Label><div className="about-grid"><h2>Arbitraje <span className="gold">|</span><br />Contratación pública <span className="gold">|</span><br /><em>Dispute Boards</em></h2><div className="about-copy"><p className="lead">{site.about[0]}</p><p>{site.about[1]}</p><a href="#areas-de-practica" className="text-link">Explorar áreas de práctica <Arrow /></a></div></div></div></section>
}
function PracticeAreas() {
  return <section id="areas-de-practica" className="practice dark"><div className="container"><Label>02 / ESPECIALIDADES</Label><div className="section-heading"><h2>Áreas de práctica</h2><span className="section-aside">Rigor jurídico.<br />Perspectiva estratégica.</span></div><div className="practice-grid">{site.practices.map(item => <article key={item.number} className="practice-item"><span className="roman">{item.number}</span><h3>{item.title}</h3><span className="gold-rule" /><p>{item.description}</p><a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-link" aria-label={`Consultar sobre ${item.title} por WhatsApp`}>Consultar <Arrow /></a></article>)}</div></div></section>
}
function InfrastructureBanner() {
  return <div className="infrastructure" aria-hidden="true"><img src="/images/infrastructure-reference.png" loading="lazy" alt="" width="1349" height="441" /><div className="infrastructure-caption"><span className="gold-rule" />VISIÓN JURÍDICA PARA PROYECTOS QUE TRASCIENDEN.</div></div>
}
function Publications() {
  return <section id="publicaciones" className="publications light"><div className="container"><Label>03 / PERSPECTIVAS</Label><div className="publications-grid"><div><h2>Publicaciones</h2><p>Análisis y reflexiones sobre arbitraje, contratación pública y mecanismos de resolución de controversias.</p></div><div className="publication-list">{site.publications.length ? site.publications.slice(0, 3).map(item => <article key={item.url}><time>{item.date}</time><h3><a href={item.url} target="_blank" rel="noopener noreferrer">{item.title} <Arrow /></a></h3><p>{item.description}</p></article>) : <div className="coming-soon"><span className="eyebrow">UN ESPACIO PARA EL ANÁLISIS</span><p>Próximamente compartiremos publicaciones y análisis especializados.</p><span className="publication-mark" aria-hidden="true">↗</span></div>}</div></div></div></section>
}
function Contact() {
  return <section id="contacto" className="contact dark"><div className="container"><Label>04 / CONVERSEMOS</Label><h2>Experiencia en<br />controversias complejas.<br /><em>Resultados que importan.</em></h2><p>Asesoría especializada en arbitraje, contratación pública y Dispute Boards.</p><a className="button" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Consultar por WhatsApp <Arrow /></a><a className="contact-phone" href={whatsappUrl} target="_blank" rel="noopener noreferrer">{site.contact.whatsapp}</a></div><span className="contact-monogram" aria-hidden="true">A</span></section>
}
const currentYear = new Date().getFullYear()
function Footer() {
  return <footer className="footer dark"><div className="container"><div className="footer-grid"><div className="footer-brand"><Brand /><p>Especialización en arbitraje, contratación pública y resolución de controversias en proyectos de infraestructura.</p>{site.contact.linkedin && <a className="text-link" href={site.contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <Arrow /></a>}</div><div><h2 className="eyebrow">Navegación</h2><nav aria-label="Navegación del pie de página">{navigation.map(item => <a key={item.id} href={`#${item.id}`}>{item.label}</a>)}</nav></div><div className="footer-contact"><h2 className="eyebrow">Contacto</h2>{site.contact.email ? <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> : null}{site.contact.whatsapp && <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp · {site.contact.whatsapp} <Arrow /></a>}<h2 className="eyebrow specialties-title">Especialidades</h2><ul>{site.practices.map(item => <li key={item.number}>{item.title}</li>)}</ul></div></div><div className="footer-bottom"><span>© {currentYear} {site.name}. Todos los derechos reservados.</span><a href="#inicio">Volver al inicio ↑</a></div></div></footer>
}
export default function App() { return <><a className="skip-link" href="#contenido">Saltar al contenido</a><Header /><main id="contenido"><Hero /><About /><PracticeAreas /><InfrastructureBanner /><Publications /><Contact /></main><Footer /></> }
