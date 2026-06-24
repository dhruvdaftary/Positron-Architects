document.addEventListener("DOMContentLoaded", function () {
  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector("nav.links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
      var expanded = links.classList.contains("open");
      toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
      });
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
