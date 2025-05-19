const promptEl = document.querySelector("#prompt");
const systemPromptEl = document.querySelector("#system-prompt");
const initialPromptsEl = document.querySelector("#initial-prompts");
const responseSchemaEl = document.querySelector("#response-schema");
const topKEl = document.querySelector("#top-k");
const temperatureEl = document.querySelector("#temperature");
const runBtn = document.querySelector("#run");
const stopBtn = document.querySelector("#stop");
const nShotExampleEl = document.querySelector("#n-shot-example");
const responseSchemaExampleEl = document.querySelector("#response-schema-example");
const outputEl = document.querySelector("#output");
const spinnerEl = createSpinner();

const N_SHOT_EXAMPLE = {
  prompt: "Back to the drawing board.",
  system: "",
  initial: [
    { role: "system", content: "Predict up to 5 emojis as a response to a comment. Output emojis, comma-separated." },
    { role: "user", content: "This is amazing!" },
    { role: "assistant", content: "❤️, ➕" },
    { role: "user", content: "LGTM" },
    { role: "assistant", content: "👍, 🚢" }
  ]
};

const RESPONSE_SCHEMA_EXAMPLE = {
  prompt: "Ordered a Philly cheesesteak, and it was not edible. Their milkshake is just milk with cheap syrup. Horrible place!",
  system: "You are an AI model designed to analyze the sentiment of user-provided text. Your goal is to classify the sentiment into predefined categories and provide a confidence score. Follow these guidelines:\n\n- Identify whether the sentiment is positive, negative, or neutral.\n- Provide a confidence score (0-1) reflecting the certainty of the classification.\n- Ensure the sentiment classification is contextually accurate.\n- If the sentiment is unclear or highly ambiguous, default to neutral.\n\nYour responses should be structured and concise, adhering to the defined output schema.",
  schema: {
    "type": "object",
    "required": ["sentiment", "confidence"],
    "additionalProperties": false,
    "properties": {
      "sentiment": {
        "type": "string",
        "enum": ["positive", "negative", "neutral"],
        "description": "The sentiment classification of the input text."
      },
      "confidence": {
        "type": "number",
        "minimum": 0,
        "maximum": 1,
        "description": "A confidence score indicating certainty of the sentiment classification."
      }
    }
  }
};

nShotExampleEl.addEventListener("click", () => {
  promptEl.value = N_SHOT_EXAMPLE.prompt;
  systemPromptEl.value = N_SHOT_EXAMPLE.system;
  initialPromptsEl.value = JSON.stringify(N_SHOT_EXAMPLE.initial, null, 2);
  responseSchemaEl.value = "";
});

responseSchemaExampleEl.addEventListener("click", () => {
  promptEl.value = RESPONSE_SCHEMA_EXAMPLE.prompt;
  systemPromptEl.value = RESPONSE_SCHEMA_EXAMPLE.system;
  initialPromptsEl.value = "";
  responseSchemaEl.value = JSON.stringify(RESPONSE_SCHEMA_EXAMPLE.schema, null, 2);
});

function linkRangewithNumber(rangeEl, numberEl) {
  rangeEl.addEventListener("input", () => {
    numberEl.value = rangeEl.value;
  });
  numberEl.addEventListener("input", () => {
    rangeEl.value = numberEl.value;
  });
}
linkRangewithNumber(temperatureEl, temperatureEl.nextElementSibling);
linkRangewithNumber(topKEl, topKEl.nextElementSibling);

addEventListener("load", async () => {
  await checkLanguageModelAPIAvailability();

  // Getting a session to show the download progress.
  let session = await getLanguageModelSession();
  let abortController;

  stopBtn.addEventListener("click", () => {
    if (abortController) {
      abortController.abort("User stopped the conversation");
    }
    abortController = null;
    session.destroy();
    spinnerEl.remove();
  });

  runBtn.addEventListener("click", async () => {
    if (promptEl.value === "") {
      return;
    }

    outputEl.textContent = "Generating response...";
    outputEl.appendChild(spinnerEl);

    // Destroy the previous session, if any.
    session?.destroy();

    const temperature = parseFloat(temperatureEl.value);
    const topK = parseInt(topKEl.value);
    const systemPrompt = systemPromptEl.value ? systemPromptEl.value.trim() : undefined;
    let initialPrompts = null;
    try {
      initialPrompts = initialPromptsEl.value ? JSON.parse(initialPromptsEl.value) : undefined;
    } catch (e) {
      displaySessionMessage(`Invalid initialPrompts JSON: ${e}`, true);
      console.error(e);
      spinnerEl.remove();
      return;
    }

    let responseConstraint = null;
    try {
      responseConstraint = responseSchemaEl.value ? JSON.parse(responseSchemaEl.value) : undefined;
    } catch (e) {
      displaySessionMessage(`Invalid responseSchema JSON: ${e}`, true);
      console.error(e);
      spinnerEl.remove();
      return;
    }

    // If both systemPrompt and initialPrompts are present, use systemPrompt only.
    // Both go into the session's initialPrompt option, so only one can be used.
    if (systemPrompt) {
      initialPrompts = [
        { role: 'system', content: systemPrompt }
      ];
    }

    console.log("Prompting with the following settings", { temperature, topK, initialPrompts, responseConstraint });

    const metrics = new PlaygroundMetrics();
    metrics.signalOnBeforeCreateSession();

    // Create a new session.
    try {
      session = await getLanguageModelSession({
        temperature,
        topK,
        initialPrompts
      });
    } catch (e) {
      displaySessionMessage(`Could not create the LanguageModel session: ${e}`, true);
      console.error(e);
      spinnerEl.remove();
      return;
    }

    metrics.signalOnAfterSessionCreated();

    try {
      abortController = new AbortController();
      const stream = session.promptStreaming(promptEl.value, {
        signal: abortController.signal,
        responseConstraint
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
      displaySessionMessage(`Could not generate a response: ${e}`, true);
      console.error(e);
      spinnerEl.remove();
    }
  });
});