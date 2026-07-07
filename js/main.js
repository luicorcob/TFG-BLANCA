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
    cartografica: "Solo QGIS"
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

  const LEAFLET_CSS_URL = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  const LEAFLET_JS_URL = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
  let leafletLoader = null;

  const ensureLeafletAssets = () => {
    if (window.L) return Promise.resolve(window.L);

    if (!document.querySelector(`link[href="${LEAFLET_CSS_URL}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = LEAFLET_CSS_URL;
      link.crossOrigin = "";
      document.head.append(link);
    }

    if (leafletLoader) return leafletLoader;

    leafletLoader = new Promise((resolve, reject) => {
      const existingScript = document.querySelector(`script[src="${LEAFLET_JS_URL}"]`);
      const script = existingScript || document.createElement("script");
      const timeout = window.setTimeout(() => reject(new Error("Leaflet load timeout")), 8000);
      const finish = () => {
        window.clearTimeout(timeout);
        return window.L ? resolve(window.L) : reject(new Error("Leaflet unavailable"));
      };

      script.addEventListener("load", finish, { once: true });
      script.addEventListener(
        "error",
        () => {
          window.clearTimeout(timeout);
          reject(new Error("Leaflet failed to load"));
        },
        { once: true }
      );

      if (!existingScript) {
        script.src = LEAFLET_JS_URL;
        script.crossOrigin = "";
        script.async = true;
        document.head.append(script);
      }
    });

    return leafletLoader;
  };

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
        item.documentacion,
        item.estado,
        (item.capas || []).join(" ")
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
            item.documentacion === "cartografica" ? "is-cartographic" : ""
          ]
            .filter(Boolean)
            .join(" ");

          return `
            <article
              class="${cardClass}"
              data-catalog-card
              data-estado="${escapeHtml(item.estado)}"
              data-documentacion="${escapeHtml(item.documentacion || "")}"
              data-periodo="${escapeHtml(item.periodo || "")}"
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
      periodo: params.get("periodo") || "",
      busqueda: params.get("busqueda") || ""
    };

    if (state.estado === "cartografica") {
      state.estado = "";
      state.documentacion = state.documentacion || "cartografica";
    }

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
      const selectedPeriod = normalize(state.periodo);
      let visible = 0;
      let visibleCatalogation = 0;
      let visibleCartographic = 0;

      cards.forEach((card) => {
        const matchesStatus = !state.estado || card.dataset.estado === state.estado;
        const matchesDocumentation = !state.documentacion || card.dataset.documentacion === state.documentacion;
        const matchesPeriod = !selectedPeriod || normalize(card.dataset.periodo).includes(selectedPeriod);
        const haystack = normalize(card.dataset.search);
        const matchesSearch = !query || haystack.includes(query);
        const show = matchesStatus && matchesDocumentation && matchesPeriod && matchesSearch;
        card.hidden = !show;
        if (show) {
          visible += 1;
          if (card.dataset.documentacion === "catalogacion") visibleCatalogation += 1;
          if (card.dataset.documentacion === "cartografica") visibleCartographic += 1;
        }
      });

      if (count) {
        count.textContent = `${visible} ${visible === 1 ? "registro" : "registros"} · ${visibleCatalogation} fichas de catalogación · ${visibleCartographic} capas QGIS`;
      }
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
      state.periodo = "";
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

  function initContextCarousels() {
    document.querySelectorAll("[data-context-carousel]").forEach((carousel) => {
      const image = carousel.querySelector("[data-carousel-image]");
      const caption = carousel.querySelector("[data-carousel-caption]");
      const count = carousel.querySelector("[data-carousel-count]");
      const stage = carousel.querySelector("[data-carousel-stage]");
      const slides = Array.from(carousel.querySelectorAll("[data-carousel-slide]"))
        .map((slide) => ({
          src: slide.dataset.src || "",
          alt: slide.dataset.alt || "",
          kicker: slide.dataset.kicker || "",
          caption: slide.dataset.caption || ""
        }))
        .filter((slide) => slide.src);

      if (!image || slides.length === 0) return;

      let activeIndex = Math.max(
        0,
        slides.findIndex((slide) => slide.src === image.getAttribute("src"))
      );

      const updateSlide = (nextIndex) => {
        activeIndex = (nextIndex + slides.length) % slides.length;
        const slide = slides[activeIndex];
        image.src = slide.src;
        image.alt = slide.alt;
        if (caption) {
          caption.innerHTML = `${slide.kicker ? `<span>${escapeHtml(slide.kicker)}</span>` : ""}${escapeHtml(slide.caption)}`;
        }
        if (count) count.textContent = `${activeIndex + 1} / ${slides.length}`;
      };

      const previous = () => updateSlide(activeIndex - 1);
      const next = () => updateSlide(activeIndex + 1);

      carousel.querySelector("[data-carousel-prev]")?.addEventListener("click", previous);
      carousel.querySelector("[data-carousel-next]")?.addEventListener("click", next);
      stage?.addEventListener("click", next);
      stage?.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") previous();
        if (event.key === "ArrowRight") next();
      });

      updateSlide(activeIndex);
    });
  }

  function initContactForm() {
    const form = document.querySelector("[data-contact-form]");
    const feedback = document.querySelector("[data-form-feedback]");
    if (!form || !feedback) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const formData = new FormData(form);
      const nombre = String(formData.get("nombre") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const motivoSelect = form.elements.motivo;
      const motivo =
        motivoSelect instanceof HTMLSelectElement
          ? motivoSelect.selectedOptions[0]?.textContent.trim() || ""
          : String(formData.get("motivo") || "").trim();
      const mensaje = String(formData.get("mensaje") || "").trim();
      const subject = `${form.dataset.contactSubject || "Consulta desde la web"} - ${nombre}`;
      const body = [
        `Nombre: ${nombre}`,
        `Email de contacto: ${email}`,
        `Motivo: ${motivo}`,
        "",
        "Mensaje:",
        mensaje,
        "",
        "---",
        "Mensaje generado desde el formulario de contacto de Arquitectura y memoria perdida del vino."
      ].join("\n");
      const recipient = (form.dataset.contactRecipient || "").trim();
      const gmailUrl =
        "https://mail.google.com/mail/?view=cm&fs=1" +
        `&to=${encodeURIComponent(recipient)}` +
        `&su=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;

      feedback.hidden = false;
      feedback.textContent =
        "Se esta abriendo Gmail con el mensaje preparado. Revisa el contenido y pulsa enviar desde tu cuenta.";
      window.location.href = gmailUrl;
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
    const fichaPdfUrl = currentBodega?.fichaPdf || "docs/fuentes/TFG%20MAQUETACION%20PARA%20WEB.pdf";

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
    const layerList = item.capas?.length
      ? `<ul class="layer-list">${item.capas.map((layer) => `<li>${escapeHtml(layer)}</li>`).join("")}</ul>`
      : `<p>Sin capas asociadas.</p>`;

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

            <div class="mini-map" data-bodega-map-preview data-preview-slug="${escapeHtml(item.slug)}" aria-label="Vista previa cartográfica de ${escapeHtml(item.nombre)}">
              <div class="mini-map-frame">
                <div class="map-canvas" data-map-canvas role="region" aria-label="Mini mapa de ${escapeHtml(item.nombre)}"></div>
                <a class="map-preview-hitbox" href="mapa.html?bodega=${escapeHtml(item.slug)}" aria-label="Abrir localización de ${escapeHtml(item.nombre)} en el mapa completo"></a>
                <div class="map-credit"><span>Leaflet</span><span>Vista previa</span></div>
              </div>
              <span>Mapa</span>
              <p>${escapeHtml(isCartographic ? "Vista previa de la geometría QGIS incorporada al inventario." : "Vista previa del polígono QGIS en el mapa interactivo.")}</p>
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
              ${layerList}
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

    if (!window.L) {
      roots.forEach((root) => {
        const canvas = root.querySelector("[data-map-canvas]");
        if (canvas) canvas.innerHTML = '<p class="map-fallback">Cargando vista cartográfica...</p>';
      });

      ensureLeafletAssets()
        .then(() => roots.forEach(initBodegaMap))
        .catch(() => {
          roots.forEach((root) => {
            const canvas = root.querySelector("[data-map-canvas]");
            if (canvas) {
              canvas.innerHTML = '<p class="map-fallback">No se ha podido cargar el mapa. Puedes abrir la localización desde el enlace.</p>';
            }
          });
        });
      return;
    }

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
    const filterButtons = Array.from(root.querySelectorAll("[data-map-filter-key]"));
    const reset = root.querySelector("[data-map-reset]");
    const baseButtons = Array.from(root.querySelectorAll("[data-base-layer]"));
    const items = [...(window.BODEGAS || [])];
    const params = new URLSearchParams(location.search);
    const initialSlug = params.get("bodega") || root.dataset.previewSlug || root.dataset.bodegaSlug || "";
    const state = {
      estado: params.get("estado") || "",
      documentacion: params.get("documentacion") || "",
      periodo: params.get("periodo") || "",
      busqueda: params.get("busqueda") || ""
    };

    if (state.estado === "cartografica") {
      state.estado = "";
      state.documentacion = state.documentacion || "cartografica";
    }

    if (!window.L || !canvas) {
      if (canvas) {
        canvas.innerHTML = '<p class="map-fallback">El mapa necesita conexion para cargar Leaflet. Las fichas siguen disponibles en el listado.</p>';
      }
      return;
    }

    if (root.dataset.mapReady === "true") return;
    root.dataset.mapReady = "true";

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

    const mapPalettes = {
      activa: { stroke: "#1f5b43", fill: "#5f9d73", markerFill: "#2f5648" },
      desaparecida: { stroke: "#6b1a2b", fill: "#a93c50", markerFill: "#6b1a2b" },
      cartografica: { stroke: "#2f6f76", fill: "#67aab0", markerFill: "#2f6f76" }
    };

    const mapCategoryFor = (source) => {
      const status = statusFor(source);
      const documentation = source?.documentacion || source?.properties?.documentacion || "";
      if (status === "cartografica" || normalize(documentation).includes("cartograf")) return "cartografica";
      return status === "activa" ? "activa" : "desaparecida";
    };

    const mapPalette = (source) => {
      const category = mapCategoryFor(source);
      const palette = mapPalettes[category] || mapPalettes.desaparecida;

      return {
        ...palette,
        category,
        markerStroke: category === "activa" ? "#efd47a" : "#fffdf8"
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
      const meta = [formatStatus(item.estado), item.documentacion ? formatDocumentation(item.documentacion) : ""]
        .filter(Boolean)
        .join(" · ");
      return `
        <article class="map-popup">
          <img src="${escapeHtml(item.imagen)}" alt="Imagen de ${escapeHtml(item.nombre)}">
          <div>
            <h3>${escapeHtml(item.nombre)}</h3>
            <p><span class="popup-dot ${escapeHtml(palette.category)}" style="background: ${palette.markerFill}"></span>${escapeHtml(meta)}</p>
            <a href="${escapeHtml(item.href)}">Ver ficha completa</a>
            ${item.qgisZip ? `<a href="${escapeHtml(item.qgisZip)}" download>Descargar QGIS</a>` : ""}
          </div>
        </article>`;
    };

    const syncUrl = () => {
      const next = new URL(location.href);
      Object.entries(state).forEach(([key, value]) => {
        if (value) next.searchParams.set(key, value);
        else next.searchParams.delete(key);
      });
      history.replaceState({}, "", `${next.pathname}${next.search}${next.hash}`);
    };

    const syncFilterControls = () => {
      if (search && search.value !== state.busqueda) search.value = state.busqueda;

      filterButtons.forEach((button) => {
        const key = button.dataset.mapFilterKey;
        const value = button.dataset.mapFilterValue || "";
        button.setAttribute("aria-pressed", String(state[key] === value));
      });
    };

    const matchesFilters = (item) => {
      const query = normalize(state.busqueda);
      const selectedPeriod = normalize(state.periodo);
      const matchesStatus = !state.estado || item.estado === state.estado;
      const matchesDocumentation = !state.documentacion || (item.documentacion || "catalogacion") === state.documentacion;
      const matchesPeriod = !selectedPeriod || normalize(item.periodo).includes(selectedPeriod);
      const searchable = [item.nombre, item.ubicacion, item.resumen, item.periodo, item.documentacion, ...(item.capas || [])].join(" ");
      const matchesSearch = !query || normalize(searchable).includes(query);
      return matchesStatus && matchesDocumentation && matchesPeriod && matchesSearch;
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

        marker.on("click", () => focusBodega(item.slug));
        markerRecords.set(item.slug, { item, marker, latLng });
      });
    };

    const listButton = (item, distance, selected) => {
      const palette = mapPalette(item);
      return `
        <button class="map-list-item${selected === item.slug ? " is-selected" : ""}" type="button" data-focus-bodega="${escapeHtml(item.slug)}">
          <span class="item-status ${escapeHtml(palette.category)}" style="background: ${palette.markerFill}" aria-hidden="true"></span>
          <span>
            <strong>${escapeHtml(item.nombre)}</strong>
            <small>${escapeHtml(item.ubicacion)}</small>
          </span>
          <em>${distance == null ? "sin coordenadas" : `${Math.max(0.01, distance / 1000).toFixed(2)} km`}</em>
        </button>`;
    };

    let selectedSlug = initialSlug;

    const isCompactMap = () => window.matchMedia("(max-width: 640px)").matches || canvas.clientWidth < 560;

    const selectedZoom = () => {
      if (!isCompactMap()) return Math.max(map.getZoom(), 18);
      return Math.min(Math.max(map.getZoom(), 16), 17);
    };

    const selectedCenter = (latLng, zoom) => {
      if (!isCompactMap()) return latLng;
      const verticalOffset = Math.min(96, Math.max(56, canvas.clientHeight * 0.2));
      return map.unproject(map.project(latLng, zoom).subtract([0, verticalOffset]), zoom);
    };

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
        const category = mapCategoryFor(item);
        marker.setStyle(markerStyle(item, selectedSlug === item.slug));
        if (category === "activa") activeLayer.addLayer(marker);
        else if (category === "cartografica") cartographicLayer.addLayer(marker);
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
        const zoom = selectedZoom();
        const center = selectedCenter(record.latLng, zoom);
        const shouldMove = map.getZoom() !== zoom || map.getCenter().distanceTo(center) > 0.5;

        if (shouldMove) {
          if (!isPreview) map.once("moveend", () => record.marker.openPopup());
          map.setView(center, zoom, { animate: true });
        } else if (!isPreview) {
          record.marker.openPopup();
        }
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
          documentacion: props.documentacion || "cartografica",
          periodo: props.periodo || "",
          qgisZip: props.qgisZip || "",
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

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        state[button.dataset.mapFilterKey] = button.dataset.mapFilterValue || "";
        syncUrl();
        syncFilterControls();
        paint();
      });
    });

    reset?.addEventListener("click", () => {
      state.estado = "";
      state.documentacion = "";
      state.periodo = "";
      state.busqueda = "";
      syncUrl();
      syncFilterControls();
      paint();
    });

    search?.addEventListener("input", () => {
      state.busqueda = search.value.trim();
      syncUrl();
      syncFilterControls();
      paint();
    });
    map.on("moveend zoomend", paint);

    root.addEventListener("click", (event) => {
      const button = event.target.closest("[data-focus-bodega]");
      if (button?.dataset.focusBodega) focusBodega(button.dataset.focusBodega);
    });

    Promise.all([loadGeoJson("public/mapas/bodegas.geojson")]).then(([bodegasGeoJson]) => {
      mergeBodegaGeoJson(bodegasGeoJson);

      updateSummary();
      renderMarkers();
      syncFilterControls();
      paint();
      if (selectedSlug) focusBodega(selectedSlug);
      else fitMarkers();
      requestAnimationFrame(() => map.invalidateSize());
    });

    updateSummary();
    renderMarkers();
    syncFilterControls();
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
    initContextCarousels();
    initContactForm();
    initLightbox();
    initFicha();
    initMap();
  });
})();
