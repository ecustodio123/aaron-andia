export const site = {
  name: 'Aarón Andía', subtitle: 'ABOGADO | ÁRBITRO', // Perfil y trayectoria: brochure institucional 2026, pp. 2, 4 y 5.
  contact: { email: 'aaron@andiaespinoza.com', linkedin: 'https://www.linkedin.com/in/aaron-andia-espinoza/' }, // Correo temporal: reemplazar al confirmar el definitivo.
  location: 'Lima, Perú', // Ciudad indicada en el brochure institucional 2026.
  hero: 'Resolución estratégica de controversias en proyectos públicos e infraestructura',
  approach: 'Un enfoque que integra el análisis jurídico, la estrategia contractual y la comprensión de los desafíos técnicos de cada proyecto.',
  profile: {
    documents: [
      { label: 'Brochure', url: '/documentos/brochure-institucional-2026.pdf' },
      { label: 'CV', url: null as string | null }, // Activar cuando se reciba el archivo definitivo.
    ],
    paragraphs: [
      'Especialista en resolver disputas complejas en contratación pública, infraestructura y comercio. Su práctica se centra en arbitrajes vinculados a contratación pública, infraestructura, comerciales e internacionales, con experiencia en proyectos de inversión como Obras por Impuestos y Asociaciones Público-Privadas.',
      'Formado en la UPC, donde obtuvo el título de abogado con mención Sobresaliente y el grado de Maestro en Contratación Pública, con mención Notable.',
    ],
    education: [
      'Maestro en Contratación Pública — UPC (Mención Notable)',
      'Resolución de Controversias en Contratos FIDIC — FIDIC Academy',
      'Especialización en Derecho de la Construcción — UPC',
      'Especialización en Contratación Pública — UPC (Primer Puesto)',
      'Especialización en Derecho Administrativo — Universidad Continental',
      'Especialización en Arbitraje — Universidad Esan',
      'Abogado — UPC (Mención Sobresaliente)',
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
        title: 'Asesoramos favorablemente a un contratista en el reconocimiento de más de S/ 30 millones en una obra vial',
        description: 'Asesoramos favorablemente a un contratista en un arbitraje por la ejecución de una obra vial. El tribunal le reconoció más de S/ 30 millones por mayores gastos generales y mayores costos directos, con reajustes e intereses. También se reconocieron las ampliaciones de plazo y las deficiencias en el expediente técnico.',
      },
      {
        sector: 'Minería · Privatización',
        title: 'Reclamación por Honorarios de éxito no pagados en la transferencia de activos mineros estatales',
        description: 'Asesoramos favorablemente a un cliente en un arbitraje derivado de su contrato de asesoría para promover la inversión privada en unidades mineras del Estado. La agencia de promoción había resuelto el contrato. El Tribunal declaró inválida esa resolución y reconoció el derecho de nuestro cliente a cobrar los honorarios de éxito por los proyectos La Granja, Alto Chicama y Toromocho, que suman US$ 843,028.31. La entidad pidió rectificación, interpretación e integración del laudo, y el Colegiado rechazó las tres solicitudes.',
      },
      {
        sector: 'Contratación pública · Bienes',
        role: 'Participación como árbitro en una controversia por órdenes de compra de más de 5,200 computadoras',
        title: 'Resolución de órdenes de compra de más de 5,200 computadoras',
        description: 'Participación como árbitro en un arbitraje de derecho entre un proveedor y un gobierno regional. La entidad había resuelto dos órdenes de compra de equipos de cómputo por supuestas discrepancias con la ficha técnica del Catálogo Electrónico. El Tribunal declaró nulas ambas resoluciones, ordenó otorgar la conformidad y pagar S/ 19.5 millones más intereses legales. Desestimó la indemnización de S/ 6.1 millones solicitada por el contratista, y cada parte asumió sus propios gastos y el 50 % de los costos comunes.',
      },
      {
        sector: 'Contratación pública · Obras viales',
        title: 'Asesoramos favorablemente a un contratista en la defensa de la resolución de un contrato vial de más de S/ 63 millones',
        description: 'Asesoramos favorablemente a un contratista frente a una entidad pública que buscaba anular la resolución de un contrato de reciclado y recapeo de carretera entre Talara y Tumbes. El contratista había resuelto el contrato por falta de pago de las valorizaciones de la primera fase (S/ 779,798.40), pese a contar con la conformidad de la supervisión y de la entidad desde diciembre de 2021. El Tribunal declaró infundada la pretensión de la entidad, la resolución se mantuvo y la entidad asumió el 100 % de los costos del arbitraje',
      },
    ],
  },
  practices: [
    { number: 'I', title: 'Arbitraje', description: 'Asesoría y patrocinio en arbitrajes nacionales e internacionales, así como desempeño como árbitro en controversias bajo contrata pública e infraestructura privada.' },
    { number: 'II', title: 'Contratación pública', description: 'Asesoría en la preparación, ejecución y liquidación de contratos con el Estado, y defensa en las controversias que surgen durante su ejecución.' },
    { number: 'III', title: 'Dispute Boards', description: 'Asesoría en la prevención y solución temprana de controversias durante la ejecución de proyectos y obras públicas.' },
  ],
  pillars: ['Análisis jurídico', 'Estrategia contractual', 'Comprensión del proyecto'],

}
export const navigation = [
  { id: 'inicio', label: 'Inicio' }, { id: 'sobre-mi', label: 'Perfil' },
  { id: 'areas-de-practica', label: 'Áreas de práctica' }, { id: 'experiencia', label: 'Experiencia' }, { id: 'contacto', label: 'Contacto' },
]

