const textEl = document.querySelector("#content");
const contextEl = document.querySelector("#context");
const typeEl = document.querySelector("#type");
const formatEl = document.querySelector("#format");
const lengthEl = document.querySelector("#length");
const outputEl = document.querySelector("#output");
const summarizeBtn = document.querySelector("#summarize");
const stopBtn = document.querySelector("#stop");
const spinnerEl = createSpinner();

const DEFAULT_TEXT = `The Chicxulub crater is an impact crater buried underneath the Yucatán Peninsula in Mexico. Its center is offshore, but the crater is named after the onshore community of Chicxulub Pueblo (not the larger coastal town of Chicxulub Puerto). It was formed slightly over 66 million years ago when an asteroid, about ten kilometers (six miles) in diameter, struck Earth. The crater is estimated to be 200 kilometers (120 miles) in diameter and 1 kilometer (0.62 miles) in depth. It is believed to be the second largest impact structure on Earth, and the only one whose peak ring is intact and directly accessible for scientific research. 

The crater was discovered by Antonio Camargo and Glen Penfield, geophysicists who had been looking for petroleum in the Yucatán Peninsula during the late 1970s. Penfield was initially unable to obtain evidence that the geological feature was a crater and gave up his search. Later, through contact with Alan R. Hildebrand in 1990, Penfield obtained samples that suggested it was an impact feature. Evidence for the crater's impact origin includes shocked quartz, a gravity anomaly, and tektites in surrounding areas. 

The date of the impact coincides with the Cretaceous–Paleogene boundary (commonly known as the K–Pg or K–T boundary). It is now widely accepted that the devastation and climate disruption resulting from the impact was the primary cause of the Cretaceous–Paleogene extinction event, a mass extinction of 75% of plant and animal species on Earth, including all non-avian dinosaurs. 

From Wikipedia, the free encyclopedia.`;

const DEFAULT_CONTEXT = "This is a Wikipedia article about the Chicxulub crater.";

textEl.value = DEFAULT_TEXT;
contextEl.value = DEFAULT_CONTEXT;

addEventListener("load", async () => {
  await checkSummarizerAPIAvailability();
  let session = await getSummarizerSession();

  let abortController

  stopBtn.addEventListener("click", () => {
    if (abortController) {
      abortController.abort("User stopped the summarization");
    }
    abortController = null;
    session.destroy();
    spinnerEl.remove();
  });

  summarizeBtn.addEventListener("click", async () => {
    if (textEl.value === "") {
      return;
    }

    outputEl.textContent = "Generating summary...";
    outputEl.appendChild(spinnerEl);

    // Destroy the previous session, if any.
    session?.destroy();

    const type = typeEl.value;
    const length = lengthEl.value;
    const format = formatEl.value;
    console.log(`Summarizing with type: ${type}, length: ${length}, format: ${format}`);

    const metrics = new PlaygroundMetrics();
    metrics.signalOnBeforeCreateSession();

    // Create a new session.
    try {
      session = await getSummarizerSession({
        sharedContext: contextEl.value,
        type,
        format,
        length,
      });
    } catch (e) {
      displaySessionMessage(`Could not create the Summarizer session: ${e}`, true);
      console.error(e);
      spinnerEl.remove();
      return;
    }

    metrics.signalOnAfterSessionCreated();

    try {
      abortController = new AbortController();
      const stream = session.summarizeStreaming(textEl.value, {
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
      displaySessionMessage(`Could not summarize the text: ${e}`, true);
      console.error(e);
      spinnerEl.remove();
    }
  });
});