import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const video = document.getElementById("faxVideo");
const webglCanvas = document.getElementById("paperWebgl");
const resumeHit = document.getElementById("resumeHit");
const portfolioHit = document.getElementById("portfolioHit");

if (!video || !webglCanvas || !resumeHit || !portfolioHit) {
  throw new Error("Missing landing elements.");
}

const STORAGE_KEY = "reis_fax_print_complete_v1";
const PRINT_START_SEC = 0.95;
const PRINT_END_SEC = 7.45;
const FALLBACK_DURATION = 7.666667;
const VIDEO_ZOOM = 1.28;
const PIXEL_RATIO_CAP = 2;
const BUTTONS_VISIBLE_AT = 0;
const INK_DELAY = 0.22;

const PAPER_FINAL = {
  left: 0.515,
  top: 0.672,
  width: 0.325,
  height: 0.378,
};
const PAPER_FEED_TOP_OFFSET = 0.024;

const BUTTON_RECTS = {
  resume: { x: 0.16, y: 0.1, width: 0.28, height: 0.08 },
  portfolio: { x: 0.54, y: 0.1, width: 0.3, height: 0.08 },
};

const renderer = new THREE.WebGLRenderer({
  canvas: webglCanvas,
  alpha: true,
  antialias: true,
});
renderer.setClearColor(0x000000, 0);

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10);
camera.position.z = 1;

const paperCanvas = document.createElement("canvas");
paperCanvas.width = 1600;
paperCanvas.height = 2300;
const paperCtx = paperCanvas.getContext("2d");
if (!paperCtx) {
  throw new Error("2D context unavailable.");
}
drawPaperTexture(paperCtx, paperCanvas.width, paperCanvas.height);

const paperTexture = new THREE.CanvasTexture(paperCanvas);
paperTexture.needsUpdate = true;

const paperMaterial = new THREE.ShaderMaterial({
  transparent: true,
  uniforms: {
    uMap: { value: paperTexture },
    uReveal: { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D uMap;
    uniform float uReveal;
    varying vec2 vUv;

    void main() {
      float threshold = 1.0 - clamp(uReveal, 0.0, 1.0);
      float visible = step(threshold, vUv.y);
      vec4 tex = texture2D(uMap, vUv);
      gl_FragColor = vec4(tex.rgb, tex.a * visible);
    }
  `,
});

const paperMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), paperMaterial);
scene.add(paperMesh);

video.loop = false;
let currentProgress = 0;
webglCanvas.style.opacity = "0";

const persistedComplete = readSession(STORAGE_KEY) === "1";
setProgress(0);

video.addEventListener("loadedmetadata", () => {
  document.documentElement.style.setProperty("--video-zoom", VIDEO_ZOOM.toFixed(4));
  resizeScene();
  if (persistedComplete) {
    holdFinalFrame(() => {
      setProgress(1);
      webglCanvas.style.opacity = "1";
    });
  } else {
    setProgress(0);
    video.currentTime = 0;
    webglCanvas.style.opacity = "1";
    const startPlayback = video.play();
    if (startPlayback && typeof startPlayback.catch === "function") {
      startPlayback.catch(() => {
        setProgress(1);
        holdFinalFrame(() => {
          webglCanvas.style.opacity = "1";
        });
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
  holdFinalFrame(() => {
    setProgress(1);
  });
});

window.addEventListener("resize", resizeScene);
window.addEventListener("orientationchange", resizeScene);

function holdFinalFrame(onLocked) {
  const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : FALLBACK_DURATION;
  const target = Math.max(0, duration - 1 / 24);
  let resolved = false;

  const finalize = () => {
    if (resolved) return;
    resolved = true;
    video.pause();
    if (typeof onLocked === "function") onLocked();
  };

  video.addEventListener("seeked", finalize, { once: true });
  video.currentTime = target;
  window.setTimeout(finalize, 220);
}

function setProgress(progress) {
  currentProgress = clamp(progress, 0, 1);
  const inkProgress = clamp((currentProgress - INK_DELAY) / (1 - INK_DELAY), 0, 1);
  paperMaterial.uniforms.uReveal.value = inkProgress;
  resizeScene();
}

function updateHotspots(progress, paper) {
  const inkProgress = clamp((progress - INK_DELAY) / (1 - INK_DELAY), 0, 1);
  placeHotspot(resumeHit, BUTTON_RECTS.resume, paper, inkProgress);
  placeHotspot(portfolioHit, BUTTON_RECTS.portfolio, paper, inkProgress);
}

function placeHotspot(node, rect, paperRect, inkProgress) {
  const left = paperRect.left + rect.x * paperRect.width;
  const top = paperRect.top + rect.y * paperRect.height;
  const width = rect.width * paperRect.width;
  const height = rect.height * paperRect.height;
  const bottomRatio = rect.y + rect.height;
  const isVisible = inkProgress >= BUTTONS_VISIBLE_AT && bottomRatio <= inkProgress + 0.001;

  node.style.left = `${left}px`;
  node.style.top = `${top}px`;
  node.style.width = `${width}px`;
  node.style.height = `${height}px`;

  if (isVisible) node.classList.add("is-ready");
  else node.classList.remove("is-ready");
}

function resizeScene() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const pr = Math.min(window.devicePixelRatio || 1, PIXEL_RATIO_CAP);

  renderer.setPixelRatio(pr);
  renderer.setSize(w, h, false);
  camera.left = -w / 2;
  camera.right = w / 2;
  camera.top = h / 2;
  camera.bottom = -h / 2;
  camera.updateProjectionMatrix();

  const paper = getPaperRectPx(w, h, currentProgress);
  const cx = paper.left + paper.width / 2;
  const cy = paper.top + paper.height / 2;

  paperMesh.position.set(cx - w / 2, h / 2 - cy, 0);
  paperMesh.scale.set(paper.width, paper.height, 1);

  updateHotspots(currentProgress, paper);
  render();
}

function getPaperRectPx(viewportW, viewportH, progress) {
  const videoRect = getVideoRectPx(viewportW, viewportH);
  const p = clamp(progress, 0, 1);
  const feedTop = PAPER_FINAL.top - (1 - p) * PAPER_FEED_TOP_OFFSET;
  return {
    left: videoRect.left + videoRect.width * PAPER_FINAL.left - (videoRect.width * PAPER_FINAL.width) / 2,
    top: videoRect.top + videoRect.height * feedTop,
    width: videoRect.width * PAPER_FINAL.width,
    height: videoRect.height * PAPER_FINAL.height,
  };
}

function getVideoRectPx(viewportW, viewportH) {
  const videoW = Number.isFinite(video.videoWidth) && video.videoWidth > 0 ? video.videoWidth : 3840;
  const videoH = Number.isFinite(video.videoHeight) && video.videoHeight > 0 ? video.videoHeight : 2160;
  const containerAspect = viewportW / Math.max(1, viewportH);
  const videoAspect = videoW / videoH;

  let renderW;
  let renderH;
  let left = 0;
  let top = 0;

  if (containerAspect > videoAspect) {
    renderW = viewportW;
    renderH = renderW / videoAspect;
    top = (viewportH - renderH) / 2;
  } else {
    renderH = viewportH;
    renderW = renderH * videoAspect;
    left = (viewportW - renderW) / 2;
  }

  const zoomedW = renderW * VIDEO_ZOOM;
  const zoomedH = renderH * VIDEO_ZOOM;
  const zoomedLeft = left - (zoomedW - renderW) / 2;
  const zoomedTop = top - (zoomedH - renderH) / 2;

  return {
    left: zoomedLeft,
    top: zoomedTop,
    width: zoomedW,
    height: zoomedH,
  };
}

function render() {
  renderer.render(scene, camera);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(start, end, t) {
  return start + (end - start) * t;
}

function drawPaperTexture(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#000";

  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  const padX = width * 0.1;
  const contentW = width - padX * 2;
  const btnY = height * 0.1;
  const btnH = width * 0.12;
  const gap = width * 0.04;
  const btnW = (contentW - gap) / 2;

  ctx.fillStyle = "#111";
  ctx.fillRect(padX, btnY, btnW, btnH);
  ctx.fillRect(padX + btnW + gap, btnY, btnW, btnH);

  ctx.fillStyle = "#fff";
  ctx.font = `700 ${Math.floor(width * 0.048)}px "Times New Roman", Times, serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Resume", padX + btnW / 2, btnY + btnH / 2);
  ctx.fillText("Portfolio", padX + btnW + gap + btnW / 2, btnY + btnH / 2);

  ctx.fillStyle = "#000";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  let y = btnY + btnH + width * 0.06;
  ctx.font = `700 ${Math.floor(width * 0.104)}px "Times New Roman", Times, serif`;
  ctx.fillText("Reis Quest", padX, y);

  y += width * 0.15;
  ctx.font = `${Math.floor(width * 0.05)}px "Times New Roman", Times, serif`;
  drawWrappedText(
    ctx,
    "this is my website, click the buttons above to see some of the facts about me.",
    padX,
    y,
    contentW,
    width * 0.064
  );
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let cursorY = y;

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cursorY);
      line = word;
      cursorY += lineHeight;
    } else {
      line = test;
    }
  }

  if (line) {
    ctx.fillText(line, x, cursorY);
    cursorY += lineHeight;
  }

  return cursorY;
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
