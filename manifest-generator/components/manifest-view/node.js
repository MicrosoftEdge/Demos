// Define a custom element for representing a JSON node
const template = document.createElement("template");
template.innerHTML = `
  <link rel="stylesheet" href="styles/defaults.css" />
  <style>
    .node {
      display: flex;
      flex-direction: column;
      margin-bottom: 1rem;
    }

    .node[collapsed] .value {
      display: none;
    }

    .node .collapser::before {
      content: '-';
    }

    .node[collapsed] .collapser::before {
      content: '+';
    }

    .node .key {
      color: #a71d5d;
      font-weight: bold;
    }
    .node .value {
      margin-left: 1rem;
    }

    .node .collapser {
      cursor: pointer;
      user-select: none;
      font-size: 1.5rem;
      color: #a71d5d;
    }
  </style>
  <div class="node">
    <div>
    <span class="collapser"></span>
    <span class="key"></span>
    </div>
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
    console.log("connected");
    this.key = this.getAttribute("key");
    this.value = this.getAttribute("value");
    if (this.getAttribute("type") === "array") {
      this.shadowRoot.querySelector(".node").setAttribute("collapsed", "");
    }
    this.render();
  }

  disconnectedCallback() {
    console.log("disconnected");
  }

  observedAttributes() {
    return ["key", "value"];
  }

  render() {
    const node = this.shadowRoot.querySelector(".node");
    node.addEventListener("click", (e) => {
      node.toggleAttribute("collapsed");
      e.stopPropagation();
    });

    const type = this.getAttribute("type");
    const key = this.shadowRoot.querySelector(".key");
    const value = this.shadowRoot.querySelector(".value");
    key.textContent = this.key;
    if (type === "array") {
      const jsonValue = JSON.parse(decodeURIComponent(this.value));
      for (let json of jsonValue) {
        document.createElement("json-view");
        value.innerHTML += `<json-view json="${encodeURIComponent(
          JSON.stringify(json)
        )}"></json-view>`;
      }
      return;
    }
    if (type === "object") {
      document.createElement("json-view");
      value.innerHTML = `<json-view json="${encodeURIComponent(
        this.value
      )}"></json-view>`;
      return;
    }
    value.textContent = this.value;
  }
}

customElements.define("json-node", Node);

export default Node;
