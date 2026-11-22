(() => {
  const form = document.getElementById("estimate-request");
  const recipient = document.querySelector("[data-email]").href.slice("mailto:".length);
  const status = document.getElementById("estimate-status");
  const fallback = document.getElementById("copy-fallback");

  function requestDetails() {
    for (const field of form.querySelectorAll("[required]")) {
      field.setCustomValidity(field.value.trim() ? "" : "Please complete this field.");
    }
    if (!form.reportValidity()) return null;
    const values = new FormData(form);
    const value = name => String(values.get(name) || "").trim();
    const location = value("location");
    const lines = [
      "Hi Wade,",
      "",
      "I’d like an estimate for a commercial roof.",
      "Building location: " + location,
      "Roof concern: " + value("concern"),
      "",
      value("name")
    ];
    if (value("phone")) lines.push("Callback number: " + value("phone"));
    return { subject: "Roof estimate — " + location, body: lines.join("\r\n") };
  }

  form.addEventListener("input", event => {
    event.target.setCustomValidity?.("");
    status.textContent = "";
    fallback.hidden = true;
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    const request = requestDetails();
    if (!request) return;
    const draft = "mailto:" + recipient + "?subject=" + encodeURIComponent(request.subject)
      + "&body=" + encodeURIComponent(request.body);
    status.textContent = "Send the draft from your email app. If it didn’t open, copy your request and email it to Wade.";
    window.location.href = draft;
  });

  document.getElementById("copy-request").addEventListener("click", async () => {
    const request = requestDetails();
    if (!request) return;
    const message = "To: " + recipient + "\nSubject: " + request.subject + "\n\n" + request.body;
    try {
      await navigator.clipboard.writeText(message);
      status.textContent = "Request copied. Paste it into an email to Wade.";
    } catch {
      fallback.value = message;
      fallback.hidden = false;
      fallback.focus();
      fallback.select();
      status.textContent = "Select and copy your request below.";
    }
  });

  form.hidden = false;
})();
