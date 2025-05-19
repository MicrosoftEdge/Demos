// Call createSpinner() to create the spinner element.
// Make sure to include the spinner.css file in your HTML file.
// To show the spinner, append the element returned by createSpinner() to the DOM.
// To hide the spinner, remove it from the DOM.

function createSpinner(id) {
  // <div class="progress">
  //   <div class="spinner">
  //     <div class="start">
  //       <div class="indicator"></div>
  //     </div>
  //     <div class="end">
  //       <div class="indicator"></div>
  //     </div>
  //   </div>
  // </div>
  
  const spinner = document.createElement("div");
  spinner.className = "progress";
  const spinnerEl = document.createElement("div");
  spinnerEl.className = "spinner";
  const startEl = document.createElement("div");
  startEl.className = "start";
  const startIndicatorEl = document.createElement("div");
  startIndicatorEl.className = "indicator";
  startEl.appendChild(startIndicatorEl);
  const endEl = document.createElement("div");
  endEl.className = "end";
  const endIndicatorEl = document.createElement("div");
  endIndicatorEl.className = "indicator";
  endEl.appendChild(endIndicatorEl);
  spinnerEl.appendChild(startEl);
  spinnerEl.appendChild(endEl);
  spinner.appendChild(spinnerEl);

  if (id) {
    spinner.id = id;
  }

  return spinner;
}
