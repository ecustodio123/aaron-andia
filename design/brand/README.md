# Recursos de marca — Aarón Andía

Referencia proporcionada por el cliente: `referencia-original.jpeg` (26/10/2026).

## Archivos

En `public/brand/`:

- `aaron-andia-logo.png`: aislamiento con transparencia de AA + AARÓN ANDÍA, sin línea dorada ni textos inferiores.
- `aaron-andia-logo.svg`: contenedor con encuadre ajustado del PNG anterior para presentación web. Incluye la imagen dentro del archivo; no es el vector original de la marca.
- `aaron-andia-isotipo.png`: aislamiento transparente de las AA.
- `aaron-andia-isotipo.svg`: trazado geométrico de las dos AA a partir de la referencia; usado para el favicon y la decoración de Contacto.
- `isotipo-32.png`, `isotipo-180.png`, `isotipo-192.png`, `isotipo-512.png`: exportaciones del SVG para pestaña y dispositivos; 180 sobre blanco para Apple Touch Icon.

El favicon raíz `public/favicon.svg` usa el isotipo y adapta su tinta a preferencias claras/oscuras. El header muestra el logo completo en negro y dorado, sin fondo. El footer usa el mismo logo completo en blanco, también sin fondo. La foto original permanece sin modificaciones en esta carpeta de diseño.

## Método y prompts

Se utilizó edición de imágenes integrada (ImageGen), con fondo transparente y el JPEG original como imagen objetivo. Los PNG son versiones aisladas para revisión; no sustituyen un archivo vectorial original facilitado por el diseñador. No se añadieron leyendas ni línea dorada al logo recortado.

Prompt de logo:

> Edit target: attached official Aarón Andía logo. Extract ONLY the complete black logo lockup ABOVE the gold horizontal line: the overlapping asymmetric AA monogram and the exact text AARÓN ANDÍA beneath it. Preserve the exact original shapes, letterforms, accents, proportions, kerning, positioning and solid black color. Remove ALL white background, ALL gold line, and ALL text below that line. Output a tightly framed clean transparent PNG containing only the unchanged black AA and AARÓN ANDÍA lockup, with small even transparent padding. This is an asset extraction, no redesign, no invented lettering, no shadows, no texture.

Prompt de isotipo:

> Edit target: attached official Aarón Andía logo. Extract ONLY the two overlapping asymmetric black capital A shapes (AA monogram) at the top. Preserve their exact original geometry, relative heights and overlap: left A is higher and larger, right A lower. Remove ALL lettering, gold line and ALL white background. Output clean black monogram with genuine alpha transparency, centered on a square canvas with modest even transparent safety padding. Must remain identical to source, no redesign or decorations. Intended for favicon.

## Integración y verificación

Reemplazos en componente Brand (header/footer), favicon/Apple Touch Icon y monograma decorativo de Contacto. H1 y textos de la landing se mantienen como contenido, sin convertirlos en imágenes. Se retiró Cormorant de la carga remota al dejar de utilizarse como marca tipográfica.

Build, lint y TypeScript correctos. Logo renderizado en navegador con transparencia; versión clara verificada sobre footer negro. No overflow en la vista disponible. Cambios locales en main, sin commit/push/deploy.

## Logo completo (actualización solicitada por el cliente)

`public/brand/aaron-andia-logo-completo.svg` incorpora el JPEG original sin modificar sus píxeles dentro de un contenedor SVG con encuadre ajustado. Conserva AA, nombre, línea dorada, profesión y especialidades. No es una vectorización. Se utiliza en header, footer y página 404. El footer lo presenta sobre un panel blanco para preservar los colores originales. Se ajustaron las alturas del header y los desplazamientos de navegación. Los recursos de favicon e isotipo no se modificaron.

## Transparencia y footer blanco

Se retiró el panel blanco. `public/brand/aaron-andia-logo-completo-transparente.svg` conserva el JPEG original incrustado y elimina el papel mediante un filtro alfa SVG, sin redibujar los trazos ni los textos. El footer y la página 404 aplican el filtro CSS blanco que se utilizaba previamente. El favicon no cambia.

## Legibilidad de la línea de especialidades

La línea inferior se presenta ahora como texto SVG nítido, con el mismo contenido y una tinta dorada de mayor contraste en el encabezado. Se amplió el logo del encabezado y del footer. Las AA, el nombre y la línea de profesión conservan la imagen original; el logo del footer continúa blanco y sin fondo. Se verificó que el menú no se superpone al logo en móvil de 320 px.
