import { site } from './site.ts'

export const seo = {
  url: 'https://www.andiaespinoza.com/',
  title: 'Aarón Andía | Arbitraje y Contratación Pública en Perú',
  description: 'Abogado y árbitro en Perú. Asesoría en arbitraje, contratación pública y Dispute Boards para prevenir y resolver controversias en infraestructura.',
  imagePath: 'images/aaron-andia-social.png',
  imageAlt: 'Aarón Andía, abogado y árbitro. Arbitraje, contratación pública y Dispute Boards en Perú.',
}

const personId = `${seo.url}#aaron-andia`
const serviceIds = ['arbitraje', 'contratacion-publica', 'dispute-boards']

export const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite', '@id': `${seo.url}#website`,
      url: seo.url, name: site.name, inLanguage: 'es-PE',
      publisher: { '@id': personId },
    },
    {
      '@type': 'WebPage', '@id': `${seo.url}#webpage`,
      url: seo.url, name: seo.title, description: seo.description, inLanguage: 'es-PE',
      isPartOf: { '@id': `${seo.url}#website` },
      mainEntity: { '@id': personId },
      about: serviceIds.map(id => ({ '@id': `${seo.url}#servicio-${id}` })),
      primaryImageOfPage: {
        '@type': 'ImageObject', url: new URL(seo.imagePath, seo.url).href,
        width: 1200, height: 630, caption: seo.imageAlt,
      },
    },
    {
      '@type': 'Person', '@id': personId,
      name: site.name, url: seo.url, jobTitle: 'Abogado y árbitro',
      description: site.profile.paragraphs[0],
      image: new URL('images/aaron-andia-retrato.jpg', seo.url).href,
      sameAs: [site.contact.linkedin],
      knowsAbout: ['Arbitraje', 'Contratación pública', 'Dispute Boards', 'Derecho de la construcción', 'Obras por Impuestos', 'Asociaciones Público-Privadas'],
      alumniOf: { '@type': 'CollegeOrUniversity', name: 'UPC' },
      workLocation: { '@type': 'Place', name: site.location },
      // El correo temporal no representa una dirección profesional confirmada.
    },
    ...site.practices.map((practice, i) => ({
      '@type': 'Service', '@id': `${seo.url}#servicio-${serviceIds[i]}`,
      name: practice.title, serviceType: practice.title,
      description: practice.description,
      url: `${seo.url}#areas-de-practica`,
      provider: { '@id': personId },
      areaServed: { '@type': 'Country', name: 'Perú' },
    })),
  ],
}

const escapeAttribute = (value: string) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

export function applySeo(html: string) {
  const values: Record<string, string> = {
    TITLE: seo.title, DESCRIPTION: seo.description, URL: seo.url,
    IMAGE: new URL(seo.imagePath, seo.url).href, IMAGE_ALT: seo.imageAlt,
    AUTHOR: site.name,
  }
  let result = html
  for (const [key, value] of Object.entries(values)) result = result.replaceAll(`__SEO_${key}__`, escapeAttribute(value))
  return result.replace('__SEO_JSON_LD__', JSON.stringify(structuredData).replaceAll('<', '\\u003c'))
}
