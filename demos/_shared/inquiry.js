(() => {
  const sourceForm = document.querySelector(".inquiry-form");

  const getLeadStore = () => {
    try {
      return JSON.parse(localStorage.getItem("shkInquiryLeads") || "[]");
    } catch {
      return [];
    }
  };

  const saveLead = (lead) => {
    const leads = getLeadStore();
    leads.unshift(lead);
    localStorage.setItem("shkInquiryLeads", JSON.stringify(leads.slice(0, 50)));
  };

  const sendToWebhook = async (form, lead) => {
    const webhook = form.dataset.webhook;
    if (!webhook) return false;

    try {
      const response = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  const buildMail = (form, data) => {
    const mailto = form.dataset.mailto;
    const company = form.dataset.company || "Haustechnik";
    const subject = `Neue Anfrage: ${data.service || company}`;
    const body = [
      `Neue Anfrage ueber die Website fuer ${company}`,
      "",
      `Anliegen: ${data.service || "-"}`,
      `Projektart: ${data.scope || "-"}`,
      `Name: ${data.name || "-"}`,
      `Kontakt: ${data.contact || "-"}`,
      `Wunschdatum: ${data.appointmentDate || "-"}`,
      `Zeitfenster: ${data.appointmentTime || "-"}`,
      `Dringlichkeit / Hinweis: ${data.timing || "-"}`,
      "",
      "Kurzbeschreibung:",
      data.message || "-",
      "",
      "Hinweis: Diese Anfrage wurde automatisch ueber die Website aufgenommen.",
    ].join("\n");

    return `mailto:${mailto}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const serviceDescription = (value) => {
    const text = value.toLowerCase();
    if (text.includes("bad") || text.includes("sanitaer") || text.includes("sanit")) {
      return "Bad, Wasser, Armaturen oder Sanitaerprojekt";
    }
    if (text.includes("heizung") || text.includes("klima")) {
      return "Waerme, Raumklima oder technische Modernisierung";
    }
    if (text.includes("solar") || text.includes("energie")) {
      return "Energiecheck, Solar oder Effizienzthema";
    }
    if (text.includes("wartung") || text.includes("reparatur") || text.includes("abfluss")) {
      return "Schnelle Hilfe, Service oder Instandhaltung";
    }
    return "Passende Fachberatung fuer Ihr Anliegen";
  };

  const setActive = (buttons, activeButton) => {
    buttons.forEach((button) => {
      button.classList.toggle("is-selected", button === activeButton);
    });
  };

  const createChoiceField = ({ legend, choices, name, onPick }) => {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "choice-field";
    fieldset.innerHTML = `<legend>${legend}</legend><div class="choice-grid"></div>`;
    const grid = fieldset.querySelector(".choice-grid");

    choices.forEach((choice, index) => {
      const button = document.createElement("button");
      button.className = "choice-option";
      button.type = "button";
      button.dataset.value = choice.value;
      button.innerHTML = `
        <span class="choice-index">${String(index + 1).padStart(2, "0")}</span>
        <span class="choice-copy">
          <strong>${choice.label}</strong>
          <small>${choice.description}</small>
        </span>
      `;
      grid.appendChild(button);
    });

    const buttons = [...grid.querySelectorAll(".choice-option")];
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        setActive(buttons, button);
        onPick(button.dataset.value);
      });
    });

    if (name) fieldset.dataset.choiceName = name;
    return fieldset;
  };

  const addTimingChips = (form) => {
    const timing = form.querySelector('[name="timing"]');
    if (!timing || timing.dataset.chipsReady) return;
    timing.dataset.chipsReady = "true";

    const grid = document.createElement("div");
    grid.className = "quick-grid";
    ["So schnell wie moeglich", "Diese Woche", "Naechste 2 Wochen", "Flexibel"].forEach((value) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "quick-chip";
      chip.textContent = value;
      chip.addEventListener("click", () => {
        timing.value = value;
        setActive([...grid.querySelectorAll(".quick-chip")], chip);
      });
      grid.appendChild(chip);
    });

    timing.insertAdjacentElement("afterend", grid);
  };

  const addAppointmentTools = (form) => {
    const dateInput = form.querySelector('[name="appointmentDate"]');
    if (dateInput && !dateInput.min) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      dateInput.min = `${yyyy}-${mm}-${dd}`;
    }

    const timeSelect = form.querySelector('[name="appointmentTime"]');
    if (form.dataset.appointmentChips === "false") return;
    if (!timeSelect || timeSelect.dataset.chipsReady) return;
    timeSelect.dataset.chipsReady = "true";

    const choices = [...timeSelect.options]
      .filter((option) => option.value || option.textContent.trim())
      .filter((option) => option.value)
      .map((option) => option.textContent.trim());

    if (!choices.length) return;

    const grid = document.createElement("div");
    grid.className = "quick-grid appointment-slots";
    choices.forEach((value) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "quick-chip";
      chip.textContent = value;
      chip.addEventListener("click", () => {
        timeSelect.value = value;
        setActive([...grid.querySelectorAll(".quick-chip")], chip);
      });
      grid.appendChild(chip);
    });

    timeSelect.insertAdjacentElement("afterend", grid);
  };

  const addMessagePrompts = (form) => {
    const message = form.querySelector('[name="message"]');
    if (!message || message.dataset.promptsReady) return;
    message.dataset.promptsReady = "true";

    const grid = document.createElement("div");
    grid.className = "quick-grid";
    ["Bitte um Rueckruf", "Foto/Details folgen", "Vor-Ort-Termin gewuenscht"].forEach((value) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "quick-chip";
      chip.textContent = value;
      chip.addEventListener("click", () => {
        const separator = message.value.trim() ? " " : "";
        message.value = `${message.value.trim()}${separator}${value}.`;
        chip.classList.add("is-selected");
      });
      grid.appendChild(chip);
    });

    message.insertAdjacentElement("afterend", grid);
  };

  const decorateForm = (form) => {
    if (form.dataset.intakeReady) return;
    form.dataset.intakeReady = "true";
    form.classList.add("is-enhanced");

    if (form.dataset.intakeMode === "compact") {
      addAppointmentTools(form);
      return;
    }

    const select = form.querySelector('select[name="service"]');
    if (select) {
      select.required = false;
      select.classList.add("interactive-select-source");
      const label = select.closest("label");
      if (label) label.classList.add("is-native-select");

      const choices = [...select.options]
        .filter((option) => option.value)
        .map((option) => ({
          value: option.value,
          label: option.textContent,
          description: serviceDescription(option.textContent),
        }));

      const field = createChoiceField({
        legend: "Was soll gemacht werden?",
        choices,
        name: "service",
        onPick: (value) => {
          select.value = value;
        },
      });
      if (label) {
        label.insertAdjacentElement("beforebegin", field);
      }
    }

    const scopeInput = document.createElement("input");
    scopeInput.type = "hidden";
    scopeInput.name = "scope";
    form.prepend(scopeInput);

    const scopeField = createChoiceField({
      legend: "Welche Art von Projekt?",
      choices: [
        { value: "Erstberatung", label: "Erstberatung", description: "Kurz klaeren, was sinnvoll ist" },
        { value: "Modernisierung", label: "Modernisierung", description: "Bad, Anlage oder Technik erneuern" },
        { value: "Reparatur", label: "Reparatur", description: "Problem beschreiben und Hilfe anfragen" },
        { value: "Wartung", label: "Wartung", description: "Service oder Check vereinbaren" },
      ],
      name: "scope",
      onPick: (value) => {
        scopeInput.value = value;
      },
    });
    const serviceField = form.querySelector('[data-choice-name="service"]');
    if (serviceField) {
      serviceField.insertAdjacentElement("afterend", scopeField);
    } else {
      form.insertBefore(scopeField, form.children[1] || null);
    }

    addTimingChips(form);
    addAppointmentTools(form);
    addMessagePrompts(form);
  };

  const enhanceForm = (form) => {
    decorateForm(form);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      const company = form.dataset.company || "Haustechnik";
      const status = form.querySelector(".form-status");

      if (!data.service) {
        if (status) status.textContent = "Bitte waehlen Sie zuerst ein Anliegen aus.";
        return;
      }

      const lead = {
        id: Date.now(),
        company,
        createdAt: new Date().toISOString(),
        ...data,
      };

      saveLead(lead);
      const sentToWebhook = await sendToWebhook(form, lead);

      if (status) {
        status.textContent = sentToWebhook
          ? "Anfrage wurde automatisch aufgenommen."
          : "Anfrage aufgenommen. Ihr Mailprogramm oeffnet sich gleich.";
      }

      if (!sentToWebhook) {
        window.location.href = buildMail(form, data);
      }
    });

    return form;
  };

  if (!sourceForm) return;

  const modal = document.createElement("div");
  modal.className = "inquiry-modal";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="inquiry-modal-backdrop" data-close-inquiry></div>
    <div class="inquiry-modal-panel" role="dialog" aria-modal="true" aria-labelledby="inquiry-modal-title">
      <div class="inquiry-modal-top">
        <div>
          <h2 class="inquiry-modal-title" id="inquiry-modal-title">Schnellanfrage</h2>
          <p>Wunschtermin und Anliegen kurz eintragen. Die Anfrage wird vorbereitet.</p>
        </div>
        <button class="inquiry-close" type="button" aria-label="Anfrage schliessen" data-close-inquiry>x</button>
      </div>
      <p class="lead-confirmation">Anfrage wurde aufgenommen.</p>
    </div>
  `;

  const modalPanel = modal.querySelector(".inquiry-modal-panel");
  const modalForm = sourceForm.cloneNode(true);
  modalForm.reset();
  const modalStatus = modalForm.querySelector(".form-status");
  if (modalStatus) modalStatus.textContent = "";
  modalPanel.appendChild(modalForm);
  document.body.appendChild(modal);

  document.querySelectorAll(".inquiry-form").forEach(enhanceForm);

  const widgetButton = document.createElement("button");
  widgetButton.className = "inquiry-widget-button";
  widgetButton.type = "button";
  widgetButton.textContent = "Schnellanfrage";
  document.body.appendChild(widgetButton);

  const openModal = () => {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const firstInput = modalForm.querySelector("select, input, textarea, button");
    if (firstInput) firstInput.focus();
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    widgetButton.focus();
  };

  widgetButton.addEventListener("click", openModal);
  document.querySelectorAll(".open-inquiry-widget").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      openModal();
    });
  });
  modal.querySelectorAll("[data-close-inquiry]").forEach((button) => {
    button.addEventListener("click", closeModal);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
})();
