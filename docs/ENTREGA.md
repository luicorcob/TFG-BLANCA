# Guía de entrega y revisión

Este documento acompaña al README principal y sirve como lista de control para una revisión académica, técnica o institucional del proyecto.

## Qué abrir primero

1. `README.md`: visión general, estructura y arranque local.
2. `index.html`: portada y relato introductorio.
3. `catalogo.html`: catálogo filtrable de bodegas.
4. `mapa.html`: visualización geográfica con Leaflet.
5. `sobre-el-proyecto.html`: metodología, autoría y marco académico.

## Comando de revisión

```bash
npm start
```

URL local:

```text
http://localhost:3000
```

## Checklist funcional

- La portada carga con estilos, tipografías e imágenes.
- La navegación superior marca correctamente la sección activa.
- El menú móvil abre y cierra sin bloquear el scroll después.
- El catálogo muestra 41 registros.
- Los filtros de catálogo funcionan por estado, documentación, periodo y búsqueda.
- Las fichas destacadas `bodegas-*.html` abren correctamente.
- La plantilla `bodega.html?slug=bodegas-garay` genera una ficha dinámica.
- El mapa carga Leaflet y centra los registros.
- El mapa permite cambiar la base cartográfica.
- `mapa.html?bodega=bodegas-rubio` abre la bodega enfocada.
- Los ZIP de `public/qgis/` se descargan.
- Los enlaces de ficha abren `docs/fuentes/TFG MAQUETACION PARA WEB.pdf` en la página correspondiente.

## Checklist documental

- Revisar que la autoría aparezca como Blanca Rubio García.
- Revisar que la tutora aparezca como Rocío Romero.
- Confirmar que la institución figure como ETSA, Universidad de Sevilla.
- Confirmar que el año académico visible sea 2026.
- Revisar permisos de publicación de imágenes históricas y mapas.
- Revisar que las fuentes documentales citadas en fichas estén alineadas con el TFG final.

## Materiales fuente

La raíz del proyecto se ha dejado limpia para revisión. Los materiales originales no servidos directamente por la web están en:

```text
docs/fuentes/
```

Contenido previsto:

- `TFG MAQUETACION PARA WEB.pdf`: documento académico actualizado usado como fuente principal de la web.
- `FICHAS CATALOGACION 4.07.pdf`: fichas de catalogación originales.
- `PATRICK.png`: material gráfico original conservado fuera de la raíz.

El documento `docs/PLAN_DE_ACCION_WEB_TFG.md` queda como plan histórico de trabajo. El estado actual del proyecto lo describe el `README.md`.

## Carpetas que no deben moverse antes de entregar

- `IMAGENES/`: todavía contiene imágenes referenciadas por `js/data.js`.
- `CAPAS DE QGIS TODO/`: contiene shapefiles usados por `scripts/build-catalog-assets.mjs`.
- `public/`: contiene todo lo que el sitio sirve al navegador.

Mover cualquiera de esas carpetas exige actualizar rutas y volver a probar catálogo, fichas y mapa.

## Flujo recomendado si se actualizan datos

1. Editar registros o rutas en `scripts/build-catalog-assets.mjs`.
2. Confirmar que las capas fuente existen en `CAPAS DE QGIS TODO/`.
3. Ejecutar:

```bash
npm run build:catalog
```

4. Revisar cambios en:

```text
js/data.js
public/mapas/bodegas.geojson
```

5. Ejecutar `npm start` y probar catálogo + mapa.

## Observaciones para publicación

- La web funciona como estático y no requiere servidor Node en producción.
- El mapa depende de conexión externa para Leaflet y teselas cartográficas.
- El formulario de contacto está preparado como interfaz, pero no envía mensajes sin integración externa.
- Antes de publicar públicamente, conviene sustituir o validar cualquier material con derechos dudosos.
