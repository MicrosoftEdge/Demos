// The various error messages.
const ALL_CHANNELS = "available in Microsoft Edge, behind a flag";
const CANARY_ONLY = "available in Microsoft Edge Canary, behind a flag";
const CANARY_DEV_ONLY = "available in Microsoft Edge Canary and Dev, behind a flag";

function enableInstructions(apiName, availability, flagName, docsUrl) {
  return `The ${apiName} API is ${availability}. Enable the <strong>${flagName}</strong> flag at <code>edge://flags</code>, restart the browser, and try again.<br>Please check the <a href='${docsUrl}'>documentation</a> for more information.`;
}

const PROMPT_DOCS_INSTRUCTIONS = enableInstructions("Prompt", ALL_CHANNELS, "Prompt API", "https://learn.microsoft.com/microsoft-edge/web-platform/prompt-api");
const SUMMARIZER_DOCS_INSTRUCTIONS = enableInstructions("Summarizer", ALL_CHANNELS, "Summarizer API", "https://learn.microsoft.com/microsoft-edge/web-platform/writing-assistance-apis");
const WRITER_DOCS_INSTRUCTIONS = enableInstructions("Writer", ALL_CHANNELS, "Writer API", "https://learn.microsoft.com/microsoft-edge/web-platform/writing-assistance-apis");
const REWRITER_DOCS_INSTRUCTIONS = enableInstructions("Rewriter", ALL_CHANNELS, "Rewriter API", "https://learn.microsoft.com/microsoft-edge/web-platform/writing-assistance-apis");
const PROOFREADER_DOCS_INSTRUCTIONS = enableInstructions("Proofreader", CANARY_DEV_ONLY, "Proofreader API", "https://learn.microsoft.com/microsoft-edge/web-platform/proofreader-api");
const SPEECHRECOGNITION_DOCS_INSTRUCTIONS = enableInstructions("SpeechRecognition", CANARY_DEV_ONLY, "Speech Recognition with on-device model", "https://learn.microsoft.com/microsoft-edge/web-platform/speech-recognition-api");
const DECISIONS_ENABLE_INSTRUCTIONS = enableInstructions("Decisions", CANARY_ONLY, "Decisions API", "https://learn.microsoft.com/microsoft-edge/web-platform/decisions-api");
const TRANSLATOR_DOCS_INSTRUCTIONS = "Please check the <a href='https://learn.microsoft.com/microsoft-edge/web-platform/translator-api'>documentation</a> and try again.";
const LANGUAGEDETECTOR_DOCS_INSTRUCTIONS = "Please check the <a href='https://learn.microsoft.com/microsoft-edge/web-platform/languagedetector-api'>documentation</a> and try again.";

const GENERATIVE_MODEL_INSTRUCTIONS = "Check <strong>Settings &gt; Copilot and AI &gt; On-device AI</strong> at <code>edge://settings/ai</code>. If it is off and you want to use local AI, turn it on. Unsupported options, device requirements, disk space, metered connections, or enterprise policies can also block the model. Edge does not report the exact cause. See the <a href='https://support.microsoft.com/en-us/edge/manage-on-device-generative-ai-models-with-edge'>model requirements and settings</a>.";

// This session util script displays error/success/progress messages to the user.
// If the demo page that uses this script already has its own message element, it's used.
// Otherwise, a new one is created and styled.
let demoPageHasItsOwnMessage = false;
function createSessionMessageUI() {
  // In case the demo page already has its own message element.
  const demoPageEl = document.querySelector("#message-ui");
  if (demoPageEl) {
    demoPageHasItsOwnMessage = true;
    return demoPageEl;
  }

  // Otherwise, create a new one, and style it.
  const message = document.createElement("div");
  message.className = "ai-session-message-ui";
  message.style =
    "font-family:system-ui;font-size:1rem;color:black;position:fixed;top:.25rem;right:.25rem;background:#eee;padding:.5rem;border-radius:.25rem;max-width:20rem;box-shadow:0 0 .5rem 0 #0005;";
  document.body.appendChild(message);
  return message;
}

// Display a message to the user.
let sessionMessageEl = null;
let sessionMessageTextEl = null;
let sessionMessageContentEl = null;
let sessionMessageDetailsEl = null;
let lastSessionError = null;
function displaySessionMessage(str, isError = false, announce = true) {
  lastSessionError = null;
  if (!sessionMessageEl) {
    sessionMessageEl = createSessionMessageUI();
    sessionMessageContentEl = document.createElement("div");
    sessionMessageContentEl.className = "ai-session-message-content";
    sessionMessageTextEl = document.createElement("span");
    sessionMessageTextEl.setAttribute("role", "status");
    sessionMessageContentEl.appendChild(sessionMessageTextEl);
    sessionMessageEl.replaceChildren(sessionMessageContentEl);
  }
  sessionMessageTextEl.setAttribute("aria-live", announce ? "polite" : "off");
  sessionMessageTextEl.innerHTML = str;
  sessionMessageDetailsEl?.remove();
  sessionMessageDetailsEl = null;

  if (demoPageHasItsOwnMessage) {
    sessionMessageEl.classList.toggle("error", isError);
  } else {
    sessionMessageEl.style.color = isError ? "red" : "black";
  }
}

function displaySessionError(apiName, operation, error, signal) {
  if (signal?.aborted || error?.name === "AbortError") {
    displaySessionMessage("Stopped.");
    return;
  }
  if (error === lastSessionError) return;

  const info = API_INFO[apiName];
  let message;
  switch (error?.name) {
    case "APIUnavailableError":
      message = window.isSecureContext
        ? `The ${apiName} API is not exposed in this browser. ${info.enableInstructions}`
        : "This API requires a secure page. Open the playground over HTTPS or on localhost.";
      break;
    case "ModelUnavailableError":
      message = `The ${apiName} API is exposed, but its model cannot be used with the current settings and options. ${info.modelInstructions}`;
      break;
    case "APIMethodUnavailableError":
      message = `The browser exposes the ${apiName} API, but does not expose its on-device model methods. Check the browser version and feature support. ${info.enableInstructions}`;
      break;
    case "NotAllowedError":
      message = "Access or model setup was denied. Start the action from this page. Check browser permissions and policies.";
      if (info?.generative) message += ` ${GENERATIVE_MODEL_INSTRUCTIONS}`;
      break;
    case "NotSupportedError":
      message = "The API cannot support this operation with the current settings and options. Check the selected languages and options.";
      if (info) message += ` ${info.modelInstructions}`;
      break;
    case "NetworkError":
      message = "Model setup did not complete. The download may have failed or been cancelled. Check your network connection and download restrictions, then try again.";
      break;
    case "OperationError":
      message = "The model could not be loaded or the operation failed. Try again. If the problem continues, restart the browser.";
      break;
    case "UnknownError":
      message = "Model availability could not be determined. Retry the check.";
      break;
    case "QuotaExceededError":
      message = "The input or context exceeds the model limit. Use less text or a shorter context.";
      break;
    case "NotReadableError":
      message = "The browser could not return a result. The output may have been filtered. Try different input.";
      break;
    case "InvalidStateError":
      message = "The page or session is no longer active. Reload the page or start a new session.";
      break;
    case "TypeError":
    case "RangeError":
    case "SyntaxError":
      message = "The request options or input are not valid. Check the options, language tags, and JSON input.";
      break;
    default:
      message = "The operation failed. See the error details for more information.";
  }

  displaySessionMessage(message, true);
  displaySessionErrorDetails(apiName, operation, error);
  lastSessionError = error;
}

function displaySessionErrorDetails(apiName, operation, error) {
  sessionMessageDetailsEl = document.createElement("details");
  const summary = document.createElement("summary");
  summary.textContent = "Error details";
  const details = document.createElement("div");
  details.textContent = `${apiName}: ${operation}. ${error?.name ? `${error.name}: ` : ""}${error?.message ?? String(error)}`;
  sessionMessageDetailsEl.append(summary, details);
  sessionMessageContentEl.appendChild(sessionMessageDetailsEl);
}

function initializeAPIAvailability(apiName, check) {
  displaySessionMessage("Checking model availability...", false, false);
  const retry = document.createElement("button");
  retry.type = "button";
  retry.className = "ai-session-retry";
  retry.textContent = "Retry";
  retry.setAttribute("aria-label", "Retry model availability check");
  sessionMessageEl.appendChild(retry);

  let checking = false;
  let pending = false;
  async function refresh() {
    if (checking) {
      pending = true;
      return;
    }
    checking = true;
    retry.setAttribute("aria-disabled", "true");
    try {
      do {
        pending = false;
        displaySessionMessage("Checking model availability...", false, false);
        try {
          await check();
        } catch (error) {
          displaySessionError(apiName, "check availability", error);
          console.error(error);
        }
      } while (pending);
    } finally {
      checking = false;
      retry.setAttribute("aria-disabled", "false");
    }
  }

  retry.addEventListener("click", () => {
    if (!checking) void refresh();
  });
  void refresh();
  return refresh;
}

// Utility function to display the model download progress to the user.
// This method is passed as the `monitor` option when creating a model session.
const modelDownloadProgressMonitor = m => {
  m.addEventListener("downloadprogress", e => {
    if (e.total > 0) {
      const current = (e.loaded / e.total) * 100;
      displaySessionMessage(`Model setup in progress (${current.toFixed(1)}%). Please wait.`, false, false);
      if (e.loaded === e.total) {
        displaySessionMessage("Model files are ready. Loading the model...");
      }
    } else {
      displaySessionMessage("Model setup is in progress. Please wait.", false, false);
    }
  });
};

// Default options for the various APIs.
// These options can be overridden by the demo page when creating a session.
const defaultLanguageModelSessionOptions = {
  monitor: modelDownloadProgressMonitor
};
const defaultSummarizerSessionOptions = {
  type: "tldr", // tldr, key-points, teaser, headline.
  length: "long", // short, medium, long.
  format: "plain-text", // plain-text, markdown.
  monitor: modelDownloadProgressMonitor
};
const defaultWriterSessionOptions = {
  tone: "formal", // formal, neutral, casual.
  length: "long", // short, medium, long.
  format: "plain-text", // plain-text, markdown.
  monitor: modelDownloadProgressMonitor
};
const defaultRewriterSessionOptions = {
  tone: "as-is", // as-is, more-formal, more-casual.
  length: "as-is", // as-is, shorter, longer.
  format: "as-is", // as-is, plain-text, markdown.
  monitor: modelDownloadProgressMonitor
};
const defaultProofreaderSessionOptions = {
  expectedInputLanguages: ["en"], // The expected input languages.
  monitor: modelDownloadProgressMonitor
};
const defaultTranslatorSessionOptions = {
  sourceLanguage: "en", // The source language code.
  targetLanguage: "fr", // The target language code.
  monitor: modelDownloadProgressMonitor
};
const defaultLanguageDetectorSessionOptions = {
  monitor: modelDownloadProgressMonitor
};
const defaultDecisionModelSessionOptions = {
  monitor: modelDownloadProgressMonitor
};

const API_INFO = {
  LanguageModel: { defaults: defaultLanguageModelSessionOptions, enableInstructions: PROMPT_DOCS_INSTRUCTIONS, modelInstructions: GENERATIVE_MODEL_INSTRUCTIONS, generative: true, action: "Run" },
  Summarizer: { defaults: defaultSummarizerSessionOptions, enableInstructions: SUMMARIZER_DOCS_INSTRUCTIONS, modelInstructions: GENERATIVE_MODEL_INSTRUCTIONS, generative: true, action: "Summarize" },
  Writer: { defaults: defaultWriterSessionOptions, enableInstructions: WRITER_DOCS_INSTRUCTIONS, modelInstructions: GENERATIVE_MODEL_INSTRUCTIONS, generative: true, action: "Write" },
  Rewriter: { defaults: defaultRewriterSessionOptions, enableInstructions: REWRITER_DOCS_INSTRUCTIONS, modelInstructions: GENERATIVE_MODEL_INSTRUCTIONS, generative: true, action: "Rewrite" },
  Proofreader: { defaults: defaultProofreaderSessionOptions, enableInstructions: PROOFREADER_DOCS_INSTRUCTIONS, modelInstructions: GENERATIVE_MODEL_INSTRUCTIONS, generative: true, action: "Proofread" },
  Translator: { defaults: defaultTranslatorSessionOptions, enableInstructions: TRANSLATOR_DOCS_INSTRUCTIONS, modelInstructions: `The selected language pair may be unsupported, or model downloads or access may be blocked. ${TRANSLATOR_DOCS_INSTRUCTIONS}`, action: "Translate" },
  LanguageDetector: { defaults: defaultLanguageDetectorSessionOptions, enableInstructions: LANGUAGEDETECTOR_DOCS_INSTRUCTIONS, modelInstructions: `The selected languages may be unsupported, or model downloads or access may be blocked. ${LANGUAGEDETECTOR_DOCS_INSTRUCTIONS}`, action: "Detect language" },
  DecisionModel: { defaults: defaultDecisionModelSessionOptions, enableInstructions: DECISIONS_ENABLE_INSTRUCTIONS, modelInstructions: GENERATIVE_MODEL_INSTRUCTIONS, generative: true, action: "Decide" },
  SpeechRecognition: { enableInstructions: SPEECHRECOGNITION_DOCS_INSTRUCTIONS, modelInstructions: "Local recognition may not support the selected language, or access and language-pack installation may be blocked. See the <a href='https://learn.microsoft.com/microsoft-edge/web-platform/speech-recognition-api'>local speech recognition documentation</a>.", action: "Start" }
};

function getAPI(apiName) {
  if (window[apiName]) return window[apiName];
  const error = new Error(`The ${apiName} API is not exposed in this browser.`);
  error.name = "APIUnavailableError";
  throw error;
}

// The following functions check if the  APIs and models are available, and display messages to the user.
// You can call these functions when the page loads if you want to display the status
// to the user early, so they know what to expect (e.g. if their browser supports the APIs).
// These functions don't trigger the model download and do not create sessions.
async function checkAPIAvailability(apiName, options) {
  const info = API_INFO[apiName];
  try {
    const api = getAPI(apiName);
    if (typeof api.availability !== "function") {
      const error = new Error("The availability() method is not exposed.");
      error.name = "APIMethodUnavailableError";
      throw error;
    }
    const availability = await api.availability({ ...info.defaults, ...options });
    displayAPIAvailability(apiName, availability);
    return availability;
  } catch (error) {
    displaySessionError(apiName, "check availability", error);
    throw error;
  }
}

function displayAPIAvailability(apiName, availability) {
  switch (availability) {
    case "unavailable": {
      const error = new Error("The model cannot be used with the current settings and options.");
      error.name = "ModelUnavailableError";
      throw error;
    }
    case "downloadable":
      displaySessionMessage(`Model setup is required for the selected options. Click <strong>${API_INFO[apiName].action}</strong> to continue. Edge may download model files.`);
      break;
    case "downloading":
      displaySessionMessage("Model setup is in progress. Please wait.");
      break;
    case "available":
      displaySessionMessage("The model is available for the selected options.");
      break;
    default:
      throw new DOMException(`Unexpected availability value: ${availability}`, "UnknownError");
  }
}

async function checkLanguageModelAPIAvailability(options) {
  return await checkAPIAvailability("LanguageModel", options);
}

async function checkSummarizerAPIAvailability(options) {
  return await checkAPIAvailability("Summarizer", options);
}

async function checkWriterAPIAvailability(options) {
  return await checkAPIAvailability("Writer", options);
}

async function checkRewriterAPIAvailability(options) {
  return await checkAPIAvailability("Rewriter", options);
}

async function checkProofreaderAPIAvailability(options) {
  return await checkAPIAvailability("Proofreader", options);
}

async function checkTranslatorAPIAvailability(options) {
  return await checkAPIAvailability("Translator", options);
}

async function checkLanguageDetectorAPIAvailability(options) {
  return await checkAPIAvailability("LanguageDetector", options);
}

async function checkDecisionModelAPIAvailability(options) {
  return await checkAPIAvailability("DecisionModel", options);
}

// The following functions create sessions for the APIs, possibly downloading the models first.
async function getSession(apiName, userOptions) {
  const options = { ...API_INFO[apiName].defaults, ...userOptions };
  await checkAPIAvailability(apiName, options);

  try {
    const api = getAPI(apiName);
    if (typeof api.create !== "function") {
      const error = new Error("The create() method is not exposed.");
      error.name = "APIMethodUnavailableError";
      throw error;
    }
    const session = await api.create(options);
    displaySessionMessage("API and model ready.");
    return session;
  } catch (error) {
    displaySessionError(apiName, "create a session", error, options.signal);
    throw error;
  }
}

async function getLanguageModelSession(options) {
  return await getSession("LanguageModel", options);
}

async function getSummarizerSession(options) {
  return await getSession("Summarizer", options);
}

async function getWriterSession(options) {
  return await getSession("Writer", options);
}

async function getRewriterSession(options) {
  return await getSession("Rewriter", options);
}

async function getProofreaderSession(options) {
  return await getSession("Proofreader", options);
}

async function getTranslatorSession(options) {
  return await getSession("Translator", options);
}

async function getLanguageDetectorSession(options) {
  return await getSession("LanguageDetector", options);
}

async function getDecisionModelSession(options) {
  return await getSession("DecisionModel", options);
}