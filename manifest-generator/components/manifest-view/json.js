import "./node.js";

// Define a custom element for representing a JSON document
const template = document.createElement("template");
template.innerHTML = `
  <link rel="stylesheet" href="styles/defaults.css" />
  <style>
    .json {
      padding: 1rem;
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
    }
    .json::before {
      content: '{';
    }
    .json::after {
      content: '}';
    }
  </style>
  <div class="json"></div>
`;

class JSONView extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const jsonValue = this.getAttribute("json");
    this.json = JSON.parse(decodeURIComponent(jsonValue));

    this.render();
  }

  render() {
    const jsonView = this.shadowRoot.querySelector(".json");
    jsonView.addEventListener("click", (e) => {
      const isCollapsed = jsonView.getAttribute("collapsed") !== null;
      jsonView.toggleAttribute("collapsed");
      if (isCollapsed) {
        jsonView.innerHTML = "";
        this.renderNodes(jsonView, this.json);
      } else {
        jsonView.innerHTML = "...";
      }
      e.stopPropagation();
    });

    this.renderNodes(jsonView, this.json);
  }

  renderNodes(jsonView, json) {
    Object.keys(json).forEach((key) => {
      const node = document.createElement("json-node");
      var nodeType = typeof json[key];
      // find if object is an array
      if (Array.isArray(json[key])) {
        nodeType = "array";
      }
      node.setAttribute("type", nodeType);
      // if the value is an object, add values recursively
      if (nodeType === "object" || nodeType === "array") {
        node.setAttribute("key", key);
        node.setAttribute(
          "value",
          encodeURIComponent(JSON.stringify(json[key]))
        );
        jsonView.appendChild(node);
        return;
      }
      node.setAttribute("key", key);
      node.setAttribute("value", json[key]);
      jsonView.appendChild(node);
    });
  }
}

customElements.define("json-view", JSONView);

export default JSONView;
