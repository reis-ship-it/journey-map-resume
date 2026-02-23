const video = document.getElementById("faxVideo");
const root = document.documentElement;
const links = document.querySelector("[data-links]");
const plate = document.querySelector(".scene-plate");

if (!video || !plate) {
  throw new Error("Missing fax video element.");
}

const STORAGE_KEY = "reis_fax_print_complete_v1";
const PRINT_START_SEC = 0.65;
const PRINT_END_SEC = 7.45;
const BUTTONS_VISIBLE_AT = 0.88; // of print progress window
const FALLBACK_DURATION = 7.666667;

video.loop = false;

const persistedComplete = sessionStorage.getItem(STORAGE_KEY) === "1";
if (persistedComplete) {
  setProgress(1);
  if (links) links.classList.add("is-ready");
}

video.addEventListener("loadedmetadata", () => {
  updatePlateMetrics();
  if (persistedComplete) {
    holdFinalFrame();
  } else {
    // Start from beginning each fresh session.
    video.currentTime = 0;
    void video.play().catch(() => {});
  }
});

video.addEventListener("timeupdate", () => {
  if (persistedComplete) return;

  const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : FALLBACK_DURATION;
  const end = Math.min(PRINT_END_SEC, duration - 0.04);
  const progress = clamp((video.currentTime - PRINT_START_SEC) / Math.max(0.001, end - PRINT_START_SEC), 0, 1);
  setProgress(progress);
});

video.addEventListener("ended", () => {
  sessionStorage.setItem(STORAGE_KEY, "1");
  setProgress(1);
  if (links) links.classList.add("is-ready");
  holdFinalFrame();
});

window.addEventListener("resize", updatePlateMetrics);
window.addEventListener("orientationchange", updatePlateMetrics);

function holdFinalFrame() {
  const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : FALLBACK_DURATION;
  video.currentTime = Math.max(0, duration - 1 / 24);
  video.pause();
}

function setProgress(progress) {
  root.style.setProperty("--print-progress", progress.toFixed(4));
  const linkOpacity = clamp((progress - BUTTONS_VISIBLE_AT) / (1 - BUTTONS_VISIBLE_AT), 0, 1);
  root.style.setProperty("--link-opacity", linkOpacity.toFixed(4));

  if (links) {
    if (linkOpacity > 0.001) links.classList.add("is-ready");
    else links.classList.remove("is-ready");
  }
}

function updatePlateMetrics() {
  const plateRect = plate.getBoundingClientRect();

  const vw = Number.isFinite(video.videoWidth) && video.videoWidth > 0 ? video.videoWidth : 3840;
  const vh = Number.isFinite(video.videoHeight) && video.videoHeight > 0 ? video.videoHeight : 2160;

  const videoAspect = vw / vh;
  const plateAspect = plateRect.width / Math.max(1, plateRect.height);

  let renderW = plateRect.width;
  let renderH = plateRect.height;
  let offsetX = 0;
  let offsetY = 0;

  // Matches object-fit: contain letterbox math.
  if (plateAspect > videoAspect) {
    renderH = plateRect.height;
    renderW = renderH * videoAspect;
    offsetX = (plateRect.width - renderW) / 2;
  } else {
    renderW = plateRect.width;
    renderH = renderW / videoAspect;
    offsetY = (plateRect.height - renderH) / 2;
  }

  root.style.setProperty("--plate-x", `${offsetX.toFixed(2)}px`);
  root.style.setProperty("--plate-y", `${offsetY.toFixed(2)}px`);
  root.style.setProperty("--plate-w", `${renderW.toFixed(2)}px`);
  root.style.setProperty("--plate-h", `${renderH.toFixed(2)}px`);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
