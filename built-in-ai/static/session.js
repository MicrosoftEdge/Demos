// The various error messages.
const PROMPT_DOCS_INSTRUCTIONS = "Please check the <a href='https://learn.microsoft.com/microsoft-edge/web-platform/prompt-api'>documentation</a> and try again.";
const WA_DOCS_INSTRUCTIONS = "Please check the <a href='https://learn.microsoft.com/microsoft-edge/web-platform/writing-assistance-apis'>documentation</a> and try again.";
const TRANSLATOR_DOCS_INSTRUCTIONS = "Please check the <a href='https://learn.microsoft.com/microsoft-edge/web-platform/writing-assistance-apis'>documentation</a> and try again.";

const ERR_LANGUAGEMODEL_API_NOT_DETECTED = `The LanguageModel API is not available. ${PROMPT_DOCS_INSTRUCTIONS}`;
const ERR_LANGUAGEMODEL_MODEL_NOT_AVAILABLE = `The LanguageModel API is enabled, but the model download hasn't started yet, maybe awaiting device capability check. ${PROMPT_DOCS_INSTRUCTIONS}`;
const INFO_LANGUAGE_MODEL_DOWNLOADABLE =  "The model will be downloaded the first time the API is used.";

const ERR_SUMMARIZER_API_NOT_DETECTED = `The Summarizer API is not available. ${WA_DOCS_INSTRUCTIONS}`;
const ERR_SUMMARIZER_MODEL_NOT_AVAILABLE = `The Summarizer API is enabled, but the model download hasn't started yet, maybe awaiting device capability check. ${WA_DOCS_INSTRUCTIONS}`;
const INFO_SUMMARIZER_MODEL_DOWNLOADABLE =  "The model will be downloaded the first time the API is used.";

const ERR_WRITER_API_NOT_DETECTED = `The Writer API is not available. ${WA_DOCS_INSTRUCTIONS}`;
const ERR_WRITER_MODEL_NOT_AVAILABLE = `The Writer API is enabled, but the model download hasn't started yet, maybe awaiting device capability check. ${WA_DOCS_INSTRUCTIONS}`;
const INFO_WRITER_MODEL_DOWNLOADABLE =  "The model will be downloaded the first time the API is used.";

const ERR_REWRITER_API_NOT_DETECTED = `The Rewriter API is not available. ${WA_DOCS_INSTRUCTIONS}`;
const ERR_REWRITER_MODEL_NOT_AVAILABLE = `The Rewriter API is enabled, but the model download hasn't started yet, maybe awaiting device capability check. ${WA_DOCS_INSTRUCTIONS}`;
const INFO_REWRITER_MODEL_DOWNLOADABLE =  "The model will be downloaded the first time the API is used.";

const ERR_TRANSLATOR_API_NOT_DETECTED = `The Translator API is not available. ${WA_DOCS_INSTRUCTIONS}`;
const ERR_TRANSLATOR_MODEL_NOT_AVAILABLE = `The Translator API is enabled, but the model download hasn't started yet, maybe awaiting device capability check. ${TRANSLATOR_DOCS_INSTRUCTIONS}`;
const INFO_TRANSLATOR_MODEL_DOWNLOADABLE =  "The model for a specified language pair will be downloaded the first time the API is used.";

const ERR_API_CAPABILITY_ERROR = "Cannot create the session now. API availability error: ";
const ERR_FAILED_CREATING_MODEL = "Could not create the session. Error: ";

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
function displaySessionMessage(str, isError = false) {
  if (!sessionMessageEl) {
    sessionMessageEl = createSessionMessageUI();
  }
  sessionMessageEl.innerHTML = `<span>${str}</span>`;

  if (demoPageHasItsOwnMessage) {
    sessionMessageEl.classList.toggle("error", isError);
  } else {
    sessionMessageEl.style.color = isError ? "red" : "black";
  }
}

// Utility function to display the model download progress to the user.
// This method is passed as the `monitor` option when creating a model session.
const modelDownloadProgressMonitor = m => {
  m.addEventListener("downloadprogress", e => {
    const current = (e.loaded / e.total) * 100;
    displaySessionMessage(`Model downloading (${current.toFixed(1)}%). Please wait.`);
    if (e.loaded == e.total) {
      displaySessionMessage("Model downloaded. You can now use the API.");
    }
  });
};

// Default options for the various APIs.
// These options can be overridden by the demo page when creating a session.
const defaultLanguageModelSessionOptions = {
  temperature: 1.0,
  topK: 1,
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
const defaultTranslatorSessionOptions = {
  sourceLanguage: "en", // The source language code.
  targetLanguage: "fr", // The target language code.
  monitor: modelDownloadProgressMonitor
};

// These APIs used to be under window.ai, but have then moved to window.
// The following functions return the API object, depending on where it is found.
function getLanguageModelAPI() {
  if (window.LanguageModel) return window.LanguageModel;
  if (window.ai && window.ai.languageModel) return window.ai.languageModel;
  displaySessionMessage(ERR_LANGUAGEMODEL_API_NOT_DETECTED, true);
  throw ERR_LANGUAGEMODEL_API_NOT_DETECTED;
}

function getSummarizerAPI() {
  if (window.Summarizer) return window.Summarizer;
  if (window.ai && window.ai.summarizer) return window.ai.summarizer;
  displaySessionMessage(ERR_SUMMARIZER_API_NOT_DETECTED, true);
  throw ERR_SUMMARIZER_API_NOT_DETECTED;
}

function getWriterAPI() {
  if (window.Writer) return window.Writer;
  if (window.ai && window.ai.writer) return window.ai.writer;
  displaySessionMessage(ERR_WRITER_API_NOT_DETECTED, true);
  throw ERR_WRITER_API_NOT_DETECTED;
}

function getRewriterAPI() {
  if (window.Rewriter) return window.Rewriter;
  if (window.ai && window.ai.rewriter) return window.ai.rewriter;
  displaySessionMessage(ERR_REWRITER_API_NOT_DETECTED, true);
  throw ERR_REWRITER_API_NOT_DETECTED;
}

function getTranslatorAPI() {
  if (window.Translator) return window.Translator;
  if (window.ai && window.ai.translator) return window.ai.translator;
  displaySessionMessage(ERR_TRANSLATOR_API_NOT_DETECTED, true);
  throw ERR_TRANSLATOR_API_NOT_DETECTED;
}

// The following functions check if the  APIs and models are available, and display messages to the user.
// You can call these functions when the page loads if you want to display the status
// to the user early, so they know what to expect (e.g. if their browser supports the APIs).
// These functions don't trigger the model download and do not create sessions.
async function checkAPIAvailability(api, modelError, availabilityOptions, modelDownloadableInfo) {
  const availability = await api.availability(availabilityOptions);

  // The API is available, but the model is not.
  if (availability === "unavailable") {
    displaySessionMessage(modelError, true);
    throw modelError;
  }

  // The API and model seem to be available, but the model can't be used for some reason.
  if (availability !== "downloadable" && availability !== "downloading" && availability !== "available") {
    displaySessionMessage(ERR_API_CAPABILITY_ERROR + availability, true);
    throw ERR_API_CAPABILITY_ERROR + availability;
  }

  // Everything seems to be fine.
  let message = `On-device API and model ${availability}.`;
  if (availability === "downloadable") {
    message += ` ${modelDownloadableInfo}`;
  }

  displaySessionMessage(message);

  return availability;
}

async function checkLanguageModelAPIAvailability() {
  const availability = await checkAPIAvailability(
    getLanguageModelAPI(),
    ERR_LANGUAGEMODEL_MODEL_NOT_AVAILABLE,
    undefined,
    INFO_LANGUAGE_MODEL_DOWNLOADABLE
  );
  return availability;
}

async function checkSummarizerAPIAvailability() {
  const availability = await checkAPIAvailability(
    getSummarizerAPI(),
    ERR_SUMMARIZER_MODEL_NOT_AVAILABLE,
    undefined,
    INFO_SUMMARIZER_MODEL_DOWNLOADABLE
  );
  return availability;
}

async function checkWriterAPIAvailability() {
  const availability = await checkAPIAvailability(
    getWriterAPI(),
    ERR_WRITER_MODEL_NOT_AVAILABLE,
    undefined,
    INFO_WRITER_MODEL_DOWNLOADABLE
  );
  return availability;
}

async function checkRewriterAPIAvailability() {
  const availability = await checkAPIAvailability(
    getRewriterAPI(),
    ERR_REWRITER_MODEL_NOT_AVAILABLE,
    undefined,
    INFO_REWRITER_MODEL_DOWNLOADABLE
  );
  return availability;
}

async function checkTranslatorAPIAvailability(availabilityOptions) {
  const availability = await checkAPIAvailability(
    getTranslatorAPI(),
    ERR_TRANSLATOR_MODEL_NOT_AVAILABLE,
    availabilityOptions,
    INFO_TRANSLATOR_MODEL_DOWNLOADABLE
  );
  return availability;
}

// The following functions create sessions for the APIs, possibly downloading the models first.
async function getSession(api, defaultOptions, userOptions) {
  let session = null;

  // Overriding the default options with the ones passed by the demo page.
  options = Object.assign({}, defaultOptions, userOptions)

  try {
    session = await api.create(options);
  } catch (e) {
    displaySessionMessage(ERR_FAILED_CREATING_MODEL + e, true);
    throw "Can't create model session: " + e;
  }

  displaySessionMessage("API and model ready.");

  return session;
}

async function getLanguageModelSession(options) {
  await checkLanguageModelAPIAvailability();
  return await getSession(getLanguageModelAPI(), defaultLanguageModelSessionOptions, options);
}

async function getSummarizerSession(options) {
  await checkSummarizerAPIAvailability();
  return await getSession(getSummarizerAPI(), defaultSummarizerSessionOptions, options);
}

async function getWriterSession(options) {
  await checkWriterAPIAvailability();
  return await getSession(getWriterAPI(), defaultWriterSessionOptions, options);
}

async function getRewriterSession(options) {
  await checkRewriterAPIAvailability();
  return await getSession(getRewriterAPI(), defaultRewriterSessionOptions, options);
}

async function getTranslatorSession(options) {
  await checkTranslatorAPIAvailability({
    sourceLanguage: options.sourceLanguage,
    targetLanguage: options.targetLanguage
  });
  return await getSession(getTranslatorAPI(), defaultTranslatorSessionOptions, options);
}
