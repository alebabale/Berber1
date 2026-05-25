const openRequestButtons = [...document.querySelectorAll("[data-open-request]")];
const serviceButtons = [...document.querySelectorAll("[data-service]")];
const staffButtons = [...document.querySelectorAll("[data-staff]")];
const requestSection = document.querySelector("#termin");
const floatingRequest = document.querySelector(".floating-request");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");
const nameInput = document.querySelector("#customerName");
const phoneInput = document.querySelector("#customerPhone");
const timeInput = document.querySelector("#preferredTime");
const noteInput = document.querySelector("#customerNote");
const summary = document.querySelector("#requestSummary");
const whatsappButton = document.querySelector("#whatsappRequest");

let selectedService = "";
let selectedStaff = "";

function setService(service) {
  selectedService = service || "";
  serviceButtons.forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.service === selectedService);
  });
  updateSummary();
}

function setStaff(staff) {
  selectedStaff = staff || "";
  staffButtons.forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.staff === selectedStaff);
  });
  updateSummary();
}

function buildRequestText() {
  const parts = ["Hallo Frau Mielke,", "", "ich möchte gerne einen Termin anfragen:"];
  if (nameInput && nameInput.value.trim()) parts.push(`Name: ${nameInput.value.trim()}.`);
  if (phoneInput && phoneInput.value.trim()) parts.push(`Rückrufnummer: ${phoneInput.value.trim()}.`);
  if (selectedService) parts.push(`Leistung: ${selectedService}.`);
  if (selectedStaff) parts.push(`Terminart: ${selectedStaff}.`);
  if (timeInput && timeInput.value.trim()) parts.push(`Wunschzeit: ${timeInput.value.trim()}.`);
  if (noteInput && noteInput.value.trim()) parts.push(`Hinweis: ${noteInput.value.trim()}.`);
  parts.push("", "Bitte um kurze Rückmeldung, ob ein Termin möglich ist.");
  return parts.join("\n");
}

function updateSummary() {
  if (!summary) return;
  const serviceText = selectedService || "Leistung noch nicht gewählt";
  const staffText = selectedStaff || "Terminart offen";
  const timeText = timeInput && timeInput.value.trim() ? timeInput.value.trim() : "Wunschzeit noch offen";
  const noteText = noteInput && noteInput.value.trim() ? noteInput.value.trim() : "Hinweis optional";
  summary.textContent = `${serviceText} | ${staffText} | ${timeText} | ${noteText}`;
}

function openWhatsappRequest() {
  const text = buildRequestText();
  const whatsappUrl = `https://wa.me/4917621069734?text=${encodeURIComponent(text)}`;
  window.open(whatsappUrl, "_blank", "noopener");
}

openRequestButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    if (button.dataset.presetService) setService(button.dataset.presetService);
    if (requestSection) requestSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

serviceButtons.forEach((button) => {
  button.addEventListener("click", () => setService(button.dataset.service || ""));
});

staffButtons.forEach((button) => {
  button.addEventListener("click", () => setStaff(button.dataset.staff || ""));
});

[nameInput, phoneInput, timeInput, noteInput].forEach((input) => {
  if (input) input.addEventListener("input", updateSummary);
});

if (whatsappButton) {
  whatsappButton.addEventListener("click", openWhatsappRequest);
}

function updateFloatingRequest() {
  if (!floatingRequest) return;
  floatingRequest.classList.toggle("is-visible", window.scrollY > 360);
}

function setMenuOpen(isOpen) {
  if (!menuToggle || !mobileMenu) return;
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  mobileMenu.classList.toggle("is-open", isOpen);
}

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    setMenuOpen(!mobileMenu.classList.contains("is-open"));
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenuOpen(false);
});

window.addEventListener("scroll", updateFloatingRequest, { passive: true });

updateSummary();
updateFloatingRequest();
