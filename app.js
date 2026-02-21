const ALLOW_EDIT_MODE = true;
const EDITOR_PASSCODE = "change-this-passcode";
const STORAGE_KEY = "journey_map_resume_entries_v4";

const CATEGORY_COLORS = {
  education: "#5ca6f8",
  work: "#35c88b",
  personal: "#ff9a62",
  life: "#ff8c3a",
  project: "#a587f8",
  general: "#a6b7cc",
};

const defaultEntries = [
  {
    id: crypto.randomUUID(),
    title: "Service Industry Roles (Denver)",
    startDate: "2014-02-01",
    endDate: "2016-08-31",
    category: "Work",
    location: "Denver",
    country: "United States",
    locationDetail: "Downtown Denver (service roles cluster)",
    lat: 39.739236,
    lng: -104.990251,
    description: "Built customer service, retention, and team coordination foundations in fast-paced service roles.",
    overlapGroup: "Service-MultiState",
  },
  {
    id: crypto.randomUUID(),
    title: "Service Industry Roles (Miami)",
    startDate: "2016-09-01",
    endDate: "2018-08-31",
    category: "Work",
    location: "Miami",
    country: "United States",
    locationDetail: "Downtown Miami (service roles cluster)",
    lat: 25.761681,
    lng: -80.191788,
    description: "Expanded operational range across hospitality and small-business customer experience roles.",
    overlapGroup: "Service-MultiState",
  },
  {
    id: crypto.randomUUID(),
    title: "NYU Gallatin BA",
    startDate: "2018-08-01",
    endDate: "2023-08-01",
    category: "Education",
    location: "New York City",
    country: "United States",
    locationDetail: "NYU Gallatin School, 1 Washington Place",
    lat: 40.72927,
    lng: -73.99417,
    description: "Completed BA in individualized study on business of emerging technology for new media with a Bioethics minor.",
    overlapGroup: "NYC-Education-Track",
  },
  {
    id: crypto.randomUUID(),
    title: "Service Industry Roles (New York)",
    startDate: "2018-09-01",
    endDate: "2022-12-31",
    category: "Work",
    location: "New York City",
    country: "United States",
    locationDetail: "Manhattan + Brooklyn hospitality corridor",
    lat: 40.712776,
    lng: -74.005974,
    description: "Developed high-pressure execution, customer retention, and team reliability across service positions.",
    overlapGroup: "Service-MultiState",
  },
  {
    id: crypto.randomUUID(),
    title: "Birmingham Fencing Club (Period 1)",
    startDate: "2023-08-01",
    endDate: "2024-08-31",
    category: "Work",
    location: "Birmingham",
    country: "United States",
    locationDetail: "Birmingham Fencing Club, Alabama",
    lat: 33.518589,
    lng: -86.810356,
    description: "Led social strategy and athlete development, driving membership growth and consistent training outcomes.",
    overlapGroup: "BHM-Coach-Leadership",
  },
  {
    id: crypto.randomUUID(),
    title: "NYU Tisch MPS (Virtual Production)",
    startDate: "2023-09-01",
    endDate: "2025-05-01",
    category: "Education",
    location: "Brooklyn",
    country: "United States",
    locationDetail: "NYU Tisch / Scorsese Institute (NYC campus)",
    lat: 40.72935,
    lng: -73.99254,
    description: "Completed MPS in Virtual Production at NYU Tisch School of the Arts (Scorsese Institute), GPA 3.9.",
    overlapGroup: "NYC-Education-Track",
  },
  {
    id: crypto.randomUUID(),
    title: "NYU Graduate Thesis Film",
    startDate: "2024-08-01",
    endDate: "2025-05-31",
    category: "Project",
    location: "Brooklyn",
    country: "United States",
    locationDetail: "Brooklyn production sites",
    lat: 40.70039,
    lng: -73.97211,
    description: "Managed a 30-person production team, shaped creative strategy, and raised $25K crowdfunding.",
    overlapGroup: "NYC-Production-Arc",
  },
  {
    id: crypto.randomUUID(),
    title: "Ride The Dice - Love Crushed Velvet",
    startDate: "2024-03-01",
    endDate: "2024-11-30",
    category: "Project",
    location: "Brooklyn",
    country: "United States",
    locationDetail: "Brooklyn music video concept production",
    lat: 40.70039,
    lng: -73.97211,
    description: "Creative strategist for an immersive multi-viewer music video concept.",
    overlapGroup: "NYC-Production-Arc",
  },
  {
    id: crypto.randomUUID(),
    title: "GUM Studios",
    startDate: "2025-03-01",
    endDate: "2025-07-31",
    category: "Work",
    location: "Brooklyn",
    country: "United States",
    locationDetail: "GUM Studios (Brooklyn)",
    lat: 40.651873,
    lng: -74.006142,
    description: "Directed full-cycle content production and social strategy, integrating AI + virtual production workflows and cutting research/search time by up to 90%.",
    overlapGroup: "NYC-2025-Creative",
  },
  {
    id: crypto.randomUUID(),
    title: "Double Eye Studios (Remote)",
    startDate: "2025-06-01",
    endDate: null,
    category: "Work",
    location: "New York City",
    country: "United States",
    locationDetail: "Remote role anchored in NYC",
    lat: 40.712776,
    lng: -74.005974,
    description: "Created and executed data-informed content plans, automated publishing workflows (about 30% faster production), and delivered executive-facing competitor insights.",
    overlapGroup: "NYC-2025-Creative",
  },
  {
    id: crypto.randomUUID(),
    title: "Birmingham Fencing Club (Period 2)",
    startDate: "2025-08-01",
    endDate: null,
    category: "Work",
    location: "Birmingham",
    country: "United States",
    locationDetail: "Birmingham Fencing Club, Alabama",
    lat: 33.518589,
    lng: -86.810356,
    description: "Returned as strategy coach and marketing lead, continuing athlete progress systems and growth initiatives.",
    overlapGroup: "BHM-Coach-Leadership",
  },
  {
    id: crypto.randomUUID(),
    title: "SPOTS",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    category: "Project",
    location: "Brooklyn",
    country: "United States",
    locationDetail: "Brooklyn product prototyping base",
    lat: 40.70039,
    lng: -73.97211,
    description: "Built a peer-to-peer AI location discovery prototype and designed preference-driven recommendation flow.",
    overlapGroup: "NYC-2025-Creative",
  },
];

let entries = loadEntries();
let selectedId = null;
let editorUnlocked = false;
let pickMode = false;
let isPlaying = false;
let playbackTimer = null;
let drawerOpen = false;

const timelineEl = document.getElementById("timeline");
const detailDrawerEl = document.getElementById("detailDrawer");
const closeDrawerBtn = document.getElementById("closeDrawerBtn");
const focusCardEl = document.getElementById("focusCard");
const legendEl = document.getElementById("legend");
const filterPanelEl = document.getElementById("filterPanel");

const yearFilterEl = document.getElementById("yearFilter");
const categoryFilterEl = document.getElementById("categoryFilter");
const fitAllBtn = document.getElementById("fitAllBtn");
const totalStepsEl = document.getElementById("totalSteps");
const yearSpanEl = document.getElementById("yearSpan");
const countryCountEl = document.getElementById("countryCount");

const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");
const speedSelect = document.getElementById("speedSelect");
const progressRange = document.getElementById("progressRange");

const editorEl = document.getElementById("editor");
const unlockBtn = document.getElementById("unlockBtn");
const exportBtn = document.getElementById("exportBtn");
const templateBtn = document.getElementById("templateBtn");
const resetDataBtn = document.getElementById("resetDataBtn");
const importInput = document.getElementById("importInput");
const editorListEl = document.getElementById("editorList");
const pickModeBtn = document.getElementById("pickModeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const form = document.getElementById("entryForm");
const entryIdEl = document.getElementById("entryId");
const titleEl = document.getElementById("title");
const startDateEl = document.getElementById("startDate");
const endDateEl = document.getElementById("endDate");
const categoryEl = document.getElementById("category");
const locationEl = document.getElementById("location");
const countryEl = document.getElementById("country");
const locationDetailEl = document.getElementById("locationDetail");
const overlapGroupEl = document.getElementById("overlapGroup");
const placeQueryEl = document.getElementById("placeQuery");
const findPlaceBtn = document.getElementById("findPlaceBtn");
const reverseCoordsBtn = document.getElementById("reverseCoordsBtn");
const placeStatusEl = document.getElementById("placeStatus");
const latEl = document.getElementById("lat");
const lngEl = document.getElementById("lng");
const descriptionEl = document.getElementById("description");
const resetFormBtn = document.getElementById("resetFormBtn");

const map = L.map("map", { worldCopyJump: true, zoomControl: true, minZoom: 2 }).setView([20, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

let markerLayers = [];
let routeLayer = null;
let activeRouteLayer = null;
let precisionMarker = null;

function isMobileDevice() {
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const narrowViewport = window.matchMedia("(max-width: 820px)").matches;
  return coarsePointer || narrowViewport;
}

function applyResponsiveMode() {
  const mobile = isMobileDevice();
  document.body.classList.toggle("is-mobile", mobile);
  document.body.classList.toggle("is-desktop", !mobile);

  if (filterPanelEl) {
    filterPanelEl.open = !mobile;
  }
}

function setDrawerOpen(open) {
  drawerOpen = open;
  if (!detailDrawerEl) return;
  detailDrawerEl.classList.toggle("hidden", !open);
}

function parseDate(dateString) {
  return new Date(`${dateString}T00:00:00`);
}

function getStartDate(entry) {
  return entry.startDate || entry.date;
}

function getEndDate(entry) {
  return entry.endDate || getStartDate(entry);
}

function dateRangeLabel(entry) {
  const start = getStartDate(entry);
  const end = entry.endDate;
  if (!start) return "No date";
  if (!end) return `${start} - Present`;
  if (start === end) return start;
  return `${start} - ${end}`;
}

function setPlaceStatus(message, isError = false) {
  if (!placeStatusEl) return;
  placeStatusEl.textContent = message;
  placeStatusEl.style.color = isError ? "#b53b2a" : "";
}

function currentCoordsFromForm() {
  const lat = Number(latEl.value);
  const lng = Number(lngEl.value);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return { lat, lng };
}

function removePrecisionMarker() {
  if (!precisionMarker) return;
  map.removeLayer(precisionMarker);
  precisionMarker = null;
}

function syncPrecisionMarker() {
  if (!editorUnlocked) {
    removePrecisionMarker();
    return;
  }

  const coords = currentCoordsFromForm();
  if (!coords) {
    removePrecisionMarker();
    return;
  }

  if (!precisionMarker) {
    precisionMarker = L.marker([coords.lat, coords.lng], { draggable: true, opacity: 0.92 }).addTo(map);
    precisionMarker.on("dragend", () => {
      const updated = precisionMarker.getLatLng();
      latEl.value = updated.lat.toFixed(6);
      lngEl.value = updated.lng.toFixed(6);
      setPlaceStatus(`Pin moved: ${updated.lat.toFixed(6)}, ${updated.lng.toFixed(6)}`);
    });
  } else {
    precisionMarker.setLatLng([coords.lat, coords.lng]);
  }
}

function normalizeCategory(category) {
  return (category || "general").toLowerCase().trim() || "general";
}

function colorForCategory(category) {
  return CATEGORY_COLORS[normalizeCategory(category)] || CATEGORY_COLORS.general;
}

function cityCountry(entry) {
  return entry.country ? `${entry.location}, ${entry.country}` : entry.location;
}

function locationLabel(entry) {
  if (entry.locationDetail) return `${entry.locationDetail} (${cityCountry(entry)})`;
  return cityCountry(entry);
}

function overlapsYear(entry, year) {
  const start = parseDate(getStartDate(entry));
  const end = parseDate(getEndDate(entry));
  const yearStart = new Date(`${year}-01-01T00:00:00`);
  const yearEnd = new Date(`${year}-12-31T23:59:59`);
  return start <= yearEnd && end >= yearStart;
}

function sortedEntries(items = entries) {
  return [...items].sort((a, b) => {
    const startA = parseDate(getStartDate(a));
    const startB = parseDate(getStartDate(b));
    if (startA.getTime() !== startB.getTime()) return startA - startB;
    return (a.title || "").localeCompare(b.title || "");
  });
}

function selectedYear() {
  return yearFilterEl.value === "all" ? null : Number(yearFilterEl.value);
}

function selectedCategory() {
  return categoryFilterEl.value === "all" ? null : categoryFilterEl.value;
}

function visibleEntries() {
  const year = selectedYear();
  const category = selectedCategory();
  return sortedEntries().filter((entry) => {
    const yearMatch = !year || overlapsYear(entry, year);
    const categoryMatch = !category || normalizeCategory(entry.category) === category;
    return yearMatch && categoryMatch;
  });
}

function ensureSelection() {
  const visible = visibleEntries();
  if (!visible.length) {
    selectedId = null;
    return;
  }
  if (!visible.some((entry) => entry.id === selectedId)) selectedId = visible[0].id;
}

function selectedVisibleIndex() {
  return visibleEntries().findIndex((entry) => entry.id === selectedId);
}

function renderMeta() {
  const sorted = sortedEntries();
  totalStepsEl.textContent = String(sorted.length);
  if (!sorted.length) {
    yearSpanEl.textContent = "-";
    countryCountEl.textContent = "0";
    return;
  }

  const years = sorted.flatMap((entry) => {
    const startYear = parseDate(getStartDate(entry)).getFullYear();
    const endYear = parseDate(getEndDate(entry)).getFullYear();
    const result = [];
    for (let year = startYear; year <= endYear; year += 1) result.push(year);
    return result;
  });

  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  yearSpanEl.textContent = minYear === maxYear ? String(minYear) : `${minYear}-${maxYear}`;

  const countries = new Set(sorted.map((entry) => (entry.country || "Unknown").toLowerCase()));
  countryCountEl.textContent = String(countries.size);
}

function renderYearFilter() {
  const previous = yearFilterEl.value;
  const yearSet = new Set();
  entries.forEach((entry) => {
    const startYear = parseDate(getStartDate(entry)).getFullYear();
    const endYear = parseDate(getEndDate(entry)).getFullYear();
    for (let year = startYear; year <= endYear; year += 1) yearSet.add(year);
  });
  const years = [...yearSet].sort((a, b) => a - b);

  yearFilterEl.innerHTML = '<option value="all">All</option>';
  years.forEach((year) => {
    const option = document.createElement("option");
    option.value = String(year);
    option.textContent = String(year);
    yearFilterEl.appendChild(option);
  });

  yearFilterEl.value = years.includes(Number(previous)) ? previous : "all";
}

function renderCategoryFilter() {
  const previous = categoryFilterEl.value;
  const categories = [...new Set(entries.map((entry) => normalizeCategory(entry.category)))].sort();
  categoryFilterEl.innerHTML = '<option value="all">All</option>';

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    categoryFilterEl.appendChild(option);
  });

  categoryFilterEl.value = categories.includes(previous) ? previous : "all";
}

function renderLegend() {
  legendEl.innerHTML = "";
  const categories = [...new Set(entries.map((entry) => normalizeCategory(entry.category)))].sort();

  categories.forEach((category) => {
    const chip = document.createElement("div");
    chip.className = "legend-chip";
    chip.innerHTML = `<span style="background:${colorForCategory(category)}"></span>${category.charAt(0).toUpperCase()}${category.slice(1)}`;
    legendEl.appendChild(chip);
  });
}

function buildStepIcon(stepNumber, entry, isActive) {
  return L.divIcon({
    className: "step-pin",
    html: `<div class="step-icon ${isActive ? "active" : "inactive"}" style="background:${colorForCategory(entry.category)};">${stepNumber}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

function offsetMarker(entry, duplicateIndex, duplicateTotal) {
  if (duplicateTotal <= 1) return [entry.lat, entry.lng];
  const angle = (Math.PI * 2 * duplicateIndex) / duplicateTotal;
  const radius = 0.38;
  return [entry.lat + Math.sin(angle) * radius, entry.lng + Math.cos(angle) * radius];
}

function clearMapLayers() {
  markerLayers.forEach((layer) => map.removeLayer(layer));
  markerLayers = [];

  [routeLayer, activeRouteLayer].forEach((layer) => {
    if (layer) map.removeLayer(layer);
  });
  routeLayer = null;
  activeRouteLayer = null;
}

function renderMap() {
  clearMapLayers();
  const visible = visibleEntries();
  if (!visible.length) return;

  const coords = visible.map((entry) => [Number(entry.lat), Number(entry.lng)]);

  routeLayer = L.polyline(coords, {
    color: "#95a9c2",
    weight: 2,
    opacity: 0.55,
    dashArray: "8 8",
  }).addTo(map);

  const selectedIndex = selectedVisibleIndex();
  const selectedPath = selectedIndex >= 0 ? coords.slice(0, selectedIndex + 1) : [];
  if (selectedPath.length > 1) {
    activeRouteLayer = L.polyline(selectedPath, {
      color: "#2f89ff",
      weight: 4,
      opacity: 0.95,
    }).addTo(map);
  }

  const countByCoord = new Map();
  visible.forEach((entry) => {
    const key = `${entry.lat.toFixed(3)}:${entry.lng.toFixed(3)}`;
    countByCoord.set(key, (countByCoord.get(key) || 0) + 1);
  });

  const usedByCoord = new Map();
  visible.forEach((entry, index) => {
    const key = `${entry.lat.toFixed(3)}:${entry.lng.toFixed(3)}`;
    const used = usedByCoord.get(key) || 0;
    const total = countByCoord.get(key) || 1;
    const [lat, lng] = offsetMarker(entry, used, total);
    usedByCoord.set(key, used + 1);

    const marker = L.marker([lat, lng], {
      icon: buildStepIcon(index + 1, entry, entry.id === selectedId),
      title: `${entry.title} (${locationLabel(entry)})`,
    }).addTo(map);

    marker.bindPopup(`<strong>${entry.title}</strong><br/>${dateRangeLabel(entry)}<br/>${locationLabel(entry)}<br/>${entry.category || "General"}`);

    marker.on("click", () => {
      selectedId = entry.id;
      drawerOpen = true;
      renderAll();
      panToSelected();
      scrollTimelineTo(selectedId);
    });

    markerLayers.push(marker);
  });
}

function fitToVisibleRoute() {
  const visible = visibleEntries();
  if (!visible.length) return;
  const bounds = L.latLngBounds(visible.map((entry) => [entry.lat, entry.lng]));
  map.fitBounds(bounds, { padding: [40, 40], maxZoom: 5 });
}

function panToSelected() {
  const selected = visibleEntries().find((entry) => entry.id === selectedId);
  if (!selected) return;
  map.flyTo([selected.lat, selected.lng], Math.max(map.getZoom(), 4), { duration: 0.9 });
}

function scrollTimelineTo(id) {
  const item = timelineEl.querySelector(`[data-id="${id}"]`);
  if (item) item.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function timelineMeta(entry, stepIndex, stepCount) {
  return `Step ${stepIndex + 1}/${stepCount} | ${dateRangeLabel(entry)} | ${locationLabel(entry)} | ${entry.category || "General"}`;
}

function updateProgress() {
  const visible = visibleEntries();
  progressRange.max = String(Math.max(visible.length - 1, 0));
  const index = selectedVisibleIndex();
  progressRange.value = String(Math.max(index, 0));
}

function renderFocusCard() {
  const visible = visibleEntries();
  const index = selectedVisibleIndex();

  if (index < 0) {
    focusCardEl.innerHTML = "<p>No steps match this filter.</p>";
    setDrawerOpen(false);
    return;
  }

  const entry = visible[index];
  focusCardEl.innerHTML = `
    <div class="focus-top">
      <span class="focus-pill" style="background:${colorForCategory(entry.category)};">${entry.category || "General"}</span>
      <span class="focus-step">Step ${index + 1}/${visible.length}</span>
    </div>
    <h3>${entry.title}</h3>
    <p class="focus-meta">${dateRangeLabel(entry)} | ${locationLabel(entry)}</p>
    ${entry.overlapGroup ? `<p class="focus-overlap">Overlap Group: ${entry.overlapGroup}</p>` : ""}
    <p>${entry.description}</p>
  `;
  setDrawerOpen(drawerOpen);
}

function renderTimeline() {
  const visible = visibleEntries();
  timelineEl.innerHTML = "";

  visible.forEach((entry, index) => {
    const color = colorForCategory(entry.category);
    const li = document.createElement("li");
    li.className = `timeline-item${entry.id === selectedId ? " active" : ""}`;
    li.dataset.id = entry.id;

    const overlapTag = entry.overlapGroup ? `<em class="overlap-tag">${entry.overlapGroup}</em>` : "";

    const button = document.createElement("button");
    button.className = "timeline-link";
    button.type = "button";
    button.innerHTML = `
      <span class="dot" style="background:${color};" aria-hidden="true"></span>
      <span>
        <strong>${entry.title}</strong>
        <span>${timelineMeta(entry, index, visible.length)}</span>
        ${overlapTag}
      </span>
    `;

    button.addEventListener("click", () => {
      selectedId = entry.id;
      drawerOpen = true;
      renderAll();
      panToSelected();
    });

    li.appendChild(button);
    timelineEl.appendChild(li);
  });
}

function saveEntries() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [...defaultEntries];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [...defaultEntries];
    return parsed.map(normalizeEntry);
  } catch {
    return [...defaultEntries];
  }
}

function clearForm() {
  form.reset();
  entryIdEl.value = "";
  setPlaceStatus("Use map click, search, or drag the precision pin.");
  syncPrecisionMarker();
}

function fillForm(entry) {
  entryIdEl.value = entry.id;
  titleEl.value = entry.title;
  startDateEl.value = getStartDate(entry);
  endDateEl.value = entry.endDate || "";
  categoryEl.value = entry.category || "";
  locationEl.value = entry.location;
  countryEl.value = entry.country || "";
  locationDetailEl.value = entry.locationDetail || "";
  overlapGroupEl.value = entry.overlapGroup || "";
  latEl.value = entry.lat;
  lngEl.value = entry.lng;
  descriptionEl.value = entry.description;
  setPlaceStatus(`Loaded ${entry.location}. Fine-tune with search or drag pin.`);
  syncPrecisionMarker();
}

function renderEditorList() {
  editorListEl.innerHTML = "";
  sortedEntries().forEach((entry) => {
    const li = document.createElement("li");
    const left = document.createElement("div");
    left.innerHTML = `
      <strong>${entry.title}</strong><br />
      <small><span class="inline-dot" style="background:${colorForCategory(entry.category)}"></span>${dateRangeLabel(entry)} | ${locationLabel(entry)} | ${entry.category || "General"}</small>
    `;

    const actions = document.createElement("div");
    actions.className = "editor-actions";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "btn btn-alt";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => {
      fillForm(entry);
      selectedId = entry.id;
      drawerOpen = true;
      renderAll();
      panToSelected();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn btn-alt";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      entries = entries.filter((item) => item.id !== entry.id);
      if (selectedId === entry.id) selectedId = null;
      saveEntries();
      clearForm();
      renderAll();
    });

    actions.append(editBtn, deleteBtn);
    li.append(left, actions);
    editorListEl.appendChild(li);
  });
}

function stopPlayback() {
  if (playbackTimer) clearInterval(playbackTimer);
  playbackTimer = null;
  isPlaying = false;
  playBtn.textContent = "Play Journey";
}

function jumpSelection(direction) {
  const visible = visibleEntries();
  if (!visible.length) return;
  const current = selectedVisibleIndex();
  const next = current < 0 ? 0 : Math.min(Math.max(current + direction, 0), visible.length - 1);
  selectedId = visible[next].id;
  drawerOpen = true;
  renderAll();
  scrollTimelineTo(selectedId);
  panToSelected();
}

function startPlayback() {
  const visible = visibleEntries();
  if (!visible.length) return;

  if (isPlaying) {
    stopPlayback();
    return;
  }

  isPlaying = true;
  playBtn.textContent = "Pause";

  playbackTimer = setInterval(() => {
    const current = visibleEntries();
    if (!current.length) {
      stopPlayback();
      return;
    }
    const idx = current.findIndex((entry) => entry.id === selectedId);
    const nextIndex = idx + 1;
    if (nextIndex >= current.length) {
      stopPlayback();
      return;
    }
    selectedId = current[nextIndex].id;
    drawerOpen = true;
    renderAll();
    panToSelected();
    scrollTimelineTo(selectedId);
  }, Number(speedSelect.value));
}

async function findPlaceCoordinates() {
  const query = placeQueryEl.value.trim();
  if (!query) {
    setPlaceStatus("Enter a city/address/venue to search.", true);
    return;
  }

  try {
    setPlaceStatus("Searching place...");
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Search unavailable right now.");
    const results = await response.json();
    if (!Array.isArray(results) || results.length === 0) {
      setPlaceStatus("No result found. Try adding country or state.", true);
      return;
    }

    const result = results[0];
    latEl.value = Number(result.lat).toFixed(6);
    lngEl.value = Number(result.lon).toFixed(6);
    syncPrecisionMarker();
    map.flyTo([Number(result.lat), Number(result.lon)], 9, { duration: 0.8 });
    setPlaceStatus(`Found: ${result.display_name}`);
  } catch (error) {
    setPlaceStatus(error.message, true);
  }
}

async function fillPlaceFromCoordinates() {
  const coords = currentCoordsFromForm();
  if (!coords) {
    setPlaceStatus("Enter valid coordinates first.", true);
    return;
  }

  try {
    setPlaceStatus("Looking up location from coordinates...");
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.lat}&lon=${coords.lng}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Reverse lookup unavailable right now.");
    const data = await response.json();
    const address = data.address || {};

    const city = address.city || address.town || address.village || address.hamlet || locationEl.value;
    const country = address.country || countryEl.value;

    locationEl.value = city || locationEl.value;
    countryEl.value = country || countryEl.value;
    if (data.display_name) locationDetailEl.value = data.display_name;
    setPlaceStatus(`Location filled: ${locationEl.value}, ${countryEl.value}`.replace(/, $/, ""));
  } catch (error) {
    setPlaceStatus(error.message, true);
  }
}

function normalizeEntry(item) {
  const startDate = item.startDate || item.date;
  const normalized = {
    id: item.id || crypto.randomUUID(),
    title: (item.title || "").trim(),
    startDate,
    endDate: item.endDate || null,
    category: (item.category || "General").trim(),
    location: (item.location || "").trim(),
    country: (item.country || "").trim(),
    locationDetail: (item.locationDetail || "").trim(),
    lat: Number(item.lat),
    lng: Number(item.lng),
    description: (item.description || "").trim(),
    overlapGroup: (item.overlapGroup || "").trim(),
  };

  if (!normalized.title || !normalized.startDate || !normalized.location || !normalized.description) {
    throw new Error("Each entry needs title, startDate, location, and description.");
  }

  if (normalized.endDate && parseDate(normalized.endDate) < parseDate(normalized.startDate)) {
    throw new Error("End date cannot be before start date.");
  }

  if (Number.isNaN(normalized.lat) || Number.isNaN(normalized.lng)) {
    throw new Error("Latitude and longitude must be valid numbers.");
  }

  return normalized;
}

function downloadTemplate() {
  const payload = [
    {
      id: "optional-uuid",
      title: "Step Title",
      startDate: "YYYY-MM-DD",
      endDate: "YYYY-MM-DD or null",
      category: "Education | Work | Personal | Project",
      location: "City",
      country: "Country",
      locationDetail: "Exact venue/campus/address (optional)",
      lat: 0,
      lng: 0,
      overlapGroup: "optional-shared-group-id",
      description: "What happened and why it mattered.",
    },
  ];

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "journey-data-template.json";
  link.click();
  URL.revokeObjectURL(url);
}

function renderAll() {
  renderMeta();
  renderYearFilter();
  renderCategoryFilter();
  renderLegend();
  ensureSelection();
  renderMap();
  renderFocusCard();
  renderTimeline();
  updateProgress();
  if (editorUnlocked) renderEditorList();
  syncPrecisionMarker();
}

if (!ALLOW_EDIT_MODE) unlockBtn.classList.add("hidden");

unlockBtn.addEventListener("click", () => {
  if (!ALLOW_EDIT_MODE) return;

  if (editorUnlocked) {
    editorUnlocked = false;
    editorEl.classList.add("hidden");
    unlockBtn.textContent = "Unlock Edit Mode";
    pickMode = false;
    pickModeBtn.textContent = "Pick Coordinates on Map: Off";
    removePrecisionMarker();
    return;
  }

  const pass = window.prompt("Enter editor passcode");
  if (pass !== EDITOR_PASSCODE) {
    window.alert("Incorrect passcode.");
    return;
  }

  editorUnlocked = true;
  editorEl.classList.remove("hidden");
  unlockBtn.textContent = "Lock Edit Mode";
  renderEditorList();
  syncPrecisionMarker();
});

pickModeBtn.addEventListener("click", () => {
  if (!editorUnlocked) return;
  pickMode = !pickMode;
  pickModeBtn.textContent = `Pick Coordinates on Map: ${pickMode ? "On" : "Off"}`;
});

map.on("click", (event) => {
  if (!editorUnlocked || !pickMode) return;
  latEl.value = event.latlng.lat.toFixed(6);
  lngEl.value = event.latlng.lng.toFixed(6);
  syncPrecisionMarker();
  setPlaceStatus(`Picked on map: ${event.latlng.lat.toFixed(6)}, ${event.latlng.lng.toFixed(6)}`);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  try {
    const next = normalizeEntry({
      id: entryIdEl.value || crypto.randomUUID(),
      title: titleEl.value,
      startDate: startDateEl.value,
      endDate: endDateEl.value || null,
      category: categoryEl.value,
      location: locationEl.value,
      country: countryEl.value,
      locationDetail: locationDetailEl.value,
      lat: latEl.value,
      lng: lngEl.value,
      overlapGroup: overlapGroupEl.value,
      description: descriptionEl.value,
    });

    const index = entries.findIndex((entry) => entry.id === next.id);
    if (index >= 0) entries[index] = next;
    else entries.push(next);

    selectedId = next.id;
    drawerOpen = true;
    saveEntries();
    clearForm();
    renderAll();
    panToSelected();
  } catch (error) {
    window.alert(error.message);
  }
});

resetFormBtn.addEventListener("click", clearForm);

latEl.addEventListener("input", syncPrecisionMarker);
lngEl.addEventListener("input", syncPrecisionMarker);

yearFilterEl.addEventListener("change", () => {
  stopPlayback();
  renderAll();
  fitToVisibleRoute();
});

categoryFilterEl.addEventListener("change", () => {
  stopPlayback();
  renderAll();
  fitToVisibleRoute();
});

fitAllBtn.addEventListener("click", fitToVisibleRoute);

prevBtn.addEventListener("click", () => {
  stopPlayback();
  jumpSelection(-1);
});

nextBtn.addEventListener("click", () => {
  stopPlayback();
  jumpSelection(1);
});

playBtn.addEventListener("click", startPlayback);
stopBtn.addEventListener("click", stopPlayback);
findPlaceBtn.addEventListener("click", findPlaceCoordinates);
reverseCoordsBtn.addEventListener("click", fillPlaceFromCoordinates);

speedSelect.addEventListener("change", () => {
  if (!isPlaying) return;
  stopPlayback();
  startPlayback();
});

if (closeDrawerBtn) {
  closeDrawerBtn.addEventListener("click", () => {
    setDrawerOpen(false);
  });
}

progressRange.addEventListener("input", () => {
  stopPlayback();
  const visible = visibleEntries();
  const index = Number(progressRange.value);
  if (!visible[index]) return;
  selectedId = visible[index].id;
  drawerOpen = true;
  renderAll();
  panToSelected();
  scrollTimelineTo(selectedId);
});

exportBtn.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(sortedEntries(), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "journey-data.json";
  link.click();
  URL.revokeObjectURL(url);
});

templateBtn.addEventListener("click", downloadTemplate);

resetDataBtn.addEventListener("click", () => {
  const confirmed = window.confirm("Replace current browser-saved edits with sample data?");
  if (!confirmed) return;
  entries = [...defaultEntries];
  selectedId = null;
  saveEntries();
  renderAll();
  fitToVisibleRoute();
});

importInput.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) throw new Error("JSON must be an array of entries.");
    entries = parsed.map(normalizeEntry);
    selectedId = null;
    saveEntries();
    clearForm();
    stopPlayback();
    renderAll();
    fitToVisibleRoute();
  } catch (error) {
    window.alert(`Import failed: ${error.message}`);
  } finally {
    importInput.value = "";
  }
});

setPlaceStatus("Use map click, search, or drag the precision pin.");
applyResponsiveMode();
renderAll();
fitToVisibleRoute();
setTimeout(() => map.invalidateSize(), 120);
window.addEventListener("resize", applyResponsiveMode);
