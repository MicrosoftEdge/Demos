import styles from "./highlighted-text-snippet.css" assert { type: "css" };

const template = document.createElement('template');
template.innerHTML = `
<li class="snippet">
  <q class="text"><slot></slot></q>
  <button class="delete">Delete</button>
</li>`;

class HighlightedTextSnippet extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadowRoot.adoptedStyleSheets = [styles];
  }

  connectedCallback() {
    this.shadowRoot.querySelector('.delete').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent("delete", { bubbles: true }));
    });

    this.shadowRoot.querySelector('.text').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent("scroll", { bubbles: true }));
    });
  }
}

customElements.define("highlighted-text-snippet", HighlightedTextSnippet);
