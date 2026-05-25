const whatsappNumber = "4971429194397";
const panel = document.querySelector("#whatsapp-widget");
const openWidgetButtons = [...document.querySelectorAll("[data-open-widget]")];
const closeWidgetButton = document.querySelector("[data-close-widget]");
const floatingWhatsapp = document.querySelector(".floating-whatsapp");
const widgetServiceButtons = [...document.querySelectorAll("[data-widget-service]")];
const widgetTimeButtons = [...document.querySelectorAll("[data-widget-time]")];
const widgetNameInput = document.querySelector("#widgetName");
const widgetPhoneInput = document.querySelector("#widgetPhone");
const widgetTimeInput = document.querySelector("#widgetTime");
const widgetWhatsapp = document.querySelector("#widgetWhatsapp");
const mobileSectionToggle = document.querySelector(".mobile-section-toggle");
const mobileSectionMenu = document.querySelector("#mobile-section-menu");

let widgetService = "";
let widgetTime = "";

function setPanelOpen(isOpen) {
  if (!panel) return;

  panel.classList.toggle("is-open", isOpen);
  panel.setAttribute("aria-hidden", String(!isOpen));
  openWidgetButtons.forEach((button) => {
    button.setAttribute("aria-expanded", String(isOpen));
  });

  if (floatingWhatsapp) {
    floatingWhatsapp.classList.toggle("is-open", isOpen);
  }
}

function updateWidgetWhatsapp() {
  if (!widgetWhatsapp) return;

  const name = widgetNameInput && widgetNameInput.value.trim();
  const phone = widgetPhoneInput && widgetPhoneInput.value.trim();
  const customTime = widgetTimeInput && widgetTimeInput.value.trim();
  const time = customTime || widgetTime;
  const parts = ["Hallo New Look, ich möchte einen Termin anfragen."];

  if (name) parts.push(`Name: ${name}.`);
  if (widgetService) parts.push(`Leistung: ${widgetService}.`);
  if (time) parts.push(`Wunschzeit/Hinweis: ${time}.`);
  if (phone) parts.push(`Rückrufnummer: ${phone}.`);
  parts.push("Bitte kurz bestätigen, ob das zeitlich passt.");

  widgetWhatsapp.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(parts.join(" "))}`;
}

function setWidgetService(value) {
  widgetService = value || "";
  widgetServiceButtons.forEach((item) => {
    item.classList.toggle("is-selected", item.dataset.widgetService === widgetService);
  });
  updateWidgetWhatsapp();
}

function setWidgetTime(value) {
  widgetTime = value || "";
  widgetTimeButtons.forEach((item) => {
    item.classList.toggle("is-selected", item.dataset.widgetTime === widgetTime);
  });
  if (widgetTimeInput && widgetTime) widgetTimeInput.value = "";
  updateWidgetWhatsapp();
}

openWidgetButtons.forEach((button) => {
  button.setAttribute("aria-controls", "whatsapp-widget");
  button.setAttribute("aria-expanded", "false");

  button.addEventListener("click", (event) => {
    event.preventDefault();
    const isOpen = panel && panel.classList.contains("is-open");
    const presetService = button.dataset.presetService || "";
    const presetTime = button.dataset.presetTime || "";

    if (presetService) setWidgetService(presetService);
    if (presetTime) setWidgetTime(presetTime);

    if (isOpen && !presetService && !presetTime) {
      setPanelOpen(false);
      return;
    }

    setPanelOpen(true);
  });
});

if (closeWidgetButton) {
  closeWidgetButton.addEventListener("click", () => setPanelOpen(false));
}

widgetServiceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setWidgetService(button.dataset.widgetService || "");
  });
});

widgetTimeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setWidgetTime(button.dataset.widgetTime || "");
  });
});

if (widgetTimeInput) {
  widgetTimeInput.addEventListener("input", () => {
    if (widgetTimeInput.value.trim()) {
      widgetTime = "";
      widgetTimeButtons.forEach((item) => item.classList.remove("is-selected"));
    }
    updateWidgetWhatsapp();
  });
}

[widgetNameInput, widgetPhoneInput].forEach((input) => {
  if (input) input.addEventListener("input", updateWidgetWhatsapp);
});

function updateFloatingWhatsapp() {
  if (!floatingWhatsapp) return;

  const isOpen = panel && panel.classList.contains("is-open");
  floatingWhatsapp.classList.toggle("is-visible", isOpen || window.scrollY > 360);
}

window.addEventListener("scroll", updateFloatingWhatsapp, { passive: true });

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setPanelOpen(false);
    setMobileMenuOpen(false);
  }
});

function setMobileMenuOpen(isOpen) {
  if (!mobileSectionToggle || !mobileSectionMenu) return;

  mobileSectionMenu.classList.toggle("is-open", isOpen);
  mobileSectionToggle.setAttribute("aria-expanded", String(isOpen));
}

if (mobileSectionToggle && mobileSectionMenu) {
  mobileSectionToggle.addEventListener("click", () => {
    setMobileMenuOpen(!mobileSectionMenu.classList.contains("is-open"));
  });

  mobileSectionMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMobileMenuOpen(false));
  });
}

updateWidgetWhatsapp();
updateFloatingWhatsapp();
