export const site = {
  name: 'Aarón Andía', subtitle: 'ABOGADO | ÁRBITRO', // Credenciales pendientes de confirmar.
  contact: { email: '', whatsapp: '+51 960 869 846', linkedin: '' },
  hero: 'Resolución estratégica de controversias en proyectos públicos e infraestructura',
  about: ['Consultoría especializada en la prevención y resolución de controversias vinculadas a la contratación pública y a los proyectos de infraestructura.', 'Un enfoque que integra el análisis jurídico, la estrategia contractual y la comprensión de los desafíos técnicos de cada proyecto.'],
  practices: [
    { number: 'I', title: 'Arbitraje', description: 'Representación y estrategia en controversias contractuales, con especial atención a los aspectos jurídicos y técnicos de cada caso.' },
    { number: 'II', title: 'Contratación pública', description: 'Asesoría en planificación, ejecución contractual, prevención de controversias y procedimientos relacionados con la contratación pública.' },
    { number: 'III', title: 'Dispute Boards', description: 'Asesoría en la prevención y gestión temprana de controversias durante la ejecución de proyectos.' },
  ],
  pillars: ['Análisis jurídico', 'Estrategia contractual', 'Comprensión del proyecto'],
  publications: [] as { title: string; date: string; medium?: string; description: string; url: string }[],
}
export const navigation = [
  { id: 'inicio', label: 'Inicio' }, { id: 'sobre-mi', label: 'Enfoque' },
  { id: 'areas-de-practica', label: 'Áreas de práctica' }, { id: 'publicaciones', label: 'Publicaciones' }, { id: 'contacto', label: 'Contacto' },
]

export function getWhatsappUrl(message = 'Hola Aarón, quisiera realizar una consulta sobre sus servicios.') {
  return `https://wa.me/${site.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
}
export const whatsappUrl = getWhatsappUrl()
