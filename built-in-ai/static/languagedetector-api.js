const textEl = document.querySelector("#text");
const outputEl = document.querySelector("#output");
const detectBtn = document.querySelector("#detect");
const spinnerEl = createSpinner();

function prettyLanguageName(languageTag) {
  const displayNames = new Intl.DisplayNames(["en"], {
    type: "language"
  });
  return displayNames.of(languageTag);
}

addEventListener("load", async () => {
  await checkLanguageDetectorAPIAvailability();
  let session = null;

  const metrics = new PlaygroundMetrics();
  metrics.setNoStreamMode();

  detectBtn.addEventListener("click", async () => {
    if (!textEl.value.trim()) {
      return;
    }

    outputEl.textContent = "Detecting ...";
    outputEl.appendChild(spinnerEl);

    // Destroy the previous session, if any.
    session?.destroy();

    console.log(`Detecting languages in "${textEl.value.substring(0, 100)}"...`);

    metrics.signalOnBeforeCreateSession();

    // Create a new session.
    try {
      session = await getLanguageDetectorSession();
    } catch (e) {
      displaySessionMessage(`Could not create the LanguageDetector session: ${e}`, true);
      console.error(e);
      spinnerEl.remove();
      return;
    }

    metrics.signalOnAfterSessionCreated();

    try {
      const results = await session.detect(textEl.value.trim());
      console.log(results);

      spinnerEl.remove();
      metrics.signalOnAfterResult();
      outputEl.textContent = "";

      for (const { detectedLanguage, confidence } of results) {
        if (detectedLanguage === "und") {
          continue;
        }

        const resultEl = document.createElement("div");
        resultEl.textContent = `${prettyLanguageName(detectedLanguage)} (${(confidence * 100).toFixed(2)}%)`;
        outputEl.appendChild(resultEl);
      }
    } catch (e) {
      displaySessionMessage(`Could not detect the language of the text: ${e}`, true);
      console.error(e);
      spinnerEl.remove();
    }
  });
});
