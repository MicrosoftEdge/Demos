const template = document.createElement("template");
template.innerHTML = `
  <style>
    .node {
      display: flex;
      flex-direction: column;
      margin-bottom: 1rem;
    }

    .node::before {
      content: '[';
    }

    .node::after {
      content: ']';
    }
  </style>
  <div class="node"></div>
`;

class JSONArray extends HTMLElement {
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

  disconnectedCallback() {}

  render() {
    const jsonValue = this.json;
    const arrayNode = this.shadowRoot.querySelector(".node");
    for (let json of jsonValue) {
      const node = document.createElement("json-view");
      node.setAttribute("json", encodeURIComponent(JSON.stringify(json)));
      arrayNode.appendChild(node);
    }
  }

  observedAttributes() {
    return ["json"];
  }
}

customElements.define("json-array", JSONArray);

export default JSONArray;
