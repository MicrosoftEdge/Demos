// Component for a simple text input field. Optional attributes for a label and placeholder text.
// See simple-text-input-example.html for usage examples.

class SimpleTextInput extends HTMLElement {
  #inputElement;
  constructor() {
    super();

    // Create a shadow root
    const shadow = this.attachShadow({ mode: "open" });

    const tableWrapper = document.createElement("div");
    tableWrapper.setAttribute("class", "table");

    // Create the page label
    const inputLabel = document.createElement("p");
    inputLabel.setAttribute("class", "table-item");
    if (this.getAttribute("label")) {
      inputLabel.textContent = `${this.getAttribute("label")}`;
    } else {
      inputLabel.setAttribute("hidden", true);
    }

    // Create the input element
    this.#inputElement = document.createElement("input");
    this.#inputElement.setAttribute("class", "table-item");
    if (this.getAttribute("placeholder-text")) {
      this.#inputElement.setAttribute(
        "placeholder",
        `${this.getAttribute("placeholder-text")}`
      );
    }

    // Style the elements
    const style = document.createElement("style");
    style.textContent = `.table-item {
      align-self: center;
    }
  
    .table {
      display: flex;
      flex-direction: column;
    }`;

    // Import stylesheets
    const stylesheetDefault = document.createElement("link");
    stylesheetDefault.setAttribute("rel", "stylesheet");
    stylesheetDefault.setAttribute("href", "../styles/defaults.css");

    const stylesheetInput = document.createElement("link");
    stylesheetInput.setAttribute("rel", "stylesheet");
    stylesheetInput.setAttribute("href", "../styles/input.css");

    // Append the text and input elements to the table
    tableWrapper.append(inputLabel);
    tableWrapper.append(this.#inputElement);

    // Append the table and style to the shadow DOM
    shadow.append(tableWrapper);
    shadow.append(style);
    shadow.append(stylesheetDefault);
    shadow.append(stylesheetInput);
  }

  getUserInput() {
    return this.#inputElement.value;
  }
}

// Define the new element
customElements.define("simple-text-input", SimpleTextInput);
