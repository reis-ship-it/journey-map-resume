const video = document.getElementById("faxVideo");
const plate = document.querySelector(".scene-plate");
const hotspotsLayer = document.querySelector(".link-hotspots");
const resumeHit = document.getElementById("resumeHit");
const portfolioHit = document.getElementById("portfolioHit");
const emailHit = document.getElementById("emailHit");
const phoneHit = document.getElementById("phoneHit");
const faxInstrument = document.querySelector(".fax-instrument");
const faxKeys = Array.from(document.querySelectorAll(".fax-key"));

if (
  !video ||
  !plate ||
  !hotspotsLayer ||
  !resumeHit ||
  !portfolioHit ||
  !emailHit ||
  !phoneHit ||
  !faxInstrument ||
  !faxKeys.length
) {
  throw new Error("Missing landing elements.");
}

const STORAGE_KEY = "reis_fax_print_complete_v2";
const FALLBACK_DURATION = 7.666667;
const HOTSPOTS_VISIBLE_AT = 0.98;
const BASE_VIDEO_SIZE = { width: 3840, height: 2160 };

const EMAIL_HREF = "mailto:reisjgordon@gmail.com";
const PHONE_HREF = "tel:+15027413496";

const HITBOXES = {
  resume: { left: 1748, top: 1398, width: 281, height: 123 },
  portfolio: { left: 2204, top: 1394, width: 303, height: 127 },
  email: { left: 1628, top: 2036, width: 360, height: 96 },
  phone: { left: 2338, top: 2039, width: 242, height: 90 },
};

// Key hitboxes measured against the 3840x2160 final frame.
const KEY_HITBOXES = {
  "1": { left: 1476, top: 926, width: 76, height: 44 },
  "2": { left: 1578, top: 926, width: 76, height: 44 },
  "3": { left: 1682, top: 926, width: 80, height: 44 },
  "4": { left: 1474, top: 996, width: 78, height: 46 },
  "5": { left: 1576, top: 996, width: 78, height: 46 },
  "6": { left: 1680, top: 996, width: 82, height: 46 },
  "7": { left: 1470, top: 1066, width: 82, height: 46 },
  "8": { left: 1576, top: 1066, width: 78, height: 46 },
  "9": { left: 1680, top: 1066, width: 82, height: 46 },
  "*": { left: 1470, top: 1138, width: 82, height: 46 },
  "0": { left: 1576, top: 1138, width: 78, height: 46 },
  "#": { left: 1680, top: 1138, width: 82, height: 46 },
};

const FAX_PAD_MAP = {
  "1": { rowFreq: 697, colFreq: 1209, rgb: "143, 212, 255", duration: 0.16, send: 0.08 },
  "2": { rowFreq: 697, colFreq: 1336, rgb: "153, 219, 255", duration: 0.16, send: 0.08 },
  "3": { rowFreq: 697, colFreq: 1477, rgb: "168, 230, 255", duration: 0.16, send: 0.09 },
  "4": { rowFreq: 770, colFreq: 1209, rgb: "156, 244, 238", duration: 0.16, send: 0.09 },
  "5": { rowFreq: 770, colFreq: 1336, rgb: "142, 240, 208", duration: 0.16, send: 0.09 },
  "6": { rowFreq: 770, colFreq: 1477, rgb: "148, 239, 187", duration: 0.16, send: 0.09 },
  "7": { rowFreq: 852, colFreq: 1209, rgb: "248, 223, 130", duration: 0.17, send: 0.1 },
  "8": { rowFreq: 852, colFreq: 1336, rgb: "255, 207, 118", duration: 0.17, send: 0.1 },
  "9": { rowFreq: 852, colFreq: 1477, rgb: "255, 186, 126", duration: 0.17, send: 0.1 },
  "*": { rowFreq: 941, colFreq: 1209, rgb: "255, 154, 116", duration: 0.18, send: 0.11 },
  "0": { rowFreq: 941, colFreq: 1336, rgb: "138, 230, 200", duration: 0.18, send: 0.11 },
  "#": { rowFreq: 941, colFreq: 1477, rgb: "255, 242, 139", duration: 0.18, send: 0.12 },
};

const faxButtons = new Map();
let persistedComplete = readSession(STORAGE_KEY) === "1";
let audioContext = null;
let masterGain = null;
let delayNode = null;
let noiseBuffer = null;
let mutedAutoplayFallback = false;

video.loop = false;
video.volume = 1;
video.muted = false;
emailHit.setAttribute("href", EMAIL_HREF);
phoneHit.setAttribute("href", PHONE_HREF);

for (const button of faxKeys) {
  const key = button.getAttribute("data-fax-key") || "";
  faxButtons.set(key, button);

  const definition = FAX_PAD_MAP[key];
  if (definition) {
    button.style.setProperty("--key-rgb", definition.rgb);
  }

  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    void triggerFaxKey(key);
  });
}

setHotspotsReady(persistedComplete);

video.addEventListener("loadedmetadata", () => {
  if (persistedComplete) {
    holdFinalFrame();
  } else {
    setHotspotsReady(false);
    void startVideoPlayback();
  }

  updateHotspotPositions();
});

video.addEventListener("timeupdate", () => {
  if (persistedComplete) return;

  const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : FALLBACK_DURATION;
  const progress = clamp(video.currentTime / Math.max(0.001, duration), 0, 1);

  if (progress >= HOTSPOTS_VISIBLE_AT) {
    setHotspotsReady(true);
  }
});

video.addEventListener("ended", () => {
  writeSession(STORAGE_KEY, "1");
  persistedComplete = true;
  holdFinalFrame();
  setHotspotsReady(true);
});

plate.addEventListener("pointerdown", () => {
  maybeUnmuteVideo();
});

window.addEventListener("resize", updateHotspotPositions);
window.addEventListener("orientationchange", updateHotspotPositions);
window.addEventListener("keydown", handleGlobalKeydown);

const resizeObserver = new ResizeObserver(() => {
  updateHotspotPositions();
});

resizeObserver.observe(video);
resizeObserver.observe(plate);

function setHotspotsReady(ready) {
  for (const node of [resumeHit, portfolioHit, emailHit, phoneHit]) {
    if (ready) node.classList.add("is-ready");
    else node.classList.remove("is-ready");
  }

  faxInstrument.classList.toggle("is-ready", ready);
}

async function startVideoPlayback() {
  video.currentTime = 0;
  video.volume = 1;
  video.muted = false;
  video.defaultMuted = false;
  mutedAutoplayFallback = false;

  try {
    await video.play();
  } catch {
    video.muted = true;
    video.defaultMuted = true;
    mutedAutoplayFallback = true;

    try {
      await video.play();
    } catch {
      mutedAutoplayFallback = false;
      holdFinalFrame();
      setHotspotsReady(true);
    }
  }
}

function maybeUnmuteVideo() {
  if (!video.muted) return;

  video.muted = false;
  video.defaultMuted = false;
  video.volume = 1;
  mutedAutoplayFallback = false;

  if (video.paused && !persistedComplete) {
    void video.play().catch(() => {
      // Browser policy can still refuse late unmute; leave the page usable.
    });
  }
}

function holdFinalFrame() {
  const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : FALLBACK_DURATION;
  const target = Math.max(0, duration - 1 / 24);
  video.currentTime = target;
  video.pause();
}

function updateHotspotPositions() {
  const videoRect = getVideoRectPx();
  hotspotsLayer.style.left = `${videoRect.left}px`;
  hotspotsLayer.style.top = `${videoRect.top}px`;
  hotspotsLayer.style.width = `${videoRect.width}px`;
  hotspotsLayer.style.height = `${videoRect.height}px`;

  placeHitbox(resumeHit, videoRect, HITBOXES.resume);
  placeHitbox(portfolioHit, videoRect, HITBOXES.portfolio);
  placeHitbox(emailHit, videoRect, HITBOXES.email);
  placeHitbox(phoneHit, videoRect, HITBOXES.phone);

  for (const [key, button] of faxButtons) {
    const rect = KEY_HITBOXES[key];
    if (rect) {
      placeHitbox(button, videoRect, rect);
    }
  }
}

function placeHitbox(node, videoRect, rect) {
  const { width: sourceWidth, height: sourceHeight } = getSourceVideoSize();
  const scaleX = videoRect.width / sourceWidth;
  const scaleY = videoRect.height / sourceHeight;

  node.style.left = `${rect.left * scaleX}px`;
  node.style.top = `${rect.top * scaleY}px`;
  node.style.width = `${rect.width * scaleX}px`;
  node.style.height = `${rect.height * scaleY}px`;
}

function getVideoRectPx() {
  const videoRect = video.getBoundingClientRect();
  const plateRect = plate.getBoundingClientRect();
  return {
    left: videoRect.left - plateRect.left,
    top: videoRect.top - plateRect.top,
    width: videoRect.width,
    height: videoRect.height,
  };
}

function handleGlobalKeydown(event) {
  if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;

  const key = normalizeFaxKey(event);
  if (!key) return;

  event.preventDefault();
  void triggerFaxKey(key);
}

function normalizeFaxKey(event) {
  if (/^[0-9]$/.test(event.key)) return event.key;
  if (event.key === "*" || event.key === "#") return event.key;
  if (event.code === "NumpadMultiply") return "*";
  return "";
}

async function triggerFaxKey(key) {
  const definition = FAX_PAD_MAP[key];
  if (!definition || !faxInstrument.classList.contains("is-ready")) return;

  if (mutedAutoplayFallback) {
    maybeUnmuteVideo();
  }
  flashFaxKey(key);

  const isAudioReady = await ensureAudioEngine();
  if (!isAudioReady) return;

  if (key === "#") {
    playFaxHandshake({
      duration: 0.38,
      intensity: 1.08,
      send: 0.18,
    });
    return;
  }

  playDtmfTone(definition);
}

function flashFaxKey(key) {
  const button = faxButtons.get(key);
  if (!button) return;

  button.classList.add("is-active");
  const existingTimer = Number(button.dataset.flashTimer || 0);
  if (existingTimer) {
    window.clearTimeout(existingTimer);
  }

  const timer = window.setTimeout(() => {
    button.classList.remove("is-active");
    delete button.dataset.flashTimer;
  }, 170);

  button.dataset.flashTimer = String(timer);
}

async function ensureAudioEngine() {
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextCtor) return false;

  if (!audioContext) {
    audioContext = new AudioContextCtor();

    const compressor = audioContext.createDynamicsCompressor();
    compressor.threshold.value = -28;
    compressor.knee.value = 24;
    compressor.ratio.value = 10;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.18;

    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.56;
    masterGain.connect(compressor);
    compressor.connect(audioContext.destination);

    delayNode = audioContext.createDelay(0.45);
    delayNode.delayTime.value = 0.17;

    const delayFeedback = audioContext.createGain();
    delayFeedback.gain.value = 0.24;

    const delayTone = audioContext.createBiquadFilter();
    delayTone.type = "lowpass";
    delayTone.frequency.value = 2400;
    delayTone.Q.value = 0.4;

    delayNode.connect(delayTone);
    delayTone.connect(masterGain);
    delayTone.connect(delayFeedback);
    delayFeedback.connect(delayNode);

    noiseBuffer = createNoiseBuffer(audioContext);
  }

  if (audioContext.state === "suspended") {
    try {
      await audioContext.resume();
    } catch {
      return false;
    }
  }

  return audioContext.state === "running";
}

function playDtmfTone(definition, startAt = audioContext.currentTime) {
  const now = startAt;
  const duration = definition.duration || 0.17;
  const stopAt = now + duration;

  const rowOsc = audioContext.createOscillator();
  rowOsc.type = "sine";
  rowOsc.frequency.setValueAtTime(definition.rowFreq, now);

  const colOsc = audioContext.createOscillator();
  colOsc.type = "sine";
  colOsc.frequency.setValueAtTime(definition.colFreq, now);

  const rowGain = audioContext.createGain();
  rowGain.gain.value = 0.48;

  const colGain = audioContext.createGain();
  colGain.gain.value = 0.52;

  const wobble = audioContext.createOscillator();
  wobble.type = "sine";
  wobble.frequency.value = 11;

  const wobbleGain = audioContext.createGain();
  wobbleGain.gain.value = 2.2;
  wobble.connect(wobbleGain);
  wobbleGain.connect(rowOsc.detune);
  wobbleGain.connect(colOsc.detune);

  const highpass = audioContext.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 320;
  highpass.Q.value = 0.45;

  const lowpass = audioContext.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 2350;
  lowpass.Q.value = 0.6;

  const env = audioContext.createGain();
  env.gain.setValueAtTime(0.0001, now);
  env.gain.linearRampToValueAtTime(0.14, now + 0.01);
  env.gain.exponentialRampToValueAtTime(0.0001, stopAt);

  rowOsc.connect(rowGain);
  colOsc.connect(colGain);
  rowGain.connect(highpass);
  colGain.connect(highpass);
  highpass.connect(lowpass);
  lowpass.connect(env);

  const click = audioContext.createOscillator();
  click.type = "square";
  click.frequency.setValueAtTime(1740, now);
  click.frequency.exponentialRampToValueAtTime(880, now + 0.018);

  const clickGain = audioContext.createGain();
  clickGain.gain.setValueAtTime(0.0001, now);
  clickGain.gain.linearRampToValueAtTime(0.03, now + 0.002);
  clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
  click.connect(clickGain);

  const hiss = createNoiseSource();
  const hissHighpass = audioContext.createBiquadFilter();
  hissHighpass.type = "highpass";
  hissHighpass.frequency.value = 1500;

  const hissLowpass = audioContext.createBiquadFilter();
  hissLowpass.type = "lowpass";
  hissLowpass.frequency.value = 4200;

  const hissGain = audioContext.createGain();
  hissGain.gain.setValueAtTime(0.0001, now);
  hissGain.gain.linearRampToValueAtTime(0.012, now + 0.004);
  hissGain.gain.exponentialRampToValueAtTime(0.0001, stopAt + 0.03);

  hiss.connect(hissHighpass);
  hissHighpass.connect(hissLowpass);
  hissLowpass.connect(hissGain);

  const routed = [
    ...routeSignal(env, definition.send || 0.1),
    ...routeSignal(clickGain, 0.02),
    ...routeSignal(hissGain, 0.03),
  ];

  rowOsc.start(now);
  colOsc.start(now);
  wobble.start(now);
  click.start(now);
  hiss.start(now);

  stopAndDispose(
    [
      rowOsc,
      colOsc,
      wobble,
      click,
      hiss,
      rowGain,
      colGain,
      wobbleGain,
      highpass,
      lowpass,
      env,
      clickGain,
      hissHighpass,
      hissLowpass,
      hissGain,
      ...routed,
    ],
    stopAt + 0.05
  );
}

function playFaxHandshake({ startAt = audioContext.currentTime, duration = 0.32, intensity = 1, send = 0.18 } = {}) {
  const now = startAt;
  const stopAt = now + duration;

  const primary = audioContext.createOscillator();
  primary.type = "square";
  primary.frequency.setValueAtTime(1320, now);
  primary.frequency.exponentialRampToValueAtTime(2080, now + duration * 0.28);
  primary.frequency.exponentialRampToValueAtTime(1180, now + duration * 0.72);
  primary.frequency.linearRampToValueAtTime(1660, stopAt);

  const answer = audioContext.createOscillator();
  answer.type = "sawtooth";
  answer.frequency.setValueAtTime(860, now);
  answer.frequency.exponentialRampToValueAtTime(1180, now + duration * 0.34);
  answer.frequency.exponentialRampToValueAtTime(980, stopAt);

  const pilot = audioContext.createOscillator();
  pilot.type = "sine";
  pilot.frequency.setValueAtTime(2100, now);

  const primaryGain = audioContext.createGain();
  primaryGain.gain.value = 0.11 * intensity;

  const answerGain = audioContext.createGain();
  answerGain.gain.value = 0.072 * intensity;

  const pilotGain = audioContext.createGain();
  pilotGain.gain.setValueAtTime(0.0001, now);
  pilotGain.gain.linearRampToValueAtTime(0.028 * intensity, now + duration * 0.2);
  pilotGain.gain.exponentialRampToValueAtTime(0.0001, stopAt);

  const warble = audioContext.createOscillator();
  warble.type = "triangle";
  warble.frequency.value = 24;

  const warbleGain = audioContext.createGain();
  warbleGain.gain.value = 18;
  warble.connect(warbleGain);
  warbleGain.connect(primary.detune);
  warbleGain.connect(answer.detune);

  const filter = audioContext.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(1850, now);
  filter.frequency.linearRampToValueAtTime(2100, now + duration * 0.24);
  filter.frequency.linearRampToValueAtTime(1460, stopAt);
  filter.Q.value = 0.82;

  const postLowpass = audioContext.createBiquadFilter();
  postLowpass.type = "lowpass";
  postLowpass.frequency.value = 3400;
  postLowpass.Q.value = 0.5;

  const env = audioContext.createGain();
  env.gain.setValueAtTime(0.0001, now);
  env.gain.linearRampToValueAtTime(0.21 * intensity, now + 0.014);
  env.gain.exponentialRampToValueAtTime(0.0001, stopAt);

  primary.connect(primaryGain);
  answer.connect(answerGain);
  pilot.connect(pilotGain);
  primaryGain.connect(filter);
  answerGain.connect(filter);
  pilotGain.connect(filter);
  filter.connect(postLowpass);
  postLowpass.connect(env);

  const noise = createNoiseSource();
  const noiseHighpass = audioContext.createBiquadFilter();
  noiseHighpass.type = "highpass";
  noiseHighpass.frequency.value = 1700;

  const noiseLowpass = audioContext.createBiquadFilter();
  noiseLowpass.type = "lowpass";
  noiseLowpass.frequency.value = 5200;

  const noiseGain = audioContext.createGain();
  noiseGain.gain.setValueAtTime(0.0001, now);
  noiseGain.gain.linearRampToValueAtTime(0.018 * intensity, now + 0.008);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, stopAt + 0.04);

  noise.connect(noiseHighpass);
  noiseHighpass.connect(noiseLowpass);
  noiseLowpass.connect(noiseGain);

  const chirp = audioContext.createOscillator();
  chirp.type = "triangle";
  chirp.frequency.setValueAtTime(980, now);
  chirp.frequency.exponentialRampToValueAtTime(2200, now + duration * 0.16);

  const chirpGain = audioContext.createGain();
  chirpGain.gain.setValueAtTime(0.0001, now);
  chirpGain.gain.linearRampToValueAtTime(0.04 * intensity, now + 0.006);
  chirpGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.2);

  chirp.connect(chirpGain);

  const routed = [
    ...routeSignal(env, send),
    ...routeSignal(noiseGain, send * 0.5),
    ...routeSignal(chirpGain, send * 0.2),
  ];

  primary.start(now);
  answer.start(now);
  pilot.start(now);
  warble.start(now);
  noise.start(now);
  chirp.start(now);

  stopAndDispose(
    [
      primary,
      answer,
      pilot,
      warble,
      noise,
      chirp,
      primaryGain,
      answerGain,
      pilotGain,
      warbleGain,
      filter,
      postLowpass,
      env,
      noiseHighpass,
      noiseLowpass,
      noiseGain,
      chirpGain,
      ...routed,
    ],
    stopAt + 0.06
  );
}

function routeSignal(node, sendAmount) {
  node.connect(masterGain);

  if (!delayNode || sendAmount <= 0) {
    return [];
  }

  const send = audioContext.createGain();
  send.gain.value = sendAmount;
  node.connect(send);
  send.connect(delayNode);

  return [send];
}

function createNoiseSource() {
  const source = audioContext.createBufferSource();
  source.buffer = noiseBuffer;
  return source;
}

function createNoiseBuffer(context) {
  const length = context.sampleRate;
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const channel = buffer.getChannelData(0);

  for (let index = 0; index < length; index += 1) {
    channel[index] = Math.random() * 2 - 1;
  }

  return buffer;
}

function stopAndDispose(nodes, stopAt) {
  for (const node of nodes) {
    if (typeof node.stop === "function") {
      try {
        node.stop(stopAt);
      } catch {
        // no-op
      }
    }
  }

  const delayMs = Math.max(80, Math.ceil((stopAt - audioContext.currentTime) * 1000) + 80);
  window.setTimeout(() => {
    for (const node of nodes) {
      try {
        node.disconnect();
      } catch {
        // no-op
      }
    }
  }, delayMs);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getSourceVideoSize() {
  const width = video.videoWidth || BASE_VIDEO_SIZE.width;
  const height = video.videoHeight || BASE_VIDEO_SIZE.height;
  return { width, height };
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
