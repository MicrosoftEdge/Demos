// Component for a simple text input field. Optional attributes for a label and placeholder text.
// See simple-text-input-example.html for usage examples.

class SimpleTextInput extends HTMLElement {
  constructor() {
    super();

    // Create a shadow root
    const shadow = this.attachShadow({ mode: "open" });

    const tableWrapper = document.createElement("div");
    tableWrapper.setAttribute("class", "table");

    // Create the page label
    const inputLabel = document.createElement("p");
    inputLabel.setAttribute("class", "tableitem");
    if (this.getAttribute("label")) {
      inputLabel.textContent = `${this.getAttribute("label")}`;
    } else {
      inputLabel.setAttribute("hidden", true);
    }

    // Create the input element
    const inputElement = document.createElement("input");
    inputElement.setAttribute("class", "tableitem");
    if (this.getAttribute("placeholder-text")) {
      inputElement.setAttribute(
        "placeholder",
        `${this.getAttribute("placeholder-text")}`
      );
    }

    // Style the elements
    const style = document.createElement("style");
    style.textContent = `.tableitem {
      align-self: center;
    }
  
    .table {
      display: flex;
      flex-direction: column;
    }`;

    // Append the text and input elements to the table
    tableWrapper.append(inputLabel);
    tableWrapper.append(inputElement);

    // Append the table and style to the shadow DOM
    shadow.append(tableWrapper);
    shadow.append(style);
  }
}

// Define the new element
customElements.define("simple-text-input", SimpleTextInput);
