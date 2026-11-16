const EXAMPLE = {
  input: "Every time I click Pay Now on the checkout page, the tab freezes and I was billed twice on my credit card.",
  context: "You are triaging incoming browser support tickets. Treat production outages, crashes, and duplicate billing charges as urgent.",
  questions: [
    { id: "urgent", prompt: "Does this support ticket require urgent escalation?", type: "boolean" },
    {
      id: "category",
      prompt: "Which category best describes the issue?",
      type: "choice",
      options: [
        { label: "bug", description: "Crash, freeze, or broken functionality" },
        { label: "billing", description: "Duplicate charge, invoice, or payment issue" },
        { label: "feature", description: "Request for new capability" },
        { label: "account", description: "Password reset or login help" }
      ]
    },
    {
      id: "severity",
      prompt: "Rate the customer impact from 1 (minimal) to 5 (critical).",
      type: "score",
      options: [
        { label: "1", description: "Minimal impact" },
        { label: "2", description: "Low impact" },
        { label: "3", description: "Moderate impact" },
        { label: "4", description: "High impact" },
        { label: "5", description: "Critical impact" }
      ]
    }
  ]
};

const inputEl = document.querySelector("#input");
const contextEl = document.querySelector("#context");
const questionsEl = document.querySelector("#questions");
const outputEl = document.querySelector("#output");
const decideBtn = document.querySelector("#decide");
const stopBtn = document.querySelector("#stop");
const spinnerEl = createSpinner();

function createBold(text) {
  const el = document.createElement("strong");
  el.textContent = text;
  return el;
}

function createDecisionBlock(questionId, decision) {
  const block = document.createElement("div");

  block.append(createBold(`${questionId}: ${decision.label}`));
  const meta = [];
  if (typeof decision.confidence === "number") {
    meta.push(`confidence: ${(decision.confidence * 100).toFixed(1)}%`);
  }
  if (typeof decision.expectedScore === "number") {
    meta.push(`expected score: ${decision.expectedScore.toFixed(2)}`);
  }
  if (meta.length > 0) {
    block.append(` (${meta.join(", ")})`);
  }

  if (decision.probabilities && typeof decision.probabilities === "object") {
    for (const [label, probability] of Object.entries(decision.probabilities)) {
      const text = `${label} (${(Number(probability) * 100).toFixed(1)}%)`;
      block.append("\n  ", label === decision.label ? createBold(text) : text);
    }
  }

  return block;
}

function displayResults(results) {
  outputEl.textContent = "";

  Object.entries(results).forEach(([questionId, decision], index) => {
    if (index > 0) {
      outputEl.append("\n");
    }
    outputEl.appendChild(createDecisionBlock(questionId, decision));
  });

  const details = document.createElement("details");
  const summary = document.createElement("summary");
  summary.textContent = "Raw JSON";
  details.append(summary, JSON.stringify(results, null, 2));
  outputEl.appendChild(details);
}

addEventListener("load", async () => {
  inputEl.value = EXAMPLE.input;
  contextEl.value = EXAMPLE.context;
  questionsEl.value = JSON.stringify(EXAMPLE.questions, null, 2);

  try {
    await checkDecisionModelAPIAvailability();
  } catch (e) {
    console.error(e);
  }

  let session = null;
  let sessionKey = "";

  const metrics = new PlaygroundMetrics();
  metrics.setNoStreamMode();

  let abortController = null;

  stopBtn.addEventListener("click", () => {
    abortController?.abort("User stopped the decision");
  });

  decideBtn.addEventListener("click", async () => {
    const input = inputEl.value.trim();
    if (!input) {
      return;
    }

    let questions;
    try {
      questions = JSON.parse(questionsEl.value);
    } catch (e) {
      displaySessionMessage(`The questions are not valid JSON: ${e.message}`, true);
      return;
    }

    outputEl.textContent = "Deciding ...";
    outputEl.appendChild(spinnerEl);

    console.log(`Making decisions about "${input.substring(0, 100)}"...`);

    const options = { questions };
    const context = contextEl.value.trim();
    if (context) {
      options.context = context;
    }
    const nextSessionKey = JSON.stringify(options);

    metrics.signalOnBeforeCreateSession();

    // Reuse the existing session when context and questions are unchanged.
    if (!session || sessionKey !== nextSessionKey) {
      session?.destroy();
      session = null;
      sessionKey = "";

      try {
        session = await getDecisionModelSession(options);
        sessionKey = nextSessionKey;
      } catch (e) {
        displaySessionMessage(`Could not create the DecisionModel session: ${e}`, true);
        console.error(e);
        spinnerEl.remove();
        outputEl.textContent = "";
        return;
      }
    }

    metrics.signalOnAfterSessionCreated();

    const controller = new AbortController();
    abortController = controller;

    try {
      const results = await session.decide(input, { signal: controller.signal });
      controller.signal.throwIfAborted();
      console.log(results);

      spinnerEl.remove();
      metrics.signalOnAfterResult();
      displayResults(results);
    } catch (e) {
      spinnerEl.remove();
      outputEl.textContent = "";
      if (controller.signal.aborted) {
        outputEl.textContent = "Stopped.";
      } else {
        displaySessionMessage(`Could not make a decision about the text: ${e}`, true);
        console.error(e);
      }
    } finally {
      if (abortController === controller) {
        abortController = null;
      }
    }
  });
});
