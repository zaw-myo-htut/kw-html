(function () {
  "use strict";

  const nav = document.getElementById("siteNav");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const testimonialSlides = document.querySelectorAll(".testimonials__slide");
  const testimonialPrev = document.getElementById("testimonialPrev");
  const testimonialNext = document.getElementById("testimonialNext");
  const processSteps = document.querySelectorAll(".process__step");

  let testimonialIndex = 0;

  /* Sticky navigation */
  function handleScroll() {
    if (!nav) return;
    if (window.scrollY > 80) {
      nav.classList.add("is-scrolled");
    } else {
      nav.classList.remove("is-scrolled");
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  /* Mobile menu toggle */
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      const isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Smooth scroll for anchor links */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* Active nav link on scroll (home page sections only) */
  const sections = document.querySelectorAll("section[id], header[id]");
  const navLinks = document.querySelectorAll(".site-nav__menu a");

  function setActiveNavFromPage() {
    var path = window.location.pathname;
    var page = path.substring(path.lastIndexOf("/") + 1) || "index.html";

    navLinks.forEach(function (link) {
      link.classList.remove("is-active");
      var href = link.getAttribute("href") || "";

      if (page === "index.html" || page === "") {
        if (href === "index.html" || href === "#home") {
          link.classList.add("is-active");
        }
        return;
      }

      if (href === page || href.endsWith("/" + page)) {
        link.classList.add("is-active");
      }
    });
  }

  function setActiveNavFromScroll() {
    if (!sections.length) return;

    var path = window.location.pathname;
    var page = path.substring(path.lastIndexOf("/") + 1) || "index.html";
    if (page !== "index.html" && page !== "") return;

    var current = "";
    sections.forEach(function (section) {
      var top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute("id") || "";
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove("is-active");
      var href = link.getAttribute("href");
      if (href === "#" + current) {
        link.classList.add("is-active");
      } else if ((current === "home" || !current) && (href === "index.html" || href === "#home")) {
        link.classList.add("is-active");
      }
    });
  }

  setActiveNavFromPage();
  window.addEventListener("scroll", setActiveNavFromScroll, { passive: true });

  /* Services carousel */
  function initServicesCarousel() {
    const track = document.getElementById("servicesTrack");
    const nextBtn = document.getElementById("servicesNext");
    if (!track || !nextBtn) return;

    const GAP = 30;
    let index = 0;
    let animating = false;
    let originalCount = 0;

    function setupClones() {
      track.querySelectorAll(".service-card.is-clone").forEach(function (el) {
        el.remove();
      });

      const originals = track.querySelectorAll(".service-card:not(.is-clone)");
      originalCount = originals.length;

      originals.forEach(function (card) {
        const clone = card.cloneNode(true);
        clone.classList.add("is-clone");
        clone.setAttribute("aria-hidden", "true");
        track.appendChild(clone);
      });
    }

    function getStep() {
      const card = track.querySelector(".service-card");
      if (!card) return 0;
      return card.getBoundingClientRect().width + GAP;
    }

    function move(animate) {
      track.style.transition = animate
        ? "transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)"
        : "none";
      track.style.transform = "translateX(-" + (index * getStep()) + "px)";
    }

    function goNext() {
      if (animating || originalCount === 0) return;
      animating = true;
      index += 1;
      move(true);

      track.addEventListener(
        "transitionend",
        function onEnd() {
          track.removeEventListener("transitionend", onEnd);
          if (index >= originalCount) {
            index = 0;
            move(false);
          }
          animating = false;
        },
        { once: true }
      );
    }

    setupClones();
    move(false);

    nextBtn.addEventListener("click", goNext);

    let touchStartX = 0;
    track.addEventListener(
      "touchstart",
      function (e) {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    track.addEventListener(
      "touchend",
      function (e) {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (diff > 50) goNext();
      },
      { passive: true }
    );

    window.addEventListener("resize", function () {
      if (index >= originalCount) index = 0;
      move(false);
    });
  }

  initServicesCarousel();

  /* Stats count-up on scroll */
  function initStatsCounter() {
    const section = document.querySelector(".stats");
    const numbers = document.querySelectorAll(".stats__number[data-count]");
    if (!section || !numbers.length) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let started = false;

    function animateCount(el, target, suffix, duration, delay) {
      setTimeout(function () {
        const startTime = performance.now();

        function tick(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(target * eased);
          el.textContent = current + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }

        el.textContent = "0" + suffix;
        requestAnimationFrame(tick);
      }, delay);
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || started) return;
          started = true;
          observer.disconnect();

          numbers.forEach(function (el, i) {
            const target = parseInt(el.dataset.count, 10);
            const suffix = el.dataset.suffix || "";
            animateCount(el, target, suffix, 1800, i * 120);
          });
        });
      },
      { threshold: 0.35, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(section);
  }

  function initStatsExpand() {
    var expandableItems = document.querySelectorAll(".stats__item--expandable");

    function getPopup(item) {
      var trigger = item.querySelector(".stats__popup-trigger");
      var popupId = trigger ? trigger.getAttribute("aria-controls") : null;
      return popupId ? document.getElementById(popupId) : null;
    }

    function closeItem(item) {
      if (!item) {
        return;
      }

      var trigger = item.querySelector(".stats__popup-trigger");
      var popup = getPopup(item);

      item.classList.remove("is-open");
      if (trigger) {
        trigger.setAttribute("aria-expanded", "false");
      }
      if (popup) {
        popup.hidden = true;
      }
    }

    function closeAll() {
      expandableItems.forEach(closeItem);
      document.body.classList.remove("stats-popup-open");
    }

    function openItem(item) {
      var trigger = item.querySelector(".stats__popup-trigger");
      var popup = getPopup(item);

      closeAll();
      item.classList.add("is-open");
      if (trigger) {
        trigger.setAttribute("aria-expanded", "true");
      }
      if (popup) {
        popup.hidden = false;
      }
      document.body.classList.add("stats-popup-open");
    }

    expandableItems.forEach(function (item) {
      var trigger = item.querySelector(".stats__popup-trigger");
      var popup = getPopup(item);

      if (!trigger || !popup) {
        return;
      }

      trigger.addEventListener("click", function () {
        if (trigger.getAttribute("aria-expanded") === "true") {
          closeAll();
          return;
        }
        openItem(item);
      });

      popup.querySelectorAll("[data-kwte='stats-popup-close']").forEach(function (closeBtn) {
        closeBtn.addEventListener("click", function () {
          closeAll();
        });
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeAll();
      }
    });
  }

  initStatsCounter();
  initStatsExpand();

  /* Services page — tab panels */
  function initPageTabs(navSelector, panelSelector, tabAttr, panelAttr) {
    var nav = document.querySelector(navSelector);
    var panels = document.querySelectorAll(panelSelector);
    if (!nav || !panels.length) return;

    function activate(index) {
      nav.querySelectorAll("[data-" + tabAttr + "]").forEach(function (btn) {
        var isActive = btn.getAttribute("data-" + tabAttr) === String(index);
        btn.classList.toggle("is-active", isActive);
        btn.setAttribute("aria-selected", String(isActive));
      });

      panels.forEach(function (panel) {
        var isActive = panel.getAttribute("data-" + panelAttr) === String(index);
        panel.classList.toggle("is-active", isActive);
        panel.hidden = !isActive;
      });
    }

    nav.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-" + tabAttr + "]");
      if (!btn) return;
      activate(btn.getAttribute("data-" + tabAttr));
    });

    /* Deep-link via hash to service anchor */
    var hash = window.location.hash.replace("#", "");
    if (hash) {
      panels.forEach(function (panel) {
        if (panel.id === hash) {
          activate(panel.getAttribute("data-" + panelAttr));
        }
      });
    }
  }

  initPageTabs("#procStudioNav", "#procStudioPanels .proc-studio__panel", "proc-tab", "proc-panel");

  /* Testimonials slider */
  function showTestimonial(index) {
    testimonialSlides.forEach(function (slide, i) {
      slide.hidden = i !== index;
    });
    testimonialIndex = index;
  }

  if (testimonialPrev && testimonialNext && testimonialSlides.length) {
    testimonialPrev.addEventListener("click", function () {
      const next = testimonialIndex <= 0 ? testimonialSlides.length - 1 : testimonialIndex - 1;
      showTestimonial(next);
    });

    testimonialNext.addEventListener("click", function () {
      const next = testimonialIndex >= testimonialSlides.length - 1 ? 0 : testimonialIndex + 1;
      showTestimonial(next);
    });
  }

  /* Process step hover highlight */
  processSteps.forEach(function (step) {
    step.addEventListener("mouseenter", function () {
      processSteps.forEach(function (s) {
        s.classList.remove("is-active");
      });
      step.classList.add("is-active");
    });
  });

  /* Entrance animations */
  function initRevealAnimations() {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function show(el) {
      if (!el) return;
      el.classList.add("is-visible");
    }

    function reveal(el, variant, delay) {
      if (!el) return;
      el.classList.add("reveal", variant || "reveal--up");
      if (delay) el.style.transitionDelay = delay;
      if (prefersReduced) {
        show(el);
        return;
      }
      return el;
    }

    /* Hero — play on load */
    [
      document.querySelector(".site-nav__logo"),
      document.querySelector(".site-nav__menu"),
      document.querySelector(".site-nav__social--desktop"),
      document.querySelector(".hero__title"),
      document.querySelector(".hero__subtitle"),
      document.querySelector(".page-hero__eyebrow"),
      document.querySelector(".page-hero__title"),
      document.querySelector(".page-hero__subtitle"),
    ].filter(Boolean).forEach(function (el, i) {
      reveal(el, "reveal--up", 0.1 + i * 0.12 + "s");
      if (!prefersReduced) {
        setTimeout(function () {
          show(el);
        }, 80);
      }
    });

    const scrollTargets = [
      ".about__heading",
      ".about__row > *",
      ".stats__item",
      ".section-blue__header > *",
      ".service-card:not(.is-clone)",
      ".services__arrow",
      ".portfolio__header > *",
      ".portfolio-card",
      ".portfolio__cta",
      ".divider__lines",
      ".clients .section-label",
      ".client-card",
      ".process__header > *",
      ".process__content > *",
      ".process__step",
      ".testimonials .section-label",
      ".testimonials__heading",
      ".testimonials__quote-wrap",
      ".testimonials__image",
      ".testimonials__nav",
      ".insights .section-label",
      ".insights .section-heading",
      ".blog-card",
      ".site-footer__grid > *",
      ".site-footer__bottom",
      ".page-hero__eyebrow",
      ".page-hero__title",
      ".page-hero__subtitle",
      ".content-block .section-label",
      ".content-block .section-heading",
      ".content-block__text",
      ".content-block__figure",
      ".content-block__prose",
      ".value-card",
      ".mission-vision__card",
      ".team .section-label",
      ".team .section-heading",
      ".team__intro",
      ".team-card",
      ".certifications .section-label",
      ".certifications .section-heading",
      ".certifications__intro",
      ".cert-list__item",
      ".page-cta__inner > *",
      ".svc-showcase__header",
      ".svc-showcase__item",
      ".proc-studio__header",
      ".proc-studio__nav",
      ".proc-studio__panel",
      ".grants__header",
      ".grant-card",
      ".grant-support__header",
      ".grant-support__item",
      ".grant-eligibility .section-label",
      ".grant-eligibility .section-heading",
      ".grant-eligibility__list li",
      ".grant-eligibility .content-block__figure",
      ".insights-page .section-label",
      ".insights-page .section-heading",
      ".insights-page__grid .blog-card",
      ".insight-spotlight__card",
      ".insight-themes__header",
      ".insight-theme",
      ".insight-feed__header",
      ".insight-feed__item",
      ".case-metrics__item",
      ".case-grid-section__header",
      ".case-card",
      ".case-studies-portfolio .portfolio__header",
      ".case-studies-portfolio__grid .portfolio-card",
      ".case-studies-testimonials .section-label",
      ".case-studies-testimonials .testimonials__heading",
      ".case-studies-testimonials .testimonials__quote-wrap",
      ".case-studies-testimonials .testimonials__image",
      ".case-studies-testimonials .testimonials__nav",
      ".contact-info",
      ".contact-form-wrap",
      ".contact-map__frame",
    ];

    const elements = document.querySelectorAll(scrollTargets.join(", "));

    elements.forEach(function (el) {
      reveal(el, "reveal--up");
    });

    /* Stagger grids & lists */
    document.querySelectorAll(
      ".stats__grid, .portfolio__grid, .case-studies-portfolio__grid, .case-grid, .insight-themes__grid, .clients__grid, .insights__grid, .insights-page__grid, .process__steps, .about__row, .values-grid, .team-grid, .cert-list, .mission-vision__grid, .svc-showcase, .grant-grid, .grant-support__grid"
    ).forEach(function (group) {
      group.querySelectorAll(".reveal").forEach(function (el, i) {
        el.style.transitionDelay = i * 0.1 + "s";
      });
    });

    if (prefersReduced) {
      elements.forEach(show);
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          show(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  initRevealAnimations();

  /* Contact form — static demo handler */
  function initContactForm() {
    var form = document.getElementById("contactForm");
    var notice = document.getElementById("contactFormNotice");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (notice) {
        notice.hidden = false;
      }
      form.reset();
    });
  }

  initContactForm();
})();
