# Newsreader + Inter — revisión local

> Registro histórico de la versión revisada. Para el estado actual y la limpieza de recursos, consultar `README.md` y `docs/auditoria-repositorio.md`.


Cambio limitado a tipografía. Componentes, contenido, imágenes, colores, navegación y funcionalidad no se modificaron.

## Carga

- Paquete npm: `@fontsource-variable/newsreader@5.3.0`.
- Se inspeccionaron `package.json`, `opsz.css`, `opsz-italic.css` y `metadata.json` del paquete. Sus exports permiten importar los archivos WOFF2 directamente.
- `src/fonts.css` referencia exclusivamente:
  - `@fontsource-variable/newsreader/files/newsreader-latin-opsz-normal.woff2`
  - `@fontsource-variable/newsreader/files/newsreader-latin-opsz-italic.woff2`
- Las declaraciones locales reproducen nombre `Newsreader Variable`, estilos normal/italic, pesos 200–800, `font-display: swap` y rango Unicode latino del paquete. Según sus metadatos, los archivos opsz mantienen los ejes óptico y de peso. No se bloquean con `font-variation-settings`.
- El subset latino incluye los caracteres españoles solicitados en el rango U+0000–00FF. `document.fonts.check` para normal e italic con `Ááóíñü¿¡` devolvió true; se revisaron visualmente los títulos españoles.
- La licencia OFL del paquete se conserva y se distribuye también como `public/licenses/Newsreader-OFL.txt`.
- Solo dos WOFF2 de Newsreader en build y dos solicitudes de Newsreader en la sesión de prueba. No se carga Newsreader desde Google Fonts ni se añadieron preloads.
- Cormorant se limita a normal 700 en la petición remota y al token de marca del header/footer. Inter conserva su carga y uso existentes.

## Sistema

- `--font-editorial`: Newsreader Variable, Newsreader, Georgia, serif.
- `--font-brand`: Cormorant Garamond, Georgia, serif.
- H1/H2 400, H3 500; cursivas de H2 400; romanos 400. `font-optical-sizing: auto` y `font-synthesis: none`.
- El nombre envuelve en dos líneas en móvil. La marca conserva familia, peso y tamaños originales.
- Los textos funcionales continúan con Inter; botones 13 px. No se añadieron pesos o estilos sintéticos.

## Resoluciones comprobadas

Se utilizó la misma landing en un iframe temporal del ancho indicado, 936 px de alto, capturado mediante el navegador integrado. La página auxiliar se eliminó al finalizar. No es emulación de hardware ni prueba de red móvil.

| Viewport | Ancho útil / contenido | H1 | H2 | H3 |
| --- | --- | --- | --- | --- |
| 375 × 936 | 360 / 360 | 56 | 36 | 28 |
| 390 × 936 | 375 / 375 | 56 | 36 | 28 |
| 768 × 936 | 753 / 753 | 80 | 44 | 30 |
| 1024 × 936 | 1009 / 1009 | 92 | 44 | 30 |
| 1440 × 936 | 1425 / 1425 | 108 | 56 | 34 |
| 1920 × 936 | 1905 / 1905 | 120 | 56 | 34 |

Medidas en CSS px; diferencia de 15 px por scrollbar. Sin overflow horizontal ni acciones visibles menores de 44 × 44 px. Newsreader normal/italic cargadas en todas las mediciones; estilos computados: pesos 400/500, óptico auto, síntesis none. Inter sigue en body y CTA; Cormorant 700 en marca.

Se capturaron hero, Enfoque y áreas en los seis anchos. Se revisaron composiciones representativas de móvil, tablet y desktop. También se guardaron capturas comparables de portada y Enfoque antes/después en la vista principal (494 × 724, ancho útil 479).

Menú móvil y selección de Áreas comprobados en la vista principal: se cierra y transfiere foco al título; hash correcto. Se conservan las reglas de anclas y todos sus IDs.

## Límites

No se pudo configurar zoom real del navegador al 200 % con la API disponible: pendiente. No se midieron CLS/LCP ni el desplazamiento durante una carga de fuentes sin caché; no se afirma mejora de rendimiento. `swap`, familias de respaldo y dimensiones/flujo natural se mantienen, pero no equivalen a una medición de layout shift.

## Validación y entrega

`npm run lint`, `npm run typecheck`, `npm run build` y `git diff --check`: correctos.

Build: dos WOFF2 latinos (132.00 kB normal + 146.87 kB italic). CSS 21.50 kB / gzip 5.74; JS sin cambio funcional. Los tamaños de archivo no son métricas de experiencia de carga.

Cambios locales sobre main; sin commit, push ni deploy. Archivos de aplicación modificados: `src/index.css`, `src/App.css`, nuevo `src/fonts.css`, `package.json`, `package-lock.json` y licencia distribuida.
