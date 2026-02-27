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

const LOCATION_CODES = {
  "new york city": "NYC",
  brooklyn: "NYC",
  birmingham: "BHAM",
  miami: "MIA",
  denver: "DEN",
};

const MOTION = {
  clusterZoomDuration: 2.5,
  routeFitDuration: 2.0,
  focusPanDuration: 2.1,
  geocodePanDuration: 1.7,
  ease: 0.22,
  playbackStepMs: 3000,
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
    description: "Started in high-volume front-of-house and kitchen support environments where pace and consistency mattered every shift. Built the baseline skills that still shape my work style: reading people quickly, coordinating teams under pressure, and keeping quality steady while volume changes hour to hour.",
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
    description: "Extended service and operations work into Miami, adapting quickly to a different customer base and operating style. Strengthened retention and reliability habits while learning how local market context changes communication, workflow, and team rhythm.",
    overlapGroup: "Service-MultiState",
  },
  {
    id: crypto.randomUUID(),
    title: "NCAA Fencer",
    startDate: "2018-08-01",
    endDate: "2022-05-01",
    category: "Life",
    location: "New York City",
    country: "United States",
    locationDetail: "New York University athletics",
    lat: 40.7295,
    lng: -73.9965,
    description: "Competed in NCAA epee while balancing coursework and paid work, which demanded disciplined time management and repeatable training structure. Fencing sharpened decision speed, pattern recognition, and calm execution under pressure that now carries into leadership and production work.",
    overlapGroup: "NYC-Life-Leadership",
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
    description: "Worked across New York service roles spanning host, barista, food service, and kitchen support. Built strong customer retention habits and team reliability in high-traffic environments where communication and handoffs directly affected revenue and guest experience.",
    overlapGroup: "Service-MultiState",
  },
  {
    id: crypto.randomUUID(),
    title: "Orientation Leader",
    startDate: "2020-01-01",
    endDate: "2021-11-01",
    category: "Work",
    location: "New York City",
    country: "United States",
    locationDetail: "NYU Gallatin",
    lat: 40.7295,
    lng: -73.9965,
    description: "Supported first-year student onboarding at NYU Gallatin as an orientation leader and peer mentor. Designed and ran events, coordinated with the student team, and became a first point of contact for both logistics and student support issues.",
    overlapGroup: "NYC-Life-Leadership",
  },
  {
    id: crypto.randomUUID(),
    title: "Intern",
    startDate: "2020-07-01",
    endDate: "2021-01-01",
    category: "Work",
    location: "New York City",
    country: "United States",
    locationDetail: "Limore Kurtz Dooley (NYC metro area)",
    lat: 40.7128,
    lng: -74.006,
    description: "Contributed to research, strategy, and client-facing communication workflows in a New York internship setting. Produced presentation materials, organized inputs for decision-making, and supported early-stage creative and business development tasks.",
    overlapGroup: "NYC-Life-Leadership",
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
    description: "Completed a BA at NYU Gallatin in Business of Emerging Technology for New Media with a Bioethics minor. Built an interdisciplinary base across technology strategy, ethics, and communication design that later informed XR, AI media, and production leadership work.",
    overlapGroup: "NYC-Education-Track",
  },
  {
    id: crypto.randomUUID(),
    title: "Ride The Dice - Love Crushed Velvet",
    startDate: "2023-06-01",
    endDate: "2023-11-30",
    category: "Project",
    location: "New York City",
    country: "United States",
    locationDetail: "Love Crushed Velvet (Band)",
    lat: 40.758,
    lng: -73.9855,
    description: "Drove the creative strategy and production path for an immersive music-video concept, translating a broad artistic vision into concrete scope, budget, and team execution. The project blended XR direction, storytelling, and practical production constraints to deliver a distinct audience experience.",
    overlapGroup: "NYC-Production-Arc",
  },
  {
    id: crypto.randomUUID(),
    title: "Falling. (Apart)",
    startDate: "2020-04-17",
    endDate: "2020-04-17",
    category: "Project",
    location: "New York City",
    country: "United States",
    locationDetail: "Independent 360 project",
    lat: 40.712776,
    lng: -74.005974,
    description: "Created an early 360 storytelling experiment focused on emotional atmosphere and viewer embodiment. This project helped establish my long-term interest in immersive media by testing how framing and spatial presence change narrative impact.",
    overlapGroup: "NYC-Immersive-Projects",
  },
  {
    id: crypto.randomUUID(),
    title: "Conflicting Perspectives",
    startDate: "2023-04-27",
    endDate: "2023-04-27",
    category: "Project",
    location: "New York City",
    country: "United States",
    locationDetail: "Immersive 360 film experiment",
    lat: 40.712776,
    lng: -74.005974,
    description: "Produced a 360 film experiment around point-of-view tension and perspective control. The work tested how interpretation shifts when the viewer decides where to look, and became a useful study in spatial framing and narrative ambiguity.",
    overlapGroup: "NYC-Immersive-Projects",
  },
  {
    id: crypto.randomUUID(),
    title: "Salesperson",
    startDate: "2024-01-01",
    endDate: "2024-08-01",
    category: "Work",
    location: "Birmingham",
    country: "United States",
    locationDetail: "Pihakis Restaurant Group (Luca Market)",
    lat: 33.5186,
    lng: -86.8104,
    description: "Worked full-time at Luca Market (Pihakis Restaurant Group) serving customers while supporting inventory flow, counter operations, and kitchen coordination. The role reinforced practical operations discipline: consistency, communication, and clean execution during peak demand windows.",
    overlapGroup: "BHM-Coach-Leadership",
  },
  {
    id: crypto.randomUUID(),
    title: "Motel Sunshine Spec Intro",
    startDate: "2024-10-28",
    endDate: "2024-10-28",
    category: "Project",
    location: "Brooklyn",
    country: "United States",
    locationDetail: "Virtual production concept development",
    lat: 40.6782,
    lng: -73.9442,
    description: "Built a concept intro for a potential episodic VR world to define tone, visual language, and audience positioning. Framed the piece as proof-of-direction for a larger serialized immersive format.",
    overlapGroup: "NYC-Production-Arc",
  },
  {
    id: crypto.randomUUID(),
    title: "A Fall At The Circus",
    startDate: "2024-09-30",
    endDate: "2024-09-30",
    category: "Project",
    location: "New York City",
    country: "United States",
    locationDetail: "Maya animation project",
    lat: 40.712776,
    lng: -74.005974,
    description: "Designed and rendered a short-form Maya animation focused on timing, motion, and stylized visual storytelling. Used the piece as a controlled technical and narrative study to sharpen look development and finish quality.",
    overlapGroup: "NYC-Production-Arc",
  },
  {
    id: crypto.randomUUID(),
    title: "Graduate Student",
    startDate: "2024-08-01",
    endDate: "2025-05-01",
    category: "Education",
    location: "New York City",
    country: "United States",
    locationDetail: "NYU Tisch Martin Scorsese Virtual Production Center",
    lat: 40.72935,
    lng: -73.99254,
    description: "Completed the NYU Tisch Virtual Production MPS at the Martin Scorsese Institute while leading a 30-person thesis team from concept to delivery. Managed creative direction, schedule, production logistics, and post workflows across both technical and narrative tracks.",
    overlapGroup: "NYC-Education-Track",
  },
  {
    id: crypto.randomUUID(),
    title: "No End For Sight",
    startDate: "2025-04-28",
    endDate: "2025-04-28",
    category: "Project",
    location: "Brooklyn",
    country: "United States",
    locationDetail: "AI-native short film pipeline",
    lat: 40.6782,
    lng: -73.9442,
    description: "Directed an AI-native short film to test authorship, pacing, and tonal continuity in a synthetic workflow. The project focused on turning exploratory tooling into intentional cinematic decision-making.",
    overlapGroup: "NYC-2025-Creative",
  },
  {
    id: crypto.randomUUID(),
    title: "GUM Studios - Intern, Production and Social Media",
    startDate: "2025-03-01",
    endDate: "2025-05-01",
    category: "Work",
    location: "Brooklyn",
    country: "United States",
    locationDetail: "GUM Studios (Brooklyn)",
    lat: 40.651873,
    lng: -74.006142,
    description: "At GUM Studios, produced social-first media and supported on-set production, including a local NYC band music video. Directed, produced, and coordinated across creative, crew, and virtual production constraints to move ideas from concept into delivered content.",
    overlapGroup: "NYC-2025-Creative",
  },
  {
    id: crypto.randomUUID(),
    title: "NYU Master's Thesis Short Film (Wolfe & The Bee)",
    startDate: "2025-05-31",
    endDate: "2025-05-31",
    category: "Project",
    location: "Brooklyn",
    country: "United States",
    locationDetail: "Martin Scorsese Institute LED soundstage",
    lat: 40.6782,
    lng: -73.9442,
    description: "Delivered graduate thesis film \"Wolfe & The Bee\" on the LED soundstage, integrating narrative direction with in-camera virtual production techniques. Led cross-functional execution spanning story, technical setup, team coordination, and post-finishing decisions.",
    overlapGroup: "NYC-2025-Creative",
  },
  {
    id: crypto.randomUUID(),
    title: "GUM Studios - Consultant, Business Development and Communications",
    startDate: "2025-05-01",
    endDate: "2025-07-01",
    category: "Work",
    location: "Brooklyn",
    country: "United States",
    locationDetail: "GUM Studios (Brooklyn)",
    lat: 40.651873,
    lng: -74.006142,
    description: "Partnered with leadership at GUM Studios on communication and business-development strategy during a rebranding phase. Built practical channel plans and messaging structure designed to improve positioning, client communication, and growth readiness.",
    overlapGroup: "NYC-2025-Creative",
  },
  {
    id: crypto.randomUUID(),
    title: "Associate",
    startDate: "2025-06-01",
    endDate: null,
    category: "Work",
    location: "New York City",
    country: "United States",
    locationDetail: "Double Eye Studios (Remote contract)",
    lat: 40.712776,
    lng: -74.005974,
    description: "At Double Eye Studios, conduct market and competitive analysis across luxury fashion and accessory brands exploring XR adoption. Translate research into actionable partnership and positioning strategies that support client acquisition and thought-leadership opportunities.",
    overlapGroup: "NYC-2025-Creative",
  },
  {
    id: crypto.randomUUID(),
    title: "Epee Fencing Coach",
    startDate: "2025-08-01",
    endDate: null,
    category: "Work",
    location: "Birmingham",
    country: "United States",
    locationDetail: "Birmingham Fencing Club",
    lat: 33.518589,
    lng: -86.810356,
    description: "Brought in to lead epee coaching for youth and adults at Birmingham Fencing Club while supporting growth goals beyond the piste. Drove school outreach demos and contributed to brand-refresh efforts including social strategy and identity updates.",
    overlapGroup: "BHM-Coach-Leadership",
  },
];

const PORTFOLIO_PROJECT_TITLES = [
  "Falling. (Apart)",
  "Conflicting Perspectives",
  "Ride The Dice - Love Crushed Velvet",
  "Motel Sunshine Spec Intro",
  "A Fall At The Circus",
  "No End For Sight",
  "NYU Master's Thesis Short Film (Wolfe & The Bee)",
];

let entries = migrateEntries(loadEntries());
let selectedId = null;
let editorUnlocked = false;
let pickMode = false;
let isPlaying = false;
let playbackTimer = null;
let drawerOpen = false;
let guidedTour = false;
let activeChip = "all";
let searchText = "";
let currentViewMode = "story";
let compareSelectionA = "";
let compareSelectionB = "";

const timelineEl = document.getElementById("timeline");
const detailDrawerEl = document.getElementById("detailDrawer");
const closeDrawerBtn = document.getElementById("closeDrawerBtn");
const focusCardEl = document.getElementById("focusCard");
const legendEl = document.getElementById("legend");
const filterPanelEl = document.getElementById("filterPanel");
const whySummaryEl = document.getElementById("whySummary");
const quickChipsEl = document.getElementById("quickChips");
const viewModeEl = document.getElementById("viewMode");
const searchInputEl = document.getElementById("searchInput");
const printBtn = document.getElementById("printBtn");
const tourBtn = document.getElementById("tourBtn");
const tourStatusEl = document.getElementById("tourStatus");

const yearFilterEl = document.getElementById("yearFilter");
const categoryFilterEl = document.getElementById("categoryFilter");
const fitAllBtn = document.getElementById("fitAllBtn");
const totalStepsEl = document.getElementById("totalSteps");
const yearSpanEl = document.getElementById("yearSpan");
const countryCountEl = document.getElementById("countryCount");

const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");
const progressRange = document.getElementById("progressRange");
const compareAEl = document.getElementById("compareA");
const compareBEl = document.getElementById("compareB");
const comparePanelEl = document.getElementById("comparePanel");
const skillsGraphEl = document.getElementById("skillsGraph");

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
const impactEl = document.getElementById("impact");
const scopeEl = document.getElementById("scope");
const toolsEl = document.getElementById("tools");
const teamSizeEl = document.getElementById("teamSize");
const outcomeEl = document.getElementById("outcome");
const skillsEl = document.getElementById("skills");
const evidenceLinksEl = document.getElementById("evidenceLinks");
const mediaLinksEl = document.getElementById("mediaLinks");
const dataHealthEl = document.getElementById("dataHealth");
const resetFormBtn = document.getElementById("resetFormBtn");

const map = L.map("map", {
  worldCopyJump: true,
  zoomControl: true,
  minZoom: 2,
  zoomAnimation: true,
  fadeAnimation: true,
  markerZoomAnimation: true,
}).setView([20, 0], 2);

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

function symbolForCategory(category) {
  const key = normalizeCategory(category);
  if (key === "education") return "E";
  if (key === "work") return "W";
  if (key === "project") return "P";
  if (key === "life" || key === "personal") return "L";
  return "G";
}

function parseCsvSkills(value) {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseLinkLines(value) {
  if (!value) return [];
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, url] = line.split("|").map((part) => part?.trim());
      if (!url) return null;
      return { label: label || "link", url };
    })
    .filter(Boolean);
}

function linkLinesFromArray(items = []) {
  return items.map((item) => `${item.label || "link"}|${item.url || ""}`).join("\n");
}

function monthsBetween(startDate, endDate) {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  const years = end.getFullYear() - start.getFullYear();
  const months = end.getMonth() - start.getMonth();
  const dayAdjust = end.getDate() >= start.getDate() ? 0 : -1;
  return Math.max(1, years * 12 + months + dayAdjust + 1);
}

function normalizeSkillKey(skill) {
  return String(skill || "").trim().toLowerCase();
}

function formatSkillLabel(skillKey) {
  return skillKey
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function skillsFromTools(value) {
  return parseCsvSkills(value)
    .map((item) => item.replace(/\//g, " "))
    .filter(Boolean);
}

function locationCode(entry) {
  const key = (entry.location || "").toLowerCase().trim();
  return LOCATION_CODES[key] || (entry.location || "LOC").slice(0, 4).toUpperCase();
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
    const searchable = [
      entry.title,
      entry.location,
      entry.locationDetail,
      entry.description,
      entry.category,
      ...(entry.skills || []),
      ...(entry.tools || "").split(","),
    ]
      .join(" ")
      .toLowerCase();
    const searchMatch = !searchText || searchable.includes(searchText);
    const chipMatch =
      activeChip === "all" ||
      searchable.includes(activeChip.toLowerCase()) ||
      normalizeCategory(entry.category) === activeChip.toLowerCase();
    return yearMatch && categoryMatch && searchMatch && chipMatch;
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

function renderQuickChips() {
  if (!quickChipsEl) return;
  const chips = ["all", "AI", "Leadership", "XR", "Ops", "Education", "Work", "Project", "Life"];
  quickChipsEl.innerHTML = "";
  chips.forEach((chip) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `chip-btn${activeChip.toLowerCase() === chip.toLowerCase() ? " active" : ""}`;
    btn.textContent = chip;
    btn.addEventListener("click", () => {
      activeChip = chip.toLowerCase();
      stopPlayback();
      renderAll();
      fitToVisibleRoute();
    });
    quickChipsEl.appendChild(btn);
  });
}

function renderWhySummary() {
  if (!whySummaryEl) return;
  const visible = visibleEntries();
  if (!visible.length) {
    whySummaryEl.textContent = "Why this matters: adjust filters or search to reveal the relevant chapters.";
    return;
  }
  const categories = [...new Set(visible.map((entry) => entry.category || "General"))];
  const locations = [...new Set(visible.map((entry) => entry.location))];
  const withOutcome = visible.filter((entry) => entry.outcome).length;
  whySummaryEl.textContent = `Why this matters: ${visible.length} steps across ${locations.length} locations, spanning ${categories.join(", ")}. ${withOutcome} steps include explicit outcomes.`;
}

function buildStepIcon(stepNumber, entry, isActive) {
  const symbol = symbolForCategory(entry.category);
  return L.divIcon({
    className: "step-pin",
    html: `<div class="step-icon ${isActive ? "active" : "inactive"}" style="background:${colorForCategory(entry.category)};">${stepNumber}<span class="marker-symbol">${symbol}</span></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

function buildClusterIcon(code) {
  return L.divIcon({
    className: "cluster-pin",
    html: `<div class="cluster-icon">${code}</div>`,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
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

  const zoom = map.getZoom();
  const shouldCluster = zoom <= 6;
  if (shouldCluster) {
    const groups = new Map();
    visible.forEach((entry) => {
      const code = locationCode(entry);
      if (!groups.has(code)) groups.set(code, []);
      groups.get(code).push(entry);
    });

    groups.forEach((groupEntries, code) => {
      if (groupEntries.length === 1) {
        const entry = groupEntries[0];
        const idx = visible.findIndex((item) => item.id === entry.id);
        const marker = L.marker([entry.lat, entry.lng], {
          icon: buildStepIcon(idx + 1, entry, entry.id === selectedId),
          title: `${entry.title} (${locationLabel(entry)})`,
        }).addTo(map);
        marker.on("click", () => {
          selectedId = entry.id;
          drawerOpen = true;
          renderAll();
          panToSelected();
          scrollTimelineTo(selectedId);
        });
        markerLayers.push(marker);
        return;
      }

      const avgLat = groupEntries.reduce((sum, entry) => sum + Number(entry.lat), 0) / groupEntries.length;
      const avgLng = groupEntries.reduce((sum, entry) => sum + Number(entry.lng), 0) / groupEntries.length;
      const marker = L.marker([avgLat, avgLng], {
        icon: buildClusterIcon(code),
        title: `${code} cluster`,
      }).addTo(map);

      marker.on("click", () => {
        const bounds = L.latLngBounds(groupEntries.map((entry) => [entry.lat, entry.lng]));
        map.flyToBounds(bounds, {
          padding: [60, 60],
          maxZoom: 9,
          duration: MOTION.clusterZoomDuration,
          easeLinearity: MOTION.ease,
        });
        selectedId = groupEntries[0].id;
        drawerOpen = true;
        renderAll();
      });
      markerLayers.push(marker);
    });
    return;
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

    marker.bindPopup(
      `<strong>${entry.title}</strong><br/>${dateRangeLabel(entry)}<br/>${locationLabel(entry)}<br/>${entry.category || "General"}${
        (entry.evidenceLinks || []).length ? `<br/>Evidence: ${(entry.evidenceLinks || []).length} link(s)` : ""
      }`
    );

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
  map.flyToBounds(bounds, {
    padding: [50, 50],
    maxZoom: 5,
    duration: MOTION.routeFitDuration,
    easeLinearity: MOTION.ease,
  });
}

function panToSelected() {
  const selected = visibleEntries().find((entry) => entry.id === selectedId);
  if (!selected) return;
  map.flyTo([selected.lat, selected.lng], Math.max(map.getZoom(), 4), {
    duration: MOTION.focusPanDuration,
    easeLinearity: MOTION.ease,
  });
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
  const tools = entry.tools || "";
  const skills = (entry.skills || []).join(", ");
  const impactBlock = entry.impact ? `<p><strong>Impact:</strong> ${entry.impact}</p>` : "";
  const scopeBlock = entry.scope ? `<p><strong>Scope:</strong> ${entry.scope}</p>` : "";
  const toolsBlock = tools ? `<p><strong>Tools:</strong> ${tools}</p>` : "";
  const teamBlock = entry.teamSize ? `<p><strong>Team:</strong> ${entry.teamSize}</p>` : "";
  const outcomeBlock = entry.outcome ? `<p><strong>Outcome:</strong> ${entry.outcome}</p>` : "";
  const skillsBlock = skills ? `<p><strong>Skills:</strong> ${skills}</p>` : "";
  const evidenceBlock = (entry.evidenceLinks || []).length
    ? `<div class="evidence-links">${entry.evidenceLinks
        .map((item) => `<a href="${item.url}" target="_blank" rel="noopener">${item.label}</a>`)
        .join("")}</div>`
    : "";
  const mediaPreview = (entry.mediaLinks || []).length
    ? `<div class="media-preview">${entry.mediaLinks
        .map((item) => {
          const isVideo = /\.mp4$|\.webm$|youtube\.com|youtu\.be|vimeo\.com/i.test(item.url);
          if (isVideo) {
            return `<video controls preload="metadata"><source src="${item.url}" /></video>`;
          }
          return `<img src="${item.url}" alt="${item.label || "media"}" loading="lazy" />`;
        })
        .join("")}</div>`
    : "";

  let modeContent = `<p>${entry.description}</p>${impactBlock}${outcomeBlock}${evidenceBlock}`;
  if (currentViewMode === "recruiter") {
    modeContent = `${impactBlock}${scopeBlock}${teamBlock}${outcomeBlock}${skillsBlock}${evidenceBlock}`;
  }
  if (currentViewMode === "technical") {
    modeContent = `${toolsBlock}${skillsBlock}${scopeBlock}${entry.description ? `<p>${entry.description}</p>` : ""}${evidenceBlock}${mediaPreview}`;
  }

  focusCardEl.innerHTML = `
    <div class="focus-top">
      <span class="focus-pill" style="background:${colorForCategory(entry.category)};">${entry.category || "General"}</span>
      <span class="focus-step">Step ${index + 1}/${visible.length}</span>
    </div>
    <h3>${entry.title}</h3>
    <p class="focus-meta">${dateRangeLabel(entry)} | ${locationLabel(entry)}</p>
    ${entry.overlapGroup ? `<p class="focus-overlap">Overlap Group: ${entry.overlapGroup}</p>` : ""}
    ${modeContent}
  `;
  setDrawerOpen(drawerOpen);
}

function renderTimeline() {
  const visible = visibleEntries();
  timelineEl.innerHTML = "";
  const overlapGroups = [...new Set(visible.map((entry) => entry.overlapGroup).filter(Boolean))];
  const laneColorByGroup = new Map(
    overlapGroups.map((group, idx) => [group, ["#8cb9ff", "#99e6be", "#ffc690", "#cbb0ff", "#ffe49f"][idx % 5]])
  );

  visible.forEach((entry, index) => {
    const color = colorForCategory(entry.category);
    const li = document.createElement("li");
    li.className = `timeline-item${entry.id === selectedId ? " active" : ""}`;
    li.dataset.id = entry.id;
    if (entry.overlapGroup && laneColorByGroup.has(entry.overlapGroup)) {
      li.style.borderLeftColor = laneColorByGroup.get(entry.overlapGroup);
    }

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

function migrateEntries(loadedEntries) {
  const templateByTitle = new Map(defaultEntries.map((entry) => [entry.title, entry]));
  const existingTitles = new Set();
  let changed = false;

  const enriched = loadedEntries.map((entry) => {
    const template = templateByTitle.get(entry.title);
    existingTitles.add(entry.title);
    if (!template) return entry;

    const next = { ...entry };

    const currentDescriptionLength = (next.description || "").length;
    if (currentDescriptionLength < 120 && template.description.length > currentDescriptionLength) {
      next.description = template.description;
      changed = true;
    }

    if (!next.locationDetail && template.locationDetail) {
      next.locationDetail = template.locationDetail;
      changed = true;
    }

    if (!next.overlapGroup && template.overlapGroup) {
      next.overlapGroup = template.overlapGroup;
      changed = true;
    }

    if (!next.country && template.country) {
      next.country = template.country;
      changed = true;
    }

    if (!next.impact) {
      next.impact = "Demonstrated measurable growth through execution and ownership in this phase.";
      changed = true;
    }

    if (!next.outcome) {
      next.outcome = "Converted experience into repeatable process and stronger cross-functional performance.";
      changed = true;
    }

    if (!Array.isArray(next.skills) || !next.skills.length) {
      next.skills = parseCsvSkills(next.tools || "") || [];
      if (!next.skills.length) next.skills = ["Execution", "Communication"];
      changed = true;
    }

    return next;
  });

  PORTFOLIO_PROJECT_TITLES.forEach((title) => {
    if (existingTitles.has(title)) return;
    const template = templateByTitle.get(title);
    if (!template) return;
    enriched.push({ ...template, id: crypto.randomUUID() });
    changed = true;
  });

  if (changed) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(enriched));
  }

  return enriched;
}

function clearForm() {
  form.reset();
  entryIdEl.value = "";
  impactEl.value = "";
  scopeEl.value = "";
  toolsEl.value = "";
  teamSizeEl.value = "";
  outcomeEl.value = "";
  skillsEl.value = "";
  evidenceLinksEl.value = "";
  mediaLinksEl.value = "";
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
  impactEl.value = entry.impact || "";
  scopeEl.value = entry.scope || "";
  toolsEl.value = entry.tools || "";
  teamSizeEl.value = entry.teamSize || "";
  outcomeEl.value = entry.outcome || "";
  skillsEl.value = (entry.skills || []).join(", ");
  evidenceLinksEl.value = linkLinesFromArray(entry.evidenceLinks || []);
  mediaLinksEl.value = linkLinesFromArray(entry.mediaLinks || []);
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

function renderSkillsGraph() {
  if (!skillsGraphEl) return;
  const visible = visibleEntries();
  const index = selectedVisibleIndex();
  const range = index >= 0 ? visible.slice(0, index + 1) : visible;

  const now = new Date();
  const skillMap = new Map();

  range.forEach((entry) => {
    const explicitSkills = (entry.skills || []).map((skill) => ({ skill, source: "explicit" }));
    const toolSkills = skillsFromTools(entry.tools || "").map((skill) => ({ skill, source: "tools" }));
    const combined = [...explicitSkills, ...toolSkills];
    if (!combined.length) return;

    const start = getStartDate(entry);
    const end = entry.endDate || now.toISOString().slice(0, 10);
    const durationMonths = monthsBetween(start, end);
    const yearsAgo = (now - parseDate(end)) / (1000 * 60 * 60 * 24 * 365.25);
    const recencyWeight = Math.max(0.72, 1.38 - yearsAgo * 0.12);
    const durationWeight = Math.min(1.95, 0.58 + durationMonths / 20);
    const evidenceWeight = 1 + Math.min(0.26, (entry.evidenceLinks || []).length * 0.07);
    const outcomeWeight = entry.outcome ? 1.08 : 1;
    const impactWeight = entry.impact ? 1.08 : 1;

    const seenInEntry = new Set();
    combined.forEach(({ skill, source }) => {
      const key = normalizeSkillKey(skill);
      if (!key) return;
      if (seenInEntry.has(key)) return;
      seenInEntry.add(key);

      if (!skillMap.has(key)) {
        skillMap.set(key, {
          key,
          label: formatSkillLabel(key),
          score: 0,
          touches: 0,
          recentTouches: 0,
          totalMonths: 0,
          categories: new Set(),
          firstDate: start,
          lastDate: end,
        });
      }

      const row = skillMap.get(key);
      const sourceWeight = source === "explicit" ? 1.12 : 0.92;
      const stepScore = durationWeight * recencyWeight * evidenceWeight * outcomeWeight * impactWeight * sourceWeight;
      row.score += stepScore;
      row.touches += 1;
      row.totalMonths += durationMonths;
      if (yearsAgo <= 2) row.recentTouches += 1;
      row.categories.add(normalizeCategory(entry.category));

      if (parseDate(start) < parseDate(row.firstDate)) row.firstDate = start;
      if (parseDate(end) > parseDate(row.lastDate)) row.lastDate = end;
    });
  });

  const ranked = [...skillMap.values()]
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.recentTouches !== a.recentTouches) return b.recentTouches - a.recentTouches;
      return b.touches - a.touches;
    })
    .slice(0, 8);

  if (!ranked.length) {
    skillsGraphEl.innerHTML = "<small>No skills tagged yet. Add comma-separated skills in edit mode.</small>";
    return;
  }

  const maxScore = ranked[0].score || 1;
  skillsGraphEl.innerHTML = ranked
    .map((row) => {
      const oldTouches = Math.max(0, row.touches - row.recentTouches);
      const trend = row.recentTouches > oldTouches ? "Rising" : row.recentTouches === oldTouches ? "Steady" : "Established";
      const trendClass = trend.toLowerCase();
      const width = Math.max(10, Math.round((row.score / maxScore) * 100));
      return `
      <button type="button" class="skill-row" data-skill="${row.key}" title="Filter by ${row.label}">
        <span class="skill-main">
          <strong>${row.label}</strong>
          <small>${row.categories.size} track${row.categories.size === 1 ? "" : "s"} • ${row.totalMonths} mo</small>
        </span>
        <span class="skill-bar"><span style="width:${width}%"></span></span>
        <span class="skill-meta">
          <em class="trend ${trendClass}">${trend}</em>
          <small>${row.score.toFixed(1)} score</small>
        </span>
      </button>`;
    })
    .join("");

  skillsGraphEl.querySelectorAll(".skill-row").forEach((button) => {
    button.addEventListener("click", () => {
      const skill = button.getAttribute("data-skill") || "";
      if (!skill) return;
      searchText = skill.toLowerCase();
      if (searchInputEl) searchInputEl.value = skill;
      stopPlayback();
      renderAll();
    });
  });
}

function compareEntryCard(entry) {
  if (!entry) return "<div class='compare-column'><p>Select a step</p></div>";
  return `<div class="compare-column">
    <strong>${entry.title}</strong>
    <p class="focus-meta">${dateRangeLabel(entry)} | ${locationLabel(entry)}</p>
    ${entry.impact ? `<p><strong>Impact:</strong> ${entry.impact}</p>` : ""}
    ${entry.scope ? `<p><strong>Scope:</strong> ${entry.scope}</p>` : ""}
    ${entry.outcome ? `<p><strong>Outcome:</strong> ${entry.outcome}</p>` : ""}
  </div>`;
}

function renderCompare() {
  if (!compareAEl || !compareBEl || !comparePanelEl) return;
  const visible = visibleEntries();
  const currentA = compareSelectionA || visible[0]?.id || "";
  const currentB = compareSelectionB || visible[Math.min(1, visible.length - 1)]?.id || "";

  compareAEl.innerHTML = visible.map((entry) => `<option value="${entry.id}">${entry.title}</option>`).join("");
  compareBEl.innerHTML = visible.map((entry) => `<option value="${entry.id}">${entry.title}</option>`).join("");
  compareAEl.value = visible.some((entry) => entry.id === currentA) ? currentA : visible[0]?.id || "";
  compareBEl.value = visible.some((entry) => entry.id === currentB) ? currentB : visible[Math.min(1, visible.length - 1)]?.id || "";
  compareSelectionA = compareAEl.value;
  compareSelectionB = compareBEl.value;

  const entryA = visible.find((entry) => entry.id === compareSelectionA);
  const entryB = visible.find((entry) => entry.id === compareSelectionB);
  comparePanelEl.innerHTML = `${compareEntryCard(entryA)}${compareEntryCard(entryB)}`;
}

function renderDataHealth() {
  if (!dataHealthEl) return;
  const warnings = [];
  entries.forEach((entry) => {
    if ((entry.description || "").length < 100) warnings.push(`${entry.title}: description is short`);
    if (!entry.impact) warnings.push(`${entry.title}: missing impact`);
    if (!entry.outcome) warnings.push(`${entry.title}: missing outcome`);
    if (!(entry.skills || []).length) warnings.push(`${entry.title}: missing skills tags`);
  });
  dataHealthEl.textContent = warnings.length
    ? `Data health: ${warnings.length} gaps found. Top: ${warnings.slice(0, 3).join(" | ")}`
    : "Data health: strong. No major gaps detected.";
}

function stopPlayback() {
  if (playbackTimer) clearTimeout(playbackTimer);
  playbackTimer = null;
  isPlaying = false;
  guidedTour = false;
  if (tourBtn) tourBtn.textContent = "Guided Tour";
  if (tourStatusEl) tourStatusEl.textContent = "";
  playBtn.textContent = "▶";
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
  playBtn.textContent = "⏸";
  const runPlaybackStep = () => {
    if (!isPlaying) return;
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

    playbackTimer = setTimeout(runPlaybackStep, MOTION.playbackStepMs);
  };

  playbackTimer = setTimeout(runPlaybackStep, MOTION.playbackStepMs);
}

function startGuidedTour() {
  const visible = visibleEntries();
  if (!visible.length) return;
  if (guidedTour) {
    stopPlayback();
    return;
  }
  stopPlayback();
  guidedTour = true;
  isPlaying = false;
  if (tourBtn) tourBtn.textContent = "Stop Tour";
  let tourIndex = Math.max(selectedVisibleIndex(), 0);

  const runTourStep = () => {
    if (!guidedTour) return;
    const current = visibleEntries();
    if (!current.length || tourIndex >= current.length) {
      stopPlayback();
      return;
    }
    const entry = current[tourIndex];
    selectedId = entry.id;
    drawerOpen = true;
    renderAll();
    map.flyTo([entry.lat, entry.lng], Math.max(5, map.getZoom()), {
      duration: 2.6,
      easeLinearity: 0.2,
    });
    if (tourStatusEl) {
      tourStatusEl.textContent = `Guided tour: ${entry.title} • ${dateRangeLabel(entry)} • ${entry.location}`;
    }
    tourIndex += 1;
    playbackTimer = setTimeout(runTourStep, 3800);
  };

  runTourStep();
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
    map.flyTo([Number(result.lat), Number(result.lon)], 9, {
      duration: MOTION.geocodePanDuration,
      easeLinearity: MOTION.ease,
    });
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
    impact: (item.impact || "").trim(),
    scope: (item.scope || "").trim(),
    tools: (item.tools || "").trim(),
    teamSize: String(item.teamSize || "").trim(),
    outcome: (item.outcome || "").trim(),
    skills: Array.isArray(item.skills)
      ? item.skills.map((skill) => String(skill).trim()).filter(Boolean)
      : parseCsvSkills(String(item.skills || "")),
    evidenceLinks: Array.isArray(item.evidenceLinks)
      ? item.evidenceLinks
          .map((itemLink) => ({ label: String(itemLink.label || "link").trim(), url: String(itemLink.url || "").trim() }))
          .filter((itemLink) => itemLink.url)
      : parseLinkLines(String(item.evidenceLinks || "")),
    mediaLinks: Array.isArray(item.mediaLinks)
      ? item.mediaLinks
          .map((itemLink) => ({ label: String(itemLink.label || "media").trim(), url: String(itemLink.url || "").trim() }))
          .filter((itemLink) => itemLink.url)
      : parseLinkLines(String(item.mediaLinks || "")),
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
      impact: "What changed because of this step",
      scope: "What you owned and how broad it was",
      tools: "Tools, platforms, systems used",
      teamSize: "Optional number",
      outcome: "Result with metric or concrete change",
      skills: ["Leadership", "Execution"],
      evidenceLinks: [{ label: "Project Link", url: "https://example.com" }],
      mediaLinks: [{ label: "Thumbnail", url: "https://example.com/image.jpg" }],
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
  renderQuickChips();
  renderWhySummary();
  ensureSelection();
  renderMap();
  renderFocusCard();
  renderTimeline();
  renderCompare();
  renderSkillsGraph();
  updateProgress();
  if (editorUnlocked) renderEditorList();
  if (editorUnlocked) renderDataHealth();
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

map.on("zoomend", () => {
  renderMap();
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
      impact: impactEl.value,
      scope: scopeEl.value,
      tools: toolsEl.value,
      teamSize: teamSizeEl.value,
      outcome: outcomeEl.value,
      skills: parseCsvSkills(skillsEl.value),
      evidenceLinks: parseLinkLines(evidenceLinksEl.value),
      mediaLinks: parseLinkLines(mediaLinksEl.value),
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

if (viewModeEl) {
  viewModeEl.addEventListener("change", () => {
    currentViewMode = viewModeEl.value;
    renderAll();
  });
}

if (searchInputEl) {
  searchInputEl.addEventListener("input", () => {
    searchText = searchInputEl.value.trim().toLowerCase();
    stopPlayback();
    renderAll();
  });
}

fitAllBtn.addEventListener("click", fitToVisibleRoute);
if (printBtn) printBtn.addEventListener("click", () => window.print());
if (tourBtn) tourBtn.addEventListener("click", startGuidedTour);

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

if (closeDrawerBtn) {
  closeDrawerBtn.addEventListener("click", () => {
    setDrawerOpen(false);
  });
}

if (compareAEl) {
  compareAEl.addEventListener("change", () => {
    compareSelectionA = compareAEl.value;
    renderCompare();
  });
}

if (compareBEl) {
  compareBEl.addEventListener("change", () => {
    compareSelectionB = compareBEl.value;
    renderCompare();
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
