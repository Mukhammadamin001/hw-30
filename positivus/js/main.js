"use strict";

/* ---------- Mobile menu ---------- */
(function initMenu() {
  const burger = document.querySelector(".burger");
  const nav = document.getElementById("site-nav");
  if (!burger || !nav) return;

  const setOpen = (open) => {
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
  };

  burger.addEventListener("click", () => {
    setOpen(burger.getAttribute("aria-expanded") !== "true");
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });

  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target) && !burger.contains(event.target)) setOpen(false);
  });
})();

/* ---------- Working process: only one step open at a time ----------
   Modern browsers do this natively via <details name="process">;
   this keeps the same behaviour in older ones. */
(function initAccordion() {
  const steps = document.querySelectorAll(".step");
  steps.forEach((step) => {
    step.addEventListener("toggle", () => {
      if (!step.open) return;
      steps.forEach((other) => {
        if (other !== step && other.open) other.open = false;
      });
    });
  });
})();

/* ---------- Testimonials slider (infinite, centred) ---------- */
(function initSlider() {
  const slider = document.querySelector("[data-slider]");
  if (!slider) return;

  const viewport = slider.querySelector(".reviews__viewport");
  const track = slider.querySelector("[data-track]");
  const dotsBox = slider.querySelector("[data-dots]");
  const originals = Array.from(track.querySelectorAll("[data-slide]"));
  const count = originals.length;
  if (!count) return;

  // Clone the slides before and after so there is always a neighbour on both sides
  const makeClones = () =>
    originals.map((slide) => {
      const clone = slide.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.inert = true;
      return clone;
    });
  track.prepend(...makeClones());
  track.append(...makeClones());

  const slides = Array.from(track.children);
  let current = count; // first original slide
  let busy = false;

  originals.forEach((slide, i) => {
    slide.setAttribute("role", "group");
    slide.setAttribute("aria-roledescription", "slide");
    slide.setAttribute("aria-label", `${i + 1} of ${count}`);
  });

  const dots = originals.map((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "reviews__dot";
    dot.setAttribute("aria-label", `Show review ${i + 1}`);
    dot.innerHTML = '<svg aria-hidden="true"><use href="#i-star"></use></svg>';
    dot.addEventListener("click", () => goTo(count + i));
    dotsBox.append(dot);
    return dot;
  });

  function position(animate) {
    const slide = slides[current];
    const offset = slide.offsetLeft + slide.offsetWidth / 2 - viewport.clientWidth / 2;
    track.classList.toggle("no-anim", !animate);
    track.style.transform = `translateX(${-offset}px)`;

    const real = (((current - count) % count) + count) % count;
    dots.forEach((dot, i) => dot.setAttribute("aria-current", String(i === real)));
    slides.forEach((s, i) => s.classList.toggle("is-active", i === current));
  }

  let fallback = null;

  function goTo(index) {
    if (busy || index === current) return;
    busy = true;
    current = index;
    position(true);
    // In case transitionend never fires (e.g. tab in background)
    clearTimeout(fallback);
    fallback = setTimeout(finish, 700);
  }

  // After the animation, silently jump from a clone back to the matching original
  function finish() {
    if (!busy) return;
    clearTimeout(fallback);
    if (current >= count * 2) current -= count;
    if (current < count) current += count;
    position(false);
    busy = false;
  }

  track.addEventListener("transitionend", (event) => {
    if (event.target === track && event.propertyName === "transform") finish();
  });

  slider.querySelector("[data-prev]").addEventListener("click", () => goTo(current - 1));
  slider.querySelector("[data-next]").addEventListener("click", () => goTo(current + 1));

  slider.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") goTo(current - 1);
    if (event.key === "ArrowRight") goTo(current + 1);
  });

  // Swipe on touch screens
  let startX = null;
  viewport.addEventListener("pointerdown", (event) => {
    startX = event.clientX;
  });
  viewport.addEventListener("pointerup", (event) => {
    if (startX === null) return;
    const dx = event.clientX - startX;
    if (Math.abs(dx) > 50) goTo(current + (dx < 0 ? 1 : -1));
    startX = null;
  });

  window.addEventListener("resize", () => position(false));
  document.fonts?.ready.then(() => position(false));
  position(false);
})();

/* ---------- Forms (static page: validate and show a message) ---------- */
(function initForms() {
  document.querySelectorAll("[data-form]").forEach((form) => {
    const status = form.querySelector("[data-status]");
    const fields = form.querySelectorAll("input[required], textarea[required]");

    fields.forEach((field) => {
      field.addEventListener("input", () => field.classList.remove("is-invalid"));
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      let firstInvalid = null;

      fields.forEach((field) => {
        const valid = field.checkValidity() && field.value.trim() !== "";
        field.classList.toggle("is-invalid", !valid);
        field.setAttribute("aria-invalid", String(!valid));
        if (!valid && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid) {
        status.textContent = "Please fill in the required fields correctly.";
        firstInvalid.focus();
        return;
      }

      status.textContent = form.classList.contains("subscribe")
        ? "Thanks for subscribing!"
        : "Thank you! We will get back to you soon.";
      form.reset();
    });
  });
})();
