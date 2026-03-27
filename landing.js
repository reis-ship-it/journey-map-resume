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
  "1": { rgb: "143, 212, 255", sampleUrl: "/assets/audio/fax-vocals/1.mp3" },
  "2": { rgb: "153, 219, 255", sampleUrl: "/assets/audio/fax-vocals/2.mp3" },
  "3": { rgb: "168, 230, 255", sampleUrl: "/assets/audio/fax-vocals/3.mp3" },
  "4": { rgb: "156, 244, 238", sampleUrl: "/assets/audio/fax-vocals/4.mp3" },
  "5": { rgb: "142, 240, 208", sampleUrl: "/assets/audio/fax-vocals/5.mp3" },
  "6": { rgb: "148, 239, 187", sampleUrl: "/assets/audio/fax-vocals/6.mp3" },
  "7": { rgb: "248, 223, 130", sampleUrl: "/assets/audio/fax-vocals/7.mp3" },
  "8": { rgb: "255, 207, 118", sampleUrl: "/assets/audio/fax-vocals/8.mp3" },
  "9": { rgb: "255, 186, 126", sampleUrl: "/assets/audio/fax-vocals/9.mp3" },
  "*": { rgb: "255, 154, 116", sampleUrl: "/assets/audio/fax-vocals/star.mp3", gain: 1.04 },
  "0": { rgb: "138, 230, 200", sampleUrl: "/assets/audio/fax-vocals/0.mp3" },
  "#": { rgb: "255, 242, 139", sampleUrl: "/assets/audio/fax-vocals/pound.mp3", gain: 1.02 },
};

const faxButtons = new Map();
let persistedComplete = readSession(STORAGE_KEY) === "1";
let audioContext = null;
let masterGain = null;
let compressor = null;
let bounceInput = null;
let reverbInput = null;
const sampleBuffers = new Map();
const sampleLoaders = new Map();
const activeLoopVoices = new Map();
const effectState = {
  sustain: false,
  bounce: false,
  reverb: false,
  chorus: false,
  nightcore: false,
};

video.loop = false;
video.volume = 0;
video.muted = true;
video.defaultMuted = true;
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

window.addEventListener("resize", updateHotspotPositions);
window.addEventListener("orientationchange", updateHotspotPositions);
window.addEventListener("keydown", handleGlobalKeydown);
window.addEventListener("keyup", handleGlobalKeyup);

const resizeObserver = new ResizeObserver(() => {
  updateHotspotPositions();
});

resizeObserver.observe(video);
resizeObserver.observe(plate);
window.addEventListener("pointerdown", warmFaxSamples, { once: true, passive: true });
window.addEventListener("keydown", warmFaxSamples, { once: true });

function setHotspotsReady(ready) {
  for (const node of [resumeHit, portfolioHit, emailHit, phoneHit]) {
    if (ready) node.classList.add("is-ready");
    else node.classList.remove("is-ready");
  }

  faxInstrument.classList.toggle("is-ready", ready);
}

async function startVideoPlayback() {
  video.currentTime = 0;
  video.volume = 0;
  video.muted = true;
  video.defaultMuted = true;

  try {
    await video.play();
  } catch {
    holdFinalFrame();
    setHotspotsReady(true);
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

  if (handlePerformanceKeydown(event)) {
    return;
  }

  const key = normalizeFaxKey(event);
  if (!key) return;

  event.preventDefault();
  void triggerFaxKey(key);
}

function handleGlobalKeyup(event) {
  if (event.code === "Space" || event.key === " ") {
    event.preventDefault();
    effectState.sustain = false;
    releaseSustainVoices();
  }
}

function handlePerformanceKeydown(event) {
  if (event.code === "Space" || event.key === " ") {
    event.preventDefault();
    effectState.sustain = true;
    return true;
  }

  const key = event.key.toLowerCase();
  if (key === "b") {
    event.preventDefault();
    effectState.bounce = !effectState.bounce;
    return true;
  }

  if (key === "v") {
    event.preventDefault();
    effectState.reverb = !effectState.reverb;
    return true;
  }

  if (key === "c") {
    event.preventDefault();
    effectState.chorus = !effectState.chorus;
    return true;
  }

  if (key === "n") {
    event.preventDefault();
    effectState.nightcore = !effectState.nightcore;
    return true;
  }

  return false;
}

function normalizeFaxKey(event) {
  if (/^[0-9]$/.test(event.key)) return event.key;
  if (event.key === "*" || event.key === "#") return event.key;
  if (event.code === "NumpadMultiply") return "*";
  if (event.code === "NumpadAdd") return "#";
  if (event.code === "NumpadSubtract") return "*";
  if (event.key === "-" || event.key === "_" || event.code === "Minus") return "*";
  if (event.key === "=" || event.key === "+" || event.code === "Equal") return "#";
  return "";
}

async function triggerFaxKey(key) {
  const definition = FAX_PAD_MAP[key];
  if (!definition || !faxInstrument.classList.contains("is-ready")) return;

  flashFaxKey(key);

  const isAudioReady = await ensureAudioEngine();
  if (!isAudioReady) return;

  try {
    await loadFaxSample(key);
    if (effectState.sustain) {
      const existingVoice = activeLoopVoices.get(key);
      if (existingVoice) {
        existingVoice.stop();
        activeLoopVoices.delete(key);
        return;
      }

      activeLoopVoices.set(key, playFaxSample(key, { loop: true }));
      return;
    }

    playFaxSample(key);
  } catch (error) {
    console.error(`Failed to play fax sample for key "${key}".`, error);
  }
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

    compressor = audioContext.createDynamicsCompressor();
    compressor.threshold.value = -28;
    compressor.knee.value = 24;
    compressor.ratio.value = 10;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.18;

    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.82;
    masterGain.connect(compressor);
    compressor.connect(audioContext.destination);

    bounceInput = buildBounceBus();
    reverbInput = buildReverbBus();
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

function warmFaxSamples() {
  void preloadFaxSamples();
}

async function preloadFaxSamples() {
  const isAudioReady = await ensureAudioEngine();
  if (!isAudioReady) return;

  await Promise.allSettled(
    Object.keys(FAX_PAD_MAP).map((key) => loadFaxSample(key))
  );
}

async function loadFaxSample(key) {
  const definition = FAX_PAD_MAP[key];
  if (!definition?.sampleUrl) {
    throw new Error(`Missing sample URL for key "${key}".`);
  }

  if (sampleBuffers.has(key)) {
    return sampleBuffers.get(key);
  }

  if (sampleLoaders.has(key)) {
    return sampleLoaders.get(key);
  }

  const loader = fetch(definition.sampleUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} for ${definition.sampleUrl}`);
      }

      return response.arrayBuffer();
    })
    .then((arrayBuffer) => decodeAudioBuffer(arrayBuffer))
    .then((buffer) => {
      sampleBuffers.set(key, buffer);
      sampleLoaders.delete(key);
      return buffer;
    })
    .catch((error) => {
      sampleLoaders.delete(key);
      throw error;
    });

  sampleLoaders.set(key, loader);
  return loader;
}

function decodeAudioBuffer(arrayBuffer) {
  return new Promise((resolve, reject) => {
    audioContext.decodeAudioData(arrayBuffer.slice(0), resolve, reject);
  });
}

function playFaxSample(key, { loop = false } = {}) {
  const definition = FAX_PAD_MAP[key];
  const buffer = sampleBuffers.get(key);
  if (!definition || !buffer || !audioContext || !masterGain) return;

  const voiceBus = audioContext.createGain();
  voiceBus.gain.value = (definition.gain || 0.96) * (loop ? 0.88 : 1);
  voiceBus.connect(masterGain);

  const nodesToDisconnect = [voiceBus];
  const sources = [];
  const layers = [
    { detune: 0, delay: 0, gain: 1 },
    ...(effectState.chorus
      ? [
          { detune: -9, delay: 0.012, gain: 0.52 },
          { detune: 9, delay: 0.021, gain: 0.52 },
        ]
      : []),
  ];

  for (const layer of layers) {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = loop;
    source.playbackRate.value = effectState.nightcore ? 1.16 : 1;
    source.detune.value = layer.detune + (effectState.nightcore ? 120 : 0);

    const highpass = audioContext.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = effectState.nightcore ? 180 : 140;
    highpass.Q.value = 0.4;

    const lowpass = audioContext.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = effectState.nightcore ? 5600 : 4600;
    lowpass.Q.value = 0.4;

    const layerGain = audioContext.createGain();
    layerGain.gain.value = layer.gain;

    source.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(layerGain);
    layerGain.connect(voiceBus);

    source.start(audioContext.currentTime + layer.delay);

    sources.push(source);
    nodesToDisconnect.push(highpass, lowpass, layerGain);
  }

  if (effectState.bounce && bounceInput) {
    const bounceSend = audioContext.createGain();
    bounceSend.gain.value = loop ? 0.34 : 0.28;
    voiceBus.connect(bounceSend);
    bounceSend.connect(bounceInput);
    nodesToDisconnect.push(bounceSend);
  }

  if (effectState.reverb && reverbInput) {
    const reverbSend = audioContext.createGain();
    reverbSend.gain.value = loop ? 0.42 : 0.32;
    voiceBus.connect(reverbSend);
    reverbSend.connect(reverbInput);
    nodesToDisconnect.push(reverbSend);
  }

  let cleanedUp = false;
  const cleanup = () => {
    if (cleanedUp) return;
    cleanedUp = true;

    for (const node of nodesToDisconnect) {
      try {
        node.disconnect();
      } catch {
        // no-op
      }
    }
  };

  let endedSources = 0;
  for (const source of sources) {
    source.addEventListener("ended", () => {
      endedSources += 1;
      if (!loop && endedSources >= sources.length) {
        cleanup();
      }
    });
  }

  return {
    stop() {
      const stopAt = audioContext.currentTime + 0.08;
      voiceBus.gain.cancelScheduledValues(audioContext.currentTime);
      voiceBus.gain.setValueAtTime(Math.max(voiceBus.gain.value, 0.0001), audioContext.currentTime);
      voiceBus.gain.exponentialRampToValueAtTime(0.0001, stopAt);

      for (const source of sources) {
        try {
          source.stop(stopAt + 0.02);
        } catch {
          // no-op
        }
      }

      window.setTimeout(cleanup, 180);
    },
  };
}

function releaseSustainVoices() {
  for (const voice of activeLoopVoices.values()) {
    voice.stop();
  }

  activeLoopVoices.clear();
}

function buildBounceBus() {
  const input = audioContext.createGain();
  const delay = audioContext.createDelay(0.6);
  delay.delayTime.value = 0.24;

  const feedback = audioContext.createGain();
  feedback.gain.value = 0.42;

  const tone = audioContext.createBiquadFilter();
  tone.type = "lowpass";
  tone.frequency.value = 3200;
  tone.Q.value = 0.45;

  const output = audioContext.createGain();
  output.gain.value = 0.28;

  input.connect(delay);
  delay.connect(tone);
  tone.connect(output);
  output.connect(compressor);
  tone.connect(feedback);
  feedback.connect(delay);

  return input;
}

function buildReverbBus() {
  const input = audioContext.createGain();
  const convolver = audioContext.createConvolver();
  convolver.buffer = createImpulseResponse(audioContext, 1.8, 2.4);

  const highpass = audioContext.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 180;
  highpass.Q.value = 0.35;

  const lowpass = audioContext.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 4600;
  lowpass.Q.value = 0.45;

  const output = audioContext.createGain();
  output.gain.value = 0.34;

  input.connect(convolver);
  convolver.connect(highpass);
  highpass.connect(lowpass);
  lowpass.connect(output);
  output.connect(compressor);

  return input;
}

function createImpulseResponse(context, duration, decay) {
  const length = Math.floor(context.sampleRate * duration);
  const buffer = context.createBuffer(2, length, context.sampleRate);

  for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
    const samples = buffer.getChannelData(channel);

    for (let index = 0; index < length; index += 1) {
      const envelope = Math.pow(1 - index / length, decay);
      samples[index] = (Math.random() * 2 - 1) * envelope;
    }
  }

  return buffer;
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
