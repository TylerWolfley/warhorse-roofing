(() => {
  if (!window.HTMLDialogElement || typeof HTMLDialogElement.prototype.showModal !== "function") return;
  const links = Array.from(document.querySelectorAll('main figure a[href$=".webp"], main a[data-view-photo]'));
  if (!links.length) return;
  const dialog = document.createElement("dialog");
  dialog.className = "photo-dialog";
  dialog.setAttribute("aria-labelledby", "viewer-title");
  dialog.innerHTML = `
    <header><p id="viewer-title">Project photographs</p><button type="button" data-dismiss>Close</button></header>
    <figure><img alt=""><figcaption aria-live="polite" aria-atomic="true"></figcaption></figure>
    <div class="viewer-tools"><div class="viewer-actions"><button type="button" data-step="-1">Previous</button><button type="button" data-step="1">Next</button></div><a class="viewer-original">Open full size</a></div>`;
  document.body.append(dialog);
  const title = dialog.querySelector("#viewer-title");
  const image = dialog.querySelector("img");
  const caption = dialog.querySelector("figcaption");
  const original = dialog.querySelector(".viewer-original");
  const close = dialog.querySelector("[data-dismiss]");
  const navigation = dialog.querySelector(".viewer-actions");
  let collection = [];
  let position = 0;
  let opener;
  function showPhoto(index) {
    position = (index + collection.length) % collection.length;
    const link = collection[position];
    const thumbnail = link.querySelector("img");
    image.src = link.href;
    image.alt = thumbnail.alt;
    const words = link.closest("figure")?.querySelector("figcaption")?.innerText.trim().replace(/\s+/g, " ") || thumbnail.alt;
    caption.textContent = collection.length > 1 ? (position + 1) + " of " + collection.length + " · " + words : words;
    original.href = link.href;
  }
  for (const link of links) {
    link.setAttribute("aria-haspopup", "dialog");
    link.addEventListener("click", event => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();
      opener = link;
      const region = link.closest("[data-photo-set]");
      collection = region ? links.filter(other => other.closest("[data-photo-set]") === region) : links;
      title.textContent = region?.dataset.photoSet || document.querySelector("h1")?.textContent.trim() || "Project photographs";
      navigation.hidden = collection.length < 2;
      showPhoto(collection.indexOf(link));
      dialog.showModal();
      close.focus();
    });
  }
  close.addEventListener("click", () => dialog.close());
  for (const button of dialog.querySelectorAll("[data-step]")) {
    button.addEventListener("click", () => showPhoto(position + Number(button.dataset.step)));
  }
  dialog.addEventListener("keydown", event => {
    const delta = {ArrowLeft:-1, ArrowRight:1}[event.key];
    if (delta && collection.length > 1) { event.preventDefault(); showPhoto(position + delta); }
  });
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener("close", () => opener?.focus({preventScroll:true}));
})();
