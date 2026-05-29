const outputEl = document.querySelector("#output");
const audioSourceRowEl = document.querySelector("#audio-source-row");
const audioSourceEl = document.querySelector("#audio-source");
const audioFileRowEl = document.querySelector("#audio-file-row");
const mediaFileEl = document.querySelector("#media-file");
const inputLanguageEl = document.querySelector("#input-language");
const startBtn = document.querySelector("#start");
const stopBtn = document.querySelector("#stop");

const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

const LANGUAGE_MAP = {
  en: "en-US",
  fr: "fr-FR",
  es: "es-ES",
};

let recognition = null;
let isRecognizing = false;
let finalTranscript = "";
let currentObjectUrl = "";
let fileAudioCtx = null;
let fileAudioEl = null;

function getRecognitionLanguage() {
  return LANGUAGE_MAP[inputLanguageEl.value] || "en-US";
}

function updateAudioSourceUI() {
  const isFileSource = audioSourceEl.value === "file";

  audioFileRowEl.classList.toggle("is-visible", isFileSource);
  audioFileRowEl.setAttribute("aria-hidden", String(!isFileSource));
  mediaFileEl.disabled = !isFileSource;
  audioSourceRowEl.classList.toggle("no-separator", isFileSource);

  if (!isFileSource) {
    mediaFileEl.value = "";
    cleanupFileSource();
  }
}

function updateButtonState() {
  const isFileSource = audioSourceEl.value === "file";
  const hasFile = !!mediaFileEl.files?.length;
  startBtn.disabled = !SpeechRecognitionAPI || isRecognizing || (isFileSource && !hasFile);
  stopBtn.disabled = !isRecognizing;
}

function cleanupFileSource() {
  if (fileAudioEl) {
    fileAudioEl.pause();
    fileAudioEl.removeAttribute("src");
    fileAudioEl.load();
    fileAudioEl = null;
  }

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

async function getAudioTrackFromSelectedFile() {
  const file = mediaFileEl.files?.[0];
  if (!file) {
    throw new Error("Please select a media file first.");
  }

  cleanupFileSource();

  fileAudioEl = document.createElement("audio");
  fileAudioEl.preload = "auto";
  fileAudioEl.crossOrigin = "anonymous";

  currentObjectUrl = URL.createObjectURL(file);
  fileAudioEl.src = currentObjectUrl;

  await new Promise((resolve, reject) => {
    const onCanPlay = () => {
      cleanupListeners();
      resolve();
    };
    const onError = () => {
      cleanupListeners();
      reject(new Error("Could not load the selected audio file."));
    };

    const cleanupListeners = () => {
      fileAudioEl.removeEventListener("canplay", onCanPlay);
      fileAudioEl.removeEventListener("error", onError);
    };

    fileAudioEl.addEventListener("canplay", onCanPlay);
    fileAudioEl.addEventListener("error", onError);
    fileAudioEl.load();
  });

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    throw new Error("Web Audio API is required to recognize speech from a file.");
  }

  fileAudioCtx = new AudioContextClass();
  const source = fileAudioCtx.createMediaElementSource(fileAudioEl);
  const destination = fileAudioCtx.createMediaStreamDestination();

  source.connect(destination);
  source.connect(fileAudioCtx.destination);

  const [track] = destination.stream.getAudioTracks();
  if (!track) {
    throw new Error("No audio track was found in the selected file.");
  }

  fileAudioEl.onended = () => {
    stopRecognition();
  };

  await fileAudioEl.play();
  return track;
}

async function startRecognition() {
  if (!SpeechRecognitionAPI || isRecognizing) {
    return;
  }

  const lang = getRecognitionLanguage();

  // Check if the on-device model is available
  if (typeof SpeechRecognitionAPI.available === "function") {
    try {
      const availability = await SpeechRecognitionAPI.available({
        langs: [lang],
        processLocally: true,
      });
      console.log(`Model availability for ${lang}: ${availability}`);

      if (availability === "downloadable") {
        displaySessionMessage(
          `The on-device speech model for ${lang} needs to be installed first. Installing...`,
          false
        );
        const installed = await SpeechRecognitionAPI.install({
          langs: [lang],
          processLocally: true,
        });
        if (!installed) {
          displaySessionMessage("Failed to install the speech model.", true);
          return;
        }
        displaySessionMessage("Speech model installed. Starting recognition...");
      } else if (availability !== "available") {
        displaySessionMessage(
          `On-device speech model is not available for ${lang}. Please ensure the model is installed or try a different language.`,
          true
        );
        return;
      }
    } catch (err) {
      console.error("Availability check error:", err);
      displaySessionMessage(
        `Could not check model availability: ${err.message}`,
        true
      );
      return;
    }
  }

  recognition = new SpeechRecognitionAPI();
  recognition.lang = lang;
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.processLocally = true;

  recognition.onstart = () => {
    isRecognizing = true;
    updateButtonState();
    console.log(`Recognition started with language: ${recognition.lang}`);
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
    isRecognizing = false;
    updateButtonState();
    cleanupFileSource();
    displaySessionMessage("Recognition stopped.");
  };

  finalTranscript = "";
  outputEl.textContent = "";

  try {
    if (audioSourceEl.value === "file") {
      const track = await getAudioTrackFromSelectedFile();
      recognition.start(track);
    } else {
      recognition.start();
    }
  } catch (error) {
    cleanupFileSource();
    displaySessionMessage(`Could not start speech recognition: ${error.message}`, true);
  }
}

addEventListener("load", async () => {
  updateAudioSourceUI();
  if (!SpeechRecognitionAPI) {
    displaySessionMessage("The SpeechRecognition API is not available in this browser.", true);
  } else {
    displaySessionMessage("SpeechRecognition API ready.");
  }

  audioSourceEl.addEventListener("change", () => {
    updateAudioSourceUI();
    updateButtonState();
  });

  mediaFileEl.addEventListener("change", updateButtonState);
  inputLanguageEl.addEventListener("change", () => {
    if (isRecognizing) {
      stopRecognition();
    }
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
