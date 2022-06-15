import styles from "./text-snippet.css" assert { type: "css" };

const template = document.createElement('template');
template.innerHTML = `
<li class="snippet">
  <q class="text" part="text"><slot></slot></q>
  <button class="delete" part="delete">Delete</button>
</li>`;

class TextSnippet extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadowRoot.adoptedStyleSheets = [styles];
  }

  connectedCallback() {
    this.shadowRoot.querySelector('.delete').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent("snippet-deleted", { bubbles: true }));
    });

    this.shadowRoot.querySelector('.text').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent("snippet-clicked", { bubbles: true }));
    });
  }
}

customElements.define("text-snippet", TextSnippet);
