const config = window.warhorse || {};
const phone = document.querySelector("[data-phone]");
const email = document.querySelector("[data-email]");
const serviceArea = document.querySelector("[data-service-area]");

if (phone && config.phone) {
  const digits = config.phone.replace(/[^0-9+]/g, "");
  if (digits) {
    phone.href = "tel:" + (/^\d{10}$/.test(digits) ? "+1" + digits : digits);
    phone.textContent = config.phone;
  }
}
if (email && config.email) {
  email.href = "mailto:" + config.email;
  email.textContent = config.email;
}
if (serviceArea && config.serviceArea) {
  serviceArea.textContent = "Serving " + config.serviceArea;
}

const gallery = document.querySelector("[data-gallery]");
if (gallery) {
  for (const project of config.projects || []) {
    if (!project.image || !project.alt) continue;
    const figure = document.createElement("figure");
    const photo = document.createElement("img");
    photo.src = project.image;
    photo.alt = project.alt;
    photo.loading = "lazy";
    figure.append(photo);
    if (project.caption) {
      const caption = document.createElement("figcaption");
      caption.textContent = project.caption;
      figure.append(caption);
    }
    gallery.append(figure);
  }
  if (gallery.childElementCount) {
    document.querySelector("#projects").hidden = false;
    document.querySelector("[data-gallery-link]").hidden = false;
  }
}

// A local file preview needs the index filename. Published directory URLs do not.
if (location.protocol === "file:") {
  for (const link of document.querySelectorAll("a[href]")) {
    const target = new URL(link.href);
    if (target.protocol === "file:" && target.pathname.endsWith("/")) {
      target.pathname += "index.html";
      link.href = target.href;
    }
  }
}
