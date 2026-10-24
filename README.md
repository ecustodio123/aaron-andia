# Aarón Andía — Landing institucional

Una sola página con React, TypeScript, Vite y Tailwind CSS.

## Desarrollo

`npm install`, `npm run dev`.

Validación: `npm run lint`, `npm run typecheck`, `npm run build`.

## Configuración

Textos, navegación, especialidades, publicaciones y contactos: `src/site.ts`.
Colores: variables en `src/index.css`.

Confirmar las credenciales del subtítulo antes de publicar. Los CTA abren WhatsApp al +51 960 869 846 con un mensaje inicial editable en `src/site.ts`. No envían mensajes automáticamente. Las publicaciones aceptan hasta tres enlaces externos.

## Imágenes

Hero: fotografía de balanza de justicia y mazo por Sora Shimazaki, Pexels: https://www.pexels.com/photo/judges-desk-with-gavel-and-scales-5669619/. Banner: imagen del documento de referencia, con encuadre que oculta la etiqueta de captura. No se presentan como proyectos del profesional.

## Cloudflare Pages

Comando de compilación: `npm run build`. Directorio de salida: `dist`.
No requiere backend ni variables de entorno. La URL provisional de los metadatos es `https://aaron-andia.pages.dev/`. Al confirmar el dominio definitivo, reemplazar ese origen en `index.html` (canonical, Open Graph y Twitter).

## Vista previa al compartir

Imagen social: `public/images/aaron-andia-social.png` (1200 × 630). Fuente editable: `design/social-card.svg`. Los metadatos están en el HTML inicial para que puedan leerlos los rastreadores sin ejecutar JavaScript.

Los cambios aparecen en el enlace público después del despliegue. Algunas aplicaciones conservan en caché tarjetas anteriores.
