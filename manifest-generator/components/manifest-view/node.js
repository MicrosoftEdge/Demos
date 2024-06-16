import "./json-array.js";

// Define a custom element for representing a JSON node
const template = document.createElement("template");
template.innerHTML = `
  <link rel="stylesheet" href="styles/defaults.css" />
  <style>
    .node {
      display: flex;
      flex-direction: row;
      margin-bottom: 1rem;
    }

    .node .key {
      color: #a71d5d;
      font-weight: bold;
      margin-left: 1rem;
      white-space: nowrap;
    }
    .node .value {
      margin-left: 1rem;
    }

  </style>
  <div class="node">
    <span class="key"></span>
    <span class="value"></span>
  </div>
`;
class Node extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.key = this.getAttribute("key");
    this.value = this.getAttribute("value");
    this.render();
  }

  observedAttributes() {
    return ["key", "value"];
  }

  render() {
    const node = this.shadowRoot.querySelector(".node");

    const type = this.getAttribute("type");
    const key = this.shadowRoot.querySelector(".key");
    const value = this.shadowRoot.querySelector(".value");
    key.textContent = `"${this.key}" : `;
    if (type === "object" || type === "array") {
      node.addEventListener("click", (e) => {
        const isCollapsed = node.getAttribute("collapsed") !== null;
        node.toggleAttribute("collapsed");
        if (!isCollapsed) {
          value.innerHTML = "...";
        } else {
          this.renderValue(value, type, this.value);
        }
        e.stopPropagation();
      });
    }
    this.renderValue(value, type, this.value);
  }

  renderValue(element, type, value) {
    if (type === "array") {
      element.innerHTML = `<json-array json="${value}"></json-array>`;
      return;
    }
    if (type === "object") {
      element.innerHTML = `<json-view json="${value}"></json-view>`;
      return;
    }
    element.textContent = value;
  }
}

customElements.define("json-node", Node);

export default Node;
