(function () {
  const normalize = (value) =>
    String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const formatStatus = (status) => (status === "activa" ? "Activa" : "Desaparecida");

  const escapeHtml = (value) =>
    String(value || "").replace(/[&<>"']/g, (char) => {
      const replacements = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      };
      return replacements[char] || char;
    });

  const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initNavigation() {
    const header = document.querySelector("[data-nav-root]");
    const toggle = document.querySelector("[data-nav-toggle]");
    const menu = document.querySelector("[data-nav-menu]");
    const currentFile = location.pathname.split("/").pop() || "index.html";
    const activeFile = currentFile.startsWith("bodegas-") ? "catalogo.html" : currentFile;

    document.querySelectorAll("[data-nav-link]").forEach((link) => {
      const hrefFile = link.getAttribute("href") || "";
      if (hrefFile === activeFile || (activeFile === "index.html" && hrefFile === "./")) {
        link.setAttribute("aria-current", "page");
      }
    });

    if (!header || !toggle || !menu) return;

    const updateScrolledState = () => {
      header.toggleAttribute("data-scrolled", window.scrollY > 18);
    };

    updateScrolledState();
    window.addEventListener("scroll", updateScrolledState, { passive: true });

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      header.toggleAttribute("data-open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        header.removeAttribute("data-open");
        document.body.classList.remove("menu-open");
      });
    });
  }

  function initReveal() {
    const items = Array.from(document.querySelectorAll("[data-animate]"));
    if (!("IntersectionObserver" in window) || items.length === 0) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.16 }
    );

    items.forEach((item, index) => {
      item.style.setProperty("--reveal-order", index % 6);
      item.style.setProperty("--reveal-delay", `${(index % 6) * 70}ms`);
      observer.observe(item);
    });
  }

  function initProfessionalMotion() {
    if (prefersReducedMotion()) return;

    const tiltItems = document.querySelectorAll(
      ".stat-card, .preview-card, .bodega-card, .map-preview, .hero-panel, .academic-card, .contact-note, .urban-panel, .cartography-grid article, .source-note, .outputs-panel, .sources-grid article, .contact-sidebar section, .technical-panel, .ficha-nav a"
    );

    tiltItems.forEach((item) => {
      item.classList.add("motion-card");

      item.addEventListener("pointermove", (event) => {
        if (event.pointerType === "touch") return;
        const rect = item.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5).toFixed(3);
        const y = ((event.clientY - rect.top) / rect.height - 0.5).toFixed(3);
        item.style.setProperty("--tilt-x", `${Number(y) * -4}deg`);
        item.style.setProperty("--tilt-y", `${Number(x) * 5}deg`);
        item.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
        item.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
      });

      item.addEventListener("pointerleave", () => {
        item.style.removeProperty("--tilt-x");
        item.style.removeProperty("--tilt-y");
        item.style.removeProperty("--spot-x");
        item.style.removeProperty("--spot-y");
      });
    });
  }

  function initHeroParallax() {
    if (prefersReducedMotion()) return;

    const heroes = document.querySelectorAll(".home-hero, .page-hero, .project-hero, .contact-hero, .bodega-hero");
    if (heroes.length === 0) return;

    let ticking = false;
    const update = () => {
      heroes.forEach((hero) => {
        const rect = hero.getBoundingClientRect();
        const progress = Math.min(1, Math.max(-1, rect.top / window.innerHeight));
        hero.style.setProperty("--hero-shift", `${progress * -22}px`);
      });
      ticking = false;
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
  }

  function initCounters() {
    const counters = document.querySelectorAll("[data-count]");
    if (counters.length === 0) return;

    const setValue = (counter, progress) => {
      const target = Number(counter.dataset.count || 0);
      const value = Math.round(target * progress);
      const prefix = counter.dataset.prefix || "";
      const suffix = counter.dataset.suffix || "";
      const grouping = counter.dataset.grouping !== "false";
      counter.textContent = `${prefix}${grouping ? value.toLocaleString("es-ES") : value}${suffix}`;
    };

    const animate = (counter) => {
      if (prefersReducedMotion()) {
        setValue(counter, 1);
        return;
      }

      const start = performance.now();
      const duration = 1400;
      const tick = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        setValue(counter, 1 - Math.pow(1 - progress, 3));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animate);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animate(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.45 }
    );

    counters.forEach((counter) => observer.observe(counter));
  }

  function initCatalog() {
    const root = document.querySelector("[data-catalog]");
    if (!root) return;

    const cards = Array.from(root.querySelectorAll("[data-catalog-card]"));
    const search = root.querySelector("[data-catalog-search]");
    const buttons = Array.from(root.querySelectorAll("[data-filter-key]"));
    const reset = root.querySelector("[data-catalog-reset]");
    const count = root.querySelector("[data-catalog-count]");
    const empty = root.querySelector("[data-catalog-empty]");
    const params = new URLSearchParams(location.search);

    const state = {
      estado: params.get("estado") || "",
      busqueda: params.get("busqueda") || ""
    };

    const syncUrl = () => {
      const next = new URL(location.href);
      Object.entries(state).forEach(([key, value]) => {
        if (value) next.searchParams.set(key, value);
        else next.searchParams.delete(key);
      });
      history.replaceState({}, "", `${next.pathname}${next.search}${next.hash}`);
    };

    const render = () => {
      if (search && search.value !== state.busqueda) search.value = state.busqueda;

      buttons.forEach((button) => {
        const key = button.dataset.filterKey;
        const value = button.dataset.filterValue || "";
        button.setAttribute("aria-pressed", String(state[key] === value));
      });

      const query = normalize(state.busqueda);
      let visible = 0;

      cards.forEach((card) => {
        const matchesStatus = !state.estado || card.dataset.estado === state.estado;
        const haystack = normalize(card.dataset.search);
        const matchesSearch = !query || haystack.includes(query);
        const show = matchesStatus && matchesSearch;
        card.hidden = !show;
        if (show) visible += 1;
      });

      if (count) count.textContent = `${visible} ${visible === 1 ? "ficha" : "fichas"}`;
      if (empty) empty.hidden = visible > 0;
    };

    search?.addEventListener("input", () => {
      state.busqueda = search.value.trim();
      syncUrl();
      render();
    });

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        state[button.dataset.filterKey] = button.dataset.filterValue || "";
        syncUrl();
        render();
      });
    });

    reset?.addEventListener("click", () => {
      state.estado = "";
      state.busqueda = "";
      syncUrl();
      render();
    });

    render();
  }

  function initHistoryIndex() {
    const nav = document.querySelector("[data-history-nav]");
    const sections = Array.from(document.querySelectorAll("[data-history-section]"));
    if (!nav || sections.length === 0) return;

    const links = Array.from(nav.querySelectorAll("a"));
    const setActive = (id) => {
      links.forEach((link) => {
        link.toggleAttribute("aria-current", link.hash === `#${id}`);
      });
    };

    const updateActiveSection = () => {
      const marker = window.innerHeight * 0.38;
      const activeSection =
        sections
          .filter((section) => section.getBoundingClientRect().top <= marker)
          .at(-1) || sections[0];

      setActive(activeSection.id);
    };

    let ticking = false;
    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        updateActiveSection();
        ticking = false;
      });
    };

    updateActiveSection();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
  }

  function initContactForm() {
    const form = document.querySelector("[data-contact-form]");
    const feedback = document.querySelector("[data-form-feedback]");
    if (!form || !feedback) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      feedback.hidden = false;
      feedback.textContent =
        "Mensaje preparado. En una version publicada se conectara este formulario al correo o a un servicio de envio.";
      form.reset();
    });
  }

  function initLightbox() {
    const lightbox = document.querySelector("[data-image-lightbox]");
    if (!lightbox) return;

    const image = lightbox.querySelector("[data-lightbox-image]");
    const caption = lightbox.querySelector("[data-lightbox-caption]");
    const closeButton = lightbox.querySelector("[data-lightbox-close]");
    let lastFocus = null;

    const close = () => {
      lightbox.hidden = true;
      document.body.classList.remove("lightbox-open");
      image.removeAttribute("src");
      image.alt = "";
      caption.textContent = "";
      lastFocus?.focus();
    };

    document.querySelectorAll("[data-lightbox-trigger]").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        lastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        image.src = trigger.dataset.lightboxSrc || "";
        image.alt = trigger.dataset.lightboxAlt || "";
        caption.textContent = trigger.dataset.lightboxCaption || "";
        lightbox.hidden = false;
        document.body.classList.add("lightbox-open");
        closeButton?.focus();
      });
    });

    closeButton?.addEventListener("click", close);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) close();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !lightbox.hidden) close();
    });
  }

  function initFicha() {
    document.querySelector("[data-print-ficha]")?.addEventListener("click", () => window.print());

    const gallery = document.querySelector("[data-gallery]");
    if (!gallery) return;

    document.querySelector("[data-gallery-prev]")?.addEventListener("click", () => {
      gallery.scrollBy({ left: -gallery.clientWidth, behavior: "smooth" });
    });
    document.querySelector("[data-gallery-next]")?.addEventListener("click", () => {
      gallery.scrollBy({ left: gallery.clientWidth, behavior: "smooth" });
    });
  }

  const collectCoordinatePairs = (coordinates, pairs = []) => {
    if (!Array.isArray(coordinates)) return pairs;
    if (typeof coordinates[0] === "number" && typeof coordinates[1] === "number") {
      pairs.push([coordinates[0], coordinates[1]]);
      return pairs;
    }
    coordinates.forEach((nested) => collectCoordinatePairs(nested, pairs));
    return pairs;
  };

  function initMap() {
    const root = document.querySelector("[data-bodega-map]");
    if (!root) return;

    const canvas = root.querySelector("[data-map-canvas]");
    const total = root.querySelector("[data-map-total]");
    const located = root.querySelector("[data-map-located]");
    const pending = root.querySelector("[data-map-pending]");
    const visibleList = root.querySelector("[data-map-visible-list]");
    const pendingList = root.querySelector("[data-map-pending-list]");
    const empty = root.querySelector("[data-map-empty]");
    const search = root.querySelector("[data-map-search]");
    const markerToggles = Array.from(root.querySelectorAll("[data-marker-toggle]"));
    const overlayToggles = Array.from(root.querySelectorAll("[data-overlay-toggle]"));
    const baseButtons = Array.from(root.querySelectorAll("[data-base-layer]"));
    const items = [...(window.BODEGAS || [])];
    const initialSlug = new URLSearchParams(location.search).get("bodega") || "";

    if (!window.L || !canvas) {
      canvas.innerHTML = '<p class="map-fallback">El mapa necesita conexion para cargar Leaflet. Las fichas siguen disponibles en el listado.</p>';
      return;
    }

    const hasCoords = (item) =>
      item.coordenadas &&
      Number.isFinite(item.coordenadas.lat) &&
      Number.isFinite(item.coordenadas.lng);

    const updateSummary = () => {
      const locatedCount = items.filter(hasCoords).length;
      if (total) total.textContent = String(items.length);
      if (located) located.textContent = String(locatedCount);
      if (pending) pending.textContent = String(items.length - locatedCount);
    };

    const map = L.map(canvas, {
      center: [37.3863, -6.5528],
      zoom: 16,
      minZoom: 13,
      maxZoom: 20,
      zoomControl: false
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    const baseLayers = {
      cartodb: L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: "&copy; OpenStreetMap &copy; CARTO",
        maxZoom: 20
      }),
      osm: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 19
      }),
      pnoa: L.tileLayer(
        "https://www.ign.es/wmts/pnoa-ma?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=OI.OrthoimageCoverage&STYLE=default&TILEMATRIXSET=GoogleMapsCompatible&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image/jpeg",
        {
          attribution: "&copy; Instituto Geografico Nacional",
          maxZoom: 19,
          tileSize: 256
        }
      )
    };

    let activeBase = baseLayers.cartodb.addTo(map);
    const activeLayer = L.layerGroup().addTo(map);
    const lostLayer = L.layerGroup().addTo(map);
    const markerRecords = new Map();
    const overlays = {
      bic: L.geoJSON(undefined, {
        style: { color: "#6b1a2b", fillColor: "#c9a84c", fillOpacity: 0.14, weight: 2 }
      }),
      rail: L.geoJSON(undefined, {
        style: { color: "#2f6f76", opacity: 0.86, weight: 3, dashArray: "7 6" }
      }),
      bodegas: L.geoJSON(undefined, {
        filter: (feature) => feature?.geometry?.type !== "Point",
        style: {
          color: "#4a4543",
          fillColor: "#9b9490",
          fillOpacity: 0.22,
          weight: 2
        }
      }).addTo(map)
    };

    const popupHtml = (item) => `
      <article class="map-popup">
        <img src="${escapeHtml(item.imagen)}" alt="Imagen de ${escapeHtml(item.nombre)}">
        <div>
          <h3>${escapeHtml(item.nombre)}</h3>
          <p><span class="popup-dot ${escapeHtml(item.estado)}"></span>${escapeHtml(formatStatus(item.estado))}</p>
          <a href="${escapeHtml(item.href)}">Ver ficha completa</a>
          ${item.qgisZip ? `<a href="${escapeHtml(item.qgisZip)}" download>Descargar QGIS</a>` : ""}
        </div>
      </article>`;

    const matchesFilters = (item) => {
      const allowed = new Set(markerToggles.filter((input) => input.checked).map((input) => input.value));
      const query = normalize(search?.value);
      const matchesStatus = allowed.has(item.estado);
      const matchesSearch = !query || normalize(`${item.nombre} ${item.ubicacion} ${item.resumen}`).includes(query);
      return matchesStatus && matchesSearch;
    };

    const renderMarkers = () => {
      activeLayer.clearLayers();
      lostLayer.clearLayers();
      markerRecords.clear();

      items.filter(hasCoords).forEach((item) => {
        const isActive = item.estado === "activa";
        const latLng = L.latLng(item.coordenadas.lat, item.coordenadas.lng);
        const marker = L.circleMarker(latLng, {
          radius: 9,
          color: isActive ? "#6b1a2b" : "#4a4543",
          fillColor: isActive ? "#c9a84c" : "#9b9490",
          fillOpacity: 0.92,
          opacity: 0.95,
          weight: 2
        }).bindPopup(popupHtml(item), { className: "bodega-popup", maxWidth: 260 });

        markerRecords.set(item.slug, { item, marker, latLng });
      });
    };

    const listButton = (item, distance, selected) => `
      <button class="map-list-item${selected === item.slug ? " is-selected" : ""}" type="button" data-focus-bodega="${escapeHtml(item.slug)}">
        <span class="item-status ${escapeHtml(item.estado)}" aria-hidden="true"></span>
        <span>
          <strong>${escapeHtml(item.nombre)}</strong>
          <small>${escapeHtml(item.ubicacion)}</small>
        </span>
        <em>${distance == null ? "sin coordenadas" : `${Math.max(0.01, distance / 1000).toFixed(2)} km`}</em>
      </button>`;

    let selectedSlug = initialSlug;

    const paint = () => {
      activeLayer.clearLayers();
      lostLayer.clearLayers();
      markerRecords.forEach(({ item, marker }) => {
        if (!matchesFilters(item)) return;
        if (item.estado === "activa") activeLayer.addLayer(marker);
        else lostLayer.addLayer(marker);
      });

      const bounds = map.getBounds();
      const center = map.getCenter();
      const visible = Array.from(markerRecords.values())
        .filter(({ item, latLng }) => matchesFilters(item) && bounds.contains(latLng))
        .map((record) => ({ ...record, distance: center.distanceTo(record.latLng) }))
        .sort((a, b) => a.distance - b.distance);

      const pendingItems = items
        .filter((item) => !hasCoords(item) && matchesFilters(item))
        .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

      if (visibleList) {
        visibleList.innerHTML = visible.map(({ item, distance }) => listButton(item, distance, selectedSlug)).join("");
      }
      if (pendingList) {
        pendingList.innerHTML = pendingItems.map((item) => listButton(item, null, selectedSlug)).join("");
      }
      if (empty) empty.hidden = visible.length > 0 || pendingItems.length > 0;
    };

    const focusBodega = (slug) => {
      selectedSlug = slug;
      const record = markerRecords.get(slug);
      if (record) {
        map.setView(record.latLng, Math.max(map.getZoom(), 18), { animate: true });
        record.marker.openPopup();
      }
      paint();
    };

    const fitMarkers = () => {
      const records = Array.from(markerRecords.values());
      if (records.length === 0) return;
      map.fitBounds(L.latLngBounds(records.map((record) => record.latLng)).pad(0.24), {
        maxZoom: 17,
        animate: false
      });
    };

    const loadGeoJson = async (url) => {
      try {
        const response = await fetch(url);
        if (!response.ok) return null;
        return response.json();
      } catch {
        return null;
      }
    };

    const mergeBodegaGeoJson = (geoJson) => {
      if (!geoJson?.features?.length) return;

      overlays.bodegas.addData(geoJson);
      const known = new Map(items.map((item) => [item.slug, item]));

      geoJson.features.forEach((feature) => {
        const props = feature.properties || {};
        const slug = props.slug || normalize(props.nombre).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        if (!slug) return;

        const pairs = collectCoordinatePairs(feature.geometry?.coordinates).filter(
          ([lng, lat]) => Math.abs(lng) <= 180 && Math.abs(lat) <= 90
        );
        if (pairs.length === 0) return;

        const bounds = L.latLngBounds(pairs.map(([lng, lat]) => L.latLng(lat, lng)));
        const center = bounds.getCenter();
        const existing = known.get(slug);

        if (existing) {
          existing.coordenadas = existing.coordenadas || { lat: center.lat, lng: center.lng };
          existing.ubicacion = props.ubicacion || existing.ubicacion;
          return;
        }

        const item = {
          slug,
          nombre: props.nombre || "Bodega sin nombre",
          estado: normalize(props.estado).includes("desap") ? "desaparecida" : "activa",
          ubicacion: props.ubicacion || "Ubicacion pendiente",
          resumen: props.resumen || "Ficha procedente de la capa QGIS.",
          imagen: "public/bodegas/placeholder-bodega.svg",
          href: `catalogo.html`,
          coordenadas: { lat: center.lat, lng: center.lng }
        };
        items.push(item);
        known.set(slug, item);
      });
    };

    baseButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const next = baseLayers[button.dataset.baseLayer];
        if (!next || next === activeBase) return;
        map.removeLayer(activeBase);
        activeBase = next.addTo(map);
        baseButtons.forEach((baseButton) => {
          baseButton.setAttribute("aria-pressed", String(baseButton === button));
        });
      });
    });

    markerToggles.forEach((input) => input.addEventListener("change", paint));
    search?.addEventListener("input", paint);
    map.on("moveend zoomend", paint);

    overlayToggles.forEach((input) => {
      input.addEventListener("change", () => {
        const layer = overlays[input.value];
        if (!layer) return;
        if (input.checked) layer.addTo(map);
        else map.removeLayer(layer);
      });
    });

    root.addEventListener("click", (event) => {
      const button = event.target.closest("[data-focus-bodega]");
      if (button?.dataset.focusBodega) focusBodega(button.dataset.focusBodega);
    });

    Promise.all([
      loadGeoJson("public/mapas/bodegas.geojson"),
      loadGeoJson("public/mapas/bic.geojson"),
      loadGeoJson("public/mapas/ferrocarril.geojson")
    ]).then(([bodegasGeoJson, bicGeoJson, railGeoJson]) => {
      mergeBodegaGeoJson(bodegasGeoJson);

      [
        ["bic", bicGeoJson],
        ["rail", railGeoJson]
      ].forEach(([key, geoJson]) => {
        const input = overlayToggles.find((toggle) => toggle.value === key);
        if (geoJson?.features?.length) overlays[key].addData(geoJson);
        else {
          input?.setAttribute("disabled", "disabled");
          input?.closest("label")?.classList.add("is-disabled");
        }
      });

      updateSummary();
      renderMarkers();
      paint();
      if (selectedSlug) focusBodega(selectedSlug);
      else fitMarkers();
      requestAnimationFrame(() => map.invalidateSize());
    });

    updateSummary();
    renderMarkers();
    paint();
    fitMarkers();
  }

  document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initReveal();
    initProfessionalMotion();
    initHeroParallax();
    initCounters();
    initCatalog();
    initHistoryIndex();
    initContactForm();
    initLightbox();
    initFicha();
    initMap();
  });
})();
