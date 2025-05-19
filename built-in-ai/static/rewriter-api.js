const textEl = document.querySelector("#text");
const sharedContextEl = document.querySelector("#shared-context");
const contextEl = document.querySelector("#context");
const toneEl = document.querySelector("#tone");
const formatEl = document.querySelector("#format");
const lengthEl = document.querySelector("#length");
const outputEl = document.querySelector("#output");
const rewriteBtn = document.querySelector("#rewrite");
const stopBtn = document.querySelector("#stop");
const spinnerEl = createSpinner();

addEventListener("load", async () => {
  await checkRewriterAPIAvailability();
  let session = await getRewriterSession();

  let abortController

  stopBtn.addEventListener("click", () => {
    if (abortController) {
      abortController.abort("User stopped the rewriter.");
    }
    abortController = null;
    session.destroy();
    spinnerEl.remove();
  });

  rewriteBtn.addEventListener("click", async () => {
    if (textEl.value === "") {
      return;
    }

    outputEl.textContent = "Rewriting text...";
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
      session = await getRewriterSession({
        tone,
        format,
        length,
        sharedContext: sharedContextEl.value ? sharedContextEl.value.trim() : undefined,
      });
    } catch (e) {
      displaySessionMessage(`Could not create the Rewriter session: ${e}`, true);
      console.error(e);
      spinnerEl.remove();
      return;
    }

    metrics.signalOnAfterSessionCreated();

    try {
      abortController = new AbortController();
      const stream = session.rewriteStreaming(textEl.value, {
        signal: abortController.signal,
        context: contextEl.value ? contextEl.value.trim() : undefined,
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
      displaySessionMessage(`Could not rewrite text: ${e}`, true);
      console.error(e);
      spinnerEl.remove();
    }
  });
});