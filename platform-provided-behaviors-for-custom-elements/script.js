// ---- Feature detection ----
const supportsBehaviors = typeof HTMLSubmitButtonBehavior !== "undefined";

if (!supportsBehaviors) {
  document.getElementById("feature-warning").hidden = false;
}

// ---- Custom element definitions ----

if (supportsBehaviors) {
  class MySubmitButton extends HTMLElement {
    static formAssociated = true;

    constructor() {
      super();
      const behavior = new HTMLSubmitButtonBehavior();
      this.attachInternals({ behaviors: [behavior] });
    }
  }
  customElements.define("my-submit-button", MySubmitButton);

  class OverrideSubmitButton extends HTMLElement {
    static formAssociated = true;
    #behavior;

    constructor() {
      super();
      this.#behavior = new HTMLSubmitButtonBehavior();
      this.attachInternals({ behaviors: [this.#behavior] });
    }

    get behavior() { return this.#behavior; }
  }
  customElements.define("override-submit-button", OverrideSubmitButton);

  // Set form override properties on the behavior instances.
  const saveBtn = document.querySelector("#save-btn");
  saveBtn.behavior.name = "action";
  saveBtn.behavior.value = "save";
  saveBtn.behavior.formMethod = "post";

  const draftBtn = document.querySelector("#draft-btn");
  draftBtn.behavior.name = "action";
  draftBtn.behavior.value = "draft";
  draftBtn.behavior.formMethod = "get";

  class ImplicitSubmitButton extends HTMLElement {
    static formAssociated = true;

    constructor() {
      super();
      const behavior = new HTMLSubmitButtonBehavior();
      this.attachInternals({ behaviors: [behavior] });
    }
  }
  customElements.define("implicit-submit-button", ImplicitSubmitButton);

  class A11ySubmitButton extends HTMLElement {
    static formAssociated = true;

    constructor() {
      super();
      const behavior = new HTMLSubmitButtonBehavior();
      this.attachInternals({ behaviors: [behavior] });
    }
  }
  customElements.define("a11y-submit-button", A11ySubmitButton);
}

// ===========================================================================
// Use Case 1: Basic Form Submission
// ===========================================================================

const formBasic = document.getElementById("form-basic");
const basicOutput = document.getElementById("basic-output");
const basicData = document.getElementById("basic-data");

formBasic.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(formBasic);
  const entries = [...data.entries()];

  const submitter = event.submitter;
  let result = "Form entries:\n";
  entries.forEach(([key, val]) => {
    result += `  ${key} = ${val}\n`;
  });
  result += `\nSubmitter: <${submitter?.localName || "unknown"}>`;
  if (submitter?.tagName && !submitter.tagName.includes("-")) {
    result += " (native)";
  } else if (submitter?.tagName) {
    result += " (custom element)";
  }

  basicData.textContent = result;
  basicOutput.hidden = false;
});

// ===========================================================================
// Use Case 2: Form Override Properties
// ===========================================================================

const formOverrides = document.getElementById("form-overrides");
const overridesOutput = document.getElementById("overrides-output");
const overridesData = document.getElementById("overrides-data");

formOverrides.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(formOverrides);
  const entries = [...data.entries()];

  const submitter = event.submitter;
  let result = "Form entries:\n";
  entries.forEach(([key, val]) => {
    result += `  ${key} = ${val}\n`;
  });

  result += `\nSubmitter: <${submitter?.localName || "unknown"}>`;
  result += `\nBehavior name: ${submitter?.behavior?.name || "(none)"}`;
  result += `\nBehavior value: ${submitter?.behavior?.value || "(none)"}`;
  result += `\nBehavior formMethod: ${submitter?.behavior?.formMethod || "(none)"}`;

  overridesData.textContent = result;
  overridesOutput.hidden = false;
});

// ===========================================================================
// Use Case 3: Implicit Submission
// ===========================================================================

const formImplicit = document.getElementById("form-implicit");
const implicitOutput = document.getElementById("implicit-output");
const implicitData = document.getElementById("implicit-data");

formImplicit.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(formImplicit);
  const entries = [...data.entries()];

  let result = "Form entries:\n";
  entries.forEach(([key, val]) => {
    result += `  ${key} = ${val}\n`;
  });
  result += `\nSubmitter: <${event.submitter?.localName || "unknown"}> (custom element)`;

  implicitData.textContent = result;
  implicitOutput.hidden = false;
});

// ===========================================================================
// Use Case 4: Accessibility and Keyboard Activation
// ===========================================================================

const formA11y = document.getElementById("form-a11y");
const a11yOutput = document.getElementById("a11y-output");
const a11yDataOutput = document.getElementById("a11y-data-output");

formA11y.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(formA11y);
  const entries = [...data.entries()];

  let result = "Form entries:\n";
  entries.forEach(([key, val]) => {
    result += `  ${key} = ${val}\n`;
  });
  result += `\nSubmitter: <${event.submitter?.localName || "unknown"}>`;
  result += `\nSubmitter tabIndex: ${event.submitter?.tabIndex ?? "N/A"}`;

  a11yDataOutput.textContent = result;
  a11yOutput.hidden = false;
});

