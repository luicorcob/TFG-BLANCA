# Arquitectura y memoria perdida del vino

Publicación digital del Trabajo de Fin de Grado **"Arquitectura y memoria perdida del vino"**, centrado en el patrimonio bodeguero de La Palma del Condado, Huelva.

El proyecto integra los resultados de la investigación en una página web de difusión: relato histórico-territorial, catálogo de bodegas, fichas patrimoniales, mapa interactivo y descargas cartográficas preparadas desde QGIS.

## Datos del proyecto

| Campo | Información |
| --- | --- |
| Autora | Blanca Rubio García |
| Tutora | Rocío Romero |
| Institución | ETSA, Universidad de Sevilla |
| Curso | 2026 |
| Ámbito | Patrimonio bodeguero de La Palma del Condado |
| Stack | HTML, CSS, JavaScript y servidor local Node.js |

## Estado del entregable

- **41 registros de bodegas** integrados en el catálogo y el mapa.
- **13 fichas de catalogación** con documentación histórica ampliada.
- **28 registros cartográficos QGIS** incorporados como trazas patrimoniales.
- **6 bodegas activas** y **35 desaparecidas** clasificadas en el sistema de datos.
- **41 paquetes QGIS descargables** desde `public/qgis/`.
- **GeoJSON EPSG:4326** generado para Leaflet en `public/mapas/bodegas.geojson`.

## Entrega limpia

Para una entrega académica, compartir únicamente una copia limpia del proyecto sin historial Git ni archivos locales de trabajo. No incluir `.git/`, carpetas ocultas de herramientas locales, logs, cachés, `node_modules/`, `dist/` ni carpetas temporales.

La autoría visible del proyecto debe aparecer como **Blanca Rubio García**. Si se comparte mediante repositorio, conviene crear un repositorio nuevo bajo la cuenta de la autora o reescribir el historial antes de publicarlo, porque el historial Git conserva autores, correos y URL remotas anteriores.

## Cómo verlo en local

Requisito recomendado: Node.js 18 o superior.

```bash
npm start
```

El servidor quedará disponible en:

```text
http://localhost:3000
```

Si el puerto 3000 está ocupado:

```powershell
$env:PORT=4000
npm start
```

Aunque algunas páginas HTML pueden abrirse directamente, se recomienda usar el servidor local para que el mapa, el `fetch` de GeoJSON y las rutas estáticas funcionen como en producción.

## Páginas principales

| Ruta | Función |
| --- | --- |
| `index.html` | Portada narrativa del proyecto, resumen académico y acceso a catálogo/mapa. |
| `historia.html` | Contexto histórico, territorial y cartográfico. |
| `catalogo.html` | Catálogo filtrable de fichas y registros QGIS. |
| `mapa.html` | Mapa interactivo con marcadores, polígonos y filtros. |
| `bodega.html?slug=...` | Plantilla dinámica para fichas generadas desde `js/data.js`. |
| `bodegas-*.html` | Fichas maquetadas de bodegas destacadas. |
| `sobre-el-proyecto.html` | Metodología, autoría y objetivos académicos. |
| `contacto.html` | Canal de consulta y aportación documental. |

## Estructura del repositorio

```text
.
├── index.html
├── historia.html
├── catalogo.html
├── mapa.html
├── bodega.html
├── bodegas-*.html
├── contacto.html
├── sobre-el-proyecto.html
├── css/
│   └── styles.css
├── js/
│   ├── data.js
│   └── main.js
├── public/
│   ├── bodegas/
│   ├── fichas/
│   ├── historia/
│   ├── mapas/
│   ├── qgis/
│   └── favicon.svg
├── scripts/
│   └── build-catalog-assets.mjs
├── CAPAS DE QGIS TODO/
├── IMAGENES/
├── docs/
│   ├── ENTREGA.md
│   └── fuentes/
├── package.json
└── server.js
```

### Carpetas clave

- `public/`: materiales listos para publicarse en la web. Aquí viven las imágenes optimizadas, GeoJSON y ZIP QGIS descargables.
- `js/data.js`: base de datos del catálogo en formato JavaScript. La consumen el catálogo, el mapa y la plantilla dinámica de ficha.
- `js/main.js`: navegación, filtros, fichas dinámicas, lightbox, animaciones, contador, formularios y mapa Leaflet.
- `scripts/build-catalog-assets.mjs`: script de generación de datos. Lee registros y capas QGIS, y reescribe `js/data.js` y `public/mapas/bodegas.geojson`.
- `CAPAS DE QGIS TODO/`: fuente cartográfica original. No se mueve porque el script de generación depende de estas rutas.
- `IMAGENES/`: archivo documental original usado todavía por algunas fichas. No se mueve porque varias rutas del catálogo apuntan aquí.
- `docs/fuentes/`: material académico y documental original. El PDF `TFG MAQUETACION PARA WEB.pdf` es la fuente principal enlazada desde las fichas.

## Flujo de datos

```text
CAPAS DE QGIS TODO/ + scripts/build-catalog-assets.mjs
        ↓
js/data.js
        ↓
catalogo.html, bodega.html, bodegas-*.html

CAPAS DE QGIS TODO/ + scripts/build-catalog-assets.mjs
        ↓
public/mapas/bodegas.geojson
        ↓
mapa.html
```

Para regenerar catálogo y mapa después de editar datos o capas:

```bash
npm run build:catalog
```

Ese comando actualiza archivos generados. Conviene revisar después `js/data.js`, `public/mapas/bodegas.geojson`, `catalogo.html` y `mapa.html`.

## Despliegue

El sitio es estático. Puede publicarse en cualquier hosting que sirva archivos HTML, CSS, JS y assets estáticos:

- Netlify
- Vercel
- GitHub Pages
- servidor propio con Apache/Nginx

No necesita backend en producción. El archivo `server.js` existe para revisión local y entrega.

Dependencias externas cargadas desde CDN:

- Google Fonts
- Leaflet
- teselas cartográficas de OpenStreetMap/CARTO/IGN según la capa seleccionada

## Revisión rápida antes de entregar

1. Ejecutar `npm start`.
2. Abrir `http://localhost:3000`.
3. Comprobar portada, catálogo, mapa y al menos una ficha.
4. Probar filtros del catálogo por estado, documentación y periodo.
5. Probar `mapa.html?bodega=bodegas-rubio`.
6. Descargar un ZIP QGIS desde una ficha o popup del mapa.
7. Abrir una ficha y comprobar que el enlace PDF apunta a `docs/fuentes/TFG MAQUETACION PARA WEB.pdf`.

Hay una guía más detallada en [`docs/ENTREGA.md`](docs/ENTREGA.md).

## Notas de mantenimiento

- No renombrar `IMAGENES/` ni `CAPAS DE QGIS TODO/` sin actualizar `scripts/build-catalog-assets.mjs` y `js/data.js`.
- Mantener los datos cartográficos exportados en `EPSG:4326` para Leaflet.
- Usar rutas relativas, porque el proyecto está preparado para funcionar como sitio estático.
- Las fichas completas destacadas existen como `bodegas-*.html`; el resto se resuelve con `bodega.html?slug=...`.
- El formulario de contacto abre Gmail con los datos ya preparados en el mensaje, sin backend. Para fijar el destinatario, completar `data-contact-recipient` en `contacto.html`.

## Derechos y fuentes

El contenido procede del Trabajo de Fin de Grado de Blanca Rubio García y de materiales documentales/cartográficos asociados. Antes de publicar en abierto, revisar permisos de imágenes históricas, fotografías, mapas, capturas del IGN, PDFs y capas QGIS.
