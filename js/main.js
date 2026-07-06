(function () {
  const normalize = (value) =>
    String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const statusLabels = {
    activa: "Activa",
    desaparecida: "Desaparecida",
    cartografica: "Registro cartográfico"
  };

  const documentationLabels = {
    catalogacion: "Ficha de catalogación",
    cartografica: "Capa QGIS"
  };

  const formatStatus = (status) => statusLabels[status] || "Sin clasificar";
  const formatDocumentation = (value) => documentationLabels[value] || "Documentación";

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
    const activeFile = currentFile.startsWith("bodegas-") || currentFile === "bodega.html" ? "catalogo.html" : currentFile;

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

    const grid = root.querySelector(".catalog-grid");
    const catalogItems = [...(window.BODEGAS || [])];

    const cardSearchText = (item) =>
      [
        item.nombre,
        item.ubicacion,
        item.resumen,
        item.lectura,
        item.catastro,
        item.anioConstruccion,
        item.fundacion,
        item.cierre,
        item.desaparicion,
        item.periodo,
        item.documentacion
      ]
        .filter(Boolean)
        .join(" ");

    if (grid && catalogItems.length > 0) {
      grid.innerHTML = catalogItems
        .map((item) => {
          const meta =
            item.documentacion === "cartografica"
              ? item.periodo || "Capa QGIS"
              : item.fundacion
                ? `Fundada en ${item.fundacion}`
                : item.anioConstruccion || "Ficha documental";
          const cardClass = [
            "bodega-card",
            item.estado === "desaparecida" ? "is-lost" : "",
            item.estado === "cartografica" ? "is-cartographic" : ""
          ]
            .filter(Boolean)
            .join(" ");

          return `
            <article
              class="${cardClass}"
              data-catalog-card
              data-estado="${escapeHtml(item.estado)}"
              data-documentacion="${escapeHtml(item.documentacion || "")}"
              data-search="${escapeHtml(cardSearchText(item))}"
              data-animate
            >
              <a class="card-media" href="${escapeHtml(item.href)}" aria-label="Abrir ficha de ${escapeHtml(item.nombre)}">
                <img src="${escapeHtml(item.imagen)}" alt="Imagen de ${escapeHtml(item.nombre)}" loading="lazy" />
              </a>
              <div class="card-body">
                <div class="card-meta">
                  <span class="status-pill ${escapeHtml(item.estado)}">${escapeHtml(formatStatus(item.estado))}</span>
                  <span>${escapeHtml(meta)}</span>
                </div>
                <span class="catalog-level ${escapeHtml(item.documentacion || "")}">${escapeHtml(formatDocumentation(item.documentacion))}</span>
                <h2>${escapeHtml(item.nombre)}</h2>
                <p class="card-location">${escapeHtml(item.ubicacion)}</p>
                <p>${escapeHtml(item.resumen)}</p>
                <a class="card-link" href="${escapeHtml(item.href)}">Ver ficha</a>
              </div>
            </article>`;
        })
        .join("");
    }

    let cards = Array.from(root.querySelectorAll("[data-catalog-card]"));
    const search = root.querySelector("[data-catalog-search]");
    const buttons = Array.from(root.querySelectorAll("[data-filter-key]"));
    const reset = root.querySelector("[data-catalog-reset]");
    const count = root.querySelector("[data-catalog-count]");
    const empty = root.querySelector("[data-catalog-empty]");
    const params = new URLSearchParams(location.search);

    const state = {
      estado: params.get("estado") || "",
      documentacion: params.get("documentacion") || "",
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
        const matchesDocumentation = !state.documentacion || card.dataset.documentacion === state.documentacion;
        const haystack = normalize(card.dataset.search);
        const matchesSearch = !query || haystack.includes(query);
        const show = matchesStatus && matchesDocumentation && matchesSearch;
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
      state.documentacion = "";
      state.busqueda = "";
      syncUrl();
      render();
    });

    cards = Array.from(root.querySelectorAll("[data-catalog-card]"));
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
    const slugParam = new URLSearchParams(location.search).get("slug") || "";
    const currentFile = decodeURIComponent(location.pathname.split("/").pop() || "index.html");
    const currentBodega = (window.BODEGAS || []).find((item) => item.href === currentFile || item.slug === slugParam);
    const fichaPdfUrl = currentBodega?.fichaPdf || "public/fichas/ficha-ejemplo-maquetacion.pdf";

    document.querySelector("[data-print-ficha]")?.addEventListener("click", () => {
      const pdfWindow = window.open(fichaPdfUrl, "_blank", "noopener");
      if (!pdfWindow) {
        window.location.href = fichaPdfUrl;
      }
    });

    const slideFromButton = (button) => {
      const image = button.querySelector("img");
      const figure = button.closest("figure");
      return {
        src: button.dataset.lightboxSrc || image?.getAttribute("src") || "",
        alt: button.dataset.lightboxAlt || image?.getAttribute("alt") || "",
        caption: button.dataset.lightboxCaption || figure?.querySelector("figcaption")?.textContent?.trim() || ""
      };
    };

    const uniqueSlides = (slides) => {
      const seen = new Set();
      return slides.filter((slide) => {
        if (!slide.src || seen.has(slide.src)) return false;
        seen.add(slide.src);
        return true;
      });
    };

    const dataSlides = uniqueSlides(
      (currentBodega?.imagenes || []).map((image) => ({
        src: image.src,
        alt: image.alt || `Imagen de ${currentBodega.nombre}`,
        caption: image.caption || image.alt || currentBodega.nombre
      }))
    );

    const gallerySlides = uniqueSlides(
      Array.from(document.querySelectorAll("[data-gallery] [data-lightbox-trigger]")).map(slideFromButton)
    );

    const slides = dataSlides.length > 0 ? dataSlides : gallerySlides;
    const heroMedia = document.querySelector(".bodega-hero .hero-media");
    const heroButton = heroMedia?.querySelector("[data-lightbox-trigger]");
    const heroImage = heroButton?.querySelector("img");
    const heroCaption = heroMedia?.querySelector("figcaption");

    if (heroMedia && heroButton && heroImage && heroCaption && slides.length > 1) {
      let activeIndex = Math.max(
        0,
        slides.findIndex((slide) => slide.src === heroImage.getAttribute("src"))
      );

      const controls = document.createElement("div");
      controls.className = "hero-carousel-controls";
      controls.innerHTML = `
        <button type="button" data-hero-carousel-prev aria-label="Imagen anterior">
          <span aria-hidden="true">&lsaquo;</span>
        </button>
        <span class="hero-carousel-count" data-hero-carousel-count aria-live="polite"></span>
        <button type="button" data-hero-carousel-next aria-label="Imagen siguiente">
          <span aria-hidden="true">&rsaquo;</span>
        </button>
      `;

      heroMedia.classList.add("has-carousel");
      heroMedia.append(controls);

      const count = controls.querySelector("[data-hero-carousel-count]");
      const updateHeroSlide = (nextIndex) => {
        activeIndex = (nextIndex + slides.length) % slides.length;
        const slide = slides[activeIndex];
        heroImage.src = slide.src;
        heroImage.alt = slide.alt;
        heroButton.dataset.lightboxSrc = slide.src;
        heroButton.dataset.lightboxAlt = slide.alt;
        heroButton.dataset.lightboxCaption = slide.caption;
        heroCaption.textContent = slide.caption;
        if (count) count.textContent = `${activeIndex + 1} / ${slides.length}`;
      };

      controls.querySelector("[data-hero-carousel-prev]")?.addEventListener("click", () => {
        updateHeroSlide(activeIndex - 1);
      });
      controls.querySelector("[data-hero-carousel-next]")?.addEventListener("click", () => {
        updateHeroSlide(activeIndex + 1);
      });
      heroMedia.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") updateHeroSlide(activeIndex - 1);
        if (event.key === "ArrowRight") updateHeroSlide(activeIndex + 1);
      });

      updateHeroSlide(activeIndex);
    }

    document.querySelectorAll("[data-gallery]").forEach((gallery) => {
      const scope = gallery.closest("section") || document;
      scope.querySelector("[data-gallery-prev]")?.addEventListener("click", () => {
        gallery.scrollBy({ left: -gallery.clientWidth, behavior: "smooth" });
      });
      scope.querySelector("[data-gallery-next]")?.addEventListener("click", () => {
        gallery.scrollBy({ left: gallery.clientWidth, behavior: "smooth" });
      });
    });
  }

  function initDynamicBodegaPage() {
    const root = document.querySelector("[data-dynamic-bodega]");
    if (!root) return;

    const slug = new URLSearchParams(location.search).get("slug") || "";
    const items = [...(window.BODEGAS || [])];
    const item = items.find((entry) => entry.slug === slug);

    if (!item) {
      root.innerHTML = `
        <section class="page-shell content-panel" data-animate>
          <p class="eyebrow">Catálogo</p>
          <h1 class="section-title">Ficha no encontrada</h1>
          <p>No se ha encontrado un registro para el identificador solicitado.</p>
          <a class="button-link primary" href="catalogo.html">Volver al catálogo</a>
        </section>`;
      return;
    }

    document.title = `${item.nombre} | Arquitectura y memoria perdida del vino`;

    const images = item.imagenes?.length
      ? item.imagenes
      : [{ src: item.imagen, alt: `Imagen de ${item.nombre}`, caption: item.nombre }];
    const heroImage = images[0];
    const itemIndex = items.findIndex((entry) => entry.slug === item.slug);
    const prev = itemIndex > 0 ? items[itemIndex - 1] : null;
    const next = itemIndex >= 0 && itemIndex < items.length - 1 ? items[itemIndex + 1] : null;
    const isCartographic = item.documentacion === "cartografica";

    const technicalRows = [
      ["Estado", formatStatus(item.estado)],
      ["Documentación", formatDocumentation(item.documentacion)],
      ["Ubicación", item.ubicacion],
      ["Periodo", item.periodo],
      ["Referencia catastral", item.catastro],
      ["Coordenadas", item.coordenadas ? `${item.coordenadas.lat}, ${item.coordenadas.lng}` : ""],
      ["Fundación", item.fundacion],
      ["Año de construcción", item.anioConstruccion],
      ["Cierre", item.cierre],
      ["Desaparición", item.desaparicion],
      ["Uso posterior", item.usoPosterior],
      ["Bodegas anteriores", item.bodegasAnteriores],
      ["Bodegas posteriores", item.bodegasPosteriores],
      ["Ubicación anterior", item.ubicacionAnterior],
      ["Propuesta", item.propuesta]
    ]
      .filter(([, value]) => value)
      .map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`)
      .join("");

    const gallery = images
      .map(
        (imageItem) => `
          <figure>
            <button type="button" data-lightbox-trigger data-lightbox-src="${escapeHtml(imageItem.src)}" data-lightbox-alt="${escapeHtml(imageItem.alt || item.nombre)}" data-lightbox-caption="${escapeHtml(imageItem.caption || imageItem.alt || item.nombre)}">
              <img src="${escapeHtml(imageItem.src)}" alt="${escapeHtml(imageItem.alt || item.nombre)}" loading="lazy" />
            </button>
            <figcaption>${escapeHtml(imageItem.caption || imageItem.alt || item.nombre)}</figcaption>
          </figure>`
      )
      .join("");

    const timeline = item.cronologia?.length
      ? `
        <section class="ficha-timeline" aria-labelledby="timeline-title" data-animate>
          <div class="section-kicker">
            <p class="eyebrow">Etapas</p>
            <h2 id="timeline-title">Cronología de la bodega</h2>
          </div>
          <ol>
            ${item.cronologia
              .map(
                ([date, title, text]) =>
                  `<li><time>${escapeHtml(date)}</time><div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></div></li>`
              )
              .join("")}
          </ol>
        </section>`
      : "";

    const sources = (item.fuentes || [])
      .map((source) => `<li>${escapeHtml(source)}</li>`)
      .join("");

    const qgisButton = item.qgisZip
      ? `<a class="button-link ghost" href="${escapeHtml(item.qgisZip)}" download>Descargar QGIS</a>`
      : "";
    const pdfButton = item.fichaPdf
      ? `<button class="button-link ghost" type="button" data-print-ficha>Descargar ficha PDF</button>`
      : "";

    root.innerHTML = `
      <article class="ficha-completa">
        <section class="bodega-hero">
          <div class="page-shell hero-grid">
            <div class="hero-copy" data-animate>
              <a class="back-link" href="catalogo.html">Volver al catálogo</a>
              <p class="eyebrow">${escapeHtml(formatDocumentation(item.documentacion))}</p>
              <h1>${escapeHtml(item.nombre)}</h1>
              <p class="lead">${escapeHtml(item.resumen)}</p>
              <div class="status-row">
                <span class="status-pill ${escapeHtml(item.estado)}">${escapeHtml(formatStatus(item.estado))}</span>
                <span>${escapeHtml(item.ubicacion)}</span>
              </div>
              <div class="hero-actions">
                <a class="button-link primary" href="mapa.html?bodega=${escapeHtml(item.slug)}">Ver en el mapa</a>
                ${qgisButton}
                ${pdfButton}
              </div>
            </div>

            <figure class="hero-media" data-animate>
              <button
                type="button"
                data-lightbox-trigger
                data-lightbox-src="${escapeHtml(heroImage.src)}"
                data-lightbox-alt="${escapeHtml(heroImage.alt || item.nombre)}"
                data-lightbox-caption="${escapeHtml(heroImage.caption || heroImage.alt || item.nombre)}"
              >
                <img src="${escapeHtml(heroImage.src)}" alt="${escapeHtml(heroImage.alt || item.nombre)}" />
              </button>
              <figcaption>${escapeHtml(heroImage.caption || heroImage.alt || item.nombre)}</figcaption>
            </figure>
          </div>
        </section>

        <section class="page-shell ficha-grid" aria-label="Ficha técnica de ${escapeHtml(item.nombre)}">
          <aside class="technical-panel" data-animate>
            <h2>Datos técnicos</h2>
            <dl>${technicalRows}</dl>

            <div class="mini-map" aria-label="Estado de datos cartográficos">
              <span>Mapa</span>
              <p>${escapeHtml(isCartographic ? "Geometría incorporada desde capa QGIS como registro cartográfico." : "Polígono QGIS enlazado a la ficha de catalogación.")}</p>
              <a href="mapa.html?bodega=${escapeHtml(item.slug)}">Abrir localización</a>
            </div>

            ${
              item.qgisZip
                ? `<section class="qgis-download" aria-labelledby="qgis-${escapeHtml(item.slug)}">
                    <span>QGIS</span>
                    <h3 id="qgis-${escapeHtml(item.slug)}">Archivos cartográficos</h3>
                    <p>Paquete ZIP con la capa original de la bodega y sus archivos auxiliares.</p>
                    <a href="${escapeHtml(item.qgisZip)}" download>Descargar ZIP QGIS</a>
                  </section>`
                : ""
            }
          </aside>

          <div class="ficha-main">
            <section class="visual-section" aria-labelledby="gallery-title" data-animate>
              <div class="section-kicker">
                <p class="eyebrow">Archivo visual</p>
                <h2 id="gallery-title">Galería documental</h2>
              </div>
              <div class="gallery-track" data-gallery>
                <div class="gallery-row">${gallery}</div>
              </div>
            </section>

            <section class="content-panel" aria-labelledby="lectura-patrimonial" data-animate>
              <p class="eyebrow">${escapeHtml(isCartographic ? "Lectura cartográfica" : "Historia documentada")}</p>
              <h2 id="lectura-patrimonial">${escapeHtml(isCartographic ? "Registro de inventario" : "Lectura patrimonial")}</h2>
              <p>${escapeHtml(item.lectura || item.resumen)}</p>
              ${item.pendiente ? `<p>${escapeHtml(item.pendiente)}</p>` : ""}
            </section>

            ${timeline}

            <section class="environment-section" aria-labelledby="environment-title" data-animate>
              <div class="section-kicker">
                <p class="eyebrow">Cartografía</p>
                <h2 id="environment-title">Capas asociadas</h2>
              </div>
              <p>${escapeHtml((item.capas || []).join("; ") || "Sin capas asociadas.")}</p>
            </section>

            <section class="bodega-sources" aria-label="Fuentes bibliográficas" data-animate>
              <h2>Fuentes</h2>
              <ul>${sources}</ul>
            </section>
          </div>
        </section>

        <nav class="page-shell ficha-nav" aria-label="Navegación entre fichas">
          ${prev ? `<a href="${escapeHtml(prev.href)}"><span>Anterior</span>${escapeHtml(prev.nombre)}</a>` : "<span></span>"}
          ${next ? `<a href="${escapeHtml(next.href)}"><span>Siguiente</span>${escapeHtml(next.nombre)}</a>` : "<span></span>"}
        </nav>
      </article>`;
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

  const featureSlug = (feature) => {
    const props = feature?.properties || {};
    return props.slug || normalize(props.nombre).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  };

  const isValidLngLat = (pair) =>
    Array.isArray(pair) &&
    Number.isFinite(pair[0]) &&
    Number.isFinite(pair[1]) &&
    Math.abs(pair[0]) <= 180 &&
    Math.abs(pair[1]) <= 90;

  const outerRings = (geometry) => {
    if (geometry?.type === "Polygon") return [geometry.coordinates?.[0]].filter(Array.isArray);
    if (geometry?.type === "MultiPolygon") {
      return (geometry.coordinates || []).map((polygon) => polygon?.[0]).filter(Array.isArray);
    }
    return [];
  };

  const ringArea = (ring) => {
    const points = ring.filter(isValidLngLat);
    if (points.length < 3) return 0;

    let area = 0;
    points.forEach(([lng, lat], index) => {
      const [nextLng, nextLat] = points[(index + 1) % points.length];
      area += lng * nextLat - nextLng * lat;
    });
    return Math.abs(area) / 2;
  };

  const boundsCenter = (pairs) => {
    const validPairs = pairs.filter(isValidLngLat);
    if (validPairs.length === 0 || !window.L) return null;

    const bounds = L.latLngBounds(validPairs.map(([lng, lat]) => L.latLng(lat, lng)));
    return bounds.isValid() ? bounds.getCenter() : null;
  };

  const ringCentroid = (ring) => {
    const points = ring.filter(isValidLngLat);
    if (points.length < 3 || !window.L) return boundsCenter(points);

    let areaTwice = 0;
    let centroidLng = 0;
    let centroidLat = 0;

    points.forEach(([lng, lat], index) => {
      const [nextLng, nextLat] = points[(index + 1) % points.length];
      const cross = lng * nextLat - nextLng * lat;
      areaTwice += cross;
      centroidLng += (lng + nextLng) * cross;
      centroidLat += (lat + nextLat) * cross;
    });

    if (Math.abs(areaTwice) < 1e-12) return boundsCenter(points);

    const factor = 1 / (3 * areaTwice);
    const lng = centroidLng * factor;
    const lat = centroidLat * factor;
    return Number.isFinite(lat) && Number.isFinite(lng) ? L.latLng(lat, lng) : boundsCenter(points);
  };

  const representativeLatLng = (geometry) => {
    const rings = outerRings(geometry)
      .map((ring) => ({ ring, area: ringArea(ring) }))
      .filter(({ area }) => area > 0)
      .sort((a, b) => b.area - a.area);

    if (rings.length > 0) return ringCentroid(rings[0].ring);
    return boundsCenter(collectCoordinatePairs(geometry?.coordinates));
  };

  function initMap() {
    const roots = Array.from(document.querySelectorAll("[data-bodega-map], [data-bodega-map-preview]"));
    if (roots.length === 0) return;

    roots.forEach(initBodegaMap);
  }

  function initBodegaMap(root) {
    const isPreview = root.hasAttribute("data-bodega-map-preview");
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
      if (canvas) {
        canvas.innerHTML = '<p class="map-fallback">El mapa necesita conexion para cargar Leaflet. Las fichas siguen disponibles en el listado.</p>';
      }
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
      zoomControl: false,
      attributionControl: !isPreview,
      dragging: !isPreview,
      scrollWheelZoom: !isPreview,
      doubleClickZoom: !isPreview,
      boxZoom: !isPreview,
      keyboard: !isPreview,
      touchZoom: !isPreview
    });

    if (!isPreview) L.control.zoom({ position: "bottomright" }).addTo(map);

    const baseLayers = {
      cartodb: L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
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

    let activeBase = baseLayers.osm.addTo(map);
    const activeLayer = L.layerGroup().addTo(map);
    const lostLayer = L.layerGroup().addTo(map);
    const cartographicLayer = L.layerGroup().addTo(map);
    const markerRecords = new Map();
    const areaRecords = new Map();

    const itemBySlug = (slug) => items.find((item) => item.slug === slug);

    const statusFor = (source) => {
      const raw = source?.estado || source?.properties?.estado || "";
      if (normalize(raw).includes("cartograf")) return "cartografica";
      return normalize(raw).includes("activa") ? "activa" : "desaparecida";
    };

    const slugPalettes = {
      "bodegas-rubio": { stroke: "#1f5b43", fill: "#5f9d73", markerFill: "#2f5648" },
      "bodegas-verdier": { stroke: "#6b1a2b", fill: "#a93c50", markerFill: "#6b1a2b" },
      "bodegas-morales": { stroke: "#2f5648", fill: "#5f9d73", markerFill: "#2f5648" },
      "bodegas-pichardo": { stroke: "#71550d", fill: "#c9a84c", markerFill: "#71550d" },
      "bodegas-espinosa": { stroke: "#2f6f76", fill: "#67aab0", markerFill: "#2f6f76" },
      "bodegas-salas": { stroke: "#5a3d6f", fill: "#9a7cb6", markerFill: "#5a3d6f" }
    };

    const mapPalette = (source) => {
      const status = statusFor(source);
      const fallback =
        status === "activa"
          ? { stroke: "#1f5b43", fill: "#5f9d73", markerFill: "#2f5648" }
          : status === "cartografica"
            ? { stroke: "#2f6f76", fill: "#67aab0", markerFill: "#2f6f76" }
            : { stroke: "#6b1a2b", fill: "#a93c50", markerFill: "#6b1a2b" };

      return {
        ...fallback,
        ...(slugPalettes[source?.slug] || {}),
        markerStroke: status === "activa" ? "#efd47a" : "#fffdf8"
      };
    };

    const areaStyle = (source, selected = false) => {
      const palette = mapPalette(source);
      return {
        color: palette.stroke,
        fillColor: palette.fill,
        dashArray: selected ? "10 7" : null,
        fillOpacity: selected ? 0.52 : 0.28,
        lineCap: "round",
        lineJoin: "round",
        opacity: selected ? 1 : 0.92,
        weight: selected ? 4.4 : 2.35
      };
    };

    const markerStyle = (item, selected = false) => {
      const palette = mapPalette(item);
      return {
        radius: selected ? 8 : 6.5,
        color: palette.markerStroke,
        fillColor: palette.markerFill,
        fillOpacity: 0.98,
        opacity: 1,
        weight: selected ? 3 : 2.4
      };
    };

    const hiddenAreaStyle = {
      opacity: 0,
      fillOpacity: 0,
      weight: 0
    };

    const overlays = {
      bic: L.geoJSON(undefined, {
        style: { color: "#6b1a2b", fillColor: "#c9a84c", fillOpacity: 0.14, weight: 2 }
      }),
      rail: L.geoJSON(undefined, {
        style: { color: "#2f6f76", opacity: 0.86, weight: 3, dashArray: "7 6" }
      }),
      bodegas: L.geoJSON(undefined, {
        filter: (feature) => feature?.geometry?.type !== "Point",
        style: (feature) => areaStyle(feature?.properties),
        onEachFeature: (feature, layer) => {
          const slug = featureSlug(feature);
          if (!slug) return;

          const record = areaRecords.get(slug) || { item: null, layers: [] };
          record.item = itemBySlug(slug) || record.item;
          record.layers.push(layer);
          areaRecords.set(slug, record);

          layer.on("click", () => focusBodega(slug));
        }
      }).addTo(map)
    };

    const popupHtml = (item) => {
      const palette = mapPalette(item);
      return `
        <article class="map-popup">
          <img src="${escapeHtml(item.imagen)}" alt="Imagen de ${escapeHtml(item.nombre)}">
          <div>
            <h3>${escapeHtml(item.nombre)}</h3>
            <p><span class="popup-dot ${escapeHtml(item.estado)}" style="background: ${palette.markerFill}"></span>${escapeHtml(formatStatus(item.estado))}</p>
            <a href="${escapeHtml(item.href)}">Ver ficha completa</a>
            ${item.qgisZip ? `<a href="${escapeHtml(item.qgisZip)}" download>Descargar QGIS</a>` : ""}
          </div>
        </article>`;
    };

    const matchesFilters = (item) => {
      const allowed = new Set(
        markerToggles.length
          ? markerToggles.filter((input) => input.checked).map((input) => input.value)
          : ["activa", "desaparecida", "cartografica"]
      );
      const query = normalize(search?.value);
      const matchesStatus = allowed.has(item.estado);
      const matchesSearch = !query || normalize(`${item.nombre} ${item.ubicacion} ${item.resumen}`).includes(query);
      return matchesStatus && matchesSearch;
    };

    const renderMarkers = () => {
      activeLayer.clearLayers();
      lostLayer.clearLayers();
      cartographicLayer.clearLayers();
      markerRecords.clear();

      items.filter(hasCoords).forEach((item) => {
        const latLng = L.latLng(item.coordenadas.lat, item.coordenadas.lng);
        const marker = L.circleMarker(latLng, markerStyle(item)).bindPopup(popupHtml(item), {
          className: "bodega-popup",
          maxWidth: 260
        });

        markerRecords.set(item.slug, { item, marker, latLng });
      });
    };

    const listButton = (item, distance, selected) => {
      const palette = mapPalette(item);
      return `
        <button class="map-list-item${selected === item.slug ? " is-selected" : ""}" type="button" data-focus-bodega="${escapeHtml(item.slug)}">
          <span class="item-status ${escapeHtml(item.estado)}" style="background: ${palette.markerFill}" aria-hidden="true"></span>
          <span>
            <strong>${escapeHtml(item.nombre)}</strong>
            <small>${escapeHtml(item.ubicacion)}</small>
          </span>
          <em>${distance == null ? "sin coordenadas" : `${Math.max(0.01, distance / 1000).toFixed(2)} km`}</em>
        </button>`;
    };

    let selectedSlug = initialSlug;

    const paint = () => {
      areaRecords.forEach(({ item, layers }, slug) => {
        const visible = item && matchesFilters(item);
        const selected = selectedSlug === slug;
        layers.forEach((layer) => {
          layer.setStyle(visible ? areaStyle(item, selected) : hiddenAreaStyle);
          if (visible && selected) layer.bringToFront();
          const element = layer.getElement?.();
          if (element) {
            element.style.pointerEvents = visible ? "auto" : "none";
            element.classList.toggle("bodega-area-selected", Boolean(visible && selected));
          }
        });
      });

      activeLayer.clearLayers();
      lostLayer.clearLayers();
      cartographicLayer.clearLayers();
      markerRecords.forEach(({ item, marker }) => {
        if (!matchesFilters(item)) return;
        marker.setStyle(markerStyle(item, selectedSlug === item.slug));
        if (item.estado === "activa") activeLayer.addLayer(marker);
        else if (item.estado === "cartografica") cartographicLayer.addLayer(marker);
        else lostLayer.addLayer(marker);
        marker.bringToFront();
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
      paint();
      if (record) {
        map.setView(record.latLng, Math.max(map.getZoom(), 18), { animate: true });
        record.marker.openPopup();
      }
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

      const known = new Map(items.map((item) => [item.slug, item]));

      geoJson.features.forEach((feature) => {
        const props = feature.properties || {};
        const slug = featureSlug(feature);
        if (!slug) return;

        const center = representativeLatLng(feature.geometry);
        if (!center) return;

        const existing = known.get(slug);

        if (existing) {
          existing.coordenadas = { lat: center.lat, lng: center.lng };
          existing.ubicacion = props.ubicacion || existing.ubicacion;
          existing.qgisZip = props.qgisZip || existing.qgisZip;
          return;
        }

        const item = {
          slug,
          nombre: props.nombre || "Bodega sin nombre",
          estado: normalize(props.estado).includes("cartograf")
            ? "cartografica"
            : normalize(props.estado).includes("desap")
              ? "desaparecida"
              : "activa",
          ubicacion: props.ubicacion || "Ubicacion pendiente",
          resumen: props.resumen || "Ficha procedente de la capa QGIS.",
          imagen: "public/historia/portada-bodegas.jpg",
          href: `catalogo.html`,
          coordenadas: { lat: center.lat, lng: center.lng }
        };
        items.push(item);
        known.set(slug, item);
      });

      areaRecords.clear();
      overlays.bodegas.clearLayers();
      overlays.bodegas.addData(geoJson);
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
    initCatalog();
    initDynamicBodegaPage();
    initReveal();
    initProfessionalMotion();
    initHeroParallax();
    initCounters();
    initHistoryIndex();
    initContactForm();
    initLightbox();
    initFicha();
    initMap();
  });
})();
