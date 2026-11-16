const PRESETS = {
  support: {
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
  },
  security: {
    input: "User initiated download of invoice_update_installer.exe from http://198.51.100.42/payload/",
    context: "Unsigned executables (.exe/.scr) from unknown or IP-literal hosts are high risk (10). Verified documentation pages are low risk (0).",
    questions: [
      { id: "should_warn", prompt: "Should the browser display a prominent security warning?", type: "boolean" },
      {
        id: "threat_type",
        prompt: "What is the primary risk category?",
        type: "choice",
        options: [
          { label: "untrusted_binary", description: "Executable from unverified origin" },
          { label: "phishing", description: "Credential harvesting page" },
          { label: "benign", description: "Normal safe browsing activity" }
        ]
      },
      {
        id: "risk_score",
        prompt: "Assign a numeric risk weight (0 = safe, 5 = moderate, 10 = severe).",
        type: "score",
        options: [
          { label: "0", description: "Safe" },
          { label: "5", description: "Moderate risk" },
          { label: "10", description: "Severe risk" }
        ]
      }
    ]
  },
  feedback: {
    input: "The new vertical tabs layout in Edge saves so much screen space and feels super snappy!",
    context: "Evaluate user-submitted review comments for constructive feedback, product area, and overall satisfaction.",
    questions: [
      { id: "is_positive", prompt: "Is the overall feedback positive?", type: "boolean" },
      {
        id: "topic",
        prompt: "Which product area is mentioned?",
        type: "choice",
        options: [
          { label: "tabs_ux", description: "Tab strip, vertical tabs, or window layout" },
          { label: "networking", description: "Proxy, DNS, or page loading errors" },
          { label: "extensions", description: "Browser add-ons" },
          { label: "ai_features", description: "Built-in AI or Copilot tools" }
        ]
      },
      {
        id: "satisfaction",
        prompt: "Rate user satisfaction from 1 (very dissatisfied) to 5 (very satisfied).",
        type: "score",
        options: [
          { label: "1", description: "Very dissatisfied" },
          { label: "2", description: "Dissatisfied" },
          { label: "3", description: "Neutral" },
          { label: "4", description: "Satisfied" },
          { label: "5", description: "Very satisfied" }
        ]
      }
    ]
  },
  release: {
    input: "Release v2.8.15 reduces translation latency by 35% and passes all 136 automated regression tests with 0 unexpected errors across 9,959 decoding steps.",
    context: "Evaluate engineering release notes to determine whether a feature is ready for production rollout and which quality pillar it primarily advances.",
    questions: [
      { id: "ready_to_ship", prompt: "Does the evidence indicate this release is ready to ship?", type: "boolean" },
      {
        id: "pillar",
        prompt: "Which engineering pillar is the primary focus?",
        type: "choice",
        options: [
          { label: "performance", description: "Throughput, latency, or memory improvements" },
          { label: "reliability", description: "Crash fixes, regression coverage, or stability" },
          { label: "compliance", description: "Privacy, security, or policy governance" },
          { label: "ux", description: "Visual design or layout polish" }
        ]
      },
      {
        id: "confidence_rating",
        prompt: "Rate release readiness confidence from 1 (low) to 5 (high).",
        type: "score",
        options: [
          { label: "1", description: "Very low confidence" },
          { label: "2", description: "Low confidence" },
          { label: "3", description: "Moderate confidence" },
          { label: "4", description: "High confidence" },
          { label: "5", description: "Very high confidence" }
        ]
      }
    ]
  }
};

const presetEl = document.querySelector("#preset");
const inputEl = document.querySelector("#input");
const contextEl = document.querySelector("#context");
const questionsEl = document.querySelector("#questions");
const outputEl = document.querySelector("#output");
const decideBtn = document.querySelector("#decide");
const spinnerEl = createSpinner();

function loadPreset(name) {
  const preset = PRESETS[name];
  inputEl.value = preset.input;
  contextEl.value = preset.context;
  questionsEl.value = JSON.stringify(preset.questions, null, 2);
}

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
  loadPreset(presetEl.value);
  presetEl.addEventListener("change", () => loadPreset(presetEl.value));

  try {
    await checkDecisionModelAPIAvailability();
  } catch (e) {
    console.error(e);
  }

  let session = null;
  let sessionKey = "";

  const metrics = new PlaygroundMetrics();
  metrics.setNoStreamMode();

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

    try {
      const results = await session.decide(input);
      console.log(results);

      spinnerEl.remove();
      metrics.signalOnAfterResult();
      displayResults(results);
    } catch (e) {
      displaySessionMessage(`Could not make a decision about the text: ${e}`, true);
      console.error(e);
      spinnerEl.remove();
      outputEl.textContent = "";
    }
  });
});
