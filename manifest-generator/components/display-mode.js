// Component for a images as radio buttons.
/*
  Usage:
  <display-mode></display-mode>

*/

const template = document.createElement("template");
template.innerHTML = `
    <link rel="stylesheet" href="../styles/defaults.css" />
    <style>
    .table-item {
            align-self: center;
    }

    .table {
            display: flex;
            flex-direction: column;
          }

    .item-label {
        align-self: left;
        margin-left: 20px;
    }

    .radio-button {
    margin: 10px;
    cursor: pointer;
    }

    .radio-button img {
        width: 100px; /* Adjust the image size as needed */
        border: 2px solid transparent;
        padding: 5px;
    }
    
    .radio-button input[type="radio"] {
        display: none; /* Hide the default radio button input */
    }
    
    .radio-button input[type="radio"]:checked + img {
        border-color: blue; /* Style the selected image */
        border-radius: 5px;
    }

    .label-radio-container {
        display:inline-block;
        align-self:center;
    }
    </style>

    <div class="table">
        <div class="label-radio-container">
            <label class="item-label">minimal-ui</label>
            <div class="table-item">
                <label class="radio-button">
                    <input type="radio" name="radio-group" value="minimal-ui">
                        <img src="../icons/48X48.png" alt="minimal-ui">
                </label>
            </div>
        </div>
        <div class="label-radio-container">
            <label class="item-label">standalone</label>
            <div class="table-item">
                <label class="radio-button">
                    <input type="radio" name="radio-group" value="standalone">
                    <img src="../icons/48X48.png" alt="standalone">
                </label>
            </div>
        </div>
        <div class="label-radio-container">
            <label class="item-label">fullscreen</label>
            <div class="table-item">
                <label class="radio-button">
                    <input type="radio" name="radio-group" value="fullscreen">
                    <img src="../icons/48X48.png" alt="fullscreen">
                </label>
            </div>
        </div>
        <div class="label-radio-container">
            <label class="item-label">browser</label>
            <div class="table-item">
                <label class="radio-button">
                    <input type="radio" name="radio-group" value="browser">
                    <img src="../icons/48X48.png" alt="browser">
                </label>
            </div>
        </div>
    </div>
`;

class DisplayMode extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  getUserInput() {
    const inputElement = this.shadowRoot.querySelector(
      "input[type='radio']:checked"
    );
    if (inputElement) {
      return inputElement.value;
    }
    return;
  }
}

// Define the new element
customElements.define("display-mode", DisplayMode);
