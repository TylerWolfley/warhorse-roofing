const config = window.warhorse || {};
const actions = document.querySelector("[data-contact-actions]");

function addContactLink(label, href) {
  const link = document.createElement("a");
  link.className = "button light";
  link.href = href;
  link.textContent = label;
  actions.append(link);
}

if (config.phone) {
  const dialable = config.phone.replace(/[^0-9+]/g, "");
  if (dialable) addContactLink("Call " + config.phone, "tel:" + dialable);
}
if (config.email) {
  addContactLink("Email for an estimate", "mailto:" + config.email + "?subject=Roofing%20estimate");
}
if (actions.childElementCount) {
  actions.hidden = false;
  document.querySelector("[data-contact-copy]").textContent =
    "Tell Warhorse Roofing where the property is and what area you’d like sprayed.";
  document.querySelector(".nav-cta").textContent = "Get an estimate";
}
if (config.serviceArea) {
  const area = document.querySelector("[data-service-area]");
  area.textContent = "Serving " + config.serviceArea + ".";
  area.hidden = false;
}

const gallery = document.querySelector("[data-gallery]");
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
