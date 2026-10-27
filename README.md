# Aarón Andía — Landing institucional

Una sola página con React, TypeScript, Vite y Tailwind CSS.

## Desarrollo

`npm install`, `npm run dev`.

Validación: `npm run lint`, `npm run typecheck`, `npm run build`.

## Configuración

Textos, navegación, especialidades, publicaciones y contactos: `src/site.ts`.
Colores: variables en `src/index.css`.

El correo temporal `aaron@andiaespinoza.com` se muestra únicamente como texto en Contacto y en el footer. No hay botones de consulta, enlaces mailto, selector de correo ni acciones de copia. Reemplazar la dirección en `src/site.ts` al confirmar la definitiva.

Publicaciones contiene tres cards y PDFs **ficticios para maquetación**, identificados como muestras. Los archivos están en `public/publicaciones/`, con `X-Robots-Tag: noindex` en Cloudflare. Sustituir contenido, archivos y esta regla antes de publicar documentos reales. El script opcional `scripts/create-publication-samples.py` los regenera con ReportLab; no forma parte del build. No se incorporan como artículos reales en JSON-LD.

## Imágenes

Hero: fotografía de balanza de justicia y mazo por Sora Shimazaki, Pexels: https://www.pexels.com/photo/judges-desk-with-gavel-and-scales-5669619/. Banner: imagen del documento de referencia, con encuadre que oculta la etiqueta de captura. No se presentan como proyectos del profesional.

## Cloudflare Pages

Comando de compilación: `npm run build`. Directorio de salida: `dist`.
No requiere backend ni variables de entorno. Dominio canónico: `https://www.andiaespinoza.com/`. Metadatos y datos estructurados: `src/seo.ts`. Conectar el dominio y configurar las redirecciones de host en Cloudflare antes del lanzamiento.

## Vista previa al compartir

Imagen social: `public/images/aaron-andia-social.png` (1200 × 630). Fuente editable: `design/social-card.svg`. Los metadatos están en el HTML inicial para que puedan leerlos los rastreadores sin ejecutar JavaScript.

Los cambios aparecen en el enlace público después del despliegue. Algunas aplicaciones conservan en caché tarjetas anteriores.

## SEO

`npm run build` comprueba TypeScript, compila, prerenderiza toda la landing en HTML e inspecciona la salida SEO. `npm run check:seo` repite la revisión de `dist`. `npm run preview` permite comprobar la hidratación de React sobre el HTML generado.

Palabras clave, validaciones y tareas pendientes de publicación: [docs/seo.md](docs/seo.md). El sitemap y robots están en `public/`; actualizar `lastmod` ante cambios reales del contenido. No requiere servidor React en producción.
