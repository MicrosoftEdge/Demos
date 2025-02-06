// Component for a color picker -- a text label and a color input box.
/*
  Usage:
  <color-picker label="my label" placeholder-text="my placeholder text"/>
*/
class ColorPicker extends HTMLElement {
  #inputElement;
  constructor() {
    super();
    this.#inputElement = document.createElement("input");

    // Create a shadow root
    const shadow = this.attachShadow({ mode: "open" });

    const tableWrapper = document.createElement("div");
    tableWrapper.setAttribute("class", "table");

    // Create the page label
    const inputLabel = document.createElement("p");
    inputLabel.setAttribute("class", "tableitem");
    inputLabel.textContent = `${this.getAttribute("label")}`;

    // Create the input element
    this.#inputElement.setAttribute("type", "color");
    this.#inputElement.setAttribute("class", "tableitem");

    // Style the elements
    const style = document.createElement("style");
    style.textContent = `.tableitem {
        align-self: center;
      }
    
      .table {
        display: flex;
        flex-direction: column;
      }`;

    const stylesheet = document.createElement("link");
    stylesheet.setAttribute("rel", "stylesheet");
    stylesheet.setAttribute("href", "styles/defaults.css");

    // Append the text and input elements to the table
    tableWrapper.append(inputLabel);
    tableWrapper.append(this.#inputElement);

    // Append the table and style to the shadow DOM
    shadow.append(tableWrapper);
    shadow.append(style);
    shadow.append(stylesheet);
  }

  getUserInput() {
    return this.#inputElement.value;
  }
}

// Define the new element
customElements.define("color-picker", ColorPicker);
