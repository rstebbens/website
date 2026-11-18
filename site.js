/* Shared site navigation. Edit links here, not in individual pages. */
(() => {
  const script = document.currentScript;
  const base = new URL("./", script.src);
  const links = [
    ["Home", ""],
    ["About", "about/"],
    ["Projects", "project-page/"],
    ["Agile Games", "project-page/agile-games/"],
    ["My Book", "my-book/"],
    ["Coaching Playbook", "coaching-playbook/"],
    ["Follow Me", "follow-me/"],
    ["YouTube", "youtube/"]
  ];

  const header = document.getElementById("site-header");
  if (header) {
    const brand = document.createElement("a");
    brand.className = "brand";
    brand.href = base.href;
    brand.textContent = "Rob Stebbens";

    const toggle = document.createElement("button");
    toggle.className = "menu";
    toggle.type = "button";
    toggle.textContent = "Menu ☰";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "site-nav");

    const nav = document.createElement("nav");
    nav.id = "site-nav";
    nav.setAttribute("aria-label", "Main navigation");

    links.forEach(([label, path]) => {
      const anchor = document.createElement("a");
      anchor.href = new URL(path, base).href;
      anchor.textContent = label;
      if (new URL(anchor.href).pathname === location.pathname) {
        anchor.setAttribute("aria-current", "page");
      }
      nav.append(anchor);
    });

    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("open", !expanded);
    });

    header.replaceChildren(brand, toggle, nav);
  }

  // Reuse the existing Google Analytics 4 property across every page.
  const measurementId = "G-VETP5V2JVF";
  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", measurementId);
  const analyticsScript = document.createElement("script");
  analyticsScript.async = true;
  analyticsScript.src = "https://www.googletagmanager.com/gtag/js?id=" + measurementId;
  document.head.append(analyticsScript);

  // Keep staging URLs working while serving root-relative paths on the custom domain.
  if (location.hostname !== "rstebbens.github.io") {
    document.querySelectorAll("[href], [src], [srcset]").forEach(el => {
      for (const attr of ["href", "src"]) {
        const value = el.getAttribute(attr);
        if (value && value.startsWith("/website/")) {
          el.setAttribute(attr, value.slice("/website".length));
        }
      }
      const srcset = el.getAttribute("srcset");
      if (srcset && srcset.includes("/website/")) {
        el.setAttribute("srcset", srcset.split("/website/").join("/"));
      }
    });
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
