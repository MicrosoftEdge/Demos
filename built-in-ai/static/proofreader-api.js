const textEl = document.querySelector("#text");
const outputEl = document.querySelector("#output");
const expectedLanguagesEl = document.querySelector("#expected-languages");
const proofreadBtn = document.querySelector("#proofread");
const stopBtn = document.querySelector("#stop");
const spinnerEl = createSpinner();

addEventListener("load", async () => {
  await checkProofreaderAPIAvailability();
  let session = null;

  const metrics = new PlaygroundMetrics();
  metrics.setNoStreamMode();

  const correctionHighlight = new Highlight();
  CSS.highlights.set("correction-highlight", correctionHighlight);

  textEl.addEventListener("input", () => {
    correctionHighlight.clear();
  });

  proofreadBtn.addEventListener("click", async () => {
    const text = textEl.textContent.trim();

    if (text === "") {
      return;
    }

    outputEl.textContent = "Proofreading text...";
    outputEl.appendChild(spinnerEl);

    // Destroy the previous session, if any.
    session?.destroy();

    const expectedInputLanguages = [...expectedLanguagesEl.selectedOptions].map(option => option.value);

    console.log(`Proofreading text (expected languages: ${expectedInputLanguages}): ${text}`);

    metrics.signalOnBeforeCreateSession();

    // Create a new session.
    try {
      session = await getProofreaderSession({ expectedInputLanguages });
    } catch (e) {
      displaySessionMessage(`Could not create the Proofreader session: ${e}`, true);
      console.error(e);
      spinnerEl.remove();
      return;
    }

    metrics.signalOnAfterSessionCreated();

    try {
      const proofreadResult = await session.proofread(text);

      spinnerEl.remove();
      metrics.signalOnAfterResult();
      outputEl.textContent = proofreadResult.correctedInput;

      for (const correction of proofreadResult.corrections) {
        const range = new Range();
        range.setStart(textEl.firstChild, correction.startIndex);
        range.setEnd(textEl.firstChild, correction.endIndex);
        
        correctionHighlight.add(range);
      }
    } catch (e) {
      displaySessionMessage(`Could not proofread text: ${e}`, true);
      console.error(e);
      spinnerEl.remove();
    }
  });
});
