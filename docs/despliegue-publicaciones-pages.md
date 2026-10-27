# Preparación de Kafka Publications para Cloudflare Pages / GitHub

Revisión del 26 de octubre de 2026. No se modificó Kafka Core Admin, Supabase ni sus políticas; no se ejecutaron migraciones remotas. La tabla D1 ya fue migrada por el usuario.

## Configuración confirmada en Cloudflare

- Proyecto Pages `aaron-andia`, repositorio `ecustodio123/aaron-andia`, rama de Production `main`.
- Directorio raíz `/`, comando `npm run build`, salida `dist`, build system v3.
- El despliegue previo del commit `e0a5d5d` registró `Found Functions directory at /functions. Uploading`, compilación correcta del Worker y carga de `_routes.json`. Por tanto la integración GitHub ya publica Functions junto con los archivos estáticos.
- Binding D1 `PUBLICATION_LIMITS` apuntando a `aaron-publication-limits`.
- Las cuatro variables públicas están presentes en Production. El secreto de servidor estaba guardado como Text; durante esta preparación se convirtió a Secret y se comprobó que el cambio persistió. No se imprimió ni copió el valor de la clave privilegiada.
- El dominio propio todavía no figura en Custom domains. Las pruebas de este despliegue se realizan sobre `https://aaron-andia.pages.dev`; conectar `www.andiaespinoza.com` y configurar DNS/HTTPS queda pendiente.

## Variables necesarias en Production

| Nombre | Uso |
| --- | --- |
| `VITE_SUPABASE_URL` | Build del cliente y runtime de Pages Functions |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Build del cliente y consulta anónima de la Function bajo RLS |
| `VITE_STORE_ID` | Tienda fija tanto en el cliente como en el servidor; no la proporciona el visitante |
| `VITE_STORE_VERIFIED` | Guarda de configuración en ambos entornos; debe confirmar la tienda |
| `SUPABASE_SERVICE_ROLE_KEY` | Solo Secret de runtime; nunca prefijar con VITE ni agregar a Git |

El prefijo VITE no impide leer una variable desde Pages Functions: el backend la obtiene de `context.env` y el frontend de `import.meta.env`. Ambas necesitan configuración en Cloudflare; el `.env` local no se sube ni se utiliza en el build remoto.

## Archivos y ruta

Los siguientes archivos están versionados y son necesarios:

- `functions/api/publications/[id]/download.ts`: exporta `onRequest`; recibe el UUID desde el parámetro de ruta de Pages.
- `server/publication-download.ts`: validación, RLS anónima, comprobación de módulo/tienda/estado/tipo/ruta, contador D1 y firma de 60 segundos.
- `shared/publications.ts`: configuración y cliente REST compartidos.
- `src/lib/publications.ts` y `src/components/Publications.tsx`: lectura y descarga desde el navegador.
- `public/_routes.json`: incluye `/api/publications/*`, sin exclusiones; Vite lo copia a `dist/_routes.json`.

El build de Vite produce `dist/`. Después, Cloudflare Pages compila automáticamente `functions/` desde la raíz del checkout, empaquetando sus imports `server/` y `shared/`. No se espera encontrar el código privilegiado dentro del JS cliente ni se debe copiar al directorio público.

La ruta resultante es `POST /api/publications/:id/download`. Un GET a una ruta válida debe recibir 405, no una página HTML; esto confirma enrutamiento, pero **no confirma una descarga de PDF**.

No hay `wrangler.toml` o `wrangler.jsonc` de producción que sobrescriba los bindings del dashboard. `wrangler.local.jsonc` se utiliza exclusivamente cuando un comando local lo selecciona con `--config`.

## Verificación del repositorio y runtime

- Node fijado en `.node-version`: 22.23.4. `package.json` establece el mínimo 22.18.0 para tests con TypeScript nativo y SQLite. Esta versión satisface Vite y Wrangler.
- `npm run validate:publications` ejecuta los 20 tests, lint, TypeScript, build/prerender/SEO, compilación de Functions y guardas de despliegue.
- `scripts/check-publications-deployment.mjs` verifica archivos necesarios versionados, rutas de salida, exclusión de envs, ejemplos vacíos, credenciales privilegiadas y separación del bundle cliente.
- `.env`, `.env.local`, `.dev.vars` y `.wrangler/` están ignorados. Solo se versionan `.env.example` y `.dev.vars.example`, sin valores.
- La revisión del historial de `.env`, `.env.local` y `.dev.vars` no encontró commits de esos archivos. Las credenciales privilegiadas no aparecen en los textos versionados ni en el bundle cliente.
- Las variables públicas y el ID de tienda son configuración visible del cliente por diseño; no se confunden con la clave de servicio.

## Publicación autorizada

1. Ejecutar la validación completa bajo Node 22.23.4.
2. Revisar el diff y agregar únicamente archivos de preparación de Publicaciones.
3. Crear commit y hacer push a `origin/main`; no ejecutar `wrangler deploy` ni migraciones.
4. Esperar el check **Cloudflare Pages** del SHA nuevo. Verificar en el detalle que sea Production, rama main y que compile Functions.
5. Probar desde un navegador sin sesión administrativa una publicación de tipo document publicada. El bucket debe permanecer privado.

La descarga solo se confirma después de recibir el PDF real desde el endpoint desplegado, comprobar cabecera `%PDF-` y un tamaño no nulo. Un build exitoso, un check verde o un GET 405 no bastan.

## Prueba real posterior al push

- Abrir `https://aaron-andia.pages.dev/#publicaciones`.
- Elegir un documento publicado de esta tienda y pulsar Descargar PDF.
- Comprobar descarga efectiva de un PDF, sin exponer ni guardar en el informe la URL firmada ni su token.
- Si falla, registrar únicamente código de estado o mensaje público; no revelar secretos, rutas internas o tokens.
- No cambiar estados de publicaciones ni políticas RLS para forzar la prueba. Los casos de exclusión se cubren con tests locales; no se crean datos ni se archivan publicaciones reales durante esta preparación.

El resultado de la prueba posterior al push se informa al finalizar el trabajo. Este documento es el registro de preparación, no una afirmación anticipada de descarga exitosa.

## Fuentes oficiales

- [Cloudflare: despliegue de Functions con proveedor Git](https://developers.cloudflare.com/pages/functions/get-started/).
- [Cloudflare: raíz del proyecto y directorio de salida](https://developers.cloudflare.com/pages/configuration/build-configuration/).
- [Cloudflare: fijar Node mediante .node-version](https://developers.cloudflare.com/pages/configuration/build-image/).
