# Recursos de marca — Aarón Andía

Referencia proporcionada por el cliente: `referencia-original.jpeg` (26/10/2026).

## Archivos

En `public/brand/`:

- `aaron-andia-logo.png`: aislamiento con transparencia de AA + AARÓN ANDÍA, sin línea dorada ni textos inferiores.
- `aaron-andia-logo.svg`: contenedor con encuadre ajustado del PNG anterior para presentación web. Incluye la imagen dentro del archivo; no es el vector original de la marca.
- `aaron-andia-isotipo.png`: aislamiento transparente de las AA.
- `aaron-andia-isotipo.svg`: trazado geométrico de las dos AA a partir de la referencia; usado para el favicon y la decoración de Contacto.
- `isotipo-32.png`, `isotipo-180.png`, `isotipo-192.png`, `isotipo-512.png`: exportaciones del SVG para pestaña y dispositivos; 180 sobre blanco para Apple Touch Icon.

El favicon raíz `public/favicon.svg` usa el isotipo y adapta su tinta a preferencias claras/oscuras. El header muestra el logo oscuro; el footer usa el mismo archivo con filtro CSS blanco, evitando descargar una segunda copia. La foto original permanece sin modificaciones en esta carpeta de diseño.

## Método y prompts

Se utilizó edición de imágenes integrada (ImageGen), con fondo transparente y el JPEG original como imagen objetivo. Los PNG son versiones aisladas para revisión; no sustituyen un archivo vectorial original facilitado por el diseñador. No se añadieron leyendas ni línea dorada al logo recortado.

Prompt de logo:

> Edit target: attached official Aarón Andía logo. Extract ONLY the complete black logo lockup ABOVE the gold horizontal line: the overlapping asymmetric AA monogram and the exact text AARÓN ANDÍA beneath it. Preserve the exact original shapes, letterforms, accents, proportions, kerning, positioning and solid black color. Remove ALL white background, ALL gold line, and ALL text below that line. Output a tightly framed clean transparent PNG containing only the unchanged black AA and AARÓN ANDÍA lockup, with small even transparent padding. This is an asset extraction, no redesign, no invented lettering, no shadows, no texture.

Prompt de isotipo:

> Edit target: attached official Aarón Andía logo. Extract ONLY the two overlapping asymmetric black capital A shapes (AA monogram) at the top. Preserve their exact original geometry, relative heights and overlap: left A is higher and larger, right A lower. Remove ALL lettering, gold line and ALL white background. Output clean black monogram with genuine alpha transparency, centered on a square canvas with modest even transparent safety padding. Must remain identical to source, no redesign or decorations. Intended for favicon.

## Integración y verificación

Reemplazos en componente Brand (header/footer), favicon/Apple Touch Icon y monograma decorativo de Contacto. H1 y textos de la landing se mantienen como contenido, sin convertirlos en imágenes. Se retiró Cormorant de la carga remota al dejar de utilizarse como marca tipográfica.

Build, lint y TypeScript correctos. Logo renderizado en navegador con transparencia; versión clara verificada sobre footer negro. No overflow en la vista disponible. Cambios locales en main, sin commit/push/deploy.
