(() => {
  const form = document.getElementById("estimate-request");
  const emailLink = document.getElementById("wade-email");
  if (!form || !emailLink) return;

  const recipient = emailLink.href.slice("mailto:".length);
  const status = document.getElementById("estimate-status");
  const copyArea = document.getElementById("copy-fallback");
  const emailFallback = document.getElementById("assessment-email-fallback");
  const submitButton = document.getElementById("assessment-submit");
  const copyButton = document.getElementById("copy-request");
  const endpoint = window.warhorse?.assessmentEndpoint || "";
  const direct = /^https:\/\/formspree\.io\/f\/[a-z0-9]+\/?$/i.test(endpoint);

  function requestDetails() {
    for (const field of form.querySelectorAll("[required]")) {
      field.setCustomValidity(field.value.trim() ? "" : "Please complete this field.");
    }
    if (!form.reportValidity()) return null;
    const data = new FormData(form);
    for (const field of ["name", "contact", "location", "message"]) {
      data.set(field, data.get(field).trim());
    }
    const subject = "Commercial roof assessment: " + data.get("location");
    const message = [
      "Hi Wade,",
      "",
      "I'd like a roof assessment for " + data.get("location") + ".",
      data.get("message"),
      "",
      data.get("name"),
      "Phone or email: " + data.get("contact")
    ].join("\r\n");
    const email = "mailto:" + recipient + "?subject=" + encodeURIComponent(subject)
      + "&body=" + encodeURIComponent(message);
    return { data, message, subject, email };
  }

  function clearFeedback() {
    status.textContent = "";
    copyArea.hidden = true;
    emailFallback.hidden = true;
  }

  form.addEventListener("input", event => {
    event.target.setCustomValidity?.("");
    clearFeedback();
  });

  copyButton.addEventListener("click", async () => {
    const request = requestDetails();
    if (!request) return;
    const text = "To: " + recipient + "\nSubject: " + request.subject + "\n\n" + request.message;
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = "Request copied. Paste it into a message to Wade.";
      copyArea.hidden = true;
    } catch {
      copyArea.value = text;
      copyArea.hidden = false;
      copyArea.focus();
      copyArea.select();
      status.textContent = "Copy the selected request, then send it to Wade.";
    }
  });

  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (submitButton.disabled) return;
    const request = requestDetails();
    if (!request) return;
    clearFeedback();
    if (!direct) {
      emailFallback.href = request.email;
      emailFallback.hidden = false;
      status.textContent = "Send the draft from your email app. If it didn’t open, use the email link or copy your request.";
      window.location.href = request.email;
      return;
    }

    submitButton.disabled = true;
    form.setAttribute("aria-busy", "true");
    status.textContent = "Sending your request…";
    const requestFields = form.querySelectorAll("[required]");
    for (const field of requestFields) field.readOnly = true;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 18000);
    try {
      const data = request.data;
      const contact = data.get("contact");
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) data.set("email", contact);
      const response = await fetch(endpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
        signal: controller.signal,
        redirect: "error"
      });
      if (!response.ok) throw new Error("Request was not accepted");
      form.reset();
      status.textContent = "Your roof assessment request was submitted. Wade can follow up using the contact details you provided.";
    } catch {
      emailFallback.href = request.email;
      emailFallback.hidden = false;
      status.textContent = "We couldn’t confirm your submission. You can email these details to Wade or call him directly.";
    } finally {
      window.clearTimeout(timeout);
      for (const field of requestFields) field.readOnly = false;
      form.removeAttribute("aria-busy");
      submitButton.disabled = false;
    }
  });

  if (direct) {
    document.getElementById("assessment-help").textContent = "Send the building location, your roof concern, and the best way for Wade to reach you.";
    submitButton.textContent = "Send assessment request";
  }
  form.hidden = false;
})();
