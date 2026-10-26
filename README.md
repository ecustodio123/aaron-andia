# Aarón Andía — Landing institucional

Una sola página con React, TypeScript, Vite y Tailwind CSS.

## Desarrollo

`npm install`, `npm run dev`.

Validación: `npm run lint`, `npm run typecheck`, `npm run build`.

## Configuración

Textos, navegación, especialidades, publicaciones y contactos: `src/site.ts`.
Colores: variables en `src/index.css`.

Todos los CTA abren el cliente de correo con destino temporal `mail@mail.com`, asunto y mensaje inicial editables en `src/site.ts`. Las especialidades utilizan asuntos distintos. Reemplazar el correo temporal cuando se confirme el definitivo. No se envían mensajes automáticamente. Las publicaciones aceptan hasta tres enlaces externos.

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
