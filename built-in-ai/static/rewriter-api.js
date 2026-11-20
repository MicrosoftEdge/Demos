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
  const refreshAvailability = initializeAPIAvailability("Rewriter", () => checkRewriterAPIAvailability({
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
      abortController.abort("User stopped the rewriter.");
    }
    abortController = null;
    session?.destroy();
    spinnerEl.remove();
  });

  rewriteBtn.addEventListener("click", async () => {
    if (!textEl.value.trim()) {
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
      console.error(e);
      spinnerEl.remove();
      return;
    }

    metrics.signalOnAfterSessionCreated();

    const controller = new AbortController();
    abortController = controller;
    try {
      const stream = session.rewriteStreaming(textEl.value, {
        signal: controller.signal,
        context: contextEl.value ? contextEl.value.trim() : undefined,
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
      displaySessionError("Rewriter", "rewrite text", e, controller.signal);
      if (!controller.signal.aborted) console.error(e);
      spinnerEl.remove();
    }
  });
});