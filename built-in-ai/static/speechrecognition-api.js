const outputEl = document.querySelector("#output");
const audioSourceRowEl = document.querySelector("#audio-source-row");
const audioSourceEl = document.querySelector("#audio-source");
const audioFileRowEl = document.querySelector("#audio-file-row");
const mediaPlayerRowEl = document.querySelector("#media-player-row");
const mediaFileEl = document.querySelector("#media-file");
const mediaPlayerEl = document.querySelector("#media-player");
const audioPlayerEl = document.querySelector("#audio-player");
const inputLanguageEl = document.querySelector("#input-language");
const startBtn = document.querySelector("#start");
const stopBtn = document.querySelector("#stop");
const resetBtn = document.querySelector("#reset");
const meterEl = document.querySelector("#audio-meter");
const meterBarEl = document.querySelector("#audio-meter-bar");
const meterPeakEl = document.querySelector("#audio-meter-peak");
const meterHintEl = document.querySelector("#audio-meter-hint");

const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = null;
let isRecognizing = false;
let isStarting = false;
let finalTranscript = "";
let currentObjectUrl = "";
let fileAudioCtx = null;
let fileAudioVideoSource = null; // MediaElementSourceNode for video
let fileAudioAudioSource = null; // MediaElementSourceNode for audio
let fileAudioDestination = null; // Shared MediaStreamDestination
let fileAudioVideoMeter = null; // Analyser node for video meter
let fileAudioAudioMeter = null; // Analyser node for audio meter
let activePreviewType = "";

let meterRafId = 0;
let meterBuffer = null;
let meterAnalyser = null;
let meterMicStream = null;
let meterMicCtx = null;
let meterPeak = 0;
let meterSessionId = 0;

function getRecognitionLanguage() {
  return inputLanguageEl.value;
}

function setStartButtonState(state) {
  isStarting = state === "checking" || state === "installing";

  if (state === "checking") {
    startBtn.textContent = "Checking...";
  } else if (state === "installing") {
    startBtn.textContent = "Installing...";
  } else {
    startBtn.textContent = "Start";
  }

  updateButtonState();
}

async function checkSpeechModelAvailability(lang = getRecognitionLanguage()) {
  if (!SpeechRecognitionAPI) {
    const error = new Error("The SpeechRecognition API is not exposed in this browser.");
    error.name = "APIUnavailableError";
    throw error;
  }

  if (typeof SpeechRecognitionAPI.available !== "function" || !("processLocally" in SpeechRecognitionAPI.prototype)) {
    const error = new Error("The local speech recognition methods are not exposed.");
    error.name = "APIMethodUnavailableError";
    throw error;
  }

  const availability = await SpeechRecognitionAPI.available({
    langs: [lang],
    processLocally: true,
  });
  console.log(`Model availability for ${lang}: ${availability}`);
  displayAPIAvailability("SpeechRecognition", availability);
  return availability;
}

async function ensureModelReady(lang) {
  setStartButtonState("checking");

  let availability;
  try {
    availability = await checkSpeechModelAvailability(lang);
  } catch (error) {
    displaySessionError("SpeechRecognition", "check local model availability", error);
    console.error(error);
    return false;
  }

  if (availability === "available") {
    return true;
  }

  if (availability === "downloadable" || availability === "downloading") {
    if (typeof SpeechRecognitionAPI.install !== "function") {
      const error = new Error("The install() method is not exposed.");
      error.name = "APIMethodUnavailableError";
      displaySessionError("SpeechRecognition", "install the local model", error);
      return false;
    }

    setStartButtonState("installing");
    displaySessionMessage(`Installing on-device model for ${lang}...`);

    try {
      const installed = await SpeechRecognitionAPI.install({
        langs: [lang],
        processLocally: true,
      });

      if (!installed) {
        displaySessionMessage(`Local model installation for ${lang} did not complete. Check your network connection, browser permissions, and download restrictions, then click Start to try again. The browser did not report a cause.`, true);
        return false;
      }
    } catch (error) {
      displaySessionError("SpeechRecognition", "install the local model", error);
      console.error(error);
      return false;
    }

    return true;
  }

}

function updateAudioSourceUI() {
  const isFileSource = audioSourceEl.value === "file";

  audioFileRowEl.classList.toggle("is-visible", isFileSource);
  mediaPlayerRowEl.classList.toggle("is-visible", isFileSource);
  audioFileRowEl.setAttribute("aria-hidden", String(!isFileSource));
  mediaPlayerRowEl.setAttribute("aria-hidden", String(!isFileSource));
  mediaFileEl.disabled = !isFileSource;
  audioSourceRowEl.classList.toggle("no-separator", isFileSource);

  if (!isFileSource) {
    mediaFileEl.value = "";
    activePreviewType = "";
    for (const previewEl of [mediaPlayerEl, audioPlayerEl]) {
      previewEl.pause();
      previewEl.removeAttribute("src");
      previewEl.load();
      previewEl.hidden = true;
    }
    cleanupFileSource();
  }
}

function updateButtonState() {
  const isFileSource = audioSourceEl.value === "file";
  const hasFile = !!mediaFileEl.files?.length;
  const isActive = isRecognizing || isStarting;

  startBtn.disabled = !SpeechRecognitionAPI || isRecognizing || isStarting || (isFileSource && !hasFile);
  stopBtn.disabled = !isRecognizing;

  // Move the prominent style to the currently relevant action.
  startBtn.classList.toggle("ai-button", !isActive);
  stopBtn.classList.toggle("ai-button", isActive);
}

function cleanupFileSource() {
  // Clear previews and object URLs, but keep the AudioContext alive for reuse
  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = "";
  }
}

async function initializeFileAudioContext() {
  // Create the AudioContext and media sources once, then reuse them.
  if (fileAudioCtx) {
    return; // Already initialized
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    throw new Error("Web Audio API is required to recognize speech from a file.");
  }

  fileAudioCtx = new AudioContextClass();
  fileAudioDestination = fileAudioCtx.createMediaStreamDestination();

  // Create sources for both preview elements
  fileAudioVideoSource = fileAudioCtx.createMediaElementSource(mediaPlayerEl);
  fileAudioAudioSource = fileAudioCtx.createMediaElementSource(audioPlayerEl);

  // Create analyser nodes for metering
  fileAudioVideoMeter = fileAudioCtx.createAnalyser();
  fileAudioVideoMeter.fftSize = 1024;
  fileAudioAudioMeter = fileAudioCtx.createAnalyser();
  fileAudioAudioMeter.fftSize = 1024;

  // Connect video source
  fileAudioVideoSource.connect(fileAudioVideoMeter);
  fileAudioVideoSource.connect(fileAudioDestination);
  fileAudioVideoSource.connect(fileAudioCtx.destination);

  // Connect audio source
  fileAudioAudioSource.connect(fileAudioAudioMeter);
  fileAudioAudioSource.connect(fileAudioDestination);
  fileAudioAudioSource.connect(fileAudioCtx.destination);

  if (fileAudioCtx.state === "suspended") {
    await fileAudioCtx.resume();
  }
}

function stopRecognition() {
  if (recognition && isRecognizing) {
    recognition.stop();
  }
}

// Full page-state reset without reloading: stop recognition, clear the
// transcript and file picker, and tear down audio contexts.
function resetAll() {
  if (recognition && isRecognizing) {
    try { recognition.abort(); } catch { /* no-op */ }
  }
  recognition = null;
  isRecognizing = false;
  isStarting = false;

  finalTranscript = "";
  outputEl.textContent = "";

  // Clear file picker + previews + cached audio context.
  mediaFileEl.value = "";
  activePreviewType = "";
  for (const previewEl of [mediaPlayerEl, audioPlayerEl]) {
    try { previewEl.pause(); } catch { /* no-op */ }
    previewEl.removeAttribute("src");
    previewEl.load();
    previewEl.hidden = true;
  }
  cleanupFileSource();
  if (fileAudioCtx) {
    fileAudioCtx.close().catch(() => {});
    fileAudioCtx = null;
    fileAudioVideoSource = null;
    fileAudioAudioSource = null;
    fileAudioDestination = null;
    fileAudioVideoMeter = null;
    fileAudioAudioMeter = null;
  }

  stopMeter();
  setStartButtonState("idle");
  updateAudioSourceUI();
  updateButtonState();
  displaySessionMessage("Reset.");
}

function onMediaFilePicked() {
  cleanupFileSource();

  const file = mediaFileEl.files?.[0];
  if (!file) {
    activePreviewType = "";
    for (const previewEl of [mediaPlayerEl, audioPlayerEl]) {
      previewEl.pause();
      previewEl.removeAttribute("src");
      previewEl.load();
      previewEl.hidden = true;
    }
    updateButtonState();
    return;
  }

  const isVideo = file.type.startsWith("video/");
  activePreviewType = isVideo ? "video" : "audio";
  const activePreviewEl = isVideo ? mediaPlayerEl : audioPlayerEl;
  const inactivePreviewEl = isVideo ? audioPlayerEl : mediaPlayerEl;

  inactivePreviewEl.pause();
  inactivePreviewEl.removeAttribute("src");
  inactivePreviewEl.load();
  inactivePreviewEl.hidden = true;

  currentObjectUrl = URL.createObjectURL(file);
  activePreviewEl.src = currentObjectUrl;
  activePreviewEl.load();
  activePreviewEl.hidden = false;
  updateButtonState();
}

function startMeterLoop() {
  if (!meterAnalyser || !meterEl || !meterBarEl || !meterPeakEl || !meterHintEl) {
    return;
  }

  meterBuffer = new Uint8Array(meterAnalyser.fftSize);
  meterEl.classList.remove("is-idle");
  meterHintEl.textContent = "Listening to input...";

  const tick = () => {
    if (!meterAnalyser) {
      return;
    }

    meterAnalyser.getByteTimeDomainData(meterBuffer);
    let sumSquares = 0;
    for (let i = 0; i < meterBuffer.length; i++) {
      const sample = (meterBuffer[i] - 128) / 128;
      sumSquares += sample * sample;
    }

    const rms = Math.sqrt(sumSquares / meterBuffer.length);
    const level = Math.min(1, rms * 2.8);
    const percent = Math.round(level * 100);
    meterBarEl.style.width = `${percent}%`;

    meterPeak = Math.max(level, meterPeak - 0.014);
    const peakPct = Math.round(meterPeak * 100);
    meterPeakEl.style.left = `calc(${peakPct}% - 2px)`;
    meterPeakEl.style.opacity = meterPeak > 0.02 ? "0.8" : "0";

    meterEl.setAttribute("aria-valuenow", String(percent));
    meterRafId = requestAnimationFrame(tick);
  };

  meterRafId = requestAnimationFrame(tick);
}

function prepareMeter(message) {
  if (!meterEl || !meterBarEl || !meterPeakEl || !meterHintEl) {
    return;
  }

  meterEl.classList.remove("is-idle");
  meterHintEl.textContent = message || "Preparing input...";
  meterBarEl.style.width = "0%";
  meterPeakEl.style.opacity = "0";
}

function stopMeter() {
  if (!meterEl || !meterBarEl || !meterPeakEl || !meterHintEl) {
    return;
  }

  meterSessionId++;
  if (meterRafId) {
    cancelAnimationFrame(meterRafId);
    meterRafId = 0;
  }

  meterAnalyser = null;
  meterBuffer = null;
  meterPeak = 0;
  meterBarEl.style.width = "0%";
  meterPeakEl.style.opacity = "0";
  meterEl.classList.add("is-idle");
  meterEl.setAttribute("aria-valuenow", "0");
  meterHintEl.textContent = "Idle";

  if (meterMicStream) {
    meterMicStream.getTracks().forEach(track => track.stop());
    meterMicStream = null;
  }

  if (meterMicCtx) {
    meterMicCtx.close().catch(() => {});
    meterMicCtx = null;
  }
}

async function startMicMeter() {
  const session = ++meterSessionId;
  prepareMeter("Requesting microphone access...");

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass || !navigator.mediaDevices?.getUserMedia) {
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (session !== meterSessionId) {
      stream.getTracks().forEach(track => track.stop());
      return;
    }

    meterMicStream = stream;
    meterMicCtx = new AudioContextClass();
    const src = meterMicCtx.createMediaStreamSource(meterMicStream);
    meterAnalyser = meterMicCtx.createAnalyser();
    meterAnalyser.fftSize = 1024;
    src.connect(meterAnalyser);
    startMeterLoop();
  } catch (error) {
    if (session === meterSessionId && meterHintEl) {
      meterHintEl.textContent = `Meter unavailable: ${error.message}`;
    }
  }
}

function startFileMeter() {
  ++meterSessionId;
  if (!fileAudioCtx) {
    return;
  }

  prepareMeter("Listening to media file...");

  // Use the appropriate analyser based on which preview type is active
  meterAnalyser = activePreviewType === "audio" ? fileAudioAudioMeter : fileAudioVideoMeter;
  startMeterLoop();
}

async function getAudioTrackFromSelectedFile() {
  const previewEl = activePreviewType === "audio" ? audioPlayerEl : mediaPlayerEl;

  if (!previewEl.src) {
    throw new Error("Please select a media file first.");
  }

  // Initialize the AudioContext and sources once
  await initializeFileAudioContext();

  // Resume if suspended (user gesture may have happened)
  if (fileAudioCtx.state === "suspended") {
    await fileAudioCtx.resume();
  }

  const [track] = fileAudioDestination.stream.getAudioTracks();
  if (!track) {
    throw new Error("No audio track was found in the selected file.");
  }

  return track;
}

async function startRecognition() {
  if (!SpeechRecognitionAPI || isRecognizing || isStarting) {
    return;
  }

  const lang = getRecognitionLanguage();

  const isReady = await ensureModelReady(lang);
  setStartButtonState("idle");
  if (!isReady) {
    return;
  }

  recognition = new SpeechRecognitionAPI();
  recognition.lang = lang;
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.processLocally = true;
  let recognitionHadError = false;

  recognition.onstart = () => {
    isStarting = false;
    isRecognizing = true;
    finalTranscript = "";
    outputEl.textContent = "";
    updateButtonState();
    displaySessionMessage(
      audioSourceEl.value === "file"
        ? "Recognizing speech from the selected file..."
        : "Listening... Speak now."
    );
  };

  recognition.onresult = event => {
    let interimTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }

    outputEl.textContent = `${finalTranscript}${interimTranscript}`;
  };

  recognition.onerror = event => {
    recognitionHadError = true;
    isStarting = false;
    console.log(`Recognition error: ${event.error}`);
    const commonErrorMessages = {
      "no-speech": "No speech was detected. Check the audio source and try again.",
      "audio-capture": "Audio input could not be captured. Check the microphone and its permissions.",
      "not-allowed": "Speech recognition was denied. Check microphone permissions and browser policies.",
      "service-not-allowed": "The requested speech recognition service cannot be used. Check local model setup, permissions, and browser policies.",
      "language-not-supported": "Local recognition cannot use the selected language. Its language pack may be missing or the language may be unsupported. Click Start to check setup again.",
      "network": "Speech recognition failed because of a network error. Check the connection and try again.",
      "aborted": "Stopped.",
    };

    const message = commonErrorMessages[event.error];
    if (message) {
      displaySessionMessage(message, event.error !== "aborted");
      if (event.error !== "aborted") {
        displaySessionErrorDetails("SpeechRecognition", "recognize speech", { name: event.error, message: event.message || "" });
      }
    } else {
      displaySessionError("SpeechRecognition", "recognize speech", new Error(`${event.error}: ${event.message || ""}`));
    }
  };

  recognition.onend = () => {
    isStarting = false;
    isRecognizing = false;
    updateButtonState();

    if (audioSourceEl.value === "file") {
      const previewEl = activePreviewType === "audio" ? audioPlayerEl : mediaPlayerEl;
      try {
        previewEl.pause();
      } catch {
        // no-op
      }
    }

    stopMeter();
    if (!recognitionHadError) displaySessionMessage("Recognition stopped.");
  };

  try {
    isStarting = true;
    updateButtonState();

    if (audioSourceEl.value === "file") {
      const previewEl = activePreviewType === "audio" ? audioPlayerEl : mediaPlayerEl;
      const track = await getAudioTrackFromSelectedFile();
      previewEl.currentTime = 0;
      previewEl.onended = () => stopRecognition();
      await previewEl.play();
      recognition.start(track);
      startFileMeter();
    } else {
      recognition.start();
      startMicMeter();
    }
  } catch (error) {
    isStarting = false;
    isRecognizing = false;
    recognition = null;
    updateButtonState();
    stopMeter();
    displaySessionError("SpeechRecognition", "start speech recognition", error);
    console.error(error);
  }
}

addEventListener("load", async () => {
  setStartButtonState("idle");
  updateAudioSourceUI();

  const refreshAvailability = initializeAPIAvailability("SpeechRecognition", checkSpeechModelAvailability);

  audioSourceEl.addEventListener("change", () => {
    updateAudioSourceUI();
    updateButtonState();
  });

  mediaFileEl.addEventListener("change", onMediaFilePicked);
  inputLanguageEl.addEventListener("change", () => {
    if (isRecognizing) {
      stopRecognition();
    }
    void refreshAvailability();
  });

  startBtn.addEventListener("click", async event => {
    event.preventDefault();
    await startRecognition();
  });

  stopBtn.addEventListener("click", event => {
    event.preventDefault();
    stopRecognition();
  });

  resetBtn.addEventListener("click", event => {
    event.preventDefault();
    resetAll();
  });

  outputEl.textContent = "";
  updateButtonState();
});
