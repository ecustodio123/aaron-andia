export const site = {
  name: 'Aarón Andía', subtitle: 'ABOGADO | ÁRBITRO', // Perfil y trayectoria: brochure institucional 2026, pp. 2, 4 y 5.
  contact: { email: 'mail@mail.com', linkedin: 'https://www.linkedin.com/in/aaron-andia-espinoza/' }, // Correo temporal: reemplazar al confirmar el definitivo.
  location: 'Lima, Perú', // Ciudad indicada en el brochure institucional 2026.
  hero: 'Resolución estratégica de controversias en proyectos públicos e infraestructura',
  about: ['Consultoría especializada en la prevención y resolución de controversias vinculadas a la contratación pública y a los proyectos de infraestructura.', 'Un enfoque que integra el análisis jurídico, la estrategia contractual y la comprensión de los desafíos técnicos de cada proyecto.'],
  profile: {
    paragraphs: [
      'Especialista en resolver disputas complejas en contratación pública, infraestructura y comercio. Su práctica se centra en arbitrajes vinculados a contratación pública, infraestructura, comerciales e internacionales, con experiencia en proyectos de inversión como Obras por Impuestos y Asociaciones Público-Privadas.',
      'Formado en la UPC, donde obtuvo el título de abogado con mención Sobresaliente y el grado de Maestro en Contratación Pública, con mención Notable.',
    ],
    education: [
      'Maestro en Contratación Pública — UPC, mención Notable',
      'Resolución de Controversias en Contratos FIDIC — FIDIC Academy',
      'Especialización en Derecho de la Construcción — UPC',
      'Especialización en Contratación Pública — UPC, primer puesto',
      'Especialización en Derecho Administrativo — Universidad Continental',
      'Especialización en Arbitraje — Universidad Esan',
      'Abogado — UPC, mención Sobresaliente',
    ],
  },
  experience: {
    metrics: [
      { value: '+80', label: 'Patrocinios en arbitrajes, JRD–JPRD y DABs' },
      { value: '+9', label: 'Casos en ejercicio como árbitro' },
      { value: '+7', label: 'Años de experiencia profesional' },
    ],
    cases: [
      {
        sector: 'Contratación pública · Obras viales',
        title: 'Ampliaciones de plazo, expediente y penalidades en una obra vial',
        description: 'En un arbitraje por la ejecución de una obra vial se reconocieron al contratista más de S/ 30 millones por mayores gastos generales y costos directos, con reajustes e intereses. También se reconocieron ampliaciones de plazo y deficiencias en el expediente.',
      },
      {
        sector: 'Minería · Privatización',
        title: 'Honorarios de éxito en la transferencia de activos mineros estatales',
        description: 'El laudo declaró inválida la resolución del contrato de asesoría y reconoció honorarios de éxito por US$ 843,028.31, vinculados a La Granja, Alto Chicama y Toromocho. Las solicitudes de rectificación, interpretación e integración del laudo fueron rechazadas.',
      },
      {
        sector: 'Contratación pública · Bienes',
        role: 'Participación como árbitro',
        title: 'Resolución de órdenes de compra de más de 5,200 computadoras',
        description: 'El tribunal declaró nulas las resoluciones de dos órdenes de compra y dispuso otorgar la conformidad y pagar S/ 19.5 millones más intereses legales. Desestimó la indemnización de S/ 6.1 millones solicitada por el contratista.',
      },
      {
        sector: 'Contratación pública · Obras viales',
        title: 'Resolución contractual en una carretera entre Talara y Tumbes',
        description: 'En un contrato de más de S/ 63 millones por reciclado y recapeo de carretera, el tribunal declaró infundada la pretensión de nulidad de la resolución contractual por falta de pago. La resolución se mantuvo y la entidad asumió el 100 % de los costos del arbitraje.',
      },
    ],
  },
  practices: [
    { number: 'I', title: 'Arbitraje', description: 'Representación y estrategia en controversias contractuales, con especial atención a los aspectos jurídicos y técnicos de cada caso.' },
    { number: 'II', title: 'Contratación pública', description: 'Asesoría en planificación, ejecución contractual, prevención de controversias y procedimientos relacionados con la contratación pública.' },
    { number: 'III', title: 'Dispute Boards', description: 'Asesoría en la prevención y gestión temprana de controversias durante la ejecución de proyectos.' },
  ],
  pillars: ['Análisis jurídico', 'Estrategia contractual', 'Comprensión del proyecto'],
  publications: [] as { title: string; date: string; medium?: string; description: string; url: string }[],
}
export const navigation = [
  { id: 'inicio', label: 'Inicio' }, { id: 'sobre-mi', label: 'Quién soy' },
  { id: 'areas-de-practica', label: 'Áreas de práctica' }, { id: 'experiencia', label: 'Experiencia' }, { id: 'publicaciones', label: 'Publicaciones' }, { id: 'contacto', label: 'Contacto' },
]

export function getEmailUrl(
  subject = 'Consulta sobre servicios profesionales',
  message = 'Hola Aarón, quisiera realizar una consulta sobre sus servicios.',
) {
  return `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
}
export const emailUrl = getEmailUrl()
