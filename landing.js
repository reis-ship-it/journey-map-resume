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
const VIDEO_ZOOM = 1.28;
const PAPER_START = {
  left: 0.5,
  top: 0.678,
  width: 0.325,
  height: 0.012,
};
const PAPER_END = {
  left: 0.5,
  top: 0.678,
  width: 0.325,
  height: 0.378,
};

video.loop = false;

const persistedComplete = readSession(STORAGE_KEY) === "1";
if (persistedComplete) {
  setProgress(1);
  if (links) links.classList.add("is-ready");
}

video.addEventListener("loadedmetadata", () => {
  root.style.setProperty("--video-zoom", VIDEO_ZOOM.toFixed(4));
  if (persistedComplete) {
    holdFinalFrame();
  } else {
    setProgress(0);
    // Start from beginning each fresh session.
    video.currentTime = 0;
    const startPlayback = video.play();
    if (startPlayback && typeof startPlayback.catch === "function") {
      startPlayback.catch(() => {
        // If autoplay is blocked, show final readable state instead of a masked strip.
        setProgress(1);
        if (links) links.classList.add("is-ready");
        holdFinalFrame();
      });
    }
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
  writeSession(STORAGE_KEY, "1");
  setProgress(1);
  if (links) links.classList.add("is-ready");
  holdFinalFrame();
});

window.addEventListener("resize", () => {
  root.style.setProperty("--video-zoom", VIDEO_ZOOM.toFixed(4));
});
window.addEventListener("orientationchange", () => {
  root.style.setProperty("--video-zoom", VIDEO_ZOOM.toFixed(4));
});

function holdFinalFrame() {
  const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : FALLBACK_DURATION;
  video.currentTime = Math.max(0, duration - 1 / 24);
  video.pause();
}

function setProgress(progress) {
  root.style.setProperty("--print-progress", progress.toFixed(4));
  const linkOpacity = clamp((progress - BUTTONS_VISIBLE_AT) / (1 - BUTTONS_VISIBLE_AT), 0, 1);
  root.style.setProperty("--link-opacity", linkOpacity.toFixed(4));
  const mapped = mapPaperRect(progress);
  root.style.setProperty("--paper-left", mapped.left.toFixed(5));
  root.style.setProperty("--paper-top", mapped.top.toFixed(5));
  root.style.setProperty("--paper-width", mapped.width.toFixed(5));
  root.style.setProperty("--paper-height", mapped.height.toFixed(5));

  if (links) {
    if (linkOpacity > 0.001) links.classList.add("is-ready");
    else links.classList.remove("is-ready");
  }
}

function mapPaperRect(progress) {
  const p = easeOutCubic(progress);
  return {
    left: lerp(PAPER_START.left, PAPER_END.left, p),
    top: lerp(PAPER_START.top, PAPER_END.top, p),
    width: lerp(PAPER_START.width, PAPER_END.width, p),
    height: lerp(PAPER_START.height, PAPER_END.height, p),
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(start, end, t) {
  return start + (end - start) * t;
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - clamp(t, 0, 1), 3);
}

function readSession(key) {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeSession(key, value) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // no-op when session storage is unavailable
  }
}
