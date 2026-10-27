# Aarón Andía — Landing institucional

Una sola página con React, TypeScript, Vite y Tailwind CSS.

## Desarrollo

`npm install`, `npm run dev`.

Validación: `npm run lint`, `npm run typecheck`, `npm run build`.

## Configuración

Textos, navegación, especialidades, publicaciones y contactos: `src/site.ts`.
Colores: variables en `src/index.css`.

El correo configurado en `src/site.ts` se muestra únicamente como texto en Contacto y en el footer. No hay botones de consulta, enlaces mailto, selector de correo ni acciones de copia.

Publicaciones contiene tres cards y PDFs **ficticios para maquetación**, identificados como muestras. Los archivos están en `public/publicaciones/`, con `X-Robots-Tag: noindex` en Cloudflare. Sustituir contenido, archivos y esta regla antes de publicar documentos reales. El script opcional `scripts/create-publication-samples.py` los regenera con ReportLab; no forma parte del build. No se incorporan como artículos reales en JSON-LD.

## Imágenes

Hero: fotografía de obra proporcionada por el cliente el 26/10/2026, optimizada en WebP a 640, 960 y 1280 px de ancho, con `srcset` responsive y encuadre CSS. Banner “Visión jurídica”: segunda fotografía de obra proporcionada por el cliente, con versiones WebP de 640, 960 y 1280 px y encuadre responsive centrado en el equipo. No se presentan como proyectos del profesional.

## Cloudflare Pages

Comando de compilación: `npm run build`. Directorio de salida: `dist`.
No requiere backend ni variables de entorno. Dominio canónico: `https://www.andiaespinoza.com/`. Metadatos y datos estructurados: `src/seo.ts`. Conectar el dominio y configurar las redirecciones de host en Cloudflare antes del lanzamiento.

## Vista previa al compartir

Imagen social: `public/images/aaron-andia-social.png` (1200 × 630). Fuente editable: `design/social-card.svg`. Los metadatos están en el HTML inicial para que puedan leerlos los rastreadores sin ejecutar JavaScript.

Los cambios aparecen en el enlace público después del despliegue. Algunas aplicaciones conservan en caché tarjetas anteriores.

## SEO

`npm run build` comprueba TypeScript, compila, prerenderiza toda la landing en HTML e inspecciona la salida SEO. `npm run check:seo` repite la revisión de `dist`. `npm run preview` permite comprobar la hidratación de React sobre el HTML generado.

Palabras clave, validaciones y tareas pendientes de publicación: [docs/seo.md](docs/seo.md). El sitemap y robots están en `public/`; actualizar `lastmod` ante cambios reales del contenido. No requiere servidor React en producción.

## Recursos y mantenimiento

`public/` contiene únicamente recursos activos y archivos requeridos por el hosting. Las fotografías utilizadas son WebP; el retrato SEO apunta al mismo recurso. Se conservan las licencias y los PDFs enlazados por las cards.

`design/brand/referencia-original.jpeg` y `design/social-card.svg` son fuentes de edición y no se despliegan. Las capturas de revisiones y las versiones descartadas de imágenes/logos se retiraron. Recursos actuales de marca: [design/brand/README.md](design/brand/README.md).

Auditoría de limpieza y resultados: [docs/auditoria-repositorio.md](docs/auditoria-repositorio.md). Los demás informes en `docs/` son registros de revisiones previas; sus métricas y observaciones describen la versión revisada en su momento.
