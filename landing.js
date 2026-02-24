const video = document.getElementById("faxVideo");
const resumeHit = document.getElementById("resumeHit");
const portfolioHit = document.getElementById("portfolioHit");
const emailHit = document.getElementById("emailHit");
const phoneHit = document.getElementById("phoneHit");

if (!video || !resumeHit || !portfolioHit || !emailHit || !phoneHit) {
  throw new Error("Missing landing elements.");
}

const STORAGE_KEY = "reis_fax_print_complete_v1";
const FALLBACK_DURATION = 7.666667;
const HOTSPOTS_VISIBLE_AT = 0.98;

// Update these two values with your real contact info.
const EMAIL_HREF = "mailto:your-email@example.com";
const PHONE_HREF = "tel:+10000000000";

// AE composition-space paper mapping (normalized inside zoomed video rect).
const PAPER_FINAL = {
  left: 0.515,
  top: 0.672,
  width: 0.325,
  height: 0.378,
};

// Hotspots normalized in paper space.
const HITBOXES = {
  resume: { x: 0.15, y: 0.05, width: 0.3, height: 0.09 },
  portfolio: { x: 0.53, y: 0.05, width: 0.32, height: 0.09 },
  email: { x: 0.12, y: 0.865, width: 0.42, height: 0.06 },
  phone: { x: 0.57, y: 0.865, width: 0.31, height: 0.06 },
};

let persistedComplete = readSession(STORAGE_KEY) === "1";

video.loop = false;
emailHit.setAttribute("href", EMAIL_HREF);
phoneHit.setAttribute("href", PHONE_HREF);

if (persistedComplete) {
  setHotspotsReady(true);
}

video.addEventListener("loadedmetadata", () => {
  if (persistedComplete) {
    holdFinalFrame();
  } else {
    setHotspotsReady(false);
    video.currentTime = 0;
    const startPlayback = video.play();
    if (startPlayback && typeof startPlayback.catch === "function") {
      startPlayback.catch(() => {
        holdFinalFrame();
        setHotspotsReady(true);
      });
    }
  }
  updateHotspotPositions();
});

video.addEventListener("timeupdate", () => {
  if (persistedComplete) return;
  const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : FALLBACK_DURATION;
  const progress = clamp(video.currentTime / Math.max(0.001, duration), 0, 1);
  if (progress >= HOTSPOTS_VISIBLE_AT) setHotspotsReady(true);
});

video.addEventListener("ended", () => {
  writeSession(STORAGE_KEY, "1");
  persistedComplete = true;
  holdFinalFrame();
  setHotspotsReady(true);
});

window.addEventListener("resize", updateHotspotPositions);
window.addEventListener("orientationchange", updateHotspotPositions);

function setHotspotsReady(ready) {
  for (const node of [resumeHit, portfolioHit, emailHit, phoneHit]) {
    if (ready) node.classList.add("is-ready");
    else node.classList.remove("is-ready");
  }
}

function holdFinalFrame() {
  const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : FALLBACK_DURATION;
  const target = Math.max(0, duration - 1 / 24);
  video.currentTime = target;
  video.pause();
}

function updateHotspotPositions() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const videoRect = getVideoRectPx(vw, vh);
  const paperRect = {
    left: videoRect.left + videoRect.width * PAPER_FINAL.left - (videoRect.width * PAPER_FINAL.width) / 2,
    top: videoRect.top + videoRect.height * PAPER_FINAL.top,
    width: videoRect.width * PAPER_FINAL.width,
    height: videoRect.height * PAPER_FINAL.height,
  };

  placeHitbox(resumeHit, paperRect, HITBOXES.resume);
  placeHitbox(portfolioHit, paperRect, HITBOXES.portfolio);
  placeHitbox(emailHit, paperRect, HITBOXES.email);
  placeHitbox(phoneHit, paperRect, HITBOXES.phone);
}

function placeHitbox(node, paperRect, rect) {
  node.style.left = `${paperRect.left + rect.x * paperRect.width}px`;
  node.style.top = `${paperRect.top + rect.y * paperRect.height}px`;
  node.style.width = `${rect.width * paperRect.width}px`;
  node.style.height = `${rect.height * paperRect.height}px`;
}

function getVideoRectPx(viewportW, viewportH) {
  return {
    left: video.offsetLeft || 0,
    top: video.offsetTop || 0,
    width: video.clientWidth || viewportW,
    height: video.clientHeight || viewportH,
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
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
    // no-op
  }
}
