(function () {
  var viewport = document.querySelector("[data-project-scroller]");
  if (!viewport) return;

  var prev = document.querySelector('[data-project-dir="-1"]');
  var next = document.querySelector('[data-project-dir="1"]');
  var item = viewport.querySelector(".project-item");

  function stepSize() {
    if (!item) return Math.round(viewport.clientWidth * 0.7);
    var styles = window.getComputedStyle(viewport.querySelector(".project-index"));
    var gap = parseFloat(styles.columnGap || styles.gap) || 0;
    return Math.round(item.getBoundingClientRect().width + gap);
  }

  function maxScroll() {
    return viewport.scrollWidth - viewport.clientWidth;
  }

  function updateArrows() {
    var x = viewport.scrollLeft;
    var max = maxScroll();
    var canScroll = max > 4;
    if (prev) prev.disabled = !canScroll || x <= 4;
    if (next) next.disabled = !canScroll || x >= max - 4;
  }

  function scrollByDir(dir) {
    viewport.scrollBy({ left: dir * stepSize(), behavior: "smooth" });
  }

  if (prev) {
    prev.addEventListener("click", function () {
      scrollByDir(-1);
    });
  }
  if (next) {
    next.addEventListener("click", function () {
      scrollByDir(1);
    });
  }

  viewport.addEventListener("scroll", updateArrows, { passive: true });
  window.addEventListener("resize", updateArrows);

  var dragging = false;
  var startX = 0;
  var startScroll = 0;
  var moved = false;

  viewport.addEventListener("pointerdown", function (event) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragging = true;
    moved = false;
    startX = event.clientX;
    startScroll = viewport.scrollLeft;
  });

  viewport.addEventListener("pointermove", function (event) {
    if (!dragging) return;
    var dx = event.clientX - startX;
    if (Math.abs(dx) > 6) {
      if (!moved) {
        viewport.setPointerCapture(event.pointerId);
        moved = true;
      }
      viewport.scrollLeft = startScroll - dx;
    }
  });

  function stopDrag(event) {
    if (!dragging) return;
    dragging = false;
    if (viewport.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId);
    }
  }

  viewport.addEventListener("pointerup", stopDrag);
  viewport.addEventListener("pointercancel", stopDrag);

  viewport.addEventListener("click", function (event) {
    if (moved) event.preventDefault();
    moved = false;
  }, true);

  updateArrows();
})();
