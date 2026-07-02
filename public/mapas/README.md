# Capas cartograficas

Los archivos de esta carpeta son semillas validas para el mapa interactivo.

- `bodegas.geojson`: capa de bodegas convertida desde los shapefiles preparados en QGIS.
- `bic.geojson`: sustituir por el poligono del conjunto historico BIC.
- `ferrocarril.geojson`: sustituir por el trazado historico del ferrocarril.

Exportar siempre en GeoJSON con CRS `EPSG:4326` para que Leaflet pueda leer las coordenadas directamente.

## Capas incorporadas

Los shapefiles `B.VERDIER.shp`, `B.MORALES.shp`, `B.PICHARDO.shp`, `B.ESPINOSA.shp` y `B.SALAS.shp`, situados en `qgis ya listo/`, venian en `ETRS89 / UTM zone 29N`. Se han convertido a `EPSG:4326` y se han incorporado a `bodegas.geojson` como geometrias con `slug` normalizado para cada ficha.
