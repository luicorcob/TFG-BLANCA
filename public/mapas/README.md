# Capas cartográficas

Esta carpeta contiene las capas publicables que consume el mapa interactivo.

## Archivos

- `bodegas.geojson`: capa principal de bodegas convertida desde shapefiles preparados en QGIS.
- `bic.geojson`: placeholder para el polígono del conjunto histórico BIC.
- `ferrocarril.geojson`: placeholder para el trazado histórico del ferrocarril.
- `silueta-condado.png` y `silueta-la-palma.png`: recursos gráficos usados por la interfaz.

## Criterio técnico

Exportar siempre a GeoJSON con CRS `EPSG:4326` para que Leaflet pueda leer las coordenadas directamente.

La capa `bodegas.geojson` se genera desde:

```text
scripts/build-catalog-assets.mjs
CAPAS DE QGIS TODO/
```

Después de modificar capas fuente o registros, ejecutar:

```bash
npm run build:catalog
```

## Nota de entrega

`bic.geojson` y `ferrocarril.geojson` están preparados como semillas mínimas. Deben sustituirse por geometrías completas cuando se cierre la cartografía definitiva.
