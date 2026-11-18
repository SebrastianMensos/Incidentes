"use strict";

const INITIAL_CENTER = [21.122, -101.68];
const INITIAL_ZOOM = 13;

const CATEGORY_CONFIG = {
  bache:     { label: "Bache",         color: "#d92d20" },
  alumbrado: { label: "Alumbrado",     color: "#f79009" },
  basura:    { label: "Basura",        color: "#667085" },
  fuga:      { label: "Fuga de agua",  color: "#1570ef" },
  accidente: { label: "Accidente",     color: "#7a5af8" },
  semaforo:  { label: "Semáforo",      color: "#12b76a" }
};

const DEFAULT_CATEGORY = { label: "Otro", color: "#000000" };

// Estados válidos: "pendiente" y "atendido" (los mismos del HTML)
let incidents = [
  {
    id: "INC-001",
    title: "Bache frente a la Universidad",
    category: "bache",
    description: "Bache profundo que dificulta el paso de los vehículos.",
    status: "pendiente",
    latitude: 21.1248,
    longitude: -101.6751,
    createdAt: "2026-01-16"
  },
  {
    id: "INC-002",
    title: "Luminaria apagada en Blvd. Adolfo López Mateos",
    category: "alumbrado",
    description: "Tres postes sin luz desde hace una semana, la avenida queda muy oscura por la noche.",
    status: "pendiente",
    latitude: 21.1189,
    longitude: -101.6802,
    createdAt: "2026-01-18"
  },
  {
    id: "INC-003",
    title: "Fuga de agua en calle Hidalgo",
    category: "fuga",
    description: "Fuga constante que escurre hacia la banqueta y forma encharcamiento.",
    status: "pendiente",
    latitude: 21.1305,
    longitude: -101.6694,
    createdAt: "2026-01-21"
  },
  {
    id: "INC-004",
    title: "Basura acumulada en el parque",
    category: "basura",
    description: "Bolsas de basura fuera de los contenedores desde el fin de semana.",
    status: "atendido",
    latitude: 21.1157,
    longitude: -101.6885,
    createdAt: "2026-01-23"
  },
  {
    id: "INC-005",
    title: "Semáforo descompuesto en cruce con Malecón",
    category: "semaforo",
    description: "El semáforo se queda en intermitente y provoca conflictos viales en hora pico.",
    status: "atendido",
    latitude: 21.1273,
    longitude: -101.6738,
    createdAt: "2026-01-25"
  },
  {
    id: "INC-006",
    title: "Accidente de tránsito en Av. Juárez",
    category: "accidente",
    description: "Un accidente de tránsito ocurrido en la avenida Juárez, causando congestión vial.",
    status: "pendiente",
    latitude: 21.1205,
    longitude: -101.6852,
    createdAt: "2026-01-27"
  },
  {
    id: "INC-007",
    title: "Accidente de tránsito en Av. Juárez",
    category: "accidente",
    description: "Un accidente de tránsito ocurrido en la avenida Juárez, causando congestión vial.",
    status: "pendiente",
    latitude: 21.115,
    longitude: -101.673,
    createdAt: "2026-01-27"
  }
];

// ===================== Referencias al DOM =====================
const incidentForm = document.getElementById("incident-form");
const incidentIdInput = document.getElementById("incident-id");
const titleInput = document.getElementById("title-input");
const categoryInput = document.getElementById("category-input");
const descriptionInput = document.getElementById("description-input");
const statusInput = document.getElementById("status-input");
const latitudeInput = document.getElementById("latitude-input");
const longitudeInput = document.getElementById("longitude-input");

const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const statusFilter = document.getElementById("status-filter");

const incidentsList = document.getElementById("incidents-list");
const emptyMessage = document.getElementById("empty-message");
const resultsCounter = document.getElementById("results-counter");

const statTotal = document.getElementById("stat-total");
const statPending = document.getElementById("stat-pending");
const statResolved = document.getElementById("stat-resolved");

const formTitle = document.getElementById("form-title");
const formModeBadge = document.getElementById("form-mode-badge");
const formMessage = document.getElementById("form-message");
const saveButton = document.getElementById("save-button");
const cancelButton = document.getElementById("cancel-button");

const fitMapButton = document.getElementById("btn-fit-map");
const coordinateIndicator = document.getElementById("coordinate-indicator");

// ===================== Inicialización del mapa =====================
const map = L.map("map", {
  center: INITIAL_CENTER,
  zoom: INITIAL_ZOOM,
  zoomControl: true
});

const streetLayer = L.tileLayer(
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
);

const humanitarianLayer = L.tileLayer(
  "https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/">HOT</a> hosted by <a href="https://openstreetmap.fr/">OSM France</a>'
  }
);

// Solo una capa base activa; la otra se elige desde el control de capas
streetLayer.addTo(map);

const incidentLayer = L.layerGroup().addTo(map);
const selectionLayer = L.layerGroup().addTo(map);

const baseLayers = {
  "Mapa de calles": streetLayer,
  "Mapa humanitario": humanitarianLayer
};

const overlays = {
  "Incidentes urbanos": incidentLayer,
  "Seleccion temporal": selectionLayer
};

L.control.layers(baseLayers, overlays, {
  collapsed: false,
  position: "topright"
}).addTo(map);

L.control.scale({
  imperial: false,
  position: "bottomright"
}).addTo(map);

const legend = L.control({
  position: "bottomleft"
});

legend.onAdd = function () {
  const container = L.DomUtil.create("div", "map-legend");

  let content = "<h4>Categorias</h4>";

  Object.entries(CATEGORY_CONFIG).forEach(([key, config]) => {
    content += `
      <div class="legend-item">
        <span class="legend-color" style="background: ${config.color}"></span>
        <span>${config.label}</span>
      </div>
    `;
  });

  container.innerHTML = content;

  return container;
};

legend.addTo(map);

map.on("click", function (event) {
  const latitude = Number(event.latlng.lat.toFixed(6));
  const longitude = Number(event.latlng.lng.toFixed(6));

  latitudeInput.value = latitude;
  longitudeInput.value = longitude;

  coordinateIndicator.textContent =
    `Coordenadas seleccionadas: ${latitude}, ${longitude}`;

  showTemporaryMarker(latitude, longitude);
});

function showTemporaryMarker(latitude, longitude) {
  selectionLayer.clearLayers();

  const temporaryMarker = L.marker(
    [latitude, longitude],
    {
      draggable: true
    }
  );

  temporaryMarker
    .bindPopup(
      `
      <strong>Ubicación seleccionada</strong><br>
      <br>
      Puedes arrastrar el marcador para ajustar la ubicación.
      `
    )
    .addTo(selectionLayer)
    .openPopup();

  temporaryMarker.on("dragend", function (event) {
    const position = event.target.getLatLng();

    const newLatitude = Number(position.lat.toFixed(6));
    const newLongitude = Number(position.lng.toFixed(6));

    latitudeInput.value = newLatitude;
    longitudeInput.value = newLongitude;

    coordinateIndicator.textContent =
      `Coordenadas seleccionadas: ${newLatitude}, ${newLongitude}`;
  });
}

// ===================== Filtros =====================
function getFilteredIncidents() {
  const searchText = normalizeText(searchInput.value);
  const selectCategory = categoryFilter.value;
  const selectedStatus = statusFilter.value;

  return incidents.filter(function (incident) {
    const searchableText = normalizeText(
      `${incident.title} ${incident.description} ${incident.category}`
    );

    const matchesSearch = searchableText.includes(searchText);

    const matchesCategory =
      selectCategory === "all" ||
      incident.category === selectCategory;

    const matchesStatus =
      selectedStatus === "all" ||
      incident.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });
}

function normalizeText(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

// ===================== Renderizado =====================
function renderAplication() {
  const filteredIncidents = getFilteredIncidents();

  renderMapincidents(filteredIncidents);
  renderIncidentList(filteredIncidents);
  renderStatistics();
  updateResultsCounter(filteredIncidents.length);
}

function renderMapincidents(data) {
  incidentLayer.clearLayers();

  data.forEach(function (incident) {
    const category = CATEGORY_CONFIG[incident.category] || DEFAULT_CATEGORY;

    const point = L.circleMarker(
      [incident.latitude, incident.longitude],
      {
        radius: 9,
        color: "#ffffff",
        weight: 2,
        fillColor: category.color,
        fillOpacity: 0.95
      }
    );

    point.bindTooltip(
      incident.title,
      {
        direction: "top",
        offset: [0, -8]
      }
    );

    point.bindPopup(
      createPopupContent(incident),
      {
        maxWidth: 280
      }
    );

    point.addTo(incidentLayer);
  });
}

function createPopupContent(incident) {
  const category = CATEGORY_CONFIG[incident.category] || DEFAULT_CATEGORY;

  const container = document.createElement("div");
  container.className = "popup-content";

  const title = document.createElement("h3");
  title.textContent = incident.title;

  const categoryParagraph = document.createElement("p");
  categoryParagraph.innerHTML =
    `<strong>Categoria:</strong> ${category.label}`;

  const statusParagraph = document.createElement("p");
  statusParagraph.innerHTML =
    `<strong>Estado:</strong> ${formatStatus(incident.status)}`;

  const descriptionParagraph = document.createElement("p");
  descriptionParagraph.textContent = incident.description;

  const coordinatesParagraph = document.createElement("p");
  coordinatesParagraph.className = "coordinates-text";
  coordinatesParagraph.textContent =
    `${incident.latitude}, ${incident.longitude}`;

  const actions = document.createElement("div");
  actions.className = "popup-actions";

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "button button-primary button-small";
  editButton.textContent = "Editar";

  editButton.addEventListener("click", function () {
    startEditingIncident(incident.id);
    map.closePopup();
  });

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "button button-primary button-small";
  deleteButton.textContent = "Eliminar";

  deleteButton.addEventListener("click", function () {
    deleteIncident(incident.id);
    map.closePopup();
  });

  actions.append(editButton, deleteButton);

  container.append(
    title,
    categoryParagraph,
    statusParagraph,
    descriptionParagraph,
    coordinatesParagraph,
    actions
  );

  return container;
}

function renderIncidentList(data) {
  incidentsList.innerHTML = "";

  emptyMessage.hidden = data.length !== 0;

  data.forEach(function (incident) {
    const category = CATEGORY_CONFIG[incident.category] || DEFAULT_CATEGORY;

    const card = document.createElement("article");
    card.className = "incident-card";
    card.style.setProperty("--incident-color", category.color);

    const header = document.createElement("div");
    header.className = "incidents-card-header";

    const title = document.createElement("h3");
    title.textContent = incident.title;

    const statusBadge = document.createElement("span");
    statusBadge.className =
      incident.status === "pendiente"
        ? "badge badge-pending"
        : "badge badge-resolved";

    statusBadge.textContent = formatStatus(incident.status);

    header.append(title, statusBadge);

    const description = document.createElement("p");
    description.className = "incident-description";
    description.textContent = incident.description;

    const meta = document.createElement("div");
    meta.className = "incident-meta";

    const categoryBadge = document.createElement("span");
    categoryBadge.className = "badge badge-category";
    categoryBadge.textContent = category.label;

    const coordinatesTag = document.createElement("span");
    coordinatesTag.className = "coordinates-text";
    coordinatesTag.textContent =
      `${incident.latitude}, ${incident.longitude}`;

    // (faltaba agregar estos elementos al contenedor meta)
    meta.append(categoryBadge, coordinatesTag);

    const actions = document.createElement("div");
    actions.className = "incident-actions";

    const locateButton = createActionButton(
      "Ver en mapa",
      "button button-secondary button-small",
      function () {
        focusIncident(incident);
      }
    );

    const editButton = createActionButton(
      "Editar",
      "button button-primary button-small",
      function () {
        startEditingIncident(incident.id);
      }
    );

    const deleteButton = createActionButton(
      "Eliminar",
      "button button-primary button-small",
      function () {
        deleteIncident(incident.id);
      }
    );

    actions.append(locateButton, editButton, deleteButton);

    card.append(header, description, meta, actions);

    incidentsList.appendChild(card);
  });
}

function createActionButton(text, className, handler) {
  const button = document.createElement("button");

  button.type = "button";
  button.textContent = text;
  button.className = className;

  button.addEventListener("click", handler);

  return button;
}

function focusIncident(incident) {
  map.flyTo(
    [incident.latitude, incident.longitude],
    17,
    {
      duration: 1.2
    }
  );

  showTemporaryMarker(incident.latitude, incident.longitude);

  coordinateIndicator.textContent =
    `Mostrando ahora: ${incident.title}`;
}

function renderStatistics() {
  const pending = incidents.filter(
    incident => incident.status === "pendiente"
  ).length;

  const resolved = incidents.filter(
    incident => incident.status === "atendido"
  ).length;

  statTotal.textContent = incidents.length;
  statPending.textContent = pending;
  statResolved.textContent = resolved;
}

function updateResultsCounter(total) {
  const word = total === 1 ? "resultado" : "resultados";

  resultsCounter.textContent = `${total} ${word}`;
}

// ===================== Formulario =====================
incidentForm.addEventListener("submit", function (event) {
  event.preventDefault();

  hideFormMessage();

  const formData = getFormData();
  const validationResult = validationIncident(formData);

  if (!validationResult.valid) {
    showFormMessage(validationResult.message, "error");
    return;
  }

  const editingId = incidentIdInput.value;

  if (editingId) {
    updateIncident(editingId, formData);
  } else {
    createIncident(formData);
  }
});

function getFormData() {
  return {
    title: titleInput.value.trim(),
    category: categoryInput.value,
    description: descriptionInput.value.trim(),
    status: statusInput.value,
    latitude: Number(latitudeInput.value),
    longitude: Number(longitudeInput.value)
  };
}

function validationIncident(data) {
  if (
    !data.title ||
    !data.category ||
    !data.description ||
    !data.status
  ) {
    return {
      valid: false,
      message: "Completa todos los campos obligatorios."
    };
  }

  if (
    latitudeInput.value === "" ||
    longitudeInput.value === "" ||
    !Number.isFinite(data.latitude) ||
    !Number.isFinite(data.longitude)
  ) {
    return {
      valid: false,
      message: "Selecciona coordenadas validas."
    };
  }

  if (data.latitude < -90 || data.latitude > 90) {
    return {
      valid: false,
      message: "La latitud debe estar entre -90 y 90."
    };
  }

  if (data.longitude < -180 || data.longitude > 180) {
    return {
      valid: false,
      message: "La longitud debe estar entre -180 y 180."
    };
  }

  return { valid: true };
}

// ===================== Funciones de la práctica =====================

// 2. Identificador con formato INC-XXXXXXXX-XXX
function generateIncidentId() {
  // Ultimos 8 digitos de Date.now()
  const timePart = String(Date.now()).slice(-8);

  // Numero aleatorio de 3 digitos (000 - 999)
  const randomPart = String(
    Math.floor(Math.random() * 1000)
  ).padStart(3, "0");

  return `INC-${timePart}-${randomPart}`;
}

// 3. Fecha actual en formato YYYY-MM-DD
function getCurrentDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// 1. Crear incidente
function createIncident(data) {
  const newIncident = {
    id: generateIncidentId(),
    title: data.title,
    category: data.category,
    description: data.description,
    status: data.status,
    latitude: data.latitude,
    longitude: data.longitude,
    createdAt: getCurrentDate()
  };

  incidents.push(newIncident);

  renderAplication();
  resetForm();
  showFormMessage("Incidente registrado correctamente.", "success");
  focusIncident(newIncident);
}

// 4. Iniciar edición
function startEditingIncident(id) {
  const incident = incidents.find(function (item) {
    return item.id === id;
  });

  if (!incident) {
    return;
  }

  hideFormMessage();

  incidentIdInput.value = incident.id;
  titleInput.value = incident.title;
  categoryInput.value = incident.category;
  descriptionInput.value = incident.description;
  statusInput.value = incident.status;
  latitudeInput.value = incident.latitude;
  longitudeInput.value = incident.longitude;

  formTitle.textContent = "Editar incidente";
  formModeBadge.textContent = "Editando";
  formModeBadge.classList.add("editing");
  saveButton.textContent = "Actualizar Incidente";
  cancelButton.hidden = false;

  focusIncident(incident);

  incidentForm.scrollIntoView({ behavior: "smooth" });
}

// 5. Actualizar incidente
function updateIncident(id, changes) {
  const incident = incidents.find(function (item) {
    return item.id === id;
  });

  if (!incident) {
    return;
  }

  incident.title = changes.title;
  incident.category = changes.category;
  incident.description = changes.description;
  incident.status = changes.status;
  incident.latitude = changes.latitude;
  incident.longitude = changes.longitude;

  renderAplication();
  resetForm();
  showFormMessage("Incidente actualizado correctamente.", "success");
  focusIncident(incident);
}

// 6. Eliminar incidente
function deleteIncident(id) {
  const incident = incidents.find(function (item) {
    return item.id === id;
  });

  if (!incident) {
    return;
  }

  const confirmed = confirm(
    `¿Deseas eliminar el incidente "${incident.title}"?`
  );

  if (!confirmed) {
    return;
  }

  incidents = incidents.filter(function (item) {
    return item.id !== id;
  });

  renderAplication();
  resetForm();
  showFormMessage("Incidente eliminado correctamente.", "success");
}

// ===================== Funciones auxiliares =====================
function resetForm() {
  incidentForm.reset();
  incidentIdInput.value = "";

  formTitle.textContent = "Registrar incidente";
  formModeBadge.textContent = "Nuevo";
  formModeBadge.classList.remove("editing");
  saveButton.textContent = "Guardar Incidente";
  cancelButton.hidden = true;

  selectionLayer.clearLayers();
  coordinateIndicator.textContent =
    "Haz clic en el mapa para seleccionar las coordenadas.";
}

function showFormMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
  formMessage.hidden = false;
}

function hideFormMessage() {
  formMessage.textContent = "";
  formMessage.className = "form-message";
  formMessage.hidden = true;
}

function formatStatus(status) {
  if (status === "pendiente") {
    return "Pendiente";
  }

  if (status === "atendido") {
    return "Atendido";
  }

  return status;
}

// ===================== Eventos =====================
cancelButton.addEventListener("click", function (event) {
  event.preventDefault();
  resetForm();
  hideFormMessage();
});

searchInput.addEventListener("input", renderAplication);
categoryFilter.addEventListener("change", renderAplication);
statusFilter.addEventListener("change", renderAplication);

fitMapButton.addEventListener("click", function () {
  if (incidents.length === 0) {
    map.setView(INITIAL_CENTER, INITIAL_ZOOM);
    return;
  }

  const bounds = L.latLngBounds(
    incidents.map(function (incident) {
      return [incident.latitude, incident.longitude];
    })
  );

  map.fitBounds(bounds, { padding: [40, 40] });
});

// Arranque
resetForm();
renderAplication();