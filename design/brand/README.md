# Recursos de marca — Aarón Andía

Referencia del cliente: `referencia-original.jpeg`. Se conserva como fuente para futuras ediciones y no se publica con la web.

## Recursos activos en public/brand/

- `aaron-andia-logo-completo-transparente.svg`: logo completo del encabezado, footer y página 404. Contiene el JPEG original con filtro de transparencia; no es una vectorización completa. La línea de especialidades está compuesta como texto SVG para mejorar su legibilidad. El footer y la página 404 lo muestran en blanco mediante CSS.
- `aaron-andia-isotipo.svg`: trazado de las AA, utilizado como decoración en Contacto y como fuente del favicon.
- `isotipo-32.png`: alternativa PNG del favicon.
- `isotipo-180.png`: icono para Apple Touch Icon, sobre blanco.

`public/favicon.svg` conserva el isotipo y adapta su tinta al tema claro u oscuro.

Las versiones parciales del logo, el logo con papel blanco, los PNG de pruebas y las exportaciones 192/512 sin referencias se retiraron durante la limpieza. Pueden recuperarse desde el historial de Git. El favicon activo no se modificó.

## Aplicación

El componente `Brand` está en `src/App.tsx`; tamaños, versión blanca y comportamiento responsive están en `src/App.css`. Las alturas de navegación se definen en `src/index.css`. Las palabras de la línea inferior del logo permanecen en el SVG y deben conservar los acentos.
