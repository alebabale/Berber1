const WHATSAPP_NUMBER = "4971429176960";

const prices = {
  "Akupressur Ganzkörpermassage": { 60: 45, 90: 59 },
  "Thai Klassische Massage": { 60: 52, 90: 65 },
  "Rücken- und Kopfmassage": { 45: 39, 60: 45, 90: 59 },
  "Thai Fußreflexzonenmassage": { 45: 39, 60: 45, 90: 59 },
  "Thai Kräuterstempel": { 60: 59, 90: 71 },
  "Hot Stone Ganzkörpermassage": { 60: 59, 90: 71 },
  "Paarmassage Spezial Angebot": { 60: 81, 90: 101 },
};

const whatsappPanel = document.querySelector("#whatsapp-widget");
const openWidgetButtons = [...document.querySelectorAll("[data-open-widget]")];
const closeWidgetButton = document.querySelector("[data-close-widget]");
const floatingWhatsapp = document.querySelector(".floating-whatsapp");
const openChoiceButtons = [...document.querySelectorAll("[data-open-choice]")];
const choiceTabs = [...document.querySelectorAll("[data-choice-tab]")];
const choicePanels = [...document.querySelectorAll("[data-choice-panel]")];
const choiceSection = document.querySelector("#auswahl");
const mobileSectionToggle = document.querySelector(".mobile-section-toggle");
const mobileSectionMenu = document.querySelector("#mobile-section-menu");
const serviceButtons = [...document.querySelectorAll("[data-service]")];
const durationButtons = [...document.querySelectorAll("[data-duration]")];
const nameInput = document.querySelector("#customerName");
const bookingPhoneInput = document.querySelector("#bookingPhone");
const timeInput = document.querySelector("#bookingTime");
const noteInput = document.querySelector("#bookingNote");
const summary = document.querySelector("#bookingSummary");
const bookingWhatsapp = document.querySelector("#bookingWhatsapp");
const openStatus = document.querySelector("#openStatus");
const voucherValueButtons = [...document.querySelectorAll("[data-voucher-value]")];
const voucherServiceButtons = [...document.querySelectorAll("[data-voucher-service]")];
const voucherRecipientInput = document.querySelector("#voucherRecipient");
const voucherBuyerInput = document.querySelector("#voucherBuyer");
const voucherPhoneInput = document.querySelector("#voucherPhone");
const voucherNoteInput = document.querySelector("#voucherNote");
const voucherSummary = document.querySelector("#voucherSummary");
const voucherPreview = document.querySelector("#voucherPreview");
const voucherWhatsapp = document.querySelector("#voucherWhatsapp");
const quickWhatsapp = document.querySelector("#quickWhatsapp");

let selectedChoice = "termin";
let selectedService = "";
let selectedDuration = "";
let selectedVoucherValue = "50";
let selectedVoucherService = "";

function whatsappUrl(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function setWidgetOpen(isOpen) {
  if (!whatsappPanel) return;

  whatsappPanel.classList.toggle("is-open", isOpen);
  whatsappPanel.setAttribute("aria-hidden", String(!isOpen));
  openWidgetButtons.forEach((button) => {
    button.setAttribute("aria-expanded", String(isOpen));
  });
  if (floatingWhatsapp) floatingWhatsapp.classList.toggle("is-open", isOpen);
}

function setChoice(choice, shouldScroll = false) {
  selectedChoice = choice === "gutschein" ? "gutschein" : "termin";

  choiceTabs.forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.choiceTab === selectedChoice);
  });
  choicePanels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.choicePanel === selectedChoice);
  });
  updateQuickWhatsapp();

  if (shouldScroll && choiceSection) {
    choiceSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function setService(service) {
  selectedService = service || "";
  serviceButtons.forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.service === selectedService);
  });
  updateBooking();
}

function setDuration(duration) {
  selectedDuration = duration || "";
  durationButtons.forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.duration === selectedDuration);
  });
  updateBooking();
}

function getPrice() {
  if (!selectedService || !selectedDuration) return "";
  const servicePrices = prices[selectedService] || {};
  return servicePrices[selectedDuration] ? `${servicePrices[selectedDuration]} €` : "";
}

function buildBookingText() {
  const parts = ["Hallo TaiBurSi, ich möchte einen Termin anfragen."];
  if (nameInput && nameInput.value.trim()) parts.push(`Name: ${nameInput.value.trim()}.`);
  if (bookingPhoneInput && bookingPhoneInput.value.trim()) parts.push(`Rückrufnummer: ${bookingPhoneInput.value.trim()}.`);
  if (selectedService) parts.push(`Massage: ${selectedService}.`);
  if (selectedDuration) parts.push(`Dauer: ${selectedDuration} Minuten.`);
  const price = getPrice();
  if (price) parts.push(`Preis laut Liste: ${price}.`);
  if (timeInput && timeInput.value.trim()) parts.push(`Wunschzeit: ${timeInput.value.trim()}.`);
  if (noteInput && noteInput.value.trim()) parts.push(`Hinweis/Beschwerden: ${noteInput.value.trim()}.`);
  parts.push("Bitte um kurze Bestätigung.");
  return parts.join(" ");
}

function updateBooking() {
  const price = getPrice();
  const serviceText = selectedService || "Massage noch nicht gewählt";
  const durationText = selectedDuration ? `${selectedDuration} Minuten` : "Dauer noch offen";
  const priceText = price ? `Preis laut Liste: ${price}` : "Preis nach Massage und Dauer";

  if (summary) summary.textContent = `${serviceText} · ${durationText} · ${priceText}`;
  if (bookingWhatsapp) bookingWhatsapp.href = whatsappUrl(buildBookingText());
  updateQuickWhatsapp();
}

function setVoucherValue(value) {
  selectedVoucherValue = value || "";
  voucherValueButtons.forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.voucherValue === selectedVoucherValue);
  });
  updateVoucher();
}

function setVoucherService(service) {
  selectedVoucherService = service || "";
  voucherServiceButtons.forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.voucherService === selectedVoucherService);
  });
  updateVoucher();
}

function buildVoucherText() {
  const parts = ["Hallo TaiBurSi, ich möchte einen Gutschein reservieren."];
  if (selectedVoucherValue) parts.push(`Wert: ${selectedVoucherValue} €.`);
  if (selectedVoucherService) parts.push(`Massageart: ${selectedVoucherService}.`);
  if (voucherRecipientInput && voucherRecipientInput.value.trim()) parts.push(`Für: ${voucherRecipientInput.value.trim()}.`);
  if (voucherBuyerInput && voucherBuyerInput.value.trim()) parts.push(`Von: ${voucherBuyerInput.value.trim()}.`);
  if (voucherPhoneInput && voucherPhoneInput.value.trim()) parts.push(`Rückrufnummer: ${voucherPhoneInput.value.trim()}.`);
  if (voucherNoteInput && voucherNoteInput.value.trim()) parts.push(`Abholung/Hinweis: ${voucherNoteInput.value.trim()}.`);
  parts.push("Bitte kurz bestätigen, ob ich den Gutschein so abholen kann.");
  return parts.join(" ");
}

function updateVoucher() {
  const valueText = selectedVoucherValue ? `${selectedVoucherValue} € Gutschein` : "Wert noch offen";
  const serviceText = selectedVoucherService || "Massageart noch offen";
  const recipient = voucherRecipientInput && voucherRecipientInput.value.trim() ? `für ${voucherRecipientInput.value.trim()}` : "Empfänger noch offen";

  if (voucherSummary) voucherSummary.textContent = `${valueText} · ${serviceText} · ${recipient}`;
  if (voucherPreview) voucherPreview.textContent = selectedVoucherValue ? `${selectedVoucherValue} € Massage-Gutschein` : "Massage-Gutschein";
  if (voucherWhatsapp) voucherWhatsapp.href = whatsappUrl(buildVoucherText());
  updateQuickWhatsapp();
}

function updateQuickWhatsapp() {
  if (!quickWhatsapp) return;
  quickWhatsapp.href = selectedChoice === "gutschein" ? whatsappUrl(buildVoucherText()) : whatsappUrl(buildBookingText());
}

openChoiceButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    if (button.dataset.presetService) setService(button.dataset.presetService);
    if (button.dataset.presetDuration) setDuration(button.dataset.presetDuration);
    if (button.dataset.presetTime && timeInput) timeInput.value = button.dataset.presetTime;
    setChoice(button.dataset.choice || selectedChoice, true);
    setWidgetOpen(false);
    updateBooking();
  });
});

choiceTabs.forEach((button) => {
  button.addEventListener("click", () => setChoice(button.dataset.choiceTab || "termin"));
});

openWidgetButtons.forEach((button) => {
  button.setAttribute("aria-controls", "whatsapp-widget");
  button.setAttribute("aria-expanded", "false");
  button.addEventListener("click", () => {
    const isOpen = whatsappPanel && whatsappPanel.classList.contains("is-open");
    setWidgetOpen(!isOpen);
  });
});

if (closeWidgetButton) {
  closeWidgetButton.addEventListener("click", () => setWidgetOpen(false));
}

serviceButtons.forEach((button) => {
  button.addEventListener("click", () => setService(button.dataset.service || ""));
});

durationButtons.forEach((button) => {
  button.addEventListener("click", () => setDuration(button.dataset.duration || ""));
});

[nameInput, bookingPhoneInput, timeInput, noteInput].forEach((input) => {
  if (input) input.addEventListener("input", updateBooking);
});

voucherValueButtons.forEach((button) => {
  button.addEventListener("click", () => setVoucherValue(button.dataset.voucherValue || ""));
});

voucherServiceButtons.forEach((button) => {
  button.addEventListener("click", () => setVoucherService(button.dataset.voucherService || ""));
});

[voucherRecipientInput, voucherBuyerInput, voucherPhoneInput, voucherNoteInput].forEach((input) => {
  if (input) input.addEventListener("input", updateVoucher);
});

function updateOpenStatus() {
  if (!openStatus) return;

  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours() + now.getMinutes() / 60;
  const isOpenDay = day >= 2 && day <= 6;
  const isOpen = isOpenDay && hour >= 9 && hour < 18;

  if (isOpen) {
    openStatus.textContent = "Heute geöffnet bis 18:00";
  } else if (day === 0 || day === 1) {
    openStatus.textContent = "Nächster Terminweg: Dienstag ab 09:00";
  } else if (hour < 9) {
    openStatus.textContent = "Heute ab 09:00 erreichbar";
  } else {
    openStatus.textContent = "Morgen ab 09:00 erreichbar";
  }
}

function updateFloatingWhatsapp() {
  if (!floatingWhatsapp) return;
  const isOpen = whatsappPanel && whatsappPanel.classList.contains("is-open");
  floatingWhatsapp.classList.toggle("is-visible", isOpen || window.scrollY > 360);
}

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

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setWidgetOpen(false);
    setMobileMenuOpen(false);
  }
});

window.addEventListener("scroll", updateFloatingWhatsapp, { passive: true });

setChoice("termin");
updateBooking();
setVoucherValue(selectedVoucherValue);
updateVoucher();
updateOpenStatus();
updateFloatingWhatsapp();
