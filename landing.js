const frameImage = document.getElementById("frameImage");

if (!frameImage) {
  throw new Error("Missing frame image element.");
}

const TOTAL_FRAMES = 184;
const FPS = 24;
const START_DELAY_MS = 1000;

let started = false;
let startTs = 0;
let lastFrame = -1;

window.setTimeout(() => {
  document.body.classList.add("printing");
  started = true;
  startTs = performance.now();
  requestAnimationFrame(step);
}, START_DELAY_MS);

function step(now) {
  if (!started) return;

  const elapsed = (now - startTs) / 1000;
  const frame = Math.min(TOTAL_FRAMES - 1, Math.floor(elapsed * FPS));

  if (frame !== lastFrame) {
    frameImage.src = frameSrc(frame);
    lastFrame = frame;
  }

  if (frame < TOTAL_FRAMES - 1) {
    requestAnimationFrame(step);
  }
}

function frameSrc(frame) {
  return `/faxprinter/Fax-printer${String(frame).padStart(3, "0")}.jpg`;
}
