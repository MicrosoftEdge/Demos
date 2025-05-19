const taskEl = document.querySelector("#task");
const toneEl = document.querySelector("#tone");
const formatEl = document.querySelector("#format");
const lengthEl = document.querySelector("#length");
const outputEl = document.querySelector("#output");
const writeBtn = document.querySelector("#write");
const stopBtn = document.querySelector("#stop");
const spinnerEl = createSpinner();

addEventListener("load", async () => {
  await checkWriterAPIAvailability();
  let session = await getWriterSession();

  let abortController

  stopBtn.addEventListener("click", () => {
    if (abortController) {
      abortController.abort("User stopped the writer.");
    }
    abortController = null;
    session.destroy();
    spinnerEl.remove();
  });

  writeBtn.addEventListener("click", async () => {
    if (taskEl.value === "") {
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
      displaySessionMessage(`Could not create the Writer session: ${e}`, true);
      console.error(e);
      spinnerEl.remove();
      return;
    }

    metrics.signalOnAfterSessionCreated();

    try {
      abortController = new AbortController();
      const stream = session.writeStreaming(taskEl.value, {
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
      displaySessionMessage(`Could not write text: ${e}`, true);
      console.error(e);
      spinnerEl.remove();
    }
  });
});