# Revisión local de narrativa y legibilidad — 24/10/2026

## Cambios

- Enfoque sustituye el rótulo Sobre mí conservando `#sobre-mi`; título editorial, textos profesionales existentes y tres pilares derivados de la oración original.
- Header estable de 88 px desde 1200 y 72 px debajo. Menú con cierre exterior, Escape, retorno de foco y selección de ancla con foco en el título.
- Cuerpo 16–18 px, acciones 13 px, footer mínimo 13/14 px y targets de al menos 44 × 44 px.
- CTA general Consultar por WhatsApp; mensajes diferentes para las tres especialidades.
- Banda existente con CTA accesible; en móvil la imagen y la franja de texto se separan.
- Publicaciones compactas, sin flecha ni acciones en el vacío; lista real vacía y presentación futura de destacada + dos secundarias.
- Contacto incluye orientación para escribir la consulta. Footer sin lista repetida de especialidades.
- Motion progresivo con IntersectionObserver/Web Animations; sin dependencias nuevas y contenido visible si no se inicializa. Reduced motion evita reveal y smooth scroll.

## Verificación ejecutada

- `npm run build`, `npm run lint` y `npm run typecheck`: correctos.
- Navegador integrado: `innerWidth × innerHeight = 494 × 724`; ancho útil del documento 479 px por scrollbar. No representa un dispositivo de 480 px ni una aprobación de los breakpoints solicitados.
- Ancho de contenido 479 px: sin overflow horizontal.
- Menú: abrir, Tab hacia Inicio, Shift+Tab al botón, Escape con retorno de foco, clic exterior y selección Enfoque: comprobados.
- Hash directo `#contacto`: sección a 88.11 px bajo header de 72 px; separación efectiva 16.11 px. Enfoque a 88.17 px.
- Navegación atrás/adelante ejecutada. Contacto recupera el hash y estado activo. No constituye validación completa del historial en todos los tamaños.
- Todos los href internos tienen destino. H1 único. Cero acciones en Publicaciones vacías.
- Acciones visibles medidas: ninguna con ancho o alto inferior a 44 px en el viewport disponible.
- Tres mensajes de especialidad inspeccionados y distintos; teléfono 51960869846. No se enviaron mensajes ni se abrió WhatsApp en las pruebas.
- Capturas de hero, Enfoque, áreas y Contacto revisadas en el viewport disponible.
- Consola del navegador: sin errores ni advertencias capturados.
- Imágenes originales y textos profesionales conservados; sin biografía, metodología, sectores, artículos o credenciales adicionales.

## Contraste calculado en colores sólidos

Luminancia relativa sRGB, relación `(Lmayor + .05) / (Lmenor + .05)`:

| Texto / fondo | Relación |
| --- | --- |
| #80672e / #ffffff | 5.39:1 |
| #666666 / #ffffff | 5.74:1 |
| #aaaaaa / #0b0b0b | 8.47:1 |
| #cbb47f / #0b0b0b | 9.72:1 |
| #0b0b0b / #b99a52 | 7.32:1 |
| #b99a52 / #0b0b0b | 7.32:1 |
| #57574e / #ffffff | 7.30:1 |

Estos resultados no certifican todos los píxeles sobre fotografía, todos los estados ni accesibilidad completa. El hero y la banda usan overlay para apoyar legibilidad.

## Matriz de layout comprobada

Se utilizó una página local temporal de QA que embebía la misma landing en un iframe del ancho indicado y 936 px de alto. Se midió el viewport real del iframe mediante su DOM y se capturaron hero, Enfoque, áreas y Contacto en los siete anchos. Las capturas de desktop se ajustaron visualmente al ancho disponible de la ventana; las medidas de layout corresponden al iframe, no al tamaño de la captura. No representa emulación de hardware ni red móvil. La página de QA fue retirada al terminar.

| Viewport CSS | Ancho útil / contenido | Header | Acciones visibles menores de 44 × 44 |
| --- | --- | --- | --- |
| 1920 × 936 | 1905 / 1905 | 88 | Ninguna |
| 1440 × 936 | 1425 / 1425 | 88 | Ninguna |
| 1280 × 936 | 1265 / 1265 | 88 | Ninguna |
| 1024 × 936 | 1009 / 1009 | 72 | Ninguna |
| 768 × 936 | 753 / 753 | 72 | Ninguna |
| 390 × 936 | 375 / 375 | 72 | Ninguna |
| 375 × 936 | 360 / 360 | 72 | Ninguna |
| 768 × 390 (horizontal) | 753 / 753 | 72 | Ninguna |

La diferencia de 15 px corresponde a la scrollbar del navegador de prueba. H1 único en todas las mediciones. Se revisaron capturas de las composiciones desktop, tablet y móvil, además de la banda con CTA en 375 y Publicaciones en 1440.

Cambio de breakpoint con menú abierto: 375 (abierto, nav visible) → 1280 (estado móvil cerrado, nav desktop visible) → 375 (nav con `hidden`, cerrado). Captura del menú en 375 guardada durante QA. En el navegador principal se comprobó de nuevo Escape y ocultación semántica después del ajuste final.

Se corrigió durante QA el indicador activo de Publicaciones: la aparición de Contacto más abajo ya no adelanta el estado activo; se comprobó `aria-current` en Publicaciones con la sección alineada a 87.59 px bajo el header de 72 px.

Pendientes: zoom real al 200 %, preferencia reduced motion real, lector de pantalla y medición de Core Web Vitals. La implementación incluye reglas reduced motion y manejo de estado, pero no se presenta como prueba manual superada de esa preferencia. El contraste sobre fotografías no se certifica píxel a píxel.

## Comparación de build

Antes: JS 229.36 kB / gzip 71.42; CSS 18.64 kB / gzip 5.08.
Después: JS 232.37 kB / gzip 72.28; CSS 20.34 kB / gzip 5.42. Incremento pequeño sin nuevas dependencias ni cambios de imágenes. No se atribuye mejora de LCP o CLS sin medición.

## Entrega

Cambios locales sobre `main`, sin commit, push ni deploy. Revisar copy de Enfoque y microguía; credenciales del subtítulo siguen pendientes de confirmación. Biografía, FAQ, metodología y sectores quedan fuera de esta iteración.
