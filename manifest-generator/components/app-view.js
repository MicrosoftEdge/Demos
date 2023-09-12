// A split app-view to show the manifest viewer in the right pane and the editor in the left pane.

import "./manifest-view/index.js";

const template = document.createElement("template");
template.innerHTML = `
  <style>
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    .app-view {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .app-view > * {
      flex: 1;
      overflow: auto;
    }
    
    .app-view > *:first-child {
      border-right: 1px solid #eee;
    }
  </style>
  <div class="app-view">
    <placeholder-component></placeholder-component>
    <manifest-view></manifest-view>
  </div>
`;

class AppView extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    console.log("connected");
  }

  disconnectedCallback() {
    console.log("disconnected");
  }

  render() {
    console.log("render");
  }
}

customElements.define("app-view", AppView);
