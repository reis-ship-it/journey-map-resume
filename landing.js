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
const BUTTONS_VISIBLE_AT = 0.9;
const FLOW_SCROLL_START = 0.19;

const PAPER_END = {
  left: 0.5,
  top: 0.678,
  width: 0.325,
  height: 0.378,
};

const BUTTON_RECTS = {
  resume: { x: 0.16, y: 0.56, width: 0.28, height: 0.08 },
  portfolio: { x: 0.54, y: 0.56, width: 0.3, height: 0.08 },
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
    uScroll: { value: 0 },
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
    uniform float uScroll;
    varying vec2 vUv;

    void main() {
      float threshold = 1.0 - clamp(uReveal, 0.0, 1.0);
      float visible = step(threshold, vUv.y);
      vec2 uv = vec2(vUv.x, vUv.y + uScroll);
      float inside = step(0.0, uv.y) * step(uv.y, 1.0);
      vec4 tex = texture2D(uMap, uv);
      gl_FragColor = vec4(tex.rgb, tex.a * visible * inside);
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
  paperMaterial.uniforms.uReveal.value = currentProgress;
  paperMaterial.uniforms.uScroll.value = -(1 - currentProgress) * FLOW_SCROLL_START;
  resizeScene();
}

function updateHotspots(progress, paper) {
  const flowTopOffset = -(1 - progress) * FLOW_SCROLL_START;
  placeHotspot(resumeHit, BUTTON_RECTS.resume, paper, progress, flowTopOffset);
  placeHotspot(portfolioHit, BUTTON_RECTS.portfolio, paper, progress, flowTopOffset);
}

function placeHotspot(node, rect, paperRect, progress, flowTopOffset) {
  const yShifted = rect.y + flowTopOffset;
  const left = paperRect.left + rect.x * paperRect.width;
  const top = paperRect.top + yShifted * paperRect.height;
  const width = rect.width * paperRect.width;
  const height = rect.height * paperRect.height;
  const bottomRatio = yShifted + rect.height;
  const isVisible = progress >= BUTTONS_VISIBLE_AT && bottomRatio <= progress + 0.001;

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
  const rect = PAPER_END;
  return {
    left: viewportW * rect.left - (viewportW * rect.width) / 2,
    top: viewportH * rect.top,
    width: viewportW * rect.width,
    height: viewportH * rect.height,
  };
}

function render() {
  renderer.render(scene, camera);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function drawPaperTexture(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#000";

  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  const padX = width * 0.1;
  const contentW = width - padX * 2;
  let y = height * 0.1;

  ctx.font = `700 ${Math.floor(width * 0.104)}px "Times New Roman", Times, serif`;
  ctx.fillText("Reis Quest", padX, y);
  y += width * 0.15;

  ctx.font = `${Math.floor(width * 0.046)}px "Times New Roman", Times, serif`;
  y = drawWrappedText(
    ctx,
    "Everything is reality, but what is reality? My creative approach is an undying attempt to answer that question. I think i've gotten a very good little bit of it so far. See an abridged visual in my resume, and some thoughts about the stuff i've made as of 02-20-26 in my portfolio.",
    padX,
    y,
    contentW,
    width * 0.062
  );

  y += width * 0.04;
  const btnY = y;
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
  y = btnY + btnH + width * 0.05;
  ctx.font = `${Math.floor(width * 0.038)}px "Times New Roman", Times, serif`;
  drawWrappedText(
    ctx,
    "*there are a lot of typos, errors, mispellings, and other grammatical issues. I did that on purpose because that one guy said \"to error is human\" and i want y'all to know i'm writing this myself. (honestly an interesting thought about how being stupid might actually be a positive sign of human consciouness in the age of AI)",
    padX,
    y,
    contentW,
    width * 0.052
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
