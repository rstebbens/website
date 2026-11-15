/* Automatically discover playbook images from the Agileplaybook GitHub repository.
   Add an image to the repository root to include it in this carousel. */
(() => {
  "use strict";

  const source = "https://api.github.com/repos/rstebbens/Agileplaybook/contents/";
  const status = document.getElementById("playbook-status");
  const gallery = document.getElementById("playbook-gallery");
  const image = document.getElementById("playbook-image");
  const slideElement = document.getElementById("playbook-slide");
  const preloaded = new Map();
  const imageLink = document.getElementById("playbook-image-link");
  const caption = document.getElementById("playbook-caption");
  const count = document.getElementById("playbook-count");
  const dots = document.getElementById("playbook-dots");
  const previous = document.getElementById("playbook-prev");
  const next = document.getElementById("playbook-next");

  let slides = [];
  let current = 0;
  let requestId = 0;

  function preload(index) {
    if (!slides.length) return;
    const slide = slides[(index + slides.length) % slides.length];
    if (preloaded.has(slide.download_url)) return;
    const nextImage = new Image();
    nextImage.decoding = "async";
    nextImage.src = slide.download_url;
    preloaded.set(slide.download_url, nextImage);
  }

  function loadImage(slide) {
    const token = ++requestId;
    const url = slide.download_url;
    const cached = preloaded.get(url);
    slideElement.classList.add("is-loading");

    function finish() {
      if (token !== requestId) return;
      image.src = url;
      slideElement.classList.remove("is-loading");
      preload(current + 1);
    }

    function fail() {
      if (token !== requestId) return;
      slideElement.classList.remove("is-loading");
      image.alt = "Image temporarily unavailable";
      image.removeAttribute("src");
    }

    if (image.currentSrc === url && image.complete && image.naturalWidth) {
      finish();
      return;
    }

    const loader = cached || new Image();
    if (!cached) {
      loader.decoding = "async";
      loader.src = url;
      preloaded.set(url, loader);
    }
    if (loader.complete) {
      if (loader.naturalWidth) finish();
      else fail();
    } else {
      loader.addEventListener("load", finish, { once: true });
      loader.addEventListener("error", fail, { once: true });
    }
  }

  image.addEventListener("load", () => {
    if (!slides.length) slideElement.classList.remove("is-loading");
  });
  if (image.complete && image.naturalWidth) {
    slideElement.classList.remove("is-loading");
  }

  function show(index) {
    if (!slides.length) return;

    current = (index + slides.length) % slides.length;
    const slide = slides[current];

    loadImage(slide);
    image.alt = slide.name.replace(/\.[^.]+$/, "");
    imageLink.href = slide.html_url;
    caption.textContent = image.alt;
    count.textContent = `${current + 1} of ${slides.length}`;

    dots.querySelectorAll("button").forEach((dot, position) => {
      dot.setAttribute("aria-current", String(position === current));
      dot.setAttribute("aria-label",
        `Show ${slides[position].name.replace(/\.[^.]+$/, "")}`);
    });

    previous.disabled = next.disabled = slides.length < 2;
  }

  function setUp(items) {
    slides = items.filter(item =>
      item.type === "file" &&
      /\.(jpe?g|png|webp|gif)$/i.test(item.name) &&
      item.download_url &&
      item.html_url
    ).sort((a, b) => a.name.localeCompare(b.name, "en", {
      numeric: true,
      sensitivity: "base"
    }));

    if (!slides.length) {
      status.textContent = "No cheat sheet images found in the repository yet.";
      return;
    }

    dots.replaceChildren();
    slides.forEach((slide, position) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.addEventListener("click", () => show(position));
      dots.append(dot);
    });

    previous.addEventListener("click", () => show(current - 1));
    next.addEventListener("click", () => show(current + 1));

    document.addEventListener("keydown", event => {
      if (event.target.closest("input, textarea, select")) return;
      if (event.key === "ArrowLeft") show(current - 1);
      if (event.key === "ArrowRight") show(current + 1);
    });

    let touchX = 0;
    image.addEventListener("touchstart", event => {
      touchX = event.changedTouches[0].screenX;
    }, { passive: true });
    image.addEventListener("touchend", event => {
      const dx = event.changedTouches[0].screenX - touchX;
      if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    }, { passive: true });

    show(0);
    status.hidden = true;
    gallery.hidden = false;
  }

  fetch(source, { headers: { Accept: "application/vnd.github+json" } })
    .then(response => {
      if (!response.ok) throw new Error(`GitHub API HTTP ${response.status}`);
      return response.json();
    })
    .then(items => {
      if (!Array.isArray(items)) throw new Error("Unexpected repository response");
      setUp(items);
    })
    .catch(error => {
      console.error("Unable to load coaching playbook images:", error);
      status.textContent = "Couldn't load the carousel just now. You can browse all the cheat sheets on GitHub.";
      const link = document.createElement("a");
      link.href = "https://github.com/rstebbens/Agileplaybook";
      link.textContent = "Open Agileplaybook";
      status.append(document.createTextNode(" "), link);
    });
})();
