import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const qgisZipFor = (slug) => `public/qgis/${slug}-qgis.zip`;
const fichaPdf = (page) => `public/fichas/fichas-catalogacion-4-07.pdf#page=${page}`;

const img = (name) => `IMAGENES/${name}`;
const pub = (name) => `public/bodegas/${name}`;

const catalogSources = {
  verdier: "CAPAS DE QGIS TODO/BODEGAS CATALOGO/B.VERDIER.shp",
  morales: "CAPAS DE QGIS TODO/BODEGAS CATALOGO/B.MORALES.shp",
  pichardo: "CAPAS DE QGIS TODO/BODEGAS CATALOGO/B.PICHARDO.shp",
  espinosa: "CAPAS DE QGIS TODO/BODEGAS CATALOGO/B.ESPINOSA.shp",
  salas: "CAPAS DE QGIS TODO/BODEGAS CATALOGO/B.SALAS.shp",
  toro: "CAPAS DE QGIS TODO/BODEGAS CATALOGO/B.TORO.shp",
  soldan: "CAPAS DE QGIS TODO/BODEGAS CATALOGO/B.SOLDÁN.shp",
  miguelCepeda: "CAPAS DE QGIS TODO/BODEGAS CATALOGO/B, MIGUEL CEPEDA Y SOLDÁN.shp",
  genoves: "CAPAS DE QGIS TODO/BODEGAS CATALOGO/B.GENOVES.shp",
  soriano: "CAPAS DE QGIS TODO/BODEGAS CATALOGO/B.SORIANO.shp",
  alfredoRubio: "CAPAS DE QGIS TODO/BODEGAS CATALOGO/B.ALFREDO RUBIO ORTEGA.shp",
  mamerto: "CAPAS DE QGIS TODO/BODEGAS CATALOGO/B. MAMERTO DE LA VARA.shp",
  rubio: "CAPAS DE QGIS TODO/CARTOGRAFÍA BODEGAS/ACTUALES/B.RUBIO..shp"
};

const baseSources = {
  preindustrial: "CAPAS DE QGIS TODO/CARTOGRAFÍA BODEGAS/B. PREINDUSTRIALES",
  period1870: "CAPAS DE QGIS TODO/CARTOGRAFÍA BODEGAS/1870-1924",
  period1925: "CAPAS DE QGIS TODO/CARTOGRAFÍA BODEGAS/1925-1950",
  actuales: "CAPAS DE QGIS TODO/CARTOGRAFÍA BODEGAS/ACTUALES",
  cooperativas: "CAPAS DE QGIS TODO/CARTOGRAFÍA BODEGAS/COOPERATIVAS"
};

const fuenteTfg =
  "Rubio García, Blanca. Trabajo de Fin de Grado Arquitectura y memoria perdida del vino, ETSA Universidad de Sevilla, 2026.";
const fuenteFichas = "Fichas de catalogación 4.07, archivo PDF incorporado al catálogo digital.";
const fuenteQgis = "Capas QGIS normalizadas desde la carpeta CAPAS DE QGIS TODO.";

const image = (src, alt, caption = alt) => ({ src, alt, caption });

const records = [
  {
    slug: "bodegas-rubio",
    nombre: "Bodegas Rubio 1893 SL",
    estado: "activa",
    documentacion: "catalogacion",
    ubicacion: "Calle Palos de la Frontera nº 12, 14 y calle San Francisco nº 27",
    resumen:
      "Fundada en 1946 por Antonio Rubio Gordillo; su sede actual integra tres naves y conserva restos de arquerías preindustriales.",
    imagen: pub("rubio-fachada.jpg"),
    imagenes: [
      image(pub("rubio-fachada.jpg"), "Fachada de Bodegas Rubio 1893 SL"),
      image(pub("rubio-interior.avif"), "Interior de Bodegas Rubio 1893 SL"),
      image(img("BODEGAS RUBIO.jpg"), "Imagen documental de Bodegas Rubio"),
      image(img("BODEGAS RUBIO 2.avif"), "Vista interior de Bodegas Rubio")
    ],
    href: "bodegas-rubio.html",
    catastro: "6704124QB1460S0001WK; 6704142QB1460S0001KK; 6704130QB1460S0001YK",
    anioConstruccion:
      "1969 nave de calle Palos de la Frontera nº 14; 1997 nave de calle Palos de la Frontera nº 12; 2001 nave de calle San Francisco nº 27",
    fundacion: "1946",
    ubicacionAnterior: "Bodega El Cura Aguilar",
    fichaPdf: fichaPdf(13),
    layers: [{ periodo: "Actuales", source: catalogSources.rubio }],
    cronologia: [
      ["1946", "Fundación", "Antonio Rubio Gordillo funda la firma en la antigua Bodega El Cura Aguilar."],
      ["1964", "Traslado", "La actividad se traslada a la calle Palos de la Frontera nº 14."],
      ["1965", "Soleras", "La familia adquiere las soleras y marcas Luis Felipe y La Rábida."],
      ["1996", "Expansión", "La bodega inicia una proyección comercial internacional."],
      ["2001", "Tercera nave", "Se incorpora la nave de la calle San Francisco nº 27."]
    ],
    lectura:
      "Bodegas Rubio pasó de una primera etapa como cosechera local a referente internacional tras adquirir las soleras de Bodegas Morales. La ficha destaca la continuidad familiar, la incorporación de nuevas naves y la convivencia entre tradición bodeguera y modernización comercial.",
    fuentes: [fuenteTfg, fuenteFichas, fuenteQgis]
  },
  {
    slug: "bodegas-verdier",
    nombre: "Bodegas Verdier",
    estado: "desaparecida",
    documentacion: "catalogacion",
    ubicacion: "Calle Nicolás Gómez González entre el nº 13-14",
    resumen:
      "Fundada en 1891 por Celestino Verdier Martín sobre la primitiva destilería de Nicolás Gómez; desapareció en 1970.",
    imagen: pub("verdier-maquina-destilacion.png"),
    imagenes: [
      image(pub("verdier-maquina-destilacion.png"), "Aparato de destilación vinculado al contexto industrial de Verdier"),
      image(img("MAQUINA DE DESTILACION NICOLAS GOMEZ (CAP 4 ).png"), "Máquina de destilación de Nicolás Gómez"),
      image(img("CHIMENEA B.SALAS.webp"), "Chimenea industrial documentada en el archivo visual")
    ],
    href: "bodegas-verdier.html",
    catastro: "6710056QB1461S0001DS",
    anioConstruccion: "1890",
    fundacion: "1891",
    desaparicion: "1970; urbanización La Moncloa en 1989",
    bodegasPosteriores: "Bodegas Espinosa y Domínguez Rivera",
    fichaPdf: fichaPdf(1),
    layers: [{ periodo: "Bodegas catálogo", source: catalogSources.verdier }],
    cronologia: [
      ["1890", "Chimenea", "Se construye la primera chimenea de la comarca."],
      ["1891", "Fundación", "Celestino Verdier Martín funda la firma."],
      ["1905", "Traspaso", "Bodegas Espinosa adquiere las naves principales."],
      ["1970", "Demolición", "El edificio desaparece antes de la urbanización La Moncloa."]
    ],
    lectura:
      "La ficha sitúa a Verdier como una de las primeras grandes bodegas exportadoras del Condado, ligada al ferrocarril, a la destilación de vapor y a la arquitectura industrial de finales del siglo XIX.",
    fuentes: [fuenteTfg, fuenteFichas, fuenteQgis]
  },
  {
    slug: "bodegas-morales",
    nombre: "Bodegas Loewenthal - Morales",
    estado: "desaparecida",
    documentacion: "catalogacion",
    ubicacion: "Calle de la Estación nº 1",
    resumen:
      "Fundada en 1893 por Carlos Mauricio Morales y Friederick Loewenthal; la sede definitiva frente al ferrocarril se edificó entre 1898 y 1902.",
    imagen: pub("morales-1950.png"),
    imagenes: [
      image(pub("morales-1950.png"), "Bodegas Loewenthal - Morales a principios de los años 50"),
      image(pub("morales-interior.png"), "Interior actual de Bodegas Morales"),
      image(pub("morales-interior-2.png"), "Segundo interior documentado de Bodegas Morales"),
      image(pub("morales-ubicacion-anterior.png"), "Ubicación anterior en calle Carlos Mauricio Morales nº 44"),
      image(pub("morales-volumetria.png"), "Volumetría de Bodegas Loewenthal - Morales")
    ],
    href: "bodegas-morales.html",
    catastro: "6714001QB1461S0001KS",
    anioConstruccion: "1902",
    fundacion: "1893",
    cierre: "1966",
    ubicacionAnterior: "Calle Carlos Mauricio Morales nº 44",
    fichaPdf: fichaPdf(2),
    layers: [{ periodo: "Bodegas catálogo", source: catalogSources.morales }],
    cronologia: [
      ["1893", "Fundación", "Morales y Loewenthal inician la actividad."],
      ["1902", "Sede definitiva", "Se consolida el gran complejo frente a la estación."],
      ["1917", "Relevo", "La firma pasa a denominarse Hijos de Carlos M. Morales."],
      ["1966", "Cierre", "Las soleras principales pasan a la familia Rubio."]
    ],
    lectura:
      "La ficha describe uno de los grandes emporios vinícolas del Condado, con cerchas metálicas, vigas Warren, chimenea de 20 metros y marcas como Luis Felipe, La Rábida y Fino Rociero.",
    fuentes: [fuenteTfg, fuenteFichas, fuenteQgis]
  },
  {
    slug: "bodegas-pichardo",
    nombre: "Bodegas Pichardo",
    estado: "desaparecida",
    documentacion: "catalogacion",
    ubicacion: "Avenida de la Constitución y calle Presidente Adolfo Suárez",
    resumen:
      "Fundada en 1895 por Miguel Pichardo Lepe; articuló un gran conjunto de naves en torno a la estación.",
    imagen: pub("pichardo-fachada.jpg"),
    imagenes: [
      image(pub("pichardo-fachada.jpg"), "Imagen histórica de Bodegas Pichardo"),
      image(pub("pichardo-antes.png"), "Bodegas Pichardo antes de la demolición"),
      image(pub("pichardo-despues.png"), "Bodegas Pichardo después de la demolición"),
      image(pub("pichardo-interior.png"), "Interior de Bodegas Pichardo"),
      image(pub("pichardo-interior-2.png"), "Segundo interior documentado de Bodegas Pichardo"),
      image(img("INTERIOR B. PICHARDO 3.png"), "Interior documental de Bodegas Pichardo")
    ],
    href: "bodegas-pichardo.html",
    catastro: "6710059QB1461S0001JS; 6412502QB1461S0001GS; 6710057QB1461S0002MD",
    anioConstruccion: "1895",
    fundacion: "1895",
    cierre: "1985",
    desaparicion: "2006; demolición de El Molino, La Nueva y parte de El Cine",
    bodegasPosteriores: "Cooperativa Nuestra Señora de Guía y Bodegas Torrepalma",
    fichaPdf: fichaPdf(3),
    layers: [{ periodo: "Bodegas catálogo", source: catalogSources.pichardo }],
    cronologia: [
      ["1895", "Fundación", "Miguel Pichardo Lepe funda la bodega."],
      ["1929", "Reconocimiento", "Obtiene la Medalla de Oro en la Exposición Iberoamericana de Sevilla."],
      ["1947", "Sociedad limitada", "La empresa pasa a sus hijos tras la muerte del fundador."],
      ["1985", "Cese", "La bodega cesa su actividad."],
      ["2006", "Demolición", "Se derriban varias naves del conjunto."]
    ],
    lectura:
      "El conjunto Pichardo ordenó la relación entre el casco histórico y la zona ferroviaria mediante naves como El Cine, El Molino, La Cerca, La Nueva y La Vinagrera.",
    fuentes: [fuenteTfg, fuenteFichas, fuenteQgis]
  },
  {
    slug: "bodegas-espinosa",
    nombre: "Bodegas Espinosa",
    estado: "desaparecida",
    documentacion: "catalogacion",
    ubicacion: "Calle Nicolás Gómez González nº 13-14 y Ronda de Legionarios nº 18",
    resumen:
      "Fundada oficialmente en 1907 por Julián Espinosa Escolar; combina la antigua Verdier con la nave El Cortinal.",
    imagen: pub("espinosa-hijos-julian.png"),
    imagenes: [
      image(pub("espinosa-hijos-julian.png"), "Bodega Hijos de Julián Espinosa"),
      image(pub("espinosa-anuncio.png"), "Anuncio de Hijos de Julián Espinosa"),
      image(pub("espinosa-cortinal.png"), "Interior de la bodega El Cortinal"),
      image(pub("espinosa-interior.png"), "Interior documentado de Bodegas Espinosa"),
      image(pub("espinosa-ubicacion-1.png"), "Ubicación de Bodegas Espinosa en vuelo histórico"),
      image(pub("espinosa-ubicacion-2.png"), "Segunda ubicación de Bodegas Espinosa en vuelo histórico")
    ],
    href: "bodegas-espinosa.html",
    catastro: "6407040QB1460N0001SP; 6710042QB1461S0001YS",
    anioConstruccion: "1890",
    fundacion: "1907",
    cierre: "1977",
    desaparicion: "1970; urbanización La Moncloa en 1989 para la sede de Nicolás Gómez",
    usoPosterior: "La nave El Cortinal pasa a ser propiedad de Mosaicos Pino",
    fichaPdf: fichaPdf(4),
    layers: [{ periodo: "Bodegas catálogo", source: catalogSources.espinosa }],
    cronologia: [
      ["1885", "Origen", "La firma nace con una destilería de alcoholes."],
      ["1907", "Sede en La Palma", "Julián Espinosa Escolar consolida la firma."],
      ["1943", "Relevo", "La empresa pasa a denominarse Hijos de Julián Espinosa."],
      ["1977", "Cierre", "La actividad concluye durante la crisis del sector."]
    ],
    lectura:
      "La ficha distingue la nave heredada del recinto Verdier y la nave El Cortinal, de gran longitud, destinada al soleraje y posteriormente ocupada por Mosaicos Pino.",
    fuentes: [fuenteTfg, fuenteFichas, fuenteQgis]
  },
  {
    slug: "bodegas-salas",
    nombre: "Bodegas Salas",
    estado: "desaparecida",
    documentacion: "catalogacion",
    ubicacion: "Final de la calle del Pilar",
    resumen:
      "Fundada en 1920 por Rafael y Tomás Salas López; el gran complejo de la calle del Pilar cerró en 1990.",
    imagen: pub("salas-fachada.webp"),
    imagenes: [
      image(pub("salas-fachada.webp"), "Fachada de Bodegas Salas"),
      image(pub("salas-interior.webp"), "Interior de Bodegas Salas"),
      image(pub("salas-interior-2.webp"), "Segundo interior documentado de Bodegas Salas"),
      image(pub("salas-chimenea.webp"), "Chimenea de Bodegas Salas"),
      image(pub("salas-vista-aerea.jpg"), "Vista aérea de Bodegas Salas"),
      image(pub("salas-propuesta-pgou.png"), "Propuesta PGOU para Bodegas Salas")
    ],
    href: "bodegas-salas.html",
    catastro: "6012002QB1461S0001RS",
    anioConstruccion: "1930",
    fundacion: "1920",
    cierre: "1990",
    propuesta: "PGOU de 2005 para viviendas y museo del vino, no ejecutada",
    fichaPdf: fichaPdf(5),
    layers: [{ periodo: "Bodegas catálogo", source: catalogSources.salas }],
    cronologia: [
      ["1920", "Fundación", "Rafael y Tomás Salas López fundan la firma."],
      ["1929", "Chimenea", "Se levanta la chimenea que singulariza el conjunto."],
      ["1930", "Traslado", "La bodega se instala en la calle del Pilar con avenida de Huelva."],
      ["1966", "Soleras", "Salas adquiere soleras de Fino Rociero tras el cierre de Morales."],
      ["1990", "Cierre", "La bodega cierra como una de las últimas grandes firmas locales."]
    ],
    lectura:
      "Bodegas Salas alcanzó 12.000 m2, naves de crianza, torre alambique, oficinas, embotellado y productos como Coñac Radiante, Soleras Salas, vermuts y amontillados.",
    fuentes: [fuenteTfg, fuenteFichas, fuenteQgis]
  },
  {
    slug: "bodegas-toro",
    nombre: "Bodegas Toro",
    estado: "desaparecida",
    documentacion: "catalogacion",
    ubicacion: "Paseo de las Palmeras",
    resumen:
      "Fundada por José María del Toro Pérez en 1920 sobre un recinto de origen Estenave y Cárdenas-Lebrón.",
    imagen: img("EXTERIOR B.TORO.png"),
    imagenes: [
      image(img("EXTERIOR B.TORO.png"), "Exterior de Bodegas Toro"),
      image(img("EXTERIOR B.TORO 2.png"), "Segundo exterior de Bodegas Toro"),
      image(img("INTERIOR B. TORO.png"), "Interior de Bodegas Toro"),
      image(img("UBI B.TORO VUELO AÑOS 50 1950-1959 .png"), "Ubicación de Bodegas Toro en vuelo histórico"),
      image(img("UBI B.TORO VUELO AÑOS 97.png"), "Ubicación de Bodegas Toro en vuelo de 1997")
    ],
    href: "bodega.html?slug=bodegas-toro",
    catastro: "Varias parcelas en torno a 6703807QB1460S0001KK",
    anioConstruccion: "1898",
    fundacion: "1920",
    cierre: "1977",
    desaparicion: "1988; urbanización Las Palmeritas",
    bodegasAnteriores: "Bodegas Estenave y Bodegas García Cárdenas Lebrón",
    fichaPdf: fichaPdf(6),
    layers: [{ periodo: "Bodegas catálogo", source: catalogSources.toro }],
    cronologia: [
      ["1898", "Origen del edificio", "El recinto pertenece inicialmente a Bodega Estenave."],
      ["1905", "Cárdenas-Lebrón", "El conjunto pasa a Bodegas Cárdenas-Lebrón."],
      ["1920", "Fundación Toro", "José María del Toro Pérez funda Bodegas Toro."],
      ["1977", "Cierre", "La actividad se detiene durante el declive del sector."],
      ["1988", "Demolición", "Se aprueba la construcción de Las Palmeritas."]
    ],
    lectura:
      "La ficha destaca su patio central con palmeras, la fachada con detalles artísticos y el primer laboratorio enológico privado de la localidad, dirigido durante más de dos décadas por Pedro Ramírez Madrid.",
    fuentes: [fuenteTfg, fuenteFichas, fuenteQgis]
  },
  {
    slug: "bodegas-soldan",
    nombre: "Bodegas Soldán",
    estado: "desaparecida",
    documentacion: "catalogacion",
    ubicacion: "Calles María Auxiliadora, Arquitecto Pinto y San Agustín nº 28",
    resumen:
      "Bodega familiar vinculada a Juan Bautista Soldán y a naves construidas por Antonio Soldán y Sotelo en 1885.",
    imagen: img("Fachada Bodegas Soldan .png"),
    imagenes: [
      image(img("Fachada Bodegas Soldan .png"), "Fachada actual vinculada a Bodegas Soldán"),
      image(img("Fachada Bodegas Soldan 2.png"), "Segunda fachada vinculada a Bodegas Soldán"),
      image(img("INTERIOR B. SOLDÁN.png"), "Interior de Bodegas Soldán"),
      image(img("INTERIOR B. SOLDÁN 2.png"), "Segundo interior de Bodegas Soldán"),
      image(img("FAMILIA SOLDÁN .png"), "Familia Soldán"),
      image(img("UBI B.SOLDÁN VUELO AÑOS 50 1950-1959 .png"), "Ubicación de Bodegas Soldán en vuelo histórico")
    ],
    href: "bodega.html?slug=bodegas-soldan",
    catastro: "Varias parcelas en torno a 6806528QB1460N0001PP y 7004033QB1470S0001YX",
    anioConstruccion: "1885",
    cierre: "Finales de la década de 1960",
    desaparicion: "1976; edificios residenciales",
    usoPosterior: "Antiguo Bodegón El Chocaíto",
    fichaPdf: fichaPdf(7),
    layers: [{ periodo: "Bodegas catálogo", source: catalogSources.soldan }],
    cronologia: [
      ["1885", "Naves originales", "Antonio Soldán y Sotelo construye las naves de referencia."],
      ["Siglo XX", "Fundación", "Juan Bautista Soldán impulsa la actividad bodeguera familiar."],
      ["1960", "Cierre", "La bodega cierra al final de la década."],
      ["1976", "Demolición", "La sede de María Auxiliadora se sustituye por viviendas."]
    ],
    lectura:
      "El conjunto tuvo oficinas, laboratorio enológico, tonelería, almacén, fermentación y destilería. La ficha subraya una memoria oral especialmente valiosa por la escasez de documentación conservada.",
    fuentes: [fuenteTfg, fuenteFichas, fuenteQgis]
  },
  {
    slug: "bodegas-miguel-cepeda-soldan",
    nombre: "Bodegas Miguel Cepeda y Soldán",
    estado: "desaparecida",
    documentacion: "catalogacion",
    ubicacion: "Calle Maestro Juan Antonio Ríos nº 4",
    resumen:
      "Firma llevada por Miguel Cepeda y Soldán en naves construidas por Antonio Soldán y Sotelo en 1885.",
    imagen: img("INTERIOR B.MIGUEL CEPEDA SOLDAN.png"),
    imagenes: [
      image(img("INTERIOR B.MIGUEL CEPEDA SOLDAN.png"), "Interior de Bodegas Miguel Cepeda y Soldán"),
      image(img("ANTES B.MIGUEL CEPEDA Y SOLDÁN (Y TAMBN LA DE HERMANOS CASTIZO).png"), "Estado anterior de Bodegas Miguel Cepeda y Soldán"),
      image(img("DESPUES B.MIGUEL CEPEDA Y SOLDÁN (Y TAMBN LA DE HERMANOS CASTIZO).png"), "Estado posterior de Bodegas Miguel Cepeda y Soldán"),
      image(img("RETRATO ANTONIO SOLDÁN.png"), "Retrato de Antonio Soldán"),
      image(img("MOSAICO IGNACIO CEPEDA SOLDÁN .png"), "Mosaico de Ignacio Cepeda Soldán"),
      image(img("UBI B.Miguel cepeda y soldán (tambn Hermanos castizo) VUELO AÑOS 50 1950-1959 .png"), "Ubicación en vuelo histórico")
    ],
    href: "bodega.html?slug=bodegas-miguel-cepeda-soldan",
    catastro: "7004021QB1470S0001JX",
    anioConstruccion: "1885",
    desaparicion: "1999; urbanización Maestro Juan Antonio Ríos",
    bodegasPosteriores: "Bodega José Mª y Juan Castizo Pinto",
    fichaPdf: fichaPdf(8),
    layers: [{ periodo: "Bodegas catálogo", source: catalogSources.miguelCepeda }],
    cronologia: [
      ["1885", "Naves industriales", "Antonio Soldán y Sotelo construye el conjunto."],
      ["1926", "Liquidación", "Tras el fallecimiento del fundador se liquidan productos y marcas."],
      ["1999", "Demolición", "El edificio desaparece para la urbanización Maestro Juan Antonio Ríos."]
    ],
    lectura:
      "La ficha la vincula a la expansión urbana hacia Almonte y al Fino Rociero, cuyas soleras y marca fueron adquiridas por Hijos de Carlos Morales.",
    fuentes: [fuenteTfg, fuenteFichas, fuenteQgis]
  },
  {
    slug: "bodegas-genoves",
    nombre: "Bodegas Genovés",
    estado: "desaparecida",
    documentacion: "catalogacion",
    ubicacion: "Calle Cabo nº 2, Ronda de los Legionarios nº 4 y Av. San Juan Bosco nº 8",
    resumen:
      "Fundada en 1930 por Agustín y Adolfo Genovés; llegó a integrar sistemas avanzados de vinagre, mostos y embotellado.",
    imagen: img("B.GENOVES.png"),
    imagenes: [
      image(img("B.GENOVES.png"), "Fachada de Bodegas Genovés"),
      image(img("B.GENOVES 2.png"), "Segunda imagen de Bodegas Genovés"),
      image(img("INTERIOR B. GENOVÉS.png"), "Interior de Bodegas Genovés"),
      image(img("INTERIOR B. GENOVÉS 2.png"), "Segundo interior de Bodegas Genovés"),
      image(img("ANTES B.GENOVES.png"), "Estado anterior de Bodegas Genovés"),
      image(img("DESPUES B.GENOVES.png"), "Estado posterior de Bodegas Genovés"),
      image(img("UBI B.GENOVÉS 1 VUELO AÑOS 50 1950-1959 .png"), "Ubicación de Bodegas Genovés en vuelo histórico")
    ],
    href: "bodega.html?slug=bodegas-genoves",
    catastro: "6801404QB1460S0001EK; 7108629QB1470N0001PF; 6410006QB1461S0001ZS",
    anioConstruccion: "Finales del siglo XIX",
    fundacion: "1930",
    cierre: "1982",
    desaparicion: "1990; gasolinera Cepsa en Av. San Juan Bosco nº 8",
    fichaPdf: fichaPdf(9),
    layers: [{ periodo: "Bodegas catálogo", source: catalogSources.genoves }],
    cronologia: [
      ["1930", "Fundación", "Agustín y Adolfo Genovés fundan la bodega."],
      ["1982", "Cierre", "La firma cierra tras una etapa tecnológica singular."],
      ["1990", "Demolición", "El edificio final desaparece para la gasolinera Cepsa."]
    ],
    lectura:
      "Genovés destaca por el sistema mecánico de rotación de toneles de vinagre, la fábrica de mostos Kestner, la planta de embotellado automático y el almacenamiento subterráneo de 600.000 litros.",
    fuentes: [fuenteTfg, fuenteFichas, fuenteQgis]
  },
  {
    slug: "bodegas-soriano",
    nombre: "Bodegas Soriano",
    estado: "desaparecida",
    documentacion: "catalogacion",
    ubicacion: "Calle María Auxiliadora y Ronda de los Legionarios nº 15",
    resumen:
      "Fundada por Juan Soriano Luengo; ejemplo de bodega no exportadora centrada en Huelva y Sevilla.",
    imagen: img("B.SORIANO.png"),
    imagenes: [
      image(img("B.SORIANO.png"), "Imagen documental de Bodegas Soriano"),
      image(img("ANTES B.SORIANO.png"), "Estado anterior de Bodegas Soriano"),
      image(img("DESPUES B.SORIANO.png"), "Estado posterior de Bodegas Soriano"),
      image(img("UBI B.SORIANO VUELO AÑOS 50 1950-1959 .png"), "Ubicación de Bodegas Soriano en vuelo histórico")
    ],
    href: "bodega.html?slug=bodegas-soriano",
    catastro: "6410010QB1461S0001US",
    anioConstruccion: "Sin datos",
    fundacion: "1923 o 1930 según fuentes publicitarias",
    desaparicion: "1980; Distrito Sanitario Condado-Campiña",
    fichaPdf: fichaPdf(10),
    layers: [{ periodo: "Bodegas catálogo", source: catalogSources.soriano }],
    cronologia: [
      ["1923", "Referencia publicitaria", "Los anuncios sitúan la fundación en torno a 1923."],
      ["1940", "Ampliación", "El complejo crece hacia Alegría de la Huerta."],
      ["1980", "Desaparición", "El edificio es sustituido por equipamientos docentes y sanitarios."]
    ],
    lectura:
      "La ficha subraya su perfil de bodega de mercado regional, con mostos, mistelas, vinagres, Solera Soriano y maquinaria francesa Mabille Frères de Ambroise.",
    fuentes: [fuenteTfg, fuenteFichas, fuenteQgis]
  },
  {
    slug: "bodegas-alfredo-rubio-ortega",
    nombre: "Bodegas Alfredo Rubio Ortega",
    estado: "desaparecida",
    documentacion: "catalogacion",
    ubicacion: "Calle Alcázar y Pérez nº 1",
    resumen:
      "Bodega de cosechero fundada por Pedro Domínguez Valdés y consolidada desde 1930 por Alfredo Rubio Ortega.",
    imagen: img("B. ALFREDO RUBIO ORTEGA .png"),
    imagenes: [
      image(img("B. ALFREDO RUBIO ORTEGA .png"), "Bodegas Alfredo Rubio Ortega"),
      image(img("B. ALFREDO RUBIO ORTEGA 2.jpg"), "Interior de Bodegas Alfredo Rubio Ortega"),
      image(img("B. ALFREDO RUBIO ORTEGA 3(CORUMBEL 2008).png"), "Archivo Corumbel de Bodegas Alfredo Rubio Ortega"),
      image(img("B. ALFREDO RUBIO ORTEGA 4.png"), "Detalle documental de Bodegas Alfredo Rubio Ortega"),
      image(img("B. ALFREDO RUBIO ORTEGA 5.png"), "Imagen documental de Bodegas Alfredo Rubio Ortega"),
      image(img("UBI B.ALFREDO RUBIO ORTEGA VUELO AÑOS 50 1950-1959 .png"), "Ubicación de Bodegas Alfredo Rubio Ortega")
    ],
    href: "bodega.html?slug=bodegas-alfredo-rubio-ortega",
    catastro: "6702001QB1460S0001LK",
    anioConstruccion: "1889",
    cierre: "1989",
    usoPosterior: "Bodegón El Chocaíto; torre alambique de Castizo Gourmet",
    fichaPdf: fichaPdf(11),
    layers: [{ periodo: "Bodegas catálogo", source: catalogSources.alfredoRubio }],
    cronologia: [
      ["1889", "Construcción", "Se fecha el origen construido del inmueble."],
      ["1930", "Consolidación", "Alfredo Rubio Ortega impulsa la etapa de mayor esplendor."],
      ["1989", "Nuevo uso", "El inmueble pasa a alojar el Bodegón El Chocaíto."]
    ],
    lectura:
      "La ficha describe una bodega de producción y crianza con vinagrera, chinero, almacenes, patios y torre alambique. El uso actual conserva techos artesonados, ventanas de ojo de buey y estructura principal.",
    fuentes: [fuenteTfg, fuenteFichas, fuenteQgis]
  },
  {
    slug: "bodegas-mamerto-de-la-vara",
    nombre: "Bodegas Mamerto de la Vara",
    estado: "desaparecida",
    documentacion: "catalogacion",
    ubicacion: "Calle San Antonio nº 23 y 24",
    resumen:
      "Fundada en julio de 1940 por Mamerto de la Vara Pérez; especializada en vinos compuestos y licores.",
    imagen: img("B.MAMERTO DE LA VARA CAMBIADO.jfif"),
    imagenes: [
      image(img("B.MAMERTO DE LA VARA CAMBIADO.jfif"), "Bodegas Mamerto de la Vara"),
      image(img("B.MAMERTO DE LA VARA 2.jpg"), "Imagen documental de Mamerto de la Vara"),
      image(img("B.MAMERTO DE LA VARA 3.jpg"), "Interior de Bodegas Mamerto de la Vara"),
      image(img("B.MAMERTO DE LA VARA 4.png"), "Detalle interior de Mamerto de la Vara"),
      image(img("B.MAMERTO DE LA VARA 5.png"), "Anuncio de Mamerto de la Vara"),
      image(img("UBI B.MAMERTO DE LA VARA VUELO AÑOS 50 1950-1959 .png"), "Ubicación de Bodegas Mamerto de la Vara")
    ],
    href: "bodega.html?slug=bodegas-mamerto-de-la-vara",
    catastro: "6907218QB1460N0001QP",
    anioConstruccion: "1938",
    fundacion: "1940",
    usoPosterior: "Molino El Huertezuelo",
    fichaPdf: fichaPdf(12),
    layers: [{ periodo: "Bodegas catálogo", source: catalogSources.mamerto }],
    cronologia: [
      ["1938", "Construcción", "Se fecha el inmueble de la calle San Antonio."],
      ["1940", "Fundación", "Mamerto de la Vara Pérez funda la bodega."],
      ["1946", "Traslado", "El negocio se traslada a Valencia."],
      ["2021", "Reforma", "El inmueble se reforma como alojamiento rural."]
    ],
    lectura:
      "La bodega se alejó del modelo de crianza y se especializó en vinos compuestos y licores, con productos como Vermut Corinto y Oro y Dulcamaro.",
    fuentes: [fuenteTfg, fuenteFichas, fuenteQgis]
  }
];

const cartographicRecords = [
  {
    slug: "bodegas-de-la-viga",
    nombre: "Bodega de la Viga",
    periodo: "B. preindustriales",
    layers: [{ periodo: "B. preindustriales", source: `${baseSources.preindustrial}/B. DE LA VIGA.shp` }]
  },
  {
    slug: "bodegas-acacio-larios-bexarano",
    nombre: "Bodegas Acacio Larios Bexarano",
    periodo: "B. preindustriales",
    layers: [{ periodo: "B. preindustriales", source: `${baseSources.preindustrial}/B.ACACIO LARIOS BEXARANO.shp` }]
  },
  {
    slug: "bodegas-del-camino-de-hinojos",
    nombre: "Bodega del Camino de Hinojos",
    periodo: "B. preindustriales",
    layers: [{ periodo: "B. preindustriales", source: `${baseSources.preindustrial}/B.DEL CAMINO DE HINOJOS.shp` }]
  },
  {
    slug: "bodegas-perez-lagares",
    nombre: "Bodegas Pérez Lagares",
    periodo: "B. preindustriales / 1870-1924",
    layers: [
      { periodo: "B. preindustriales", source: `${baseSources.preindustrial}/B.PÉREZ LAGARES.shp` },
      { periodo: "1870-1924", source: `${baseSources.period1870}/B.PÉREZ LAGARES.shp` }
    ]
  },
  {
    slug: "bodegas-p-y-j-cardenas-lebron",
    nombre: "Bodegas P. y J. Cárdenas Lebrón",
    periodo: "1870-1924",
    layers: [{ periodo: "1870-1924", source: `${baseSources.period1870}/B. P Y J CÁRDENAS LEBRÓN.shp` }]
  },
  {
    slug: "bodegas-solis-diaz",
    nombre: "Bodegas Solís Díaz",
    periodo: "1870-1924",
    layers: [{ periodo: "1870-1924", source: `${baseSources.period1870}/B. SOLIS DÍAZ.shp` }]
  },
  {
    slug: "bodegas-cueva",
    nombre: "Bodegas Cueva",
    periodo: "1870-1924",
    layers: [{ periodo: "1870-1924", source: `${baseSources.period1870}/B.CUEVA.shp` }]
  },
  {
    slug: "bodegas-cura-aguilar",
    nombre: "Bodega del Cura Aguilar",
    periodo: "1870-1924",
    layers: [{ periodo: "1870-1924", source: `${baseSources.period1870}/B.CURA AGUILAR.shp` }]
  },
  {
    slug: "bodegas-estenave",
    nombre: "Bodegas Estenave",
    periodo: "1870-1924",
    layers: [{ periodo: "1870-1924", source: `${baseSources.period1870}/B.ESTENAVE.shp` }]
  },
  {
    slug: "bodegas-francisco-dominguez-delgado",
    nombre: "Bodegas Francisco Domínguez Delgado",
    periodo: "1870-1924",
    layers: [{ periodo: "1870-1924", source: `${baseSources.period1870}/B.FRANCISCO DOMÍNGUEZ DELGADO.shp` }]
  },
  {
    slug: "bodegas-juan-dominguez-millan",
    nombre: "Bodegas Juan Domínguez Millán",
    periodo: "1870-1924",
    layers: [{ periodo: "1870-1924", source: `${baseSources.period1870}/B.JUAN DOMÍNGUEZ MILLÁN.shp` }]
  },
  {
    slug: "bodegas-navarro",
    nombre: "Bodegas Navarro",
    periodo: "1870-1924",
    layers: [{ periodo: "1870-1924", source: `${baseSources.period1870}/B.NAVARRO.shp` }]
  },
  {
    slug: "bodegas-rafael-ayudarte",
    nombre: "Bodegas Rafael Ayudarte",
    periodo: "1870-1924",
    layers: [{ periodo: "1870-1924", source: `${baseSources.period1870}/B.RAFAEL AYUDARTE.shp` }]
  },
  {
    slug: "bodegas-rafael-daza-zarza",
    nombre: "Bodegas Rafael Daza Zarza",
    periodo: "1870-1924",
    layers: [{ periodo: "1870-1924", source: `${baseSources.period1870}/B.RAFAEL DAZA ZARZA.shp` }]
  },
  {
    slug: "bodegas-calero",
    nombre: "Bodegas Calero",
    periodo: "1925-1950",
    imagen: img("B. CALERO.png"),
    imagenes: [image(img("B. CALERO.png"), "Imagen documental de Bodegas Calero")],
    layers: [{ periodo: "1925-1950", source: `${baseSources.period1925}/B.CALERO.shp` }]
  },
  {
    slug: "bodegas-castizo-romero-hermanos",
    nombre: "Bodegas Castizo Romero y Hermanos",
    periodo: "1925-1950",
    layers: [{ periodo: "1925-1950", source: `${baseSources.period1925}/B.CASTIZO ROMERO Y HERMANOS.shp` }]
  },
  {
    slug: "bodegas-jose-maria-juan-castizo-pinto",
    nombre: "Bodegas José Mª y Juan Castizo Pinto",
    periodo: "1925-1950",
    layers: [{ periodo: "1925-1950", source: `${baseSources.period1925}/B.JOSE Mª Y JUAN CASTIZO PINTO.shp` }]
  },
  {
    slug: "bodegas-jose-cepeda-rojas",
    nombre: "Bodegas José Cepeda Rojas",
    periodo: "1925-1950",
    imagen: img("ANUNCIO B.JOSÉ CEPEDA ROJAS EN REVISTA FIESTA DE LA VENDIMIA 1964.jpeg"),
    imagenes: [
      image(
        img("ANUNCIO B.JOSÉ CEPEDA ROJAS EN REVISTA FIESTA DE LA VENDIMIA 1964.jpeg"),
        "Anuncio de Bodegas José Cepeda Rojas"
      )
    ],
    layers: [{ periodo: "1925-1950", source: `${baseSources.period1925}/B.JOSÉ CEPEDA ROJAS.shp` }]
  },
  {
    slug: "bodegas-julio-garcilaso",
    nombre: "Bodegas Julio Garcilaso",
    periodo: "1925-1950",
    layers: [{ periodo: "1925-1950", source: `${baseSources.period1925}/B.JULIO GARCILASO.shp` }]
  },
  {
    slug: "bodegas-noguera",
    nombre: "Bodegas Noguera",
    periodo: "1925-1950",
    layers: [{ periodo: "1925-1950", source: `${baseSources.period1925}/B.NOGUERA.shp` }]
  },
  {
    slug: "bodegas-teba",
    nombre: "Bodegas Teba",
    periodo: "1925-1950",
    imagen: img("BODEGAS TEBA (FACEBOOK ).jpg"),
    imagenes: [image(img("BODEGAS TEBA (FACEBOOK ).jpg"), "Imagen documental de Bodegas Teba")],
    layers: [{ periodo: "1925-1950", source: `${baseSources.period1925}/B.TEBA.shp` }]
  },
  {
    slug: "bodegas-garay",
    nombre: "Bodegas Garay",
    periodo: "Actuales",
    layers: [{ periodo: "Actuales", source: `${baseSources.actuales}/B.GARAY.shp` }]
  },
  {
    slug: "bodegas-infante-mam",
    nombre: "Bodegas Infante MAM",
    periodo: "Actuales",
    layers: [{ periodo: "Actuales", source: `${baseSources.actuales}/B.INFANTE MAM.shp` }]
  },
  {
    slug: "bodegas-magase",
    nombre: "Bodegas Magasé",
    periodo: "Actuales",
    layers: [{ periodo: "Actuales", source: `${baseSources.actuales}/B.MAGASÉ.shp` }]
  },
  {
    slug: "bodegas-millan",
    nombre: "Bodegas Millán",
    periodo: "Actuales",
    layers: [{ periodo: "Actuales", source: `${baseSources.actuales}/B.MILLÁN.shp` }]
  },
  {
    slug: "bodegas-vega-menacho",
    nombre: "Bodegas Vega Menacho",
    periodo: "Actuales",
    layers: [{ periodo: "Actuales", source: `${baseSources.actuales}/B.VEGA MENACHO.shp` }]
  },
  {
    slug: "bodegas-torrepalma",
    nombre: "Bodegas Torrepalma",
    periodo: "Cooperativas",
    layers: [{ periodo: "Cooperativas", source: `${baseSources.cooperativas}/B.TORREPALMA.shp` }]
  },
  {
    slug: "cooperativa-nuestra-senora-guia",
    nombre: "Cooperativa Nuestra Señora de Guía",
    periodo: "Cooperativas",
    imagen: img("COOPERATIVA NA sRA DE GUIA.jpg"),
    imagenes: [
      image(img("COOPERATIVA NA sRA DE GUIA.jpg"), "Cooperativa Nuestra Señora de Guía"),
      image(img("FOTO COOPERATIVA NUESTRA SEÑORA DE GUIA CORUMBEL 2007 (CAP 4).jfif"), "Archivo Corumbel de la Cooperativa Nuestra Señora de Guía")
    ],
    layers: [{ periodo: "Cooperativas", source: `${baseSources.cooperativas}/COOPERATIVA NUESTRA SEÑORA DE GUIA.shp` }]
  }
].map((record) => {
  const periodo = record.periodo || record.layers.map((layer) => layer.periodo).join(" / ");
  const imagen = record.imagen || pub("placeholder-bodega.svg");
  return {
    estado: "cartografica",
    documentacion: "cartografica",
    ubicacion: `Registro cartográfico QGIS: ${periodo}`,
    resumen:
      `Registro incorporado desde capas QGIS del periodo ${periodo}. Se presenta como ficha cartográfica hasta completar una ficha de catalogación documental.`,
    imagen,
    imagenes: record.imagenes || [image(imagen, `Registro cartográfico de ${record.nombre}`)],
    href: `bodega.html?slug=${record.slug}`,
    qgisZip: qgisZipFor(record.slug),
    periodo,
    lectura:
      `Este registro se incorpora como ficha cartográfica profesional: conserva el nombre normalizado de la capa, su periodo de procedencia y la geometría original para consulta en mapa y descarga QGIS. Queda diferenciado de las fichas de catalogación completas para no mezclar trazado cartográfico con interpretación histórica todavía pendiente.`,
    pendiente:
      "Pendiente de ficha de catalogación textual. La geometría procede de QGIS y funciona como testigo documental mínimo.",
    fuentes: [fuenteQgis, fuenteTfg],
    ...record
  };
});

const allRecords = [...records, ...cartographicRecords].map((record) => ({
  ...record,
  qgisZip: record.qgisZip || qgisZipFor(record.slug),
  capas: record.layers?.map((layer) => layer.source) || []
}));

function utm29ToLngLat(easting, northing) {
  const a = 6378137;
  const f = 1 / 298.257222101;
  const k0 = 0.9996;
  const e = Math.sqrt(f * (2 - f));
  const e1sq = (e * e) / (1 - e * e);
  const x = easting - 500000;
  const y = northing;
  const zone = 29;
  const lonOrigin = (zone - 1) * 6 - 180 + 3;
  const m = y / k0;
  const mu = m / (a * (1 - e ** 2 / 4 - (3 * e ** 4) / 64 - (5 * e ** 6) / 256));
  const e1 = (1 - Math.sqrt(1 - e ** 2)) / (1 + Math.sqrt(1 - e ** 2));
  const fp =
    mu +
    (3 * e1 / 2 - 27 * e1 ** 3 / 32) * Math.sin(2 * mu) +
    (21 * e1 ** 2 / 16 - 55 * e1 ** 4 / 32) * Math.sin(4 * mu) +
    (151 * e1 ** 3 / 96) * Math.sin(6 * mu) +
    (1097 * e1 ** 4 / 512) * Math.sin(8 * mu);
  const c1 = e1sq * Math.cos(fp) ** 2;
  const t1 = Math.tan(fp) ** 2;
  const r1 = (a * (1 - e ** 2)) / (1 - e ** 2 * Math.sin(fp) ** 2) ** 1.5;
  const n1 = a / Math.sqrt(1 - e ** 2 * Math.sin(fp) ** 2);
  const d = x / (n1 * k0);
  const lat =
    fp -
    ((n1 * Math.tan(fp)) / r1) *
      (d ** 2 / 2 -
        ((5 + 3 * t1 + 10 * c1 - 4 * c1 ** 2 - 9 * e1sq) * d ** 4) / 24 +
        ((61 + 90 * t1 + 298 * c1 + 45 * t1 ** 2 - 252 * e1sq - 3 * c1 ** 2) * d ** 6) / 720);
  const lon =
    ((d -
      ((1 + 2 * t1 + c1) * d ** 3) / 6 +
      ((5 - 2 * c1 + 28 * t1 - 3 * c1 ** 2 + 8 * e1sq + 24 * t1 ** 2) * d ** 5) / 120) /
      Math.cos(fp));
  return [round(lonOrigin + (lon * 180) / Math.PI), round((lat * 180) / Math.PI)];
}

function round(value) {
  return Number(value.toFixed(8));
}

function readShpPolygons(relativePath) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`Missing shapefile: ${relativePath}`);
    return [];
  }

  const buffer = fs.readFileSync(fullPath);
  const prjPath = fullPath.replace(/\.shp$/i, ".prj");
  const prj = fs.existsSync(prjPath) ? fs.readFileSync(prjPath, "utf8") : "";
  const isGeographic =
    (!/PROJCS/i.test(prj) && /GEOGCS/i.test(prj)) ||
    (Math.abs(buffer.readDoubleLE(36)) <= 180 &&
      Math.abs(buffer.readDoubleLE(52)) <= 180 &&
      Math.abs(buffer.readDoubleLE(44)) <= 90 &&
      Math.abs(buffer.readDoubleLE(60)) <= 90);
  const transformPoint = isGeographic ? (x, y) => [round(x), round(y)] : utm29ToLngLat;
  const polygons = [];
  let offset = 100;

  while (offset + 8 <= buffer.length) {
    const contentLength = buffer.readInt32BE(offset + 4) * 2;
    const contentOffset = offset + 8;
    const shapeType = buffer.readInt32LE(contentOffset);

    if (shapeType === 5 || shapeType === 15 || shapeType === 25) {
      const numParts = buffer.readInt32LE(contentOffset + 36);
      const numPoints = buffer.readInt32LE(contentOffset + 40);
      const parts = [];
      for (let i = 0; i < numParts; i += 1) {
        parts.push(buffer.readInt32LE(contentOffset + 44 + i * 4));
      }

      const pointsOffset = contentOffset + 44 + numParts * 4;
      for (let partIndex = 0; partIndex < numParts; partIndex += 1) {
        const start = parts[partIndex];
        const end = partIndex + 1 < numParts ? parts[partIndex + 1] : numPoints;
        const ring = [];
        for (let pointIndex = start; pointIndex < end; pointIndex += 1) {
          const pointOffset = pointsOffset + pointIndex * 16;
          const x = buffer.readDoubleLE(pointOffset);
          const y = buffer.readDoubleLE(pointOffset + 8);
          ring.push(transformPoint(x, y));
        }

        if (ring.length >= 3) {
          const first = ring[0];
          const last = ring[ring.length - 1];
          if (first[0] !== last[0] || first[1] !== last[1]) ring.push(first);
          polygons.push([ring]);
        }
      }
    }

    offset = contentOffset + contentLength;
  }

  return polygons;
}

function allCoordinatePairs(coordinates, pairs = []) {
  if (!Array.isArray(coordinates)) return pairs;
  if (typeof coordinates[0] === "number" && typeof coordinates[1] === "number") {
    pairs.push(coordinates);
    return pairs;
  }
  coordinates.forEach((nested) => allCoordinatePairs(nested, pairs));
  return pairs;
}

function geometryCenter(geometry) {
  const pairs = allCoordinatePairs(geometry.coordinates);
  if (pairs.length === 0) return null;
  const bounds = pairs.reduce(
    (acc, [lng, lat]) => ({
      minLng: Math.min(acc.minLng, lng),
      maxLng: Math.max(acc.maxLng, lng),
      minLat: Math.min(acc.minLat, lat),
      maxLat: Math.max(acc.maxLat, lat)
    }),
    { minLng: Infinity, maxLng: -Infinity, minLat: Infinity, maxLat: -Infinity }
  );
  return {
    lat: round((bounds.minLat + bounds.maxLat) / 2),
    lng: round((bounds.minLng + bounds.maxLng) / 2)
  };
}

function featureFor(record) {
  const coordinates = [];
  for (const layer of record.layers || []) {
    coordinates.push(...readShpPolygons(layer.source));
  }
  const geometry = {
    type: "MultiPolygon",
    coordinates
  };
  const center = geometryCenter(geometry);
  if (center) record.coordenadas = center;

  return {
    type: "Feature",
    properties: {
      slug: record.slug,
      nombre: record.nombre,
      estado: record.estado,
      documentacion: record.documentacion,
      periodo: record.periodo || record.layers?.map((layer) => layer.periodo).join(" / "),
      ubicacion: record.ubicacion,
      resumen: record.resumen,
      fuente: record.capas.join("; "),
      qgisZip: record.qgisZip,
      crs_original: "ETRS89 / UTM zone 29N"
    },
    geometry
  };
}

const features = allRecords.map(featureFor).filter((feature) => feature.geometry.coordinates.length > 0);

const geoJson = {
  type: "FeatureCollection",
  name: "bodegas",
  metadata: {
    title: "Patrimonio bodeguero de La Palma del Condado",
    source: "Capas QGIS normalizadas a GeoJSON EPSG:4326 desde CAPAS DE QGIS TODO.",
    crs: "EPSG:4326",
    status: `${features.length} registros con geometría: fichas de catalogación y registros cartográficos.`
  },
  features
};

const dataOutput =
  "window.BODEGAS = " +
  JSON.stringify(
    allRecords.map(({ layers, ...record }) => record),
    null,
    2
  ) +
  ";\n";

fs.writeFileSync(path.join(root, "js/data.js"), dataOutput, "utf8");
fs.writeFileSync(path.join(root, "public/mapas/bodegas.geojson"), JSON.stringify(geoJson, null, 2) + "\n", "utf8");

console.log(`Wrote ${allRecords.length} catalog records to js/data.js`);
console.log(`Wrote ${features.length} GeoJSON features to public/mapas/bodegas.geojson`);
