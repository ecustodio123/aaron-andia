# Revisión responsive completa — 26/10/2026

## Alcance y método

Se revisaron Inicio, Quién soy, Áreas, Experiencia, banda de infraestructura, Publicaciones, Contacto y Footer en 12 viewports CSS. Cada viewport se creó con la misma landing dentro de un iframe temporal del tamaño indicado, medido desde su DOM. Se capturaron las ocho zonas antes y después y se inspeccionaron composiciones representativas de teléfono, iPad vertical/horizontal y laptop. No se instaló ninguna herramienta ni librería nueva.

La escala aplicada al iframe solo permite ver su captura en la ventana de revisión; los breakpoints y medidas corresponden al viewport interno real. No es emulación de hardware, Safari iOS ni red móvil.

## Hallazgos y correcciones

1. A 320 px con scrollbar clásica el `min-width:320px` del body excedía el ancho útil de 305 px. Se retiró el mínimo: el documento ya se adapta a su ancho disponible. No se ocultó el defecto con overflow-x:hidden.
2. Teléfonos estrechos: H1 a 52 px bajo 360, CTA con padding/tracking ajustados y menos padding interior en servicios; se mantienen 56 px a 375/390.
3. Retrato móvil: máximo 280 px y centrado, conservando la proporción completa de la imagen original. La composición a dos columnas en iPad/laptop permanece.
4. Footer móvil: logo proporcionado a 100 px de alto y navegación en dos columnas. Se conservan texto, LinkedIn, correo y targets táctiles.
5. Contacto en iPad horizontal (1024–1199): contenido y microguía en dos columnas, con acción bajo la introducción.
6. Menú táctil: cada enlace ocupa la fila completa; el panel conserva scroll propio y overscroll containment. El indicador y el foco permanecen visibles.
7. Móvil horizontal: se redujeron espacios del hero para aprovechar el alto; el contenido puede crecer y desplazarse sin alturas fijas que lo corten.
8. Se permiten saltos en datos de contacto y se evita que elementos de grid fuercen anchos mayores que sus columnas.

## Matriz final

| Viewport CSS | Ancho útil / contenido | Secciones comprobadas | Desbordamiento horizontal | Acciones menores de 44 × 44 |
| --- | --- | --- | --- | --- |
| 320 × 568 | 305 / 305 | 8 | No | Ninguna |
| 375 × 812 | 360 / 360 | 8 | No | Ninguna |
| 390 × 844 | 375 / 375 | 8 | No | Ninguna |
| 430 × 932 | 415 / 415 | 8 | No | Ninguna |
| 768 × 1024 | 753 / 753 | 8 | No | Ninguna |
| 820 × 1180 | 805 / 805 | 8 | No | Ninguna |
| 1024 × 768 | 1009 / 1009 | 8 | No | Ninguna |
| 1180 × 820 | 1165 / 1165 | 8 | No | Ninguna |
| 1280 × 800 | 1265 / 1265 | 8 | No | Ninguna |
| 1366 × 768 | 1351 / 1351 | 8 | No | Ninguna |
| 1440 × 900 | 1425 / 1425 | 8 | No | Ninguna |
| 844 × 390 | 829 / 829 | 8 | No | Ninguna |

La diferencia de 15 px corresponde a la scrollbar clásica del navegador de revisión. Las 96 comprobaciones finales no mostraron texto fuera del documento ni imágenes rotas en los recursos observados.

## Estados interactivos

- Se abrieron Formación y todos los casos, y se repitieron las mediciones en los 12 viewports: sin overflow, sin texto fuera del ancho y sin targets menores de 44 px.
- Menú en 844 × 390: altura 318 px, scroll interno activo; enfocar el último enlace lo desplazó hasta dejarlo dentro de los límites del panel.
- Cambio de móvil con menú abierto a laptop 1280: estado móvil cerrado, navegación desktop visible. Regreso a 375: panel cerrado y hidden, sin overlay residual.
- Se mantienen los contadores y detalles nativos, correo temporal y LinkedIn. No se enviaron mensajes ni se abrieron aplicaciones externas en esta revisión.

## Verificación técnica

`npm run build`, `npm run lint`, `npm run typecheck` y `git diff --check` completados correctamente. La página temporal de QA se retiró antes de compilar la entrega final. Los cambios responsive afectan solo a `src/App.css` y `src/index.css`, además de este registro; se preservan los cambios locales anteriores.

## Límites

Pendientes de comprobar en dispositivos físicos: Safari en iPhone/iPad, barras dinámicas del navegador y teclado virtual. No se configuró zoom real al 200 %, lector de pantalla ni preferencias del sistema durante esta revisión. No se midieron Core Web Vitals ni se certifica accesibilidad completa. Las pruebas realizadas cubren el layout y los estados descritos, no hardware real ni todos los navegadores.

Entrega local en main, sin commit, push ni deploy.
