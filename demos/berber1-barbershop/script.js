const baseWhatsapp =
  "https://wa.me/4971429189666?text=Hallo%20Berber1%2C%20ich%20m%C3%B6chte%20einen%20Termin%20anfragen";

const buttons = [...document.querySelectorAll("[data-service]")];
const staffButtons = [...document.querySelectorAll("[data-staff]")];
const noteInput = document.querySelector("#bookingNote");
const phoneInput = document.querySelector("#bookingPhone");
const whatsappButton = document.querySelector("#bookingWhatsapp");
let selectedService = "";
let selectedStaff = "";

function updateWhatsappLink() {
  if (!whatsappButton) return;

  const parts = ["Hallo Berber1, ich m\u00f6chte einen Termin anfragen."];
  if (selectedService) parts.push(`Leistung: ${selectedService}.`);
  if (selectedStaff) parts.push(`Mitarbeiter: ${selectedStaff}.`);
  if (noteInput && noteInput.value.trim()) {
    parts.push(`Wunschtermin/Hinweis: ${noteInput.value.trim()}.`);
  }
  if (phoneInput && phoneInput.value.trim()) {
    parts.push(`R\u00fcckrufnummer: ${phoneInput.value.trim()}.`);
  }

  whatsappButton.href = `https://wa.me/4971429189666?text=${encodeURIComponent(parts.join(" "))}`;
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedService = button.dataset.service || "";
    buttons.forEach((item) => item.classList.toggle("is-selected", item === button));
    updateWhatsappLink();
  });
});

staffButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedStaff = button.dataset.staff || "";
    staffButtons.forEach((item) => item.classList.toggle("is-selected", item === button));
    updateWhatsappLink();
  });
});

if (noteInput) {
  noteInput.addEventListener("input", updateWhatsappLink);
}

if (phoneInput) {
  phoneInput.addEventListener("input", updateWhatsappLink);
}

updateWhatsappLink();

const panel = document.querySelector("#whatsapp-widget");
const openWidgetButtons = [...document.querySelectorAll("[data-open-widget]")];
const closeWidgetButton = document.querySelector("[data-close-widget]");
const floatingWhatsapp = document.querySelector(".floating-whatsapp");
const mobileSectionToggle = document.querySelector(".mobile-section-toggle");
const mobileSectionMenu = document.querySelector(".mobile-section-menu");
const widgetServiceButtons = [...document.querySelectorAll("[data-widget-service]")];
const widgetTimeButtons = [...document.querySelectorAll("[data-widget-time]")];
const widgetNameInput = document.querySelector("#widgetName");
const widgetPhoneInput = document.querySelector("#widgetPhone");
const widgetTimeInput = document.querySelector("#widgetTime");
const widgetWhatsapp = document.querySelector("#widgetWhatsapp");

let widgetService = "";
let widgetTime = "";

function setPanelOpen(isOpen) {
  if (!panel) return;
  panel.classList.toggle("is-open", isOpen);
  panel.setAttribute("aria-hidden", String(!isOpen));
}

function updateWidgetWhatsapp() {
  if (!widgetWhatsapp) return;

  const customTime = widgetTimeInput && widgetTimeInput.value.trim();
  const time = customTime || widgetTime;
  const name = widgetNameInput && widgetNameInput.value.trim();
  const phone = widgetPhoneInput && widgetPhoneInput.value.trim();
  const parts = ["Hallo Berber1, ich m\u00f6chte eine Terminanfrage senden."];
  if (name) parts.push(`Name: ${name}.`);
  if (widgetService) parts.push(`Leistung: ${widgetService}.`);
  if (time) parts.push(`Wunschzeit/Hinweis: ${time}.`);
  if (phone) parts.push(`R\u00fcckrufnummer: ${phone}.`);
  parts.push("Bitte kurz best\u00e4tigen oder einen passenden Planity-Termin vorschlagen.");

  widgetWhatsapp.href = `https://wa.me/4971429189666?text=${encodeURIComponent(parts.join(" "))}`;
}

openWidgetButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    const isOpen = panel && panel.classList.contains("is-open");
    if (button.dataset.presetTime) {
      widgetTime = button.dataset.presetTime;
      if (widgetTimeInput) widgetTimeInput.value = "";
      widgetTimeButtons.forEach((item) => {
        item.classList.toggle("is-selected", item.dataset.widgetTime === widgetTime);
      });
      updateWidgetWhatsapp();
    } else if (isOpen) {
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
    widgetService = button.dataset.widgetService || "";
    widgetServiceButtons.forEach((item) => item.classList.toggle("is-selected", item === button));
    updateWidgetWhatsapp();
  });
});

widgetTimeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    widgetTime = button.dataset.widgetTime || "";
    widgetTimeButtons.forEach((item) => item.classList.toggle("is-selected", item === button));
    if (widgetTimeInput) widgetTimeInput.value = "";
    updateWidgetWhatsapp();
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

updateWidgetWhatsapp();

function updateFloatingWhatsapp() {
  if (!floatingWhatsapp) return;

  floatingWhatsapp.classList.toggle("is-visible", window.scrollY > 360);
}

window.addEventListener("scroll", updateFloatingWhatsapp, { passive: true });
updateFloatingWhatsapp();

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

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMobileMenuOpen(false);
  });
}

const gallery = document.querySelector("[data-gallery]");
const slides = gallery ? [...gallery.querySelectorAll(".gallery-slide")] : [];
const prevGalleryButton = document.querySelector("[data-gallery-prev]");
const nextGalleryButton = document.querySelector("[data-gallery-next]");
const galleryCounter = document.querySelector("#galleryCounter");
let activeSlide = 0;

function showGallerySlide(index) {
  if (!slides.length) return;

  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === activeSlide);
  });
  if (galleryCounter) galleryCounter.textContent = `${activeSlide + 1} / ${slides.length}`;
}

if (prevGalleryButton) {
  prevGalleryButton.addEventListener("click", () => showGallerySlide(activeSlide - 1));
}

if (nextGalleryButton) {
  nextGalleryButton.addEventListener("click", () => showGallerySlide(activeSlide + 1));
}

showGallerySlide(0);

const reelCards = [...document.querySelectorAll(".reel-card")];
const desktopReelQuery = window.matchMedia("(min-width: 760px)");
let activeReel = 0;
let reelTimer;

function setPlayingReel(cardToPlay) {
  reelCards.forEach((card) => {
    card.classList.toggle("is-playing", card === cardToPlay);
  });
}

function restartReel(card) {
  if (!card) return;

  card.classList.remove("is-playing");
  void card.offsetWidth;
  setPlayingReel(card);
}

function isFullyVisible(element) {
  const rect = element.getBoundingClientRect();
  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth;
}

function updateMobileReels() {
  if (desktopReelQuery.matches) return;

  const visibleCard = reelCards.find(isFullyVisible);
  setPlayingReel(visibleCard || null);
}

function startDesktopReels() {
  window.clearInterval(reelTimer);
  if (!reelCards.length || !desktopReelQuery.matches) return;

  restartReel(reelCards[activeReel]);
  reelTimer = window.setInterval(() => {
    activeReel = (activeReel + 1) % reelCards.length;
    restartReel(reelCards[activeReel]);
  }, 5000);
}

function setupReelPlayback() {
  window.clearInterval(reelTimer);

  if (desktopReelQuery.matches) {
    startDesktopReels();
  } else {
    setPlayingReel(null);
    updateMobileReels();
  }
}

reelCards.forEach((card, index) => {
  card.addEventListener("mouseenter", () => {
    if (!desktopReelQuery.matches) return;
    activeReel = index;
    restartReel(card);
  });
});

window.addEventListener("scroll", updateMobileReels, { passive: true });
window.addEventListener("resize", setupReelPlayback);

if (desktopReelQuery.addEventListener) {
  desktopReelQuery.addEventListener("change", setupReelPlayback);
}

setupReelPlayback();
