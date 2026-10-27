# SEO — Aarón Andía

Dominio canónico: https://www.andiaespinoza.com/
Revisión: 26 de octubre de 2026. Implementación local en main, sin commit ni despliegue.

## Palabras clave y contenido

Propuesta basada en los servicios y la trayectoria ya proporcionados por el cliente. No se han medido volúmenes de búsqueda, dificultad ni posiciones; estas expresiones son objetivos editoriales, no resultados garantizados.

| Grupo | Consultas objetivo | Ubicación y propósito |
| --- | --- | --- |
| Marca | Aarón Andía; Aarón Andía abogado; Aarón Andía árbitro | Título, H1, perfil y LinkedIn: identificar al profesional |
| Arbitraje | abogado de arbitraje en Perú; árbitro en Perú; arbitraje en infraestructura | Título, presentación, especialidad y casos |
| Contratación pública | abogado de contratación pública en Perú; asesoría en contratación pública; controversias en obras públicas | Título, descripción, especialidad y experiencia |
| Dispute Boards | asesoría en Dispute Boards en Perú; prevención de controversias en infraestructura; JRD y JPRD | Especialidad, perfil y métricas del brochure |
| Contexto profesional | controversias contractuales; derecho de la construcción; Obras por Impuestos; Asociaciones Público-Privadas | Perfil y casos existentes, sin crear servicios o credenciales adicionales |
| Ubicación | abogado y árbitro en Lima, Perú | Ciudad visible en Contacto, tomada del brochure; sin inventar dirección de oficina |

Las palabras clave se integran de forma natural. No se añadió `meta keywords`: [Google indica que la ignora para indexación y posicionamiento](https://developers.google.com/search/docs/crawling-indexing/special-tags). No se añaden ciudades repetidas, texto oculto, testimonios, premios ni artículos ficticios.

## Implementación

- `src/seo.ts` centraliza dominio, título, descripción, tarjeta social y JSON-LD. `src/site.ts` mantiene la información profesional.
- Título: **Aarón Andía | Arbitraje y Contratación Pública en Perú**.
- Descripción: **Abogado y árbitro en Perú. Asesoría en arbitraje, contratación pública y Dispute Boards para prevenir y resolver controversias en infraestructura.**
- Canonical, Open Graph y Twitter apuntan al dominio oficial. Imagen social PNG 1200 × 630, con URL absoluta y texto alternativo.
- Idioma `es-PE`, un único H1, secciones y enlaces internos descriptivos, imágenes informativas con alt, decorativas con alt vacío.
- JSON-LD: WebSite, WebPage, Person y tres Service conectados mediante identificadores. Incluye LinkedIn confirmado, formación UPC y Lima, Perú. No incluye correo temporal, teléfono, dirección postal, reseñas ni datos inventados. No se presenta como una ficha LocalBusiness sin información de oficina validada.
- La compilación genera contenido completo dentro de `dist/index.html` mediante React server rendering. El navegador hidrata ese HTML y conserva menús, contadores y desplegables. El contenido sigue disponible sin JavaScript. [Google recomienda considerar prerenderizado y recuerda que otros robots pueden no ejecutar JavaScript](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).
- Fotos usadas en WebP: hero 171 KB, retrato 67 KB, banner 56 KB; dimensiones reservadas, hero prioritario y fotos inferiores con carga diferida. Originales conservados. Las tres fotos pasan de 1.272.635 a 293.732 bytes: 76,9 % menos de peso.
- `robots.txt` permite rastreo y anuncia sitemap. `sitemap.xml` contiene solo la URL canónica real, sin fragmentos ni páginas inexistentes. Actualizar `lastmod` cuando cambie materialmente el contenido, no en cada compilación. [Guía de Google para sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
- `404.html` evita el fallback SPA de Cloudflare en rutas inexistentes y usa noindex; no se crean rutas para cada ancla. [Comportamiento de Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/serving-pages/).
- `_headers` permite caché prolongada exclusivamente de assets con hash. `_redirects` normaliza `/index.html` a `/`.
- El correo sigue siendo `aaron@andiaespinoza.com` por instrucción del cliente. Su texto visible está marcado `data-nosnippet` para evitar que Google lo use en fragmentos; no se incluye en JSON-LD. Debe reemplazarse por el correo confirmado antes del lanzamiento.

## Validación reproducible

```sh
npm run lint
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
npm run check:seo
```

`build` ejecuta TypeScript, Vite, prerenderizado y comprobaciones SEO de la salida. `check:seo` comprueba el build existente: dominio, metadatos, contenido inicial, H1, alt, JSON-LD y referencias, assets, robots, sitemap y 404. No mide ranking, Core Web Vitals ni aprobación de Google.

El modo `dev` genera los metadatos pero monta React en cliente; para comprobar el HTML prerenderizado hay que usar la compilación y `preview`.

### Resultado de la revisión local

- Lint, TypeScript, compilación, prerenderizado y los cuatro grupos de comprobaciones SEO: correctos.
- HTML inicial servido por HTTP local: 24.777 bytes, con contenido profesional completo; sitemap XML válido.
- Revisión en navegador de la salida de producción: sin avisos ni errores de hidratación; metadatos correctos, fotos cargadas, formación desplegable, navegación y contadores operativos.
- Escritorio y móvil de 390 × 844: sin desbordamiento horizontal; menú móvil abre y cierra al navegar, y las anclas llevan al título correspondiente.
- Esta revisión no sustituye las comprobaciones públicas posteriores al despliegue ni la auditoría responsive previa.

## Antes de publicar

Al revisar el dominio oficial, la respuesta pública HTTP 200 contenía únicamente un script que redirigía a `/lander`; todavía no mostraba esta landing. La versión pública provisional seguía en `aaron-andia.pages.dev`. Ninguna de estas configuraciones externas fue modificada.

1. Confirmar correo profesional y sustituir el temporal en `src/site.ts`.
2. Conectar `www.andiaespinoza.com` como Custom Domain del proyecto Cloudflare Pages y validar DNS/HTTPS. Publicar `dist`, con `npm run build` como comando.
3. Configurar redirección permanente del dominio sin www y de `aaron-andia.pages.dev` al dominio canónico con www, preservando ruta y query y evitando bucles. Esto requiere reglas de dominio/Bulk Redirects en Cloudflare: los redirects por host no se resuelven en `_redirects`. [Guía oficial para redirigir pages.dev al dominio propio](https://developers.cloudflare.com/pages/how-to/redirect-to-custom-domain/) y [límites de `_redirects`](https://developers.cloudflare.com/pages/configuration/redirects/).
4. Comprobar respuesta 200 del inicio, URLs de imágenes y archivos SEO; una ruta inventada debe devolver 404 real. Comprobar que ninguna regla de hosting añada `noindex` al dominio principal. Las previews de despliegue deben mantenerse fuera del índice con la configuración del hosting.
5. Verificar propiedad del dominio en Google Search Console con el registro DNS que entregue Google; enviar `https://www.andiaespinoza.com/sitemap.xml`, inspeccionar la URL canónica y solicitar indexación. No se inventa un token de verificación.
6. Revisar JSON-LD en Schema.org Validator y Rich Results Test. Person y Service describen entidades, pero no implican una tarjeta enriquecida específica. [Google no garantiza resultados enriquecidos incluso con marcado válido](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).
7. Ejecutar PageSpeed Insights en móvil y escritorio sobre el dominio publicado. Registrar LCP, CLS e INP con datos de campo cuando haya tráfico suficiente. No hay puntuación Lighthouse ni métricas públicas verificadas en esta revisión.
8. Medir consultas, impresiones, clics e indexación en Search Console; usar esos datos para priorizar artículos y páginas de especialidad con contenido real, propio y suficiente.

No existe una aprobación SEO universal ni se puede garantizar la indexación o la primera posición. La implementación prepara la página para rastreo y comprensión; la validación pública requiere el despliegue y acceso a Search Console.
