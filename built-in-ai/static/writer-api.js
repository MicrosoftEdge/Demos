const taskEl = document.querySelector("#task");
const toneEl = document.querySelector("#tone");
const formatEl = document.querySelector("#format");
const lengthEl = document.querySelector("#length");
const outputEl = document.querySelector("#output");
const writeBtn = document.querySelector("#write");
const stopBtn = document.querySelector("#stop");
const spinnerEl = createSpinner();

addEventListener("load", async () => {
  const refreshAvailability = initializeAPIAvailability("Writer", () => checkWriterAPIAvailability({
    tone: toneEl.value,
    format: formatEl.value,
    length: lengthEl.value
  }));
  for (const el of [toneEl, formatEl, lengthEl]) {
    el.addEventListener("change", refreshAvailability);
  }
  let session = null;

  let abortController

  stopBtn.addEventListener("click", () => {
    if (abortController) {
      abortController.abort("User stopped the writer.");
    }
    abortController = null;
    session?.destroy();
    spinnerEl.remove();
  });

  writeBtn.addEventListener("click", async () => {
    if (!taskEl.value.trim()) {
      return;
    }

    outputEl.textContent = "Writing text...";
    outputEl.appendChild(spinnerEl);

    // Destroy the previous session, if any.
    session?.destroy();

    const tone = toneEl.value;
    const length = lengthEl.value;
    const format = formatEl.value;
    console.log(`Writing with tone: ${tone}, length: ${length}, format: ${format}`);

    const metrics = new PlaygroundMetrics();
    metrics.signalOnBeforeCreateSession();

    // Create a new session.
    try {
      session = await getWriterSession({
        tone,
        format,
        length,
      });
    } catch (e) {
      console.error(e);
      spinnerEl.remove();
      return;
    }

    metrics.signalOnAfterSessionCreated();

    const controller = new AbortController();
    abortController = controller;
    try {
      const stream = session.writeStreaming(taskEl.value, {
        signal: controller.signal
      });

      metrics.signalOnBeforeStream();

      let isFirstToken = true;
      for await (const token of stream) {
        if (isFirstToken) {
          spinnerEl.remove();
          isFirstToken = false;
          outputEl.textContent = "";
        }

        metrics.signalOnStreamToken();

        outputEl.textContent += token;
      }
    } catch (e) {
      displaySessionError("Writer", "write text", e, controller.signal);
      if (!controller.signal.aborted) console.error(e);
      spinnerEl.remove();
    }
  });
});