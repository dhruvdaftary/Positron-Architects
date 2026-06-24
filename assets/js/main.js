document.addEventListener("DOMContentLoaded", function () {

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var links  = document.querySelector("nav.links");

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
    links.classList.add("open");
    document.body.classList.add("nav-locked");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "true");
      toggle.textContent = "✕";
    }
  }

  if (toggle && links) {

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      isOpen() ? closeNav() : openNav();
    });

    /* Tapping a nav link navigates and closes the panel */
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });

    /* Tap outside to close */
    document.addEventListener("click", function (e) {
      if (isOpen() && !links.contains(e.target) && e.target !== toggle) {
        closeNav();
      }
    });

    /* Escape key */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) closeNav();
    });

    /* Snap back to desktop — ensure clean state */
    window.addEventListener("resize", function () {
      if (window.innerWidth > 780) closeNav();
    });
  }

  /* ---------- Generic modal system ---------- */
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
