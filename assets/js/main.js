document.addEventListener("DOMContentLoaded", function () {
  /* ---------- Mobile nav toggle ---------- */
  var header = document.querySelector("header.site");
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector("nav.links");

  function setHeaderHeightVar() {
    if (header) {
      document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
    }
  }
  setHeaderHeightVar();
  window.addEventListener("resize", setHeaderHeightVar);
  window.addEventListener("orientationchange", setHeaderHeightVar);
  // Logo / web fonts loading can change header height after first paint.
  window.addEventListener("load", setHeaderHeightVar);

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
    setHeaderHeightVar();
    links.classList.add("open");
    document.body.classList.add("nav-locked");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "true");
      toggle.textContent = "✕";
    }
  }

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      if (links.classList.contains("open")) {
        closeNav();
      } else {
        openNav();
      }
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });
    // Collapsing back to desktop width shouldn't leave the panel
    // open or the scroll lock engaged.
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
  overlay.innerHTML = '<div class="modal-card" role="dialog" aria-modal="true">' +
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

  window.openModal = openModal;
  window.closeModal = closeModal;
});
