# Auditoría y limpieza del repositorio

Fecha: 26 de octubre de 2026. Alcance: referencias de recursos, archivos publicados, código/configuración sin uso, dependencias y compilación. Cambios locales en main, sin commit ni push.

## Resultado

- 17 archivos obsoletos eliminados: 3.667.796 bytes (3,50 MiB).
- `public/` pasa de 3.746.111 a 447.921 bytes: reducción del 88,0 %. Vite copiaba también los recursos descartados al despliegue.
- Se conservan el diseño y el contenido visible: el interior del root prerenderizado es idéntico antes y después de la limpieza.
- El retrato en JSON-LD cambia de JPG a la versión WebP que ya utiliza la página.
- Se retiran estilos `.button`, variantes responsive de CTA, referencias a clases desaparecidas y declaraciones redundantes; los botones de correo ya no existían en la interfaz.
- Se elimina un texto de presentación sin uso y se sustituye el acceso por índice `site.about[1]` por `site.approach`, conservando exactamente el texto visible.
- Se elimina la variable CSS `--black-secondary`, sin usos.

## Archivos retirados

| Archivo | Bytes |
| --- | ---: |
| `public/images/construction.jpg` | 1,037,737 |
| `public/images/legal-desk.jpg` | 294,461 |
| `public/images/infrastructure-reference.png` | 815,788 |
| `public/images/aaron-andia-retrato.jpg` | 162,386 |
| `public/brand/aaron-andia-isotipo.png` | 209,175 |
| `public/brand/aaron-andia-logo.png` | 297,055 |
| `public/brand/aaron-andia-logo.svg` | 396,240 |
| `public/brand/aaron-andia-logo-completo.svg` | 72,801 |
| `public/brand/isotipo-192.png` | 2,973 |
| `public/brand/isotipo-512.png` | 9,574 |
| `design/contacto-sin-botones.png` | 54,811 |
| `design/logo-completo-preview.png` | 43,923 |
| `design/logo-legible-preview.png` | 25,501 |
| `design/logo-sin-fondo-preview.png` | 24,987 |
| `design/publicaciones-preview.png` | 73,756 |
| `design/quien-soy-justificado.png` | 84,266 |
| `design/seo-preview.png` | 62,362 |

Los iconos de 192/512 no estaban referenciados por HTML ni por un manifiesto. Se conservan los favicon SVG/PNG de 32 y el Apple Touch Icon de 180 activos. El logo con transparencia y el isotipo decorativo permanecen.

## Recursos conservados deliberadamente

- Fotografías WebP, tarjeta social PNG, logo completo transparente, isotipo y favicons usados.
- `robots.txt`, sitemap, reglas Cloudflare, 404 y licencia OFL: tienen función de hosting o distribución, aunque no todos aparezcan en enlaces de la navegación.
- Los tres PDFs de muestra enlazados desde Publicaciones y su script opcional de generación. No son archivos huérfanos; reemplazarlos corresponde a la preparación del contenido definitivo.
- JPEG original de marca en `design/brand/` y fuente SVG de la tarjeta social. Son materiales de edición y no se copian a `dist`.
- Informes Markdown de revisiones anteriores, identificados como históricos. No son recursos públicos ni una descripción normativa del estado actual.
- Todas las dependencias directas tienen usos: React/React DOM en render e hidratación; Newsreader en las fuentes; Vite, TypeScript, tipos y oxlint en desarrollo/validación; Tailwind y su plugin en el CSS base y utilidades de accesibilidad como `sr-only`. No se retiraron paquetes ni el lockfile.

## Verificación

- `npm run lint`: correcto.
- `npm run build`: TypeScript, Vite, prerenderizado y cuatro grupos de comprobaciones SEO correctos.
- `npm ls --depth=0`: árbol de dependencias directo sin incidencias reportadas.
- `scripts/check-seo.mjs` valida ahora también todos los destinos locales detectados en HTML inicial, metadatos sociales, JSON-LD y 404, incluyendo las descargas PDF y el retrato SEO. En esta compilación: 15 destinos locales válidos.
- Prueba de regresión del validador: una referencia temporal al JPG eliminado en JSON-LD provoca el fallo esperado; se restauró la salida y la validación volvió a pasar.
- Se confirmó que ninguno de los archivos retirados permanece en `dist`.
- Comparación del HTML interior del root con la compilación previa: idéntico.
- Sin cambios en favicon, contenido de las cards, contactos, navegación o funcionalidades visibles.

La auditoría no elimina recursos solo porque no sean imágenes visibles: archivos de hosting, licencias, fuentes de diseño y descargas enlazadas se mantienen por su función real. No se publicó ni se modificaron DNS, Cloudflare o GitHub.
