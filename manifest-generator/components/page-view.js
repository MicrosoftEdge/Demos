// Component for a page wrapper -- includes an h1 for page title and a slot for each custom component.
// See page-view-example.html for usage eaxmple.
// Has a public API `getId()` that returns this page's unique ID, set via page-id attribute.

class PageView extends HTMLElement {
  #id;

  constructor() {
    super();

    const pageViewTemplate = document.createElement("template");
    pageViewTemplate.innerHTML = `
    <link rel="stylesheet" href="../styles/defaults.css" />
    <style>
      #title {
        text-align: center;
      }
    </style>

    <h1 id="title">${this.getAttribute("title")}</h1>
    <slot name="text">My Default Text</slot>`;

    // Create a shadow root
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(pageViewTemplate.content.cloneNode(true));

    // Set the id field based on the id attribute
    this.#id = this.getAttribute("page-id");
  }

  get pageId() {
    return this.#id;
  }
}

// Define the new element
customElements.define("page-view", PageView);
