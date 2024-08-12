import "./styled-button.js";

const template = document.createElement("template");
template.innerHTML = `
  <link rel="stylesheet" href="styles/defaults.css" />
  <style> 
    .left-pane {
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .page-wrapper {
      flex-grow: 1;
    }

    .nav-bar {
      display: grid;
      padding: 10px;
      width: 100%;
      grid-template-columns: 1fr auto auto; 
    }

    #prev, #skip, #next {
      justify-self: start;
    } 
  </style>
  <div class="left-pane">
    <div class="page-wrapper">
      <slot></slot>
    </div>
    <div class="nav-bar">
      <styled-button type="secondary" id="prev">prev</styled-button>
      <styled-button type="secondary" id="skip">skip</styled-button>
      <styled-button type="primary" id="next">next</styled-button>
    </div>
  </div>
`;

const attributes = {
  currentId: {
    name: "current-id",
    required: true,
  },
  pageSelector: {
    name: "page-selector",
    required: true,
  },
};

class NavigationView extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(template.content.cloneNode(true));
    this.prevButton = this.shadowRoot.querySelector("#prev");
    this.nextButton = this.shadowRoot.querySelector("#next");
    this.skipButton = this.shadowRoot.querySelector("#skip");

    this.prevButton.addEventListener("click", () => {
      this.shadowRoot.dispatchEvent(
        new CustomEvent("prev", {
          composed: true,
          bubbles: true,
        })
      );
    });

    this.nextButton.addEventListener("click", () => {
      this.shadowRoot.dispatchEvent(
        new CustomEvent("next", {
          composed: true,
          bubbles: true,
        })
      );
    });

    this.skipButton.addEventListener("click", () => {
      this.shadowRoot.dispatchEvent(
        new CustomEvent("skip", {
          composed: true,
          bubbles: true,
        })
      );
    });

    this.shadowRoot.querySelector("slot").addEventListener("slotchange", () => {
      this.togglePage(this.currentId);
    });
  }

  static get observedAttributes() {
    return Object.values(attributes).map((opt) => opt.name);
  }

  // This method doesn't validate any form inputs, just html attributes.
  validateAttributes(changedValue) {
    Object.entries(attributes).forEach(([field, opts]) => {
      if (changedValue !== undefined && opts.name !== changedValue) return;
      const attribute = this.getAttribute(opts.name);
      if (opts.required && !attribute)
        throw new Error(
          `Attribute ${opts.name} should be set in component ${this.tagName}`
        );
      this[field] = attribute;
    });
  }

  togglePage(id) {
    const pages = this.querySelectorAll(this.pageSelector);
    pages.forEach((page) => {
      page.toggleAttribute("hidden", page.pageId !== id);
    });
  }

  connectedCallback() {
    this.validateAttributes();
  }

  attributeChangedCallback(attr, oldVal, newVal) {
    this.validateAttributes();
    if (oldVal !== null && attr == attributes.currentId.name) {
      this.togglePage(newVal);
    }
  }
}

customElements.define("navigation-view", NavigationView);
