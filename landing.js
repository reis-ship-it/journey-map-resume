import * as THREE from "https://unpkg.com/three@0.164.1/build/three.module.js";

const canvas = document.getElementById("fxCanvas");
const plate = document.querySelector(".plate-wrap");

if (!canvas || !plate) {
  throw new Error("Landing scene elements not found.");
}

const PLATE_W = 1208;
const PLATE_H = 662;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
renderer.setSize(plate.clientWidth, plate.clientHeight, false);

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-PLATE_W / 2, PLATE_W / 2, PLATE_H / 2, -PLATE_H / 2, 0.1, 4000);
camera.position.set(0, 0, 1000);
camera.lookAt(0, 0, 0);

const ambient = new THREE.AmbientLight(0xffffff, 0.95);
scene.add(ambient);

const key = new THREE.DirectionalLight(0xffffff, 0.55);
key.position.set(140, 260, 360);
scene.add(key);

const rim = new THREE.DirectionalLight(0xeff6ff, 0.26);
rim.position.set(-300, -160, 180);
scene.add(rim);

const docCanvas = document.createElement("canvas");
docCanvas.width = 1024;
docCanvas.height = 1560;
const ctx = docCanvas.getContext("2d");

if (!ctx) {
  throw new Error("2D context unavailable.");
}

ctx.fillStyle = "#fcfcfb";
ctx.fillRect(0, 0, docCanvas.width, docCanvas.height);
ctx.strokeStyle = "rgba(0,0,0,0.08)";
ctx.strokeRect(0.5, 0.5, docCanvas.width - 1, docCanvas.height - 1);

ctx.fillStyle = "#111";
ctx.font = "700 62px Times New Roman";
ctx.fillText("Reis Quest", 72, 112);

ctx.font = "34px Times New Roman";
ctx.fillStyle = "#202020";
const bodyText =
  "Everything is reality, but what is reality? My creative approach is an undying attempt to answer that question. I think i've gotten a very good little bit of it so far. See an abridged visual in my resume, and some thoughts about the stuff i've made as of 02-20-26 in my portfolio.";

drawWrappedText(ctx, bodyText, 72, 196, 878, 50);

ctx.fillStyle = "#191919";
ctx.fillRect(72, 406, 220, 58);
ctx.fillRect(320, 406, 220, 58);
ctx.fillStyle = "#f7f7f7";
ctx.font = "700 33px Times New Roman";
ctx.fillText("Resume", 123, 446);
ctx.fillText("Portfolio", 351, 446);

ctx.fillStyle = "#212121";
ctx.font = "28px Times New Roman";
const note =
  '*there are a lot of typos, errors, mispellings, and other grammatical issues. I did that on purpose because that one guy said "to error is human" and i want y\'all to know i\'m writing this myself. (honestly an interesting thought about how being stupid might actually be a positive sign of human consciouness in the age of AI)';
drawWrappedText(ctx, note, 72, 532, 878, 40);

const paperTexture = new THREE.CanvasTexture(docCanvas);
paperTexture.colorSpace = THREE.SRGBColorSpace;
paperTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

const paperW = 290;
const paperH = 410;
const segX = 24;
const segY = 62;
const geometry = new THREE.PlaneGeometry(paperW, paperH, segX, segY);

const basePositions = geometry.attributes.position.array.slice();
const position = geometry.attributes.position;

const paperMaterial = new THREE.MeshStandardMaterial({
  map: paperTexture,
  color: 0xffffff,
  roughness: 0.92,
  metalness: 0.0,
});

const paperMesh = new THREE.Mesh(geometry, paperMaterial);
paperMesh.position.copy(imageToWorld(627, 425));
paperMesh.position.z = 6;
scene.add(paperMesh);

const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.24 });
const shadowMesh = new THREE.Mesh(new THREE.PlaneGeometry(paperW * 0.88, paperH * 0.96, 1, 1), shadowMat);
shadowMesh.position.copy(imageToWorld(640, 480));
shadowMesh.position.z = 1;
scene.add(shadowMesh);

let printing = false;
let printStart = 0;
let last = performance.now();

window.setTimeout(() => {
  printing = true;
  printStart = performance.now();
}, 1000);

function animate(now) {
  const dt = Math.min((now - last) / 1000, 0.06);
  last = now;

  if (printing) {
    const t = Math.min((now - printStart) / 7000, 1);
    const eased = easeOutCubic(t);
    const startPos = imageToWorld(627, 420);
    const endPos = imageToWorld(642, 635);

    paperMesh.position.x = THREE.MathUtils.lerp(startPos.x, endPos.x, eased);
    paperMesh.position.y = THREE.MathUtils.lerp(startPos.y, endPos.y, eased);
    paperMesh.position.z = 6;
    paperMesh.rotation.z = THREE.MathUtils.degToRad(THREE.MathUtils.lerp(0, -8.5, eased));

    const baseScale = THREE.MathUtils.lerp(0.22, 1, eased);
    paperMesh.scale.set(1, baseScale, 1);

    const curl = THREE.MathUtils.lerp(0.5, 23, eased);
    deformPaper(curl);

    shadowMesh.position.x = THREE.MathUtils.lerp(startPos.x + 16, endPos.x + 28, eased);
    shadowMesh.position.y = THREE.MathUtils.lerp(startPos.y - 8, endPos.y - 14, eased);
    shadowMesh.rotation.z = paperMesh.rotation.z;
    shadowMesh.scale.set(1, THREE.MathUtils.lerp(0.2, 1.04, eased), 1);
    shadowMat.opacity = THREE.MathUtils.lerp(0.1, 0.26, eased);

    if (t < 0.84) {
      const jitter = (Math.sin(now * 0.08) + Math.sin(now * 0.14)) * 0.35;
      paperMesh.position.x += jitter;
      shadowMesh.position.x += jitter * 1.3;
    }
  } else {
    paperMesh.scale.set(1, 0.18, 1);
    deformPaper(1.2);
    shadowMesh.scale.set(1, 0.2, 1);
    shadowMat.opacity = 0.08;
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

window.addEventListener("resize", resizeScene);

function resizeScene() {
  const w = plate.clientWidth;
  const h = plate.clientHeight;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
  renderer.setSize(w, h, false);
}

function imageToWorld(ix, iy) {
  return new THREE.Vector3(ix - PLATE_W / 2, PLATE_H / 2 - iy, 0);
}

function deformPaper(curl) {
  const arr = position.array;
  for (let i = 0; i < arr.length; i += 3) {
    const x = basePositions[i];
    const y = basePositions[i + 1];
    const u = (x + paperW / 2) / paperW;
    const v = (y + paperH / 2) / paperH;

    arr[i] = x;
    arr[i + 1] = y;

    const bendA = Math.sin(v * Math.PI) * curl;
    const bendB = Math.sin((u - 0.18) * Math.PI * 1.4) * curl * 0.22;
    const roll = Math.pow(v, 1.4) * curl * 0.42;
    arr[i + 2] = bendA + bendB + roll;
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();
}

function drawWrappedText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let cursorY = y;

  for (let i = 0; i < words.length; i += 1) {
    const testLine = `${line}${words[i]} `;
    const width = context.measureText(testLine).width;
    if (width > maxWidth && line) {
      context.fillText(line.trimEnd(), x, cursorY);
      line = `${words[i]} `;
      cursorY += lineHeight;
    } else {
      line = testLine;
    }
  }

  if (line) context.fillText(line.trimEnd(), x, cursorY);
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}
