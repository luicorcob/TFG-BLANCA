# Capas cartograficas

Los archivos de esta carpeta son semillas validas para el mapa interactivo.

- `bodegas.geojson`: sustituir por la exportacion de bodegas desde QGIS.
- `bic.geojson`: sustituir por el poligono del conjunto historico BIC.
- `ferrocarril.geojson`: sustituir por el trazado historico del ferrocarril.

Exportar siempre en GeoJSON con CRS `EPSG:4326` para que Leaflet pueda leer las coordenadas directamente.

## Capa incorporada

`B.VERDIER.shp`, situado en `qgis ya listo/`, venia en `ETRS89 / UTM zone 29N`. Se ha convertido a `EPSG:4326` y se ha incorporado a `bodegas.geojson` como poligono con `slug: bodegas-verdier`.
