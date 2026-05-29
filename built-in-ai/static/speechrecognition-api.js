const outputEl = document.querySelector("#output");
const audioSourceRowEl = document.querySelector("#audio-source-row");
const audioSourceEl = document.querySelector("#audio-source");
const audioFileRowEl = document.querySelector("#audio-file-row");
const mediaPlayerRowEl = document.querySelector("#media-player-row");
const mediaFileEl = document.querySelector("#media-file");
const mediaPlayerEl = document.querySelector("#media-player");
const inputLanguageEl = document.querySelector("#input-language");
const startBtn = document.querySelector("#start");
const stopBtn = document.querySelector("#stop");
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
const readyLangs = new Set();

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

async function ensureModelReady(lang) {
  if (readyLangs.has(lang)) {
    return true;
  }

  if (!SpeechRecognitionAPI) {
    displaySessionMessage("The SpeechRecognition API is not available in this browser.", true);
    return false;
  }

  if (typeof SpeechRecognitionAPI.available !== "function") {
    readyLangs.add(lang);
    return true;
  }

  setStartButtonState("checking");
  displaySessionMessage(`Checking availability for ${lang}...`);

  let availability;
  try {
    availability = await SpeechRecognitionAPI.available({
      langs: [lang],
      processLocally: true,
    });
    console.log(`Model availability for ${lang}: ${availability}`);
  } catch (error) {
    displaySessionMessage(`Could not check model availability: ${error.message}`, true);
    return false;
  }

  if (availability === "available") {
    readyLangs.add(lang);
    return true;
  }

  if (availability === "downloadable" || availability === "downloading") {
    if (typeof SpeechRecognitionAPI.install !== "function") {
      displaySessionMessage(
        `On-device model for ${lang} needs installation, but install() is not available in this browser.`,
        true,
      );
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
        displaySessionMessage(`Failed to install on-device model for ${lang}.`, true);
        return false;
      }
    } catch (error) {
      displaySessionMessage(`Install failed: ${error.message}`, true);
      return false;
    }

    readyLangs.add(lang);
    return true;
  }

  displaySessionMessage(`On-device model is not available for ${lang}.`, true);
  return false;
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
    mediaPlayerEl.removeAttribute("src");
    mediaPlayerEl.load();
    cleanupFileSource();
  }
}

function updateButtonState() {
  const isFileSource = audioSourceEl.value === "file";
  const hasFile = !!mediaFileEl.files?.length;
  const isActive = isRecognizing || isStarting;

  startBtn.disabled = !SpeechRecognitionAPI || isRecognizing || isStarting || (isFileSource && !hasFile);
  stopBtn.disabled = !isActive;

  // Move the prominent style to the currently relevant action.
  startBtn.classList.toggle("ai-button", !isActive);
  stopBtn.classList.toggle("ai-button", isActive);
}

function cleanupFileSource() {
  if (fileAudioCtx) {
    fileAudioCtx.close().catch(() => {});
    fileAudioCtx = null;
  }

  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = "";
  }
}

function stopRecognition() {
  if (recognition && isRecognizing) {
    recognition.stop();
  }
}

function onMediaFilePicked() {
  cleanupFileSource();

  const file = mediaFileEl.files?.[0];
  if (!file) {
    mediaPlayerEl.removeAttribute("src");
    mediaPlayerEl.load();
    updateButtonState();
    return;
  }

  currentObjectUrl = URL.createObjectURL(file);
  mediaPlayerEl.src = currentObjectUrl;
  mediaPlayerEl.load();
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
  if (!fileAudioCtx || !fileAudioCtx._source) {
    return;
  }

  prepareMeter("Listening to media file...");

  if (!fileAudioCtx._meterAnalyser) {
    const analyser = fileAudioCtx.createAnalyser();
    analyser.fftSize = 1024;
    fileAudioCtx._source.connect(analyser);
    fileAudioCtx._meterAnalyser = analyser;
  }

  meterAnalyser = fileAudioCtx._meterAnalyser;
  startMeterLoop();
}

async function getAudioTrackFromSelectedFile() {
  if (!mediaPlayerEl.src) {
    throw new Error("Please select a media file first.");
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    throw new Error("Web Audio API is required to recognize speech from a file.");
  }

  if (!fileAudioCtx) {
    fileAudioCtx = new AudioContextClass();
    const source = fileAudioCtx.createMediaElementSource(mediaPlayerEl);
    const destination = fileAudioCtx.createMediaStreamDestination();

    source.connect(destination);
    source.connect(fileAudioCtx.destination);

    fileAudioCtx._source = source;
    fileAudioCtx._destination = destination;
  }

  if (fileAudioCtx.state === "suspended") {
    await fileAudioCtx.resume();
  }

  const [track] = fileAudioCtx._destination.stream.getAudioTracks();
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
    isStarting = false;
    console.log(`Recognition error: ${event.error}`);
    const commonErrorMessages = {
      "no-speech": "No speech was detected.",
      "audio-capture": "No microphone was found.",
      "not-allowed": "Permission to use audio input was denied.",
      "language-not-supported": "The selected language is not supported.",
    };

    const message = commonErrorMessages[event.error] || `Speech recognition error: ${event.error}`;
    displaySessionMessage(message, true);
  };

  recognition.onend = () => {
    isStarting = false;
    isRecognizing = false;
    updateButtonState();

    if (audioSourceEl.value === "file") {
      try {
        mediaPlayerEl.pause();
      } catch {
        // no-op
      }
    }

    stopMeter();
    displaySessionMessage("Recognition stopped.");
  };

  try {
    isStarting = true;
    updateButtonState();

    if (audioSourceEl.value === "file") {
      const track = await getAudioTrackFromSelectedFile();
      mediaPlayerEl.currentTime = 0;
      mediaPlayerEl.onended = () => stopRecognition();
      await mediaPlayerEl.play();
      recognition.start(track);
      startFileMeter();
    } else {
      recognition.start();
      startMicMeter();
    }
  } catch (error) {
    isStarting = false;
    isRecognizing = false;
    updateButtonState();
    stopMeter();
    displaySessionMessage(`Could not start speech recognition: ${error.message}`, true);
  }
}

addEventListener("load", async () => {
  setStartButtonState("idle");
  updateAudioSourceUI();

  if (!SpeechRecognitionAPI) {
    displaySessionMessage("The SpeechRecognition API is not available in this browser.", true);
  } else {
    displaySessionMessage("SpeechRecognition API ready. Click Start to begin.");
  }

  audioSourceEl.addEventListener("change", () => {
    updateAudioSourceUI();
    updateButtonState();
  });

  mediaFileEl.addEventListener("change", onMediaFilePicked);
  inputLanguageEl.addEventListener("change", () => {
    if (isRecognizing) {
      stopRecognition();
    }
    readyLangs.clear();
  });

  startBtn.addEventListener("click", async event => {
    event.preventDefault();
    await startRecognition();
  });

  stopBtn.addEventListener("click", event => {
    event.preventDefault();
    stopRecognition();
  });

  outputEl.textContent = "";
  updateButtonState();
});
