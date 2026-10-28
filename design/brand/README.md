# Recursos de marca — Aarón Andía

Referencia del cliente: `referencia-original.jpeg`. Se conserva como fuente para futuras ediciones y no se publica con la web.

## Recursos activos en public/brand/

- `aaron-andia-logo-completo-transparente.svg`: logo del encabezado y página 404 con AA, nombre y línea dorada. Está compuesto íntegramente por trazados SVG, sin imágenes embebidas ni filtros de transparencia. El nombre se vectorizó desde la referencia original y las AA reutilizan el trazado del isotipo.
- `aaron-andia-logo-completo-blanco.svg`: versión completa blanca sobre fondo transparente para el footer, incluidos los textos inferiores. Está compuesta íntegramente por trazados SVG; reutiliza las AA y el nombre del encabezado, con los descriptores vectorizados desde la referencia original y un refuerzo ligero de sus trazos para tamaños pequeños. No contiene imágenes ni filtros.
- `aaron-andia-isotipo.svg`: trazado de las AA, utilizado como decoración en Contacto y como fuente del favicon.
- `isotipo-32.png`: alternativa PNG del favicon.
- `isotipo-180.png`: icono para Apple Touch Icon, sobre blanco.

`public/favicon.svg` conserva el isotipo y adapta su tinta al tema claro u oscuro.

Las versiones parciales del logo, el logo con papel blanco, los PNG de pruebas y las exportaciones 192/512 sin referencias se retiraron durante la limpieza. Pueden recuperarse desde el historial de Git. El favicon activo no se modificó.

## Aplicación

El componente `Brand` está en `src/App.tsx`; tamaños, versión blanca y comportamiento responsive están en `src/App.css`. Las alturas de navegación se definen en `src/index.css`. La versión del encabezado no incluye los descriptores inferiores; la versión completa del footer sí los conserva.
