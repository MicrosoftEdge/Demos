// A split app-view to show the manifest viewer in the right pane and the editor in the left pane.

import "./manifest-view/index.js";
import "./navigation-view.js";
import "./page-view.js";
import "./styled-button.js";

const template = document.createElement("template");
template.innerHTML = `
  <link rel="stylesheet" href="styles/defaults.css" />
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
    <navigation-view current-id="page-1" page-selector="page-view">
      <page-view page-id="page-1" title="Page 1">
        <p slot="text">Page 1</p>
      </page-view> 
      <page-view page-id="page-2" title="Page 2">
        <p slot="text">Page 2</p>
      </page-view>
    </navigation-view>
    <manifest-view></manifest-view>
  </div>
`;

class AppView extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.navigationView = this.shadowRoot.querySelector("navigation-view");

    this.pageIds = ["page-1", "page-2"];
    this.currentPageIdIndex = 0;

    this.navigationView.addEventListener("next", () => this.nextPage());
    this.navigationView.addEventListener("prev", () => this.prevPage());
    this.navigationView.addEventListener("skip", () => this.skipPage());
  }

  nextPage() {
    this.jumpToPage(
      Math.min(this.currentPageIdIndex + 1, this.pageIds.length - 1)
    );
  }

  prevPage() {
    this.jumpToPage(Math.max(this.currentPageIdIndex - 1, 0));
  }

  skipPage() {
    this.jumpToPage(
      Math.min(this.currentPageIdIndex + 1, this.pageIds.length - 1)
    );
  }

  jumpToPage(pageIndex) {
    this.currentPageIdIndex = pageIndex;
    this.navigationView.setAttribute(
      "current-id",
      this.pageIds[this.currentPageIdIndex]
    );
  }
}

customElements.define("app-view", AppView);
