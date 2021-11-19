class CSSPlayground extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({
      mode: 'open'
    });

    this.divEl = document.createElement('div');
    this.divEl.classList.add('a');
    shadowRoot.appendChild(this.divEl);

    this.styleSheet = new CSSStyleSheet();
    shadowRoot.adoptedStyleSheets = [this.styleSheet];

    this.cssText = '';
    this.bgColor = '';
  }

  set color(bgColor) {
    this.bgColor = bgColor;
    this.refresh();
  }

  get color() {
    return this.bgColor;
  }

  set css(cssText) {
    this.cssText = cssText;
    this.refresh();
  }

  get css() {
    return this.cssText;
  }

  refresh() {
    const txt = `.a{--bg-color:${this.bgColor};}${this.cssText}`;
    this.styleSheet.replaceSync(txt);
  }
}

customElements.define('css-playground', CSSPlayground);
