document.addEventListener("DOMContentLoaded", function () {

  /* ---------- Mobile nav toggle ---------- */
  var header = document.querySelector("header.site");
  var toggle = document.querySelector(".nav-toggle");
  var links  = document.querySelector("nav.links");

  /* Measure the header and write the CSS custom property so the
     fixed nav panel starts exactly where the header ends.          */
  function setHeaderHeightVar() {
    if (!header) return;
    var h = header.getBoundingClientRect().height;
    document.documentElement.style.setProperty("--header-h", h + "px");
  }

  /* Run once immediately so the variable exists before any paint.  */
  setHeaderHeightVar();

  /* Re-measure after fonts / images finish loading – these inflate
     the header height and would leave a gap if we only measured early. */
  window.addEventListener("load", setHeaderHeightVar);
  window.addEventListener("resize", setHeaderHeightVar);
  window.addEventListener("orientationchange", function () {
    /* Small delay: the viewport dims aren't final at the moment the
       event fires on iOS – wait one frame before measuring.          */
    requestAnimationFrame(setHeaderHeightVar);
  });

  /* ---- open / close helpers ---- */
  function isOpen() {
    return links && links.classList.contains("open");
  }

  function closeNav() {
    if (!links) return;
    links.classList.remove("open");
    document.body.classList.remove("nav-locked");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "☰";
    }
  }

  function openNav() {
    if (!links) return;
    /* Re-measure right before opening so the panel sits flush below
       the header even if its height changed since page load.         */
    setHeaderHeightVar();
    links.classList.add("open");
    document.body.classList.add("nav-locked");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "true");
      toggle.textContent = "✕";
    }
  }

  if (toggle && links) {

    /* Toggle on button click */
    toggle.addEventListener("click", function (e) {
      /* Stop the click reaching the document listener below */
      e.stopPropagation();
      isOpen() ? closeNav() : openNav();
    });

    /* Tapping a nav link navigates AND closes the panel */
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });

    /* Tapping the dimmed page area (outside the nav panel) closes it */
    document.addEventListener("click", function (e) {
      if (isOpen() && !links.contains(e.target) && e.target !== toggle) {
        closeNav();
      }
    });

    /* Escape key closes the panel */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) closeNav();
    });

    /* Snapping back to desktop width shouldn't leave the panel open
       or the scroll-lock engaged.                                    */
    window.addEventListener("resize", function () {
      if (window.innerWidth > 780) closeNav();
    });
  }

  /* ---------- Generic modal system ----------
     Used by projects.html, team.html and careers.html.
     Call window.openModal(innerHtml) to show, window.closeModal() to hide.
  --------------------------------------------- */
  var overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.id = "global-modal";
  overlay.innerHTML =
    '<div class="modal-card" role="dialog" aria-modal="true">' +
      '<button class="modal-close" aria-label="Close">&times;</button>' +
      '<div class="modal-content"></div>' +
    '</div>';
  document.body.appendChild(overlay);

  var modalContent = overlay.querySelector(".modal-content");

  function closeModal() {
    overlay.classList.remove("open");
    document.body.classList.remove("modal-locked");
  }

  function openModal(html) {
    modalContent.innerHTML = html;
    overlay.classList.add("open");
    document.body.classList.add("modal-locked");
  }

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeModal();
  });

  overlay.querySelector(".modal-close").addEventListener("click", closeModal);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  window.openModal  = openModal;
  window.closeModal = closeModal;
});
