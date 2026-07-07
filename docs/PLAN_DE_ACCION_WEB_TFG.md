# PLAN DE ACCIÓN — WEB TFG
## "Arquitectura y Memoria Perdida del Vino"
### Patrimonio Bodeguero de La Palma del Condado

---

## CONTEXTO DEL PROYECTO

Esta web es la publicación digital de un Trabajo de Fin de Grado de Arquitectura (ETSA-US, 2026) sobre el patrimonio bodeguero de La Palma del Condado (Huelva). El contenido incluye análisis histórico-territorial, cartografía QGIS propia, y fichas de catalogación de bodegas históricas y actuales. El Ayuntamiento del municipio podría ponerla a disposición pública, por lo que la calidad debe ser institucional-cultural de primer nivel.

**Autora:** Blanca Rubio García  
**Tutora:** Rocío Romero  
**Institución:** ETSA — Universidad de Sevilla, 2026

---

## 1. STACK TECNOLÓGICO

### Framework y build
- **Astro 4.x** — generación estática, ideal para contenido académico, SEO perfecto, carga ultrarrápida
- **Tailwind CSS 3.x** — utility-first, responsive sin esfuerzo
- **TypeScript** — tipado para el sistema de fichas y datos

### Librerías clave (todas CDN/npm desde GitHub/npm registry)
- **GSAP (GreenSock)** — animaciones scroll, timelines, reveales. La mejor librería de animación web profesional
- **Leaflet.js** — mapas interactivos para localización de bodegas, superposición de capas históricas
- **Swiper.js** — carousels de imágenes en fichas de bodegas
- **Lenis** — smooth scroll suave y elegante
- **Sharp** (Astro built-in) — optimización automática de imágenes
- **@astro/image** — lazy loading nativo
- **Fuse.js** — búsqueda fuzzy para el catálogo de bodegas
- **CountUp.js** — animación de cifras estadísticas (nº bodegas, superficie, fechas)

### Hospedaje recomendado
- **Netlify** o **Vercel** — despliegue gratuito, CDN global, HTTPS automático, formulario de contacto incluido
- Dominio sugerido: `patrimoniobodeguero.es` o `bodegaslapalma.es`

---

## 2. IDENTIDAD VISUAL

### Paleta de color (extraída del propio TFG)
```
--color-vino:        #6B1A2B   /* Burdeos principal — titulares, fondos de sección */
--color-vino-oscuro: #3D0F18   /* Fondos oscuros, footer */
--color-vino-suave:  #8B2E42   /* Hover states, acentos secundarios */
--color-oro:         #C9A84C   /* Acento dorado — fechas, números, detalles */
--color-crema:       #F5F0E8   /* Fondo principal texto */
--color-blanco:      #FAFAF8   /* Cards, fondos de fichas */
--color-gris:        #4A4543   /* Texto body */
--color-gris-suave:  #9B9490   /* Captions, metadata */
```

### Tipografía
- **Display / Títulos principales:** `Playfair Display` (Google Fonts) — serif elegante, reminiscente de prensa histórica
- **Subtítulos / Secciones:** `Cormorant Garamond` — académico, refinado
- **Body / Texto largo:** `Source Serif 4` — legible en pantalla, académico
- **UI / Datos / Etiquetas:** `DM Sans` — limpio, moderno, contrasta con las serifas
- **Números / Fechas destacadas:** `DM Mono` — estilo técnico para datos catastrales y coordenadas

### Elemento firma (signature)
Una **línea de tiempo animada vertical** que recorre toda la home al hacer scroll, con nodos en cada época histórica (s.XIV, s.XVI, 1880, 1924, 1957, 1990, hoy). Actúa como columna vertebral visual de la narrativa.

---

## 3. ARQUITECTURA DE LA WEB

```
/                          → HOME (landing + resumen narrativo)
/historia                  → Capítulo 3 + 4: análisis histórico-territorial
/catalogo                  → Capítulo 5: grid de todas las fichas de bodegas
/bodega/[slug]             → Ficha individual de cada bodega (ruta dinámica)
/mapa                      → Mapa interactivo Leaflet con todas las bodegas
/sobre-el-proyecto         → Metodología, autora, tutora, ETSA-US
/contacto                  → Formulario + datos Ayuntamiento
```

---

## 4. SECCIONES Y COMPONENTES — DESCRIPCIÓN DETALLADA

---

### 4.1 HOME (`/`)

#### HERO — Pantalla completa
- Fondo oscuro burdeos (`--color-vino-oscuro`) con imagen de las Bodegas Morales o Rubio en overlay sutil (opacity ~15%)
- Título animado con GSAP: letras que aparecen una a una o por líneas
  ```
  ARQUITECTURA
  Y MEMORIA PERDIDA
  DEL VINO
  ```
- Subtítulo en `Cormorant Garamond`: *"Análisis y catalogación del patrimonio bodeguero de La Palma del Condado"*
- Scroll indicator animado (flecha que pulsa suavemente)
- Al hacer scroll, el hero hace parallax hacia arriba

#### DATOS CLAVE — Sección de cifras animadas (CountUp.js)
Cuatro tarjetas con números que cuentan al entrar en viewport:
- `6` Bodegas activas hoy
- `+18` Bodegas históricas documentadas  
- `1871` Año de la primera máquina de vapor en España (instalada en La Palma)
- `82%` Patrimonio bodeguero perdido en el s.XX

#### LÍNEA DE TIEMPO — La columna vertebral
Sección de scroll largo con la línea temporal vertical (GSAP ScrollTrigger):
- **S.XIV-XV** — Origen y formación del núcleo urbano
- **S.XVI-XVIII** — Consolidación de la historia vinícola
- **1871-1880** — Revolución industrial y "Cuna del Brandy"
- **1877-1924** — Edad de oro y revolución arquitectónica
- **1925-1990** — Crisis, cooperativismo y desmantelamiento
- **Hoy** — Las seis firmas supervivientes

Cada nodo al activarse revela texto + imagen histórica con animación fade-slide.

#### MAPA PREVIEW
Miniatura del mapa de La Palma con puntos de bodegas (actuales en dorado, desaparecidas en gris). CTA: "Ver mapa completo →"

#### CATÁLOGO PREVIEW — Las fichas
Grid de 3 columnas (móvil: 1 col) con las primeras 4-6 bodegas. Cada card:
- Imagen principal
- Nombre en mayúsculas
- Año de fundación
- Etiqueta "ACTIVA" (dorado) o "DESAPARECIDA" (gris)
- Hover: overlay burdeos con "Ver ficha →"

#### CITA HISTÓRICA
Bloque tipográfico llamativo con la cita del TFG:
> *"el vino de La Palma del Condado es reconocido como muy bueno para la salud y nada nocivo por ser elaborado con las mejores uvas."*
> — Carta al Gobernador de Santo Domingo, s.XVI

#### FOOTER
Logo/nombre del proyecto, créditos (ETSA-US, autora, tutora), enlace al Ayuntamiento, año.

---

### 4.2 HISTORIA (`/historia`)

Página de desplazamiento largo que desarrolla los capítulos 3 y 4 del TFG.

#### Estructura
- Sticky sidebar izquierda (desktop) con índice de secciones que resalta la activa al hacer scroll
- Contenido principal en dos columnas: texto izquierda, imágenes/mapas derecha
- En móvil: columna única, sidebar colapsa en menú superior

#### Secciones
1. **El Condado de Huelva** — Geografía y medio físico
2. **Análisis histórico-económico** — Las 5 épocas con la línea temporal
3. **La Palma del Condado** — Análisis geográfico, demográfico y económico
4. **Historia vinícola de La Palma** — Las 5 fases de evolución

#### Elementos especiales
- **Mapas QGIS exportados como PNG o SVG** insertados con zoom y leyenda
- **Galería de cartografía histórica** (planos IGN que aparecen en el TFG) con Swiper
- **Gráficas de datos** (evolución demográfica, sectores económicos) renderizadas con CSS puro o Chart.js minimalista, en paleta burdeos/dorado
- **Notas al pie** flotantes (hover sobre número → aparece nota en tooltip elegante)

---

### 4.3 CATÁLOGO (`/catalogo`)

Grid completo de todas las bodegas catalogadas.

#### Filtros (Fuse.js + estado reactivo)
- Por estado: **Todas** | **Activas** | **Desaparecidas**
- Por época: s.XIX | Principios s.XX | Mediados s.XX
- Búsqueda libre por nombre

#### Tarjeta de bodega (card)
```
┌─────────────────────────────┐
│  [Imagen / plano si no hay  │
│   foto]                     │
│─────────────────────────────│
│  BODEGAS RUBIO 1893 SL      │
│  ● ACTIVA            1946   │
│  Calle Palos de la Frontera │
│                             │
│  [Ver ficha →]              │
└─────────────────────────────┘
```

- Las bodegas desaparecidas tienen la imagen en B&N con overlay sutil
- Animación de entrada al hacer scroll: las cards aparecen en cascada (stagger GSAP)

---

### 4.4 FICHA DE BODEGA (`/bodega/[slug]`)

Esta es la página más importante. Replica y amplía la ficha del TFG en formato digital interactivo.

#### Layout — Dos columnas en desktop
**Columna izquierda (40%) — Datos técnicos:**
- Denominación (H1 grande)
- Etiqueta de estado (activa/desaparecida)
- Ubicación con icono
- Referencia catastral con enlace directo a Catastro virtual (`https://www1.sedecatastro.gob.es/...`)
- Año de construcción
- Año de desaparición (si aplica)
- Bodegas anteriores/posteriores (si aplica)
- **Mini-mapa Leaflet** centrado en la parcela de la bodega (con marcador)
- **Plano de situación** (imagen del TFG) con zoom lightbox
- **Planimetría** (planta de la bodega si existe) con zoom lightbox y leyenda de espacios

**Columna derecha (60%) — Narrativa y visual:**
- Galería de imágenes Swiper (foto fachada, interior, imágenes históricas, vuelo americano CNIG)
- **"Datos sobre la bodega"** — texto histórico completo del TFG
- Timeline específica de la bodega si tiene varias etapas
- Sección **"Entorno histórico"** — qué había antes, qué hay ahora

#### Botones de acción
- `← Volver al catálogo`
- `Ver en el mapa →` (lleva al mapa filtrado por esa bodega)
- `Descargar ficha PDF` (versión imprimible generada desde la web)

#### Navegación entre fichas
Botones Previous / Next para ir a la siguiente bodega del catálogo.

---

### 4.5 MAPA INTERACTIVO (`/mapa`)

Mapa a pantalla completa con Leaflet.js.

#### Capas base disponibles (selector de capas)
- **OpenStreetMap** — base moderna
- **CartoDB Positron** — estilo minimalista elegante (recomendado por defecto)
- **PNOA / Ortofoto IGN** — imagen aérea actual de España  
  URL: `https://www.ign.es/wmts/pnoa-ma?SERVICE=WMTS&...` (WMS/WMTS del IGN, gratuito y público)

#### Capas históricas (toggles)
- **Vuelo Americano 1956-1957** — si se tienen los tiles del CNIG o se exporta como imagen georreferenciada desde QGIS y se superpone con `L.imageOverlay`
- **Bodegas actuales** — marcadores dorados
- **Bodegas desaparecidas** — marcadores grises con icono "fantasma"
- **Conjunto histórico BIC** — polígono del área declarada (KML/GeoJSON exportado de QGIS)
- **Línea de ferrocarril histórica** — trazado vectorial (GeoJSON desde QGIS)

#### Formato de datos
Exportar desde QGIS como **GeoJSON** (File → Export → Save Features As → GeoJSON, CRS: EPSG:4326). Leaflet los carga directamente con `L.geoJSON()`.

#### Popup al hacer clic en un marcador
```
┌──────────────────────┐
│ [miniatura imagen]   │
│ BODEGAS RUBIO 1893   │
│ ● Activa — 1946      │
│ [Ver ficha completa] │
└──────────────────────┘
```

#### Panel lateral (desktop)
Lista de bodegas que se actualiza al mover el mapa, ordenadas por distancia al centro del viewport.

#### Exportación QField (enlace especial)
Añadir un enlace de descarga del proyecto QGIS en formato `.qgs` o `.gpkg` con las capas vectoriales, para que investigadores o el Ayuntamiento puedan abrir los datos en QGIS directamente.

---

### 4.6 SOBRE EL PROYECTO (`/sobre-el-proyecto`)

- Resumen del TFG (Motivación, Relevancia, Hipótesis, Metodología)
- Ficha académica: autora, tutora, escuela, año
- Fuentes y bibliografía en formato académico (las del TFG)
- Agradecimientos

---

### 4.7 CONTACTO (`/contacto`)

- Formulario sencillo (nombre, email, mensaje) — gestionado por Netlify Forms (gratuito, sin backend)
- Datos del Ayuntamiento de La Palma del Condado (si se autoriza)
- Enlace a la ficha BIC del conjunto histórico en el IAPH (Instituto Andaluz del Patrimonio Histórico)

---

## 5. SISTEMA DE DATOS — FICHAS (MUY IMPORTANTE)

Toda la información de las bodegas se almacena en archivos **JSON o Markdown con frontmatter** dentro de la carpeta `/src/content/bodegas/`. Esto permite:
1. Añadir nuevas fichas sin tocar código
2. La IA programadora las lee automáticamente (Astro Content Collections)
3. Fácil exportación a otros formatos

### Esquema de datos para cada bodega

```typescript
// src/content/config.ts
interface Bodega {
  slug: string                    // "bodegas-rubio"
  nombre: string                  // "Bodegas Rubio 1893 SL"
  estado: "activa" | "desaparecida"
  ubicacion: string               // "Calle Palos de la Frontera, 14"
  referenciaCatastral?: string    // "6704124QB1460S0001WK"
  coordenadas: {
    lat: number
    lng: number
  }
  anoConstruccion?: number        // 1893
  anoDesaparicion?: number        // null si activa
  bodegasAnteriores?: string[]    // ["Bodega El Cura Aguilar"]
  bodegasPosteriores?: string[]   // []
  imagenes: {
    principal: string             // ruta a /public/bodegas/rubio/fachada.jpg
    galeria: string[]
    planimetria?: string
    planoSituacion?: string
    vueloAmericano?: string
  }
  resumenCorto: string            // 2-3 líneas para la card del catálogo
  historia: string                // texto largo en Markdown
  fuentesBibliograficas?: string[]
}
```

### Cómo añadir una nueva bodega
Crear el archivo `/src/content/bodegas/nombre-bodega.md` con el frontmatter del esquema y el texto en Markdown. Astro genera automáticamente la ruta `/bodega/nombre-bodega`.

---

## 6. RESPONSIVE DESIGN — BREAKPOINTS

```
Mobile:   < 640px   → 1 columna, nav hamburger, mapa pantalla completa
Tablet:   640-1024px → 2 columnas, sidebar colapsable
Desktop:  > 1024px  → Layout completo, sidebar fija, mapa con panel lateral
```

---

## 7. ANIMACIONES — ESPECIFICACIONES GSAP

### Reglas generales
- Respetar `prefers-reduced-motion`: todas las animaciones se desactivan si el usuario lo ha configurado
- No animar más de 2-3 elementos simultáneamente
- Duración estándar: 0.6s-0.9s, ease: `power2.out`

### Animaciones específicas

#### Hero entry (on load)
```javascript
gsap.timeline()
  .from(".hero-title span", { 
    y: 80, opacity: 0, stagger: 0.08, duration: 0.9, ease: "power3.out" 
  })
  .from(".hero-subtitle", { 
    y: 20, opacity: 0, duration: 0.6 
  }, "-=0.4")
  .from(".hero-cta", { 
    y: 20, opacity: 0, duration: 0.4 
  }, "-=0.3")
```

#### Timeline scroll (ScrollTrigger)
```javascript
gsap.utils.toArray(".timeline-node").forEach(node => {
  gsap.from(node, {
    scrollTrigger: {
      trigger: node,
      start: "top 75%",
      toggleActions: "play none none reverse"
    },
    x: -40, opacity: 0, duration: 0.7, ease: "power2.out"
  })
})
```

#### Cards del catálogo (stagger al entrar en viewport)
```javascript
gsap.from(".bodega-card", {
  scrollTrigger: { trigger: ".catalog-grid", start: "top 80%" },
  y: 40, opacity: 0, stagger: 0.1, duration: 0.6
})
```

#### CountUp — números estadísticos
```javascript
// Activar cuando el elemento entra en viewport
new CountUp(element, targetNumber, { duration: 2.5, separator: "." }).start()
```

---

## 8. SEO Y ACCESIBILIDAD

- Meta tags completos en cada página (`<title>`, `description`, OG tags para redes sociales)
- Schema.org markup tipo `HistoricBuilding` para cada bodega
- Imágenes con `alt` descriptivo en español
- Contraste de color AA mínimo (burdeos sobre crema ✓)
- Navegación con teclado (focus visible)
- `lang="es"` en el HTML root
- Sitemap.xml generado automáticamente por Astro
- `robots.txt` permisivo para indexación

---

## 9. ESTRUCTURA DE ARCHIVOS DEL PROYECTO

```
/
├── public/
│   ├── bodegas/
│   │   ├── rubio/
│   │   │   ├── fachada.jpg
│   │   │   ├── interior.jpg
│   │   │   └── planimetria.png
│   │   ├── verdier/
│   │   │   ├── foto-historica.jpg
│   │   │   └── chimenea.jpg
│   │   └── [slug]/
│   ├── mapas/
│   │   ├── bodegas.geojson        ← exportado desde QGIS
│   │   ├── conjunto-historico-bic.geojson
│   │   └── ferrocarril.geojson
│   ├── descargas/
│   │   └── proyecto-qgis.gpkg     ← para usuarios de QGIS
│   └── favicon.ico
│
├── src/
│   ├── content/
│   │   └── bodegas/
│   │       ├── bodegas-rubio.md
│   │       ├── bodegas-verdier.md
│   │       └── [nueva-bodega].md   ← así se añaden nuevas fichas
│   │
│   ├── components/
│   │   ├── BodegaCard.astro
│   │   ├── BodegaMap.astro          ← componente Leaflet (client:load)
│   │   ├── FichaCompleta.astro
│   │   ├── Timeline.astro
│   │   ├── HeroSection.astro
│   │   ├── CatalogGrid.astro
│   │   ├── StatCounter.astro
│   │   ├── ImageLightbox.astro
│   │   ├── NavBar.astro
│   │   └── Footer.astro
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro         ← HTML base, meta tags, fonts
│   │   ├── FichaLayout.astro        ← layout de 2 columnas para fichas
│   │   └── PageLayout.astro         ← layout general con sidebar
│   │
│   ├── pages/
│   │   ├── index.astro              ← HOME
│   │   ├── historia.astro
│   │   ├── catalogo.astro
│   │   ├── bodega/
│   │   │   └── [slug].astro         ← ruta dinámica generada por Astro
│   │   ├── mapa.astro
│   │   ├── sobre-el-proyecto.astro
│   │   └── contacto.astro
│   │
│   └── styles/
│       ├── global.css               ← variables CSS, reset, tipografía
│       └── animations.css           ← clases de animación reutilizables
│
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

---

## 10. ORDEN DE IMPLEMENTACIÓN (PASO A PASO PARA LA IA PROGRAMADORA)

### FASE 1 — Setup y base (hacer primero)
1. Inicializar proyecto Astro con `npm create astro@latest` (template: empty, TypeScript: strict)
2. Instalar Tailwind CSS con `npx astro add tailwind`
3. Configurar Google Fonts en `BaseLayout.astro`: Playfair Display, Cormorant Garamond, Source Serif 4, DM Sans, DM Mono
4. Crear el sistema de variables CSS en `global.css` con todos los colores y tipografías definidos arriba
5. Crear `NavBar.astro` y `Footer.astro` con el diseño base

### FASE 2 — Sistema de contenido
6. Configurar Astro Content Collections en `src/content/config.ts` con el esquema de Bodega
7. Crear los archivos `.md` para **Bodegas Rubio** y **Bodegas Verdier** (las dos fichas que ya existen en el TFG) como plantilla para las demás
8. Crear la página dinámica `/bodega/[slug].astro` que lee el Content Collection

### FASE 3 — HOME
9. Construir `HeroSection.astro` con el título animado (GSAP on load)
10. Instalar GSAP: `npm install gsap`
11. Implementar `StatCounter.astro` con CountUp.js
12. Construir `Timeline.astro` con ScrollTrigger
13. Añadir el mapa preview (imagen estática por ahora) y el catálogo preview con las 2 bodegas existentes

### FASE 4 — Catálogo y fichas
14. Construir `CatalogGrid.astro` con el grid filtrable (Fuse.js para búsqueda)
15. Construir `FichaCompleta.astro` con el layout de 2 columnas
16. Implementar `ImageLightbox.astro` para zoom de planimetrías e imágenes
17. Instalar Swiper.js para galerías: `npm install swiper`
18. Instalar Lenis para smooth scroll: `npm install @studio-freight/lenis`

### FASE 5 — Mapa interactivo
19. Instalar Leaflet: `npm install leaflet @types/leaflet`
20. Crear `BodegaMap.astro` con `client:load` (hidratación en el navegador)
21. Exportar GeoJSON desde QGIS y colocarlo en `/public/mapas/bodegas.geojson`
22. Implementar capas: CartoDB Positron (base), marcadores dorados/grises, popup con mini-ficha
23. Añadir selector de capas (PNOA IGN, Vuelo Americano si disponible, BIC, ferrocarril)
24. Implementar filtros de capas en el panel lateral

### FASE 6 — Páginas secundarias
25. Construir `/historia` con sticky sidebar y contenido del Capítulo 3 del TFG
26. Construir `/sobre-el-proyecto` con información académica
27. Construir `/contacto` con formulario Netlify Forms

### FASE 7 — Optimización y despliegue
28. Optimizar todas las imágenes (WebP, lazy loading, `loading="lazy"`)
29. Añadir meta tags SEO en todas las páginas
30. Test de accesibilidad (Lighthouse accessibility score > 95)
31. Test de performance (Lighthouse performance score > 90)
32. Despliegue en Netlify: conectar repositorio GitHub → deploy automático

---

## 11. NOTAS PARA LA IA PROGRAMADORA

- **Nunca usar localStorage** — Astro es SSG, el estado del filtro de catálogo se gestiona con URL params (`?estado=activa&busqueda=morales`) para que los enlaces sean compartibles
- **El mapa Leaflet SIEMPRE usa `client:load`** — Leaflet no funciona en SSR, necesita el navegador
- **Los PDFs de los planos QGIS** se sirven directamente desde `/public/` como archivos estáticos
- **GeoJSON desde QGIS:** exportar con CRS EPSG:4326 (WGS84), no proyectado
- **El enlace al Catastro** se construye así: `https://www1.sedecatastro.gob.es/Cartografia/mapa.aspx?del=21&mun=073&refcat=6704124QB1460S0001WK` (provincia Huelva = 21, municipio La Palma = 073)
- **Fuentes del IGN para el mapa:**
  - Ortofoto PNOA: `https://www.ign.es/wmts/pnoa-ma` (WMTS gratuito)
  - Callejero: `https://www.ign.es/wmts/ign-base` (WMTS gratuito)
- **Todas las animaciones GSAP** deben estar dentro de un `<script>` en el componente `.astro` o en un archivo `.ts` importado, nunca inline

---

## 12. CONTENIDO A PROPORCIONAR A LA IA PROGRAMADORA

Junto con este plan, entregar a la IA programadora:

1. **Este documento** (plan de acción)
2. **El PDF del TFG** (ARCHIVO_TFG_26_06.pdf) — para extraer textos de cada sección
3. **El PDF de la ficha ejemplo** (FICHA_EJEMPLO_MAQUETACIO_N_28_06.pdf) — para el diseño de la ficha digital
4. **Las imágenes/planos** del TFG (exportadas como PNG desde el PDF o desde QGIS)
5. **Los archivos GeoJSON** exportados desde QGIS con las capas de bodegas (cuando estén listos)
6. **Las fotos** de cada bodega que vayan consiguiendo

---

*Plan elaborado el 28 de junio de 2026. Actualizar según avance del TFG y disponibilidad de fichas.*
