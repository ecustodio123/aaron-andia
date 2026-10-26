# Incorporación del brochure institucional 2026

Fuente local proporcionada por el cliente: `/Users/enriquecustodio/Downloads/Brochure institucional 2026.pdf`.

## Alcance

- La página 2 aporta retrato, perfil y siete elementos de formación. Se extrajo la imagen JPEG embebida sin modificarla: `public/images/aaron-andia-retrato.jpg` (900 × 1374).
- Quién soy conserva `#sobre-mi`. El perfil sustituye la introducción genérica; el enfoque y sus tres pilares siguen integrados en ese bloque. La formación se consulta mediante `details/summary`, sin dependencias ni rutas adicionales.
- Las páginas 4–5 aportan los indicadores +80 / +9 / +7 y cuatro experiencias. Se prepararon resúmenes editoriales, manteniendo los importes y el resultado descrito por el cliente.
- La participación como árbitro está identificada expresamente en el caso de computadoras. No se atribuyó patrocinio ni un cargo a los otros casos cuando el brochure no lo especifica.
- Experiencia se ubica tras Áreas y antes de la banda de infraestructura. Nueva ancla `#experiencia`, añadida a header y footer.
- Se conserva el correo temporal `mail@mail.com` por instrucción explícita del usuario, aunque el brochure contiene otros canales. No se incorporaron sus enlaces de contacto ni un enlace público al PDF.
- No se publicaron datos distintos de los proporcionados ni se realizó una verificación externa de los antecedentes o laudos; el contenido se basa en el material del cliente.

## Verificación

- Lint, TypeScript y build correctos.
- Viewports embebidos de 375, 768, 1280 y 1440 × 936 px. Anchos útiles/contenido: 360/360, 753/753, 1265/1265 y 1425/1425; 15 px corresponden a scrollbar. No hubo desbordamiento horizontal.
- Cero enlaces internos sin destino y cero acciones visibles por debajo de 44 × 44 px en esas mediciones.
- Cuatro casos presentes y retrato cargado.
- Formación: apertura/cierre por Enter y siete elementos comprobados.
- Apertura directa de `#experiencia` después de recarga: foco en H2 y estado activo Experiencia.
- Todos los enlaces de contacto siguen dirigidos a `mailto:mail@mail.com`; no se enviaron mensajes.
- Capturas de perfil y experiencia revisadas en móvil y desktop; ajustes de espaciado y alineación de cifras tras revisión.
- La página auxiliar de QA se retiró antes del build final. No se añadieron paquetes.

## Archivos

Textos y métricas en `src/site.ts`; componentes About y Experience en `src/App.tsx`; estilos de perfil y experiencia en `src/App.css`. Las notas de auditoría anteriores describen iteraciones previas: el brochure recibido ahora aporta la biografía y antecedentes que antes faltaban.

Entrega local sobre main. Sin commit, push ni deploy.
