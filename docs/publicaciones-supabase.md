# Kafka Publications — integración pública

Implementación local en main. Sin commit, push, deploy, escrituras en Supabase, cambios de RLS ni modificaciones en Kafka Core Admin, Commerce o Payments. El archivo `.env` existente se leyó sin modificarlo ni imprimir sus valores.

## Arquitectura y archivos

React + TypeScript + Vite, página prerenderizada y alojamiento Cloudflare Pages. No existía cliente Supabase ni dependencia SDK. Se reutiliza el Data API de Supabase con `fetch`, centralizado y con timeout; no se añade una dependencia al navegador. Wrangler es únicamente una dependencia de desarrollo para compilar y emular Pages Functions.

| Archivo | Función |
| --- | --- |
| `shared/publications.ts` | Configuración pública validada, contrato de metadata y cliente REST reutilizable |
| `src/lib/publications.ts` | Consultas anónimas, deduplicación, caché breve y solicitud de descarga |
| `src/components/Publications.tsx` | Cards, artículos sin enlaces ficticios, skeleton, vacío, error/reintento, más resultados y estados de descarga |
| `server/publication-download.ts` | Autorización de descargas, firma de 60 s y límites de solicitudes |
| `functions/api/publications/[id]/download.ts` | Ruta Pages `POST /api/publications/:id/download` |
| `migrations/d1/0001_publication_download_limits.sql` | Tabla local de contadores; se aplica a Cloudflare D1, no a Supabase |
| `wrangler.local.jsonc` | Configuración exclusiva para emulación local; su ID D1 es local, no un recurso de producción |
| `.env.example`, `.dev.vars.example` | Nombres de configuración, sin valores ni credenciales |
| `tests/publications.test.mjs` | Pruebas de consultas, aislamiento, firma, estados y SQL real del limitador en SQLite |
| `tests/preview-publications.mjs` | Fixtures HTTP y Vite aislados para comprobaciones visuales; nunca forman parte del build |
| `public/_routes.json` | Ejecuta Functions solo en rutas de descargas; el resto sigue estático |

Cambios adicionales: guarda de credenciales públicas en `vite.config.js`, extracción del componente en `src/App.tsx`, retirada de los ejemplos de `src/site.ts`, estilos de estado en `src/App.css`, tipos de entorno en `tsconfig.json`, scripts/dependencia de desarrollo en `package.json` y lockfile, protección de archivos locales en `.gitignore`. Se eliminaron los tres PDFs ficticios, el generador de muestras y su regla de cabecera obsoleta. No se retiró el brochure ni se modificaron otras secciones.

## Variables y tienda

Variables públicas existentes reutilizadas, tanto para el cliente como para la configuración de la Function:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_STORE_ID`
- `VITE_STORE_VERIFIED`

La tienda es exclusivamente `VITE_STORE_ID`, conservado como string para evitar pérdida de precisión de bigint. No se busca por “primera tienda”, nombre o dominio y no se acepta una tienda enviada por el visitante. Se requiere confirmación explícita `VITE_STORE_VERIFIED=true`; es una guarda de configuración, no reemplaza RLS. Se rechazan claves secretas o JWT de rol distinto de `anon` en la configuración del navegador.

Solo servidor, configuración adicional necesaria para descargas:

- `SUPABASE_SERVICE_ROLE_KEY`: secreto Supabase válido o JWT de rol `service_role`. Nunca usar prefijo `VITE_`, nunca colocarlo en el frontend.
- Binding D1 `PUBLICATION_LIMITS`: contadores de solicitudes.

No se generaron credenciales nuevas. Los ejemplos no contienen valores. El build del navegador contiene las variables públicas por diseño; ni el secreto ni el código privilegiado se importan desde el frontend. Vite cancela el build si detecta claves secretas, JWT no anónimos o variables de credenciales privilegiadas bajo el prefijo público; esta guarda se probó con una credencial ficticia insegura, sin imprimir valores. [Supabase distingue expresamente las claves publicables y las secretas](https://supabase.com/docs/guides/getting-started/api-keys).

## Consulta pública

Se consulta `public.publications` con la clave publicable, sin login ni sesión administrativa:

- Campos: `id,store_id,title,slug,summary,category,publication_type,status,display_order,published_at`.
- Filtros: tienda configurada y `status=published`.
- Orden: `display_order` ascendente, `published_at` descendente con nulos al final y `id` ascendente como desempate.
- Páginas de 12 resultados; se pide una fila adicional para saber si existe la siguiente. “Ver más publicaciones” añade resultados, sin repetir IDs.
- No se solicitan `pdf_storage_path`, `pdf_original_name`, autores ni contenido privado con credenciales anónimas; Kafka Core restringe esas columnas.
- Cada respuesta también se valida antes de mostrarse: tienda, estado, tipo y estructura. Una respuesta inválida no se representa.
- Peticiones simultáneas iguales se deduplican, incluida la doble ejecución de efectos de StrictMode. Caché de éxito de 5 s; los errores no se cachean. La primera página se actualiza cada 60 s mientras está visible y al recuperar foco después de ese plazo. Al expandir páginas se conserva la lista hasta recargar; no se reinicia la lectura por un temporizador.

El HTML prerenderizado incluye el encabezado de la sección y el estado de carga; las publicaciones se consultan al abrir la web, sin depender de un nuevo despliegue. No se dejan snapshots de publicaciones archivadas en el HTML ni se añaden artículos falsos al JSON-LD. Una publicación de tipo article muestra sus metadatos, sin navegación ni descarga; la experiencia de detalle de artículos sigue pendiente y no se inventan rutas.

## Descarga autorizada

El navegador envía únicamente el UUID en la ruta, por POST. El servidor nunca recibe una ruta Storage ni una tienda del visitante.

1. Valida método, UUID y origen cuando se proporciona.
2. Requiere configuración, credencial privilegiada y D1; si falta alguno, falla cerrado.
3. Limita por IP/tienda y por tienda completa.
4. Comprueba con la clave pública que el registro sea visible bajo la RLS anónima existente.
5. Consulta `store_features` en servidor y exige `publications_enabled=true` para la tienda configurada.
6. Obtiene el registro completo en servidor y vuelve a comprobar UUID, tienda, estado publicado, tipo document y PDF vinculado.
7. Valida la ruta contra el namespace de Kafka Core: `{store_id}-{store_slug}/publications/{publication_uuid}-{publication_slug}/documento-{uuid}.pdf`. Rechaza rutas de otra tienda, otro registro o rutas arbitrarias.
8. Solicita firma de 60 s exclusivamente para ese objeto de `publication-files`. No llama `getPublicUrl`, no cambia el bucket ni sus políticas, ni reutiliza la firma administrativa de Kafka Core.
9. Devuelve solo `{url,expiresIn}`, sin cachear. El cliente verifica proyecto, ruta de firma y token; Storage recibe la opción de descarga con un nombre saneado. Los errores son genéricos y no exponen rutas, errores de Supabase ni secretos.

Los límites son 10 solicitudes/minuto por IP y tienda, y 120/minuto por tienda. Los incrementos son atómicos en SQLite/D1. Se utiliza `CF-Connecting-IP`, se conserva un hash en el contador y no se registra la IP en claro. Las solicitudes autorizadas programan limpieza de ventanas de más de 24 h. Un fallo del contador no permite saltarse los límites. D1 persistente evita confiar en contadores de memoria por proceso. Puede complementarse con reglas WAF de Cloudflare si aumenta el tráfico.

La firma concede acceso hasta su expiración: archivar un registro impide nuevas firmas, pero una URL ya emitida puede seguir funcionando durante los segundos restantes. El bucket permanece privado. [Documentación de Storage privado y firmas](https://supabase.com/docs/guides/storage/serving/downloads).

## SQL e infraestructura: qué falta configurar

**Supabase:** no se requiere ni se ejecutó SQL adicional si el contrato Publications V1 ya está aplicado. Se revisó el código local de Kafka Core Admin en modo lectura para confirmar `store_features`, las columnas anónimas permitidas y el formato de Storage. No se alteró ese repositorio. Una instalación distinta debe verificar ese contrato antes de publicar; no se crean políticas permisivas para resolver errores.

**Cloudflare:** se requiere desplegar la Pages Function, añadir el secreto de servidor y un binding D1. No se necesita una Supabase Edge Function en esta arquitectura.

Antes del despliegue autorizado:

1. Crear una base D1 para los contadores en Cloudflare y vincularla a Pages como `PUBLICATION_LIMITS`.
2. Aplicar `migrations/d1/0001_publication_download_limits.sql` a esa base D1. Es SQL de infraestructura nueva; no ejecutarlo en Supabase.
3. Configurar las cuatro variables públicas existentes para build y runtime de Pages, y el secreto `SUPABASE_SERVICE_ROLE_KEY` únicamente como secreto del runtime. No compartir sus valores en informes o capturas.
4. Desplegar el proyecto con Pages Functions habilitadas, incluyendo `functions/`, no solo arrastrando `dist` como archivos estáticos. Revisar configuración de preview/producción por separado. `wrangler.local.jsonc` no es una configuración de despliegue remoto.
5. Comprobar descarga anónima de un PDF real publicado, rechazo tras archivarlo y límites 429. No exponer `publication-files` como público ni añadir SELECT anónimo a `storage.objects`.

[Cloudflare documenta los bindings de Pages Functions](https://developers.cloudflare.com/pages/functions/bindings/) y su [emulación local](https://developers.cloudflare.com/pages/functions/local-development/).

## Pruebas locales

Requiere Node con soporte de TypeScript nativo y `node:sqlite` para las pruebas (Node 22.18+; esta revisión usa Node 25). La web no depende de SQLite ni Node en el navegador.

```sh
npm install
npm run test:publications
npm run lint
npm run build
npm run check:functions
```

`npm run dev` y `npm run preview` prueban la lectura pública con las variables actuales. Estos servidores estáticos no ejecutan la ruta Pages: una descarga no debe darse por validada allí.

Para emular frontend y Function juntos:

1. Copiar `.dev.vars.example` a `.dev.vars`, ignorado por Git.
2. Completar las cuatro variables públicas con los valores existentes de `.env` y el secreto de servidor por un canal seguro. No modificar `.env` ni poner el secreto en él con prefijo VITE.
3. Ejecutar:

```sh
npm run build
npm run db:local
npm run dev:pages
```

Abrir `http://localhost:8788/#publicaciones`. `db:local` actúa únicamente sobre la base emulada. No se ejecutaron migraciones remotas.

Para los estados visuales sin Supabase:

```sh
npm run dev:publications-fixture
```

Abrir `http://127.0.0.1:5190/#publicaciones`. El API de fixtures escucha únicamente en loopback, puerto 5201. `GET /scenario?name=populated|empty|error|slow` cambia el caso local, luego recargar la web. Las descargas de este entorno fallan intencionalmente para probar el mensaje de error. `/metrics` permite contar lecturas y verificar la deduplicación. Nada de este entorno se importa en producción ni cambia datos reales.

## Evidencias y límites de validación

- 20 pruebas automatizadas correctas: alta publicada en fixture, exclusión de draft/archived/otra tienda, orden/paginación, firma autorizada, validaciones, rechazos y límites con SQL real en SQLite.
- TypeScript, lint, build con prerender y chequeos SEO correctos; bundle de Pages Functions compilado.
- Migración D1 local ejecutada correctamente; sin conexión a bases remotas para esa operación.
- Lectura anónima real: inicialmente cero registros; una comprobación posterior devolvió una publicación de la tienda configurada. No se creó ni editó ningún registro remoto durante estas pruebas.
- Fixtures visuales: documentos y artículos, 12 resultados iniciales y 15 tras “Ver más”, error individual de descarga sin bloquear tarjetas, vacío y recuperación de error mediante Reintentar. StrictMode: una lectura para un montaje inicial, sin consultas duplicadas.
- Responsive comprobado con cards de título largo en escritorio, tablet 834 × 1112 y móvil 320 × 740: sin desbordamiento y acciones de descarga superiores a 44 px de alto.
- **Pendiente para producción:** configurar el secreto/binding y desplegar la Function; probar un PDF real en Storage con visitante anónimo, RLS remoto para borradores/archivados/otra tienda, y revocación/expiración. No se da por realizada una descarga privada real cuando todavía falta ese runtime autorizado.
