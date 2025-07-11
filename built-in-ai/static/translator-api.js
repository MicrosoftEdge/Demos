const inputEl = document.querySelector("#input");
const sourceLanguageEl = document.querySelector("#source-language");
const targetLanguageEl = document.querySelector("#target-language");
const outputEl = document.querySelector("#output");
const translateBtn = document.querySelector("#translate");
const stopBtn = document.querySelector("#stop");
const spinnerEl = createSpinner();

addEventListener("load", async () => {
  await checkTranslatorAPIAvailability({
    sourceLanguage: "en",
    targetLanguage: "fr"
  });
  let session = null;

  let abortController

  stopBtn.addEventListener("click", () => {
    if (abortController) {
      abortController.abort("User stopped the translation.");
    }
    abortController = null;
    session?.destroy();
    spinnerEl.remove();
  });

  translateBtn.addEventListener("click", async () => {
    if (inputEl.value === "") {
      return;
    }

    outputEl.textContent = "Translating ...";
    outputEl.appendChild(spinnerEl);

    // Destroy the previous session, if any.
    session?.destroy();

    const sourceLanguage = sourceLanguageEl.value;
    const targetLanguage = targetLanguageEl.value;
    console.log(`Translating from ${sourceLanguage} to ${targetLanguage}.`);

    const metrics = new PlaygroundMetrics();
    metrics.signalOnBeforeCreateSession();

    // Create a new session.
    try {
      session = await getTranslatorSession({
        sourceLanguage,
        targetLanguage
      });
    } catch (e) {
      displaySessionMessage(`Could not create the Translator session: ${e}`, true);
      console.error(e);
      spinnerEl.remove();
      return;
    }

    metrics.signalOnAfterSessionCreated();

    try {
      abortController = new AbortController();
      const stream = session.translateStreaming(inputEl.value, {
        signal: abortController.signal
      });

      metrics.signalOnBeforeStream();

      let isFirstChunk = true;
      for await (const chunk of stream) {
        if (isFirstChunk) {
          spinnerEl.remove();
          isFirstChunk = false;
          outputEl.textContent = "";
        }

        metrics.signalOnStreamChunk();

        outputEl.textContent += chunk;
      }
    } catch (e) {
      displaySessionMessage(`Could not translate the text: ${e}`, true);
      console.error(e);
      spinnerEl.remove();
    }
  });
});