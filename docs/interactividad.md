# Interactividad de experiencia y contacto

> Registro histórico de la versión revisada. Para el estado actual y la limpieza de recursos, consultar `README.md` y `docs/auditoria-repositorio.md`.


## Cambios

- Contadores +80, +9 y +7: animación lineal de 1.6 segundos mediante requestAnimationFrame al entrar en pantalla. Cada contador se ejecuta una vez por montaje; volver a la sección no lo reinicia.
- La cifra final permanece en un texto accesible estático. Los incrementos visuales están ocultos a lectores de pantalla; no se anuncian decenas de cambios.
- La anchura final se reserva antes del conteo, evitando que cambie la composición con cada dígito.
- prefers-reduced-motion mantiene los valores finales. Un cambio a movimiento reducido cancela el conteo activo. Observadores, frames y listeners se limpian al desmontar.
- Los cuatro casos admiten abrir/cerrar su detalle con summary/details nativos. El primero aparece abierto. Cada caso incluye una consulta por correo con asunto propio.
- Botón Copiar correo en Contacto, con confirmación mediante estado accesible y mensaje explícito si el navegador no permite copiar.
- Se asegura el desplazamiento inicial al abrir un enlace con hash después del montaje de React.

## Verificación ejecutada

- La observación de mutaciones del DOM registró el paso +0, +1, +2…+80; +0…+9; +0…+7, con resultados finales correctos. Los valores accesibles permanecieron +80, +9 y +7.
- Navegar a Inicio y regresar a Experiencia conserva los resultados finales, sin reiniciar.
- Apertura/cierre de un caso por Enter comprobados.
- Copiar correo devolvió la confirmación Correo copiado en el navegador integrado. No se enviaron correos.
- Sin desbordamiento horizontal en la vista principal durante esta prueba.
- Build, lint, typecheck y diff --check correctos. Sin librerías adicionales.

La preferencia real de movimiento reducido y el rechazo de permiso del portapapeles no se forzaron durante la prueba. Ambas ramas están implementadas, sin presentarlas como una validación manual completada. El navegador de prueba tenía movimiento reducido desactivado.

La página temporal que registró los contadores se eliminó antes de la compilación final. Cambios locales en main, sin commit, push ni deploy.
